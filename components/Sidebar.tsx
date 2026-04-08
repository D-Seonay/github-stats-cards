"use client";
import { useState, useEffect } from "react";
import { themes } from "@/src/themes";

export default function Sidebar({ config, setConfig }: any) {
  const [repos, setRepos] = useState<string[]>([]);

  useEffect(() => {
    if (config.username) {
      fetch(`/api/github/repos?username=${config.username}`)
        .then(res => res.json())
        .then(data => {
          setRepos(data);
          if (data.length > 0 && !config.repo) setConfig({ ...config, repo: data[0] });
        });
    }
  }, [config.username]);

  return (
    <aside className="w-80 border-r border-zinc-800 p-6 flex flex-col gap-8 shrink-0 h-screen font-mono">
      <div className="space-y-1">
        <h1 className="text-xl font-black italic tracking-tighter">STAT-STATS</h1>
        <p className="text-[10px] text-zinc-500 italic">// v2.1.1-stable.stealth</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">01. Target User</label>
          <input 
            type="text" 
            value={config.username}
            onChange={(e) => setConfig({ ...config, username: e.target.value })}
            placeholder="GitHub Username" 
            className="w-full bg-zinc-900 border border-zinc-800 p-3 text-sm focus:border-zinc-100 outline-none transition-all placeholder:text-zinc-700" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">02. Visual Theme</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(themes).map(([key, value]) => (
              <button 
                key={key}
                onClick={() => setConfig({ ...config, theme: key })}
                className={`group border p-2 text-[10px] uppercase font-bold transition-all flex items-center gap-2 ${config.theme === key ? 'border-zinc-100 text-zinc-100 bg-zinc-800' : 'border-zinc-800 text-zinc-600 hover:border-zinc-400'}`}
              >
                <div 
                  className="w-3 h-3 rounded-full border border-zinc-700 shrink-0 transition-transform group-hover:scale-110" 
                  style={{ backgroundColor: `#${value.bg_color}` }}
                >
                  <div 
                    className="w-full h-full rounded-full opacity-50" 
                    style={{ backgroundColor: `#${value.title_color}`, clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                  />
                </div>
                <span className="truncate">{key.replace('_', ' ')}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">03. Language</label>
          <div className="grid grid-cols-5 gap-1">
            {['en', 'fr', 'es', 'de', 'jp'].map(l => (
              <button 
                key={l}
                onClick={() => setConfig({ ...config, locale: l })}
                className={`border py-1.5 text-[10px] uppercase font-black transition-all ${config.locale === l ? 'border-zinc-100 text-zinc-100 bg-zinc-800' : 'border-zinc-800 text-zinc-600 hover:border-zinc-400'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">04. Target Repository</label>
          <select 
            value={config.repo}
            onChange={(e) => setConfig({ ...config, repo: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 p-3 text-sm focus:border-zinc-100 outline-none transition-all"
          >
            {repos.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-auto pt-6 space-y-4 border-t border-zinc-900">
        <div className="grid grid-cols-2 gap-2">
          <a 
            href="https://github.com/D-Seonay/github-stats-cards/issues/new?labels=bug&template=bug_report.md" 
            target="_blank"
            className="border border-zinc-800 p-2 text-[8px] uppercase font-bold text-zinc-500 hover:text-red-400 hover:border-red-900/50 transition-all text-center"
          >
            // Report Bug
          </a>
          <a 
            href="https://github.com/D-Seonay/github-stats-cards/issues/new?labels=enhancement&template=feature_request.md" 
            target="_blank"
            className="border border-zinc-800 p-2 text-[8px] uppercase font-bold text-zinc-500 hover:text-emerald-400 hover:border-emerald-900/50 transition-all text-center"
          >
            // Suggest Idea
          </a>
        </div>
        
        <button 
          onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full bg-zinc-100 text-zinc-950 p-3 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all italic"
        >
          // Open Visual Library
        </button>
      </div>
    </aside>
  );
}
