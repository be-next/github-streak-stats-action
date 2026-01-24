import { StreakStats } from './streak';
export interface SvgOptions {
    theme: string;
    hideBorder: boolean;
    background?: string;
    stroke?: string;
    ring?: string;
    fire?: string;
    currStreakNum?: string;
    sideNums?: string;
    currStreakLabel?: string;
    sideLabels?: string;
    dates?: string;
}
export declare function generateSvg(stats: StreakStats, options: SvgOptions): string;
