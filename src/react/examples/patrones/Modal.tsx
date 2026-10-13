import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// createPortal renderiza el modal en document.body, fuera de su padre.
// Así evita problemas de overflow: hidden o z-index de los contenedores.

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden'; // bloquea el scroll de fondo
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-sm rounded-xl bg-zinc-900 p-6 shadow-2xl ring-1 ring-white/10"
      >
        <h3 id="modal-title" className="text-lg font-semibold text-white">
          {title}
        </h3>
        <div className="mt-2 text-sm text-zinc-400">{children}</div>
        <button onClick={onClose} className="mt-5 w-full rounded-lg bg-sky-500 py-2 font-semibold text-white">
          Entendido
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg bg-zinc-800 p-4">
      <p className="mb-3 text-sm text-zinc-400">
        Este contenedor tiene overflow: hidden, pero el modal no se corta.
      </p>
      <button onClick={() => setIsOpen(true)} className="rounded-lg bg-sky-500 px-4 py-2 text-white">
        Abrir modal
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Hola desde un portal 🌀">
        Pulsa Escape, haz clic fuera o usa el botón para cerrar.
      </Modal>
    </div>
  );
}
