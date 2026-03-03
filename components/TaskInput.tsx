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
        className="text-[11px] text-gray-300 py-0.5 hover:text-olive-light transition-colors"
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
      className="flex gap-1 py-0.5"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={submit}
        placeholder="할 일 입력..."
        className="flex-1 text-[13px] bg-transparent border-b border-beige focus:border-olive outline-none py-0.5 placeholder-gray-300 transition-colors"
      />
    </form>
  );
}
