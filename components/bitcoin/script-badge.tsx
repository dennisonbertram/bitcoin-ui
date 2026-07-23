import type { ComponentProps } from "react";

import { getScriptLabel, type ScriptType } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { badgeStyles, type BitcoinVisualProps } from "./shared";

export type ScriptBadgeProps = Omit<ComponentProps<"span">, "children"> &
  BitcoinVisualProps & {
    type: ScriptType;
  };

export function ScriptBadge({
  type,
  unstyled,
  className,
  ...props
}: ScriptBadgeProps) {
  return (
    <span
      data-slot="script-badge"
      data-script-type={type}
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        [
          badgeStyles,
          "rounded-[var(--radius-xs)] bg-[var(--color-surface)] font-mono text-[0.6875rem] font-medium text-[var(--color-muted-strong)]",
          type === "p2tr" &&
            "border-[var(--color-bitcoin)]/30 bg-[var(--color-bitcoin-soft)] text-[var(--color-bitcoin-ink)]",
          type === "op-return" &&
            "border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
        ],
        className,
      )}
      {...props}
    >
      {getScriptLabel(type)}
    </span>
  );
}
