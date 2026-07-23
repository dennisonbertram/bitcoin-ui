import type { ComponentProps } from "react";

import {
  formatBlockHeight,
  formatRelativeTime,
  type BitcoinBlock,
} from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { HashDisplay } from "./hash-display";
import { type BitcoinVisualProps } from "./shared";

export type BlockListProps = Omit<ComponentProps<"ol">, "children"> &
  BitcoinVisualProps & {
    blocks: BitcoinBlock[];
    now?: number | Date;
    getHref?: (block: BitcoinBlock) => string | undefined;
  };

export function BlockList({
  blocks,
  now,
  getHref,
  unstyled,
  className,
  ...props
}: BlockListProps) {
  return (
    <ol
      data-slot="block-list"
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        "m-0 list-none divide-y divide-[var(--color-rule-subtle)] p-0",
        className,
      )}
      {...props}
    >
      {blocks.map((block) => (
        <li
          key={block.hash}
          data-slot="block-list-item"
          className={componentClasses(
            unstyled,
            "grid min-w-0 gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center",
          )}
        >
          <span
            className={componentClasses(
              unstyled,
              "font-mono text-sm font-medium tabular-nums",
            )}
          >
            {formatBlockHeight(block.height)}
          </span>
          <HashDisplay
            value={block.hash}
            label="Block hash"
            href={getHref?.(block)}
            unstyled={unstyled}
          />
          <span
            className={componentClasses(
              unstyled,
              "text-xs text-[var(--color-muted)] sm:text-right",
            )}
          >
            {block.transactionCount.toLocaleString("en-US")} tx
            <span aria-hidden="true"> · </span>
            <span className="sr-only">, </span>
            {formatRelativeTime(block.timestamp, now)}
          </span>
        </li>
      ))}
    </ol>
  );
}
