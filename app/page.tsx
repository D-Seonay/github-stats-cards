"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PreviewCard from "@/components/PreviewCard";
import ThemeGallery from "@/components/ThemeGallery";

export default function Home() {
  const [config, setConfig] = useState({
    username: "D-Seonay",
    theme: "dark",
    locale: "en",
    repo: "",
    hide: [] as string[],
    compact: false,
  });

  // Debouncing logic to save API calls
  const [debouncedConfig, setDebouncedConfig] = useState(config);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedConfig(config);
    }, 500);

    return () => clearTimeout(timer);
  }, [config.username, config.hide, config.compact]);

  const baseUrl = ""; 
  const statsUrl = `${baseUrl}/api/stats?username=${debouncedConfig.username}&theme=${config.theme}&locale=${config.locale}&compact=${config.compact}&hide=${config.hide.join(",")}`;
  const langsUrl = `${baseUrl}/api/top-langs?username=${debouncedConfig.username}&theme=${config.theme}&locale=${config.locale}`;
  const repoUrl = `${baseUrl}/api/project?username=${debouncedConfig.username}&repo=${config.repo}&theme=${config.theme}`;
  const streakUrl = `${baseUrl}/api/streak?username=${debouncedConfig.username}&theme=${config.theme}&locale=${config.locale}`;
  const topReposUrl = `${baseUrl}/api/top-repos?username=${debouncedConfig.username}&theme=${config.theme}&locale=${config.locale}`;
  const activityUrl = `${baseUrl}/api/activity?username=${debouncedConfig.username}&theme=${config.theme}&locale=${config.locale}`;

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-mono overflow-hidden">
      <Sidebar config={config} setConfig={setConfig} />
      <main className="flex-1 p-12 overflow-y-auto space-y-12">
        <PreviewCard title="01. User Statistics" src={statsUrl} />
        <PreviewCard title="02. Top Languages" src={langsUrl} />
        <PreviewCard title="03. Contribution Streak" src={streakUrl} />
        <PreviewCard title="04. Top Repositories" src={topReposUrl} />
        <PreviewCard title="05. Recent Activity" src={activityUrl} />
        {config.repo && <PreviewCard title="06. Project Card" src={repoUrl} />}
        <ThemeGallery config={config} setConfig={setConfig} />
      </main>
    </div>
  );
}
