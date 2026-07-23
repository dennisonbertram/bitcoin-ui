import type { ComponentProps } from "react";

import {
  BitcoinSearch,
  BlockList,
  FeeEstimates,
  MempoolMeter,
  NetworkBadge,
  NetworkStats,
  TransactionRow,
  type BitcoinSearchSubmit,
  type NetworkStat,
} from "@/components/bitcoin";
import type {
  BitcoinBlock,
  BitcoinNetwork,
  BitcoinTransaction,
  FeeEstimate,
} from "@/lib/bitcoin";
import { cn } from "@/lib/utils";

export type BitcoinExplorerProps = Omit<ComponentProps<"section">, "children"> & {
  network: BitcoinNetwork;
  blocks: BitcoinBlock[];
  transactions: BitcoinTransaction[];
  stats: NetworkStat[];
  feeEstimates: FeeEstimate[];
  mempool: {
    size: number;
    transactionCount: number;
    medianFeeRate: number;
    capacity?: number;
  };
  onSearch: (search: BitcoinSearchSubmit) => void | Promise<void>;
  heading?: string;
  now?: number | Date;
  unstyled?: boolean;
};

/**
 * A data-source-agnostic block explorer composition.
 *
 * Pass data from Bitcoin Core, Esplora, Electrum, or your own indexer. The
 * block performs no fetching and makes no trust assumptions.
 */
export function BitcoinExplorer({
  network,
  blocks,
  transactions,
  stats,
  feeEstimates,
  mempool,
  onSearch,
  heading = "Bitcoin explorer",
  now,
  unstyled,
  className,
  ...props
}: BitcoinExplorerProps) {
  return (
    <section
      data-slot="bitcoin-explorer"
      data-unstyled={unstyled || undefined}
      className={cn(!unstyled && "grid min-w-0 gap-8", className)}
      {...props}
    >
      <header
        className={cn(
          !unstyled &&
            "grid min-w-0 gap-5 border-b border-[var(--color-rule)] pb-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start",
        )}
      >
        <div>
          <h1
            className={cn(
              !unstyled &&
                "text-3xl font-medium tracking-[-0.04em] [overflow-wrap:anywhere]",
            )}
          >
            {heading}
          </h1>
          <p
            className={cn(
              !unstyled && "mt-2 text-sm text-[var(--color-muted)]",
            )}
          >
            Read chain state from your configured source.
          </p>
        </div>
        <NetworkBadge network={network} unstyled={unstyled} />
      </header>

      <BitcoinSearch onSearch={onSearch} unstyled={unstyled} />
      <NetworkStats stats={stats} unstyled={unstyled} />

      <div
        className={cn(
          !unstyled &&
            "grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]",
        )}
      >
        <div
          className={cn(
            !unstyled &&
              "min-w-0 rounded-[var(--radius-lg)] border border-[var(--color-rule)] p-4 sm:p-6",
          )}
        >
          <h2 className={cn(!unstyled && "mb-5 text-lg font-medium")}>
            Recent blocks
          </h2>
          <BlockList blocks={blocks} now={now} unstyled={unstyled} />
        </div>
        <div className={cn(!unstyled && "grid content-start gap-4")}>
          <MempoolMeter {...mempool} unstyled={unstyled} />
          <FeeEstimates
            estimates={feeEstimates}
            defaultSelectedBlocks={feeEstimates[0]?.blocks}
            unstyled={unstyled}
          />
        </div>
      </div>

      <div>
        <h2 className={cn(!unstyled && "mb-2 text-lg font-medium")}>
          Recent transactions
        </h2>
        {transactions.map((transaction) => (
          <TransactionRow
            key={transaction.txid}
            transaction={transaction}
            now={now}
            unstyled={unstyled}
          />
        ))}
      </div>
    </section>
  );
}
