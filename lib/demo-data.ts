import type {
  LongestChainBlock,
  LongestChainBranch,
  MempoolPacketMetadata,
  MerkleProofNode,
  NetworkStat,
} from "@/components/bitcoin";
import type {
  BitcoinBlock,
  BitcoinTransaction,
  BitcoinUtxo,
  FeeEstimate,
  TransactionEndpoint,
} from "@/lib/bitcoin";

export const DEMO_NOW = new Date("2026-07-22T21:20:00.000Z");

export const demoHash =
  "00000000000000000001b9a31856a93eecc1767f7b164b9b55e7e7d46105f8f2";

export const demoTxid =
  "8b91d4c9f5a3e7b102664e1106de9c96b83462d16ff4130af765210e37c92be4";

export const demoAddress =
  "bc1q7m0t4gu8v0y4x9q0p6apc4f7sr3k5ulj35h7gr";

export const demoBlocks: BitcoinBlock[] = [
  {
    height: 905_742,
    hash: demoHash,
    timestamp: new Date("2026-07-22T21:11:00.000Z"),
    transactionCount: 3_124,
    size: 1_643_812,
    weight: 3_992_148,
    miner: "Sample Pool",
    feeTotal: 18_426_300,
  },
  {
    height: 905_741,
    hash: "00000000000000000000d7c4149f6343b18224e8cba9ea87f68051c11d39db9a",
    timestamp: new Date("2026-07-22T20:57:00.000Z"),
    transactionCount: 2_488,
    size: 1_511_306,
    weight: 3_864_922,
    miner: "North Hash",
    feeTotal: 14_108_000,
  },
  {
    height: 905_740,
    hash: "00000000000000000002a7e64b8fa336b311166204ff4bb14bde1b847af1e0cc",
    timestamp: new Date("2026-07-22T20:49:00.000Z"),
    transactionCount: 3_606,
    size: 1_790_428,
    weight: 3_998_690,
    miner: "Sample Pool",
    feeTotal: 22_004_700,
  },
  {
    height: 905_739,
    hash: "0000000000000000000081bb8790f35a5b5a5370ace7c6807a61dbbef833d052",
    timestamp: new Date("2026-07-22T20:35:00.000Z"),
    transactionCount: 2_906,
    size: 1_604_772,
    weight: 3_921_124,
    miner: "Fixture Mining",
    feeTotal: 16_972_100,
  },
];

export const demoTransactions: BitcoinTransaction[] = [
  {
    txid: demoTxid,
    value: 12_845_210,
    fee: 3_124,
    vsize: 208,
    timestamp: new Date("2026-07-22T21:16:00.000Z"),
    confirmations: 2,
    state: "confirmed",
  },
  {
    txid: "3e5f4d81d71ed52ce4d0710f58de187c5ba93516ed206381977b223930cf6ef8",
    value: 245_000,
    fee: 1_932,
    vsize: 141,
    timestamp: new Date("2026-07-22T21:18:00.000Z"),
    state: "pending",
  },
  {
    txid: "c76cb62d72a0a2a781035691bd82e27b2a476b9e6546082891927f23c6a9ba11",
    value: 520_304_120,
    fee: 12_046,
    vsize: 376,
    timestamp: new Date("2026-07-22T21:02:00.000Z"),
    confirmations: 1,
    state: "confirmed",
  },
];

export const demoMempoolPacketSamples: MempoolPacketMetadata[] = [
  {
    label: "Fixture mempool transaction 1",
    txid: demoTransactions[1].txid,
    feeRate: Number(demoTransactions[1].fee) / demoTransactions[1].vsize,
    vsize: demoTransactions[1].vsize,
    status: "Waiting",
  },
  {
    label: "Fixture mempool transaction 2",
    txid: "142f6b8b5ee6e62a2bc9ff1f4423dc9bbf384f83169d43f2ff9e2e7b2f0460ab",
    feeRate: 15.4,
    vsize: 192,
    status: "Waiting",
  },
  {
    label: "Fixture mempool transaction 3",
    txid: "84d26b42e7ea39fd62b6f1a68955e75b8afcb3dc6591b775c0559652ee810be2",
    feeRate: 7.2,
    vsize: 318,
    status: "Waiting",
  },
];

export const demoCanonicalChain: LongestChainBlock[] = [
  {
    id: "canonical-905739",
    height: 905_739,
    hash: demoBlocks[3].hash,
    timestamp: demoBlocks[3].timestamp,
    transactionCount: demoBlocks[3].transactionCount,
    miner: demoBlocks[3].miner,
    work: "Canonical history",
  },
  {
    id: "canonical-905740",
    height: 905_740,
    hash: demoBlocks[2].hash,
    timestamp: demoBlocks[2].timestamp,
    transactionCount: demoBlocks[2].transactionCount,
    miner: demoBlocks[2].miner,
    work: "Canonical history",
  },
  {
    id: "canonical-905741",
    height: 905_741,
    hash: demoBlocks[1].hash,
    timestamp: demoBlocks[1].timestamp,
    transactionCount: demoBlocks[1].transactionCount,
    miner: demoBlocks[1].miner,
    work: "Fork resolved",
  },
  {
    id: "canonical-905742",
    height: 905_742,
    hash: demoBlocks[0].hash,
    timestamp: demoBlocks[0].timestamp,
    transactionCount: demoBlocks[0].transactionCount,
    miner: demoBlocks[0].miner,
    work: "Most accumulated work",
  },
  {
    id: "canonical-905743",
    height: 905_743,
    timestamp: new Date("2026-07-22T21:24:00.000Z"),
    transactionCount: 2_931,
    miner: "Fixture Mining",
    work: "Extends most-work path",
  },
  {
    id: "canonical-905744",
    height: 905_744,
    timestamp: new Date("2026-07-22T21:36:00.000Z"),
    transactionCount: 3_208,
    miner: "North Hash",
    work: "Illustrative canonical tip",
  },
];

export const demoChainBranches: LongestChainBranch[] = [
  {
    id: "blue-fork",
    label: "Two-block competitor",
    state: "competing",
    forkHeight: 905_740,
    direction: "above",
    blocks: [
      {
        id: "competing-905741",
        height: 905_741,
        timestamp: new Date("2026-07-22T20:58:00.000Z"),
        transactionCount: 2_701,
        miner: "Fixture Fork A",
        work: "Competing at equal height",
      },
      {
        id: "competing-905742",
        height: 905_742,
        timestamp: new Date("2026-07-22T21:13:00.000Z"),
        transactionCount: 2_844,
        miner: "Fixture Fork A",
        work: "Less accumulated work",
      },
    ],
  },
  {
    id: "stale-sibling",
    label: "Lost sibling race",
    state: "stale",
    forkHeight: 905_742,
    direction: "below",
    blocks: [
      {
        id: "stale-905743",
        height: 905_743,
        timestamp: new Date("2026-07-22T21:25:00.000Z"),
        transactionCount: 3_015,
        miner: "Fixture Fork B",
        work: "Valid block · no longer canonical",
      },
    ],
  },
  {
    id: "orphan-candidate",
    label: "Parent unavailable",
    state: "orphan",
    direction: "above",
    blocks: [
      {
        id: "orphan-905744",
        height: 905_744,
        timestamp: new Date("2026-07-22T21:37:00.000Z"),
        transactionCount: 2_482,
        miner: "Unknown peer",
        work: "Parent not known to this view",
      },
    ],
  },
];

export const demoUtxos: BitcoinUtxo[] = [
  {
    txid: demoTxid,
    vout: 0,
    value: 12_845_210,
    confirmations: 12,
    scriptType: "p2wpkh",
    address: demoAddress,
    spendable: true,
  },
  {
    txid: "a7bf624df3cda4e253ed9f16b8da7f104fd108f39223c98827e42b66a9a0d83c",
    vout: 2,
    value: 1_420_000,
    confirmations: 98,
    scriptType: "p2wpkh",
    address: "bc1qf7v0ug6dkc7r2ffmn07r3rw4sk8x8jhhwe57l5",
    spendable: true,
  },
  {
    txid: "cd128c451da1722a7887cd978681ab55d0f17d838b35a64c11de8ed3ff8f109e",
    vout: 1,
    value: 86_300,
    confirmations: 1_240,
    scriptType: "p2sh",
    address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    spendable: false,
  },
];

export const demoFees: FeeEstimate[] = [
  { label: "Priority", blocks: 1, satPerVbyte: 18, minutes: 10 },
  { label: "Standard", blocks: 3, satPerVbyte: 11, minutes: 30 },
  { label: "Economy", blocks: 6, satPerVbyte: 7, minutes: 60 },
];

export const demoInputs: TransactionEndpoint[] = [
  {
    id: "input-0",
    address: "bc1qf7v0ug6dkc7r2ffmn07r3rw4sk8x8jhhwe57l5",
    value: 14_300_000,
    scriptType: "p2wpkh",
  },
  {
    id: "input-1",
    address: "bc1p8d6zgtucx2p8v8tx9az2hm7u8a8n7pudw2c25h7me7wsgam9sjqs7v7nze",
    value: 2_900_000,
    scriptType: "p2tr",
  },
];

export const demoOutputs: TransactionEndpoint[] = [
  {
    id: "output-0",
    address: demoAddress,
    value: 12_845_210,
    scriptType: "p2wpkh",
  },
  {
    id: "output-1",
    address: "bc1p8d6zgtucx2p8v8tx9az2hm7u8a8n7pudw2c25h7me7wsgam9sjqs7v7nze",
    value: 4_351_666,
    scriptType: "p2tr",
  },
];

export const demoMerkleProof: MerkleProofNode[] = [
  {
    hash: "406ed9d187de295ea1e6c84df2a46ca683359c79bd20ab348f2a1cd98669c1c7",
    side: "right",
  },
  {
    hash: "7f0bf149e3f17bc98b2d82261f3d93b14faea6c90deec87d05e7315c8f9b721a",
    side: "left",
  },
  {
    hash: "1ea463337c6f50db0f0313f4eb9a2dcbcd0e507162d065ca718cc40f8d4c3956",
    side: "right",
  },
];

export const demoStats: NetworkStat[] = [
  { label: "Block height", value: "905,742", detail: "Fixture snapshot" },
  { label: "Hashrate", value: "—", detail: "Connect your data source" },
  { label: "Median fee", value: "11 sat/vB", detail: "Sample estimate" },
  { label: "Mempool", value: "182 MB", detail: "84,291 transactions" },
];
