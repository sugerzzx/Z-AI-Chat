import { cn } from "@/lib/utils";
import { FC } from "react";
import ReactMarkdown, { Options as MarkdownProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "next-themes";

const Markdown: FC<MarkdownProps> = ({ className, children, ...props }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <ReactMarkdown
      rehypePlugins={[remarkGfm]}
      className={cn("markdown", className)}
      {...props}
      components={{
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              language={match[1]}
              style={isDark ? atomOneDark : atomOneLight}
            >
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
