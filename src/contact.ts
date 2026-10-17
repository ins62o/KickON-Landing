import type { ContactData } from '../supabase/functions/_shared/contact.ts';
export { contactCategories, parseContactData } from '../supabase/functions/_shared/contact.ts';
export type { ContactData } from '../supabase/functions/_shared/contact.ts';

export async function sendContact(
  config: { url: string; publishableKey: string },
  data: ContactData,
  requestId: string,
  fetcher: typeof fetch = fetch,
): Promise<string> {
  if (!config.url || !config.publishableKey) throw new Error('현재 문의 전송을 준비 중이에요 · 잠시 후 다시 이용해 주세요');
  let response: Response;
  try {
    response = await fetcher(`${config.url.replace(/\/$/, '')}/functions/v1/landing-contact`, {
      method: 'POST',
      headers: { apikey: config.publishableKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, requestId }),
      signal: AbortSignal.timeout(25000),
    });
  } catch (cause) {
    throw new Error('전송 결과를 확인하지 못했어요 · 네트워크를 확인하고 다시 시도해 주세요', { cause });
  }
  if (response.status === 429) throw new Error('문의가 여러 번 접수되었어요 · 잠시 후 다시 시도해 주세요');
  if ([401, 404, 503].includes(response.status)) throw new Error('현재 문의 전송을 준비 중이에요 · 잠시 후 다시 이용해 주세요');
  if (!response.ok) throw new Error('문의를 전송하지 못했어요 · 작성한 내용은 유지되니 다시 시도해 주세요');
  let result: unknown;
  try { result = await response.json(); }
  catch (cause) { throw new Error('전송 결과를 확인하지 못했어요 · 같은 내용으로 다시 시도해 주세요', { cause }); }
  if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id.trim()) throw new Error('전송 결과를 확인하지 못했어요 · 같은 내용으로 다시 시도해 주세요');
  return result.id;
}
