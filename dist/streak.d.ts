interface ContributionDay {
    contributionCount: number;
    date: string;
}
export interface StreakStats {
    totalContributions: number;
    currentStreak: number;
    longestStreak: number;
    currentStreakStart: string | null;
    currentStreakEnd: string | null;
    longestStreakStart: string | null;
    longestStreakEnd: string | null;
}
export declare function fetchStreakStats(username: string, token: string): Promise<StreakStats>;
export declare function calculateStreaks(days: ContributionDay[], totalContributions: number): StreakStats;
export {};
