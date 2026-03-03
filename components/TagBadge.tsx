"use client";

interface Props {
  name: string;
  color: string;
  onRemove?: () => void;
}

export default function TagBadge({ name, color, onRemove }: Props) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-gray-600 bg-cream/60">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      {name}
      {onRemove && (
        <button onClick={onRemove} className="text-gray-400 hover:text-danger ml-0.5">
          &times;
        </button>
      )}
    </span>
  );
}
