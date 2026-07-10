# -*- coding: utf-8 -*-
"""
Construit le manifeste des series de tests (examens blancs) a partir de :
  - tests/B01..B12/   -> images des questions (B{n}-{NN}.JPG) + couverture
  - bonnes-reponses(1).txt -> corriges (b1..b12), 25 reponses par serie

Format d'une reponse : chaine de lettres parmi A/B/C/D (ex: 'BD' -> ['B','D']).
Chaque question comporte les sous-questions A,B,C,D dont certaines sont vraies.

Sortie : my-autoecole/src/data/tests.json
Les images ne sont PAS copiees (120 Mo) : on reference leur chemin relatif
sous `tests/` ; il suffit de servir ce dossier (voir dataset/README).
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TESTS_DIR = os.path.join(ROOT, "tests")
ANSWERS = os.path.join(ROOT, "bonnes-reponses(1).txt")
OUT_JSON = os.path.join(ROOT, "my-autoecole", "src", "data", "tests.json")


def parse_answers():
    txt = open(ANSWERS, encoding="utf-8").read()
    keys = {}
    for m in re.finditer(r"b(\d+)\s*:\s*\[([^\]]*)\]", txt):
        n = int(m.group(1))
        letters = re.findall(r"'([^']*)'", m.group(2))
        keys[n] = [list(x) for x in letters]  # 'BD' -> ['B','D']
    return keys


def find_question_image(series_dir, n, q):
    """Trouve le fichier image de la question q (1..25) de la serie n."""
    for name in os.listdir(series_dir):
        m = re.match(rf"^B{n}-0*{q}(\.[a-zA-Z]+)$", name)
        if m:
            return name
    return None


def find_cover(series_dir):
    for name in os.listdir(series_dir):
        if "couv" in name.lower():
            return name
    return None


def main():
    keys = parse_answers()
    series = []
    for n in range(1, 13):
        sdir = os.path.join(TESTS_DIR, f"B{n:02d}")
        if not os.path.isdir(sdir):
            continue
        cover = find_cover(sdir)
        questions = []
        answers = keys.get(n, [])
        for q in range(1, 26):
            img = find_question_image(sdir, n, q)
            correct = answers[q - 1] if q - 1 < len(answers) else []
            questions.append({
                "n": q,
                "image": f"tests/B{n:02d}/{img}" if img else None,
                "answers": correct,
            })
        missing = [q["n"] for q in questions if q["image"] is None]
        series.append({
            "id": f"B{n:02d}",
            "title": f"Serie B{n}",
            "cover": f"tests/B{n:02d}/{cover}" if cover else None,
            "questionCount": len(questions),
            "questions": questions,
            "missingImages": missing,
        })

    payload = {
        "description": "Examens blancs - code de la route (format QCM photo A/B/C/D)",
        "note": "Chaque question presente une scene et des sous-questions A/B/C/D ; "
                "answers liste les lettres correctes.",
        "seriesCount": len(series),
        "series": series,
    }
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    total_q = sum(s["questionCount"] for s in series)
    total_missing = sum(len(s["missingImages"]) for s in series)
    print(f"OK: {len(series)} series, {total_q} questions -> {OUT_JSON}")
    if total_missing:
        for s in series:
            if s["missingImages"]:
                print(f"    {s['id']}: images manquantes pour Q{s['missingImages']}")
    else:
        print("    toutes les images de questions ont ete trouvees")


if __name__ == "__main__":
    main()
