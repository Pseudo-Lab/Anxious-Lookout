"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
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
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
  const [slashFilter, setSlashFilter] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Placeholder.configure({
        placeholder: "내용을 입력하세요. '/' 를 입력하면 명령어를 사용할 수 있습니다.",
      }),
      Underline,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const md = td.turndown(editor.getHTML());
      onChange(md);

      // Check for slash command
      const { state } = editor;
      const { from } = state.selection;
      const textBefore = state.doc.textBetween(
        Math.max(0, from - 20),
        from,
        "\n"
      );
      const slashMatch = textBefore.match(/\/([^\s/]*)$/);

      if (slashMatch) {
        setSlashFilter(slashMatch[1].toLowerCase());
        setSelectedIdx(0);
        const coords = editor.view.coordsAtPos(from);
        setSlashPos({ top: coords.bottom + 8, left: coords.left });
        setSlashOpen(true);
      } else {
        setSlashOpen(false);
      }
    },
    editorProps: {
      attributes: {
        class: "min-h-[400px] p-6 outline-none",
      },
      handleKeyDown: (_view, event) => {
        if (!slashOpen) return false;

        const filtered = slashCommands.filter(
          (c) =>
            c.label.toLowerCase().includes(slashFilter) ||
            c.cmd.includes(slashFilter)
        );

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setSelectedIdx((prev) => Math.min(prev + 1, filtered.length - 1));
          return true;
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setSelectedIdx((prev) => Math.max(prev - 1, 0));
          return true;
        }
        if (event.key === "Enter" && filtered[selectedIdx]) {
          event.preventDefault();
          executeCommand(filtered[selectedIdx].cmd);
          return true;
        }
        if (event.key === "Escape") {
          setSlashOpen(false);
          return true;
        }
        return false;
      },
    },
  });

  const executeCommand = useCallback(
    (cmd: string) => {
      if (!editor) return;
      setSlashOpen(false);

      // Delete the slash and any filter text
      const { state } = editor;
      const { from } = state.selection;
      const textBefore = state.doc.textBetween(
        Math.max(0, from - 20),
        from,
        "\n"
      );
      const slashMatch = textBefore.match(/\/([^\s/]*)$/);
      if (slashMatch) {
        const deleteFrom = from - slashMatch[0].length;
        editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run();
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
    },
    [editor]
  );

  // Close slash menu on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSlashOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredCommands = slashCommands.filter(
    (c) =>
      c.label.toLowerCase().includes(slashFilter) ||
      c.cmd.includes(slashFilter)
  );

  return (
    <>
      <EditorContent editor={editor} />

      {/* Bubble Menu - 텍스트 선택 시 나타나는 툴바 */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 150 }}
          className="flex items-center gap-0.5 rounded-lg border border-stone-200 bg-white px-1 py-1 shadow-lg"
        >
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={`rounded px-2 py-1 text-sm font-bold transition-colors ${
              editor.isActive("bold")
                ? "bg-indigo-100 text-indigo-700"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            B
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={`rounded px-2 py-1 text-sm italic transition-colors ${
              editor.isActive("italic")
                ? "bg-indigo-100 text-indigo-700"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            I
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
            className={`rounded px-2 py-1 text-sm underline transition-colors ${
              editor.isActive("underline")
                ? "bg-indigo-100 text-indigo-700"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            U
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
            className={`rounded px-2 py-1 text-sm line-through transition-colors ${
              editor.isActive("strike")
                ? "bg-indigo-100 text-indigo-700"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            S
          </button>
          <div className="mx-1 h-5 w-px bg-stone-200" />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleCode().run();
            }}
            className={`rounded px-2 py-1 font-mono text-xs transition-colors ${
              editor.isActive("code")
                ? "bg-indigo-100 text-indigo-700"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {"<>"}
          </button>
        </BubbleMenu>
      )}

      {/* Slash Menu */}
      {slashOpen && filteredCommands.length > 0 && (
        <div
          ref={menuRef}
          className="fixed z-50 max-h-[300px] w-60 overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
          style={{ top: slashPos.top, left: slashPos.left }}
        >
          {filteredCommands.map((item, idx) => (
            <button
              key={item.cmd}
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand(item.cmd);
              }}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                idx === selectedIdx
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              <span className="font-medium">{item.label}</span>
              <span className="text-xs text-stone-400">{item.desc}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
