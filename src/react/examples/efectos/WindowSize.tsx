import { useEffect, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

const getSize = (): Size => ({ width: window.innerWidth, height: window.innerHeight });

// Suscribirse a un evento del navegador y desuscribirse en la limpieza
export default function WindowSize() {
  const [size, setSize] = useState(getSize);

  useEffect(() => {
    const handleResize = () => setSize(getSize());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="text-center">
      <p className="font-mono text-4xl font-bold text-white">
        {size.width} × {size.height}
      </p>
      <p className="mt-2 text-sm text-zinc-500">Cambia el tamaño de la ventana 👆</p>
    </div>
  );
}
