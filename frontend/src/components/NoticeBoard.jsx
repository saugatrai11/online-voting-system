export default function NoticeBoard() {
  const notices = [{ title: "Election 2026", msg: "Registration is open." }];
  return (
    <div className="bg-white p-6 rounded-3xl border">
      <h3 className="font-bold mb-4">Notice Board</h3>
      {notices.map((n, i) => <div key={i} className="mb-2 p-3 bg-slate-50 rounded-lg text-sm">{n.title}: {n.msg}</div>)}
    </div>
  );
}