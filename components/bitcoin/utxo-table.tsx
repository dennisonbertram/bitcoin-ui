import type { ComponentProps } from "react";

import type { BitcoinUtxo } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { BitcoinAmount } from "./bitcoin-amount";
import { HashDisplay } from "./hash-display";
import { ScriptBadge } from "./script-badge";
import { panelStyles, type BitcoinVisualProps } from "./shared";

export type UtxoTableProps = Omit<ComponentProps<"div">, "children"> &
  BitcoinVisualProps & {
    utxos: BitcoinUtxo[];
    caption?: string;
    getTransactionHref?: (utxo: BitcoinUtxo) => string | undefined;
  };

export function UtxoTable({
  utxos,
  caption = "Unspent transaction outputs",
  getTransactionHref,
  unstyled,
  className,
  ...props
}: UtxoTableProps) {
  return (
    <div
      data-slot="utxo-table"
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        [panelStyles, "max-w-full overflow-x-auto"],
        className,
      )}
      {...props}
    >
      <table
        className={componentClasses(
          unstyled,
          "w-full min-w-[44rem] border-collapse text-left text-sm",
        )}
      >
        <caption
          className={componentClasses(
            unstyled,
            "border-b border-[var(--color-rule)] px-4 py-3 text-left text-sm font-medium",
          )}
        >
          {caption}
        </caption>
        <thead>
          <tr
            className={componentClasses(
              unstyled,
              "border-b border-[var(--color-rule-subtle)] text-xs text-[var(--color-muted)]",
            )}
          >
            <th className={componentClasses(unstyled, "px-4 py-3 font-normal")}>
              Outpoint
            </th>
            <th className={componentClasses(unstyled, "px-4 py-3 font-normal")}>
              Script
            </th>
            <th className={componentClasses(unstyled, "px-4 py-3 font-normal")}>
              Confirmations
            </th>
            <th
              className={componentClasses(
                unstyled,
                "px-4 py-3 text-right font-normal",
              )}
            >
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {utxos.map((utxo) => (
            <tr
              key={`${utxo.txid}:${utxo.vout}`}
              data-slot="utxo-table-row"
              data-spendable={utxo.spendable}
              className={componentClasses(
                unstyled,
                "border-b border-[var(--color-rule-subtle)] last:border-0 hover:bg-[var(--color-surface)]",
              )}
            >
              <td className={componentClasses(unstyled, "px-4 py-3")}>
                <div className="flex min-w-0 items-center">
                  <HashDisplay
                    value={utxo.txid}
                    label="Transaction ID"
                    href={getTransactionHref?.(utxo)}
                    startCharacters={7}
                    endCharacters={5}
                    unstyled={unstyled}
                  />
                  <span
                    className={componentClasses(
                      unstyled,
                      "font-mono text-xs text-[var(--color-muted)]",
                    )}
                  >
                    :{utxo.vout}
                  </span>
                </div>
              </td>
              <td className={componentClasses(unstyled, "px-4 py-3")}>
                <ScriptBadge type={utxo.scriptType} unstyled={unstyled} />
              </td>
              <td
                className={componentClasses(
                  unstyled,
                  "px-4 py-3 font-mono text-xs tabular-nums",
                )}
              >
                {utxo.confirmations.toLocaleString("en-US")}
              </td>
              <td
                className={componentClasses(
                  unstyled,
                  "px-4 py-3 text-right",
                )}
              >
                <BitcoinAmount
                  value={utxo.value}
                  unit="sat"
                  unstyled={unstyled}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
