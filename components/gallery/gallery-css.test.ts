import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("gallery shell CSS", () => {
  it("keeps the global preview-style control in the header", () => {
    const css = readFileSync(resolve(process.cwd(), "app/gallery.css"), "utf8");
    const gallery = readFileSync(
      resolve(process.cwd(), "components/gallery/bitcoin-gallery.tsx"),
      "utf8",
    );
    const header = gallery.match(
      /<header className="gallery-header">([\s\S]*?)<\/header>/,
    )?.[1];

    expect(header).toContain('aria-label="Preview style"');
    expect(gallery).not.toContain('className="gallery-toolbar"');
    expect(css).not.toContain(".gallery-toolbar");
  });
});
