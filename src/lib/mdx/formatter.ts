import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import type { Processor } from 'unified';
import type { Root as MdastRoot } from 'mdast';
import type { Root as HastRoot } from 'hast';

export interface MDXFormatterOptions {
  mathSupport?: boolean;
  codeHighlight?: boolean;
  gfmSupport?: boolean;
}

export async function formatToMDX(content: string, options: MDXFormatterOptions = {}): Promise<string> {
  const {
    mathSupport = true,
    codeHighlight = false,
    gfmSupport = true,
  } = options;

  // Start with markdown processing
  // @ts-ignore
  let processor: Processor<MdastRoot, MdastRoot, string> = remark()
    .use(remarkGfm);

  if (mathSupport) {
    // @ts-ignore
    processor = processor.use(remarkMath);
  }

  // Convert to HTML
  const hastProcessor = processor
    .use(remarkRehype, { 
      allowDangerousHtml: true
    }) as unknown as Processor<MdastRoot, HastRoot>;

  const finalProcessor = hastProcessor
    .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await finalProcessor.process(content);
  return result.toString();
}

export function wrapWithMDXComponents(content: string): string {
  return `
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { MathBlock } from '@/components/mdx/MathBlock';
import { Alert } from '@/components/mdx/Alert';

<MDXContent>
${content}
</MDXContent>
`;
}
