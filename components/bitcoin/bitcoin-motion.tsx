"use client";

import {
  useId,
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";

import {
  clampPercent,
  formatFeeRate,
  formatSats,
  formatWeight,
  truncateMiddle,
  type SatoshiValue,
} from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import styles from "./bitcoin-motion.module.css";
import type { BitcoinVisualProps } from "./shared";

type MotionProps = BitcoinVisualProps & {
  /** Pauses motion without changing the represented state. @default false */
  paused?: boolean;
};

type MotionStyle = CSSProperties & {
  "--motion-column"?: number;
  "--motion-index"?: number;
  "--motion-lane"?: number;
};

export type AnimatedConfirmationsProps = Omit<
  ComponentProps<"div">,
  "children"
> &
  MotionProps & {
    confirmations: number;
    /** Confirmation target represented by the relay. @default 6 */
    target?: number;
  };

export function AnimatedConfirmations({
  confirmations,
  target = 6,
  paused,
  unstyled,
  className,
  ...props
}: AnimatedConfirmationsProps) {
  const safeTarget = Math.max(1, Math.floor(target));
  const safeConfirmations = Math.max(0, Math.floor(confirmations));
  const boundedConfirmations = Math.min(safeConfirmations, safeTarget);
  const remaining = Math.max(0, safeTarget - boundedConfirmations);
  const complete = boundedConfirmations >= safeTarget;
  const valueText = complete
    ? `${safeConfirmations} confirmations, finality target reached`
    : `${boundedConfirmations} of ${safeTarget} confirmations`;

  return (
    <div
      data-slot="animated-confirmations"
      data-state={complete ? "complete" : "confirming"}
      data-paused={paused || undefined}
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        styles.confirmations,
        className,
      )}
      {...props}
    >
      <header className={componentClasses(unstyled, styles.motionHeader)}>
        <span>Confirmation relay</span>
        <output aria-live="polite">
          {boundedConfirmations} / {safeTarget}
        </output>
      </header>
      <div
        data-slot="animated-confirmations-progress"
        role="progressbar"
        aria-label="Transaction confirmation relay"
        aria-valuemin={0}
        aria-valuemax={safeTarget}
        aria-valuenow={boundedConfirmations}
        aria-valuetext={valueText}
        className={componentClasses(unstyled, styles.confirmationProgress)}
      >
        <ol
          className={componentClasses(unstyled, styles.confirmationRail)}
          aria-hidden="true"
        >
          {Array.from({ length: safeTarget }, (_, index) => {
            const confirmed = index < boundedConfirmations;

            return (
              <li
                key={index}
                data-state={confirmed ? "confirmed" : "pending"}
                className={componentClasses(
                  unstyled,
                  styles.confirmationNode,
                )}
                style={{ "--motion-index": index } as MotionStyle}
              >
                <span>{index + 1}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <p className={componentClasses(unstyled, styles.motionCaption)}>
        {complete
          ? "Finality target reached."
          : `${remaining} ${remaining === 1 ? "block" : "blocks"} until the display target.`}
      </p>
    </div>
  );
}

export type CandidateBlockMetadata = {
  /** Label shown at the top of the metadata surface. @default "Candidate block" */
  label?: string;
  /** Current assembly state. @default "Assembling" */
  status?: string;
  /** Transactions currently selected for the candidate block. */
  transactionCount?: number;
  /** Candidate block weight in weight units. */
  weight?: number;
  /** Aggregate transaction fees selected for the candidate block. */
  feeTotal?: SatoshiValue;
};

export type MempoolPacketMetadata = {
  /** Optional sample label. @default "Transaction sample" */
  label?: string;
  /** Caller-supplied transaction id for this sample. */
  txid?: string;
  /** Fee rate in sat/vB. */
  feeRate?: number;
  /** Virtual transaction size in vbytes. */
  vsize?: number;
  /** Queue state. @default "Waiting" */
  status?: string;
};

export type MempoolFlowProps = Omit<ComponentProps<"figure">, "children"> &
  MotionProps & {
    transactionCount: number;
    /** Normalized pressure from 0 to 1. */
    pressure: number;
    /** Number of visual packets. Clamped from 8 to 32. @default 20 */
    packetCount?: number;
    /**
     * Transaction samples represented across the animated field and exposed
     * through a keyboard- and touch-accessible inspector.
     */
    packetSamples?: readonly MempoolPacketMetadata[];
    /** Optional caller-supplied metadata for the candidate block preview. */
    candidateBlock?: CandidateBlockMetadata;
  };

export function MempoolFlow({
  transactionCount,
  pressure,
  packetCount = 20,
  packetSamples = [],
  candidateBlock,
  paused,
  unstyled,
  className,
  ...props
}: MempoolFlowProps) {
  const metadataId = useId();
  const sampleInspectorId = useId();
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const safeCount = Math.max(0, Math.floor(transactionCount));
  const normalizedPressure = clampPercent(pressure * 100);
  const visualPackets = Math.min(32, Math.max(8, Math.floor(packetCount)));
  const filledSlots = Math.max(1, Math.round(normalizedPressure / 25));
  const metadataLabel = candidateBlock?.label ?? "Candidate block";
  const metadataStatus = candidateBlock?.status ?? "Assembling";
  const activeSample =
    packetSamples.length > 0
      ? packetSamples[
          Math.min(selectedSampleIndex, packetSamples.length - 1)
        ]
      : undefined;
  const candidateTransactionCount =
    candidateBlock?.transactionCount === undefined
      ? undefined
      : Math.max(0, Math.floor(candidateBlock.transactionCount));
  const label = `${new Intl.NumberFormat("en-US").format(
    safeCount,
  )} transactions at ${Math.round(normalizedPressure)} percent pressure, flowing toward the next block`;

  return (
    <figure
      data-slot="mempool-flow"
      data-state={
        normalizedPressure >= 75
          ? "high"
          : normalizedPressure >= 40
            ? "medium"
            : "low"
      }
      data-paused={paused || undefined}
      data-unstyled={unstyled || undefined}
      role="group"
      aria-label={label}
      className={componentClasses(unstyled, styles.mempool, className)}
      {...props}
    >
      <figcaption
        className={componentClasses(unstyled, styles.motionHeader)}
      >
        <span>
          Mempool pressure
          {packetSamples.length > 0 ? (
            <small className={componentClasses(unstyled, styles.packetHint)}>
              Inspect samples below
            </small>
          ) : null}
        </span>
        <span>{Math.round(normalizedPressure)}%</span>
      </figcaption>
      <div className={componentClasses(unstyled, styles.mempoolField)}>
        <div
          className={componentClasses(unstyled, styles.packetField)}
          aria-hidden="true"
        >
          {Array.from({ length: visualPackets }, (_, index) => {
            const lane = index % 4;
            const sample =
              packetSamples.length > 0
                ? packetSamples[index % packetSamples.length]
                : undefined;

            return (
              <span
                key={index}
                data-slot="mempool-packet"
                data-lane={lane}
                data-sample={sample ? (index % packetSamples.length) + 1 : undefined}
                className={componentClasses(unstyled, styles.mempoolPacket)}
                style={
                  {
                    "--motion-column": index % 5,
                    "--motion-index": index,
                    "--motion-lane": lane,
                  } as MotionStyle
                }
              >
                <i />
                <i />
                <span
                  data-slot="mempool-packet-metadata"
                  hidden={unstyled || undefined}
                  className={componentClasses(unstyled, styles.packetTooltip)}
                >
                  <strong>{sample?.label ?? "Transaction packet"}</strong>
                  <span>
                    <small>Visual packet</small>
                    <b>
                      {index + 1} / {visualPackets}
                    </b>
                  </span>
                  <span>
                    <small>Visual lane</small>
                    <b>{lane + 1} / 4</b>
                  </span>
                  {sample?.txid ? (
                    <span>
                      <small>Txid</small>
                      <b title={sample.txid}>
                        {truncateMiddle(sample.txid, 5, 5)}
                      </b>
                    </span>
                  ) : null}
                  {sample?.feeRate !== undefined ? (
                    <span>
                      <small>Fee rate</small>
                      <b>{formatFeeRate(sample.feeRate)}</b>
                    </span>
                  ) : null}
                  {sample?.vsize !== undefined ? (
                    <span>
                      <small>Virtual size</small>
                      <b>{Math.max(0, Math.round(sample.vsize))} vB</b>
                    </span>
                  ) : null}
                  <span>
                    <small>State</small>
                    <b>{sample?.status ?? "Waiting"}</b>
                  </span>
                </span>
              </span>
            );
          })}
        </div>
        <div
          data-slot="candidate-block"
          data-open={metadataOpen || undefined}
          className={componentClasses(unstyled, styles.blockAperture)}
        >
          <button
            type="button"
            data-slot="candidate-block-trigger"
            aria-controls={metadataId}
            aria-expanded={metadataOpen}
            className={componentClasses(unstyled, styles.blockSummary)}
            onClick={() => setMetadataOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setMetadataOpen(false);
              }
            }}
          >
            <span
              className={componentClasses(unstyled, styles.blockLabel)}
            >
              <span>Next block</span>
              <small>Inspect</small>
            </span>
            <span
              className={componentClasses(unstyled, styles.blockSlots)}
              aria-hidden="true"
            >
              {Array.from({ length: 4 }, (_, index) => (
                <i
                  key={index}
                  data-slot="candidate-block-slot"
                  data-state={index < filledSlots ? "filled" : "empty"}
                />
              ))}
            </span>
          </button>
          <aside
            id={metadataId}
            data-slot="candidate-block-metadata"
            aria-label={`${metadataLabel} metadata`}
            aria-hidden={!metadataOpen}
            hidden={unstyled && !metadataOpen ? true : undefined}
            className={componentClasses(unstyled, styles.blockTooltip)}
          >
            <header
              className={componentClasses(
                unstyled,
                styles.blockTooltipHeader,
              )}
            >
              <strong>{metadataLabel}</strong>
              <span>{metadataStatus}</span>
            </header>
            <dl
              className={componentClasses(
                unstyled,
                styles.blockMetadata,
              )}
            >
              {candidateTransactionCount !== undefined ? (
                <div>
                  <dt>Transactions</dt>
                  <dd>
                    {new Intl.NumberFormat("en-US").format(
                      candidateTransactionCount,
                    )}
                  </dd>
                </div>
              ) : null}
              {candidateBlock?.weight !== undefined ? (
                <div>
                  <dt>Weight</dt>
                  <dd>{formatWeight(candidateBlock.weight)}</dd>
                </div>
              ) : null}
              {candidateBlock?.feeTotal !== undefined ? (
                <div>
                  <dt>Fees</dt>
                  <dd>{formatSats(candidateBlock.feeTotal)} sat</dd>
                </div>
              ) : null}
              <div>
                <dt>Pressure</dt>
                <dd>{Math.round(normalizedPressure)}%</dd>
              </div>
              <div>
                <dt>Capacity signal</dt>
                <dd>{filledSlots} / 4 slots</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
      {activeSample ? (
        <section
          data-slot="mempool-sample-inspector"
          aria-labelledby={`${sampleInspectorId}-label`}
          className={componentClasses(unstyled, styles.sampleInspector)}
        >
          <header className={componentClasses(unstyled, styles.sampleHeader)}>
            <span id={`${sampleInspectorId}-label`}>Transaction samples</span>
            <small>Keyboard and touch accessible</small>
          </header>
          <div className={componentClasses(unstyled, styles.sampleLayout)}>
            <div
              className={componentClasses(unstyled, styles.sampleButtons)}
              aria-label="Choose a transaction sample"
            >
              {packetSamples.map((sample, index) => {
                const selected =
                  index ===
                  Math.min(selectedSampleIndex, packetSamples.length - 1);

                return (
                  <button
                    key={`${sample.txid ?? sample.label ?? "sample"}-${index}`}
                    type="button"
                    data-slot="mempool-sample-trigger"
                    data-state={selected ? "selected" : "idle"}
                    aria-pressed={selected}
                    onClick={() => setSelectedSampleIndex(index)}
                  >
                    <span>Sample {index + 1}</span>
                    <code title={sample.txid}>
                      {sample.txid
                        ? truncateMiddle(sample.txid, 5, 5)
                        : "No txid"}
                    </code>
                  </button>
                );
              })}
            </div>
            <aside
              data-slot="mempool-sample-metadata"
              aria-label={`${activeSample.label ?? "Transaction sample"} metadata`}
              aria-live="polite"
              className={componentClasses(unstyled, styles.sampleMetadata)}
            >
              <header>
                <strong>
                  {activeSample.label ?? "Transaction sample"}
                </strong>
                <span>{activeSample.status ?? "Waiting"}</span>
              </header>
              <dl>
                {activeSample.txid ? (
                  <div>
                    <dt>Txid</dt>
                    <dd title={activeSample.txid}>
                      {truncateMiddle(activeSample.txid, 8, 8)}
                    </dd>
                  </div>
                ) : null}
                {activeSample.feeRate !== undefined ? (
                  <div>
                    <dt>Fee rate</dt>
                    <dd>{formatFeeRate(activeSample.feeRate)}</dd>
                  </div>
                ) : null}
                {activeSample.vsize !== undefined ? (
                  <div>
                    <dt>Virtual size</dt>
                    <dd>
                      {Math.max(0, Math.round(activeSample.vsize))} vB
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>State</dt>
                  <dd>{activeSample.status ?? "Waiting"}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>
      ) : null}
      <div className={componentClasses(unstyled, styles.mempoolScale)}>
        <span>Waiting</span>
        <span>Fee pressure</span>
        <span>Candidate block</span>
      </div>
    </figure>
  );
}

export type BitcoinSpinnerVariant = "hash" | "blocks" | "sync";

export type BitcoinSpinnerProps = Omit<ComponentProps<"div">, "children"> &
  MotionProps & {
    /** Semantic loader treatment. @default "hash" */
    variant?: BitcoinSpinnerVariant;
    /** Accessible and optionally visible status label. */
    label?: string;
    /** Shows the status label next to the loader. @default false */
    showLabel?: boolean;
    /** Visual size. @default "md" */
    size?: "sm" | "md" | "lg";
  };

export function BitcoinSpinner({
  variant = "hash",
  label = "Verifying Bitcoin data",
  showLabel = false,
  size = "md",
  paused,
  unstyled,
  className,
  ...props
}: BitcoinSpinnerProps) {
  return (
    <div
      data-slot="bitcoin-spinner"
      data-variant={variant}
      data-size={size}
      data-state={paused ? "paused" : "loading"}
      data-paused={paused || undefined}
      data-unstyled={unstyled || undefined}
      role="status"
      aria-live="polite"
      aria-label={label}
      className={componentClasses(unstyled, styles.spinner, className)}
      {...props}
    >
      <span
        className={componentClasses(unstyled, styles.spinnerVisual)}
        aria-hidden="true"
      >
        {variant === "blocks" ? (
          <span className={componentClasses(unstyled, styles.blockSpinner)}>
            <i />
            <i />
            <i />
          </span>
        ) : (
          <svg viewBox="0 0 48 48" focusable="false">
            <circle cx="24" cy="24" r="17" />
            <circle cx="24" cy="24" r="10" />
            {variant === "hash" ? <path d="M17 24h14M20 18l-2 12M30 18l-2 12" /> : null}
          </svg>
        )}
      </span>
      {showLabel ? (
        <span className={componentClasses(unstyled, styles.spinnerLabel)}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

export type UtxoMotionNode = {
  id: string;
  label: string;
  value: bigint | number | string;
};

export type UtxoMerkleFlowProps = Omit<
  ComponentProps<"section">,
  "children"
> &
  MotionProps & {
    inputs: UtxoMotionNode[];
    outputs: UtxoMotionNode[];
    transactionId: string;
    merkleRoot: string;
    /** Number of sibling hashes in the proof path. @default 3 */
    proofDepth?: number;
  };

export function UtxoMerkleFlow({
  inputs,
  outputs,
  transactionId,
  merkleRoot,
  proofDepth = 3,
  paused,
  unstyled,
  className,
  ...props
}: UtxoMerkleFlowProps) {
  const safeDepth = Math.min(6, Math.max(1, Math.floor(proofDepth)));
  const txLabel = truncateMiddle(transactionId, 6, 6);
  const rootLabel = truncateMiddle(merkleRoot, 6, 6);

  return (
    <section
      data-slot="utxo-merkle-flow"
      data-paused={paused || undefined}
      data-unstyled={unstyled || undefined}
      aria-label="Relationship between transaction outputs and Merkle inclusion"
      className={componentClasses(unstyled, styles.utxoMerkle, className)}
      {...props}
    >
      <header className={componentClasses(unstyled, styles.motionHeader)}>
        <span>State and history</span>
        <span>One transaction · two views</span>
      </header>

      <div className={componentClasses(unstyled, styles.relationshipMap)}>
        <div
          className={componentClasses(unstyled, styles.proofAxis)}
          role="group"
          aria-label={`Transaction ${txLabel} is a Merkle tree leaf with a proof depth of ${safeDepth}, resolving to root ${rootLabel}`}
        >
          <span className={componentClasses(unstyled, styles.axisTitle)}>
            Historical inclusion
          </span>
          <div className={componentClasses(unstyled, styles.merkleTree)}>
            <div
              data-slot="merkle-root-node"
              className={componentClasses(unstyled, styles.rootNode)}
            >
              <span>Merkle root</span>
              <code title={merkleRoot}>{rootLabel}</code>
            </div>
            <div
              className={componentClasses(unstyled, styles.branchNodes)}
              aria-hidden="true"
            >
              {Array.from({ length: safeDepth }, (_, index) => (
                <span key={index}>H{index + 1}</span>
              ))}
            </div>
            <div
              data-slot="merkle-leaf-node"
              className={componentClasses(unstyled, styles.leafNode)}
            >
              <span>Transaction leaf</span>
              <code title={transactionId}>{txLabel}</code>
            </div>
            <span
              className={componentClasses(unstyled, styles.proofSignal)}
              aria-hidden="true"
            />
          </div>
        </div>

        <div
          className={componentClasses(unstyled, styles.relationshipHinge)}
          role="note"
          aria-label={`The Merkle leaf and UTXO state transition refer to the same transaction ${txLabel}`}
        >
          <span>Same transaction</span>
          <code>{txLabel}</code>
        </div>

        <div
          className={componentClasses(unstyled, styles.stateAxis)}
          role="group"
          aria-label={`${inputs.length} unspent outputs are consumed and ${outputs.length} new unspent outputs are created`}
        >
          <div
            data-slot="spent-utxos"
            className={componentClasses(unstyled, styles.utxoColumn)}
          >
            <span className={componentClasses(unstyled, styles.axisTitle)}>
              UTXOs consumed
            </span>
            <ul>
              {inputs.map((input, index) => (
                <li
                  key={input.id}
                  data-state="spent"
                  style={{ "--motion-index": index } as MotionStyle}
                >
                  <span>{input.label}</span>
                  <code title={input.id}>{truncateMiddle(input.id, 5, 4)}</code>
                  <strong>{formatSats(input.value)} sat</strong>
                </li>
              ))}
            </ul>
          </div>

          <div
            data-slot="transaction-state-node"
            className={componentClasses(unstyled, styles.transactionNode)}
          >
            <span>Transaction</span>
            <code title={transactionId}>{txLabel}</code>
            <small>
              {inputs.length} in · {outputs.length} out
            </small>
          </div>

          <div
            data-slot="created-utxos"
            className={componentClasses(unstyled, styles.utxoColumn)}
          >
            <span className={componentClasses(unstyled, styles.axisTitle)}>
              UTXOs created
            </span>
            <ul>
              {outputs.map((output, index) => (
                <li
                  key={output.id}
                  data-state="unspent"
                  style={{ "--motion-index": index } as MotionStyle}
                >
                  <span>{output.label}</span>
                  <code title={output.id}>{truncateMiddle(output.id, 5, 4)}</code>
                  <strong>{formatSats(output.value)} sat</strong>
                </li>
              ))}
            </ul>
          </div>

          <span
            className={componentClasses(unstyled, styles.stateSignal)}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className={componentClasses(unstyled, styles.relationshipNote)}>
        <p>
          <strong>UTXO set</strong>
          Spendable state derived from transaction outputs.
        </p>
        <p>
          <strong>Merkle root</strong>
          Inclusion commitment to transactions in one block.
        </p>
      </div>
    </section>
  );
}
