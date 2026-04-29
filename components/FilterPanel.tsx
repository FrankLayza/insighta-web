"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { Filter, X, ChevronDown, Search, RefreshCw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchName, setSearchName] = useState(searchParams.get("name") || "");

  const hasFilters = searchParams.toString().length > 0;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(`?${createQueryString(name, value)}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("name", searchName);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-surface/30 p-2! rounded-2xl border border-border/50 backdrop-blur-md relative z-50">
      {/* Search Input Container */}
      <div className="relative flex-1 min-w-[280px] group">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search Identity or Location..."
            className="w-full bg-background/40 border border-border/40 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-medium text-text-primary placeholder:text-text-muted focus:border-accent/40 focus:bg-background/60 focus:ring-1 focus:ring-accent/10 outline-none transition-all shadow-sm"
          />
        </form>
      </div>

      <div className="hidden lg:block h-6 w-px bg-border/50 mx-1" />

      {/* Controls Container */}
      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
        <CustomSelect 
          label="Gender"
          value={searchParams.get("gender") || ""}
          options={[
            { id: "", label: "All Genders" },
            { id: "male", label: "Male" },
            { id: "female", label: "Female" },
          ]}
          onChange={(val) => handleFilterChange("gender", val)}
        />

        <CustomSelect 
          label="Age Tier"
          value={searchParams.get("age_group") || ""}
          options={[
            { id: "", label: "All Tiers" },
            { id: "child", label: "Child" },
            { id: "teenager", label: "Teenager" },
            { id: "adult", label: "Adult" },
            { id: "senior", label: "Senior" },
          ]}
          onChange={(val) => handleFilterChange("age_group", val)}
        />

        <CustomSelect 
          label="Sort By"
          value={searchParams.get("sort_by") || "created_at"}
          options={[
            { id: "created_at", label: "Recent Detection" },
            { id: "age", label: "Age Variance" },
            { id: "gender_probability", label: "Confidence Index" },
          ]}
          onChange={(val) => handleFilterChange("sort_by", val)}
        />

        <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />

        <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
          {hasFilters && (
            <button 
              onClick={() => {
                setSearchName("");
                router.push("?", { scroll: false });
              }}
              className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
              title="Clear All Filters"
            >
              <X size={16} />
            </button>
          )}
          <button 
            onClick={() => router.refresh()}
            className="p-2.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"
            title="Refresh Intelligence Feed"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomSelect({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: { id: string; label: string }[];
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.id === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-fit" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2.5 rounded-xl bg-background/30 border border-border/30 transition-all",
          isOpen ? "border-accent/50 bg-background/50 ring-1 ring-accent/10" : "hover:border-accent/30 hover:bg-background/50"
        )}
      >
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter whitespace-nowrap">{label}:</span>
        <span className="text-xs font-bold text-text-secondary truncate max-w-[120px]">{selectedOption.label}</span>
        <ChevronDown size={12} className={cn("text-text-muted transition-transform duration-300", isOpen && "rotate-180 text-accent")} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 min-w-[200px] bg-surface border border-border/50 rounded-xl shadow-2xl z-100 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
          <div className="px-3 py-1.5 mb-1 border-b border-border/30">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Select {label}</span>
          </div>
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold transition-colors",
                option.id === value 
                  ? "text-accent bg-accent/5" 
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              )}
            >
              {option.label}
              {option.id === value && <Check size={12} className="text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
