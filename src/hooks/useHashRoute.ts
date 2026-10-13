import { useEffect, useState } from 'react';
import type { Category } from '../types';

/**
 * Guarda la categoría y la sección activas en la URL: #react/use-state
 * Así puedes recargar, usar atrás/adelante o compartir el enlace.
 * (#flexbox, sin categoría, se interpreta como la primera categoría)
 */
export function useHashRoute(categories: Category[]) {
  const parseHash = () => {
    const [first, second] = window.location.hash.slice(1).split('/');
    const category = categories.find((item) => item.id === first) ?? categories[0];
    const sectionId = second ?? first;
    const section = category.sections.find((item) => item.id === sectionId) ?? category.sections[0];
    return { category, section };
  };

  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (categoryId: string, sectionId?: string) => {
    window.location.hash = sectionId ? `${categoryId}/${sectionId}` : categoryId; // dispara "hashchange"
  };

  return { ...route, navigate };
}
