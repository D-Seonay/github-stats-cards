"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PreviewCard from "@/components/PreviewCard";
import ThemeGallery from "@/components/ThemeGallery";

export default function ConsolePage() {
  const [config, setConfig] = useState({
    username: "D-Seonay",
    theme: "dark",
    locale: "en",
    repo: "",
    hide: [] as string[],
    compact: false,
    customCSS: "",
    org: "google",
    font: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("stat-stats-config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
      } catch (e) {
        console.error("Error loading config", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("stat-stats-config", JSON.stringify(config));
    }
  }, [config, isLoaded]);

  const [debouncedConfig, setDebouncedConfig] = useState(config);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedConfig(config);
    }, 500);
    return () => clearTimeout(timer);
  }, [config.username, config.hide, config.compact, config.customCSS, config.org, config.font, config.repo]);

  const baseUrl = ""; 
  const cssParam = config.customCSS ? `&custom_css=${encodeURIComponent(config.customCSS)}` : "";
  const fontParam = config.font ? `&font=${encodeURIComponent(config.font)}` : "";
  
  const statsUrl = `${baseUrl}/api/stats?username=${debouncedConfig.username}&theme=${config.theme}&locale=${config.locale}&compact=${config.compact}&hide=${config.hide.join(",")}${cssParam}${fontParam}`;
  const langsUrl = `${baseUrl}/api/top-langs?username=${debouncedConfig.username}&theme=${config.theme}&locale=${config.locale}${cssParam}${fontParam}`;
  const repoUrl = `${baseUrl}/api/project?username=${debouncedConfig.username}&repo=${debouncedConfig.repo}&theme=${config.theme}${cssParam}${fontParam}`;
  const streakUrl = `${baseUrl}/api/streak?username=${debouncedConfig.username}&theme=${config.theme}&locale=${config.locale}${cssParam}${fontParam}`;
  const topReposUrl = `${baseUrl}/api/top-repos?username=${debouncedConfig.username}&theme=${config.theme}&locale=${config.locale}${cssParam}${fontParam}`;
  const activityUrl = `${baseUrl}/api/activity?username=${debouncedConfig.username}&theme=${config.theme}&locale=${config.locale}${cssParam}${fontParam}`;
  const trophiesUrl = `${baseUrl}/api/trophies?username=${debouncedConfig.username}&theme=${config.theme}${cssParam}${fontParam}`;
  const orgUrl = `${baseUrl}/api/org?username=${debouncedConfig.org}&theme=${config.theme}${cssParam}${fontParam}`;

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-mono overflow-hidden">
      <Sidebar config={config} setConfig={setConfig} />
      <main className="flex-1 p-12 overflow-y-auto space-y-12">
        <PreviewCard title="01. User Statistics" src={statsUrl} />
        <PreviewCard title="02. Top Languages" src={langsUrl} />
        <PreviewCard title="03. Contribution Streak" src={streakUrl} />
        <PreviewCard title="04. Top Repositories" src={topReposUrl} />
        <PreviewCard title="05. Recent Activity" src={activityUrl} />
        <PreviewCard title="06. Achievement Trophies" src={trophiesUrl} />
        <PreviewCard title="07. Organization Stats" src={orgUrl} />
        {config.repo && <PreviewCard title="08. Project Card" src={repoUrl} />}
        <ThemeGallery config={config} setConfig={setConfig} />
      </main>
    </div>
  );
}
