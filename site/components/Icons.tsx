/** Small line icons (decorative). */
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const Tick = () => (
  <svg {...base} width={14} height={14} stroke="#FFFFFF" strokeWidth={3}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </svg>
);
export const Cross = () => (
  <svg {...base} width={12} height={12} strokeWidth={3}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const Page = () => (
  <svg {...base}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M3 9h18" />
    <rect x="9.5" y="13" width="5" height="4" rx="1" fill="currentColor" />
  </svg>
);
export const NoServer = () => (
  <svg {...base}>
    <rect x="4" y="4" width="16" height="6.5" rx="2" />
    <rect x="4" y="13.5" width="16" height="6.5" rx="2" />
    <path d="M3 21L21 3" />
  </svg>
);
export const Exit = () => (
  <svg {...base}>
    <path d="M14 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8" />
    <path d="M10 12h10M16.5 8.5L20 12l-3.5 3.5" />
  </svg>
);
export const Eye = () => (
  <svg {...base}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M3 21L21 3" />
  </svg>
);
export const Apple = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.75 2.27-1.6 2.78-.41 6.89 1.15 9.14.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.28z" />
  </svg>
);
