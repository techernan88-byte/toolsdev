import { useEffect, useState } from 'react';

export default function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // 1. Efecto: se ejecuta DESPUÉS de pintar el componente
    const intervalId = setInterval(() => setNow(new Date()), 1000);

    // 2. Limpieza: se ejecuta al desmontar el componente.
    //    Sin ella el intervalo seguiría vivo para siempre (fuga de memoria).
    return () => clearInterval(intervalId);
  }, []); // [] = solo al montar

  return (
    <p className="text-center font-mono text-5xl font-bold text-white tabular-nums">
      {now.toLocaleTimeString('es')}
    </p>
  );
}
