import type { ComponentProps } from "react";

import type { BitcoinNetwork, ScriptType } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import { HashDisplay } from "./hash-display";
import { NetworkBadge } from "./network-badge";
import { ScriptBadge } from "./script-badge";
import { type BitcoinVisualProps } from "./shared";

export type AddressDisplayProps = Omit<ComponentProps<"div">, "children"> &
  BitcoinVisualProps & {
    address: string;
    network?: BitcoinNetwork;
    scriptType?: ScriptType;
    label?: string;
    href?: string;
    copyable?: boolean;
  };

export function AddressDisplay({
  address,
  network,
  scriptType,
  label,
  href,
  copyable = true,
  unstyled,
  className,
  ...props
}: AddressDisplayProps) {
  return (
    <div
      data-slot="address-display"
      data-unstyled={unstyled || undefined}
      className={componentClasses(unstyled, "grid min-w-0 gap-2", className)}
      {...props}
    >
      {label ? (
        <span
          data-slot="address-display-label"
          className={componentClasses(
            unstyled,
            "text-xs text-[var(--color-muted)]",
          )}
        >
          {label}
        </span>
      ) : null}
      <HashDisplay
        value={address}
        label="Address"
        href={href}
        copyable={copyable}
        startCharacters={12}
        endCharacters={8}
        unstyled={unstyled}
      />
      {network || scriptType ? (
        <div
          data-slot="address-display-meta"
          className={componentClasses(unstyled, "flex flex-wrap gap-2")}
        >
          {network ? (
            <NetworkBadge network={network} unstyled={unstyled} />
          ) : null}
          {scriptType ? (
            <ScriptBadge type={scriptType} unstyled={unstyled} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
