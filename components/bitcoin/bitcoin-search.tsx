"use client";

import { Search } from "lucide-react";
import {
  type ComponentProps,
  type FormEvent,
  useId,
  useState,
} from "react";

import {
  classifyBitcoinQuery,
  type BitcoinSearchKind,
} from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import {
  interactiveStyles,
  type BitcoinVisualProps,
} from "./shared";

export type BitcoinSearchSubmit = {
  query: string;
  kind: BitcoinSearchKind;
};

export type BitcoinSearchProps = Omit<
  ComponentProps<"form">,
  "children" | "onSubmit"
> &
  BitcoinVisualProps & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onSearch: (search: BitcoinSearchSubmit) => void | Promise<void>;
    label?: string;
    placeholder?: string;
    loading?: boolean;
    error?: string;
  };

export function BitcoinSearch({
  value,
  defaultValue = "",
  onValueChange,
  onSearch,
  label = "Search the Bitcoin chain",
  placeholder = "Block, transaction, or address",
  loading,
  error,
  unstyled,
  className,
  ...props
}: BitcoinSearchProps) {
  const inputId = useId();
  const helpId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalError, setInternalError] = useState<string>();
  const query = value ?? internalValue;
  const visibleError = error ?? internalError;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();
    const kind = classifyBitcoinQuery(normalized);

    if (!normalized) {
      setInternalError("Enter a block height, transaction ID, block hash, or address.");
      return;
    }

    if (kind === "unknown") {
      setInternalError("That does not look like a Bitcoin identifier.");
      return;
    }

    setInternalError(undefined);
    await onSearch({ query: normalized, kind });
  }

  function updateValue(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    setInternalError(undefined);
    onValueChange?.(nextValue);
  }

  return (
    <form
      data-slot="bitcoin-search"
      data-state={visibleError ? "error" : loading ? "loading" : "idle"}
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        "grid gap-2",
        className,
      )}
      onSubmit={handleSubmit}
      aria-busy={loading}
      {...props}
    >
      <label
        htmlFor={inputId}
        className={componentClasses(unstyled, "text-sm font-medium")}
      >
        {label}
      </label>
      <div
        data-slot="bitcoin-search-control"
        className={componentClasses(
          unstyled,
          [
            "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-surface-raised)] outline-2 outline-offset-1 outline-transparent focus-within:border-[var(--color-focus)] focus-within:outline-[var(--color-focus)]",
            visibleError &&
              "border-[var(--color-danger)] focus-within:border-[var(--color-danger)] focus-within:outline-[var(--color-danger)]",
          ],
        )}
      >
        <Search
          aria-hidden="true"
          className={componentClasses(
            unstyled,
            "ml-3 size-4 text-[var(--color-muted)]",
          )}
        />
        <input
          id={inputId}
          data-slot="bitcoin-search-input"
          type="search"
          value={query}
          onChange={(event) => updateValue(event.target.value)}
          placeholder={placeholder}
          disabled={loading}
          aria-invalid={Boolean(visibleError)}
          aria-describedby={helpId}
          autoComplete="off"
          spellCheck={false}
          className={componentClasses(
            unstyled,
            "min-h-12 min-w-0 border-0 bg-transparent px-3 font-mono text-sm outline-none placeholder:font-sans placeholder:text-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-45",
          )}
        />
        <button
          data-slot="bitcoin-search-submit"
          data-state={loading ? "loading" : visibleError ? "error" : "idle"}
          type="submit"
          disabled={loading}
          className={componentClasses(
            unstyled,
            [
              interactiveStyles,
              "mr-1 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-4 text-sm font-medium whitespace-nowrap text-[var(--color-paper)] hover:opacity-[0.88] data-[state=loading]:cursor-wait",
            ],
          )}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
      <p
        id={helpId}
        data-slot="bitcoin-search-message"
        role={visibleError ? "alert" : undefined}
        className={componentClasses(
          unstyled,
          [
            "min-h-5 text-xs text-[var(--color-muted)]",
            visibleError && "text-[var(--color-danger)]",
          ],
        )}
      >
        {visibleError ??
          "Accepts block heights, 64-character hashes, and Bitcoin addresses."}
      </p>
    </form>
  );
}
