"use client";

import { useState, useEffect, useCallback } from "react";
import { Tag } from "@/lib/types";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((data: Tag[]) => {
        setTags(data);
        setLoaded(true);
      });
  }, []);

  const createTag = useCallback(async (name: string, color: string) => {
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    });
    const tag: Tag = await res.json();
    setTags((prev) => [...prev, tag]);
  }, []);

  const deleteTag = useCallback(async (tagId: string) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    fetch(`/api/tags/${tagId}`, { method: "DELETE" });
  }, []);

  return { tags, createTag, deleteTag, loaded };
}
