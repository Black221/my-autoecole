# Déploiement sur Render.com

L'application (`my-autoecole/`) est une SPA **Vite + React** → on la déploie
comme **Static Site** sur Render. Le dépôt GitHub est déjà connecté :
`https://github.com/Black221/my-autoecole`.

## Option A — Blueprint (recommandé)

Le fichier [`render.yaml`](render.yaml) décrit tout le service.

1. Commite et pousse la config :
   ```bash
   git add render.yaml my-autoecole/.node-version DEPLOY.md
   git commit -m "chore: config de déploiement Render"
   git push
   ```
2. Sur Render : **New +** → **Blueprint**.
3. Sélectionne le dépôt `Black221/my-autoecole`.
4. Render détecte `render.yaml` → **Apply**. Le site se construit et se déploie.

À chaque `git push` sur `main`, Render redéploie automatiquement.

## Option B — Static Site manuel (sans Blueprint)

Sur Render : **New +** → **Static Site** → dépôt `Black221/my-autoecole`, puis :

| Réglage | Valeur |
|---|---|
| **Root Directory** | `my-autoecole` |
| **Build Command** | `npm ci && npm run build` |
| **Publish Directory** | `dist` |
| **Environment → NODE_VERSION** | `22.12.0` |

Puis, onglet **Redirects/Rewrites**, ajoute une règle **Rewrite** (indispensable
pour react-router) :

| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | Rewrite |

## Vérifier le build en local (facultatif)

```bash
cd my-autoecole
npm ci && npm run build   # génère dist/
npm run preview           # sert dist/ localement
```

## Notes

- **Routing SPA** : la règle de réécriture `/* → /index.html` est déjà dans
  `render.yaml`. Sans elle, un rafraîchissement sur `/play/recognition`
  renverrait une 404.
- **Assets d'examen** : `my-autoecole/public/tests/` (~120 Mo) est servi tel quel
  et embarqué dans `dist/`. Le premier déploiement est donc un peu plus long.
- **Poids du dépôt** : les dossiers sources `tests/`, `images_extraites/` et
  `courses/liste_panneaux.pdf` (à la racine) sont suivis par git mais **hors**
  du build (Render ne publie que `my-autoecole/dist`). Pour alléger le dépôt on
  peut les retirer du suivi (`git rm -r --cached tests images_extraites`) et les
  ajouter à un `.gitignore` — optionnel.
- **Node** : fixé à 22.12.0 (requis par Vite 8) via `render.yaml` et
  `my-autoecole/.node-version`.
