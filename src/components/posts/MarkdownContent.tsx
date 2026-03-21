"use client";

import { useMemo } from "react";
import { marked } from "marked";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const html = useMemo(() => {
    return marked.parse(content, { async: false }) as string;
  }, [content]);

  return (
    <div
      className="prose prose-stone max-w-none prose-headings:tracking-tight prose-pre:bg-[#1e1e2e] prose-pre:text-[#cdd6f4] prose-a:text-indigo-600 prose-blockquote:border-l-indigo-500"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
