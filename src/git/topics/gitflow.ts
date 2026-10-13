import type { Topic } from '../../types';
import GitFlowSimulator from '../components/GitFlowSimulator';

const GITFLOW_COMMANDS = `# ═════════════ GitFlow con comandos de git "normales" ═════════════

# ── 0. Una sola vez: crear develop ──
git switch -c develop main
git push -u origin develop

# ── 1. FEATURE: nueva funcionalidad (sale de develop, vuelve a develop) ──
git switch develop && git pull
git switch -c feature/carrito
# ... commits ...
git push -u origin feature/carrito        # → Pull Request hacia develop
git switch develop
git merge --no-ff feature/carrito
git branch -d feature/carrito
git push origin develop

# ── 2. RELEASE: preparar una versión (sale de develop, va a main Y a develop) ──
git switch -c release/1.3.0 develop
npm version 1.3.0 --no-git-tag-version     # subir el número de versión
git commit -am "chore(release): 1.3.0"
# ... solo arreglos de última hora, nada de features nuevas ...
git switch main
git merge --no-ff release/1.3.0
git tag -a v1.3.0 -m "Versión 1.3.0"
git switch develop
git merge --no-ff release/1.3.0
git branch -d release/1.3.0
git push origin main develop --tags

# ── 3. HOTFIX: arreglo urgente en producción (sale de main, va a main Y a develop) ──
git switch -c hotfix/1.3.1 main
git commit -am "fix: error crítico en el pago"
git switch main
git merge --no-ff hotfix/1.3.1
git tag -a v1.3.1 -m "Hotfix 1.3.1"
git switch develop                          # (o a la release/* si hay una abierta)
git merge --no-ff hotfix/1.3.1
git branch -d hotfix/1.3.1
git push origin main develop --tags`;

export default {
  id: 'gitflow',
  icon: '🔀',
  title: 'GitFlow',
  description:
    'GitFlow es un modelo de ramas para proyectos con versiones planificadas (apps móviles, software instalable, librerías, productos con releases). Usa dos ramas permanentes (main y develop) y tres tipos de ramas temporales (feature, release y hotfix), cada una con reglas claras de dónde sale y a dónde vuelve.',
  tip: 'Pruébalo en el simulador de abajo: inicia una feature, haz commits, termínala, publica una release y lanza un hotfix. Fíjate en que release y hotfix SIEMPRE vuelven también a develop.',

  snippets: [
    {
      title: 'Las 5 ramas de GitFlow',
      lang: 'text',
      code: `RAMA         VIVE        SALE DE     SE UNE A               PARA QUÉ
───────────  ──────────  ──────────  ─────────────────────  ─────────────────────────────────────────
main         siempre     —           —                      Código EN PRODUCCIÓN. Cada merge = una versión con tag
develop      siempre     main        —                      Integración: aquí se juntan las features terminadas
feature/*    temporal    develop     develop                Una funcionalidad nueva (feature/login, feature/carrito)
release/*    temporal    develop     main + develop         Preparar una versión: subir número, arreglos finales
hotfix/*     temporal    main        main + develop*        Arreglo URGENTE de algo que ya está en producción

* Si hay una release abierta, el hotfix se une a la release (que luego llegará a develop).`,
    },
    {
      title: 'Diagrama del flujo completo',
      lang: 'text',
      code: `main     ●────────────────────────────────●──────────────────●────────────
         v1.0.0                       ╱   v1.1.0            ╱  v1.1.1
hotfix                               ╱              ●──────●
                                    ╱              ╱ (bug en producción)
release                     ●──────●              ╱
                           ╱  release/1.1.0       ╱
develop  ●──────●─────────●──────────────●───────●──────────●────────────
                 ╲       ╱                ╲                  ↑ los arreglos
feature           ●─────●                  ●───●───●        vuelven a develop
            feature/login          feature/carrito (sigue en curso)`,
    },
    {
      title: 'Todos los comandos, paso a paso',
      lang: 'bash',
      code: GITFLOW_COMMANDS,
    },
    {
      title: 'La herramienta git-flow (atajos)',
      description: 'Existe una extensión que hace todos esos pasos con un solo comando.',
      lang: 'bash',
      code: `# Instalar (git-flow AVH / git-flow-next)
brew install git-flow-avh                   # macOS
sudo apt install git-flow                   # Ubuntu / Debian
# En Windows viene incluida con Git for Windows

git flow init -d                            # configura main/develop y los prefijos por defecto

git flow feature start carrito              # = git switch -c feature/carrito develop
git flow feature publish carrito            # = git push -u origin feature/carrito
git flow feature finish carrito             # = merge --no-ff a develop + borrar la rama

git flow release start 1.3.0
git flow release finish 1.3.0               # merge a main + tag v1.3.0 + merge a develop + borrar
git push origin main develop --tags

git flow hotfix start 1.3.1
git flow hotfix finish 1.3.1                # merge a main + tag + merge a develop + borrar`,
    },
    {
      title: '¿Cuándo usar GitFlow (y cuándo no)?',
      lang: 'text',
      code: `✅ ENCAJA BIEN CUANDO…
  • Publicas versiones numeradas y planificadas (v1.3.0, v1.4.0…)
  • Mantienes varias versiones a la vez o necesitas una fase de pruebas antes de publicar
  • Apps móviles (revisión de las tiendas), software instalable, librerías, firmware
  • Equipos grandes con QA que valida cada release

❌ NO ENCAJA (mejor GitHub Flow o trunk-based) CUANDO…
  • Despliegas a producción varias veces al día (webs, APIs, SaaS)
  • Tienes CI/CD y feature flags: develop y release/* solo añaden pasos y esperas
  • El equipo es pequeño: demasiadas ramas para tan poco código

PROBLEMAS TÍPICOS
  • Ramas feature que viven semanas → conflictos enormes al integrarlas
  • Olvidar unir release/hotfix a develop → el bug "vuelve" en la siguiente versión
  • develop y main se desincronizan si alguien hace commits directos en main`,
    },
  ],

  examples: [
    {
      title: 'Simulador de GitFlow',
      level: 'estudiante',
      description:
        'Pulsa los botones en orden (feature → release → hotfix) y mira cómo crecen las ramas y qué comandos de git se ejecutarían. Pasa el ratón por un commit para ver su mensaje.',
      Component: GitFlowSimulator,
      files: [{ name: 'gitflow.sh', code: GITFLOW_COMMANDS, lang: 'bash' }],
    },
  ],
} satisfies Topic;
