import { describe, it, expect } from 'vitest';
import { calculateTrophies } from '../src/github-fetcher';

describe('GitHub Fetcher Logic', () => {
  const mockStats = {
    name: 'Test User',
    login: 'testuser',
    totalStars: 600, // Diamond threshold is 1000, Platinum is 500
    totalCommits: 1200, // Gold is 1000
    totalPRs: 15, // Silver is 50, Bronze is < 50
    totalIssues: 5, // Bronze
    totalRepos: 10,
    contributedTo: 100, // Diamond is 100
    followers: 100,
    gists: 10,
  };

  it('should calculate correct trophy ranks', () => {
    const trophies = calculateTrophies(mockStats);
    
    const starsTrophy = trophies.find(t => t.title === 'Stars');
    expect(starsTrophy?.rank).toBe('PLATINUM');

    const commitsTrophy = trophies.find(t => t.title === 'Commits');
    expect(commitsTrophy?.rank).toBe('GOLD');

    const contribsTrophy = trophies.find(t => t.title === 'Contribs');
    expect(contribsTrophy?.rank).toBe('DIAMOND');
  });
});
