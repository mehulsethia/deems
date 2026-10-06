Drop Meta's official logo files here, unmodified, from Meta's brand resources:

- instagram.png
- threads.png
- facebook.png

Then switch each entry in `src/brand/metaLogos.ts` from `null` to its `require(...)`.
Do not draw, recolour or regenerate these logos. They are used only inside the
platform tiles on the "pick apps" screen, never in the app icon, splash or name.
