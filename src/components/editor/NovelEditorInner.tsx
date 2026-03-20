"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TurndownService from "turndown";

interface Props {
  value: string;
  onChange: (markdown: string) => void;
}

const td = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

const slashCommands = [
  { cmd: "h1", label: "제목 1", desc: "큰 제목" },
  { cmd: "h2", label: "제목 2", desc: "중간 제목" },
  { cmd: "h3", label: "제목 3", desc: "작은 제목" },
  { cmd: "bullet", label: "글머리 기호", desc: "순서 없는 목록" },
  { cmd: "ordered", label: "번호 목록", desc: "순서 있는 목록" },
  { cmd: "quote", label: "인용문", desc: "인용 블록" },
  { cmd: "code", label: "코드 블록", desc: "코드 영역" },
  { cmd: "hr", label: "구분선", desc: "수평 구분선" },
];

export default function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "내용을 입력하세요. '/' 를 입력하면 명령어를 사용할 수 있습니다.",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const md = td.turndown(editor.getHTML());
      onChange(md);
    },
    editorProps: {
      attributes: {
        class: "min-h-[400px] p-6 outline-none prose prose-stone max-w-none",
      },
    },
  });

  function executeCommand(cmd: string) {
    if (!editor) return;
    const menu = document.getElementById("slash-menu");
    if (menu) menu.style.display = "none";

    // Delete the "/" character
    const { state } = editor;
    const { from } = state.selection;
    const textBefore = state.doc.textBetween(Math.max(0, from - 1), from);
    if (textBefore === "/") {
      editor.chain().focus().deleteRange({ from: from - 1, to: from }).run();
    }

    switch (cmd) {
      case "h1": editor.chain().focus().setHeading({ level: 1 }).run(); break;
      case "h2": editor.chain().focus().setHeading({ level: 2 }).run(); break;
      case "h3": editor.chain().focus().setHeading({ level: 3 }).run(); break;
      case "bullet": editor.chain().focus().toggleBulletList().run(); break;
      case "ordered": editor.chain().focus().toggleOrderedList().run(); break;
      case "quote": editor.chain().focus().toggleBlockquote().run(); break;
      case "code": editor.chain().focus().toggleCodeBlock().run(); break;
      case "hr": editor.chain().focus().setHorizontalRule().run(); break;
    }
  }

  return (
    <>
      <EditorContent editor={editor} />
      <div
        id="slash-menu"
        className="fixed z-50 hidden max-h-[300px] w-56 overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
      >
        {slashCommands.map((item) => (
          <button
            key={item.cmd}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand(item.cmd);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-stone-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <span className="font-medium">{item.label}</span>
            <span className="text-xs text-stone-400">{item.desc}</span>
          </button>
        ))}
      </div>
    </>
  );
}
