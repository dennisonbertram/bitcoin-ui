# Bitcoin UI

Most Bitcoin interfaces are difficult to read, and the component tooling behind
them is fragmented. Bitcoin UI fixes both with copy-owned, shadcn-compatible
React components for explorers, wallets, node dashboards, and developer tools.

[Live component gallery](https://dennisonbertram.github.io/bitcoin-ui/) ·
[![skills.sh](https://skills.sh/b/dennisonbertram/bitcoin-ui)](https://skills.sh/dennisonbertram/bitcoin-ui)

## Install

Install the complete library directly from GitHub:

```bash
npx shadcn@latest add dennisonbertram/bitcoin-ui/bitcoin-ui
```

Or install only what the interface needs:

```bash
npx shadcn@latest add dennisonbertram/bitcoin-ui/bitcoin-explorer
npx shadcn@latest add dennisonbertram/bitcoin-ui/transaction-flow
npx shadcn@latest add dennisonbertram/bitcoin-ui/longest-chain
```

Discover and inspect registry items before installing:

```bash
npx shadcn@latest list dennisonbertram/bitcoin-ui
npx shadcn@latest view dennisonbertram/bitcoin-ui/bitcoin-explorer
npx shadcn@latest add dennisonbertram/bitcoin-ui/bitcoin-ui --dry-run
```

The shadcn CLI copies readable TypeScript source into the consuming project.
There is no runtime Bitcoin UI package and no vendor lock-in.

## Named registry

Projects that prefer the `@bitcoin-ui` namespace can register the GitHub Pages
endpoint once:

```bash
npx shadcn@latest registry add @bitcoin-ui=https://dennisonbertram.github.io/bitcoin-ui/r/{name}.json
npx shadcn@latest add @bitcoin-ui/bitcoin-ui
```

Equivalent `components.json` configuration:

```json
{
  "registries": {
    "@bitcoin-ui": "https://dennisonbertram.github.io/bitcoin-ui/r/{name}.json"
  }
}
```

## Agent skill

Install the Bitcoin UI skill for Codex, Claude Code, Cursor, and other compatible
coding agents:

```bash
npx skills add dennisonbertram/bitcoin-ui --skill bitcoin-ui
```

The skill teaches agents how to select components, preserve Bitcoin terminology,
wire caller-owned data, and verify default and unstyled modes. skills.sh lists
public skills automatically after they are installed through the CLI.

## What is included

- 24 Bitcoin-specific component exports
- Exact `bigint`-safe satoshi and BTC formatting
- Styled and unstyled modes from the same component API
- Semantic light and dark OKLCH tokens
- A complete data-source-agnostic explorer composition
- Animated confirmations, mempool pressure, Merkle inclusion, UTXO flow, and
  most-work-chain illustrations
- Per-component and full-suite shadcn registry items
- Keyboard, semantics, formatter, registry, and responsive-layout tests

| Area | Components |
| --- | --- |
| Foundations | `BitcoinAmount`, `HashDisplay`, `AddressDisplay`, `NetworkBadge`, `StatusBadge`, `ScriptBadge` |
| Chain | `ConfirmationProgress`, `BlockCard`, `BlockList`, `DifficultyAdjustment`, `HalvingCountdown` |
| Transactions | `TransactionRow`, `TransactionFlow`, `UtxoTable` |
| Network | `FeeEstimates`, `MempoolMeter`, `NetworkStats`, `BitcoinSearch` |
| Proofs | `MerkleProof` |
| Motion | `AnimatedConfirmations`, `MempoolFlow`, `BitcoinSpinner`, `UtxoMerkleFlow`, `LongestChain` |
| Composition | `BitcoinExplorer` |

## Data contract

Bitcoin UI makes no network requests and chooses no provider. Pass data from
Bitcoin Core, Esplora, Electrum, or an application-owned indexer through props.

Satoshi values accept `bigint`, integer `number`, or integer `string`. Prefer
`bigint` at application boundaries:

```tsx
import { BitcoinAmount, HashDisplay } from "@/components/bitcoin"

export function TransactionValue() {
  return (
    <>
      <BitcoinAmount value={12_845_210n} />
      <HashDisplay value={transaction.txid} />
    </>
  )
}
```

Every visual component accepts `unstyled`. This removes the default visual
classes while preserving native semantics, ARIA, behavior, `className`, and
stable `data-slot` and `data-state` hooks.

## Develop

Requirements: Node.js 20.9 or newer and pnpm 10.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The gallery uses deterministic fixture data and
does not contact a Bitcoin node or third-party API.

Build and verify everything:

```bash
pnpm check
pnpm build:pages
```

`pnpm registry:build` compiles `registry.json` to `public/r/`. GitHub Actions
builds the static Next.js site and deploys `out/` to GitHub Pages.

## License

MIT
