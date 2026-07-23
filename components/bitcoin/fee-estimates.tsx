"use client";

import { Check } from "lucide-react";
import {
  type ComponentProps,
  type KeyboardEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { formatFeeRate, type FeeEstimate } from "@/lib/bitcoin";
import { componentClasses } from "@/lib/utils";

import {
  interactiveStyles,
  panelStyles,
  type BitcoinVisualProps,
} from "./shared";

export type FeeEstimatesProps = Omit<ComponentProps<"div">, "children"> &
  BitcoinVisualProps & {
    estimates: FeeEstimate[];
    selectedBlocks?: number;
    defaultSelectedBlocks?: number;
    onSelectionChange?: (estimate: FeeEstimate) => void;
    disabled?: boolean;
  };

export function FeeEstimates({
  estimates,
  selectedBlocks,
  defaultSelectedBlocks,
  onSelectionChange,
  disabled,
  unstyled,
  className,
  ...props
}: FeeEstimatesProps) {
  const groupLabelId = useId();
  const initial = defaultSelectedBlocks ?? estimates[0]?.blocks;
  const [internalSelection, setInternalSelection] = useState(initial);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const currentSelection = selectedBlocks ?? internalSelection;
  const sorted = useMemo(
    () => [...estimates].sort((a, b) => a.blocks - b.blocks),
    [estimates],
  );

  function chooseEstimate(estimate: FeeEstimate) {
    if (disabled) return;
    if (selectedBlocks === undefined) setInternalSelection(estimate.blocks);
    onSelectionChange?.(estimate);
  }

  function handleOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (disabled || sorted.length === 0) return;

    let nextIndex: number;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        nextIndex = (index + 1) % sorted.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        nextIndex = (index - 1 + sorted.length) % sorted.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = sorted.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    chooseEstimate(sorted[nextIndex]);
    optionRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      data-slot="fee-estimates"
      data-disabled={disabled || undefined}
      data-unstyled={unstyled || undefined}
      className={componentClasses(
        unstyled,
        [panelStyles, "grid gap-1 p-1"],
        className,
      )}
      role="radiogroup"
      aria-labelledby={groupLabelId}
      aria-disabled={disabled}
      {...props}
    >
      <div
        id={groupLabelId}
        className={componentClasses(
          unstyled,
          "px-3 pb-2 pt-3 text-sm font-medium",
        )}
      >
        Fee estimate
      </div>
      {sorted.map((estimate, index) => {
        const selected = currentSelection === estimate.blocks;
        const hasSelectedOption = sorted.some(
          (option) => option.blocks === currentSelection,
        );
        const minutes = estimate.minutes ?? estimate.blocks * 10;

        return (
          <button
            key={estimate.blocks}
            data-slot="fee-estimate-option"
            data-state={selected ? "selected" : "idle"}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (!hasSelectedOption && index === 0) ? 0 : -1}
            disabled={disabled}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            onClick={() => chooseEstimate(estimate)}
            onKeyDown={(event) => handleOptionKeyDown(event, index)}
            className={componentClasses(
              unstyled,
              [
                interactiveStyles,
                "grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-[var(--radius-md)] px-3 py-2 text-left hover:bg-[var(--color-surface-hover)] data-[state=selected]:bg-[var(--color-surface-active)]",
              ],
            )}
          >
            <span className="min-w-0">
              <span
                className={componentClasses(
                  unstyled,
                  "flex items-center gap-2 text-sm font-medium",
                )}
              >
                {estimate.label}
                {selected ? (
                  <Check
                    aria-hidden="true"
                    className={componentClasses(
                      unstyled,
                      "size-3.5 text-[var(--color-success)]",
                    )}
                  />
                ) : null}
              </span>
              <span
                className={componentClasses(
                  unstyled,
                  "mt-0.5 block text-xs text-[var(--color-muted)]",
                )}
              >
                ~{minutes} min · {estimate.blocks}{" "}
                {estimate.blocks === 1 ? "block" : "blocks"}
              </span>
            </span>
            <span
              className={componentClasses(
                unstyled,
                "font-mono text-sm font-medium tabular-nums",
              )}
            >
              {formatFeeRate(estimate.satPerVbyte)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
