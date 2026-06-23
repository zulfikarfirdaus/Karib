"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps content so that when a visitor copies a meaningful chunk of text,
 * an attribution line + the canonical article URL is appended to the clipboard.
 * Small selections (< MIN_LENGTH) are left untouched so copying a single word
 * or a date doesn't tack on a URL.
 */
const MIN_LENGTH = 40;

export function CopyWithSource({
  title,
  url,
  children,
}: {
  title: string;
  url: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleCopy(e: ClipboardEvent) {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const selectedText = selection.toString();
      if (selectedText.trim().length < MIN_LENGTH) return;

      const clip = e.clipboardData;
      if (!clip) return;

      // Rich (HTML) version — preserved in editors that keep formatting.
      const fragment = document.createElement("div");
      for (let i = 0; i < selection.rangeCount; i++) {
        fragment.appendChild(selection.getRangeAt(i).cloneContents());
      }
      const html = `${fragment.innerHTML}<p>Sumber: <a href="${url}">${title}</a></p>`;

      const suffix = `\n\nSumber: ${title}\n${url}`;

      clip.setData("text/plain", selectedText + suffix);
      clip.setData("text/html", html);
      e.preventDefault();
    }

    el.addEventListener("copy", handleCopy);
    return () => el.removeEventListener("copy", handleCopy);
  }, [title, url]);

  return <div ref={ref}>{children}</div>;
}
