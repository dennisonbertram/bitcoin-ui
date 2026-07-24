"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";

import { CopyButton } from "./copy-button";

type PreviewView = "preview" | "code";

export type ComponentPreviewProps = {
  id: string;
  title: string;
  description: string;
  registryName: string;
  code: string;
  children: ReactNode;
  wide?: boolean;
};

export function ComponentPreview({
  id,
  title,
  description,
  registryName,
  code,
  children,
  wide,
}: ComponentPreviewProps) {
  const [view, setView] = useState<PreviewView>("preview");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const command = `npx shadcn@latest add dennisonbertram/bitcoin-ui/${registryName}`;

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const views = ["preview", "code"] as const;
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (index + 1) % views.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (index - 1 + views.length) % views.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = views.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setView(views[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <article
      id={id}
      data-slot="component-preview"
    >
      <header className="component-preview__header">
        <div className="min-w-0">
          <h3 className="component-preview__title">{title}</h3>
          <p className="component-preview__description">
            {description}
          </p>
          <ul className="component-preview__meta" aria-label="Component metadata">
            <li>{registryName}</li>
            <li>React</li>
            <li>TypeScript</li>
            <li>unstyled-ready</li>
          </ul>
        </div>
      </header>
      <div className="component-preview__install">
        <span>Install</span>
        <code>{command}</code>
        <CopyButton value={command} compact />
      </div>
      <div
        className={
          wide
            ? "component-preview__body component-preview__body--wide"
            : "component-preview__body"
        }
      >
        <div
          className="component-preview__tabs"
          role="tablist"
          aria-label={`${title} example`}
        >
          {(["preview", "code"] as const).map((tab, index) => (
            <button
              key={tab}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-${tab}-tab`}
              aria-controls={`${id}-${tab}-panel`}
              aria-selected={view === tab}
              tabIndex={view === tab ? 0 : -1}
              data-state={view === tab ? "selected" : "idle"}
              onClick={() => setView(tab)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {tab === "preview" ? "Preview" : "Code"}
            </button>
          ))}
        </div>
        <div
          id={`${id}-preview-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-preview-tab`}
          hidden={view !== "preview"}
          className="component-preview__stage"
        >
          <div className="component-preview__stage-content">{children}</div>
        </div>
        <figure
          id={`${id}-code-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-code-tab`}
          hidden={view !== "code"}
          className="component-preview__code"
        >
          <figcaption>
            <span>example.tsx</span>
            <CopyButton value={code} compact />
          </figcaption>
          <pre>
            <code>{code}</code>
          </pre>
        </figure>
        <span className="sr-only" aria-live="polite">
          {view === "preview" ? "Preview visible" : "Code visible"}
        </span>
      </div>
    </article>
  );
}
