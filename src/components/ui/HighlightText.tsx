import type { BioParagraph } from '@/types';

interface HighlightTextProps {
  paragraph: BioParagraph;
  className?: string;
}

/** Splits `paragraph.text` on `paragraph.boldPhrase` and wraps the match in <strong>. */
export function HighlightText({ paragraph, className }: HighlightTextProps) {
  const { text, boldPhrase } = paragraph;

  if (!boldPhrase) {
    return <p className={className}>{text}</p>;
  }

  const [before, after] = text.split(boldPhrase);

  return (
    <p className={className}>
      {before}
      <strong className="text-white font-medium">{boldPhrase}</strong>
      {after}
    </p>
  );
}
