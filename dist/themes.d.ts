export interface Theme {
    background: string;
    stroke: string;
    ring: string;
    fire: string;
    currStreakNum: string;
    sideNums: string;
    currStreakLabel: string;
    sideLabels: string;
    dates: string;
}
export declare const themes: Record<string, Theme>;
export declare function getTheme(themeName: string): Theme;
