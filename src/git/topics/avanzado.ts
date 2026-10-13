import type { Topic } from '../../types';

export default {
  id: 'herramientas-avanzadas',
  icon: '🔬',
  title: 'Herramientas avanzadas',
  description:
    'Comandos que te salvan en situaciones concretas: bisect para encontrar qué commit introdujo un bug, blame para saber quién y cuándo cambió una línea, worktree para tener dos ramas abiertas a la vez, hooks para automatizar y cómo limpiar secretos del historial.',
  tip: 'git bisect convierte "esto funcionaba hace 200 commits" en unos 8 pasos: va partiendo el historial por la mitad (búsqueda binaria).',

  snippets: [
    {
      title: 'bisect: encontrar el commit que rompió algo',
      lang: 'bash',
      code: `git bisect start
git bisect bad                    # el commit actual tiene el bug
git bisect good v1.3.0            # en esta versión funcionaba

# Git te deja en un commit intermedio: pruébalo y responde
git bisect good                   # aquí funciona
git bisect bad                    # aquí falla
# ... repite (unos log2(n) pasos) ...
# → "a1b2c3d is the first bad commit"

git bisect reset                  # volver a donde estabas

# Automático: Git ejecuta el test en cada paso (exit 0 = good, otro = bad)
git bisect start HEAD v1.3.0
git bisect run npm test -- cart.test.ts`,
    },
    {
      title: 'blame, log -S y búsquedas en el historial',
      lang: 'bash',
      code: `git blame src/cart.ts                     # quién cambió cada línea y en qué commit
git blame -L 40,60 src/cart.ts            # solo unas líneas
git blame -w -C src/cart.ts               # ignora espacios y detecta código movido

git log -S "calculateTax" --oneline       # commits que AÑADIERON o QUITARON ese texto
git log -G "price\\s*\\*" --oneline         # lo mismo con una expresión regular
git log --follow -p src/cart.ts           # historial de un archivo aunque se haya renombrado

git grep "TODO" -- "*.ts"                 # buscar en los archivos del repositorio
git shortlog -sn                          # commits por autor`,
    },
    {
      title: 'worktree: dos ramas abiertas a la vez',
      description: 'Revisa un PR o arregla un hotfix sin tocar (ni hacer stash de) lo que tienes a medias.',
      lang: 'bash',
      code: `git worktree add ../tienda-hotfix hotfix/1.3.1     # otra carpeta con esa rama
git worktree add -b review/pr-42 ../tienda-pr origin/feat/filtros

cd ../tienda-hotfix                                # trabajas ahí normalmente
# ... commit, push ...

git worktree list
git worktree remove ../tienda-hotfix`,
    },
    {
      title: 'Subí un secreto (contraseña, .env) por error',
      lang: 'bash',
      code: `# 1. LO PRIMERO: revoca/rota la clave en el servicio (AWS, Stripe…).
#    Aunque la borres del historial, puede haber sido copiada ya.

# 2. Si NO lo has subido todavía: deshaz el commit
git reset --soft HEAD~1
echo ".env" >> .gitignore
git rm --cached .env

# 3. Si YA está en el remoto: reescribir el historial con git-filter-repo
pip install git-filter-repo
git filter-repo --path .env --invert-paths          # elimina .env de TODO el historial
git push origin --force --all
git push origin --force --tags
# Avisa al equipo: deben volver a clonar el repositorio.

# Prevenir: escanear secretos antes de cada commit
# gitleaks, trufflehog o el "push protection" de GitHub`,
    },
    {
      title: 'Otros comandos útiles',
      lang: 'bash',
      code: `git clean -n                     # qué archivos sin seguir se borrarían (simulación)
git clean -fd                    # borrarlos de verdad (archivos y carpetas) ⚠️

git commit --allow-empty -m "ci: relanzar el pipeline"

git log origin/main..HEAD        # commits que tienes y aún no has subido
git diff main...feature/login    # cambios de la rama desde que salió de main

git archive -o release.zip v1.4.0      # exportar una versión a un zip (sin .git)

git submodule add https://github.com/acme/ui-kit libs/ui-kit
git clone --recurse-submodules <url>   # clonar con sus submódulos

git maintenance start            # optimizaciones automáticas en repos grandes
git clone --depth 1 <url>        # clonado superficial (solo el último commit): rápido en CI`,
    },
  ],
} satisfies Topic;
