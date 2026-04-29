import { apiFetch } from "@/lib/api";
import ProfileTable from "@/components/ProfileTable";
import Pagination from "@/components/Pagination";
import FilterPanel from "@/components/FilterPanel";
import ExportButton from "@/components/ExportButton";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Convert searchParams to query string
  const query = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) query.append(key, String(value));
  });

  const response = await apiFetch(`/api/v1/profiles?${query.toString()}`);
  const result = await response.json();

  if (!response.ok) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">Failed to load profiles: {result.message}</p>
      </div>
    );
  }

  const { data: profiles, pagination } = result;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profiles</h1>
          <p className="text-zinc-400">Manage and analyze profile intelligence data.</p>
        </div>
        <ExportButton />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <FilterPanel />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <ProfileTable profiles={profiles} />
          <Pagination pagination={pagination} />
        </div>
      </div>
    </div>
  );
}
