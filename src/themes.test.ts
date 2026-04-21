import { getTheme, themes, Theme } from './themes.js';

describe('themes', () => {
  describe('getTheme', () => {
    it('should return the default theme when given "default"', () => {
      const theme = getTheme('default');
      expect(theme).toBe(themes.default);
      expect(theme.background).toBe('fffefe');
    });

    it('should return the dark theme when given "dark"', () => {
      const theme = getTheme('dark');
      expect(theme).toBe(themes.dark);
      expect(theme.background).toBe('000000');
    });

    it('should return the correct theme for all valid theme names', () => {
      const themeNames = ['default', 'dark', 'radical', 'tokyonight', 'gruvbox', 'dracula', 'nord'];
      for (const name of themeNames) {
        const theme = getTheme(name);
        expect(theme).toBe(themes[name]);
      }
    });

    it('should return the default theme for unknown theme names', () => {
      const theme = getTheme('unknown-theme');
      expect(theme).toBe(themes.default);
    });

    it('should return the default theme for empty string', () => {
      const theme = getTheme('');
      expect(theme).toBe(themes.default);
    });
  });

  describe('theme structure', () => {
    const requiredProperties: (keyof Theme)[] = [
      'background', 'stroke', 'ring', 'fire',
      'currStreakNum', 'sideNums', 'currStreakLabel', 'sideLabels', 'dates'
    ];

    it('should have all required properties in each theme', () => {
      for (const themeName of Object.keys(themes)) {
        const theme = themes[themeName];
        for (const prop of requiredProperties) {
          expect(theme[prop]).toBeDefined();
          expect(typeof theme[prop]).toBe('string');
          expect(theme[prop].length).toBe(6); // hex color without #
        }
      }
    });
  });
});
