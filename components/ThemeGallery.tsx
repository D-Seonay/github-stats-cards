"use client";
import { themes } from "@/src/themes";
import { motion } from "framer-motion";

export default function ThemeGallery({ config, setConfig }: any) {
  const themeKeys = Object.keys(themes);
  const cssParam = config.customCSS ? `&custom_css=${encodeURIComponent(config.customCSS)}` : "";
  const fontParam = config.font ? `&font=${encodeURIComponent(config.font)}` : "";

  return (
    <section id="gallery" className="space-y-8 pt-12 border-t border-zinc-900">
      <div className="space-y-1">
        <h2 className="text-[10px] uppercase tracking-[0.3em] font-black italic text-zinc-400">00. Visual Library</h2>
        <p className="text-xs text-zinc-600 font-mono italic">// Previewing all available environment palettes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themeKeys.map((t) => {
          const previewUrl = `/api/stats?username=${config.username}&theme=${t}&locale=${config.locale}${cssParam}${fontParam}`;
          const isSelected = config.theme === t;

          return (
            <motion.div
              key={t}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setConfig({ ...config, theme: t });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`cursor-pointer p-4 border transition-all ${
                isSelected 
                  ? 'border-zinc-100 bg-zinc-800/50' 
                  : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-500'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  {t.replace('_', ' ')}
                </span>
                {isSelected && (
                  <span className="text-[8px] bg-zinc-100 text-zinc-950 px-1 font-black uppercase">Active</span>
                )}
              </div>
              <object 
                key={previewUrl}
                data={previewUrl} 
                type="image/svg+xml"
                className="w-full h-auto shadow-lg pointer-events-none" 
              >
                <img src={previewUrl} alt={`${t} theme preview`} />
              </object>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
