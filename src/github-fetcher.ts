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

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

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
