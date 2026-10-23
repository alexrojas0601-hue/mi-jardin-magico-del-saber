// Servidor de prueba: sirve public/ y el libro desde contenido/libro.json (no está en git),
// con la misma codificación que el Worker. Uso: node scripts/servidor-local.mjs [puerto]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { randomUUID } from 'node:crypto';

const RAIZ = new URL('../public/', import.meta.url).pathname;
const LIBRO = JSON.parse(await readFile(new URL('../contenido/libro.json', import.meta.url), 'utf8'));
const SAL = 'JardinMagico-CENTEC-lectura-en-pantalla';
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };

function codificar(obj) {
  const n = randomUUID().replace(/-/g, '').slice(0, 12);
  const d = Buffer.from(JSON.stringify(obj), 'utf8'); const k = Buffer.from(n + SAL, 'utf8');
  for (let i = 0; i < d.length; i++) d[i] ^= k[i % k.length] ^ ((i * 31) & 255);
  return { n, d: d.toString('base64') };
}
const indice = { unidades: LIBRO.unidades, paginas: LIBRO.paginas.map(({ orden, id, unidad, tipo, titulo }) => ({ orden, id, unidad, tipo, titulo })) };

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const enviar = (code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
  if (url.pathname === '/api/guardian') return enviar(200, { ok: false });
  if (url.pathname === '/api/voz') {
    // Prueba local: medio segundo de silencio en WAV (la voz real la genera Cloudflare).
    if (url.searchParams.get('estado') === '1') return enviar(200, { ok: process.env.VOZ_LOCAL !== '0' });
    if (process.env.VOZ_LOCAL === '0') return enviar(503, { code: 'sin_voz' });
    const n = 11025; const b = Buffer.alloc(44 + n * 2);
    b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
    b.writeUInt32LE(22050, 24); b.writeUInt32LE(44100, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40);
    res.writeHead(200, { 'content-type': 'audio/wav' }); return res.end(b);
  }
  if (url.pathname.startsWith('/api/libro/')) {
    if (req.headers['x-jardin'] !== 'lector') return enviar(403, { code: 'solo_lectura_en_pantalla' });
    const r = url.pathname.slice(11);
    if (r === 'indice') return enviar(200, codificar(indice));
    const p = LIBRO.paginas.find((x) => 'pagina/' + x.id === r);
    return p ? enviar(200, codificar(p)) : enviar(404, { code: 'no_existe' });
  }
  const ruta = normalize(join(RAIZ, url.pathname === '/' ? 'index.html' : url.pathname));
  if (!ruta.startsWith(RAIZ)) { res.writeHead(403); return res.end(); }
  try { const b = await readFile(ruta); res.writeHead(200, { 'content-type': TIPOS[extname(ruta)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end('no'); }
}).listen(+process.argv[2] || 8787, () => console.log('Libro local en http://localhost:' + (+process.argv[2] || 8787)));
