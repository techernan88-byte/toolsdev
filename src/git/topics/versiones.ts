import type { Topic } from '../../types';

export default {
  id: 'versiones',
  icon: '🏷️',
  title: 'Tags, versiones y releases',
  description:
    'Un tag marca un commit concreto con un nombre permanente, normalmente una versión (v1.4.0). Con Semantic Versioning el número indica qué tipo de cambio es, y con Conventional Commits se puede generar la versión y el CHANGELOG automáticamente.',
  tip: 'Usa tags anotados (git tag -a): guardan autor, fecha y mensaje. Los tags no se suben con un push normal: añade --tags o súbelos uno a uno.',

  snippets: [
    {
      title: 'Semantic Versioning (SemVer): MAJOR.MINOR.PATCH',
      lang: 'text',
      code: `            2 . 4 . 1
            │   │   └── PATCH: arreglos compatibles             (2.4.0 → 2.4.1)
            │   └────── MINOR: funcionalidades compatibles      (2.4.1 → 2.5.0)
            └────────── MAJOR: cambios INCOMPATIBLES            (2.5.0 → 3.0.0)

Pre-releases:  3.0.0-alpha.1  →  3.0.0-beta.2  →  3.0.0-rc.1  →  3.0.0
En package.json:  "^2.4.1" acepta 2.x.x ≥ 2.4.1   ·   "~2.4.1" acepta 2.4.x ≥ 2.4.1`,
    },
    {
      title: 'Trabajar con tags',
      lang: 'bash',
      code: `git tag -a v1.4.0 -m "Versión 1.4.0: filtros y exportación a CSV"   # tag anotado en HEAD
git tag -a v1.3.2 9f8e7d6 -m "Hotfix 1.3.2"                         # en un commit concreto

git tag                         # listar
git tag -l "v1.*"               # filtrar
git show v1.4.0                 # ver el tag y su commit

git push origin v1.4.0          # subir un tag
git push origin --tags          # subir todos

git switch --detach v1.3.2      # ver el código de una versión antigua
git switch -c hotfix/1.3.3 v1.3.2   # crear una rama desde una versión

git tag -d v1.4.0                       # borrar en local
git push origin --delete v1.4.0         # borrar en el remoto

git describe --tags             # v1.4.0-3-g2a1b3c4 = 3 commits después de v1.4.0`,
    },
    {
      title: 'Publicar una release en GitHub y generar el CHANGELOG',
      lang: 'bash',
      code: `# Crear la release en GitHub a partir del tag, con notas generadas automáticamente
gh release create v1.4.0 --generate-notes
gh release create v2.0.0-rc.1 --prerelease --title "2.0.0 RC1" dist/app.zip

# Versionado automático con Conventional Commits (lee feat/fix/BREAKING CHANGE):
npx commit-and-tag-version          # calcula la versión, actualiza CHANGELOG.md, hace commit y tag
npx commit-and-tag-version --release-as minor
git push --follow-tags origin main

# Alternativas totalmente automáticas en CI: semantic-release, release-please, changesets`,
    },
    {
      title: 'Un CHANGELOG.md generado',
      lang: 'text',
      code: `# Changelog

## [1.4.0](https://github.com/acme/tienda/compare/v1.3.2...v1.4.0) (2026-10-12)

### Features
* **products:** filtro por rango de precio (#87) (a1b2c3d)
* **export:** exportar pedidos a CSV (#91) (d4e5f6a)

### Bug Fixes
* **cart:** evitar total negativo con varios cupones (#89) (b7c8d9e)

## [1.3.2](https://github.com/acme/tienda/compare/v1.3.1...v1.3.2) (2026-09-30)

### Bug Fixes
* **auth:** cerrar sesión al expirar el token (#85) (e1f2a3b)`,
    },
  ],
} satisfies Topic;
