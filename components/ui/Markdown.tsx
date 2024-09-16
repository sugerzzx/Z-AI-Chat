import { cn } from "@/lib/utils";
import { FC } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownProps extends Options {}

const Markdown: FC<MarkdownProps> = ({ className, children, ...props }: Options) => {
  return (
    <ReactMarkdown
      rehypePlugins={[remarkGfm]}
      className={cn("markdown", className)}
      {...props}
      components={{
        code(props) {
          const { children, className, node, ref, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter {...rest} PreTag="div" language={match[1]} style={darcula}>
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
