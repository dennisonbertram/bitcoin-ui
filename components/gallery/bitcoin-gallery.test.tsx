import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { BitcoinGallery } from "./bitcoin-gallery";

describe("Bitcoin gallery", () => {
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
});
