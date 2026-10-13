import type { Topic } from '../../types';

export default {
  id: 'flujo-basico',
  icon: '📸',
  title: 'Flujo básico: add y commit',
  description:
    'El ciclo diario: modificas archivos, revisas qué cambió (status, diff), eliges qué guardar (add) y lo guardas en el historial con un mensaje (commit). Con log ves el historial y con .gitignore excluyes lo que no debe subirse.',
  tip: 'Haz commits pequeños y frecuentes: cada uno debería representar UN cambio con sentido ("añadir validación del email"), no "cambios del martes".',

  snippets: [
    {
      title: 'El ciclo de trabajo',
      lang: 'bash',
      code: `git status                    # ¿qué archivos cambiaron?
git diff                      # ¿qué líneas cambiaron? (aún sin preparar)

git add index.html            # preparar un archivo
git add src/                  # preparar una carpeta
git add .                     # preparar todo
git add -p                    # preparar por trozos (revisas cada cambio) ⭐

git diff --staged             # ¿qué va a entrar en el commit?

git commit -m "feat: añadir formulario de contacto"
git commit -am "fix: corregir typo"   # add + commit de archivos YA seguidos (no los nuevos)`,
    },
    {
      title: 'Leer el estado',
      lang: 'text',
      code: `$ git status -sb
## main...origin/main [ahead 1]        ← tienes 1 commit sin subir
 M src/app.ts                           ← modificado, NO preparado
M  src/utils.ts                         ← modificado y preparado
A  src/new-file.ts                      ← nuevo y preparado
?? notes.txt                            ← nuevo y sin seguir (untracked)
 D old.css                              ← borrado

Columna izquierda = área de preparación · Columna derecha = directorio de trabajo`,
    },
    {
      title: 'Ver el historial',
      lang: 'bash',
      code: `git log                                   # historial completo
git log --oneline                         # una línea por commit
git log --oneline --graph --all           # con el dibujo de las ramas ⭐
git log -5 --stat                         # últimos 5 con los archivos cambiados
git log -p src/app.ts                     # cambios de un archivo concreto
git log --author="Ana" --since="2 weeks"  # filtrar por autor y fecha
git log --grep="login"                    # buscar en los mensajes

git show a1b2c3d                          # ver un commit concreto
git show HEAD~2:src/app.ts                # un archivo tal como estaba hace 2 commits`,
    },
    {
      title: '.gitignore: archivos que Git debe ignorar',
      lang: 'text',
      code: `# Dependencias
node_modules/
.venv/
__pycache__/

# Builds
dist/
build/
*.log

# Variables de entorno y secretos (¡NUNCA al repositorio!)
.env
.env.*
!.env.example        ← el "!" hace una excepción: este SÍ se sube

# Sistema y editores
.DS_Store
Thumbs.db
.vscode/
.idea/

# ¿Ya subiste algo por error? Deja de seguirlo (sin borrarlo de tu disco):
#   git rm --cached .env
#   git commit -m "chore: dejar de seguir .env"`,
    },
  ],
} satisfies Topic;
