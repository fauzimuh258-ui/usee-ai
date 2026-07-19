'use client';

import { useState } from 'react';
import type { UseeAction, UseeResponse } from '@/lib/types';

const ACTIONS: { id: UseeAction; label: string }[] = [
  { id: 'generate_post', label: 'generate post' },
  { id: 'analyze_trends', label: 'analyze trends' },
  { id: 'generate_reply', label: 'generate reply' },
];

interface HistoryEntry {
  id: number;
  type: UseeAction;
  content: string;
  timestamp: string;
}

const MAX_HISTORY = 5;

export default function CampaignDashboard() {
  const [topic, setTopic] = useState('');
  const [action, setAction] = useState<UseeAction>('generate_post');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const runExecutionPipeline = async () => {
    const trimmedTopic = topic.trim();
    if (!trimmedTopic || loading) return;

    setLoading(true);
    setError(null);
    setResult('[ANALYZING TARGET VECTORS & CLASSIFYING TRENDS...]');

    try {
      const response = await fetch('/api/usee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          payload: {
            topic: trimmedTopic,
            tone: 'Professional/Viral',
            rawData: trimmedTopic,
            targetPost: trimmedTopic,
          },
        }),
      });

      const data: UseeResponse = await response.json();
      if (!data.success) throw new Error(data.error);

      setResult(data.content);
      setHistory((prev) =>
        [{ id: Date.now(), type: action, content: data.content, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(
          0,
          MAX_HISTORY
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error while generating content.';
      setError(message);
      setResult(`[CRITICAL FAULT]: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-lg font-bold text-amber-500 mb-4 tracking-tight">AI ENGINE ORCHESTRATOR</h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 p-1 bg-black rounded-lg border border-zinc-800">
            {ACTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAction(id)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${
                  action === id ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={2000}
            placeholder="Enter context, topic, or raw analytics data here..."
            className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm font-mono text-zinc-300 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            type="button"
            onClick={runExecutionPipeline}
            disabled={loading || !topic.trim()}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black text-sm uppercase tracking-tighter rounded-lg transition-all"
          >
            {loading ? 'PROCESSING VECTOR...' : 'EXECUTE CAMPAIGN LOGIC'}
          </button>
          {error && (
            <p className="text-xs font-bold text-red-500" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-xs font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Output Pipeline</h2>
        <div className="bg-black border border-zinc-800 p-5 rounded-lg font-mono text-sm leading-relaxed text-amber-200 whitespace-pre-wrap min-h-[100px]">
          {result || '[STANDING BY FOR COMMAND]'}
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-xs font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Recent Generations</h2>
          <div className="space-y-2">
            {history.map((entry) => (
              <div key={entry.id} className="p-3 bg-black border border-zinc-800 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                    {entry.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-zinc-600">{entry.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
