import { describe, it, expect } from 'vitest';
import { generateStatsSVG } from '../src/svg-generator';
import { themes } from '../src/themes';
import { locales } from '../src/locales';

describe('SVG Generator', () => {
  const mockData = {
    name: 'Test User',
    login: 'testuser',
    totalStars: 100,
    totalCommits: 500,
    totalPRs: 50,
    totalIssues: 25,
    totalRepos: 10,
    contributedTo: 5,
  };

  it('should generate a stats SVG containing the user name', () => {
    const svg = generateStatsSVG(mockData, themes.dark, locales.en);
    expect(svg).toContain('Test User');
    expect(svg).toContain('Total Stars:');
    expect(svg).toContain('100');
  });

  it('should apply theme colors correctly', () => {
    const theme = themes.dracula;
    const svg = generateStatsSVG(mockData, theme, locales.en);
    expect(svg).toContain(`#${theme.bg_color}`);
    expect(svg).toContain(`#${theme.title_color}`);
  });

  it('should support compact mode', () => {
    const svg = generateStatsSVG(mockData, themes.dark, locales.en, [], true);
    // Standard height is 195, compact should be smaller or different
    expect(svg).toContain('height="170"'); // 45 + 5 * 25 = 170
  });
});
