"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (type: "current" | "all") => {
    setIsExporting(true);
    setIsOpen(false);
    try {
      // Build export URL with optional query params
      const params = new URLSearchParams(window.location.search);
      const exportUrl = type === "all" 
        ? "/api/profiles/export?all=true" 
        : `/api/profiles/export?${params.toString()}`;

      // Trigger download via hidden link
      const link = document.createElement("a");
      link.href = exportUrl;
      link.download = "profiles_export.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export profiles.");
    } finally {
      setTimeout(() => setIsExporting(false), 2000);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={cn(
          "btn-secondary gap-2",
          isExporting && "opacity-80 pointer-events-none"
        )}
      >
        {isExporting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        <span className="font-semibold">
          {isExporting ? "Preparing..." : "Export CSV"}
        </span>
        {!isExporting && <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-elevated border border-border rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
          <button
            onClick={() => handleExport("current")}
            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface transition-colors"
          >
            Export current view
          </button>
          <button
            onClick={() => handleExport("all")}
            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface transition-colors"
          >
            Export all profiles
          </button>
        </div>
      )}
    </div>
  );
}
