"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("novel").then((mod) => mod.Editor),
  { ssr: false }
);

interface NovelEditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

export default function NovelEditor({ value, onChange }: NovelEditorProps) {
  const [mounted, setMounted] = useState(false);
  const initialContent = useRef(value);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-stone-300 bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="novel-editor-wrapper rounded-lg border border-stone-300 bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      <style>{`
        .novel-editor-wrapper .ProseMirror {
          min-height: 400px;
          padding: 1.5rem;
          outline: none;
        }
        .novel-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          content: "내용을 입력하세요. '/' 를 입력하면 명령어를 사용할 수 있습니다.";
          color: #a8a29e;
          float: left;
          pointer-events: none;
          height: 0;
        }
        .novel-editor-wrapper .ProseMirror h1 { font-size: 1.875rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
        .novel-editor-wrapper .ProseMirror h2 { font-size: 1.5rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
        .novel-editor-wrapper .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; }
        .novel-editor-wrapper .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; }
        .novel-editor-wrapper .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }
        .novel-editor-wrapper .ProseMirror blockquote {
          border-left: 3px solid #6366f1;
          padding-left: 1rem;
          color: #78716c;
          margin: 1rem 0;
        }
        .novel-editor-wrapper .ProseMirror pre {
          background: #1e1e2e;
          color: #cdd6f4;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .novel-editor-wrapper .ProseMirror code:not(pre code) {
          background: #e0e7ff;
          color: #4f46e5;
          padding: 0.15em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
      `}</style>
      <Editor
        defaultValue={initialContent.current || undefined}
        onUpdate={(editor) => {
          if (!editor) return;
          // Novel editor stores HTML, convert to markdown
          const html = editor.getHTML();
          import("turndown").then(({ default: TurndownService }) => {
            const td = new TurndownService({
              headingStyle: "atx",
              codeBlockStyle: "fenced",
            });
            const md = td.turndown(html);
            onChange(md);
          });
        }}
        disableLocalStorage
        className="min-h-[400px]"
      />
    </div>
  );
}
