export type BitcoinNetwork = "mainnet" | "testnet" | "signet" | "regtest";

export type ScriptType =
  | "p2pkh"
  | "p2sh"
  | "p2wpkh"
  | "p2wsh"
  | "p2tr"
  | "op-return"
  | "unknown";

export type TransactionState =
  | "confirmed"
  | "pending"
  | "replaced"
  | "conflicted";

export type AmountUnit = "sat" | "btc" | "auto";

export type BitcoinSearchKind =
  | "block-height"
  | "hash"
  | "address"
  | "unknown";

export type SatoshiValue = bigint | number | string;

export interface BitcoinBlock {
  height: number;
  hash: string;
  timestamp: number | Date;
  transactionCount: number;
  size: number;
  weight: number;
  miner?: string;
  feeTotal?: SatoshiValue;
}

export interface BitcoinTransaction {
  txid: string;
  value: SatoshiValue;
  fee: SatoshiValue;
  vsize: number;
  timestamp?: number | Date;
  confirmations?: number;
  state: TransactionState;
}

export interface BitcoinUtxo {
  txid: string;
  vout: number;
  value: SatoshiValue;
  confirmations: number;
  scriptType: ScriptType;
  address?: string;
  spendable?: boolean;
}

export interface TransactionEndpoint {
  id: string;
  address?: string;
  label?: string;
  value: SatoshiValue;
  scriptType?: ScriptType;
  coinbase?: boolean;
}

export interface FeeEstimate {
  label: string;
  blocks: number;
  satPerVbyte: number;
  minutes?: number;
}

const SATOSHIS_PER_BTC = BigInt(100_000_000);

export function toSatoshis(value: SatoshiValue): bigint {
  if (typeof value === "bigint") return value;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Satoshi value must be finite.");
    }
    return BigInt(Math.trunc(value));
  }

  if (!/^-?\d+$/.test(value.trim())) {
    throw new TypeError("Satoshi value must be an integer string.");
  }

  return BigInt(value);
}

export function formatSats(
  value: SatoshiValue,
  options: Intl.NumberFormatOptions = {},
) {
  const sats = toSatoshis(value);
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    ...options,
  }).format(sats);
}

export function formatBtc(
  value: SatoshiValue,
  {
    minimumFractionDigits = 0,
    maximumFractionDigits = 8,
  }: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {},
) {
  const sats = toSatoshis(value);
  const negative = sats < BigInt(0);
  const absolute = negative ? -sats : sats;
  const whole = absolute / SATOSHIS_PER_BTC;
  const remainder = absolute % SATOSHIS_PER_BTC;
  const fraction = remainder.toString().padStart(8, "0");
  const trimmed = fraction
    .slice(0, maximumFractionDigits)
    .replace(/0+$/, "")
    .padEnd(minimumFractionDigits, "0");

  return `${negative ? "-" : ""}${formatSats(whole)}${
    trimmed ? `.${trimmed}` : ""
  }`;
}

export function resolveAmountUnit(
  value: SatoshiValue,
  unit: AmountUnit,
): Exclude<AmountUnit, "auto"> {
  if (unit !== "auto") return unit;
  return toSatoshis(value) >= BigInt(1_000_000) ? "btc" : "sat";
}

export function truncateMiddle(
  value: string,
  startCharacters = 8,
  endCharacters = 8,
) {
  if (value.length <= startCharacters + endCharacters + 1) return value;
  return `${value.slice(0, startCharacters)}…${value.slice(-endCharacters)}`;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1_000) return `${Math.round(bytes)} B`;
  if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(1)} kB`;
  return `${(bytes / 1_000_000).toFixed(2)} MB`;
}

export function formatWeight(weight: number) {
  if (!Number.isFinite(weight) || weight < 0) return "—";
  return `${new Intl.NumberFormat("en-US").format(Math.round(weight))} WU`;
}

export function formatFeeRate(satPerVbyte: number) {
  if (!Number.isFinite(satPerVbyte) || satPerVbyte < 0) return "—";
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(satPerVbyte)} sat/vB`;
}

export function formatBlockHeight(height: number) {
  return new Intl.NumberFormat("en-US").format(height);
}

export function toDate(value: number | Date) {
  if (value instanceof Date) return value;
  return new Date(value < 10_000_000_000 ? value * 1_000 : value);
}

export function formatTimestamp(value: number | Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(toDate(value));
}

export function formatRelativeTime(
  value: number | Date,
  now: number | Date = new Date(),
) {
  const deltaSeconds = Math.round(
    (toDate(value).getTime() - toDate(now).getTime()) / 1_000,
  );
  const absolute = Math.abs(deltaSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absolute < 60) return formatter.format(deltaSeconds, "second");
  if (absolute < 3_600) {
    return formatter.format(Math.round(deltaSeconds / 60), "minute");
  }
  if (absolute < 86_400) {
    return formatter.format(Math.round(deltaSeconds / 3_600), "hour");
  }
  return formatter.format(Math.round(deltaSeconds / 86_400), "day");
}

export function getNetworkLabel(network: BitcoinNetwork) {
  return {
    mainnet: "Mainnet",
    testnet: "Testnet",
    signet: "Signet",
    regtest: "Regtest",
  }[network];
}

export function getScriptLabel(script: ScriptType) {
  return {
    p2pkh: "P2PKH",
    p2sh: "P2SH",
    p2wpkh: "P2WPKH",
    p2wsh: "P2WSH",
    p2tr: "P2TR",
    "op-return": "OP_RETURN",
    unknown: "Unknown",
  }[script];
}

export function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function feeRateFrom(fee: SatoshiValue, vsize: number) {
  if (!Number.isFinite(vsize) || vsize <= 0) return 0;
  return Number(toSatoshis(fee)) / vsize;
}

export function classifyBitcoinQuery(query: string): BitcoinSearchKind {
  const normalized = query.trim();
  if (/^\d{1,10}$/.test(normalized)) return "block-height";
  if (/^[a-fA-F0-9]{64}$/.test(normalized)) return "hash";
  if (
    /^(bc1|tb1|bcrt1)[a-zA-HJ-NP-Z0-9]{8,87}$/i.test(normalized) ||
    /^[123mn2][a-km-zA-HJ-NP-Z1-9]{24,34}$/.test(normalized)
  ) {
    return "address";
  }
  return "unknown";
}
