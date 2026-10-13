import type { Topic } from '../../types';

export default {
  id: 'remotos',
  icon: '☁️',
  title: 'Repositorios remotos (GitHub)',
  description:
    'Un remoto es una copia del repositorio en un servidor (normalmente llamado "origin"). push sube tus commits, fetch descarga los de los demás sin tocar tu trabajo y pull descarga y además los integra en tu rama.',
  tip: 'Antes de empezar a trabajar cada día: git pull. Antes de subir: git pull otra vez y después git push. Así reduces los conflictos.',

  snippets: [
    {
      title: 'Subir un proyecto nuevo a GitHub',
      lang: 'bash',
      code: `# 1. Crea el repositorio vacío en github.com (sin README) y copia su URL
git remote add origin git@github.com:usuario/mi-proyecto.git
git remote -v                         # comprobar los remotos

# 2. Primer push: -u enlaza tu rama local con la remota
git push -u origin main

# A partir de ahí basta con:
git push

# Con GitHub CLI se hace todo en un paso
gh repo create mi-proyecto --public --source=. --push`,
    },
    {
      title: 'fetch, pull y push',
      lang: 'bash',
      code: `git fetch                       # descarga lo nuevo del remoto, NO toca tus archivos
git status                      # "Your branch is behind 'origin/main' by 3 commits"
git log main..origin/main       # ¿qué commits nuevos hay en el remoto?

git pull                        # fetch + merge en tu rama actual
git pull --rebase               # fetch + rebase (historial lineal, sin commit de merge)

git push                        # sube tu rama actual
git push origin feature/login   # sube una rama concreta
git push -u origin HEAD         # sube la rama actual con su mismo nombre y la enlaza

# ⚠️ Rechazado ("non-fast-forward"): alguien subió antes que tú → git pull y vuelve a intentarlo`,
    },
    {
      title: 'Autenticación con SSH (sin escribir la contraseña)',
      lang: 'bash',
      code: `# 1. Crear una clave
ssh-keygen -t ed25519 -C "ana@mail.com"

# 2. Copiar la clave PÚBLICA y pegarla en GitHub → Settings → SSH and GPG keys
cat ~/.ssh/id_ed25519.pub

# 3. Probar la conexión
ssh -T git@github.com
# Hi ana! You've successfully authenticated…

# Usa URLs SSH: git@github.com:usuario/repo.git
git remote set-url origin git@github.com:usuario/repo.git`,
    },
    {
      title: 'Contribuir a un proyecto ajeno (fork)',
      lang: 'bash',
      code: `# 1. Haz "Fork" en GitHub y clona TU copia
git clone git@github.com:tu-usuario/proyecto.git
cd proyecto

# 2. Añade el repositorio original como "upstream" para recibir sus cambios
git remote add upstream https://github.com/autor-original/proyecto.git

# 3. Trabaja en una rama
git switch -c fix/typo-readme
git commit -am "docs: corregir errata en el README"
git push -u origin fix/typo-readme
# 4. En GitHub: "Compare & pull request" hacia el repositorio original

# Mantener tu fork actualizado
git fetch upstream
git switch main
git merge upstream/main
git push`,
    },
  ],
} satisfies Topic;
