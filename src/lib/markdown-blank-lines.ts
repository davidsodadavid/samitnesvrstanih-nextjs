// CommonMark collapses any run of blank lines down to a single paragraph
// break, so pressing Enter twice vs. four times renders identically — that
// reads as "it's broken" to an admin typing in a plain textarea. Turn every
// blank line beyond the first into an explicit <br>, preserved verbatim by
// rehype-raw, so the rendered output matches what was typed line-for-line.
export function preserveBlankLines(markdown: string): string {
  // Textarea values submitted through FormData get their line endings
  // normalized to CRLF per the HTML spec, so saved content has \r\n rather
  // than \n — normalize before counting or the blank-line run below never matches.
  const normalized = markdown.replace(/\r\n?/g, '\n')
  return normalized.replace(/\n{3,}/g, (run) => '\n\n' + '<br>\n\n'.repeat(run.length - 2))
}
