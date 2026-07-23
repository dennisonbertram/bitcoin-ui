import type { ComponentProps } from "react";

import {
  formatBtc,
  formatSats,
  resolveAmountUnit,
  type AmountUnit,
  type SatoshiValue,
} from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import type { BitcoinVisualProps } from "./shared";

export type BitcoinAmountProps = Omit<ComponentProps<"span">, "children"> &
  BitcoinVisualProps & {
    /** Amount in satoshis. bigint is recommended for exact values. */
    value: SatoshiValue;
    /**
     * Display unit. `auto` switches to BTC at 1,000,000 sats.
     * @default "auto"
     */
    unit?: AmountUnit;
    /** Includes the visible unit label. @default true */
    showUnit?: boolean;
    /** Smallest number of BTC decimal places to preserve. @default 0 */
    minimumFractionDigits?: number;
    /** Largest number of BTC decimal places to preserve. @default 8 */
    maximumFractionDigits?: number;
  };

export function BitcoinAmount({
  value,
  unit = "auto",
  showUnit = true,
  minimumFractionDigits = 0,
  maximumFractionDigits = 8,
  unstyled,
  className,
  ...props
}: BitcoinAmountProps) {
  const resolvedUnit = resolveAmountUnit(value, unit);
  const amount =
    resolvedUnit === "btc"
      ? formatBtc(value, { minimumFractionDigits, maximumFractionDigits })
      : formatSats(value);

  return (
    <span
      data-slot="bitcoin-amount"
      data-unit={resolvedUnit}
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        "inline-flex items-baseline gap-1 whitespace-nowrap font-mono text-sm font-medium tabular-nums tracking-[-0.02em]",
        className,
      )}
      {...props}
    >
      <span data-slot="bitcoin-amount-value">{amount}</span>
      {showUnit ? (
        <span
          data-slot="bitcoin-amount-unit"
          className={componentClasses(
            unstyled,
            "font-sans text-[0.72em] font-medium tracking-normal text-[var(--color-muted)]",
          )}
        >
          {resolvedUnit === "btc" ? "BTC" : "sat"}
        </span>
      ) : null}
    </span>
  );
}
