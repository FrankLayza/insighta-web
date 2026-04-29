"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pagination: {
    page: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export default function Pagination({ pagination }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (pagination.total_pages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={!pagination.has_prev}
        className="btn-secondary !p-2 disabled:opacity-30"
        title="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>
      
      <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-elevated border border-border">
        <span className="text-[11px] font-bold text-text-primary font-mono">{pagination.page}</span>
        <span className="text-[10px] text-text-muted font-bold">/</span>
        <span className="text-[11px] font-bold text-text-muted font-mono">{pagination.total_pages}</span>
      </div>
      
      <button
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={!pagination.has_next}
        className="btn-secondary !p-2 disabled:opacity-30"
        title="Next Page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
