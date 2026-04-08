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
    repo: ""
  });

  // Debouncing logic to save API calls
  const [debouncedUsername, setDebouncedUsername] = useState(config.username);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(config.username);
    }, 500);

    return () => clearTimeout(timer);
  }, [config.username]);

  const baseUrl = ""; 
  const statsUrl = `${baseUrl}/api/stats?username=${debouncedUsername}&theme=${config.theme}&locale=${config.locale}`;
  const langsUrl = `${baseUrl}/api/top-langs?username=${debouncedUsername}&theme=${config.theme}&locale=${config.locale}`;
  const repoUrl = `${baseUrl}/api/project?username=${debouncedUsername}&repo=${config.repo}&theme=${config.theme}`;
  const streakUrl = `${baseUrl}/api/streak?username=${debouncedUsername}&theme=${config.theme}`;
  const topReposUrl = `${baseUrl}/api/top-repos?username=${debouncedUsername}&theme=${config.theme}`;
  const activityUrl = `${baseUrl}/api/activity?username=${debouncedUsername}&theme=${config.theme}`;

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
