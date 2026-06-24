"use client";

import { DownloadSimple } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { FilePdf } from "@phosphor-icons/react/dist/csr/FilePdf";
import { CaretUp } from "@phosphor-icons/react/dist/csr/CaretUp";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { MagnifyingGlassMinus } from "@phosphor-icons/react/dist/csr/MagnifyingGlassMinus";
import { MagnifyingGlassPlus } from "@phosphor-icons/react/dist/csr/MagnifyingGlassPlus";
import { useState } from "react";

interface PDFViewerProps {
  url: string;
  filename?: string;
}

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5];
const DEFAULT_ZOOM = 1;
const BASE_H = 560; // px — the "1×" container height

export function PDFViewer({ url, filename = "dokumen.pdf" }: PDFViewerProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const zoomIdx = ZOOM_STEPS.indexOf(zoom);
  const canZoomOut = zoomIdx > 0;
  const canZoomIn = zoomIdx < ZOOM_STEPS.length - 1;

  function zoomOut() {
    if (canZoomOut) setZoom(ZOOM_STEPS[zoomIdx - 1]);
  }
  function zoomIn() {
    if (canZoomIn) setZoom(ZOOM_STEPS[zoomIdx + 1]);
  }
  function resetZoom() {
    setZoom(DEFAULT_ZOOM);
  }

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      {/* Header bar — file info + primary actions */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-card border-b border-border">
        {/* Left: file info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FilePdf size={18} weight="fill" className="text-accent shrink-0" />
          <span className="font-heading text-sm font-semibold text-fg truncate">
            {filename}
          </span>
        </div>

        {/* Right: primary actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Download */}
          <a
            href={url}
            download={filename}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white font-heading text-xs font-semibold px-3 h-8 rounded-lg transition-colors"
          >
            <DownloadSimple size={13} weight="bold" />
            Unduh
          </a>

          {/* Collapse */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Tampilkan PDF" : "Sembunyikan PDF"}
            className="flex items-center gap-1 text-xs font-heading text-fg-muted hover:text-fg border border-border rounded-lg px-2 sm:px-2.5 h-8 transition-colors"
          >
            {collapsed ? (
              <><CaretDown size={12} weight="bold" /><span className="hidden sm:inline">Tampilkan</span></>
            ) : (
              <><CaretUp size={12} weight="bold" /><span className="hidden sm:inline">Sembunyikan</span></>
            )}
          </button>
        </div>
      </div>

      {/* PDF viewport + zoom footer */}
      {!collapsed && (
        <>
          <div
            className="overflow-hidden w-full bg-[#f5f5f0] dark:bg-[#1a1917]"
            style={{ height: BASE_H }}
          >
            <iframe
              src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
              title={filename}
              style={{
                display: "block",
                border: 0,
                width: `${100 / zoom}%`,
                height: BASE_H / zoom,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
            />
          </div>

          {/* Footer: zoom controls */}
          <div className="flex items-center justify-center gap-1.5 px-3 py-2 bg-card border-t border-border">
            <button
              onClick={zoomOut}
              disabled={!canZoomOut}
              aria-label="Perkecil"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-fg-muted hover:text-fg hover:border-fg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <MagnifyingGlassMinus size={15} weight="regular" />
            </button>

            {/* Zoom level — click to reset */}
            <button
              onClick={resetZoom}
              title="Reset ke 100%"
              className="min-w-[56px] h-8 px-2 font-heading text-xs font-semibold text-fg-muted hover:text-fg border border-border rounded-lg transition-colors tabular-nums"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              onClick={zoomIn}
              disabled={!canZoomIn}
              aria-label="Perbesar"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-fg-muted hover:text-fg hover:border-fg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <MagnifyingGlassPlus size={15} weight="regular" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
