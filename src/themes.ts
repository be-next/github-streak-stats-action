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

export const themes: Record<string, Theme> = {
  default: {
    background: 'fffefe',
    stroke: 'e4e2e2',
    ring: 'fb8c00',
    fire: 'fb8c00',
    currStreakNum: '151515',
    sideNums: '151515',
    currStreakLabel: 'fb8c00',
    sideLabels: '151515',
    dates: '464646',
  },
  dark: {
    background: '000000',
    stroke: 'e4e2e2',
    ring: 'fb8c00',
    fire: 'fb8c00',
    currStreakNum: 'ffffff',
    sideNums: 'ffffff',
    currStreakLabel: 'fb8c00',
    sideLabels: 'ffffff',
    dates: 'b0b0b0',
  },
  radical: {
    background: '141321',
    stroke: 'fe428e',
    ring: 'fe428e',
    fire: 'f8d847',
    currStreakNum: 'fe428e',
    sideNums: 'fe428e',
    currStreakLabel: 'f8d847',
    sideLabels: 'a9fef7',
    dates: 'a9fef7',
  },
  tokyonight: {
    background: '1a1b27',
    stroke: '70a5fd',
    ring: 'bf91f3',
    fire: '70a5fd',
    currStreakNum: '70a5fd',
    sideNums: '70a5fd',
    currStreakLabel: 'bf91f3',
    sideLabels: '38bdae',
    dates: '38bdae',
  },
  gruvbox: {
    background: '282828',
    stroke: 'd65d0e',
    ring: 'fabd2f',
    fire: 'fe8019',
    currStreakNum: 'fabd2f',
    sideNums: 'fabd2f',
    currStreakLabel: 'fe8019',
    sideLabels: '8ec07c',
    dates: '8ec07c',
  },
  dracula: {
    background: '282a36',
    stroke: 'bd93f9',
    ring: 'ff79c6',
    fire: 'ffb86c',
    currStreakNum: 'ff79c6',
    sideNums: 'ff79c6',
    currStreakLabel: 'ffb86c',
    sideLabels: 'f8f8f2',
    dates: 'f8f8f2',
  },
  nord: {
    background: '2e3440',
    stroke: '88c0d0',
    ring: 'bf616a',
    fire: 'd08770',
    currStreakNum: '88c0d0',
    sideNums: '88c0d0',
    currStreakLabel: 'd08770',
    sideLabels: 'eceff4',
    dates: 'eceff4',
  },
};

export function getTheme(themeName: string): Theme {
  return themes[themeName] || themes.default;
}
