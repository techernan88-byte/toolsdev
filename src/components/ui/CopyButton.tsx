import { useCopyToClipboard, type CopyStatus } from '../../hooks/useCopyToClipboard';
import { toolbarButton } from './styles';

const LABELS: Record<CopyStatus, string> = {
  idle: 'Copiar',
  copied: '✓ Copiado',
  error: '⚠️ No se pudo copiar',
};

/** Botón "Copiar" de las barras de los bloques de código. */
export default function CopyButton({ text }: { text: string }) {
  const { status, copy } = useCopyToClipboard();

  return (
    <button onClick={() => copy(text)} className={toolbarButton}>
      {LABELS[status]}
    </button>
  );
}
