import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="mb-6 mt-8 text-4xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-4 mt-6 text-3xl font-semibold">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-3 mt-4 text-2xl font-medium">{children}</h3>,
    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="mb-4 ml-6 list-disc">{children}</ul>,
    li: ({ children }) => <li className="mb-2">{children}</li>,
    ...components,
  };
}
