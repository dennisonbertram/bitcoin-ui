import {
  CircleAlert,
  CircleCheck,
  Clock3,
  Replace,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps } from "react";

import type { TransactionState } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { badgeStyles, type BitcoinVisualProps } from "./shared";

const statusConfig: Record<
  TransactionState,
  { label: string; icon: LucideIcon; styles: string }
> = {
  confirmed: {
    label: "Confirmed",
    icon: CircleCheck,
    styles:
      "border-[var(--color-success)]/30 bg-[var(--color-success-soft)] text-[var(--color-success)]",
  },
  pending: {
    label: "In mempool",
    icon: Clock3,
    styles:
      "border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  },
  replaced: {
    label: "Replaced",
    icon: Replace,
    styles:
      "border-[var(--color-info)]/30 bg-[var(--color-info-soft)] text-[var(--color-info)]",
  },
  conflicted: {
    label: "Conflicted",
    icon: CircleAlert,
    styles:
      "border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  },
};

export type StatusBadgeProps = Omit<ComponentProps<"span">, "children"> &
  BitcoinVisualProps & {
    state: TransactionState;
    label?: string;
    showIcon?: boolean;
  };

export function StatusBadge({
  state,
  label,
  showIcon = true,
  unstyled,
  className,
  ...props
}: StatusBadgeProps) {
  const config = statusConfig[state];
  const Icon = config.icon;

  return (
    <span
      data-slot="status-badge"
      data-state={state}
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        [badgeStyles, config.styles],
        className,
      )}
      {...props}
    >
      {showIcon ? (
        <Icon
          data-slot="status-badge-icon"
          className={componentClasses(unstyled, "size-3")}
          aria-hidden="true"
        />
      ) : null}
      {label ?? config.label}
    </span>
  );
}
