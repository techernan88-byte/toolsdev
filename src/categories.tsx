import type { ComponentType } from 'react';
import type { Category, SearchableSection } from './types';
import tailwindSections from './tailwind/topics';
import typescriptTopics from './typescript/topics';
import reactTopics from './react/topics';
import postgresTopics from './postgres/topics';
import nodeTopics from './node/topics';
import pythonTopics from './python/topics';
import gitTopics from './git/topics';
import SectionView from './tailwind/components/SectionView';
import TopicView from './components/topic/TopicView';

/**
 * Une las secciones de una categoría con la vista que las pinta.
 * Cada categoría conserva su propio tipo de sección (TailwindSection, Topic...).
 */
function defineCategory<T extends SearchableSection>(category: {
  id: string;
  label: string;
  icon: string;
  sections: T[];
  View: ComponentType<{ section: T }>;
}): Category {
  const { View, sections, ...meta } = category;
  return {
    ...meta,
    sections,
    renderSection: (sectionId) => {
      const section = sections.find((item) => item.id === sectionId) ?? sections[0];
      return <View key={`${meta.id}/${section.id}`} section={section} />;
    },
  };
}

/** Pestañas de la cabecera, en este orden. */
export const CATEGORIES: Category[] = [
  defineCategory({
    id: 'tailwind',
    label: 'Tailwind CSS',
    icon: '🎨',
    sections: tailwindSections,
    View: SectionView,
  }),
  defineCategory({
    id: 'typescript',
    label: 'TypeScript',
    icon: '🔷',
    sections: typescriptTopics,
    View: TopicView,
  }),
  defineCategory({ id: 'react', label: 'React', icon: '⚛️', sections: reactTopics, View: TopicView }),
  defineCategory({
    id: 'postgres',
    label: 'PostgreSQL',
    icon: '🐘',
    sections: postgresTopics,
    View: TopicView,
  }),
  defineCategory({ id: 'node', label: 'Node + Express', icon: '🟢', sections: nodeTopics, View: TopicView }),
  defineCategory({
    id: 'python',
    label: 'Python + FastAPI',
    icon: '🐍',
    sections: pythonTopics,
    View: TopicView,
  }),
  defineCategory({ id: 'git', label: 'Git', icon: '🌿', sections: gitTopics, View: TopicView }),
];
