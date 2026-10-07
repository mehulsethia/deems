/**
 * The OnlyDM wordmark: a regular-weight "Only" and a heavy "DM", so the eye lands on "DM".
 * Reads "OnlyDM" to screen readers.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className ? `wordmark ${className}` : 'wordmark'}>
      <span aria-hidden>
        <span className="only">Only</span>
        <span className="dm">DM</span>
      </span>
      <span className="sr-only">OnlyDM</span>
    </span>
  );
}
