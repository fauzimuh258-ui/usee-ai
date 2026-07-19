import CampaignDashboard from '@/components/CampaignDashboard';
import ContentScheduler from '@/components/ContentScheduler';
import AnalyticsPanel from '@/components/AnalyticsPanel';

export default function UseeAiMain() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-zinc-900 pb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-2">
              USEE_AI <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded tracking-normal">v1.0</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium mt-1">Advanced Marketing Automation Specialist Node</p>
          </div>
          <div className="flex gap-4 text-right">
            <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg">
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Engine Status</p>
              <p className="text-xs font-bold text-emerald-500">OPERATIONAL</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <CampaignDashboard />
            <AnalyticsPanel />
          </div>
          <div className="lg:col-span-4">
            <ContentScheduler />
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-zinc-900 flex justify-between items-center text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
          <p>© {currentYear} USEE_AI ORCHESTRATION UNIT</p>
          <div className="flex gap-4">
            <span>STABLE_BUILD</span>
            <span>GROQ_GPT_OSS_120B</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
