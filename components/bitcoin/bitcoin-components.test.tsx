import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BitcoinAmount } from "./bitcoin-amount";
import {
  AnimatedConfirmations,
  BitcoinSpinner,
  MempoolFlow,
  UtxoMerkleFlow,
} from "./bitcoin-motion";
import { BitcoinSearch } from "./bitcoin-search";
import { ConfirmationProgress } from "./confirmation-progress";
import { FeeEstimates } from "./fee-estimates";
import { LongestChain } from "./longest-chain";
import { NetworkBadge } from "./network-badge";
import { UtxoTable } from "./utxo-table";

describe("Bitcoin UI components", () => {
  it("renders styled and unstyled amount modes from the same API", () => {
    const { rerender } = render(
      <BitcoinAmount value={100_000_000} unit="btc" />,
    );
    const amount = screen.getByText("1").closest("[data-slot=bitcoin-amount]");
    expect(amount).toHaveClass("font-mono");

    rerender(
      <BitcoinAmount
        value={100_000_000}
        unit="btc"
        unstyled
        className="consumer-class"
      />,
    );
    expect(amount).toHaveClass("consumer-class");
    expect(amount).not.toHaveClass("font-mono");
    expect(amount).toHaveAttribute("data-unstyled", "true");
  });

  it("exposes confirmation state as an accessible progressbar", () => {
    render(<ConfirmationProgress confirmations={2} target={6} />);
    expect(
      screen.getByRole("progressbar", { name: "Transaction confirmations" }),
    ).toHaveAttribute("aria-valuetext", "2 of 6 confirmations");
    expect(screen.getByText("2 / 6 confirmations")).toBeVisible();
  });

  it("animates confirmations without hiding progress semantics", () => {
    render(<AnimatedConfirmations confirmations={4} target={6} paused />);
    const progress = screen.getByRole("progressbar", {
      name: "Transaction confirmation relay",
    });

    expect(progress).toHaveAttribute("aria-valuenow", "4");
    expect(progress).toHaveAttribute("aria-valuetext", "4 of 6 confirmations");
    expect(progress.closest("[data-slot=animated-confirmations]")).toHaveAttribute(
      "data-paused",
      "true",
    );
  });

  it("keeps animated network work and candidate metadata legible", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <MempoolFlow
          transactionCount={84_291}
          pressure={0.72}
          packetSamples={[
            {
              label: "Fixture mempool transaction 1",
              txid: "a".repeat(64),
              feeRate: 12,
              vsize: 192,
              status: "Waiting",
            },
            {
              label: "Fixture mempool transaction 2",
              txid: "b".repeat(64),
              feeRate: 8,
              vsize: 240,
              status: "Waiting",
            },
          ]}
          candidateBlock={{
            label: "Fixture candidate",
            transactionCount: 3_124,
            weight: 3_992_148,
            feeTotal: 18_426_300,
          }}
        />
        <BitcoinSpinner
          variant="hash"
          label="Hashing block header"
          showLabel
        />
      </>,
    );

    expect(
      screen.getByRole("group", {
        name: /84,291 transactions at 72 percent pressure/,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("status", { name: "Hashing block header" }),
    ).toBeVisible();
    expect(
      container.querySelectorAll("[data-slot=mempool-packet]"),
    ).toHaveLength(20);
    expect(
      container.querySelectorAll("[data-slot=mempool-packet-metadata]"),
    ).toHaveLength(20);
    expect(
      container.querySelector("[data-slot=mempool-packet-metadata]"),
    ).toHaveTextContent("Visual packet1 / 20");
    expect(
      container.querySelector("[data-slot=mempool-packet-metadata]"),
    ).toHaveTextContent("Visual lane1 / 4");
    expect(
      container.querySelector("[data-slot=mempool-packet-metadata]"),
    ).toHaveTextContent("StateWaiting");
    expect(
      container.querySelectorAll("[data-slot=candidate-block-slot]"),
    ).toHaveLength(4);

    const candidate = container.querySelector(
      "[data-slot=candidate-block]",
    );
    const trigger = container.querySelector(
      "[data-slot=candidate-block-trigger]",
    ) as HTMLButtonElement | null;

    expect(candidate).not.toHaveAttribute("data-open");
    expect(trigger).not.toHaveAttribute("aria-describedby");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    const metadata = container.querySelector(
      "[data-slot=candidate-block-metadata]",
    );
    expect(metadata).toHaveAttribute("aria-hidden", "true");
    expect(metadata).toHaveTextContent("Fixture candidate");
    expect(metadata).toHaveTextContent("Transactions3,124");
    expect(metadata).toHaveTextContent("Weight3,992,148 WU");
    expect(metadata).toHaveTextContent("Fees18,426,300 sat");
    expect(metadata).toHaveTextContent("Pressure72%");
    expect(metadata).toHaveTextContent("Capacity signal3 / 4 slots");

    await user.click(screen.getByText("Next block"));
    expect(candidate).toHaveAttribute("data-open", "true");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(metadata).toHaveAttribute("aria-hidden", "false");

    trigger?.focus();
    await user.keyboard("{Escape}");
    expect(candidate).not.toHaveAttribute("data-open");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    const secondSample = screen.getByRole("button", { name: /Sample 2/ });
    await user.click(secondSample);
    expect(secondSample).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("complementary", {
        name: "Fixture mempool transaction 2 metadata",
      }),
    ).toHaveTextContent("Fee rate8 sat/vB");
  });

  it("illustrates the most-work chain and keeps block metadata inspectable", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LongestChain
        canonical={[
          {
            id: "main-100",
            height: 100,
            miner: "Main miner",
            work: "Canonical history",
          },
          {
            id: "main-101",
            height: 101,
            miner: "Tip miner",
            work: "Most accumulated work",
          },
        ]}
        branches={[
          {
            id: "stale-branch",
            label: "Lost sibling race",
            state: "stale",
            forkHeight: 100,
            direction: "below",
            blocks: [
              {
                id: "stale-101",
                height: 101,
                miner: "Stale miner",
                work: "Valid block · no longer canonical",
              },
            ],
          },
          {
            id: "orphan-branch",
            label: "Parent unavailable",
            state: "orphan",
            blocks: [{ id: "orphan-102", height: 102 }],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("figure", { name: /Most-work chain/ }),
    ).toBeVisible();
    expect(container.querySelector("svg[data-testid]")).toBeNull();
    expect(container.querySelector("svg")).toHaveAttribute("fill", "none");
    expect(
      container.querySelector('[data-slot="chain-block"][data-direction="above"]'),
    ).toBeInTheDocument();
    expect(screen.getByText("Bitcoin has no rewarded uncle state.")).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: /Stale sibling, block 101, mined by Stale miner/,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: /Orphan · parent unknown, block 102/,
      }),
    ).toBeVisible();

    const inspector = screen.getByText("Selected block").closest("aside");
    expect(inspector).toHaveTextContent("Canonical tip");
    expect(inspector).toHaveTextContent("Tip miner");

    const staleBlock = screen.getByRole("button", {
      name: /Stale sibling, block 101, mined by Stale miner/,
    });
    await user.hover(staleBlock);
    expect(inspector).toHaveTextContent("Stale sibling");
    expect(inspector).toHaveTextContent("Lost sibling race");
    expect(inspector).toHaveTextContent("Valid block · no longer canonical");

    await user.click(staleBlock);
    await user.unhover(staleBlock);
    expect(staleBlock).toHaveAttribute("aria-pressed", "true");
    expect(inspector).toHaveTextContent("Stale miner");

    await user.keyboard("{Escape}");
    expect(staleBlock).toHaveAttribute("aria-pressed", "false");
    expect(inspector).toHaveTextContent("Canonical tip");
  });

  it("connects UTXO state transitions to a distinct Merkle inclusion proof", () => {
    const txid = "a".repeat(64);
    const root = "b".repeat(64);
    render(
      <UtxoMerkleFlow
        inputs={[
          {
            id: `${"c".repeat(64)}:0`,
            label: "Funding output",
            value: 75_000,
          },
        ]}
        outputs={[
          {
            id: `${txid}:0`,
            label: "Payment output",
            value: 60_000,
          },
          {
            id: `${txid}:1`,
            label: "Change output",
            value: 14_000,
          },
        ]}
        transactionId={txid}
        merkleRoot={root}
        proofDepth={3}
      />,
    );

    expect(
      screen.getByRole("region", {
        name: "Relationship between transaction outputs and Merkle inclusion",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("group", { name: /Merkle tree leaf.*proof depth of 3/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("group", {
        name: "1 unspent outputs are consumed and 2 new unspent outputs are created",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("note", {
        name: /Merkle leaf and UTXO state transition refer to the same transaction/,
      }),
    ).toBeVisible();
    expect(screen.getByText("Spendable state derived from transaction outputs."))
      .toBeVisible();
    expect(
      screen.getByText("Inclusion commitment to transactions in one block."),
    ).toBeVisible();
  });

  it("keeps protocol badge meaning in text", () => {
    render(<NetworkBadge network="signet" />);
    expect(screen.getByText("Signet")).toBeVisible();
  });

  it("validates search input before submitting", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<BitcoinSearch onSearch={onSearch} />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "not bitcoin");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "That does not look like a Bitcoin identifier.",
    );

    await user.clear(input);
    await user.type(input, "905742");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearch).toHaveBeenCalledWith({
      query: "905742",
      kind: "block-height",
    });
  });

  it("supports uncontrolled fee selection with radiogroup semantics", () => {
    const onSelectionChange = vi.fn();
    const { container } = render(
      <FeeEstimates
        estimates={[
          { label: "Priority", blocks: 1, satPerVbyte: 18 },
          { label: "Economy", blocks: 6, satPerVbyte: 7 },
        ]}
        defaultSelectedBlocks={1}
        onSelectionChange={onSelectionChange}
      />,
    );

    const economy = within(container).getByRole("radio", { name: /Economy/ });
    fireEvent.click(economy);
    expect(economy).toHaveAttribute("aria-checked", "true");
    expect(onSelectionChange).toHaveBeenCalledWith({
      label: "Economy",
      blocks: 6,
      satPerVbyte: 7,
    });
  });

  it("supports arrow, Home, and End navigation in fee radiogroups", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FeeEstimates
        estimates={[
          { label: "Priority", blocks: 1, satPerVbyte: 18 },
          { label: "Standard", blocks: 3, satPerVbyte: 11 },
          { label: "Economy", blocks: 6, satPerVbyte: 7 },
        ]}
        defaultSelectedBlocks={1}
      />,
    );

    const feeOptions = within(container);
    const priority = feeOptions.getByRole("radio", { name: /Priority/ });
    const standard = feeOptions.getByRole("radio", { name: /Standard/ });
    const economy = feeOptions.getByRole("radio", { name: /Economy/ });

    priority.focus();
    await user.keyboard("{ArrowRight}");
    expect(standard).toHaveFocus();
    expect(standard).toHaveAttribute("aria-checked", "true");

    await user.keyboard("{End}");
    expect(economy).toHaveFocus();
    expect(economy).toHaveAttribute("aria-checked", "true");

    await user.keyboard("{Home}");
    expect(priority).toHaveFocus();
    expect(priority).toHaveAttribute("aria-checked", "true");
  });

  it("keeps hover-only metadata out of unstyled output", () => {
    const { container } = render(
      <>
        <MempoolFlow
          transactionCount={1}
          pressure={0.1}
          packetSamples={[{ label: "Accessible sample", txid: "a".repeat(64) }]}
          unstyled
        />
        <LongestChain
          canonical={[{ id: "main-1", height: 1 }]}
          unstyled
        />
      </>,
    );

    expect(
      container.querySelector("[data-slot=mempool-packet-metadata]"),
    ).toHaveAttribute("hidden");
    expect(container.querySelector('[role="tooltip"]')).toHaveAttribute(
      "hidden",
    );
    expect(
      screen.getByRole("complementary", {
        name: "Accessible sample metadata",
      }),
    ).toBeVisible();
  });

  it("renders UTXOs as a semantic table with a caption", () => {
    render(
      <UtxoTable
        caption="Wallet UTXOs"
        utxos={[
          {
            txid: "a".repeat(64),
            vout: 0,
            value: 50_000,
            confirmations: 3,
            scriptType: "p2tr",
          },
        ]}
      />,
    );

    expect(screen.getByRole("table", { name: "Wallet UTXOs" })).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Value" })).toBeVisible();
    expect(screen.getByText("50,000")).toBeVisible();
  });
});
