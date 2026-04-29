import { apiFetch } from "@/lib/api";

export default async function AdminPage() {
  // Check if user is admin (optional: backend would return 403 if not)
  // const response = await apiFetch("/api/v1/admin/stats");
  // const stats = await response.json();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-zinc-400">Manage system settings and user roles.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm">
          <p className="text-xs font-medium uppercase text-zinc-500">Total Profiles</p>
          <p className="mt-2 text-3xl font-bold">47</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm">
          <p className="text-xs font-medium uppercase text-zinc-500">System Users</p>
          <p className="mt-2 text-3xl font-bold">12</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm">
          <p className="text-xs font-medium uppercase text-zinc-500">Data Version</p>
          <p className="mt-2 text-3xl font-bold text-blue-400">V1.0</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-8 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">Role Management</h2>
        <p className="text-zinc-500 italic text-sm">Role management interface coming soon...</p>
      </div>
    </div>
  );
}
