"use client";

import { Check, Copy, ExternalLink, X } from "lucide-react";
import {
  type ComponentProps,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { truncateMiddle } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import {
  interactiveStyles,
  monoStyles,
  type BitcoinVisualProps,
} from "./shared";

type CopyState = "idle" | "loading" | "success" | "error";

export type HashDisplayProps = Omit<ComponentProps<"span">, "children"> &
  BitcoinVisualProps & {
    value: string;
    label?: string;
    href?: string;
    copyable?: boolean;
    startCharacters?: number;
    endCharacters?: number;
    /** Shows the entire value instead of truncating it. @default false */
    full?: boolean;
  };

export function HashDisplay({
  value,
  label = "Hash",
  href,
  copyable = true,
  startCharacters = 8,
  endCharacters = 8,
  full = false,
  unstyled,
  className,
  ...props
}: HashDisplayProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function handleCopy(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setCopyState("loading");

    try {
      await navigator.clipboard.writeText(value);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyState("idle"), 1_800);
  }

  const visibleValue = full
    ? value
    : truncateMiddle(value, startCharacters, endCharacters);
  const statusLabel = {
    idle: `Copy ${label.toLowerCase()}`,
    loading: `Copying ${label.toLowerCase()}`,
    success: `${label} copied`,
    error: `Could not copy ${label.toLowerCase()}`,
  }[copyState];
  const StatusIcon =
    copyState === "success" ? Check : copyState === "error" ? X : Copy;

  return (
    <span
      data-slot="hash-display"
      data-state={copyState}
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        "inline-flex min-w-0 max-w-full items-center gap-1.5",
        className,
      )}
      {...props}
    >
      {href ? (
        <a
          data-slot="hash-display-link"
          href={href}
          title={value}
          className={componentClasses(
            unstyled,
            [
              monoStyles,
              "inline-flex min-h-11 min-w-0 items-center overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-muted-strong)] underline decoration-[var(--color-rule-strong)] underline-offset-4 hover:text-[var(--color-ink)] hover:decoration-current sm:min-h-0",
              interactiveStyles,
            ],
          )}
        >
          {visibleValue}
          <span className="sr-only">, open {label.toLowerCase()}</span>
          <ExternalLink
            aria-hidden="true"
            className={componentClasses(
              unstyled,
              "ml-1 inline size-3 align-[-0.08em]",
            )}
          />
        </a>
      ) : (
        <span
          data-slot="hash-display-value"
          title={value}
          className={componentClasses(
            unstyled,
            [monoStyles, "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"],
          )}
        >
          {visibleValue}
        </span>
      )}
      {copyable ? (
        <button
          data-slot="hash-display-copy"
          data-state={copyState}
          type="button"
          onClick={handleCopy}
          disabled={copyState === "loading"}
          aria-label={statusLabel}
          className={componentClasses(
            unstyled,
            [
              interactiveStyles,
              "inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-transparent text-[var(--color-muted)] hover:border-[var(--color-rule)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] data-[state=success]:text-[var(--color-success)] data-[state=error]:text-[var(--color-danger)] sm:size-7",
            ],
          )}
        >
          <StatusIcon aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}
      <span className="sr-only" role="status" aria-live="polite">
        {copyState === "success" || copyState === "error" ? statusLabel : ""}
      </span>
    </span>
  );
}
