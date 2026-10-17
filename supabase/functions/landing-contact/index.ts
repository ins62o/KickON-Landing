import { createContactHandler } from './handler.ts';

Deno.serve(createContactHandler({
  apiKey: Deno.env.get('RESEND_API_KEY') ?? '',
  from: Deno.env.get('CONTACT_FROM_EMAIL') ?? '',
  supabaseUrl: Deno.env.get('SUPABASE_URL') ?? '',
  serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  origins: (Deno.env.get('CONTACT_ALLOWED_ORIGINS') ?? 'https://kickon.kr,https://www.kickon.kr').split(',').map(value => value.trim()).filter(Boolean),
}));
