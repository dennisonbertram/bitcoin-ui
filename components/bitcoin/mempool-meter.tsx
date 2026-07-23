import type { ComponentProps } from "react";

import { clampPercent, formatBytes, formatFeeRate } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { panelStyles, type BitcoinVisualProps } from "./shared";

export type MempoolMeterProps = Omit<ComponentProps<"section">, "children"> &
  BitcoinVisualProps & {
    size: number;
    transactionCount: number;
    medianFeeRate: number;
    /** Scale ceiling in bytes. @default 300_000_000 */
    capacity?: number;
  };

export function MempoolMeter({
  size,
  transactionCount,
  medianFeeRate,
  capacity = 300_000_000,
  unstyled,
  className,
  ...props
}: MempoolMeterProps) {
  const percent = clampPercent((Math.max(size, 0) / Math.max(capacity, 1)) * 100);

  return (
    <section
      data-slot="mempool-meter"
      data-unstyled={unstyled || undefined}
      aria-label="Mempool status"
      className={componentClasses(
        unstyled,
        [panelStyles, "grid gap-5 p-5"],
        className,
      )}
      {...props}
    >
      <header
        data-slot="mempool-meter-header"
        className={componentClasses(
          unstyled,
          "flex min-w-0 items-start justify-between gap-4",
        )}
      >
        <div>
          <h3
            className={componentClasses(
              unstyled,
              "text-sm font-medium tracking-[-0.01em]",
            )}
          >
            Mempool
          </h3>
          <p
            className={componentClasses(
              unstyled,
              "mt-1 text-xs text-[var(--color-muted)]",
            )}
          >
            {new Intl.NumberFormat("en-US").format(transactionCount)} transactions
          </p>
        </div>
        <span
          className={componentClasses(
            unstyled,
            "font-mono text-sm font-medium tabular-nums",
          )}
        >
          {formatBytes(size)}
        </span>
      </header>
      <div
        data-slot="mempool-meter-track"
        role="progressbar"
        aria-label="Mempool size"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={Math.min(Math.max(size, 0), capacity)}
        aria-valuetext={`${formatBytes(size)}, ${Math.round(percent)} percent of display capacity`}
        className={componentClasses(
          unstyled,
          "h-2 overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-surface-active)]",
        )}
      >
        <span
          data-slot="mempool-meter-value"
          aria-hidden="true"
          className={componentClasses(
            unstyled,
            "block h-full rounded-[var(--radius-full)] bg-[var(--color-bitcoin)]",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <dl
        className={componentClasses(
          unstyled,
          "grid grid-cols-2 gap-4 border-t border-[var(--color-rule-subtle)] pt-4",
        )}
      >
        <div>
          <dt
            className={componentClasses(
              unstyled,
              "text-xs text-[var(--color-muted)]",
            )}
          >
            Median fee
          </dt>
          <dd
            className={componentClasses(
              unstyled,
              "mt-1 font-mono text-sm font-medium tabular-nums",
            )}
          >
            {formatFeeRate(medianFeeRate)}
          </dd>
        </div>
        <div>
          <dt
            className={componentClasses(
              unstyled,
              "text-xs text-[var(--color-muted)]",
            )}
          >
            Load
          </dt>
          <dd
            className={componentClasses(
              unstyled,
              "mt-1 font-mono text-sm font-medium tabular-nums",
            )}
          >
            {Math.round(percent)}%
          </dd>
        </div>
      </dl>
    </section>
  );
}
