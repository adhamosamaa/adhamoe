import type { BioParagraph } from '@/types';

interface HighlightTextProps {
  paragraph: BioParagraph;
  className?: string;
}

/** Splits `paragraph.text` on `paragraph.boldPhrase` and wraps the first match in <strong>. */
export function HighlightText({ paragraph, className }: HighlightTextProps) {
  const { text, boldPhrase } = paragraph;

  if (!boldPhrase) {
    return <p className={className}>{text}</p>;
  }

  const idx = text.indexOf(boldPhrase);
  if (idx === -1) {
    return <p className={className}>{text}</p>;
  }

  const before = text.slice(0, idx);
  const after = text.slice(idx + boldPhrase.length);

  return (
    <p className={className}>
      {before}
      <strong className="text-white font-medium">{boldPhrase}</strong>
      {after}
    </p>
  );
}
