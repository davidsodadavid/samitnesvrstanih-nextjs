// Flattens a markdown description into a one-paragraph plain-text teaser —
// used where rich formatting would not fit (e.g. the homepage section cards).
export function toPlainText(markdown: string): string {
  return (
    markdown
      // fenced code blocks and inline code
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]*)`/g, '$1')
      // images before links, so the ![alt](src) form doesn't leave a stray "!"
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // raw html (the editor allows a few block-level tags)
      .replace(/<[^>]+>/g, ' ')
      // headings, blockquotes and list markers at line starts
      .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
      // emphasis / strikethrough markers
      .replace(/[*_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

/** Cuts to `max` characters on a word boundary, adding an ellipsis. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`
}
