/** "DeeMs" with the two e's small, so the eye lands on D-M-s. Reads "Deems" to screen readers. */
export function Wordmark() {
  return (
    <span className="wordmark">
      <span aria-hidden>
        D<span className="wordmark-ee">ee</span>Ms
      </span>
      <span className="sr-only">Deems</span>
    </span>
  );
}
