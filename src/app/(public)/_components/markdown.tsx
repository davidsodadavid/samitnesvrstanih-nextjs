import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'

/** Renders admin-authored markdown with the same plugins and spacing as the dashboard editor preview. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-zinc prose-headings:mt-2! prose-headings:mb-1! prose-p:my-1! prose-ul:my-1! prose-ol:my-1! prose-blockquote:my-1.5! max-w-none">
      <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeRaw]}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
