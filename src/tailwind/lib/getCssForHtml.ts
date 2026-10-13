/**
 * Busca en las hojas de estilo de la página el CSS real que Tailwind
 * generó para cada clase usada en un HTML. Sirve para aprender
 * qué hace cada clase "por debajo".
 */

/** Todas las clases únicas de los atributos class="..." */
const extractClasses = (html: string) => [
  ...new Set(
    [...html.matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/)).filter(Boolean)
  ),
];

/** ¿El selector contiene exactamente esa clase (y no otra que empiece igual)? */
const selectorHasClass = (selectorText: string, escapedClass: string) => {
  let index = selectorText.indexOf(escapedClass);
  while (index !== -1) {
    const nextChar = selectorText[index + escapedClass.length];
    if (nextChar === undefined || !/[\w\-\\]/.test(nextChar)) return true;
    index = selectorText.indexOf(escapedClass, index + 1);
  }
  return false;
};

/** Recorre reglas (entrando en @media, @layer...) y guarda las que usan la clase. */
const collectRules = (rules: CSSRuleList, escapedClass: string, wrappers: string[], found: string[]) => {
  for (const rule of rules) {
    if (rule instanceof CSSStyleRule) {
      if (selectorHasClass(rule.selectorText, escapedClass)) {
        found.push(wrappers.map((w) => `${w}{`).join('') + rule.cssText + '}'.repeat(wrappers.length));
      }
    } else if (rule instanceof CSSGroupingRule) {
      // @layer no aporta información útil; @media / @supports / @container sí
      const header = rule.cssText.slice(0, rule.cssText.indexOf('{')).trim();
      const nextWrappers = header.startsWith('@layer') ? wrappers : [...wrappers, header];
      collectRules(rule.cssRules, escapedClass, nextWrappers, found);
    }
  }
};

/** Formatea CSS de una línea en varias líneas indentadas. */
const prettyCss = (css: string) => {
  let output = '';
  let depth = 0;
  const pad = () => '  '.repeat(depth);

  for (const part of css.split(/([{};])/)) {
    const text = part.trim();
    if (part === '{') {
      output += ' {\n';
      depth++;
    } else if (part === '}') {
      depth = Math.max(0, depth - 1);
      output += `${pad()}}\n`;
    } else if (part === ';') {
      output += ';\n';
    } else if (text) {
      output += pad() + text;
    }
  }
  return output.trim();
};

/** Valores de las variables del tema usadas (ej. --color-sky-500). */
const themeVariables = (css: string) => {
  const rootStyle = getComputedStyle(document.documentElement);
  const names = [...new Set([...css.matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]))];

  return names
    .filter((name) => !name.startsWith('--tw-'))
    .map((name) => [name, rootStyle.getPropertyValue(name).trim()] as const)
    .filter(([, value]) => value);
};

export function getCssForHtml(html: string) {
  const blocks = new Set<string>();

  for (const className of extractClasses(html)) {
    const escapedClass = `.${CSS.escape(className)}`;
    for (const sheet of document.styleSheets) {
      const found: string[] = [];
      try {
        collectRules(sheet.cssRules, escapedClass, [], found);
      } catch {
        continue; // hojas de otro dominio no se pueden leer
      }
      found.forEach((css) => blocks.add(prettyCss(css)));
    }
  }

  if (blocks.size === 0) return '/* No se encontró CSS para estas clases */';

  const css = [...blocks].join('\n\n');
  const variables = themeVariables(css);
  if (variables.length === 0) return css;

  const root = variables.map(([name, value]) => `  ${name}: ${value};`).join('\n');
  return `${css}\n\n/* Variables del tema usadas */\n:root {\n${root}\n}`;
}
