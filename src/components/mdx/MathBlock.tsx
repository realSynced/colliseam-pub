import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathBlockProps {
  children: string;
  inline?: boolean;
}

export function MathBlock({ children, inline = false }: MathBlockProps) {
  const Component = inline ? InlineMath : BlockMath;
  return <Component math={children} />;
}
