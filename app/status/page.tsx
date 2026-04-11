"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldCheck,
  Wifi,
  Clock,
  ArrowLeft,
  RefreshCcw,
} from "lucide-react";

interface HealthData {
  status: string;
  latency: string;
  github_api: string;
  timestamp: string;
  services: { name: string; path: string; status: string }[];
}

export default function StatusPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-6 md:p-12 relative overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 space-y-12">
        <header className="flex justify-between items-center border-b border-zinc-900 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-zinc-500 hover:text-zinc-100 transition-colors"
              >
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-xl font-black italic tracking-tighter">
                SYSTEM_STATUS
              </h1>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              {"//"} Monitoring live API health & quotas
            </p>
          </div>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="p-2 border border-zinc-800 hover:border-zinc-100 transition-all disabled:opacity-50"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {loading && !data ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-1 bg-zinc-900 overflow-hidden relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="absolute inset-0 bg-emerald-500"
              />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">
              Pinging infrastructure...
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Main Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 border border-zinc-800 bg-zinc-900/20 space-y-4">
                <div className="flex justify-between items-start">
                  <ShieldCheck
                    size={20}
                    className={
                      data?.status === "operational"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  />
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 ${data?.status === "operational" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                  >
                    {data?.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-xs font-bold uppercase text-zinc-400">
                    Core Engine
                  </h2>
                  <p className="text-xl font-black">All systems active</p>
                </div>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900/20 space-y-4">
                <div className="flex justify-between items-start">
                  <Wifi size={20} className="text-zinc-500" />
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-zinc-800 text-zinc-400">
                    {data?.latency}
                  </span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-xs font-bold uppercase text-zinc-400">
                    Network Latency
                  </h2>
                  <p className="text-xl font-black">Stable Connection</p>
                </div>
              </div>
            </div>

            {/* Service List */}
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-black italic text-zinc-500 border-b border-zinc-900 pb-2">
                Service Matrix
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {data?.services.map((service) => (
                  <div
                    key={service.name}
                    className="flex justify-between items-center p-4 border border-zinc-900 hover:border-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${service.status === "online" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-800"}`}
                      />
                      <span className="text-sm font-bold">{service.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono italic">
                      {service.path}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer / Meta */}
            <footer className="flex justify-between items-center pt-8 text-[10px] text-zinc-600 uppercase tracking-widest border-t border-zinc-900">
              <div className="flex items-center gap-2">
                <Clock size={12} />
                Last Update:{" "}
                {data
                  ? new Date(data.timestamp).toLocaleTimeString()
                  : "--:--:--"}
              </div>
              <div>
                GitHub API:{" "}
                <span
                  className={
                    data?.github_api === "connected"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }
                >
                  {data?.github_api}
                </span>
              </div>
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
}
