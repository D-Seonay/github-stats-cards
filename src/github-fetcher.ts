export interface GithubData {
  name: string;
  login: string;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalRepos: number;
  contributedTo: number;
  followers: number;
  gists: number;
}

export interface LanguageData {
  name: string;
  color: string;
  size: number;
}

export interface ProjectData {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
}

export interface StreakData {
  name: string;
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
}

export interface TopRepoData {
  name: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
}

export interface ActivityData {
  type: string;
  repo: string;
  date: string;
}

export interface OrgData {
  name: string;
  login: string;
  description: string;
  avatarUrl: string;
  reposCount: number;
  totalStars: number;
}

export interface Trophy {
  title: string;
  rank: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "SECRET";
  value: number | string;
}

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export function calculateTrophies(data: GithubData, activity: ActivityData[] = []): Trophy[] {
  const tiers = {
    stars: [10, 50, 100, 500, 1000],
    commits: [100, 500, 1000, 5000, 10000],
    prs: [10, 50, 100, 500, 1000],
    issues: [10, 50, 100, 500, 1000],
    contribs: [5, 10, 25, 50, 100],
  };

  const getRank = (val: number, thresholds: number[]): Trophy["rank"] => {
    if (val >= thresholds[4]) return "DIAMOND";
    if (val >= thresholds[3]) return "PLATINUM";
    if (val >= thresholds[2]) return "GOLD";
    if (val >= thresholds[1]) return "SILVER";
    return "BRONZE";
  };

  const trophies: Trophy[] = [
    { title: "Stars", value: data.totalStars, rank: getRank(data.totalStars, tiers.stars) },
    { title: "Commits", value: data.totalCommits, rank: getRank(data.totalCommits, tiers.commits) },
    { title: "PRs", value: data.totalPRs, rank: getRank(data.totalPRs, tiers.prs) },
    { title: "Issues", value: data.totalIssues, rank: getRank(data.totalIssues, tiers.issues) },
    { title: "Contribs", value: data.contributedTo, rank: getRank(data.contributedTo, tiers.contribs) },
  ];

  // --- Secret Trophies (Hard to Impossible) ---
  
  if (data.totalStars > 50 && data.followers < 5) {
    trophies.push({ title: "Ghost", value: "Rare", rank: "SECRET" });
  }

  if (data.totalRepos > 100) {
    trophies.push({ title: "Architect", value: "Elite", rank: "SECRET" });
  }

  if (data.totalStars >= 10000) {
    trophies.push({ title: "Starlight Legend", value: "Mythic", rank: "SECRET" });
  }

  if (data.totalStars >= 50000) {
    trophies.push({ title: "Starlight God", value: "Ethereal", rank: "SECRET" });
  }

  if (data.totalCommits >= 50000) {
    trophies.push({ title: "God Committer", value: "Divine", rank: "SECRET" });
  }

  if (data.totalCommits >= 100000) {
    trophies.push({ title: "Commit Deity", value: "Transcendent", rank: "SECRET" });
  }

  if (data.contributedTo >= 500) {
    trophies.push({ title: "Titan", value: "Colossal", rank: "SECRET" });
  }

  if (data.contributedTo >= 1000) {
    trophies.push({ title: "World Class", value: "Universal", rank: "SECRET" });
  }

  return trophies;
}

export class RateLimitError extends Error {
  constructor(message: string = "GitHub API rate limit exceeded") {
    super(message);
    this.name = "RateLimitError";
  }
}

async function githubFetch(url: string, options: any) {
  const response = await fetch(url, options);
  if (response.status === 403 || response.status === 429) {
    throw new RateLimitError();
  }
  return response;
}

export async function fetchRecentActivity(username: string): Promise<ActivityData[]> {
  const response = await githubFetch(`https://api.github.com/users/${username}/events/public?per_page=5`, {
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching recent activity");
  }

  const events = await response.json() as any[];
  
  return events.map(event => {
    let type = event.type.replace("Event", "");
    if (type === "Push") type = "Pushed to";
    if (type === "PullRequest") type = "Opened PR in";
    if (type === "Issues") type = "Opened Issue in";
    if (type === "Create") type = "Created";
    if (type === "Watch") type = "Starred";

    return {
      type,
      repo: event.repo.name.split("/")[1] || event.repo.name,
      date: new Date(event.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });
}

export async function fetchTopRepos(username: string): Promise<TopRepoData[]> {
  const query = `
    query topRepos($login: String!) {
      user(login: $login) {
        repositories(first: 5, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            name
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  `;

  const response = await githubFetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  const body = await response.json() as any;
  if (body.errors) {
    if (body.errors.some((e: any) => e.type === "RATE_LIMITED" || e.message?.includes("rate limit"))) {
      throw new RateLimitError();
    }
    throw new Error(body.errors[0].message);
  }

  const user = body.data.user;
  if (!user) throw new Error("User not found");

  return user.repositories.nodes.map((repo: any) => ({
    name: repo.name,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    language: repo.primaryLanguage?.name || "None",
    languageColor: repo.primaryLanguage?.color || "#333",
  }));
}

export async function fetchStreak(username: string): Promise<StreakData> {
  const query = `
    query streakInfo($login: String!) {
      user(login: $login) {
        name
        login
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const response = await githubFetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  const body = await response.json() as any;
  if (body.errors) {
    if (body.errors.some((e: any) => e.type === "RATE_LIMITED" || e.message?.includes("rate limit"))) {
      throw new RateLimitError();
    }
    throw new Error(body.errors[0].message);
  }

  const user = body.data.user;
  if (!user) throw new Error("User not found");

  const calendar = user.contributionsCollection.contributionCalendar;
  const days = calendar.weeks.flatMap((w: any) => w.contributionDays);
  
  // Count backwards from today
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const sortedPastDays = days
    .filter((d: any) => d.date <= todayStr)
    .sort((a: any, b: any) => b.date.localeCompare(a.date));

  let currentStreak = 0;
  
  // Find where the streak starts: either today or yesterday must have contributions
  const latestContributionIndex = sortedPastDays.findIndex((d: any) => d.contributionCount > 0);
  
  if (latestContributionIndex !== -1) {
    const latestDate = sortedPastDays[latestContributionIndex].date;
    // If the latest contribution is today or yesterday, the streak is alive
    if (latestDate === todayStr || latestDate === yesterdayStr) {
      for (let i = latestContributionIndex; i < sortedPastDays.length; i++) {
        if (sortedPastDays[i].contributionCount > 0) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // Longest Streak calculation (chronological)
  const chronologicalDays = [...days].sort((a: any, b: any) => a.date.localeCompare(b.date));
  let longestStreak = 0;
  let tempStreak = 0;
  for (const day of chronologicalDays) {
    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  return {
    name: user.name || user.login,
    currentStreak,
    longestStreak,
    totalContributions: calendar.totalContributions,
  };
}

export async function fetchProject(owner: string, name: string): Promise<ProjectData> {
  const query = `
    query repoInfo($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        name
        description
        stargazerCount
        forkCount
        primaryLanguage { name color }
      }
    }
  `;

  const response = await githubFetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { owner, name } }),
  });

  const body = await response.json() as any;
  if (body.errors) {
    if (body.errors.some((e: any) => e.type === "RATE_LIMITED" || e.message?.includes("rate limit"))) {
      throw new RateLimitError();
    }
    throw new Error(body.errors[0].message);
  }

  const repo = body.data.repository;
  if (!repo) throw new Error("Repository not found");

  return {
    name: repo.name,
    description: repo.description || "No description",
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    language: repo.primaryLanguage?.name || "None",
    languageColor: repo.primaryLanguage?.color || "#333",
  };
}

export async function fetchStats(username: string): Promise<GithubData> {
  const query = `
    query userInfo($login: String!) {
      user(login: $login) {
        name
        login
        followers { totalCount }
        gists { totalCount }
        contributionsCollection {
          totalCommitContributions
          restrictedContributionsCount
        }
        repositoriesContributedTo(first: 1) { totalCount }
        pullRequests(first: 1) { totalCount }
        issues(first: 1) { totalCount }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
          totalCount
          nodes { stargazers { totalCount } }
        }
      }
    }
  `;

  const response = await githubFetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  const body = await response.json() as any;
  if (body.errors) {
    if (body.errors.some((e: any) => e.type === "RATE_LIMITED" || e.message?.includes("rate limit"))) {
      throw new RateLimitError();
    }
    throw new Error(body.errors[0].message);
  }

  const user = body.data.user;
  if (!user) throw new Error("User not found");

  const totalStars = user.repositories.nodes.reduce((acc: number, repo: any) => acc + repo.stargazers.totalCount, 0);

  return {
    name: user.name || user.login,
    login: user.login,
    totalStars,
    totalCommits: user.contributionsCollection.totalCommitContributions + user.contributionsCollection.restrictedContributionsCount,
    totalPRs: user.pullRequests.totalCount,
    totalIssues: user.issues.totalCount,
    totalRepos: user.repositories.totalCount,
    contributedTo: user.repositoriesContributedTo.totalCount,
    followers: user.followers?.totalCount || 0,
    gists: user.gists?.totalCount || 0,
  };
}

export async function fetchTopLanguages(username: string): Promise<LanguageData[]> {
  const query = `
    query userInfo($login: String!) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
          nodes {
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node { color name }
              }
            }
          }
        }
      }
    }
  `;

  const response = await githubFetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  const body = await response.json() as any;
  if (body.errors) {
    if (body.errors.some((e: any) => e.type === "RATE_LIMITED" || e.message?.includes("rate limit"))) {
      throw new RateLimitError();
    }
    throw new Error(body.errors[0].message);
  }

  const user = body.data.user;
  if (!user) throw new Error("User not found");

  const langMap: Record<string, { size: number; color: string }> = {};
  user.repositories.nodes.forEach((repo: any) => {
    repo.languages.edges.forEach((edge: any) => {
      if (langMap[edge.node.name]) langMap[edge.node.name].size += edge.size;
      else langMap[edge.node.name] = { size: edge.size, color: edge.node.color };
    });
  });

  return Object.entries(langMap).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.size - a.size).slice(0, 5);
}

export async function fetchOrgStats(org: string): Promise<OrgData> {
  const query = `
    query orgInfo($login: String!) {
      organization(login: $login) {
        name
        login
        description
        avatarUrl
        repositories(first: 100) {
          totalCount
          nodes {
            stargazerCount
          }
        }
      }
    }
  `;

  const response = await githubFetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: org } }),
  });

  const body = await response.json() as any;
  if (body.errors) {
    if (body.errors.some((e: any) => e.type === "RATE_LIMITED" || e.message?.includes("rate limit"))) {
      throw new RateLimitError();
    }
    throw new Error(body.errors[0].message);
  }

  const organization = body.data.organization;
  if (!organization) throw new Error("Organization not found");

  const totalStars = organization.repositories.nodes.reduce((acc: number, repo: any) => acc + repo.stargazerCount, 0);

  return {
    name: organization.name || organization.login,
    login: organization.login,
    description: organization.description || "",
    avatarUrl: organization.avatarUrl,
    reposCount: organization.repositories.totalCount,
    totalStars,
  };
}
