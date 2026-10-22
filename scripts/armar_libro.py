#!/usr/bin/env python3
"""Arma el libro digital a partir del texto del libro y del material de los especialistas.

El texto del libro (© Editorial Pluma de Oro S.A.S.) NO se guarda en este repositorio público:
este script lo lee de un archivo local y escribe `contenido/libro.json` (carpeta ignorada por git),
que luego se sube a la base D1 «jardin-magico-libro».

Uso:
  python3 scripts/armar_libro.py --fuente LIBRO.txt --lotes CARPETA_LOTES [--capitulo MATERIAL.json]
"""
import argparse, glob, json, os, re, sys, unicodedata

MARCAS = [
    ('palabras', 'Palabras para crecer'),
    ('literal', 'Leo y recuerdo'),
    ('inferencial', 'Pienso y descubro'),
    ('critico', 'Opino y propongo'),
    ('reto', 'Reto en familia'),
]
EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍⃣\U0001F3FB-\U0001F3FF]')


def limpiar_linea(s):
    s = s.replace(' ', ' ').replace(' ', ' ').replace('\t', ' ')
    s = re.sub(r'\*{3,}', '**', s)
    s = re.sub(r'\*\*\s*\*\*', '', s)
    s = re.sub(r'\s{2,}', ' ', s).strip()
    if s.count('**') % 2:
        s = s.replace('**', '')
    return s


def plano(s):
    s = s.replace('**', '')
    s = EMOJI.sub('', s)
    s = s.replace(' ', ' ').replace(' ', ' ')
    s = re.sub(r'\s+', ' ', s).strip()
    return re.sub(r'\s+([.,;:!?»)])', r'\1', s)


def titulo_limpio(s):
    s = plano(s or '')
    s = re.sub(r'^(Semanas?\s*\d+\s*-\s*\d+\s*:\s*)', '', s, flags=re.I)
    s = re.sub(r'^Capítulo especial\s*:\s*', '', s, flags=re.I)
    return s.strip(' "«»✨')


def partir_numerados(v):
    partes = [x.strip() for x in re.split(r'(?:^|\s)\d+\.\s+', v) if x.strip()]
    return partes or [v.strip()]


def leer_ruta(lineas):
    ruta = {}
    for ln in lineas:
        t = plano(ln)
        for clave, marca in MARCAS:
            m = re.search(re.escape(marca) + r'[^:]*:\s*(.*)$', t)
            if m:
                v = m.group(1).strip()
                if clave == 'palabras':
                    pal = []
                    for x in re.split(r';\s*', v):
                        mm = re.match(r'^(.+?)\s*\((.+)\)\.?\s*$', x.strip())
                        if mm:
                            pal.append({'palabra': mm.group(1).strip(), 'significado': mm.group(2).strip()})
                        elif x.strip():
                            pal.append({'palabra': x.strip(), 'significado': ''})
                    ruta['palabras'] = pal
                elif clave == 'reto':
                    ruta['reto'] = v
                else:
                    ruta[clave] = partir_numerados(v)
                break
    return ruta


def norm(s):
    s = unicodedata.normalize('NFD', plano(s).lower())
    return re.sub(r'[^a-z0-9]+', ' ', ''.join(c for c in s if unicodedata.category(c) != 'Mn')).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--fuente', required=True)
    ap.add_argument('--lotes', required=True)
    ap.add_argument('--capitulo')
    ap.add_argument('--salida', default='contenido/libro.json')
    a = ap.parse_args()

    L = [''] + open(a.fuente, encoding='utf-8').read().split('\n')
    lotes = [json.load(open(f, encoding='utf-8')) for f in sorted(glob.glob(os.path.join(a.lotes, 'lote-*.json')), key=lambda f: int(re.findall(r'\d+', os.path.basename(f))[0]))]
    capitulo = {}
    if a.capitulo:
        for c in json.load(open(a.capitulo, encoding='utf-8')):
            capitulo[norm(c['titulo'])] = c

    unidades, piezas, avisos = [], [], []
    vistos = set()
    for lote in lotes:
        for u in lote['unidades']:
            clave = 'ce' if (u.get('semanas') in (None, '') and 'cap' in (u.get('titulo') or '').lower()) else u.get('semanas')
            if clave and clave not in vistos:
                vistos.add(clave)
                unidades.append({'clave': clave, 'semanas': u.get('semanas'), 'titulo': titulo_limpio(u.get('titulo')) or None, 'tema': u.get('tema') or 'jardin'})
        piezas.extend(lote['piezas'])

    paginas = []
    ids = set()
    for orden, p in enumerate(piezas, 1):
        if p['id'] in ids:
            avisos.append(f"id repetido {p['id']}")
        ids.add(p['id'])
        bruto = L[p['desde']:p['hasta'] + 1]
        corte = next((i for i, x in enumerate(bruto) if 'Ruta Lectora CENTEC' in x), None)
        texto = bruto if corte is None else bruto[:corte]
        parrafos = [limpiar_linea(x) for x in texto if plano(x)]
        unidad = p.get('unidad') or 'intro'
        d = {'id': p['id'], 'tipo': p['tipo'], 'titulo': titulo_limpio(p['titulo']), 'unidad': unidad, 'parrafos': parrafos}
        if p['tipo'] == 'cuento':
            if corte is None:
                avisos.append(f"{p['id']}: cuento sin Ruta Lectora en su rango")
            else:
                d['ruta'] = leer_ruta(bruto[corte + 1:])
                for k in ('palabras', 'literal', 'inferencial', 'critico', 'reto'):
                    if not d['ruta'].get(k):
                        avisos.append(f"{p['id']}: Ruta sin {k}")
        elif p['tipo'] == 'lectura':
            d['ruta'] = p.get('ruta') or {}
            d['rutaCreada'] = True
        if p['tipo'] in ('cuento', 'lectura'):
            mat = p
            if unidad == 'ce' and 'preguntas' not in p:
                mat = capitulo.get(norm(d['titulo']))
                if not mat:
                    avisos.append(f"{p['id']}: sin material del capítulo especial")
                    mat = {}
                else:
                    mat = {**mat, 'guiaFamilia': mat.get('guiaFamilia')}
            for k in ('voz', 'preguntas', 'brujula', 'guiaDocente', 'guiaFamilia', 'reinventar'):
                if k in mat:
                    d[k] = mat[k]
            if 'brujula' not in d and mat.get('brujula'):
                d['brujula'] = mat['brujula']
            # Comprobar que cada «dondeLoDice» esté en el texto.
            todo = plano(' '.join(parrafos))
            for i, q in enumerate(d.get('preguntas', [])):
                q.pop('id', None)
                cita = plano(q.get('dondeLoDice') or '').strip('—-«»"\' ').rstrip('.,;:!?')
                if cita and cita[:70] not in todo:
                    avisos.append(f"{p['id']} pregunta {i + 1}: «dondeLoDice» no está en el texto")
        paginas.append({'orden': orden, **d})

    # Títulos repetidos en el índice: la segunda historia con el mismo nombre lleva «II».
    vistos_t = {}
    for x in paginas:
        k = norm(x['titulo'])
        if k in vistos_t and x['tipo'] in ('cuento', 'lectura'):
            x['titulo'] = x['titulo'] + ' II'
        vistos_t[k] = True
    # Nombre oficial del libro (decisión del rector, 22-oct-2026).
    salida = json.dumps({'unidades': unidades, 'paginas': paginas}, ensure_ascii=False, indent=1)
    for viejo, nuevo in [(' a Mi Jardín Mágico', ' al Jardín Mágico'), (' de Mi Jardín Mágico', ' del Jardín Mágico'),
                         ('Mi Jardín Mágico del Saber', 'El Jardín Mágico del Saber'), ('MI JARDÍN MÁGICO DEL SABER', 'EL JARDÍN MÁGICO DEL SABER')]:
        salida = salida.replace(viejo, nuevo)
    os.makedirs(os.path.dirname(a.salida) or '.', exist_ok=True)
    open(a.salida, 'w', encoding='utf-8').write(salida)
    cuentos = sum(1 for x in paginas if x['tipo'] == 'cuento')
    lecturas = sum(1 for x in paginas if x['tipo'] == 'lectura')
    print(f"✓ {len(paginas)} páginas ({cuentos} cuentos, {lecturas} lecturas) en {len(unidades)} unidades → {a.salida}")
    for x in avisos:
        print('  ! ' + x)
    return 0


if __name__ == '__main__':
    sys.exit(main())
