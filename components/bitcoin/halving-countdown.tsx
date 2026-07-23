import type { ComponentProps } from "react";

import { formatBlockHeight } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { panelStyles, type BitcoinVisualProps } from "./shared";

export type HalvingCountdownProps = Omit<
  ComponentProps<"section">,
  "children"
> &
  BitcoinVisualProps & {
    currentHeight: number;
    halvingHeight: number;
    estimatedDate?: string;
    currentSubsidy?: number;
  };

export function HalvingCountdown({
  currentHeight,
  halvingHeight,
  estimatedDate,
  currentSubsidy = 3.125,
  unstyled,
  className,
  ...props
}: HalvingCountdownProps) {
  const remaining = Math.max(0, halvingHeight - currentHeight);
  const nextSubsidy = currentSubsidy / 2;

  return (
    <section
      data-slot="halving-countdown"
      data-unstyled={unstyled || undefined}
      aria-label="Bitcoin halving countdown"
      className={componentClasses(
        unstyled,
        [panelStyles, "grid gap-5 p-5"],
        className,
      )}
      {...props}
    >
      <div>
        <p
          className={componentClasses(
            unstyled,
            "text-xs text-[var(--color-muted)]",
          )}
        >
          Next halving
        </p>
        <p
          data-slot="halving-countdown-blocks"
          className={componentClasses(
            unstyled,
            "mt-2 font-mono text-3xl font-medium tabular-nums tracking-[-0.04em]",
          )}
        >
          {formatBlockHeight(remaining)}
          <span
            className={componentClasses(
              unstyled,
              "ml-2 font-sans text-sm font-normal tracking-normal text-[var(--color-muted)]",
            )}
          >
            blocks
          </span>
        </p>
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
            Target height
          </dt>
          <dd
            className={componentClasses(
              unstyled,
              "mt-1 font-mono text-sm font-medium tabular-nums",
            )}
          >
            {formatBlockHeight(halvingHeight)}
          </dd>
        </div>
        <div>
          <dt
            className={componentClasses(
              unstyled,
              "text-xs text-[var(--color-muted)]",
            )}
          >
            Next subsidy
          </dt>
          <dd
            className={componentClasses(
              unstyled,
              "mt-1 font-mono text-sm font-medium tabular-nums",
            )}
          >
            {nextSubsidy} BTC
          </dd>
        </div>
      </dl>
      {estimatedDate ? (
        <p
          className={componentClasses(
            unstyled,
            "text-xs text-[var(--color-muted)]",
          )}
        >
          Estimated {estimatedDate}. Block time is probabilistic.
        </p>
      ) : null}
    </section>
  );
}
