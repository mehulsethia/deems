/** The DeeMs mark, from assets/deems-brand/svg (same path data). Dot colours are fixed. */
export function DeemsMark({ size = 28, variant = 'onDark', title }: { size?: number; variant?: 'onDark' | 'onLight'; title?: string }) {
  const bubble = variant === 'onDark' ? '#FFFFFF' : '#0E0F12';
  const last = variant === 'onDark' ? '#0E0F12' : '#FFFFFF';
  return (
    <svg width={(size * 108) / 100} height={size} viewBox="6 12 108 100" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d="M46 16h28a36 36 0 0 1 0 72H50L26 108l2-25.5A36 36 0 0 1 46 16z" fill={bubble} />
      <circle cx="38" cy="52" r="9" fill="#1463FF" />
      <circle cx="60" cy="52" r="9" fill="#E4257A" />
      <circle cx="82" cy="52" r="9" fill={last} />
    </svg>
  );
}
