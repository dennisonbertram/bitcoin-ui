"use client";

import {
  useId,
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";

import {
  formatBlockHeight,
  formatTimestamp,
  truncateMiddle,
} from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import styles from "./longest-chain.module.css";
import type { BitcoinVisualProps } from "./shared";

export type ChainBranchState = "competing" | "stale" | "orphan";

export type LongestChainBlock = {
  /** Stable identifier used for selection state. */
  id: string;
  height: number;
  /** Optional real hash supplied by the caller. */
  hash?: string;
  timestamp?: number | Date;
  transactionCount?: number;
  miner?: string;
  /** Caller-supplied chainwork or decision note. */
  work?: string;
};

export type LongestChainBranch = {
  id: string;
  label: string;
  state: ChainBranchState;
  /**
   * Height on the canonical chain where this branch diverges. Leave empty for
   * an orphan whose parent is not known to the current view.
   */
  forkHeight?: number;
  /** Places the branch above or below the most-work path. @default "above" */
  direction?: "above" | "below";
  blocks: readonly LongestChainBlock[];
};

export type LongestChainProps = Omit<ComponentProps<"figure">, "children"> &
  BitcoinVisualProps & {
    canonical: readonly LongestChainBlock[];
    branches?: readonly LongestChainBranch[];
    /** Pauses the traveling chainwork signal. @default false */
    paused?: boolean;
    /** @default "Most-work chain" */
    title?: string;
    /** Accessible description of the represented fixture or network snapshot. */
    description?: string;
  };

type PositionedNode = {
  block: LongestChainBlock;
  branchId: string;
  branchLabel: string;
  direction: "main" | "above" | "below";
  state: "canonical" | "tip" | ChainBranchState;
  x: number;
  y: number;
};

type ChainNodeStyle = CSSProperties & {
  "--chain-x": string;
  "--chain-y": string;
};

const VIEWBOX_WIDTH = 1_000;
const VIEWBOX_HEIGHT = 360;
const MAIN_Y = 180;
const X_START = 88;
const X_END = 912;

function pathThrough(points: readonly { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const point = points[0];
    return `M ${point.x - 54} ${point.y} L ${point.x} ${point.y}`;
  }

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const midpoint = (previous.x + point.x) / 2;
    return `${path} C ${midpoint} ${previous.y}, ${midpoint} ${point.y}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

function stateLabel(state: PositionedNode["state"]) {
  switch (state) {
    case "canonical":
      return "Most-work chain";
    case "tip":
      return "Canonical tip";
    case "competing":
      return "Competing fork";
    case "stale":
      return "Stale sibling";
    case "orphan":
      return "Orphan · parent unknown";
  }
}

export function LongestChain({
  canonical,
  branches = [],
  paused,
  title = "Most-work chain",
  description = "The branch with the greatest accumulated proof of work remains canonical.",
  unstyled,
  className,
  ...props
}: LongestChainProps) {
  const baseId = useId();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const safeCanonical = canonical.filter((block) =>
    Number.isFinite(block.height),
  );
  const safeBranches = branches
    .map((branch) => ({
      ...branch,
      blocks: branch.blocks.filter((block) => Number.isFinite(block.height)),
    }))
    .filter((branch) => branch.blocks.length > 0);
  const allHeights = [
    ...safeCanonical.map((block) => block.height),
    ...safeBranches.flatMap((branch) =>
      branch.blocks.map((block) => block.height),
    ),
  ];
  const minHeight = Math.min(...allHeights);
  const maxHeight = Math.max(...allHeights);
  const heightRange =
    Number.isFinite(minHeight) && Number.isFinite(maxHeight)
      ? Math.max(1, maxHeight - minHeight)
      : 1;
  const xForHeight = (height: number) =>
    X_START + ((height - minHeight) / heightRange) * (X_END - X_START);

  const branchCounts = {
    above: safeBranches.filter(
      (branch) => (branch.direction ?? "above") === "above",
    ).length,
    below: safeBranches.filter(
      (branch) => (branch.direction ?? "above") === "below",
    ).length,
  };
  const directionIndexes = { above: 0, below: 0 };
  const canonicalNodes: PositionedNode[] = safeCanonical.map(
    (block, index) => ({
      block,
      branchId: "canonical",
      branchLabel: "Most-work chain",
      direction: "main",
      state:
        index === safeCanonical.length - 1
          ? ("tip" as const)
          : ("canonical" as const),
      x: xForHeight(block.height),
      y: MAIN_Y,
    }),
  );
  const branchNodes: PositionedNode[] = safeBranches.flatMap((branch) => {
    const direction = branch.direction ?? "above";
    const directionIndex = directionIndexes[direction]++;
    const directionCount = branchCounts[direction];
    const magnitude =
      directionCount <= 1
        ? 96
        : 88 + (directionIndex / (directionCount - 1)) * 52;
    const y = MAIN_Y + (direction === "above" ? -magnitude : magnitude);

    return branch.blocks.map((block) => ({
      block,
      branchId: branch.id,
      branchLabel: branch.label,
      direction,
      state: branch.state,
      x: xForHeight(block.height),
      y,
    }));
  });
  const nodes = [...canonicalNodes, ...branchNodes];

  const defaultNode =
    canonicalNodes[canonicalNodes.length - 1] ?? nodes[0];
  const activeId = hoveredId ?? pinnedId ?? defaultNode?.block.id ?? null;
  const activeNode =
    nodes.find((node) => node.block.id === activeId) ?? defaultNode;
  const canonicalPath = pathThrough(
    safeCanonical.map((block) => ({ x: xForHeight(block.height), y: MAIN_Y })),
  );

  return (
    <figure
      data-slot="longest-chain"
      data-paused={paused || undefined}
      data-unstyled={unstyled || undefined}
      aria-label={`${title}. ${description}`}
      className={componentClasses(unstyled, styles.figure, className)}
      {...props}
    >
      <figcaption className={componentClasses(unstyled, styles.header)}>
        <div>
          <span className={componentClasses(unstyled, styles.eyebrow)}>
            Consensus history
          </span>
          <strong>{title}</strong>
        </div>
        <p>{description}</p>
      </figcaption>

      <div className={componentClasses(unstyled, styles.legendRow)}>
        <ul aria-label="Chain state legend">
          {(
            [
              ["canonical", "Most-work chain"],
              ["competing", "Competing fork"],
              ["stale", "Stale sibling"],
              ["orphan", "Orphan · parent unknown"],
            ] as const
          ).map(([state, label]) => (
            <li key={state} data-state={state}>
              <i aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
        <span>Bitcoin has no rewarded uncle state.</span>
      </div>

      <div className={componentClasses(unstyled, styles.viewport)}>
        <div className={componentClasses(unstyled, styles.canvas)}>
          <svg
            className={componentClasses(unstyled, styles.paths)}
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            preserveAspectRatio="none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <defs>
              <filter id={`${baseId}-glow`} x="-30%" y="-100%" width="160%" height="300%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>
            <path
              data-state="canonical-glow"
              d={canonicalPath}
              filter={`url(#${baseId}-glow)`}
            />
            <path data-state="canonical" d={canonicalPath} />
            <path
              data-state="signal"
              d={canonicalPath}
              pathLength="100"
            />
            {safeBranches.map((branch) => {
              const branchNodes = nodes.filter(
                (node) => node.branchId === branch.id,
              );
              const forkNode =
                branch.forkHeight === undefined
                  ? undefined
                  : safeCanonical.find(
                      (block) => block.height === branch.forkHeight,
                    );
              const points = [
                ...(forkNode
                  ? [{ x: xForHeight(forkNode.height), y: MAIN_Y }]
                  : []),
                ...branchNodes.map((node) => ({ x: node.x, y: node.y })),
              ];

              return (
                <path
                  key={branch.id}
                  data-state={branch.state}
                  data-disconnected={!forkNode || undefined}
                  d={pathThrough(points)}
                  pathLength="100"
                />
              );
            })}
          </svg>

          {nodes.map((node, index) => {
            const tooltipId = `${baseId}-node-${index}`;
            const isPinned = pinnedId === node.block.id;
            const nodeLabel = `${stateLabel(node.state)}, block ${formatBlockHeight(
              node.block.height,
            )}${node.block.miner ? `, mined by ${node.block.miner}` : ""}`;

            return (
              <div
                key={`${node.branchId}-${node.block.id}`}
                data-slot="chain-block"
                data-state={node.state}
                data-direction={node.direction}
                data-edge={
                  node.x === X_START
                    ? "start"
                    : node.x === X_END
                      ? "end"
                      : undefined
                }
                data-active={activeId === node.block.id || undefined}
                data-pinned={isPinned || undefined}
                className={componentClasses(unstyled, styles.node)}
                style={
                  {
                    "--chain-x": `${(node.x / VIEWBOX_WIDTH) * 100}%`,
                    "--chain-y": `${(node.y / VIEWBOX_HEIGHT) * 100}%`,
                  } as ChainNodeStyle
                }
                onMouseEnter={() => setHoveredId(node.block.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <button
                  type="button"
                  aria-label={nodeLabel}
                  aria-describedby={unstyled ? undefined : tooltipId}
                  aria-pressed={isPinned}
                  onFocus={() => setHoveredId(node.block.id)}
                  onBlur={() => setHoveredId(null)}
                  onClick={() =>
                    setPinnedId((current) =>
                      current === node.block.id ? null : node.block.id,
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setPinnedId(null);
                      setHoveredId(null);
                    }
                  }}
                >
                  <i aria-hidden="true" />
                  {unstyled ? (
                    <span>{formatBlockHeight(node.block.height)}</span>
                  ) : (
                    <>
                      <span className={styles.heightFull}>
                        {formatBlockHeight(node.block.height)}
                      </span>
                      <span aria-hidden="true" className={styles.heightShort}>
                        {String(node.block.height).slice(-3)}
                      </span>
                    </>
                  )}
                </button>
                <div
                  id={tooltipId}
                  role="tooltip"
                  hidden={unstyled || undefined}
                  className={componentClasses(unstyled, styles.tooltip)}
                >
                  <strong>{stateLabel(node.state)}</strong>
                  <span>{node.branchLabel}</span>
                  <small>Click to pin</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeNode ? (
        <aside
          data-slot="chain-block-metadata"
          data-state={activeNode.state}
          className={componentClasses(unstyled, styles.inspector)}
          aria-live="polite"
        >
          <header>
            <span>Selected block</span>
            <strong>{stateLabel(activeNode.state)}</strong>
          </header>
          <dl>
            <div>
              <dt>Height</dt>
              <dd>{formatBlockHeight(activeNode.block.height)}</dd>
            </div>
            <div>
              <dt>Branch</dt>
              <dd>{activeNode.branchLabel}</dd>
            </div>
            {activeNode.block.hash ? (
              <div>
                <dt>Hash</dt>
                <dd title={activeNode.block.hash}>
                  {truncateMiddle(activeNode.block.hash, 6, 6)}
                </dd>
              </div>
            ) : null}
            {activeNode.block.miner ? (
              <div>
                <dt>Miner</dt>
                <dd>{activeNode.block.miner}</dd>
              </div>
            ) : null}
            {activeNode.block.transactionCount !== undefined ? (
              <div>
                <dt>Transactions</dt>
                <dd>
                  {new Intl.NumberFormat("en-US").format(
                    activeNode.block.transactionCount,
                  )}
                </dd>
              </div>
            ) : null}
            {activeNode.block.timestamp ? (
              <div>
                <dt>Seen</dt>
                <dd>{formatTimestamp(activeNode.block.timestamp)}</dd>
              </div>
            ) : null}
            {activeNode.block.work ? (
              <div>
                <dt>Chainwork</dt>
                <dd>{activeNode.block.work}</dd>
              </div>
            ) : null}
          </dl>
        </aside>
      ) : null}

      <p className={componentClasses(unstyled, styles.note)}>
        <strong>Terminology:</strong> a valid sibling that loses the chainwork
        race is stale. “Uncle” is an Ethereum term; Bitcoin does not reward
        these blocks. An orphan has no known parent in the current view.
      </p>
    </figure>
  );
}
