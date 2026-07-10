# Dataset — Auto-école / Code de la route

Dataset complet pour l'application d'apprentissage du code de la route
(contexte **Sénégal**). Il couvre trois piliers : les **panneaux**, les
**examens blancs** (QCM photo) et le **cours** (fiches + QCM de connaissance).

## Contenu

| Fichier | Contenu | Volume |
|---|---|---|
| `my-autoecole/src/data/panneaux.json` | Catalogue des panneaux (code officiel, nom, catégorie, image) | 290 panneaux, 13 catégories |
| `my-autoecole/public/panneaux/*.jpeg` | Images des panneaux (une par entrée, nommées par `id`) | 290 images (~2,3 Mo) |
| `my-autoecole/src/data/tests.json` | 12 séries d'examens blancs, 25 questions chacune, avec corrigés | 12 séries, 300 questions |
| `my-autoecole/src/data/cours.json` | 19 thèmes de cours + banque de 50 QCM de connaissance | 19 thèmes, 50 questions |
| `my-autoecole/src/data/index.ts` | Point d'entrée **typé** (types + helpers) | — |

### Panneaux

Extraits du PDF `courses/liste_panneaux.pdf` (pages 7-15, 24, 29, 33, 39).
Chaque image découpée (`images_extraites/pageX_imgN.jpeg`) a été associée à son
label officiel par **lecture visuelle des pages** puis mise en correspondance
spatiale (ordre de lecture ligne par ligne). Catégories :

danger (29) · intersection et priorité (9) · interdiction (46) · obligation (18) ·
entrée de zone (10) · fin de prescription / sortie de zone (27) · indication (60) ·
services CE (6) · localisation et bornes (19) · signalisation directionnelle (24) ·
balise (14) · passage à niveau (4) · signalisation temporaire / chantier (24).

Les variantes d'un même code sont dédoublées via un `id` suffixé
(ex. `B14-50`, `B14-130`, `C14-1`… `C14-4`).

### Tests (examens blancs)

Issus de `tests/B01…B12/` (images des questions) et de `bonnes-reponses(1).txt`
(corrigés `b1…b12`). Chaque question présente une **scène photo** avec des
sous-questions A/B/C/D ; `answers` liste les lettres correctes (ex. `["B","D"]`).

> **Note images des tests** : les 120 Mo d'images ne sont **pas** copiés dans
> `public/`. Le manifeste `tests.json` référence leur chemin sous `tests/`.
> Pour les servir dans l'app, copier le dossier :
> `cp -r tests my-autoecole/public/tests` (ou créer un lien), puis les chemins
> `tests/B01/…` seront résolus depuis `/public`.

### Cours

Extrait des 30 fiches `courses/WhatsApp Image ….jpeg` (analyse visuelle).
Thèmes couverts : règles générales & permis B, limites de vitesse (Sénégal),
catégories de panneaux, priorités, feux du véhicule, marquages au sol,
dépassement, tourner à gauche, stationnement, balises, autoroute, distances
(sécurité / freinage / arrêt), conduite en cas d'accident, suspension du permis,
pièces du véhicule, gestes des agents, dérapage, poste de conduite & démarrage,
créneau.

## Utilisation dans l'app

```ts
import dataset, {
  panneaux, panneauxParCategorie, categories,
  series, serieById,
  themes, quizCours, quizParTheme,
} from "./data";

console.log(dataset.stats);
// { panneaux: 290, categories: 13, seriesTest: 12,
//   questionsTest: 300, themesCours: 19, questionsCours: 50 }
```

Types de challenges possibles à partir du dataset :

- **Reconnaissance** : afficher une image de panneau → deviner le nom (QCM 4 choix).
- **Reconnaissance inverse** : une description → choisir la bonne image.
- **Catégorie** : à quelle famille appartient ce panneau ?
- **Intrus** : trouver le panneau qui n'appartient pas à la catégorie.
- **Flashcards** : révision code ↔ image ↔ signification.
- **Examen blanc** : rejouer les séries `B01…B12` avec correction automatique.
- **QCM de cours** : questions de connaissance (`cours.json`), simple ou multi-réponses.

## Régénérer le dataset

Prérequis : le venv `.venv` avec `pymupdf` et `pillow`
(`.venv/Scripts/python -m pip install pymupdf pillow`).

```bash
.venv/Scripts/python scripts/build_panneaux.py   # -> panneaux.json + public/panneaux/*
.venv/Scripts/python scripts/build_tests.py      # -> tests.json
# cours.json est édité à la main (contenu curé)
```
