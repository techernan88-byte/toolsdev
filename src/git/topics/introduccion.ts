import type { Topic } from '../../types';

export default {
  id: 'introduccion',
  icon: '🌱',
  title: '¿Qué es Git? Instalación',
  description:
    'Git es un sistema de control de versiones: guarda el historial de cambios de tu proyecto, te deja volver atrás, trabajar en paralelo con ramas y colaborar con otras personas. GitHub, GitLab o Bitbucket son servicios que alojan repositorios Git en la nube.',
  tip: 'Git ≠ GitHub. Git es la herramienta que usas en tu ordenador; GitHub es una web donde subes tus repositorios para compartirlos y colaborar.',

  snippets: [
    {
      title: 'Las tres zonas de Git',
      description: 'Entender esto es la clave de todo lo demás.',
      lang: 'text',
      code: `  DIRECTORIO DE TRABAJO        ÁREA DE PREPARACIÓN          REPOSITORIO
  (tus archivos)               (staging / index)           (historial de commits)
 ┌──────────────────┐         ┌──────────────────┐        ┌──────────────────┐
 │  editas archivos │ ──────► │ eliges qué va en │ ─────► │  foto permanente │
 │                  │ git add │  el próximo      │  git   │  con mensaje,    │
 │                  │         │  commit          │ commit │  autor y fecha   │
 └──────────────────┘         └──────────────────┘        └──────────────────┘
          ▲                                                         │
          └──────────────── git restore / git switch ───────────────┘

           REPOSITORIO LOCAL  ◄── git pull ───  REPOSITORIO REMOTO (GitHub)
                              ─── git push ──►`,
    },
    {
      title: 'Instalar Git y configurarlo (una sola vez)',
      lang: 'bash',
      code: `# Instalar
winget install --id Git.Git      # Windows
brew install git                 # macOS
sudo apt install git             # Ubuntu / Debian

git --version

# Tu identidad: aparece en cada commit
git config --global user.name "Ana García"
git config --global user.email "ana@mail.com"

# Configuración recomendada
git config --global init.defaultBranch main      # rama principal "main"
git config --global core.editor "code --wait"    # VS Code como editor
git config --global pull.rebase false            # pull = fetch + merge
git config --global core.autocrlf input          # saltos de línea (true en Windows)

# Ver toda la configuración
git config --list --show-origin`,
    },
    {
      title: 'Crear un repositorio o clonar uno existente',
      lang: 'bash',
      code: `# Opción 1: empezar un proyecto nuevo
mkdir mi-proyecto && cd mi-proyecto
git init                        # crea la carpeta oculta .git (ahí vive TODO el historial)

# Opción 2: descargar un proyecto que ya existe
git clone https://github.com/usuario/proyecto.git
git clone git@github.com:usuario/proyecto.git mi-carpeta   # con SSH y otro nombre`,
    },
    {
      title: 'Alias útiles (~/.gitconfig)',
      lang: 'ini',
      code: `[alias]
  st = status -sb
  co = checkout
  sw = switch
  br = branch -vv
  cm = commit -m
  last = log -1 HEAD --stat
  lg = log --graph --oneline --decorate --all
  undo = reset --soft HEAD~1
  unstage = restore --staged

# Uso: git st · git lg · git cm "mensaje" · git undo`,
    },
  ],
} satisfies Topic;
