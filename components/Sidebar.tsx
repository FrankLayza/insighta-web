"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming a utility for class merging exists or I'll use a simple version

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Search", href: "/search", icon: "🔍" },
    { name: "Admin", href: "/admin", icon: "🛡️", adminOnly: true },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-4 text-zinc-400">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold text-white">Insighta Labs+</h2>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-900 hover:text-white ${
              pathname === item.href ? "bg-zinc-900 text-white" : ""
            }`}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-zinc-800 pt-4">
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
