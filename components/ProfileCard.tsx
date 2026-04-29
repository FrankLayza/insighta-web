interface Profile {
  id: string;
  name: string;
  gender: string;
  age: number;
  age_group: string;
  country_name: string;
  gender_probability: number;
  country_probability: number;
  created_at: string;
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl transition-all hover:border-zinc-700">
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-8">
        <div className="flex items-center justify-between">
          <div className="h-16 w-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl shadow-inner border border-zinc-700">
            {profile.gender === "male" ? "👨" : "👩"}
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Classification</span>
            <p className="text-sm font-semibold text-emerald-400 capitalize">{profile.age_group}</p>
          </div>
        </div>
        <h3 className="mt-6 text-2xl font-bold text-white tracking-tight">{profile.name}</h3>
        <p className="text-zinc-500 font-medium">{profile.country_name}</p>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Gender Match</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-zinc-800">
                <div 
                  className="h-full rounded-full bg-blue-500" 
                  style={{ width: `${profile.gender_probability * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-zinc-300">{(profile.gender_probability * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Origin Match</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-zinc-800">
                <div 
                  className="h-full rounded-full bg-emerald-500" 
                  style={{ width: `${profile.country_probability * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-zinc-300">{(profile.country_probability * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Age</span>
            <span className="text-xl font-bold text-white">{profile.age}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Detected</span>
            <span className="block text-xs font-medium text-zinc-400">{new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
