export const galleryCode = {
  amount: `<BitcoinAmount value={12_845_210n} />
<BitcoinAmount value={245_000_000n} unit="btc" />`,
  hash: `<HashDisplay
  value={transaction.txid}
  label="Transaction ID"
  href={\`/tx/\${transaction.txid}\`}
/>`,
  address: `<AddressDisplay
  address={address}
  network="mainnet"
  scriptType="p2wpkh"
/>`,
  badges: `<NetworkBadge network="mainnet" />
<StatusBadge state="confirmed" />
<ScriptBadge type="p2tr" />`,
  confirmations: `<ConfirmationProgress
  confirmations={2}
  target={6}
/>`,
  animatedConfirmations: `<AnimatedConfirmations
  confirmations={4}
  target={6}
  paused={paused}
/>`,
  mempoolFlow: `<MempoolFlow
  transactionCount={84_291}
  pressure={0.72}
  packetSamples={transactionSamples}
  candidateBlock={{
    transactionCount: 3_124,
    weight: 3_992_148,
    feeTotal: 18_426_300,
  }}
  paused={paused}
/>`,
  longestChain: `<LongestChain
  canonical={canonicalBlocks}
  branches={[
    {
      id: "fork-a",
      label: "Competing fork",
      state: "competing",
      forkHeight: 905_740,
      blocks: competingBlocks,
    },
    {
      id: "stale-b",
      label: "Lost sibling race",
      state: "stale",
      forkHeight: 905_742,
      direction: "below",
      blocks: staleBlocks,
    },
  ]}
  paused={paused}
/>`,
  spinners: `<BitcoinSpinner variant="hash" label="Hashing header" showLabel />
<BitcoinSpinner variant="blocks" label="Assembling block" showLabel />
<BitcoinSpinner variant="sync" label="Syncing headers" showLabel />`,
  utxoMerkleFlow: `<UtxoMerkleFlow
  inputs={inputs}
  outputs={outputs}
  transactionId={transaction.txid}
  merkleRoot={block.merkleRoot}
  proofDepth={3}
  paused={paused}
/>`,
  blockCard: `<BlockCard
  block={block}
  hashHref={\`/block/\${block.hash}\`}
/>`,
  blockList: `<BlockList
  blocks={blocks}
  getHref={(block) => \`/block/\${block.hash}\`}
/>`,
  transactionRow: `<TransactionRow
  transaction={transaction}
  href={\`/tx/\${transaction.txid}\`}
/>`,
  transactionFlow: `<TransactionFlow
  inputs={inputs}
  outputs={outputs}
  fee={3_124}
/>`,
  utxo: `<UtxoTable
  utxos={utxos}
  caption="Wallet UTXOs"
/>`,
  fees: `<FeeEstimates
  estimates={feeEstimates}
  defaultSelectedBlocks={3}
  onSelectionChange={setEstimate}
/>`,
  mempool: `<MempoolMeter
  size={182_400_000}
  transactionCount={84_291}
  medianFeeRate={11}
/>`,
  difficulty: `<DifficultyAdjustment
  currentHeight={905_742}
  epochStartHeight={905_184}
  projectedChange={2.41}
  remainingBlocks={1_458}
  estimatedTime="10 days"
/>`,
  halving: `<HalvingCountdown
  currentHeight={905_742}
  halvingHeight={1_050_000}
  estimatedDate="April 2028"
/>`,
  stats: `<NetworkStats
  stats={[
    { label: "Block height", value: "905,742" },
    { label: "Hashrate", value: "—" },
  ]}
/>`,
  merkle: `<MerkleProof
  transactionId={txid}
  merkleRoot={merkleRoot}
  proof={proof}
  verified
/>`,
  search: `<BitcoinSearch
  onSearch={({ query, kind }) => {
    router.push(\`/\${kind}/\${query}\`)
  }}
/>`,
} as const;
