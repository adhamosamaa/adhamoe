'use client';

import type { SkillRowData } from '@/types';
import { Palette, Layers, Sparkles, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const skillIcons: Record<string, React.FC<{ className?: string }>> = {
  '01': Palette,
  '02': Layers,
  '03': Sparkles,
  '04': GitBranch,
};

interface SkillRowProps {
  skill: SkillRowData;
  index?: number;
}

export function SkillRow({ skill }: SkillRowProps) {
  const Icon = skillIcons[skill.number] || Palette;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-7 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.015] hover:bg-white/[0.035] hover:border-accent/40 transition-colors duration-500 flex flex-col justify-between h-full"
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
              {skill.number}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs font-mono uppercase tracking-wider text-white/40">Capability</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/50 group-hover:text-accent group-hover:border-accent/30 group-hover:bg-accent/10 transition-all duration-300">
            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        {/* Skill Title */}
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6 group-hover:text-accent transition-colors duration-300">
          {skill.name}
        </h3>
      </div>

      {/* Skill Tags */}
      <div className="flex flex-wrap gap-2 pt-6 border-t border-white/[0.06]">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/[0.03] text-gray-300/90 border border-white/[0.08] hover:border-accent/40 hover:text-accent hover:bg-accent/10 transition-all duration-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}


