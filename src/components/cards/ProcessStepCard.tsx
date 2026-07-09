import type { ProcessStep } from '@/types';

interface ProcessStepCardProps {
  step: ProcessStep;
  isLast?: boolean;
}

export function ProcessStepCard({ step, isLast = false }: ProcessStepCardProps) {
  const Icon = step.icon;

  return (
    <div className={`process-step${isLast ? ' process-step--last' : ''}`}>
      <div className="process-node">
        <div className="process-dot"></div>
      </div>
      <div className="process-content">
        <div className="process-icon-wrap">
          <Icon width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div>
          <p className="process-title">
            <span className="process-num">{step.number}</span> {step.title}
          </p>
          <p className="process-desc">{step.description}</p>
        </div>
      </div>
    </div>
  );
}
