"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, Code, Activity, Trophy, Palette, Zap, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const features = [
    { icon: <Terminal size={20} />, title: "Stealth Aesthetics", desc: "Terminal-inspired, high-contrast themes designed for developers." },
    { icon: <Zap size={20} />, title: "Serverless Performance", desc: "Aggressive caching and XML minification for instant load times." },
    { icon: <Activity size={20} />, title: "Real-time Metrics", desc: "Live GitHub GraphQL integration for stars, commits, and streaks." },
    { icon: <Trophy size={20} />, title: "Achievement System", desc: "Gamified milestones ranging from Bronze to Diamond tiers." },
    { icon: <Palette size={20} />, title: "Total Customization", desc: "Custom CSS injection, Google Fonts support, and layout toggles." },
    { icon: <Code size={20} />, title: "Open Source", desc: "100% free and open-source. Hosted on Vercel Edge Network." },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        <motion.header 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center space-y-8 mb-24"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            v2.8.1 Stable Release
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-600">
            STAT-STATS
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-mono">
            Generate dynamic, high-tech GitHub statistics cards for your profile README. Configured in real-time, rendered instantly.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-8">
            <Link 
              href="/console" 
              className="inline-flex items-center gap-3 bg-zinc-100 text-zinc-950 px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Launch Console
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.header>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="p-6 border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/80 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/0 group-hover:via-emerald-500/50 group-hover:to-emerald-500/0 transition-all duration-500" />
              <div className="text-zinc-500 mb-4 group-hover:text-emerald-400 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-zinc-200">{feature.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-mono">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-32 text-center text-zinc-600 text-xs font-mono border-t border-zinc-900 pt-8"
        >
          <p>Built with Next.js 14, Tailwind CSS, and Vercel Serverless Functions.</p>
          <div className="mt-4 space-x-4">
            <a href="https://github.com/D-Seonay/github-stats-cards" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">GitHub Repository</a>
            <span>//</span>
            <a href="https://github.com/D-Seonay" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">@D-Seonay</a>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
