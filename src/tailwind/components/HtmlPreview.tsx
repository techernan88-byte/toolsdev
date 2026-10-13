import { cx } from '../../utils/cx';
import DemoCanvas from '../../components/ui/DemoCanvas';

interface HtmlPreviewProps {
  html: string;
  className?: string;
  /** Clase de ancho máximo para simular móvil / tablet / escritorio */
  viewport?: string;
}

/**
 * Renderiza un string HTML (el mismo que se muestra como código).
 * @container permite usar variantes @xl:, @3xl:… según el ancho de la vista previa.
 */
export default function HtmlPreview({ html, className, viewport }: HtmlPreviewProps) {
  return (
    <DemoCanvas className={cx('overflow-auto p-6', className)}>
      <div
        className={cx('@container mx-auto w-full transition-[max-width] duration-300', viewport)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </DemoCanvas>
  );
}
