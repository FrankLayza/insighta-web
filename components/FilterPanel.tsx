"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    router.push(`?${createQueryString(name, value)}`);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm">
      <h3 className="mb-4 font-semibold text-white">Filters</h3>
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase text-zinc-500">Gender</label>
          <select
            value={searchParams.get("gender") || ""}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase text-zinc-500">Age Group</label>
          <select
            value={searchParams.get("age_group") || ""}
            onChange={(e) => handleFilterChange("age_group", e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="">All Ages</option>
            <option value="child">Child</option>
            <option value="teenager">Teenager</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase text-zinc-500">Sort By</label>
          <select
            value={searchParams.get("sort_by") || "created_at"}
            onChange={(e) => handleFilterChange("sort_by", e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="created_at">Date Created</option>
            <option value="age">Age</option>
            <option value="gender_probability">Confidence</option>
          </select>
        </div>

        <button
          onClick={() => router.push("?")}
          className="w-full rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
