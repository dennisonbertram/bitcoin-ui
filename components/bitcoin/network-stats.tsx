import type { ComponentProps, ReactNode } from "react";

import { componentClasses } from "@/lib/utils";

import { panelStyles, type BitcoinVisualProps } from "./shared";

export interface NetworkStat {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
}

export type NetworkStatsProps = Omit<ComponentProps<"dl">, "children"> &
  BitcoinVisualProps & {
    stats: NetworkStat[];
  };

export function NetworkStats({
  stats,
  unstyled,
  className,
  ...props
}: NetworkStatsProps) {
  return (
    <dl
      data-slot="network-stats"
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        [
          panelStyles,
          "grid divide-y divide-[var(--color-rule-subtle)] overflow-hidden sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4",
        ],
        className,
      )}
      {...props}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          data-slot="network-stat"
          className={componentClasses(unstyled, "min-w-0 p-5")}
        >
          <dt
            className={componentClasses(
              unstyled,
              "text-xs text-[var(--color-muted)]",
            )}
          >
            {stat.label}
          </dt>
          <dd
            className={componentClasses(
              unstyled,
              "mt-2 min-w-0 overflow-hidden text-ellipsis font-mono text-lg font-medium tabular-nums tracking-[-0.025em]",
            )}
          >
            {stat.value}
          </dd>
          {stat.detail ? (
            <dd
              className={componentClasses(
                unstyled,
                "mt-1 text-xs text-[var(--color-muted)]",
              )}
            >
              {stat.detail}
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
