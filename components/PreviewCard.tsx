"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Share2 } from "lucide-react";

export default function PreviewCard({ title, src }: { title: string, src: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out my GitHub stats on STAT-STATS! 🚀\n\nGenerated with @D-Seonay's tool:`);
    const url = encodeURIComponent(`${window.location.origin}${src}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=GitHub,OpenSource,Stats`, '_blank');
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-end border-b border-zinc-900 pb-2">
        <h2 className="text-[10px] uppercase tracking-[0.3em] font-black italic text-zinc-400">{title}</h2>
        
        <AnimatePresence>
          {copied && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest"
            >
              <Check size={12} />
              Copied to clipboard
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="w-full bg-zinc-900/30 border border-dashed border-zinc-800 flex items-center justify-center relative group min-h-[200px] overflow-hidden">
        
        {/* Skeleton / Phantom Card */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 p-6 flex flex-col gap-4 bg-zinc-950"
            >
              <div className="h-4 w-1/3 bg-zinc-800 animate-pulse rounded" />
              <div className="space-y-3">
                <div className="h-2 w-full bg-zinc-900 animate-pulse rounded opacity-50" />
                <div className="h-2 w-5/6 bg-zinc-900 animate-pulse rounded opacity-50" />
                <div className="h-2 w-4/6 bg-zinc-900 animate-pulse rounded opacity-50" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.img 
          key={src}
          src={src} 
          alt={title} 
          onLoad={() => setIsLoading(false)}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.98 : 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-full h-auto shadow-2xl z-0" 
        />

        <div className="absolute inset-0 bg-zinc-950/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2 p-4 z-20">
          <button 
            onClick={() => copyToClipboard(`![${title}](${window.location.origin}${src})`)} 
            className="bg-zinc-100 text-zinc-950 px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-white transition-colors flex items-center gap-2"
          >
            <Copy size={12} />
            Markdown
          </button>
          <button 
            onClick={() => copyToClipboard(`${window.location.origin}${src}`)} 
            className="border border-zinc-100 text-zinc-100 px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            <Copy size={12} />
            Link
          </button>
          <button 
            onClick={shareOnTwitter} 
            className="border border-sky-500/50 text-sky-400 px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-sky-500/10 transition-colors flex items-center gap-2"
          >
            <Share2 size={12} />
            Share on X
          </button>
        </div>
      </div>
    </section>
  );
}
