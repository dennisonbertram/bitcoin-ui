import type { ComponentProps } from "react";

export type BitcoinVisualProps = {
  /**
   * Removes all default visual classes while preserving semantics, data
   * attributes, accessibility behavior, and the consumer's className.
   * @default false
   */
  unstyled?: boolean;
};

export type BitcoinDivProps = ComponentProps<"div"> & BitcoinVisualProps;

export const interactiveStyles =
  "outline-none transition-[opacity,transform,background-color,border-color,color] duration-[var(--dur-base)] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45";

export const badgeStyles =
  "inline-flex min-h-6 items-center gap-1.5 rounded-[var(--radius-full)] border px-2 py-0.5 text-xs font-medium leading-none whitespace-nowrap";

export const panelStyles =
  "rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface-raised)]";

export const monoStyles =
  "font-mono text-[0.8125rem] tabular-nums tracking-[-0.01em]";
