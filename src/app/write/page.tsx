"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
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
    if (!currentDraft) {
      setMessage("먼저 초안을 저장해주세요.");
      return;
    }
    setPublishing(true);
    setMessage("");

    try {
      await publishDraft(currentDraft.id);
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
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">내 글</h2>
          <button
            onClick={newDraft}
            className="text-xs text-blue-600 hover:underline"
          >
            + 새 글
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {drafts.map((d) => (
            <li key={d.id}>
              <button
                onClick={() => selectDraft(d)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  currentDraft?.id === d.id
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : ""
                }`}
              >
                <div className="truncate font-medium">
                  {d.title || "제목 없음"}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-400">
                  <span>{statusLabel[d.status] ?? d.status}</span>
                  {d.status === "draft" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(d.id);
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </button>
            </li>
          ))}
          {drafts.length === 0 && (
            <li className="px-3 text-xs text-zinc-400">글이 없습니다.</li>
          )}
        </ul>
      </aside>

      {/* Editor */}
      <div className="flex-1">
        <h1 className="mb-6 text-2xl font-bold">글 쓰기</h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full rounded-md border border-zinc-300 px-4 py-2 text-lg font-semibold dark:border-zinc-700 dark:bg-zinc-900"
          />

          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="태그 (쉼표로 구분: AI, 논문리뷰, 딥러닝)"
            className="w-full rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />

          <MarkdownEditor value={body} onChange={setBody} />

          <ImageUpload
            onUploaded={(url) => {
              setBody((prev) => prev + `\n![이미지](${url})\n`);
            }}
          />

          {message && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !body.trim()}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing || !currentDraft}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
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
