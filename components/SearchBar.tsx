"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchBar({ 
  defaultValue = "", 
  className 
}: { 
  defaultValue?: string;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      // Reset searching state after navigation starts
      setTimeout(() => setIsSearching(false), 2000);
    } else {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative group", className)}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
        {isSearching ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Search size={20} />
        )}
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search profiles using natural language..."
        className="w-full bg-background border border-border rounded-xl pl-12 pr-24 py-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all text-base shadow-inner"
      />
      
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-elevated text-[10px] font-bold text-text-muted uppercase tracking-widest">
          Enter
        </div>
        <button
          type="submit"
          className="btn-primary py-1.5! px-4!"
        >
          Analyze
        </button>
      </div>
    </form>
  );
}
