"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search profiles using natural language..."
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-12 py-4 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:ring-4 focus:ring-white/5"
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
        🔍
      </span>
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Search
      </button>
    </form>
  );
}
