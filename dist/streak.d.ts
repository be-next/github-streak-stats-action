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
