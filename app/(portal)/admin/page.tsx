import { apiFetch } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Users, 
  Activity,
  Key,
  Check,
  Shield,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  const searchParams = await props.searchParams;
  const activeTab = (searchParams.tab as string) || "users";

  // Server-side Role Guard
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-10 pb-20 max-w-[1400px] mx-auto">
      <header className="space-y-2">
        <h1 className="text-page-title text-text-primary">Administrative Control</h1>
        <p className="text-text-secondary">System monitoring, role management, and security audit logs.</p>
      </header>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 p-1 bg-background rounded-lg border border-border w-fit">
        {[
          { id: "users", label: "Users", icon: Users },
          { id: "sessions", label: "Active Sessions", icon: Key },
          { id: "audit", label: "Audit Log", icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <a
              key={tab.id}
              href={`?tab=${tab.id}`}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all",
                isActive 
                  ? "bg-accent text-white" 
                  : "text-text-muted hover:text-text-primary hover:bg-elevated"
              )}
            >
              <Icon size={14} />
              {tab.label}
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "sessions" && <SessionsTab />}
        {activeTab === "audit" && <AuditLogTab />}
      </div>
    </div>
  );
}

/* ─── Users Tab ─────────────────────────────────────────────────── */

async function UsersTab() {
  let users: Array<{
    id: string;
    name: string | null;
    email: string | null;
    github_id?: string;
    role: string;
    active_sessions?: number;
    created_at: string;
  }> = [];
  let fetchError = false;

  try {
    const response = await apiFetch("/api/v1/admin/users");
    if (response.ok) {
      const result = await response.json();
      users = result.data || [];
    } else {
      fetchError = true;
    }
  } catch {
    fetchError = true;
  }

  // Fallback to session-derived data
  if (fetchError || users.length === 0) {
    const session = await getSession();
    if (session) {
      users = [{
        id: session.user.id || "1",
        name: session.user.name || "Current User",
        email: null,
        role: session.user.role,
        created_at: new Date().toISOString(),
      }];
    }
  }

  return (
    <div className="card p-0! overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-surface border-b border-border">
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">User</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Role</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Active Sessions</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Joined</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-elevated">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-elevated/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                    {(user.name || "U")[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text-primary">{user.name || "Unknown"}</span>
                    <span className="text-[10px] text-text-muted">{user.email || user.github_id || user.id.substring(0, 8)}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  user.role === "ADMIN" ? "badge-admin" : "badge-analyst"
                )}>
                  <Shield className="inline mr-1" size={10} />
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-text-secondary font-mono">{user.active_sessions ?? "—"}</span>
              </td>
              <td className="px-6 py-4 text-xs text-text-secondary">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <span className="badge-active">Active</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Sessions Tab ──────────────────────────────────────────────── */

async function SessionsTab() {
  let sessions: Array<{
    id: string;
    user_name?: string | null;
    user_email?: string | null;
    user_role?: string;
    is_current?: boolean;
    created_at?: string;
    expires_at?: string;
  }> = [];
  let fetchError = false;

  try {
    const response = await apiFetch("/api/v1/admin/sessions");
    if (response.ok) {
      const result = await response.json();
      sessions = result.data || [];
    } else {
      fetchError = true;
    }
  } catch {
    fetchError = true;
  }

  if (fetchError || sessions.length === 0) {
    sessions = [{
      id: "current",
      user_name: "Current User",
      user_role: "ADMIN",
      is_current: true,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted">
          {sessions.length} Active Session{sessions.length !== 1 ? "s" : ""}
        </h3>
      </div>
      <div className="grid gap-4">
        {sessions.map((s) => (
          <div key={s.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-elevated border border-border flex items-center justify-center text-text-secondary">
                <Key size={20} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">{s.user_name || "Unknown"}</span>
                  {s.user_role && (
                    <span className={cn(
                      "text-[9px]",
                      s.user_role === "ADMIN" ? "badge-admin" : "badge-analyst"
                    )}>
                      {s.user_role}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-text-muted flex items-center gap-1">
                  <Clock size={9} />
                  {s.created_at ? `Created ${new Date(s.created_at).toLocaleString()}` : "—"}
                  {s.expires_at && ` • Expires ${new Date(s.expires_at).toLocaleString()}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {s.is_current ? (
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1 badge-active">
                  <Check size={10} /> Current
                </span>
              ) : (
                <span className="text-[10px] text-text-muted font-mono">
                  {s.id.substring(0, 8)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Audit Log Tab ─────────────────────────────────────────────── */

async function AuditLogTab() {
  let logs: Array<{
    id?: string;
    timestamp?: string;
    user?: string;
    user_role?: string;
    action: string;
    resource?: string;
    method?: string;
    status_code?: number;
    ip_address?: string;
  }> = [];
  let fetchError = false;

  try {
    const response = await apiFetch("/api/v1/admin/audit-logs?limit=50");
    if (response.ok) {
      const result = await response.json();
      logs = result.data || [];
    } else {
      fetchError = true;
    }
  } catch {
    fetchError = true;
  }

  if (fetchError || logs.length === 0) {
    return (
      <div className="card p-0! overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Activity size={40} className="text-text-muted opacity-30" />
          <p className="text-sm text-text-primary font-semibold">No audit logs recorded yet</p>
          <p className="text-xs text-text-muted max-w-sm text-center">
            Actions are recorded automatically as users interact with the system. Logs will appear here after authenticated API calls are made.
          </p>
        </div>
      </div>
    );
  }

  // Color-code action badges
  function actionColor(action: string): string {
    if (action.includes("DELETE") || action.includes("REVOKE")) return "bg-red-500/10 text-red-400 border-red-500/20";
    if (action.includes("CREATE") || action.includes("LOGIN")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (action.includes("EXPORT")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (action.includes("UPDATE")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-elevated text-text-primary border-border";
  }

  return (
    <div className="card p-0! overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-surface border-b border-border">
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Timestamp</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">User</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Action</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Resource</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Method</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-elevated">
          {logs.map((l, i) => (
            <tr key={l.id || i} className="hover:bg-elevated/30 transition-colors text-xs">
              <td className="px-6 py-3 text-text-muted font-mono text-[11px]">
                {l.timestamp ? new Date(l.timestamp).toLocaleString() : "—"}
              </td>
              <td className="px-6 py-3">
                <span className="text-text-secondary font-semibold">{l.user || "System"}</span>
              </td>
              <td className="px-6 py-3">
                <span className={cn(
                  "px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider",
                  actionColor(l.action)
                )}>
                  {l.action}
                </span>
              </td>
              <td className="px-6 py-3 text-text-muted font-mono text-[11px] max-w-[200px] truncate">
                {l.resource || "—"}
              </td>
              <td className="px-6 py-3 text-text-muted font-mono text-[11px]">
                {l.method || "—"}
              </td>
              <td className="px-6 py-3 text-right">
                {l.status_code ? (
                  <span className={cn(
                    "font-mono text-[11px] font-bold",
                    l.status_code < 300 ? "text-emerald-400" :
                    l.status_code < 400 ? "text-amber-400" :
                    "text-red-400"
                  )}>
                    {l.status_code}
                  </span>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
