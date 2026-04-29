import { apiFetch } from "@/lib/api";
import ProfileTable from "@/components/ProfileTable";
import SearchBar from "@/components/SearchBar";
import { Search, SearchX } from "lucide-react";

export default async function SearchPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = (searchParams.q as string) || "";
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
    <div className="space-y-12 max-w-5xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-page-title text-text-primary">Natural Language Search</h1>
        <p className="text-text-secondary text-lg">
          Unlock insights using plain English. Our engine understands demographic intent and filters your profiles instantly.
        </p>
      </header>

      <div className="space-y-6">
        <div className="card p-4! space-y-6 border-accent/20">
          <SearchBar defaultValue={query} />
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Suggestions:</span>
            {[
              "men from Nigeria over 30",
              "women from Lagos in their 20s",
              "adults from London"
            ].map((example) => (
              <button 
                key={example} 
                className="px-3 py-1.5 rounded-full bg-elevated border border-border text-[11px] font-medium text-text-secondary hover:text-text-primary hover:border-text-secondary transition-all"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="text-sm font-bold text-red-400">Search Intelligence Failure</p>
          <p className="text-xs text-red-400/70 mt-1">{error}</p>
        </div>
      )}

      {query && !error && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-end justify-between border-b border-border pb-4">
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-semibold text-text-primary">Intelligence Results</h2>
              <span className="text-sm text-text-muted italic">Query: "{query}"</span>
            </div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{results.length} matches found</span>
          </div>
          
          <div className="card p-0! overflow-hidden">
            <ProfileTable profiles={results} />
          </div>
        </div>
      )}

      {!query && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <SearchX size={64} className="text-text-muted opacity-20" />
          <div className="text-center space-y-1">
            <p className="text-text-primary font-semibold">Enter a query to search profiles</p>
            <p className="text-sm text-text-muted">Try: "adults from London"</p>
          </div>
        </div>
      )}
    </div>
  );
}
