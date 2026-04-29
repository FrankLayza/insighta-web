"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Users, Eye, Trash2, Loader2 } from "lucide-react";
import ExportButton from "./ExportButton";

interface Profile {
  id: string;
  name: string;
  gender: string;
  age: number;
  age_group: string;
  country_name: string;
  country_id: string;
  gender_probability: number;
  country_probability: number;
  created_at: string;
}

export default function ProfileTable({ profiles, isAdmin = false }: { profiles: Profile[]; isAdmin?: boolean }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;

    setDeletingId(id);
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrf_token="))
        ?.split("=")[1];

      const response = await fetch(`/api/v1/profiles/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": csrfToken || "",
        },
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Failed to delete: ${error.message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred during deletion.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4 border border-dashed border-border rounded-xl bg-surface/50">
        <Users size={48} className="text-text-muted" />
        <div className="text-center">
          <p className="text-text-primary font-semibold text-lg">No profiles tracked yet</p>
          <p className="text-sm text-text-muted max-w-xs mx-auto">
            Our intelligence engine is ready. Upload a dataset or wait for external API events to begin analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Export button – admin only */}
      {isAdmin && (
        <div className="absolute right-4 top-[-60px]">
          <ExportButton />
        </div>
      )}
      
      <div className="w-full overflow-x-auto glass-card p-0! overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 border-b border-border/50">
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Name Identity</th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Gender Classification</th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Age Tier</th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Regional Origin</th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Confidence Index</th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Detection Timestamp</th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right whitespace-nowrap">Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/2">
            {profiles.map((profile) => (
              <tr key={profile.id} className="group hover:bg-white/2 transition-all duration-300">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{profile.name}</span>
                    <span className="text-[10px] text-text-muted font-mono opacity-50"># {profile.id.substring(0, 8)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border",
                    profile.gender === 'male' 
                      ? "bg-blue-500/5 text-blue-400 border-blue-500/10" 
                      : "bg-pink-500/5 text-pink-400 border-pink-500/10"
                  )}>
                    {profile.gender}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold font-mono text-text-primary">{profile.age}</span>
                    <span className="text-[9px] text-text-muted font-bold uppercase tracking-tighter">({profile.age_group})</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary font-medium">{profile.country_name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1.5 min-w-[100px]">
                    <div className="flex items-center justify-between text-[9px] font-bold font-mono">
                      <span className="text-text-muted">GEN {Math.round(profile.gender_probability * 100)}%</span>
                      <span className="text-text-muted">LOC {Math.round(profile.country_probability * 100)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full flex overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${profile.gender_probability * 100}%` }} />
                      <div className="h-full bg-accent/30" style={{ width: `${profile.country_probability * 100}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-text-secondary font-medium">{formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
                    <span className="text-[10px] text-text-muted font-mono opacity-50">{new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <button className="btn-ghost p-2! rounded-md! hover:bg-accent/10" title="View Intelligence">
                      <Eye size={14} />
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(profile.id)}
                        disabled={deletingId === profile.id}
                        className="btn-danger p-2! rounded-md!" 
                        title="Purge Profile"
                      >
                        {deletingId === profile.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
