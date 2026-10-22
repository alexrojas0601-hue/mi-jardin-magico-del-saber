#!/usr/bin/env python3
"""Cifra contenido/libro.json para que viaje dentro del Worker sin quedar legible en GitHub.

  python3 scripts/cifrar_libro.py --clave CLAVE_BASE64   → src/libro.cifrado.txt

La CLAVE (AES-256, base64) no va en el repositorio: vive en la base D1 «jardin-magico-libro»,
tabla meta, clave 'clave_libro'. Sin --clave se genera una nueva y se imprime UNA vez para guardarla en D1.
"""
import argparse, base64, gzip, json, os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ap = argparse.ArgumentParser()
ap.add_argument('--clave')
ap.add_argument('--fuente', default='contenido/libro.json')
ap.add_argument('--salida', default='src/libro.cifrado.txt')
a = ap.parse_args()
clave = base64.b64decode(a.clave) if a.clave else AESGCM.generate_key(bit_length=256)
datos = json.load(open(a.fuente, encoding='utf-8'))
plano = gzip.compress(json.dumps(datos, ensure_ascii=False, separators=(',', ':')).encode('utf-8'), 9)
nonce = os.urandom(12)
cifrado = AESGCM(clave).encrypt(nonce, plano, b'jardin-magico-del-saber')
open(a.salida, 'w').write(base64.b64encode(nonce + cifrado).decode() + '\n')
print(f'✓ {a.salida}: {os.path.getsize(a.salida) // 1024} KB cifrados')
if not a.clave:
    print('CLAVE NUEVA (guárdala en D1 → meta.clave_libro y no la subas a git):')
    print(base64.b64encode(clave).decode())
