"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NovelEditor from "@/components/editor/NovelEditor";
import TagInput from "@/components/editor/TagInput";
import ImageUpload from "@/components/upload/ImageUpload";
import {
  getMyDrafts,
  createDraft,
  updateDraft,
  publishDraft,
  deleteDraft,
} from "@/lib/drafts/api";
import type { PostDraft } from "@/lib/supabase/types";

function WritePage() {
  const { user } = useAuth();

  const [drafts, setDrafts] = useState<PostDraft[]>([]);
  const [currentDraft, setCurrentDraft] = useState<PostDraft | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [mdMode, setMdMode] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (user) loadDrafts();
  }, [user]);

  async function loadDrafts() {
    if (!user) return;
    try {
      const data = await getMyDrafts(user.id);
      setDrafts(data);
    } catch {
      // ignore
    }
  }

  function selectDraft(draft: PostDraft) {
    setCurrentDraft(draft);
    setTitle(draft.title);
    setBody(draft.body);
    setTagsInput(draft.tags?.join(", ") ?? "");
    setMessage("");
  }

  function newDraft() {
    setCurrentDraft(null);
    setTitle("");
    setBody("");
    setTagsInput("");
    setMessage("");
  }

  function parseTags(input: string): string[] {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function handleSave() {
    if (!user || !title.trim() || !body.trim()) return;
    setSaving(true);
    setMessage("");

    try {
      const tags = parseTags(tagsInput);
      if (currentDraft) {
        const updated = await updateDraft(currentDraft.id, {
          title,
          body,
          tags,
        });
        setCurrentDraft(updated);
        setMessage("저장되었습니다.");
      } else {
        const created = await createDraft(user.id, title, body, tags);
        setCurrentDraft(created);
        setMessage("새 초안이 생성되었습니다.");
      }
      await loadDrafts();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!user || !title.trim() || !body.trim()) return;
    setPublishing(true);
    setMessage("");

    try {
      const tags = parseTags(tagsInput);
      let draft = currentDraft;

      if (!draft) {
        draft = await createDraft(user.id, title, body, tags);
      } else {
        draft = await updateDraft(draft.id, { title, body, tags });
      }

      await publishDraft(draft.id);
      setMessage("발행되었습니다!");
      newDraft();
      await loadDrafts();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "발행에 실패했습니다.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete(draftId: string) {
    try {
      await deleteDraft(draftId);
      if (currentDraft?.id === draftId) newDraft();
      await loadDrafts();
    } catch {
      // ignore
    }
  }

  const statusLabel: Record<string, string> = {
    draft: "초안",
    published: "발행됨",
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar: draft list */}
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200/60">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-800">내 글</h2>
            <button
              onClick={newDraft}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              + 새 글
            </button>
          </div>
          <ul className="mt-3 space-y-1">
            {drafts.map((d) => (
              <li key={d.id}>
                <button
                  onClick={() => selectDraft(d)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    currentDraft?.id === d.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <div className="truncate font-medium">
                    {d.title || "제목 없음"}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-stone-400">
                    <span>{statusLabel[d.status] ?? d.status}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("정말 삭제하시겠습니까?")) {
                          handleDelete(d.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </button>
              </li>
            ))}
            {drafts.length === 0 && (
              <li className="px-3 py-2 text-xs text-stone-400">글이 없습니다.</li>
            )}
          </ul>
        </div>
      </aside>

      {/* Editor */}
      <div className="flex-1">
        <h1 className="mb-6 text-2xl font-bold text-stone-900">글 쓰기</h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-lg font-semibold text-stone-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <TagInput value={tagsInput} onChange={setTagsInput} />

          {/* 에디터 모드 토글 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMdMode(false)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                !mdMode
                  ? "bg-indigo-600 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              에디터
            </button>
            <button
              type="button"
              onClick={() => setMdMode(true)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                mdMode
                  ? "bg-indigo-600 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              Markdown
            </button>
          </div>

          {mdMode ? (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="마크다운으로 작성하세요..."
              className="min-h-[400px] w-full resize-y rounded-lg border border-stone-300 bg-white p-6 font-mono text-sm text-stone-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          ) : (
            <NovelEditor key={currentDraft?.id ?? "new"} value={body} onChange={setBody} editorRef={editorRef} />
          )}

          <ImageUpload
            onUploaded={(url) => {
              if (mdMode) {
                setBody((prev) => prev + `\n![이미지](${url})\n`);
              } else {
                const editor = editorRef.current;
                if (editor) {
                  editor.chain().focus().setImage({ src: url, alt: "이미지" }).run();
                } else {
                  setBody((prev) => prev + `\n![이미지](${url})\n`);
                }
              }
            }}
          />

          {message && (
            <p className="text-sm font-medium text-indigo-600">
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !body.trim()}
              className="rounded-lg border border-stone-300 px-5 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing || !title.trim() || !body.trim()}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {publishing ? "발행 중..." : "발행"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WritePageWrapper() {
  return (
    <ProtectedRoute requireApproved>
      <WritePage />
    </ProtectedRoute>
  );
}
