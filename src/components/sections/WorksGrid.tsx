'use client';

import { useState, useMemo } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectCard } from '@/components/cards/ProjectCard';
import type { Project } from '@/types';

const INITIAL_COUNT = 6;
const REVEAL_DELAYS = [0, 80, 160] as const;

interface WorksGridProps {
  projects: Project[];
}

export function WorksGrid({ projects }: WorksGridProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // Generate categories dynamically from project data
  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return ['All', ...unique];
  }, [projects]);

  // Filter projects by category
  const filtered = activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <>
      <Reveal delay={0} className="flex flex-wrap gap-3 mb-14">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-pill${activeCategory === cat ? ' is-active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 md:gap-y-28 gap-x-12 md:gap-x-16">
        {visible.map((project, index) => (
          <Reveal key={project.id} delay={REVEAL_DELAYS[index % REVEAL_DELAYS.length]}>
            <ProjectCard project={project} priority={index < 2} />
          </Reveal>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-center text-gray font-light py-16">No projects in this category yet.</p>
      )}

      {hasMore && (
        <Reveal delay={0} className="flex justify-center mt-16">
          <button
            className="btn-outline cursor-pointer font-inherit"
            onClick={() => setVisibleCount((prev) => prev + INITIAL_COUNT)}
          >
            Load More ↗
          </button>
        </Reveal>
      )}
    </>
  );
}
