import { apiFetch } from "@/lib/api";
import ProfileTable from "@/components/ProfileTable";
import SearchBar from "@/components/SearchBar";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams.q as string;
  let results = [];
  let error = null;

  if (query) {
    const response = await apiFetch(`/api/v1/profiles/search?q=${encodeURIComponent(query)}`);
    const result = await response.json();
    
    if (response.ok) {
      results = result.data;
    } else {
      error = result.message;
    }
  }

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Natural Language Search</h1>
        <p className="mt-2 text-zinc-400">
          Try searching like: <span className="text-zinc-200">"men from Nigeria over 30"</span> or <span className="text-zinc-200">"women from London"</span>
        </p>
      </div>

      <div className="max-w-2xl">
        <SearchBar defaultValue={query} />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Search Results</h2>
        <ProfileTable profiles={results} />
      </div>
    </div>
  );
}
