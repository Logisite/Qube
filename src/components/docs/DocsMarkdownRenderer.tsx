import { useEffect, useState, type ReactNode } from "react"
import { Link } from "react-router"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { codeToHtml } from "shiki"
import { Copy, Check } from "lucide-react"

interface DocsMarkdownRendererProps {
  content: string
  onHeadingsExtracted: (headings: { id: string; text: string; level: number }[]) => void
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim()
}

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [html, setHtml] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const language = className?.replace("language-", "") || "text"

  useEffect(() => {
    codeToHtml(children.trim(), {
      lang: language,
      theme: "github-dark",
    }).then(setHtml)
  }, [children, language])

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (html) {
    return (
      <div className="relative group my-4">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md bg-white/10 text-white/50 hover:bg-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
        <div
          className="[&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    )
  }

  return (
    <pre className="bg-[#111] border border-white/10 rounded-lg p-4 overflow-x-auto text-sm text-[#e5e5e5] my-4">
      <code>{children.trim()}</code>
    </pre>
  )
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 text-[0.85em] font-mono">
      {children}
    </code>
  )
}

export function DocsMarkdownRenderer({ content, onHeadingsExtracted }: DocsMarkdownRendererProps) {
  useEffect(() => {
    const headings: { id: string; text: string; level: number }[] = []
    const lines = content.split("\n")

    for (const line of lines) {
      const match = line.match(/^(#{2,3})\s+(.+)/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        headings.push({ id: slugify(text), text, level })
      }
    }

    onHeadingsExtracted(headings)
  }, [content, onHeadingsExtracted])

  return (
    <div className="docs-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mb-4 mt-8 first:mt-0 font-display">
              {children}
            </h1>
          ),
          h2: ({ children }) => {
            const text = typeof children === "string" ? children : String(children)
            return (
              <h2
                id={slugify(text)}
                className="text-xl font-semibold text-white mb-3 mt-10 pb-2 border-b border-white/10 scroll-mt-20"
              >
                {children}
              </h2>
            )
          },
          h3: ({ children }) => {
            const text = typeof children === "string" ? children : String(children)
            return (
              <h3
                id={slugify(text)}
                className="text-lg font-medium text-white mb-2 mt-8 scroll-mt-20"
              >
                {children}
              </h3>
            )
          },
          h4: ({ children }) => (
            <h4 className="text-base font-medium text-white mb-2 mt-6">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-white/70 leading-relaxed mb-4 text-[15px]">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-white/70 mb-4 space-y-1 text-[15px]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-white/70 mb-4 space-y-1 text-[15px]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-white/70 leading-relaxed">{children}</li>
          ),
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http")
            const isInternal = href?.startsWith("/")

            if (isInternal && !isExternal && href) {
              return (
                <Link
                  to={href}
                  className="text-white underline underline-offset-2 decoration-white/30 hover:decoration-white/60 transition-colors"
                >
                  {children}
                </Link>
              )
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline underline-offset-2 decoration-white/30 hover:decoration-white/60 transition-colors"
              >
                {children}
              </a>
            )
          },
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return <InlineCode>{children}</InlineCode>
            }
            return (
              <CodeBlock className={className}>
                {typeof children === "string" ? children : String(children)}
              </CodeBlock>
            )
          },
          pre: ({ children }) => <>{children}</>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm text-left">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-white/10">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-white/5">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-white/50 font-medium text-xs uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-white/70">{children}</td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-white/20 pl-4 my-4 text-white/60 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-white/10 my-8" />,
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="text-white/80">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
