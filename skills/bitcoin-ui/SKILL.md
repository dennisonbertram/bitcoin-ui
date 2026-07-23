---
name: bitcoin-ui
description: Install and use the Bitcoin UI shadcn registry in React and Next.js projects. Use when building Bitcoin explorers, wallets, node dashboards, transaction or UTXO interfaces, fee and mempool views, Merkle proofs, confirmation states, or most-work-chain visualizations with TypeScript and shadcn.
---

# Bitcoin UI

Use copy-owned Bitcoin components from `dennisonbertram/bitcoin-ui`. Keep the
application's data source explicit: components render caller-supplied data and
must not silently choose a node, indexer, or API.

## Install

Confirm that the project has a valid shadcn `components.json`. Select the
smallest useful registry item.

Full component suite:

```bash
npx shadcn@latest add dennisonbertram/bitcoin-ui/bitcoin-ui
```

Composed explorer:

```bash
npx shadcn@latest add dennisonbertram/bitcoin-ui/bitcoin-explorer
```

Individual component:

```bash
npx shadcn@latest add dennisonbertram/bitcoin-ui/transaction-flow
```

Use `npx shadcn@latest list dennisonbertram/bitcoin-ui` to discover every item.

## Integrate

1. Inspect the installed source before editing it.
2. Import from the generated `components/bitcoin` files using the project's
   configured aliases.
3. Pass node or indexer results through props. Keep fetching and trust decisions
   in the application.
4. Use `bigint` for satoshi values at application boundaries.
5. Use `unstyled` when the project owns presentation; retain native semantics,
   ARIA, and `data-slot` hooks.
6. Preserve Bitcoin terminology:
   - UTXOs are consumed and created by transactions.
   - Merkle proofs commit transaction IDs to a block's Merkle root.
   - The canonical branch is selected by accumulated proof of work, not block
     count alone.
   - Bitcoin does not reward uncle blocks.

## Verify

Run the consuming project's lint, typecheck, and tests. Exercise interactive
components with keyboard input and verify both default and `unstyled` modes when
either mode is used.
