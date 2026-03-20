"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";

interface NovelEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  editorRef?: React.MutableRefObject<any>;
}

const NovelEditorInner = dynamic(() => import("./NovelEditorInner"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-stone-300 bg-white">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-indigo-600" />
    </div>
  ),
});

export default function NovelEditor({ value, onChange, editorRef }: NovelEditorProps) {
  return (
    <div className="novel-editor-wrapper rounded-lg border border-stone-300 bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      <style>{`
        .novel-editor-wrapper .tiptap {
          min-height: 400px;
          padding: 1.5rem;
          outline: none;
        }
        .novel-editor-wrapper .tiptap p.is-editor-empty:first-child::before {
          content: "'/' 를 입력하면 명령어를 사용할 수 있습니다.";
          color: #a8a29e;
          float: left;
          pointer-events: none;
          height: 0;
        }
        .novel-editor-wrapper .tiptap h1 { font-size: 1.875rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
        .novel-editor-wrapper .tiptap h2 { font-size: 1.5rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
        .novel-editor-wrapper .tiptap h3 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; }
        .novel-editor-wrapper .tiptap ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.25rem 0; }
        .novel-editor-wrapper .tiptap ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.25rem 0; }
        .novel-editor-wrapper .tiptap li { margin: 0; }
        .novel-editor-wrapper .tiptap li p { margin: 0.1rem 0; }
        .novel-editor-wrapper .tiptap p { margin: 0.5rem 0; }
        .novel-editor-wrapper .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .novel-editor-wrapper .tiptap blockquote {
          border-left: 3px solid #6366f1;
          padding-left: 1rem;
          color: #78716c;
          margin: 1rem 0;
        }
        .novel-editor-wrapper .tiptap pre {
          background: #1e1e2e;
          color: #cdd6f4;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .novel-editor-wrapper .tiptap code:not(pre code) {
          background: #e0e7ff;
          color: #4f46e5;
          padding: 0.15em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
      `}</style>
      <NovelEditorInner value={value} onChange={onChange} editorRef={editorRef} />
    </div>
  );
}
