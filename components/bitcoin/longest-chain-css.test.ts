import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("longest-chain responsive canvas", () => {
  it("fits the complete chain inside the visible viewport", () => {
    const css = readFileSync(
      resolve(process.cwd(), "components/bitcoin/longest-chain.module.css"),
      "utf8",
    );
    const viewport = css.match(/\.viewport\s*\{([^}]*)\}/)?.[1];
    const canvas = css.match(/\.canvas\s*\{([^}]*)\}/)?.[1];

    expect(viewport).toMatch(/overflow:\s*clip/);
    expect(canvas).toMatch(/width:\s*100%/);
    expect(canvas).toMatch(/min-width:\s*0/);
    expect(css).not.toContain("min-width: 58rem");
  });
});
