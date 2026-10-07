/** The wordmark "DeeMs": D, M and s carry the name, the two e's step back. Read aloud as "Deems". */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} aria-label="Deems" role="img">
      <span aria-hidden>
        D<span className="wm-e">ee</span>Ms
      </span>
    </span>
  );
}
