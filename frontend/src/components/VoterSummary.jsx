export default function VoterSummary({ user }) {
  return (
    <div className="bg-white p-6 rounded-3xl border flex gap-8">
      <div><p className="text-xs text-slate-400">DISTRICT</p><p className="font-bold">{user.district}</p></div>
      <div className="border-l pl-8"><p className="text-xs text-slate-400">AGE</p><p className="font-bold">{user.age}</p></div>
    </div>
  );
}