"use client";

import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div data-color-mode="light" className="md-editor-wrapper">
      <style>{`
        .md-editor-wrapper .w-md-editor {
          border: 1px solid #d6d3d1 !important;
          border-radius: 0.5rem !important;
          box-shadow: none !important;
        }
        .md-editor-wrapper .w-md-editor:focus-within {
          border-color: #6366f1 !important;
          ring: 1px solid #6366f1;
          box-shadow: 0 0 0 1px #6366f1 !important;
        }
        .md-editor-wrapper .w-md-editor-text-input,
        .md-editor-wrapper .w-md-editor-text {
          min-height: 100% !important;
          cursor: text !important;
        }
        .md-editor-wrapper .w-md-editor-area {
          cursor: text !important;
        }
      `}</style>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? "")}
        height={400}
        preview="live"
      />
    </div>
  );
}
