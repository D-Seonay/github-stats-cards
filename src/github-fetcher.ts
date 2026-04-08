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

export async function fetchRecentActivity(username: string): Promise<ActivityData[]> {
  const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=5`, {
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

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
  });

  const body = await response.json() as any;

  if (body.errors) {
    throw new Error(body.errors[0].message || "Error fetching top repos");
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

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
  });

  const body = await response.json() as any;

  if (body.errors) {
    throw new Error(body.errors[0].message || "Error fetching streak data");
  }

  const user = body.data.user;
  if (!user) throw new Error("User not found");

  const calendar = user.contributionsCollection.contributionCalendar;
  const days = calendar.weeks.flatMap((w: any) => w.contributionDays);
  
  // Sort days by date descending
  const sortedDays = [...days].sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // GitHub uses UTC dates. We need to find "today" in UTC.
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Current Streak Calculation
  // We look for the first day with contributions starting from today or yesterday
  let startIndex = sortedDays.findIndex(d => d.date === today || d.date === yesterday);
  if (startIndex === -1) startIndex = 0;

  // If today has no contributions, start checking from yesterday
  if (sortedDays[startIndex].contributionCount === 0 && sortedDays[startIndex].date === today) {
    startIndex++;
  }

  for (let i = startIndex; i < sortedDays.length; i++) {
    if (sortedDays[i].contributionCount > 0) {
      currentStreak++;
    } else {
      // If we found a 0 after the streak started, we stop.
      // Special case: if we are at the very beginning and haven't found any contributions yet, 
      // it means the streak is 0 or hasn't started today/yesterday.
      break;
    }
  }

  // Longest Streak Calculation (ascending order)
  const chronologicalDays = [...days].sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

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
        primaryLanguage {
          name
          color
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { owner, name },
    }),
  });

  const body = await response.json() as any;

  if (body.errors) {
    throw new Error(body.errors[0].message || "Error fetching project data");
  }

  const repo = body.data.repository;
  if (!repo) {
    throw new Error("Repository not found");
  }

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
        repositoriesContributedTo(first: 1) {
          totalCount
        }
        pullRequests(first: 1) {
          totalCount
        }
        issues(first: 1) {
          totalCount
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
          totalCount
          nodes {
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
  });

  const body = await response.json() as any;

  if (body.errors) {
    throw new Error(body.errors[0].message || "Error fetching GitHub stats");
  }

  const user = body.data.user;
  if (!user) {
    throw new Error("User not found");
  }

  const totalStars = user.repositories.nodes.reduce(
    (acc: number, repo: any) => acc + repo.stargazers.totalCount,
    0
  );

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
                node {
                  color
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
  });

  const body = await response.json() as any;

  if (body.errors) {
    throw new Error(body.errors[0].message || "Error fetching Top Languages");
  }

  const user = body.data.user;
  if (!user) {
    throw new Error("User not found");
  }

  const langMap: Record<string, { size: number; color: string }> = {};

  user.repositories.nodes.forEach((repo: any) => {
    repo.languages.edges.forEach((edge: any) => {
      if (langMap[edge.node.name]) {
        langMap[edge.node.name].size += edge.size;
      } else {
        langMap[edge.node.name] = {
          size: edge.size,
          color: edge.node.color,
        };
      }
    });
  });

  return Object.entries(langMap)
    .map(([name, data]) => ({
      name,
      ...data,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 5); // Return top 5
}
