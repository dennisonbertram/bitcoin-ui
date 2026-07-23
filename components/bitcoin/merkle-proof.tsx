import { CornerDownRight, ShieldCheck } from "lucide-react";
import type { ComponentProps } from "react";

import { componentClasses } from "@/lib/utils";

import { HashDisplay } from "./hash-display";
import { panelStyles, type BitcoinVisualProps } from "./shared";

export interface MerkleProofNode {
  hash: string;
  side: "left" | "right";
}

export type MerkleProofProps = Omit<ComponentProps<"section">, "children"> &
  BitcoinVisualProps & {
    transactionId: string;
    merkleRoot: string;
    proof: MerkleProofNode[];
    verified?: boolean;
  };

export function MerkleProof({
  transactionId,
  merkleRoot,
  proof,
  verified,
  unstyled,
  className,
  ...props
}: MerkleProofProps) {
  return (
    <section
      data-slot="merkle-proof"
      data-state={verified ? "verified" : "unverified"}
      data-unstyled={unstyled || undefined}
      aria-label="Merkle proof"
      className={componentClasses(
        unstyled,
        [panelStyles, "grid min-w-0 gap-5 p-5"],
        className,
      )}
      {...props}
    >
      <header
        className={componentClasses(
          unstyled,
          "flex items-center justify-between gap-4",
        )}
      >
        <h3 className={componentClasses(unstyled, "text-sm font-medium")}>
          Merkle proof
        </h3>
        {verified ? (
          <span
            className={componentClasses(
              unstyled,
              "inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-success)]",
            )}
          >
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            Verified
          </span>
        ) : null}
      </header>
      <div>
        <p
          className={componentClasses(
            unstyled,
            "mb-1 text-xs text-[var(--color-muted)]",
          )}
        >
          Transaction
        </p>
        <HashDisplay
          value={transactionId}
          label="Transaction ID"
          unstyled={unstyled}
        />
      </div>
      <ol
        data-slot="merkle-proof-path"
        className={componentClasses(
          unstyled,
          "m-0 grid list-none gap-2 border-l border-[var(--color-rule)] p-0 pl-4",
        )}
      >
        {proof.map((node, index) => (
          <li
            key={`${node.hash}-${index}`}
            className={componentClasses(
              unstyled,
              "grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2",
            )}
          >
            <span
              className={componentClasses(
                unstyled,
                "inline-flex min-w-12 items-center gap-1 font-mono text-[0.6875rem] text-[var(--color-muted)]",
              )}
            >
              <CornerDownRight aria-hidden="true" className="size-3" />
              {node.side}
            </span>
            <HashDisplay
              value={node.hash}
              label={`Proof node ${index + 1}`}
              copyable={false}
              unstyled={unstyled}
            />
          </li>
        ))}
      </ol>
      <div
        className={componentClasses(
          unstyled,
          "border-t border-[var(--color-rule-subtle)] pt-4",
        )}
      >
        <p
          className={componentClasses(
            unstyled,
            "mb-1 text-xs text-[var(--color-muted)]",
          )}
        >
          Merkle root
        </p>
        <HashDisplay
          value={merkleRoot}
          label="Merkle root"
          unstyled={unstyled}
        />
      </div>
    </section>
  );
}
