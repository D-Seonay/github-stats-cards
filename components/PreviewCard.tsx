"use client";
import { motion } from "framer-motion";

export default function PreviewCard({ title, src }: { title: string, src: string }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-end border-b border-zinc-900 pb-2">
        <h2 className="text-[10px] uppercase tracking-[0.3em] font-black italic text-zinc-400">{title}</h2>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-zinc-900/30 border border-dashed border-zinc-800 flex items-center justify-center relative group min-h-[200px]"
      >
        <img src={src} alt={title} className="max-w-full h-auto shadow-2xl" />
        <div className="absolute inset-0 bg-zinc-950/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2 p-4">
          <button onClick={() => copyToClipboard(`![${title}](${window.location.origin}${src})`)} className="bg-zinc-100 text-zinc-950 px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-white transition-colors">Markdown</button>
          <button onClick={() => copyToClipboard(`${window.location.origin}${src}`)} className="border border-zinc-100 text-zinc-100 px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors">Link</button>
        </div>
      </motion.div>
    </section>
  );
}
