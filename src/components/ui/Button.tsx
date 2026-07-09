import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'solid' | 'outline' | 'ghost';

const variantClassName: Record<ButtonVariant, string> = {
  solid: 'btn-solid',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: 'a';
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
}

interface ButtonElementProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as: 'button';
  variant?: ButtonVariant;
  children: ReactNode;
}

type ButtonProps = ButtonLinkProps | ButtonElementProps;

/**
 * `solid` / `outline` variants carry a static "↗" glyph in their label text
 * (matches the original design). `ghost` renders an animated arrow icon that
 * slides right on hover, driven by the `.btn-ghost svg` CSS rule.
 */
export function Button({ variant = 'solid', className, children, ...rest }: ButtonProps) {
  const classes = cn(variantClassName[variant], className);
  const content = (
    <>
      {children}
      {variant === 'ghost' && <ArrowRight width={14} height={14} aria-hidden="true" />}
    </>
  );

  if (rest.as === 'button') {
    const { as, ...buttonProps } = rest;
    void as;
    return (
      <button className={classes} {...buttonProps}>
        {content}
      </button>
    );
  }

  const { as, ...anchorProps } = rest;
  void as;
  return (
    <a className={classes} {...anchorProps}>
      {content}
    </a>
  );
}
