"use client";

import type { ReactNode } from "react";

import { CopyButton } from "./copy-button";

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
  const command = `npx shadcn@latest add dennisonbertram/bitcoin-ui/${registryName}`;

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
        </div>
        <CopyButton value={command} label="Copy install command" />
      </header>
      <div
        className={
          wide
            ? "component-preview__body component-preview__body--wide"
            : "component-preview__body"
        }
      >
        <div className="component-preview__stage">
          <span className="component-preview__stage-label">Preview</span>
          <div className="component-preview__stage-content">{children}</div>
        </div>
        <figure className="component-preview__code">
          <figcaption>
            <span>example.tsx</span>
            <CopyButton value={code} compact />
          </figcaption>
          <pre>
            <code>{code}</code>
          </pre>
        </figure>
      </div>
    </article>
  );
}
