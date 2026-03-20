"use client";

import { useEffect, useRef, useState } from "react";
import { getPublishedPosts } from "@/lib/drafts/published";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TagInput({ value, onChange }: TagInputProps) {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 기존 태그 목록 불러오기
  useEffect(() => {
    getPublishedPosts()
      .then((drafts) => {
        const tagSet = new Set<string>();
        drafts.forEach((d) => d.tags?.forEach((t) => tagSet.add(t)));
        setAllTags([...tagSet].sort());
      })
      .catch(() => {});
  }, []);

  // 클릭 바깥 감지
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleChange(newValue: string) {
    onChange(newValue);

    // 마지막 쉼표 이후 입력 중인 태그
    const parts = newValue.split(",");
    const current = parts[parts.length - 1].trim().toLowerCase();
    const existing = parts.slice(0, -1).map((p) => p.trim().toLowerCase());

    if (current.length > 0) {
      const matched = allTags.filter(
        (tag) =>
          tag.toLowerCase().includes(current) &&
          !existing.includes(tag.toLowerCase())
      );
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }

  function selectTag(tag: string) {
    const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
    parts.pop(); // 입력 중이던 부분 제거
    parts.push(tag);
    onChange(parts.join(", ") + ", ");
    setShowSuggestions(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          const parts = value.split(",");
          const current = parts[parts.length - 1].trim();
          if (current.length > 0) handleChange(value);
        }}
        placeholder="태그 (쉼표로 구분: AI, 논문리뷰, 딥러닝)"
        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      {showSuggestions && (
        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
          {suggestions.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => selectTag(tag)}
                className="w-full px-4 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
