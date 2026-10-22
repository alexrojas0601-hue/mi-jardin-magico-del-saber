// Worker de Cloudflare: sirve el libro (carpeta public/) y el Guardián (/api/guardian).
// El Guardián solo se enciende si el secreto ANTHROPIC_API_KEY está configurado en Cloudflare.
import { construirPrompt } from '../public/js/guardian.js';

const GRADOS = ['Transición', '1.°', '2.°', '3.°'];
const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

async function guardian(request, env) {
  if (request.method === 'GET') return json({ ok: Boolean(env.ANTHROPIC_API_KEY) });
  if (request.method !== 'POST') return json({ code: 'invalid_request' }, 405);
  if (!env.ANTHROPIC_API_KEY) return json({ code: 'not_granted' }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ code: 'invalid_request' }, 400); }
  const tarea = body.tarea === 'preguntas' ? 'preguntas' : 'comentario';
  const grado = GRADOS.includes(body.grado) ? body.grado : '1.°';
  const respuesta = String(body.respuesta || '').slice(0, 2000);
  if (tarea === 'comentario' && respuesta.trim().length < 3) return json({ code: 'invalid_request' }, 400);

  const datos = await env.ASSETS.fetch(new URL('/data/cuentos.json', request.url)).then((r) => r.json());
  const cuento = datos.cuentos.find((c) => c.id === body.cuentoId);
  if (!cuento) return json({ code: 'invalid_request' }, 404);

  const { prompt, json: esJson } = construirPrompt({ tarea, cuento, grado, consigna: String(body.consigna || ''), respuesta });
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: env.MODELO || 'claude-haiku-5-5', max_tokens: 700, messages: [{ role: 'user', content: prompt }] }),
  });
  if (r.status === 429) return json({ code: 'rate_limited' }, 429);
  if (!r.ok) return json({ code: 'upstream_error' }, 502);
  const data = await r.json();
  const texto = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
  if (!texto) return json({ code: 'empty_completion' }, 502);

  if (!esJson) return json({ texto });
  const ini = texto.indexOf('['); const fin = texto.lastIndexOf(']');
  try { return json({ preguntas: JSON.parse(texto.slice(ini, fin + 1)) }); }
  catch { return json({ code: 'invalid_json' }, 502); }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/guardian') return guardian(request, env);
    return env.ASSETS.fetch(request);
  },
};
