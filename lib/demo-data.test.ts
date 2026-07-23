import { describe, expect, it } from "vitest";

import {
  demoAddress,
  demoMempoolPacketSamples,
  demoOutputs,
  demoUtxos,
} from "./demo-data";

describe("gallery fixture integrity", () => {
  it("keeps SegWit address prefixes aligned with script metadata", () => {
    expect(demoAddress).toMatch(/^bc1q/);
    expect(demoUtxos[0]).toMatchObject({
      address: demoAddress,
      scriptType: "p2wpkh",
    });

    const taprootOutput = demoOutputs.find(
      (output) => output.scriptType === "p2tr",
    );
    expect(taprootOutput?.address).toMatch(/^bc1p/);
    expect(taprootOutput?.address).toHaveLength(62);
  });

  it("uses pending-only fixtures for the mempool visualization", () => {
    expect(demoMempoolPacketSamples.length).toBeGreaterThan(1);
    expect(
      demoMempoolPacketSamples.every(
        (sample) => sample.status === "Waiting",
      ),
    ).toBe(true);
  });
});
