"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between py-4">
      <p className="text-sm text-zinc-500">
        Page <span className="text-white font-medium">{pagination.page}</span> of{" "}
        <span className="text-white font-medium">{pagination.total_pages}</span>
      </p>
      
      <div className="flex gap-2">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.has_prev}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.has_next}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          Next
        </button>
      </div>
    </div>
  );
}
