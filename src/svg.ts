import { StreakStats } from './streak';
import { Theme, getTheme } from './themes';

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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start || !end) return 'N/A';
  if (start === end) return formatDate(start);
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function generateSvg(stats: StreakStats, options: SvgOptions): string {
  const baseTheme = getTheme(options.theme);

  // Apply custom color overrides
  const colors: Theme = {
    background: options.background || baseTheme.background,
    stroke: options.stroke || baseTheme.stroke,
    ring: options.ring || baseTheme.ring,
    fire: options.fire || baseTheme.fire,
    currStreakNum: options.currStreakNum || baseTheme.currStreakNum,
    sideNums: options.sideNums || baseTheme.sideNums,
    currStreakLabel: options.currStreakLabel || baseTheme.currStreakLabel,
    sideLabels: options.sideLabels || baseTheme.sideLabels,
    dates: options.dates || baseTheme.dates,
  };

  const borderStyle = options.hideBorder
    ? 'stroke-opacity="0"'
    : `stroke="#${colors.stroke}" stroke-width="1"`;

  const currentStreakDates = formatDateRange(stats.currentStreakStart, stats.currentStreakEnd);
  const longestStreakDates = formatDateRange(stats.longestStreakStart, stats.longestStreakEnd);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" fill="none">
  <style>
    .title { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${colors.sideLabels}; }
    .stat-number { font: 700 28px 'Segoe UI', Ubuntu, Sans-Serif; }
    .stat-label { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; }
    .date-range { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${colors.dates}; }
    .fire { fill: #${colors.fire}; }
  </style>

  <rect x="0.5" y="0.5" rx="4.5" width="494" height="194" fill="#${colors.background}" ${borderStyle}/>

  <!-- Total Contributions -->
  <g transform="translate(50, 48)">
    <text class="stat-number" fill="#${colors.sideNums}" text-anchor="middle" x="55">${stats.totalContributions}</text>
    <text class="stat-label" fill="#${colors.sideLabels}" text-anchor="middle" x="55" y="30">Total Contributions</text>
    <text class="date-range" text-anchor="middle" x="55" y="50">Past Year</text>
  </g>

  <!-- Current Streak -->
  <g transform="translate(197, 28)">
    <!-- Fire icon -->
    <svg x="35" y="-5" width="30" height="30" viewBox="0 0 24 24">
      <path class="fire" d="M12 23C7.02944 23 3 18.9706 3 14C3 9.5 6 6 8 4C8 8 10 9 11 8C11 5 13 2 16 1C15 4 17 6 19 7C21 8.5 21 11 21 14C21 18.9706 16.9706 23 12 23Z"/>
    </svg>
    <circle cx="50" cy="45" r="40" fill="none" stroke="#${colors.ring}" stroke-width="5"/>
    <text class="stat-number" fill="#${colors.currStreakNum}" text-anchor="middle" x="50" y="55">${stats.currentStreak}</text>
    <text class="stat-label" fill="#${colors.currStreakLabel}" text-anchor="middle" x="50" y="80">Current Streak</text>
    <text class="date-range" text-anchor="middle" x="50" y="100">${currentStreakDates || 'No active streak'}</text>
  </g>

  <!-- Longest Streak -->
  <g transform="translate(340, 48)">
    <text class="stat-number" fill="#${colors.sideNums}" text-anchor="middle" x="55">${stats.longestStreak}</text>
    <text class="stat-label" fill="#${colors.sideLabels}" text-anchor="middle" x="55" y="30">Longest Streak</text>
    <text class="date-range" text-anchor="middle" x="55" y="50">${longestStreakDates}</text>
  </g>
</svg>`;
}
