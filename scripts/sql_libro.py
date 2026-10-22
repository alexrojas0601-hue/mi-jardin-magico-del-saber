#!/usr/bin/env python3
"""Convierte contenido/libro.json en contenido/libro.sql para la base D1 «jardin-magico-libro».

Subir (necesita una sesión de Cloudflare con permiso sobre la cuenta):
  npx wrangler d1 execute jardin-magico-libro --remote --file contenido/libro.sql
"""
import json, sys

src = sys.argv[1] if len(sys.argv) > 1 else 'contenido/libro.json'
dst = sys.argv[2] if len(sys.argv) > 2 else 'contenido/libro.sql'
d = json.load(open(src, encoding='utf-8'))
q = lambda s: "'" + str(s).replace("'", "''") + "'"
out = ['DELETE FROM paginas;', 'DELETE FROM meta;']
out.append(f"INSERT INTO meta (clave, valor) VALUES ('unidades', {q(json.dumps(d['unidades'], ensure_ascii=False))});")
for p in d['paginas']:
    out.append('INSERT INTO paginas (orden, id, unidad, tipo, titulo, datos) VALUES ({}, {}, {}, {}, {}, {});'.format(
        int(p['orden']), q(p['id']), q(p['unidad']), q(p['tipo']), q(p['titulo']), q(json.dumps(p, ensure_ascii=False))))
open(dst, 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(f'✓ {len(d["paginas"])} páginas → {dst}')
