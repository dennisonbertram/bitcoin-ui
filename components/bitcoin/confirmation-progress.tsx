import type { ComponentProps } from "react";

import { clampPercent } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import type { BitcoinVisualProps } from "./shared";

export type ConfirmationProgressProps = Omit<
  ComponentProps<"div">,
  "children"
> &
  BitcoinVisualProps & {
    confirmations: number;
    /** Confirmation target used for the progress calculation. @default 6 */
    target?: number;
    /** Shows the confirmation count beneath the track. @default true */
    showLabel?: boolean;
  };

export function ConfirmationProgress({
  confirmations,
  target = 6,
  showLabel = true,
  unstyled,
  className,
  ...props
}: ConfirmationProgressProps) {
  const safeTarget = Math.max(1, target);
  const safeConfirmations = Math.max(0, confirmations);
  const percent = clampPercent((safeConfirmations / safeTarget) * 100);
  const complete = safeConfirmations >= safeTarget;
  const label = complete
    ? `${safeConfirmations} confirmations, final`
    : `${safeConfirmations} of ${safeTarget} confirmations`;

  return (
    <div
      data-slot="confirmation-progress"
      data-state={complete ? "complete" : "confirming"}
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        "grid min-w-32 gap-1.5",
        className,
      )}
      {...props}
    >
      <div
        data-slot="confirmation-progress-track"
        role="progressbar"
        aria-label="Transaction confirmations"
        aria-valuemin={0}
        aria-valuemax={safeTarget}
        aria-valuenow={Math.min(safeConfirmations, safeTarget)}
        aria-valuetext={label}
        className={componentClasses(
          unstyled,
          "h-1.5 overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-surface-active)]",
        )}
      >
        <span
          data-slot="confirmation-progress-value"
          aria-hidden="true"
          className={componentClasses(
            unstyled,
            "block h-full rounded-[var(--radius-full)] bg-[var(--color-bitcoin)]",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel ? (
        <span
          data-slot="confirmation-progress-label"
          className={componentClasses(
            unstyled,
            "text-xs text-[var(--color-muted)]",
          )}
        >
          {complete
            ? `${safeConfirmations} confirmations`
            : `${safeConfirmations} / ${safeTarget} confirmations`}
        </span>
      ) : null}
    </div>
  );
}
