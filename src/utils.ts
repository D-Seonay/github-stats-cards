/**
 * Minifies an SVG string by removing unnecessary whitespace and newlines.
 * @param svg The raw SVG string
 * @returns The minified SVG string
 */
export function minifySVG(svg: string): string {
  return svg
    .replace(/\n/g, "")
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}
