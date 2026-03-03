"use client";

import { useState, useRef } from "react";

interface Props {
  onAdd: (text: string) => void;
}

export default function TaskInput({ onAdd }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!editing) {
    return (
      <button
        onClick={() => {
          setEditing(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="text-xs text-gray-400 py-1 hover:text-primary transition-colors"
      >
        + 추가
      </button>
    );
  }

  const submit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onAdd(trimmed);
    }
    setText("");
    setEditing(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex gap-1 py-1"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={submit}
        placeholder="할 일 입력..."
        className="flex-1 text-sm bg-transparent border-b border-gray-200 focus:border-primary outline-none py-0.5 placeholder-gray-300"
      />
    </form>
  );
}
