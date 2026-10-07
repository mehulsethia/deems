/**
 * "DeeMs": D, M and s carry the name; the two e's step back (smaller, in grey) so the eye
 * lands on "DMs" first and "Deems" second. Reads "Deems" to screen readers.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className ? `wordmark ${className}` : 'wordmark'}>
      <span aria-hidden>
        D<span className="wordmark-ee">ee</span>Ms
      </span>
      <span className="sr-only">Deems</span>
    </span>
  );
}
