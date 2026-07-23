"use client";

import { Check, Copy, X } from "lucide-react";
import { type ComponentProps, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CopyState = "idle" | "loading" | "success" | "error";

export type CopyButtonProps = Omit<ComponentProps<"button">, "children"> & {
  value: string;
  label?: string;
  compact?: boolean;
};

export function CopyButton({
  value,
  label = "Copy",
  compact,
  className,
  ...props
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copy() {
    setState("loading");
    try {
      await navigator.clipboard.writeText(value);
      setState("success");
    } catch {
      setState("error");
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 1_800);
  }

  const visibleLabel =
    state === "success" ? "Copied" : state === "error" ? "Retry" : label;
  const Icon = state === "success" ? Check : state === "error" ? X : Copy;

  return (
    <button
      data-state={state}
      type="button"
      onClick={copy}
      disabled={state === "loading"}
      aria-label={visibleLabel}
      className={cn(
        "gallery-control inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-rule)] bg-[var(--color-surface-raised)] px-3 text-xs font-medium whitespace-nowrap outline-none transition-[opacity,transform,background-color,border-color,color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:bg-[var(--color-surface-hover)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 data-[state=success]:border-[var(--color-success)]/30 data-[state=success]:text-[var(--color-success)] data-[state=error]:border-[var(--color-danger)]/30 data-[state=error]:text-[var(--color-danger)]",
        compact && "size-11 min-h-11 px-0",
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {compact ? <span className="sr-only">{visibleLabel}</span> : visibleLabel}
      <span className="sr-only" role="status" aria-live="polite">
        {state === "success" || state === "error" ? visibleLabel : ""}
      </span>
    </button>
  );
}
