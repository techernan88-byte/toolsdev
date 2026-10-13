import type { Topic } from '../../types';

export default {
  id: 'estrategias',
  icon: '🗺️',
  title: 'GitHub Flow, trunk-based y Pull Requests',
  description:
    'Alternativas más simples a GitFlow que usan la mayoría de equipos web: GitHub Flow (main + ramas cortas con Pull Request) y trunk-based development (integrar en main varias veces al día). Además: cómo es un buen Pull Request y cómo proteger main con CI.',
  tip: 'La estrategia la decide cómo despliegas: versiones planificadas → GitFlow; despliegue continuo → GitHub Flow o trunk-based.',

  snippets: [
    {
      title: 'Comparativa de estrategias',
      lang: 'text',
      code: `                    GITFLOW                 GITHUB FLOW              TRUNK-BASED
──────────────────  ──────────────────────  ───────────────────────  ─────────────────────────
Ramas permanentes   main + develop          main                     main (trunk)
Ramas temporales    feature/release/hotfix  feature (horas o días)   muy cortas (< 1 día) o ninguna
Despliegue          por versiones           al hacer merge a main    continuo, varias veces al día
Funciones a medias  esperan en su rama      esperan en su rama       se ocultan con feature flags
Ideal para          apps móviles, librerías webs, APIs, SaaS        equipos con CI/CD muy maduro
Complejidad         alta                    baja                     baja (pero exige disciplina)`,
    },
    {
      title: 'GitHub Flow paso a paso',
      lang: 'bash',
      code: `# 1. Rama desde main, actualizada
git switch main && git pull
git switch -c feat/filtro-precio

# 2. Commits pequeños y push temprano
git commit -am "feat(products): filtro por rango de precio"
git push -u origin HEAD

# 3. Abrir el Pull Request (desde la web o con GitHub CLI)
gh pr create --base main --title "feat: filtro por precio" --body "Closes #87"

# 4. CI pasa ✅ + revisión aprobada ✅ → merge (normalmente "Squash and merge")
gh pr merge --squash --delete-branch

# 5. Main se despliega automáticamente. Actualiza tu copia local:
git switch main && git pull`,
    },
    {
      title: 'Plantilla de Pull Request (.github/pull_request_template.md)',
      lang: 'text',
      code: `## ¿Qué cambia?
<!-- Resumen en 1–3 líneas -->

## ¿Por qué?
<!-- Contexto o enlace a la issue: Closes #123 -->

## ¿Cómo probarlo?
1. Ir a /productos
2. Filtrar entre 50 y 100 €
3. Comprobar que solo aparecen productos en ese rango

## Capturas
<!-- Si hay cambios visuales -->

## Checklist
- [ ] Los tests pasan (\`npm test\`)
- [ ] He añadido o actualizado tests
- [ ] He actualizado la documentación si hacía falta
- [ ] Sin console.log ni código comentado`,
    },
    {
      title: 'CI: comprobar cada Pull Request (GitHub Actions)',
      description:
        'Combínalo con "branch protection": main solo acepta merges si el CI pasa y alguien aprueba el PR.',
      lang: 'yaml',
      code: `# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build

# GitHub → Settings → Branches → Branch protection rules (main):
#  ✅ Require a pull request before merging (1 aprobación)
#  ✅ Require status checks to pass: "test"
#  ✅ Require linear history (opcional: obliga a squash/rebase)
#  ✅ Do not allow force pushes`,
    },
  ],
} satisfies Topic;
