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

  it("uses one global sticky-header offset for every anchor target", () => {
    const css = readFileSync(resolve(process.cwd(), "app/gallery.css"), "utf8");
    const gallery = readFileSync(
      resolve(process.cwd(), "components/gallery/bitcoin-gallery.tsx"),
      "utf8",
    );

    expect(css).not.toContain("scroll-margin-top");
    expect(gallery).not.toContain("scroll-mt-");
  });

  it("keeps hero network metrics readable in their narrow desktop column", () => {
    const gallery = readFileSync(
      resolve(process.cwd(), "components/gallery/bitcoin-gallery.tsx"),
      "utf8",
    );

    expect(gallery).toContain('className="lg:grid-cols-2 2xl:grid-cols-4"');
  });

  it("presents every component inside one integrated specimen bay", () => {
    const css = readFileSync(resolve(process.cwd(), "app/gallery.css"), "utf8");
    const preview = readFileSync(
      resolve(process.cwd(), "components/gallery/component-preview.tsx"),
      "utf8",
    );

    expect(css).toMatch(
      /\[data-slot="component-preview"\][\s\S]*?overflow: clip[\s\S]*?border:/,
    );
    expect(css).toMatch(
      /\.component-preview__install[\s\S]*?grid-template-columns:[\s\S]*?border-bottom:/,
    );
    expect(preview).toContain('role="tablist"');
    expect(preview).toContain(
      'className="component-preview__stage"',
    );
  });
});
