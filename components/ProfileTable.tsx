import { format } from "date-fns";

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

export default function ProfileTable({ profiles }: { profiles: Profile[] }) {
  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20">
        <p className="text-zinc-500">No profiles found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm">
      <table className="w-full text-left text-sm text-zinc-400">
        <thead className="bg-zinc-900/50 text-xs font-semibold uppercase text-zinc-500">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Gender</th>
            <th className="px-6 py-4">Age</th>
            <th className="px-6 py-4">Country</th>
            <th className="px-6 py-4">Conf. (G/C)</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {profiles.map((profile) => (
            <tr key={profile.id} className="transition-colors hover:bg-zinc-800/30">
              <td className="px-6 py-4 font-medium text-white">{profile.name}</td>
              <td className="px-6 py-4 capitalize">{profile.gender}</td>
              <td className="px-6 py-4">
                {profile.age} <span className="text-xs text-zinc-600">({profile.age_group})</span>
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-2">
                  <span className="text-lg">📍</span> {profile.country_name}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs">
                  {Math.round(profile.gender_probability * 100)}% / {Math.round(profile.country_probability * 100)}%
                </span>
              </td>
              <td className="px-6 py-4 text-xs">
                {new Date(profile.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-zinc-500 hover:text-red-500">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
