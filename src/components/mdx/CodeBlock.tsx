import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const language = className?.replace(/language-/, '') || 'text';

  return (
    <div className="relative my-4 rounded-lg">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        className="rounded-lg !bg-[#1E1E1E] !p-4"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
