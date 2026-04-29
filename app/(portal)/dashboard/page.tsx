import { apiFetch } from "@/lib/api";
import ProfileTable from "@/components/ProfileTable";
import Pagination from "@/components/Pagination";
import FilterPanel from "@/components/FilterPanel";
import { 
  AlertCircle, 
  ArrowUp, 
  CheckCircle2, 
  Info 
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function DashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) query.append(key, String(value));
  });

  const response = await apiFetch(`/api/v1/profiles?${query.toString()}`);
  const result = await response.json();

  if (!response.ok) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle size={48} className="text-red-400" />
        <div>
          <p className="text-text-primary font-semibold text-lg">Intelligence Feed Interrupted</p>
          <p className="text-sm text-text-muted font-mono">{result.message || "Unknown error connecting to backend"}</p>
        </div>
      </div>
    );
  }

  const { data: profiles, pagination } = result;

  // Determine user role for conditional UI
  const session = await getSession();
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <div className="space-y-8 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Intelligence Command</h1>
          <p className="text-text-secondary font-medium">Real-time profile classification and demographic inference.</p>
        </div>
        <div className="flex items-center gap-3 bg-surface/50 border border-border/50 px-4 py-2 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest">System Online</span>
          </div>
          <div className="h-4 w-px bg-border/50" />
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono">v4.2.0-stable</span>
        </div>
      </header>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          label="Tracked Profiles" 
          value={pagination.total.toLocaleString()} 
          trend="+12.4%" 
          trendUp={true} 
          context="since last month"
        />
        <MetricCard 
          label="Current View" 
          value={profiles.length.toLocaleString()} 
          context={`filtered from ${pagination.total.toLocaleString()}`}
        />
        <MetricCard 
          label="Confidence Avg" 
          value="88.2%" 
          trend="+2.1%" 
          trendUp={true} 
          context="precision index"
        />
        <MetricCard 
          label="System Status" 
          value="Active" 
          isStatus={true}
          context="All nodes operational"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <FilterPanel />
          
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/5 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="card p-0! overflow-hidden glass-card shadow-2xl">
              <ProfileTable profiles={profiles} isAdmin={isAdmin} />
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2 pt-2">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
              Displaying <span className="text-text-primary">{profiles.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}–{Math.min(pagination.page * pagination.limit, pagination.total)}</span> 
              <span className="mx-2">/</span> 
              Total <span className="text-text-primary">{pagination.total.toLocaleString()}</span>
            </p>
            <Pagination pagination={pagination} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  trend, 
  trendUp, 
  context, 
  isStatus 
}: { 
  label: string; 
  value: string; 
  trend?: string; 
  trendUp?: boolean; 
  context?: string;
  isStatus?: boolean;
}) {
  return (
    <div className="glass-card p-6 group cursor-default relative overflow-hidden">
      {/* Decorative gradient glow on hover */}
      <div className="absolute -right-8 -top-8 h-24 w-24 bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-all duration-500" />
      
      <div className="flex justify-between items-start relative z-10">
        <p className="text-section-title group-hover:text-text-primary transition-colors">{label}</p>
        {isStatus ? (
          <CheckCircle2 size={16} className="text-emerald-500 animate-pulse" />
        ) : (
          <Info size={16} className="text-text-muted group-hover:text-accent transition-colors" />
        )}
      </div>
      
      <div className="mt-4 flex items-baseline gap-3 relative z-10">
        <p className="font-data text-text-primary leading-none group-hover:scale-[1.02] transition-transform duration-300 origin-left">
          {value}
        </p>
        {trend && (
          <span className={cn(
            "text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
            trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>
            <ArrowUp size={10} className={!trendUp ? "rotate-180" : ""} />
            {trend}
          </span>
        )}
      </div>
      
      {context && <p className="mt-2 text-[10px] text-text-muted font-medium uppercase tracking-wider">{context}</p>}
      
      {/* Progress bar refinement */}
      {!isStatus && (
        <div className="mt-4 h-1 w-full bg-border/50 rounded-full overflow-hidden relative z-10">
          <div 
            className="h-full bg-accent group-hover:bg-accent-hover transition-all duration-1000 ease-out" 
            style={{ width: trendUp ? '75%' : '45%' }}
          />
        </div>
      )}
    </div>
  );
}
