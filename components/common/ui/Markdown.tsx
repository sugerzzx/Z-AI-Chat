import { FC, memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";

interface MarkdownProps extends Options {}

const Markdown: FC<MarkdownProps> = ({ children, ...prpos }: Options) => {
  return <ReactMarkdown {...prpos}>{children}</ReactMarkdown>;
};

export default memo(Markdown);
