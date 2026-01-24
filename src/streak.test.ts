import { calculateStreaks, StreakStats } from './streak';

describe('calculateStreaks', () => {
  // Mock current date for deterministic tests
  const mockDate = new Date('2024-01-15T12:00:00Z');
  const today = '2024-01-15';
  const yesterday = '2024-01-14';

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return zero streaks for empty days array', () => {
    const result = calculateStreaks([], 0);
    expect(result).toEqual({
      totalContributions: 0,
      currentStreak: 0,
      longestStreak: 0,
      currentStreakStart: null,
      currentStreakEnd: null,
      longestStreakStart: null,
      longestStreakEnd: null,
    });
  });

  it('should return zero streaks when all days have zero contributions', () => {
    const days = [
      { date: '2024-01-13', contributionCount: 0 },
      { date: '2024-01-14', contributionCount: 0 },
      { date: '2024-01-15', contributionCount: 0 },
    ];
    const result = calculateStreaks(days, 0);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });

  it('should calculate current streak ending today', () => {
    const days = [
      { date: '2024-01-12', contributionCount: 1 },
      { date: '2024-01-13', contributionCount: 1 },
      { date: '2024-01-14', contributionCount: 1 },
      { date: '2024-01-15', contributionCount: 1 }, // today
    ];
    const result = calculateStreaks(days, 4);
    expect(result.currentStreak).toBe(4);
    expect(result.currentStreakStart).toBe('2024-01-12');
    expect(result.currentStreakEnd).toBe('2024-01-15');
  });

  it('should calculate current streak ending yesterday', () => {
    const days = [
      { date: '2024-01-12', contributionCount: 1 },
      { date: '2024-01-13', contributionCount: 1 },
      { date: '2024-01-14', contributionCount: 1 }, // yesterday
      { date: '2024-01-15', contributionCount: 0 }, // today - no contribution
    ];
    const result = calculateStreaks(days, 3);
    expect(result.currentStreak).toBe(3);
    expect(result.currentStreakEnd).toBe('2024-01-14');
  });

  it('should reset current streak if last contribution was before yesterday', () => {
    const days = [
      { date: '2024-01-10', contributionCount: 1 },
      { date: '2024-01-11', contributionCount: 1 },
      { date: '2024-01-12', contributionCount: 1 },
      { date: '2024-01-13', contributionCount: 0 },
      { date: '2024-01-14', contributionCount: 0 },
      { date: '2024-01-15', contributionCount: 0 },
    ];
    const result = calculateStreaks(days, 3);
    expect(result.currentStreak).toBe(0);
    expect(result.currentStreakStart).toBe(null);
    expect(result.currentStreakEnd).toBe(null);
    // But longest streak should still be tracked
    expect(result.longestStreak).toBe(3);
  });

  it('should track longest streak separately from current streak', () => {
    const days = [
      { date: '2024-01-01', contributionCount: 1 },
      { date: '2024-01-02', contributionCount: 1 },
      { date: '2024-01-03', contributionCount: 1 },
      { date: '2024-01-04', contributionCount: 1 },
      { date: '2024-01-05', contributionCount: 1 }, // 5 day streak
      { date: '2024-01-06', contributionCount: 0 },
      { date: '2024-01-14', contributionCount: 1 },
      { date: '2024-01-15', contributionCount: 1 }, // 2 day current streak
    ];
    const result = calculateStreaks(days, 7);
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(5);
    expect(result.longestStreakStart).toBe('2024-01-01');
    expect(result.longestStreakEnd).toBe('2024-01-05');
  });

  it('should handle single day contribution today', () => {
    const days = [
      { date: '2024-01-14', contributionCount: 0 },
      { date: '2024-01-15', contributionCount: 1 },
    ];
    const result = calculateStreaks(days, 1);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
    expect(result.currentStreakStart).toBe('2024-01-15');
    expect(result.currentStreakEnd).toBe('2024-01-15');
  });

  it('should handle gaps in contribution data', () => {
    const days = [
      { date: '2024-01-10', contributionCount: 1 },
      { date: '2024-01-11', contributionCount: 1 },
      // gap - no data for 12, 13
      { date: '2024-01-14', contributionCount: 1 },
      { date: '2024-01-15', contributionCount: 1 },
    ];
    const result = calculateStreaks(days, 4);
    // Since there's no zero-contribution day between, it counts as continuous
    // Actually no - the days are sorted and processed in order, gaps don't reset
    expect(result.currentStreak).toBe(4);
    expect(result.longestStreak).toBe(4);
  });

  it('should correctly pass through total contributions', () => {
    const days = [{ date: '2024-01-15', contributionCount: 5 }];
    const result = calculateStreaks(days, 1234);
    expect(result.totalContributions).toBe(1234);
  });
});
