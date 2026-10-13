import type { Topic } from '../../types';

export default {
  id: 'deshacer',
  icon: '⏪',
  title: 'Deshacer cambios',
  description:
    'Git casi nunca pierde nada: se puede descartar lo que no has guardado, corregir el último commit, deshacer commits (reset) o crear un commit que los revierte (revert). Y si todo falla, reflog guarda dónde estuvo cada rama.',
  tip: 'Regla de oro: si el commit YA está subido y otros lo tienen, usa git revert (crea un commit nuevo). reset reescribe el historial y solo es seguro en commits que nadie más tiene.',

  snippets: [
    {
      title: '¿Qué comando uso? (tabla rápida)',
      lang: 'text',
      code: `QUIERO…                                         COMANDO
──────────────────────────────────────────────  ─────────────────────────────────────
Descartar cambios de un archivo (sin add)       git restore archivo.ts
Sacar un archivo del área de preparación        git restore --staged archivo.ts
Cambiar el mensaje del último commit            git commit --amend -m "nuevo mensaje"
Añadir un archivo olvidado al último commit     git add olvidado.ts && git commit --amend --no-edit
Deshacer el último commit, conservar cambios    git reset --soft HEAD~1
Deshacer el último commit, cambios sin preparar git reset HEAD~1
Borrar el último commit Y sus cambios ⚠️        git reset --hard HEAD~1
Deshacer un commit ya subido (seguro)           git revert <hash>
Recuperar algo "perdido"                        git reflog  →  git reset --hard <hash>`,
    },
    {
      title: 'reset: --soft, --mixed y --hard',
      lang: 'text',
      code: `Historial:  A───B───C  ← HEAD (main)

git reset --soft  HEAD~1   → HEAD vuelve a B. Los cambios de C quedan PREPARADOS (staged).
git reset --mixed HEAD~1   → HEAD vuelve a B. Los cambios de C quedan en tus archivos, sin preparar.
                              (es la opción por defecto: git reset HEAD~1)
git reset --hard  HEAD~1   → HEAD vuelve a B. Los cambios de C se BORRAN de tus archivos. ⚠️

HEAD~1 = el commit anterior · HEAD~3 = tres commits atrás · también vale un hash: git reset a1b2c3d`,
    },
    {
      title: 'revert: deshacer un commit publicado sin reescribir el historial',
      lang: 'bash',
      code: `git log --oneline
# f4e5d6c (HEAD -> main, origin/main) feat: nuevo cálculo de impuestos   ← este rompió producción
# a1b2c3d fix: corregir el login

git revert f4e5d6c                 # crea un commit NUEVO que hace lo contrario
# [main 9z8y7x6] Revert "feat: nuevo cálculo de impuestos"
git push                           # seguro: no reescribe nada de lo que otros tienen

git revert -m 1 <hash-del-merge>   # revertir un commit de merge (-m 1 = conservar la rama principal)`,
    },
    {
      title: 'reflog: el "historial de todo" para recuperar commits',
      lang: 'bash',
      code: `# Hiciste git reset --hard y perdiste commits… ¡tranquilidad!
git reflog
# 9z8y7x6 HEAD@{0}: reset: moving to HEAD~3
# f4e5d6c HEAD@{1}: commit: feat: pantalla de pagos      ← aquí estaba
# ...

git reset --hard f4e5d6c           # volver a ese punto
# o recuperarlo en una rama nueva:
git switch -c rescate f4e5d6c

# Recuperar una rama borrada: búscala en el reflog y crea la rama en ese hash
git reflog | grep "feature/login"`,
    },
  ],
} satisfies Topic;
