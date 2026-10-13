import { useState } from 'react';
import type { Level, LiveExample, Topic } from '../../types';
import SectionHeader from '../layout/SectionHeader';
import LiveExampleCard from './LiveExampleCard';
import SnippetBlock from './SnippetBlock';
import TopicIndex, { type IndexItem } from './TopicIndex';
import { LEVELS } from './LevelBadge';
import { cx } from '../../utils/cx';

type LevelFilter = Level | 'todos';

const FILTERS: { id: LevelFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  ...Object.entries(LEVELS).map(([id, { label }]) => ({ id: id as Level, label })),
];

const EXAMPLES_ID = 'ejemplos-en-vivo';

/** Ejemplos en vivo con filtro por nivel (Estudiante / Industria). */
function ExamplesSection({ examples }: { examples: LiveExample[] }) {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('todos');
  const visibleExamples = examples.filter(
    (example) => levelFilter === 'todos' || example.level === levelFilter
  );

  return (
    <section id={EXAMPLES_ID} className="scroll-mt-24">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-white">🧪 Ejemplos en vivo</h3>
        <div className="inline-flex rounded-lg bg-zinc-900 p-1 ring-1 ring-zinc-800">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setLevelFilter(filter.id)}
              className={cx(
                'rounded-md px-3 py-1 text-xs font-medium',
                levelFilter === filter.id ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-zinc-100'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {visibleExamples.map((example) => (
          <LiveExampleCard key={example.title} example={example} />
        ))}
        {visibleExamples.length === 0 && (
          <p className="text-zinc-500">No hay ejemplos de este nivel en este tema.</p>
        )}
      </div>
    </section>
  );
}

/** Página de un tema (TypeScript, React, PostgreSQL, Node, Python, Git): intro + índice + snippets + ejemplos. */
export default function TopicView({ section: topic }: { section: Topic }) {
  const snippets = topic.snippets ?? [];
  const examples = topic.examples ?? [];

  const indexItems: IndexItem[] = snippets.map((snippet, index) => ({
    id: `snippet-${index}`,
    label: snippet.title,
  }));
  if (examples.length > 0) indexItems.push({ id: EXAMPLES_ID, label: '🧪 Ejemplos en vivo' });

  return (
    <article className="space-y-10">
      <SectionHeader section={topic} />
      <TopicIndex items={indexItems} />

      {snippets.length > 0 && (
        <section>
          <h3 className="mb-3 text-xl font-semibold text-white">✂️ Snippets</h3>
          <div className="space-y-8">
            {snippets.map((snippet, index) => (
              <SnippetBlock key={snippet.title} id={`snippet-${index}`} snippet={snippet} />
            ))}
          </div>
        </section>
      )}

      {examples.length > 0 && <ExamplesSection examples={examples} />}
    </article>
  );
}
