import type { ReactNode } from 'react';
import { SparkIcon } from './SparkIcon';
import { cn } from '@/utils/cn';

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p className={cn('sec-label', className)}>
      <SparkIcon className="w-3 h-3" />
      {children}
    </p>
  );
}
