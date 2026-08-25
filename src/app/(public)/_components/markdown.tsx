import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import { preserveBlankLines } from '@/lib/markdown-blank-lines'

// prose-invert's default body text is a mid-gray (--tw-prose-invert-body),
// which reads fine on a near-black background but is too low-contrast against
// a bright accent color like the program page's orange — so `invert` sets
// every prose color variable to solid white instead of using that preset.
const invertVars =
  '[--tw-prose-body:white] [--tw-prose-headings:white] [--tw-prose-lead:white] ' +
  '[--tw-prose-links:white] [--tw-prose-bold:white] [--tw-prose-counters:white] ' +
  '[--tw-prose-bullets:white] [--tw-prose-hr:white] [--tw-prose-quotes:white] ' +
  '[--tw-prose-quote-borders:white] [--tw-prose-captions:white] [--tw-prose-code:white] ' +
  '[--tw-prose-pre-code:white] [--tw-prose-pre-bg:rgba(0,0,0,0.3)] ' +
  '[--tw-prose-th-borders:white] [--tw-prose-td-borders:white]'

/** Renders admin-authored markdown with the same plugins and spacing as the dashboard editor preview. */
export function Markdown({ children, invert = false }: { children: string; invert?: boolean }) {
  return (
    <div
      className={`prose ${invert ? invertVars : 'prose-zinc'} prose-headings:mt-2! prose-headings:mb-1! prose-p:my-1! prose-ul:my-1! prose-ol:my-1! prose-blockquote:my-1.5! max-w-none`}
    >
      <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeRaw]}>
        {preserveBlankLines(children)}
      </ReactMarkdown>
    </div>
  )
}
