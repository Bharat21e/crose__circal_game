import type { Mark } from "@/lib/game";

export default function MarkIcon({ mark }: { mark: Mark }) {
  if (mark === "cross") {
    return (
      <svg viewBox="0 0 100 100" className="mark mark-cross" aria-hidden="true">
        <path d="M24 24 L76 76" pathLength={1} />
        <path d="M76 24 L24 76" pathLength={1} style={{ animationDelay: "120ms" }} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className="mark mark-circle" aria-hidden="true">
      <circle cx="50" cy="50" r="28" pathLength={1} />
    </svg>
  );
  
}


