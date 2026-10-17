import { contactCategories, parseContactData } from '../_shared/contact.ts';

type ContactConfig = { apiKey: string; from: string; supabaseUrl: string; serviceKey: string; origins: string[] };
const unavailable = '현재 문의 전송을 준비 중이에요';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createContactHandler(config: ContactConfig, fetcher: typeof fetch = fetch) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get('origin') ?? '';
    const allowed = config.origins.includes(origin);
    const headers: Record<string,string> = { 'Cache-Control': 'no-store', Vary: 'Origin' };
    if (allowed) Object.assign(headers, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'apikey, content-type',
    });
    const reply = (status: number, body: object) => Response.json(body, { status, headers });
    if (!allowed) return reply(403, { error: '허용되지 않은 요청입니다' });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return reply(405, { error: 'POST 요청만 지원합니다' });
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return reply(415, { error: 'JSON 형식으로 전송해 주세요' });

    let data;
    let requestId: string;
    try {
      // Bound the body stream before parsing; do not trust Content-Length.
      const reader = request.body?.getReader();
      if (!reader) return reply(400, { error: '문의 내용을 확인해 주세요' });
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 16384) { await reader.cancel(); return reply(413, { error: '문의 내용이 너무 길어요' }); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      const input = JSON.parse(new TextDecoder().decode(bytes));
      data = parseContactData(input);
      requestId = input.requestId;
      if (typeof requestId !== 'string' || !uuid.test(requestId)) throw new Error('문의 전송 번호를 확인해 주세요');
    } catch {
      return reply(400, { error: '문의 내용을 확인해 주세요' });
    }
    if (!config.apiKey || !config.from || !config.supabaseUrl || !config.serviceKey) return reply(503, { error: unavailable });

    // The hosted Supabase gateway supplies X-Forwarded-For; fail closed if missing.
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    if (!ip) return reply(503, { error: unavailable });
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${config.serviceKey}:${ip}`));
    const ipHash = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
    try {
      const limit = await fetcher(`${config.supabaseUrl}/rest/v1/rpc/consume_landing_contact_limit`, {
        method: 'POST',
        headers: { apikey: config.serviceKey, Authorization: `Bearer ${config.serviceKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_ip_hash: ipHash }),
        signal: AbortSignal.timeout(5000),
      });
      if (!limit.ok) return reply(503, { error: unavailable });
      const permitted: unknown = await limit.json();
      if (permitted === false) return reply(429, { error: '잠시 후 다시 시도해 주세요' });
      if (permitted !== true) return reply(503, { error: unavailable });
    } catch { return reply(503, { error: unavailable }); }

    const category = contactCategories.find(option => option.value === data.category)!;
    try {
      const response = await fetcher('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `landing-contact/${requestId}` },
        body: JSON.stringify({
          from: config.from,
          to: ['kickon.offical@gmail.com'],
          reply_to: data.email,
          subject: `[킥온 ${category.label}] ${data.name}`,
          text: `문의 유형: ${category.label}\n이름 또는 소속: ${data.name}\n답변받을 이메일: ${data.email}\n\n${data.message}`,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) return reply(502, { error: '메일 전송을 완료하지 못했어요' });
      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id.trim()) return reply(502, { error: '메일 전송을 확인하지 못했어요' });
      return reply(200, { id: result.id });
    } catch { return reply(502, { error: '메일 전송을 확인하지 못했어요' }); }
  };
}
