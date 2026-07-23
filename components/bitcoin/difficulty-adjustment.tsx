import type { ComponentProps } from "react";

import { clampPercent, formatBlockHeight } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { panelStyles, type BitcoinVisualProps } from "./shared";

export type DifficultyAdjustmentProps = Omit<
  ComponentProps<"section">,
  "children"
> &
  BitcoinVisualProps & {
    currentHeight: number;
    epochStartHeight: number;
    projectedChange: number;
    remainingBlocks: number;
    estimatedTime?: string;
  };

export function DifficultyAdjustment({
  currentHeight,
  epochStartHeight,
  projectedChange,
  remainingBlocks,
  estimatedTime,
  unstyled,
  className,
  ...props
}: DifficultyAdjustmentProps) {
  const elapsedBlocks = Math.max(0, currentHeight - epochStartHeight);
  const percent = clampPercent((elapsedBlocks / 2_016) * 100);
  const changeLabel = `${projectedChange >= 0 ? "+" : ""}${projectedChange.toFixed(2)}%`;

  return (
    <section
      data-slot="difficulty-adjustment"
      data-direction={projectedChange >= 0 ? "up" : "down"}
      data-unstyled={unstyled || undefined}
      aria-label="Difficulty adjustment"
      className={componentClasses(
        unstyled,
        [panelStyles, "grid gap-5 p-5"],
        className,
      )}
      {...props}
    >
      <div
        className={componentClasses(
          unstyled,
          "flex items-baseline justify-between gap-4",
        )}
      >
        <div>
          <h3
            className={componentClasses(unstyled, "text-sm font-medium")}
          >
            Difficulty epoch
          </h3>
          <p
            className={componentClasses(
              unstyled,
              "mt-1 font-mono text-xs tabular-nums text-[var(--color-muted)]",
            )}
          >
            Block {formatBlockHeight(currentHeight)}
          </p>
        </div>
        <span
          data-slot="difficulty-adjustment-change"
          className={componentClasses(
            unstyled,
            [
              "font-mono text-lg font-medium tabular-nums",
              projectedChange >= 0
                ? "text-[var(--color-success)]"
                : "text-[var(--color-danger)]",
            ],
          )}
        >
          {changeLabel}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Difficulty epoch progress"
        aria-valuemin={0}
        aria-valuemax={2016}
        aria-valuenow={Math.min(elapsedBlocks, 2016)}
        aria-valuetext={`${elapsedBlocks} of 2,016 blocks`}
        className={componentClasses(
          unstyled,
          "h-2 overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-surface-active)]",
        )}
      >
        <span
          aria-hidden="true"
          className={componentClasses(
            unstyled,
            "block h-full rounded-[var(--radius-full)] bg-[var(--color-ink)]",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        className={componentClasses(
          unstyled,
          "flex flex-wrap justify-between gap-2 text-xs text-[var(--color-muted)]",
        )}
      >
        <span>{new Intl.NumberFormat("en-US").format(remainingBlocks)} blocks left</span>
        {estimatedTime ? <span>Est. {estimatedTime}</span> : null}
      </div>
    </section>
  );
}
