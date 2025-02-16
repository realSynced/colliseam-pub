'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState } from 'react';

interface MDXRendererProps {
  source: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 flex items-center gap-1 rounded bg-blackLighter px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-blackLighter-2"
    >
      {copied ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

const components = {
  h1: (props: any) => <h1 className="mb-4 text-2xl font-bold text-white" {...props} />,
  h2: (props: any) => <h2 className="mb-3 text-xl font-semibold text-white" {...props} />,
  h3: (props: any) => <h3 className="mb-2 text-lg font-medium text-white" {...props} />,
  p: (props: any) => <p className="mb-4 text-gray-200" {...props} />,
  ul: (props: any) => <ul className="mb-4 list-disc pl-5 text-gray-200" {...props} />,
  ol: (props: any) => <ol className="mb-4 list-decimal pl-5 text-gray-200" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  strong: (props: any) => <strong className="font-semibold text-white" {...props} />,
  em: (props: any) => <em className="italic text-gray-300" {...props} />,
  blockquote: (props: any) => <blockquote className="mb-4 border-l-4 border-primary pl-4 italic text-gray-300" {...props} />,
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const code = String(children).replace(/\n$/, '');
    
    return !inline ? (
      <div className="group relative mb-4">
        <SyntaxHighlighter
          language={match?.[1] || 'text'}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: '0.375rem',
            background: 'rgb(17, 24, 39)',
          }}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
        {match?.[1] && (
          <div className="absolute left-2 top-2 rounded bg-blackLighter px-2 py-1 text-xs text-gray-400">
            {match[1]}
          </div>
        )}
        <CopyButton text={code} />
      </div>
    ) : (
      <code className="rounded bg-blackLighter px-1 py-0.5 font-mono text-sm text-primary" {...props}>
        {children}
      </code>
    );
  },
  a: (props: any) => <a className="text-blue-400 hover:text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
  hr: () => <hr className="my-8 border-blackLighter" />,
  table: (props: any) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full" {...props} />
    </div>
  ),
  th: (props: any) => <th className="border border-blackLighter bg-blackLighter px-4 py-2 text-left font-semibold text-white" {...props} />,
  td: (props: any) => <td className="border border-blackLighter px-4 py-2 text-gray-200" {...props} />,
};

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown components={components}>
        {source || ''}
      </ReactMarkdown>
    </div>
  );
}
