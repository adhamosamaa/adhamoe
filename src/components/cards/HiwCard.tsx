import type { HowItWorksCard } from '@/types';

interface HiwCardProps {
  card: HowItWorksCard;
}

export function HiwCard({ card }: HiwCardProps) {
  return (
    <div className={`hiw-card hiw-card--${card.variant}`}>
      <span className="hiw-card__number">{card.number}</span>
      <div className="hiw-card__body">
        <h3 className="hiw-card__title">{card.title}</h3>
        <p className="hiw-card__desc">{card.description}</p>
      </div>
    </div>
  );
}
