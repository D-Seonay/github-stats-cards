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

const DATE_LOCALE_TAGS: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  de: "de-DE",
  jp: "ja-JP",
};

/**
 * Formats two ISO (YYYY-MM-DD) dates as a localized "start - end" range,
 * parsed as UTC so the calendar day doesn't shift with the server's timezone.
 */
export function formatDateRange(
  startISO: string,
  endISO: string,
  locale: string = "en",
): string {
  const tag = DATE_LOCALE_TAGS[locale] || DATE_LOCALE_TAGS.en;
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  };

  const start = new Date(`${startISO}T00:00:00Z`).toLocaleDateString(
    tag,
    options,
  );
  const end = new Date(`${endISO}T00:00:00Z`).toLocaleDateString(tag, options);

  return `${start} - ${end}`;
}
