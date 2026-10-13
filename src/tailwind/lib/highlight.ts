/**
 * Resaltado de sintaxis muy simple para HTML y CSS (categoría Tailwind).
 * Devuelve una lista de tokens { text, className } que CodeBlock pinta como <span>.
 */

export interface Token {
  text: string;
  className: string;
}

const COLORS = {
  tag: 'text-pink-400',
  attr: 'text-sky-300',
  value: 'text-amber-200',
  punct: 'text-zinc-500',
  text: 'text-zinc-300',
  selector: 'text-emerald-300',
  comment: 'text-zinc-500 italic',
};

type TokenType = keyof typeof COLORS;

const token = (text: string, type: TokenType): Token => ({ text, className: COLORS[type] });

/** Etiquetas, atributos y valores de un HTML. */
export function highlightHtml(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;

  for (const match of code.matchAll(/<!--[\s\S]*?-->|<\/?[^>]+>/g)) {
    tokens.push(token(code.slice(last, match.index), 'text'));
    tokens.push(...highlightTag(match[0]));
    last = match.index + match[0].length;
  }
  tokens.push(token(code.slice(last), 'text'));
  return tokens;
}

function highlightTag(tag: string): Token[] {
  if (tag.startsWith('<!--')) return [token(tag, 'comment')];

  const tokens: Token[] = [];
  // <nombre | espacios | atributo(="valor") | > o />
  for (const [, name, space, attr, value, close] of tag.matchAll(
    /(<\/?[\w-]+)|(\s+)|([^\s=>/]+)(="[^"]*")?|(\/?>)/g
  )) {
    if (name) tokens.push(token(name, 'tag'));
    if (space) tokens.push(token(space, 'text'));
    if (attr) tokens.push(token(attr, 'attr'));
    if (value) tokens.push(token('=', 'punct'), token(value.slice(1), 'value'));
    if (close) tokens.push(token(close, 'tag'));
  }
  return tokens;
}

/** CSS ya formateado (una declaración por línea). */
export function highlightCss(code: string): Token[] {
  return code.split('\n').flatMap((line) => {
    const trimmed = line.trim();
    let lineTokens: Token[];

    if (trimmed.startsWith('/*')) lineTokens = [token(line, 'comment')];
    else if (trimmed.endsWith('{') || trimmed === '}')
      lineTokens = [token(line, trimmed === '}' ? 'punct' : 'selector')];
    else {
      const colon = line.indexOf(':');
      lineTokens =
        colon === -1
          ? [token(line, 'text')]
          : [token(line.slice(0, colon), 'attr'), token(':', 'punct'), token(line.slice(colon + 1), 'value')];
    }
    return [...lineTokens, token('\n', 'text')];
  });
}
