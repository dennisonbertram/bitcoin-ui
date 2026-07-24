import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { BitcoinGallery } from "./bitcoin-gallery";

afterEach(cleanup);

describe("Bitcoin gallery", () => {
  it("leads with a positive, concrete product promise", () => {
    render(<BitcoinGallery />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Build clear Bitcoin interfaces.",
      }),
    ).toBeInTheDocument();
  });

  it("supports roving keyboard navigation for preview style", async () => {
    const user = userEvent.setup();
    render(<BitcoinGallery />);

    const group = screen.getByRole("radiogroup", {
      name: "Preview style",
    });
    const defaultMode = within(group).getByRole("radio", {
      name: "default",
    });
    const unstyledMode = within(group).getByRole("radio", {
      name: "unstyled",
    });

    defaultMode.focus();
    await user.keyboard("{ArrowRight}");

    expect(unstyledMode).toHaveFocus();
    expect(unstyledMode).toHaveAttribute("aria-checked", "true");
    expect(defaultMode).toHaveAttribute("tabindex", "-1");

    await user.keyboard("{Home}");
    expect(defaultMode).toHaveFocus();
    expect(defaultMode).toHaveAttribute("aria-checked", "true");
  });

  it("filters the component catalog by Bitcoin concept", async () => {
    const user = userEvent.setup();
    render(<BitcoinGallery />);

    const catalog = screen
      .getByRole("heading", { level: 2, name: "Component catalog" })
      .closest("section");

    expect(catalog).not.toBeNull();
    await user.type(
      within(catalog!).getByRole("searchbox", {
        name: "Search components",
      }),
      "merkle",
    );

    expect(within(catalog!).getByText("2 of 24")).toBeInTheDocument();
    expect(
      within(catalog!).getByRole("link", { name: /UTXO and Merkle/ }),
    ).toBeInTheDocument();
    expect(
      within(catalog!).getByRole("link", { name: /Merkle proof/ }),
    ).toBeInTheDocument();
  });

  it("switches a specimen between preview and code with the keyboard", async () => {
    const user = userEvent.setup();
    render(<BitcoinGallery />);

    const specimen = screen
      .getByRole("heading", {
        level: 3,
        name: "Animated confirmation relay",
      })
      .closest("article");

    expect(specimen).not.toBeNull();
    const previewTab = within(specimen!).getByRole("tab", {
      name: "Preview",
    });
    const codeTab = within(specimen!).getByRole("tab", { name: "Code" });

    previewTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(codeTab).toHaveFocus();
    expect(codeTab).toHaveAttribute("aria-selected", "true");
    expect(
      within(specimen!).getByRole("tabpanel", { name: "Code" }),
    ).toBeVisible();

    await user.keyboard("{Home}");
    expect(previewTab).toHaveFocus();
    expect(previewTab).toHaveAttribute("aria-selected", "true");
  });
});
