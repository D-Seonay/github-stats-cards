export interface GithubData {
  name: string;
  login: string;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalRepos: number;
  contributedTo: number;
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

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

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
  
  // Sort days by date descending for current streak
  const sortedDays = [...days].sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let foundStart = false;

  for (const day of sortedDays) {
    if (day.contributionCount > 0) {
      currentStreak++;
      foundStart = true;
    } else {
      if (!foundStart) {
        // If we are at "today" or "tomorrow" (UTC), we continue to check yesterday
        if (day.date > yesterday) continue;
        // If we reach yesterday and it's 0, streak is broken
        break;
      } else {
        // Streak started but we hit a gap
        break;
      }
    }
  }

  // Longest Streak calculation (ascending)
  const chronoDays = [...days].sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  let longestStreak = 0;
  let tempStreak = 0;
  for (const day of chronoDays) {
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
