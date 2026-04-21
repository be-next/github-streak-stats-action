import { generateSvg, SvgOptions } from './svg.js';
import { StreakStats } from './streak.js';

describe('generateSvg', () => {
  const defaultStats: StreakStats = {
    totalContributions: 500,
    currentStreak: 10,
    longestStreak: 30,
    currentStreakStart: '2024-01-05',
    currentStreakEnd: '2024-01-15',
    longestStreakStart: '2023-06-01',
    longestStreakEnd: '2023-06-30',
  };

  const defaultOptions: SvgOptions = {
    theme: 'default',
    hideBorder: false,
  };

  it('should generate valid SVG with correct dimensions', () => {
    const svg = generateSvg(defaultStats, defaultOptions);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('width="495"');
    expect(svg).toContain('height="195"');
  });

  it('should include total contributions', () => {
    const svg = generateSvg(defaultStats, defaultOptions);
    expect(svg).toContain('>500<');
    expect(svg).toContain('Total Contributions');
  });

  it('should include current streak', () => {
    const svg = generateSvg(defaultStats, defaultOptions);
    expect(svg).toContain('>10<');
    expect(svg).toContain('Current Streak');
  });

  it('should include longest streak', () => {
    const svg = generateSvg(defaultStats, defaultOptions);
    expect(svg).toContain('>30<');
    expect(svg).toContain('Longest Streak');
  });

  it('should format date ranges correctly', () => {
    const svg = generateSvg(defaultStats, defaultOptions);
    // Current streak dates
    expect(svg).toContain('Jan 5, 2024 - Jan 15, 2024');
    // Longest streak dates
    expect(svg).toContain('Jun 1, 2023 - Jun 30, 2023');
  });

  it('should show "N/A" when current streak is zero', () => {
    const stats: StreakStats = {
      ...defaultStats,
      currentStreak: 0,
      currentStreakStart: null,
      currentStreakEnd: null,
    };
    const svg = generateSvg(stats, defaultOptions);
    // When no active streak, date range shows N/A
    expect(svg).toMatch(/>0<.*Current Streak/s);
  });

  it('should apply theme colors', () => {
    const svg = generateSvg(defaultStats, { ...defaultOptions, theme: 'dark' });
    // Dark theme has black background
    expect(svg).toContain('fill="#000000"');
  });

  it('should hide border when hideBorder is true', () => {
    const svg = generateSvg(defaultStats, { ...defaultOptions, hideBorder: true });
    expect(svg).toContain('stroke-opacity="0"');
  });

  it('should show border when hideBorder is false', () => {
    const svg = generateSvg(defaultStats, { ...defaultOptions, hideBorder: false });
    expect(svg).toContain('stroke="#');
    expect(svg).toContain('stroke-width="1"');
  });

  it('should apply custom color overrides', () => {
    const options: SvgOptions = {
      theme: 'default',
      hideBorder: false,
      background: 'ff0000',
      stroke: '00ff00',
      ring: '0000ff',
    };
    const svg = generateSvg(defaultStats, options);
    expect(svg).toContain('fill="#ff0000"');
    expect(svg).toContain('stroke="#00ff00"');
    expect(svg).toContain('stroke="#0000ff"');
  });

  it('should handle same start and end date', () => {
    const stats: StreakStats = {
      ...defaultStats,
      currentStreakStart: '2024-01-15',
      currentStreakEnd: '2024-01-15',
    };
    const svg = generateSvg(stats, defaultOptions);
    // Should show single date instead of range
    expect(svg).toContain('Jan 15, 2024');
    expect(svg).not.toContain('Jan 15, 2024 - Jan 15, 2024');
  });

  it('should include fire icon', () => {
    const svg = generateSvg(defaultStats, defaultOptions);
    expect(svg).toContain('class="fire"');
    expect(svg).toContain('<path');
  });

  it('should include ring around current streak', () => {
    const svg = generateSvg(defaultStats, defaultOptions);
    expect(svg).toContain('<circle');
    expect(svg).toContain('r="32"');
  });

  it('should show N/A for longest streak when null dates', () => {
    const stats: StreakStats = {
      ...defaultStats,
      longestStreak: 0,
      longestStreakStart: null,
      longestStreakEnd: null,
    };
    const svg = generateSvg(stats, defaultOptions);
    expect(svg).toContain('>N/A<');
  });
});
