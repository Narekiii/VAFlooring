"use client";

/** A submit button that asks before doing something that can't be undone. */
export function ConfirmButton({ children, message, className = "btn btnDanger btnSmall" }: { children: React.ReactNode; message: string; className?: string }) {
  return (
    <button
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
