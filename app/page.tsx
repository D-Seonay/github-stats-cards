"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PreviewCard from "@/components/PreviewCard";

export default function Home() {
  const [config, setConfig] = useState({
    username: "D-Seonay",
    theme: "dark",
    locale: "en",
    repo: ""
  });

  const baseUrl = ""; // Local paths work relative to root
  const statsUrl = `${baseUrl}/api/stats?username=${config.username}&theme=${config.theme}&locale=${config.locale}`;
  const langsUrl = `${baseUrl}/api/top-langs?username=${config.username}&theme=${config.theme}&locale=${config.locale}`;

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-mono overflow-hidden">
      <Sidebar config={config} setConfig={setConfig} />
      <main className="flex-1 p-12 overflow-y-auto space-y-12">
        <PreviewCard title="01. User Statistics" src={statsUrl} />
        <PreviewCard title="02. Top Languages" src={langsUrl} />
      </main>
    </div>
  );
}
