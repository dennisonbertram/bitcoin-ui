import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

type RegistryItem = {
  name: string;
  files?: Array<{ path: string }>;
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
};

type Registry = {
  homepage?: string;
  items: RegistryItem[];
};

const registry = JSON.parse(
  readFileSync(resolve(process.cwd(), "registry.json"), "utf8"),
) as Registry;

describe("shadcn registry contract", () => {
  it("does not publish a localhost homepage", () => {
    expect(registry.homepage).toBe(
      "https://dennisonbertram.github.io/bitcoin-ui/",
    );
    expect(registry.homepage).not.toMatch(
      /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::|\/|$)/,
    );
  });

  it("uses direct GitHub registry references for transitive installs", () => {
    const serialized = JSON.stringify(registry);

    expect(serialized).not.toContain("@bitcoin-ui/");
    expect(serialized).toContain("dennisonbertram/bitcoin-ui/bitcoin-core");
  });

  it("defines every CSS variable consumed by motion registry items", () => {
    const theme = registry.items.find((item) => item.name === "bitcoin-theme");
    const defined = new Set([
      ...Object.keys(theme?.cssVars?.theme ?? {}),
      ...Object.keys(theme?.cssVars?.light ?? {}),
      ...Object.keys(theme?.cssVars?.dark ?? {}),
    ]);
    const used = new Set<string>();

    for (const itemName of ["bitcoin-motion", "longest-chain"]) {
      const item = registry.items.find((entry) => entry.name === itemName);
      for (const file of item?.files ?? []) {
        const source = readFileSync(resolve(process.cwd(), file.path), "utf8");

        for (const match of source.matchAll(/var\(--([a-z0-9-]+)/g)) {
          used.add(match[1]);
        }
        for (const match of source.matchAll(/--([a-z0-9-]+)\s*:/g)) {
          defined.add(match[1]);
        }
        for (const match of source.matchAll(/["']--([a-z0-9-]+)["']/g)) {
          defined.add(match[1]);
        }
      }
    }

    expect([...used].filter((variable) => !defined.has(variable)).sort()).toEqual(
      [],
    );
  });
});
