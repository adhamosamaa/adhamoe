import { cn } from '@/utils/cn';

interface SparkIconProps {
  className?: string;
  fill?: string;
}

export function SparkIcon({ className, fill = 'currentColor' }: SparkIconProps) {
  return (
    <svg className={cn('spark-icon', className)} fill={fill} aria-hidden="true">
      <use href="#spark" />
    </svg>
  );
}
