import type { ComponentProps } from "react";

import { getNetworkLabel, type BitcoinNetwork } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { badgeStyles, type BitcoinVisualProps } from "./shared";

const networkStyles: Record<BitcoinNetwork, string> = {
  mainnet:
    "border-[var(--color-bitcoin)]/30 bg-[var(--color-bitcoin-soft)] text-[var(--color-bitcoin-ink)]",
  testnet:
    "border-[var(--color-info)]/30 bg-[var(--color-info-soft)] text-[var(--color-info)]",
  signet:
    "border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  regtest:
    "border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-muted-strong)]",
};

export type NetworkBadgeProps = Omit<ComponentProps<"span">, "children"> &
  BitcoinVisualProps & {
    network: BitcoinNetwork;
    /** Shows the small network indicator dot. @default true */
    showIndicator?: boolean;
  };

export function NetworkBadge({
  network,
  showIndicator = true,
  unstyled,
  className,
  ...props
}: NetworkBadgeProps) {
  return (
    <span
      data-slot="network-badge"
      data-network={network}
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        [badgeStyles, networkStyles[network]],
        className,
      )}
      {...props}
    >
      {showIndicator ? (
        <span
          data-slot="network-badge-indicator"
          aria-hidden="true"
          className={componentClasses(
            unstyled,
            "size-1.5 rounded-full bg-current",
          )}
        />
      ) : null}
      {getNetworkLabel(network)}
    </span>
  );
}
