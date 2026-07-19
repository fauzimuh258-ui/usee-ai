interface StatItem {
  id: string;
  label: string;
  val: string;
  trend: string;
}

// Static placeholder data — swap for a real fetch once analytics has a backend.
const STATS: StatItem[] = [
  { id: 'reach', label: 'Reach Rate', val: '84.2%', trend: '+12%' },
  { id: 'conversion', label: 'Conversion', val: '4.8%', trend: '+0.5%' },
  { id: 'efficiency', label: 'AI Efficiency', val: '99.1%', trend: 'Optm' },
];

export default function AnalyticsPanel() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <h2 className="text-xs font-black text-zinc-500 mb-6 uppercase tracking-[0.2em]">Growth Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map((s) => (
          <div key={s.id} className="p-4 bg-black border border-zinc-800 rounded-lg text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">{s.label}</p>
            <p className="text-2xl font-black text-zinc-100">{s.val}</p>
            <p className="text-[10px] text-emerald-500 mt-1">{s.trend}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-4 tracking-widest">Sentiment Heatmap</p>
        <div className="flex gap-1 h-2">
          <div className="w-3/4 bg-amber-500 rounded-l"></div>
          <div className="w-1/4 bg-zinc-800 rounded-r"></div>
        </div>
        <div className="flex justify-between mt-2 text-[9px] font-bold text-zinc-600 uppercase">
          <span>Positive Engagement</span>
          <span>Neutral/Noise</span>
        </div>
      </div>
    </div>
  );
}
