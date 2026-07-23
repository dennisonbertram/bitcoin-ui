import { ArrowDown, ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";

import type { TransactionEndpoint } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { BitcoinAmount } from "./bitcoin-amount";
import { HashDisplay } from "./hash-display";
import { ScriptBadge } from "./script-badge";
import { panelStyles, type BitcoinVisualProps } from "./shared";

export type TransactionFlowProps = Omit<
  ComponentProps<"section">,
  "children"
> &
  BitcoinVisualProps & {
    inputs: TransactionEndpoint[];
    outputs: TransactionEndpoint[];
    fee?: bigint | number | string;
  };

export function TransactionFlow({
  inputs,
  outputs,
  fee,
  unstyled,
  className,
  ...props
}: TransactionFlowProps) {
  return (
    <section
      data-slot="transaction-flow"
      data-unstyled={unstyled || undefined}
      aria-label="Transaction flow"
      className={componentClasses(
        unstyled,
        [
          panelStyles,
          "grid min-w-0 gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center",
        ],
        className,
      )}
      {...props}
    >
      <EndpointGroup
        label="Inputs"
        endpoints={inputs}
        unstyled={unstyled}
      />
      <div
        data-slot="transaction-flow-direction"
        className={componentClasses(
          unstyled,
          "flex items-center justify-center text-[var(--color-muted)]",
        )}
        aria-hidden="true"
      >
        <ArrowDown className="size-4 md:hidden" />
        <ArrowRight className="hidden size-4 md:block" />
      </div>
      <EndpointGroup
        label="Outputs"
        endpoints={outputs}
        unstyled={unstyled}
      />
      {fee !== undefined ? (
        <footer
          data-slot="transaction-flow-fee"
          className={componentClasses(
            unstyled,
            "flex items-center justify-between gap-4 border-t border-[var(--color-rule-subtle)] pt-4 text-xs md:col-span-3",
          )}
        >
          <span className={componentClasses(unstyled, "text-[var(--color-muted)]")}>
            Miner fee
          </span>
          <BitcoinAmount value={fee} unit="sat" unstyled={unstyled} />
        </footer>
      ) : null}
    </section>
  );
}

function EndpointGroup({
  label,
  endpoints,
  unstyled,
}: {
  label: string;
  endpoints: TransactionEndpoint[];
  unstyled?: boolean;
}) {
  return (
    <div data-slot={`transaction-${label.toLowerCase()}`}>
      <h3
        className={componentClasses(
          unstyled,
          "mb-2 text-xs font-medium text-[var(--color-muted)]",
        )}
      >
        {label}
      </h3>
      <ul
        className={componentClasses(
          unstyled,
          "m-0 grid list-none gap-2 p-0",
        )}
      >
        {endpoints.map((endpoint) => (
          <li
            key={endpoint.id}
            className={componentClasses(
              unstyled,
              "grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] p-3",
            )}
          >
            <div className="min-w-0">
              {endpoint.coinbase ? (
                <span
                  className={componentClasses(
                    unstyled,
                    "text-sm font-medium",
                  )}
                >
                  Coinbase
                </span>
              ) : endpoint.address ? (
                <HashDisplay
                  value={endpoint.address}
                  label="Address"
                  startCharacters={8}
                  endCharacters={6}
                  copyable={false}
                  unstyled={unstyled}
                />
              ) : (
                <span className={componentClasses(unstyled, "text-sm")}>
                  {endpoint.label ?? "Unknown"}
                </span>
              )}
              {endpoint.scriptType ? (
                <div className={componentClasses(unstyled, "mt-1.5")}>
                  <ScriptBadge
                    type={endpoint.scriptType}
                    unstyled={unstyled}
                  />
                </div>
              ) : null}
            </div>
            <BitcoinAmount
              value={endpoint.value}
              unit="sat"
              unstyled={unstyled}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
