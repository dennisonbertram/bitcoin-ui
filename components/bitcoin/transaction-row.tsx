import type { ComponentProps } from "react";

import {
  feeRateFrom,
  formatFeeRate,
  formatRelativeTime,
  toDate,
  type BitcoinTransaction,
} from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { BitcoinAmount } from "./bitcoin-amount";
import { ConfirmationProgress } from "./confirmation-progress";
import { HashDisplay } from "./hash-display";
import { type BitcoinVisualProps } from "./shared";
import { StatusBadge } from "./status-badge";

export type TransactionRowProps = Omit<ComponentProps<"article">, "children"> &
  BitcoinVisualProps & {
    transaction: BitcoinTransaction;
    href?: string;
    now?: number | Date;
  };

export function TransactionRow({
  transaction,
  href,
  now,
  unstyled,
  className,
  ...props
}: TransactionRowProps) {
  const feeRate = feeRateFrom(transaction.fee, transaction.vsize);

  return (
    <article
      data-slot="transaction-row"
      data-state={transaction.state}
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        "grid min-w-0 gap-4 border-b border-[var(--color-rule-subtle)] py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
        className,
      )}
      {...props}
    >
      <div className="grid min-w-0 gap-2">
        <HashDisplay
          value={transaction.txid}
          label="Transaction ID"
          href={href}
          unstyled={unstyled}
        />
        <div
          className={componentClasses(
            unstyled,
            "flex flex-wrap items-center gap-x-3 gap-y-2",
          )}
        >
          <StatusBadge state={transaction.state} unstyled={unstyled} />
          <span
            className={componentClasses(
              unstyled,
              "font-mono text-xs tabular-nums text-[var(--color-muted)]",
            )}
          >
            {formatFeeRate(feeRate)}
          </span>
          {transaction.timestamp ? (
            <time
              dateTime={toDate(transaction.timestamp).toISOString()}
              className={componentClasses(
                unstyled,
                "text-xs text-[var(--color-muted)]",
              )}
            >
              {formatRelativeTime(transaction.timestamp, now)}
            </time>
          ) : null}
        </div>
      </div>
      <div
        className={componentClasses(
          unstyled,
          "grid justify-items-start gap-2 sm:justify-items-end",
        )}
      >
        <BitcoinAmount value={transaction.value} unstyled={unstyled} />
        {transaction.state === "confirmed" ? (
          <ConfirmationProgress
            confirmations={transaction.confirmations ?? 0}
            showLabel={false}
            className="w-28"
            unstyled={unstyled}
          />
        ) : (
          <span
            className={componentClasses(
              unstyled,
              "font-mono text-xs tabular-nums text-[var(--color-muted)]",
            )}
          >
            {new Intl.NumberFormat("en-US").format(transaction.vsize)} vB
          </span>
        )}
      </div>
    </article>
  );
}
