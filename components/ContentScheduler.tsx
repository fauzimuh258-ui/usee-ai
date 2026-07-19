interface ScheduleItem {
  id: string;
  time: string;
  status: 'PENDING' | 'READY' | 'QUEUED';
  topic: string;
}

// Static placeholder data — swap for a real fetch once scheduling has a backend.
const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: '1', time: '14:00', status: 'PENDING', topic: 'AI Market Analysis' },
  { id: '2', time: '18:30', status: 'READY', topic: 'Framework Comparison' },
  { id: '3', time: '21:00', status: 'QUEUED', topic: 'Nightly Tech Recap' },
];

export default function ContentScheduler() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-full">
      <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
        CONTENT_QUEUE
      </h2>
      <div className="space-y-3">
        {MOCK_SCHEDULE.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-lg group hover:border-amber-500/50 transition-colors"
          >
            <div>
              <p className="text-xs font-black text-amber-500">{item.time}</p>
              <p className="text-sm font-medium text-zinc-300">{item.topic}</p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded ${
                item.status === 'READY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="w-full mt-6 py-2 border border-dashed border-zinc-700 text-zinc-500 text-xs font-bold rounded-lg hover:text-zinc-300 hover:border-zinc-500 transition-all"
      >
        + ADD MANUAL SLOT
      </button>
    </div>
  );
}
