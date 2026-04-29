"use client";

import { useState } from "react";

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      window.location.href = "/api/profiles/export";
    } finally {
      // We don't really know when the download starts/finishes here
      setTimeout(() => setIsExporting(false), 2000);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
    >
      <span>{isExporting ? "⌛" : "📥"}</span>
      {isExporting ? "Exporting..." : "Export CSV"}
    </button>
  );
}
