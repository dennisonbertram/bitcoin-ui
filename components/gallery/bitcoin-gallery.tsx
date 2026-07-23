"use client";

import {
  ArrowDown,
  PackageOpen,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";

import {
  AddressDisplay,
  AnimatedConfirmations,
  BitcoinAmount,
  BitcoinSearch,
  BitcoinSpinner,
  BlockCard,
  BlockList,
  ConfirmationProgress,
  DifficultyAdjustment,
  FeeEstimates,
  HalvingCountdown,
  HashDisplay,
  LongestChain,
  MempoolFlow,
  MempoolMeter,
  MerkleProof,
  NetworkBadge,
  NetworkStats,
  ScriptBadge,
  StatusBadge,
  TransactionFlow,
  TransactionRow,
  UtxoMerkleFlow,
  UtxoTable,
} from "@/components/bitcoin";
import {
  DEMO_NOW,
  demoAddress,
  demoBlocks,
  demoFees,
  demoHash,
  demoInputs,
  demoCanonicalChain,
  demoChainBranches,
  demoMempoolPacketSamples,
  demoMerkleProof,
  demoOutputs,
  demoStats,
  demoTransactions,
  demoTxid,
  demoUtxos,
} from "@/lib/demo-data";
import type { BitcoinSearchKind } from "@/lib/bitcoin";
import { ChainRelay } from "./chain-relay";
import { ComponentPreview } from "./component-preview";
import { CopyButton } from "./copy-button";
import { galleryCode } from "./gallery-code";

type StyleMode = "default" | "unstyled";

const navigation = [
  {
    label: "Start",
    items: [
      ["overview", "Overview"],
      ["explorer-composition", "Explorer composition"],
    ],
  },
  {
    label: "Motion",
    items: [
      ["motion-lab", "Motion lab"],
      ["animated-confirmations", "Confirmation relay"],
      ["mempool-flow", "Mempool flow"],
      ["bitcoin-spinners", "Bitcoin loaders"],
      ["utxo-merkle-flow", "UTXO and Merkle"],
      ["longest-chain", "Most-work chain"],
    ],
  },
  {
    label: "Foundations",
    items: [
      ["bitcoin-amount", "Bitcoin amount"],
      ["hash-display", "Hash display"],
      ["address-display", "Address display"],
      ["badges", "Protocol badges"],
    ],
  },
  {
    label: "Chain",
    items: [
      ["confirmation-progress", "Confirmations"],
      ["block-card", "Block card"],
      ["block-list", "Block list"],
      ["difficulty-adjustment", "Difficulty"],
      ["halving-countdown", "Halving"],
    ],
  },
  {
    label: "Transactions",
    items: [
      ["transaction-row", "Transaction row"],
      ["transaction-flow", "Transaction flow"],
      ["utxo-table", "UTXO table"],
    ],
  },
  {
    label: "Network",
    items: [
      ["fee-estimates", "Fee estimates"],
      ["mempool-meter", "Mempool meter"],
      ["network-stats", "Network stats"],
      ["merkle-proof", "Merkle proof"],
      ["bitcoin-search", "Bitcoin search"],
    ],
  },
] as const;

const suiteCommand =
  "npx shadcn@latest add dennisonbertram/bitcoin-ui/bitcoin-ui";

function formatSearchResult(kind: BitcoinSearchKind, query: string) {
  const label =
    kind === "block-height"
      ? "Block height"
      : kind === "hash"
        ? "Hash"
        : "Address";

  return `${label} · ${query}`;
}

export function BitcoinGallery() {
  const [styleMode, setStyleMode] = useState<StyleMode>("default");
  const styleModeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [searchResult, setSearchResult] = useState(
    "Enter a block height, hash, or address.",
  );
  const [motionCycle, setMotionCycle] = useState(0);
  const [motionPaused, setMotionPaused] = useState(false);
  const unstyled = styleMode === "unstyled";
  const motionInputs = demoInputs.map((input, index) => ({
    id: `${demoHash}:${index}`,
    label: `Input ${index + 1} · ${input.scriptType}`,
    value: input.value,
  }));
  const motionOutputs = demoOutputs.map((output, index) => ({
    id: `${demoTxid}:${index}`,
    label: `Output ${index + 1} · ${output.scriptType}`,
    value: output.value,
  }));

  function handleStyleModeKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const modes = ["default", "unstyled"] as const;
    let nextIndex: number;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        nextIndex = (index + 1) % modes.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        nextIndex = (index - 1 + modes.length) % modes.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = modes.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setStyleMode(modes[nextIndex]);
    styleModeRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="gallery-shell">
      <div className="gallery-ambient" aria-hidden="true" />
      <a
        href="#main"
        className="gallery-skip"
      >
        Skip to content
      </a>
      <header className="gallery-header">
        <div className="gallery-header__inner">
          <a href="#overview" className="gallery-brand">
            <span aria-hidden="true" className="gallery-brand__mark">
              ₿
            </span>
            <span className="gallery-brand__name">Bitcoin UI</span>
            <span className="gallery-brand__meta">
              v0.1.0 · 24 components
            </span>
          </a>
          <div className="gallery-header__actions">
            <div
              role="radiogroup"
              aria-label="Preview style"
              className="gallery-mode-control"
            >
              {(["default", "unstyled"] as const).map((mode, index) => (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={styleMode === mode}
                  tabIndex={styleMode === mode ? 0 : -1}
                  data-state={styleMode === mode ? "selected" : "idle"}
                  ref={(node) => {
                    styleModeRefs.current[index] = node;
                  }}
                  onClick={() => setStyleMode(mode)}
                  onKeyDown={(event) =>
                    handleStyleModeKeyDown(event, index)
                  }
                >
                  {mode}
                </button>
              ))}
            </div>
            <a href="#installation" className="gallery-install-link">
              <PackageOpen aria-hidden="true" className="size-4" />
              <span>Install</span>
            </a>
          </div>
        </div>
      </header>

      <div className="gallery-layout">
        <aside className="gallery-index">
          <div className="gallery-index__inner">
            <nav aria-label="Component index">
              {navigation.map((group) => (
                <div key={group.label} className="gallery-index__group">
                  <p className="gallery-index__label">{group.label}</p>
                  <ul className="gallery-index__list">
                    {group.items.map(([href, label]) => (
                      <li key={href}>
                        <a
                          href={`#${href}`}
                          className="gallery-index__link"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main id="main" className="gallery-main">
          <section id="overview" className="gallery-hero">
            <div className="gallery-hero__composition">
              <div
                className="gallery-hero__copy gallery-reveal"
                style={{ "--reveal-order": 0 } as CSSProperties}
              >
                <h1>Bitcoin UIs suck. The tooling does too.</h1>
                <p className="gallery-hero__lede">
                  Bitcoin UI fixes both: clear, composable shadcn components
                  for explorers, wallets, and node tools. Bring your own data.
                </p>
                <ul className="gallery-hero__tech" aria-label="Built with">
                  <li>React</li>
                  <li>TypeScript</li>
                  <li>shadcn</li>
                  <li>unstyled-first</li>
                </ul>
                <div id="installation" className="gallery-install">
                  <span className="gallery-install__label">
                    Install all components
                  </span>
                  <div className="gallery-install__command">
                    <code>{suiteCommand}</code>
                    <CopyButton value={suiteCommand} compact />
                  </div>
                </div>
              </div>
              <div
                className="gallery-reveal"
                style={{ "--reveal-order": 1 } as CSSProperties}
              >
                <ChainRelay />
              </div>
            </div>
            <div
              className="gallery-hero__tools gallery-reveal"
              style={{ "--reveal-order": 2 } as CSSProperties}
            >
              <div className="gallery-hero__search">
                <BitcoinSearch
                  onSearch={({ query, kind }) =>
                    setSearchResult(formatSearchResult(kind, query))
                  }
                  unstyled={unstyled}
                />
                <p
                  className="gallery-hero__status"
                  role="status"
                  aria-live="polite"
                >
                  {searchResult}
                </p>
              </div>
              <div>
                <NetworkStats stats={demoStats} unstyled={unstyled} />
                <p className="gallery-hero__disclosure">
                  Fixture data. No network requests.
                </p>
              </div>
            </div>
          </section>

          <section
            id="explorer-composition"
            className="gallery-section scroll-mt-24"
          >
            <SectionHeader
              title="Explorer composition"
              description="A complete explorer view composed from exported components. Connect Bitcoin Core, Esplora, Electrum, or your own indexer."
            />
            <div className="gallery-composition">
              <div className="gallery-composition__grid">
                <div className="min-w-0 rounded-[var(--radius-lg)] border border-[var(--color-rule)] p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-rule)] pb-5">
                    <div>
                      <p className="text-xs text-[var(--color-muted)]">
                        Latest block
                      </p>
                      <h2 className="mt-1 text-2xl font-medium tracking-[-0.035em]">
                        905,742
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <NetworkBadge network="mainnet" unstyled={unstyled} />
                      <StatusBadge state="confirmed" unstyled={unstyled} />
                    </div>
                  </div>
                  <div className="py-4">
                    <BlockList
                      blocks={demoBlocks.slice(0, 3)}
                      now={DEMO_NOW}
                      unstyled={unstyled}
                    />
                  </div>
                  <div className="border-t border-[var(--color-rule)] pt-2">
                    {demoTransactions.slice(0, 2).map((transaction) => (
                      <TransactionRow
                        key={transaction.txid}
                        transaction={transaction}
                        now={DEMO_NOW}
                        unstyled={unstyled}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid min-w-0 content-start gap-4">
                  <MempoolMeter
                    size={182_400_000}
                    transactionCount={84_291}
                    medianFeeRate={11}
                    unstyled={unstyled}
                  />
                  <FeeEstimates
                    estimates={demoFees}
                    defaultSelectedBlocks={3}
                    unstyled={unstyled}
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            id="motion-lab"
            className="gallery-section scroll-mt-24"
          >
            <div className="motion-lab__heading">
              <SectionHeader
                title="Motion lab"
                description="Inspect, replay, or pause motion that explains Bitcoin state."
              />
              <div
                className="motion-lab__controls"
                role="group"
                aria-label="Motion demonstration controls"
              >
                <button
                  type="button"
                  className="motion-lab__button"
                  onClick={() => {
                    setMotionPaused(false);
                    setMotionCycle((cycle) => cycle + 1);
                  }}
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                  Replay
                </button>
                <button
                  type="button"
                  className="motion-lab__button"
                  data-state={motionPaused ? "paused" : "playing"}
                  aria-pressed={motionPaused}
                  onClick={() => setMotionPaused((paused) => !paused)}
                >
                  {motionPaused ? (
                    <Play aria-hidden="true" className="size-4" />
                  ) : (
                    <Pause aria-hidden="true" className="size-4" />
                  )}
                  {motionPaused ? "Resume" : "Pause"}
                </button>
              </div>
            </div>

            <div className="gallery-section__items">
              <ComponentPreview
                id="animated-confirmations"
                title="Animated confirmation relay"
                description="Shows confirmation depth against a target while preserving progressbar semantics."
                registryName="bitcoin-motion"
                code={galleryCode.animatedConfirmations}
              >
                <AnimatedConfirmations
                  key={`confirmations-${motionCycle}`}
                  confirmations={4}
                  target={6}
                  paused={motionPaused}
                  unstyled={unstyled}
                />
              </ComponentPreview>

              <ComponentPreview
                id="mempool-flow"
                title="Mempool pressure field"
                description="Shows queue pressure and candidate-block assembly. Select a transaction to inspect its metadata."
                registryName="bitcoin-motion"
                code={galleryCode.mempoolFlow}
                wide
              >
                <MempoolFlow
                  key={`mempool-${motionCycle}`}
                  transactionCount={84_291}
                  pressure={0.72}
                  packetSamples={demoMempoolPacketSamples}
                  candidateBlock={{
                    label: "Fixture candidate",
                    transactionCount: demoBlocks[0].transactionCount,
                    weight: demoBlocks[0].weight,
                    feeTotal: demoBlocks[0].feeTotal,
                  }}
                  paused={motionPaused}
                  unstyled={unstyled}
                />
              </ComponentPreview>

              <ComponentPreview
                id="bitcoin-spinners"
                title="Bitcoin work indicators"
                description="Loaders for hashing, block assembly, and header sync. Reduced motion uses opacity."
                registryName="bitcoin-motion"
                code={galleryCode.spinners}
              >
                <div className="motion-lab__spinners">
                  <BitcoinSpinner
                    key={`hash-${motionCycle}`}
                    variant="hash"
                    label="Hashing block header"
                    showLabel
                    paused={motionPaused}
                    unstyled={unstyled}
                  />
                  <BitcoinSpinner
                    key={`blocks-${motionCycle}`}
                    variant="blocks"
                    label="Assembling candidate block"
                    showLabel
                    paused={motionPaused}
                    unstyled={unstyled}
                  />
                  <BitcoinSpinner
                    key={`sync-${motionCycle}`}
                    variant="sync"
                    label="Syncing block headers"
                    showLabel
                    paused={motionPaused}
                    unstyled={unstyled}
                  />
                </div>
              </ComponentPreview>

              <ComponentPreview
                id="utxo-merkle-flow"
                title="UTXO state × Merkle history"
                description="Shows one transaction in two systems: UTXOs consumed and created, and a txid committed to a Merkle root."
                registryName="bitcoin-motion"
                code={galleryCode.utxoMerkleFlow}
                wide
              >
                <UtxoMerkleFlow
                  key={`utxo-merkle-${motionCycle}`}
                  inputs={motionInputs}
                  outputs={motionOutputs}
                  transactionId={demoTxid}
                  merkleRoot={demoHash}
                  proofDepth={demoMerkleProof.length}
                  paused={motionPaused}
                  unstyled={unstyled}
                />
              </ComponentPreview>

              <ComponentPreview
                id="longest-chain"
                title="Most-work chain"
                description="Compares the canonical chain with competing, stale, and orphan branches. Select any block to inspect its metadata."
                registryName="longest-chain"
                code={galleryCode.longestChain}
                wide
              >
                <LongestChain
                  key={`longest-chain-${motionCycle}`}
                  canonical={demoCanonicalChain}
                  branches={demoChainBranches}
                  description="Fixture: the branch with the most accumulated proof of work is canonical."
                  paused={motionPaused}
                  unstyled={unstyled}
                />
              </ComponentPreview>
            </div>
          </section>

          <ComponentSection
            title="Foundations"
            description="Amounts, hashes, addresses, and protocol labels."
          >
            <ComponentPreview
              id="bitcoin-amount"
              title="Bitcoin amount"
              description="Formats sats and BTC exactly, without floating-point arithmetic."
              registryName="bitcoin-amount"
              code={galleryCode.amount}
            >
              <div className="flex flex-wrap items-baseline gap-6">
                <BitcoinAmount
                  value={12_845_210}
                  unit="sat"
                  unstyled={unstyled}
                />
                <BitcoinAmount
                  value={245_000_000}
                  unit="btc"
                  unstyled={unstyled}
                />
                <BitcoinAmount
                  value={86_300}
                  unit="auto"
                  unstyled={unstyled}
                />
              </div>
            </ComponentPreview>

            <ComponentPreview
              id="hash-display"
              title="Hash display"
              description="Truncates long hashes while preserving the full value for copying."
              registryName="hash-display"
              code={galleryCode.hash}
            >
              <HashDisplay
                value={demoTxid}
                label="Transaction ID"
                unstyled={unstyled}
              />
            </ComponentPreview>

            <ComponentPreview
              id="address-display"
              title="Address display"
              description="Shows a copyable address with network and script metadata."
              registryName="address-display"
              code={galleryCode.address}
            >
              <AddressDisplay
                address={demoAddress}
                label="Receiving address"
                network="mainnet"
                scriptType="p2wpkh"
                unstyled={unstyled}
              />
            </ComponentPreview>

            <ComponentPreview
              id="badges"
              title="Protocol badges"
              description="Labels networks, transaction states, and script types without relying on color."
              registryName="protocol-badges"
              code={galleryCode.badges}
            >
              <div className="flex flex-wrap gap-2">
                <NetworkBadge network="mainnet" unstyled={unstyled} />
                <NetworkBadge network="signet" unstyled={unstyled} />
                <StatusBadge state="confirmed" unstyled={unstyled} />
                <StatusBadge state="pending" unstyled={unstyled} />
                <ScriptBadge type="p2tr" unstyled={unstyled} />
                <ScriptBadge type="op-return" unstyled={unstyled} />
              </div>
            </ComponentPreview>
          </ComponentSection>

          <ComponentSection
            title="Chain"
            description="Blocks, confirmations, difficulty, and issuance."
          >
            <ComponentPreview
              id="confirmation-progress"
              title="Confirmation progress"
              description="Shows confirmation depth against a configurable target."
              registryName="confirmation-progress"
              code={galleryCode.confirmations}
            >
              <div className="grid max-w-md gap-6">
                <ConfirmationProgress
                  confirmations={2}
                  target={6}
                  unstyled={unstyled}
                />
                <ConfirmationProgress
                  confirmations={12}
                  target={6}
                  unstyled={unstyled}
                />
              </div>
            </ComponentPreview>

            <ComponentPreview
              id="block-card"
              title="Block card"
              description="Shows height, hash, time, size, weight, fees, and miner."
              registryName="block-card"
              code={galleryCode.blockCard}
            >
              <BlockCard
                block={demoBlocks[0]}
                now={DEMO_NOW}
                unstyled={unstyled}
                className="mx-auto max-w-lg"
              />
            </ComponentPreview>

            <ComponentPreview
              id="block-list"
              title="Block list"
              description="A responsive ordered list of recent blocks."
              registryName="block-list"
              code={galleryCode.blockList}
              wide
            >
              <BlockList
                blocks={demoBlocks}
                now={DEMO_NOW}
                unstyled={unstyled}
              />
            </ComponentPreview>

            <ComponentPreview
              id="difficulty-adjustment"
              title="Difficulty adjustment"
              description="Shows epoch progress and an explicitly labeled projection."
              registryName="difficulty-adjustment"
              code={galleryCode.difficulty}
            >
              <DifficultyAdjustment
                currentHeight={905_742}
                epochStartHeight={905_184}
                projectedChange={2.41}
                remainingBlocks={1_458}
                estimatedTime="10 days"
                unstyled={unstyled}
                className="mx-auto max-w-md"
              />
            </ComponentPreview>

            <ComponentPreview
              id="halving-countdown"
              title="Halving countdown"
              description="Shows remaining blocks, target height, next subsidy, and an estimated date."
              registryName="halving-countdown"
              code={galleryCode.halving}
            >
              <HalvingCountdown
                currentHeight={905_742}
                halvingHeight={1_050_000}
                estimatedDate="April 2028"
                unstyled={unstyled}
                className="mx-auto max-w-md"
              />
            </ComponentPreview>
          </ComponentSection>

          <ComponentSection
            title="Transactions"
            description="Rows, flows, and UTXO views."
          >
            <ComponentPreview
              id="transaction-row"
              title="Transaction row"
              description="Shows status, fee rate, time, value, and confirmations."
              registryName="transaction-row"
              code={galleryCode.transactionRow}
              wide
            >
              <div className="px-2">
                {demoTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.txid}
                    transaction={transaction}
                    now={DEMO_NOW}
                    unstyled={unstyled}
                  />
                ))}
              </div>
            </ComponentPreview>

            <ComponentPreview
              id="transaction-flow"
              title="Transaction flow"
              description="Keeps inputs and outputs in source order with aligned values."
              registryName="transaction-flow"
              code={galleryCode.transactionFlow}
              wide
            >
              <TransactionFlow
                inputs={demoInputs}
                outputs={demoOutputs}
                fee={3_124}
                unstyled={unstyled}
              />
            </ComponentPreview>

            <ComponentPreview
              id="utxo-table"
              title="UTXO table"
              description="A semantic table for outpoints, scripts, confirmations, and values."
              registryName="utxo-table"
              code={galleryCode.utxo}
              wide
            >
              <UtxoTable
                utxos={demoUtxos}
                caption="Wallet UTXOs · fixture data"
                unstyled={unstyled}
              />
            </ComponentPreview>
          </ComponentSection>

          <ComponentSection
            title="Network and proofs"
            description="Fee selection, mempool state, network metrics, proofs, and search."
          >
            <ComponentPreview
              id="fee-estimates"
              title="Fee estimates"
              description="Select a target and fee rate. Block timing remains probabilistic."
              registryName="fee-estimates"
              code={galleryCode.fees}
            >
              <FeeEstimates
                estimates={demoFees}
                defaultSelectedBlocks={3}
                unstyled={unstyled}
                className="mx-auto max-w-md"
              />
            </ComponentPreview>

            <ComponentPreview
              id="mempool-meter"
              title="Mempool meter"
              description="Shows size, transaction count, median fee, and load."
              registryName="mempool-meter"
              code={galleryCode.mempool}
            >
              <MempoolMeter
                size={182_400_000}
                transactionCount={84_291}
                medianFeeRate={11}
                unstyled={unstyled}
                className="mx-auto max-w-md"
              />
            </ComponentPreview>

            <ComponentPreview
              id="network-stats"
              title="Network stats"
              description="A definition list for network metrics. Missing values remain blank."
              registryName="network-stats"
              code={galleryCode.stats}
              wide
            >
              <NetworkStats stats={demoStats} unstyled={unstyled} />
            </ComponentPreview>

            <ComponentPreview
              id="merkle-proof"
              title="Merkle proof"
              description="Shows each sibling hash from a transaction to its Merkle root."
              registryName="merkle-proof"
              code={galleryCode.merkle}
            >
              <MerkleProof
                transactionId={demoTxid}
                merkleRoot={demoHash}
                proof={demoMerkleProof}
                verified
                unstyled={unstyled}
                className="mx-auto max-w-xl"
              />
            </ComponentPreview>

            <ComponentPreview
              id="bitcoin-search"
              title="Bitcoin search"
              description="Validates and classifies block heights, hashes, and addresses."
              registryName="bitcoin-search"
              code={galleryCode.search}
            >
              <BitcoinSearch
                defaultValue={demoTxid}
                onSearch={({ query, kind }) =>
                  setSearchResult(formatSearchResult(kind, query))
                }
                unstyled={unstyled}
              />
            </ComponentPreview>
          </ComponentSection>

        </main>
      </div>

      <footer className="gallery-footer">
        <div className="gallery-footer__inner">
          <h2>Build a better Bitcoin UI.</h2>
          <div className="gallery-footer__body">
            <p>
              Connect a node or indexer. Components only render the values you
              pass.
            </p>
            <a href="#installation" className="gallery-footer__action">
              Install all components
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
        <div className="gallery-footer__meta">
          <span className="font-sans font-medium text-[var(--color-ink)]">
            Bitcoin UI
          </span>
          <span>React 19 · Next.js 16 · Tailwind CSS 4 · shadcn registry</span>
          <span>Fixture data · no network requests</span>
        </div>
      </footer>
    </div>
  );
}

function ComponentSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="gallery-section">
      <SectionHeader title={title} description={description} />
      <div className="gallery-section__items">{children}</div>
    </section>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="gallery-section__head">
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}
