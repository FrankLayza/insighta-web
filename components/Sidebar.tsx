"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Search, 
  Shield, 
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; role: "ADMIN" | "ANALYST" } | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const userInfo = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_info="))
      ?.split("=")[1];

    if (userInfo) {
      try {
        setUser(JSON.parse(decodeURIComponent(userInfo)));
      } catch (e) {
        console.error("Failed to parse user info");
      }
    }
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Search", href: "/search", icon: Search },
    ...(user?.role === "ADMIN" ? [{ name: "Admin", href: "/admin", icon: Shield }] : []),
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-surface border border-border rounded-lg shadow-lg text-text-primary"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-surface p-4 transition-transform duration-300 ease-in-out md:relative md:w-60 md:translate-x-0 flex-none",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="mb-8 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xl">
              I
            </div>
            <h2 className="text-xl font-semibold text-text-primary tracking-tight">Insighta</h2>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-text-secondary hover:bg-elevated hover:text-text-primary"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border pt-6 pb-2 px-2">
          {user && (
            <div className="mb-6 px-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-elevated flex items-center justify-center text-text-primary border border-border">
                <User size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-text-primary truncate">{user.name}</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  user.role === "ADMIN" ? "text-accent" : "text-text-muted"
                )}>
                  {user.role}
                </span>
              </div>
            </div>
          )}
          
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/";
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
