import { describe, expect, it } from "vitest";

import {
  classifyBitcoinQuery,
  feeRateFrom,
  formatBtc,
  formatSats,
  formatTimestamp,
  resolveAmountUnit,
  toSatoshis,
  truncateMiddle,
} from "./bitcoin";

describe("Bitcoin formatting", () => {
  it("formats exact satoshi values without floating point", () => {
    expect(formatSats("2100000000000000")).toBe("2,100,000,000,000,000");
    expect(formatBtc("123456789")).toBe("1.23456789");
    expect(formatBtc("-100000000")).toBe("-1");
  });

  it("rejects invalid satoshi values", () => {
    expect(() => toSatoshis("1.5")).toThrow(
      "Satoshi value must be an integer string.",
    );
    expect(() => toSatoshis(Number.POSITIVE_INFINITY)).toThrow(
      "Satoshi value must be finite.",
    );
  });

  it("resolves automatic display units", () => {
    expect(resolveAmountUnit(999_999, "auto")).toBe("sat");
    expect(resolveAmountUnit(1_000_000, "auto")).toBe("btc");
    expect(resolveAmountUnit(1, "btc")).toBe("btc");
  });

  it("truncates identifiers in the middle", () => {
    expect(truncateMiddle("1234567890abcdef", 4, 4)).toBe("1234…cdef");
    expect(truncateMiddle("short", 4, 4)).toBe("short");
  });

  it("classifies supported Bitcoin search identifiers", () => {
    expect(classifyBitcoinQuery("905742")).toBe("block-height");
    expect(classifyBitcoinQuery("a".repeat(64))).toBe("hash");
    expect(
      classifyBitcoinQuery(
        "bc1q7m0t4gu8v0y4x9q0p6apc4f7sr3k5ulj35h7gr",
      ),
    ).toBe("address");
    expect(classifyBitcoinQuery("not bitcoin")).toBe("unknown");
  });

  it("calculates fee rate from exact fees and vsize", () => {
    expect(feeRateFrom(3_124, 208)).toBeCloseTo(15.019, 3);
    expect(feeRateFrom(3_124, 0)).toBe(0);
  });

  it("formats timestamps in UTC for deterministic server hydration", () => {
    expect(formatTimestamp(new Date("2026-07-22T21:36:00.000Z"))).toBe(
      "Jul 22, 2026, 21:36",
    );
  });
});
