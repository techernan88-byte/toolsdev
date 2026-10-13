import type { TailwindSection } from '../../types';
import Playground from './Playground';
import ExampleCard from './ExampleCard';
import SectionHeader from '../../components/layout/SectionHeader';
import { cx } from '../../utils/cx';

/** Página de una sección de Tailwind: intro + playground + ejemplos. */
export default function SectionView({ section }: { section: TailwindSection }) {
  const { controls, template } = section;

  return (
    <article className="space-y-10">
      <SectionHeader section={section} />

      {controls && controls.length > 0 && template && (
        <section>
          <h3 className="mb-3 text-xl font-semibold text-white">🕹️ Prueba tú mismo</h3>
          <Playground
            controls={controls}
            template={template}
            previewClass={section.previewClass}
            responsivePreview={section.responsivePreview}
          />
        </section>
      )}

      {section.examples && section.examples.length > 0 && (
        <section>
          <h3 className="mb-3 text-xl font-semibold text-white">📚 Ejemplos</h3>
          {/* wideExamples: un ejemplo por fila (útil para páginas completas) */}
          <div className={cx('grid gap-4', !section.wideExamples && 'xl:grid-cols-2')}>
            {section.examples.map((example) => (
              <ExampleCard key={example.title} example={example} responsive={section.responsivePreview} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
