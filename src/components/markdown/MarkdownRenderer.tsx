'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={`prose prose-invert max-w-none ${className}`}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        code({ node, inline, className, children, ...props }: {
          node?: any;
          inline?: boolean;
          className?: string;
          children?: React.ReactNode;
          [key: string]: any;
        }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          
          if (!inline && language) {
            return (
              <div className="relative my-4 rounded-lg">
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  className="rounded-lg !bg-[#1E1E1E] !p-4"
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <code className={`${className} bg-[#1E1E1E] rounded px-1.5 py-0.5`} {...props}>
              {children}
            </code>
          );
        },
        // Customize other markdown elements
        p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
        h1: ({ children }) => <h1 className="mb-6 text-3xl font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-4 text-2xl font-bold">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-3 text-xl font-bold">{children}</h3>,
        ul: ({ children }) => <ul className="mb-4 list-disc pl-6">{children}</ul>,
        ol: ({ children }) => <ol className="mb-4 list-decimal pl-6">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-[#1E1E1E] px-4 py-2 text-left font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-t border-gray-700 px-4 py-2">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
