'use client'

import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import { preserveBlankLines } from '@/lib/markdown-blank-lines'

function extractYouTubeId(input: string): string | null {
  // Bare video ID pasted directly
  if (/^[\w-]{11}$/.test(input)) return input
  try {
    const url = new URL(input)
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0]
      return /^[\w-]{11}$/.test(id) ? id : null
    }
    if (url.hostname === 'youtube.com' || url.hostname.endsWith('.youtube.com')) {
      const v = url.searchParams.get('v')
      if (v && /^[\w-]{11}$/.test(v)) return v
      const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/)
      if (match) return match[1]
    }
  } catch {
    // not a URL
  }
  return null
}

function ToolbarButton({
  title,
  onClick,
  className = '',
  children,
}: {
  title: string
  onClick: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`cursor-pointer rounded-md px-2.5 py-1 text-sm text-zinc-700 hover:bg-zinc-200 ${className}`}
    >
      {children}
    </button>
  )
}

export function MarkdownEditor({
  name,
  defaultValue = '',
}: {
  name: string
  defaultValue?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const [preview, setPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function applyEdit(next: string, selectStart: number, selectEnd: number) {
    setValue(next)
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(selectStart, selectEnd)
    })
  }

  /** Wrap the current selection (or a placeholder) with before/after markers. */
  function surround(before: string, after: string, placeholder = 'text') {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const selection = value.slice(start, end) || placeholder
    const next = value.slice(0, start) + before + selection + after + value.slice(end)
    applyEdit(next, start + before.length, start + before.length + selection.length)
  }

  /** Prefix every line touched by the selection (headings, lists, quotes). */
  function prefixLines(prefix: string | ((index: number) => string)) {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEndIndex = value.indexOf('\n', end)
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex
    const block = value.slice(lineStart, lineEnd)
    const prefixed = block
      .split('\n')
      .map((line, i) => (typeof prefix === 'string' ? prefix : prefix(i)) + line)
      .join('\n')
    const next = value.slice(0, lineStart) + prefixed + value.slice(lineEnd)
    applyEdit(next, lineStart, lineStart + prefixed.length)
  }

  function insertLink() {
    const url = window.prompt('Link URL:', 'https://')
    if (!url) return
    surround('[', `](${url})`, 'link text')
  }

  /** Insert a standalone block at the cursor, padded with blank lines so
      markdown treats the raw HTML as its own block. */
  function insertBlock(block: string) {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const before = value.slice(0, start)
    const prefix = before === '' || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n'
    const snippet = `${prefix}${block}\n\n`
    const next = before + snippet + value.slice(end)
    const cursor = start + snippet.length
    applyEdit(next, cursor, cursor)
  }

  function insertYouTube() {
    const input = window.prompt('YouTube link (watch, youtu.be, or Shorts URL):')
    if (!input) return
    const id = extractYouTubeId(input.trim())
    if (!id) {
      window.alert('Could not find a video ID in that link.')
      return
    }
    insertBlock(
      `<iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" style="width: 100%; max-width: 640px; aspect-ratio: 16 / 9; border: 0;" allowfullscreen></iframe>`,
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-300">
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 px-2 py-1.5">
        <ToolbarButton title="Bold" className="font-bold" onClick={() => surround('**', '**')}>
          B
        </ToolbarButton>
        <ToolbarButton title="Italic" className="italic" onClick={() => surround('*', '*')}>
          I
        </ToolbarButton>
        <ToolbarButton title="Heading" onClick={() => prefixLines('## ')}>
          H2
        </ToolbarButton>
        <ToolbarButton title="Subheading" onClick={() => prefixLines('### ')}>
          H3
        </ToolbarButton>
        <ToolbarButton title="Link" onClick={insertLink}>
          🔗
        </ToolbarButton>
        <ToolbarButton title="Bulleted list" onClick={() => prefixLines('- ')}>
          • List
        </ToolbarButton>
        <ToolbarButton title="Numbered list" onClick={() => prefixLines((i) => `${i + 1}. `)}>
          1. List
        </ToolbarButton>
        <ToolbarButton title="Quote" onClick={() => prefixLines('> ')}>
          ❝
        </ToolbarButton>
        <ToolbarButton
          title="Center-align (HTML block)"
          onClick={() => surround('<div align="center">\n\n', '\n\n</div>')}
        >
          Center
        </ToolbarButton>
        <ToolbarButton title="Embed YouTube video" onClick={insertYouTube}>
          ▶ YouTube
        </ToolbarButton>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className={`ml-auto cursor-pointer rounded-md px-2.5 py-1 text-sm font-semibold ${
            preview ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-200'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Keep the textarea mounted so the form always submits the value */}
      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={`min-h-48 w-full resize-y px-3 py-2.5 text-sm font-normal outline-none ${preview ? 'hidden' : ''}`}
      />
      {preview && (
        <div className="prose prose-zinc prose-sm prose-headings:mt-2! prose-headings:mb-1! prose-p:my-1! prose-ul:my-1! prose-ol:my-1! prose-blockquote:my-1.5! min-h-48 max-w-none px-4 py-3">
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeRaw]}>
              {preserveBlankLines(value)}
            </ReactMarkdown>
          ) : (
            <p className="text-zinc-400">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
