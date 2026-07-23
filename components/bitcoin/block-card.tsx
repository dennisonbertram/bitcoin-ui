import { Box, Database, Scale, Timer } from "lucide-react";
import type { ComponentProps } from "react";

import {
  formatBlockHeight,
  formatBytes,
  formatRelativeTime,
  formatTimestamp,
  formatWeight,
  toDate,
  type BitcoinBlock,
} from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { BitcoinAmount } from "./bitcoin-amount";
import { HashDisplay } from "./hash-display";
import { panelStyles, type BitcoinVisualProps } from "./shared";

export type BlockCardProps = Omit<ComponentProps<"article">, "children"> &
  BitcoinVisualProps & {
    block: BitcoinBlock;
    hashHref?: string;
    now?: number | Date;
  };

export function BlockCard({
  block,
  hashHref,
  now,
  unstyled,
  className,
  ...props
}: BlockCardProps) {
  const timestamp = formatTimestamp(block.timestamp);

  return (
    <article
      data-slot="block-card"
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        [panelStyles, "grid min-w-0 gap-5 p-5"],
        className,
      )}
      {...props}
    >
      <header
        data-slot="block-card-header"
        className={componentClasses(
          unstyled,
          "flex min-w-0 items-start justify-between gap-4",
        )}
      >
        <div className="min-w-0">
          <p
            className={componentClasses(
              unstyled,
              "text-xs text-[var(--color-muted)]",
            )}
          >
            Block
          </p>
          <h3
            className={componentClasses(
              unstyled,
              "mt-1 font-mono text-xl font-medium tabular-nums tracking-[-0.03em]",
            )}
          >
            {formatBlockHeight(block.height)}
          </h3>
        </div>
        <time
          dateTime={toDate(block.timestamp).toISOString()}
          title={timestamp}
          className={componentClasses(
            unstyled,
            "shrink-0 text-xs text-[var(--color-muted)]",
          )}
        >
          {formatRelativeTime(block.timestamp, now)}
        </time>
      </header>
      <HashDisplay
        value={block.hash}
        label="Block hash"
        href={hashHref}
        unstyled={unstyled}
      />
      <dl
        data-slot="block-card-stats"
        className={componentClasses(
          unstyled,
          "grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[var(--color-rule-subtle)] pt-4",
        )}
      >
        <BlockMetric
          icon={Database}
          label="Transactions"
          value={new Intl.NumberFormat("en-US").format(block.transactionCount)}
          unstyled={unstyled}
        />
        <BlockMetric
          icon={Box}
          label="Size"
          value={formatBytes(block.size)}
          unstyled={unstyled}
        />
        <BlockMetric
          icon={Scale}
          label="Weight"
          value={formatWeight(block.weight)}
          unstyled={unstyled}
        />
        {block.feeTotal !== undefined ? (
          <div>
            <dt
              className={componentClasses(
                unstyled,
                "text-xs text-[var(--color-muted)]",
              )}
            >
              Fees
            </dt>
            <dd className={componentClasses(unstyled, "mt-1")}>
              <BitcoinAmount
                value={block.feeTotal}
                unit="btc"
                maximumFractionDigits={4}
                unstyled={unstyled}
              />
            </dd>
          </div>
        ) : (
          <BlockMetric
            icon={Timer}
            label="Miner"
            value={block.miner ?? "Unknown"}
            unstyled={unstyled}
          />
        )}
      </dl>
      {block.miner ? (
        <p
          data-slot="block-card-miner"
          className={componentClasses(
            unstyled,
            "border-t border-[var(--color-rule-subtle)] pt-4 text-xs text-[var(--color-muted)]",
          )}
        >
          Mined by{" "}
          <span className="font-medium text-[var(--color-ink)]">
            {block.miner}
          </span>
        </p>
      ) : null}
    </article>
  );
}

function BlockMetric({
  icon: Icon,
  label,
  value,
  unstyled,
}: {
  icon: typeof Box;
  label: string;
  value: string;
  unstyled?: boolean;
}) {
  return (
    <div>
      <dt
        className={componentClasses(
          unstyled,
          "flex items-center gap-1.5 text-xs text-[var(--color-muted)]",
        )}
      >
        <Icon aria-hidden="true" className="size-3" />
        {label}
      </dt>
      <dd
        className={componentClasses(
          unstyled,
          "mt-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm font-medium tabular-nums",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
