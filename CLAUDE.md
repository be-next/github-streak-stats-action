# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run build    # Compile TypeScript and bundle with ncc to dist/index.js
npm run lint     # Run ESLint (config not yet set up)
npm run test     # Run Jest tests (config not yet set up)
```

The build uses `@vercel/ncc` to bundle all TypeScript source and dependencies into a single `dist/index.js` file that GitHub Actions executes.

## Architecture

This is a GitHub Action that generates streak statistics SVG cards. It uses TypeScript with strict mode, targeting ES2020/CommonJS for Node 20.

### Module Structure

- **src/index.ts** - Action entry point. Reads inputs via `@actions/core`, orchestrates data fetching and SVG generation, writes output file, sets action outputs.
- **src/streak.ts** - GitHub GraphQL API integration. Fetches contribution calendar and calculates current/longest streaks with date ranges.
- **src/svg.ts** - SVG generator. Creates 495x195 card with three stat sections (total contributions, current streak with fire icon, longest streak).
- **src/themes.ts** - Theme definitions. Seven themes (default, dark, radical, tokyonight, gruvbox, dracula, nord), each with 9 color properties.

### Data Flow

1. Action receives `username` and `token` inputs
2. `fetchStreakStats()` queries GitHub GraphQL for contribution calendar
3. `calculateStreaks()` processes days to find current and longest streaks
4. `generateSvg()` applies theme colors and builds SVG markup
5. SVG written to `output-path`, stats set as action outputs

### Key Interfaces

`StreakStats` in streak.ts defines the shape returned by `fetchStreakStats()`:
- `totalContributions`, `currentStreak`, `longestStreak` (numbers)
- Start/end dates for both streaks (nullable strings)

Themes use 9 color properties: `background`, `stroke`, `ring`, `fire`, `currStreakNum`, `sideNums`, `currStreakLabel`, `sideLabels`, `dates`.
