import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { fetchStreakStats } from './streak.js';
import { generateSvg } from './svg.js';
import { themes } from './themes.js';

async function run(): Promise<void> {
  try {
    // Get inputs
    const username = core.getInput('username', { required: true });
    const token = core.getInput('token', { required: true });
    const outputPath = core.getInput('output-path') || 'streak-stats.svg';
    const theme = core.getInput('theme') || 'default';
    const timezone = core.getInput('timezone') || 'UTC';
    const hideBorder = core.getInput('hide-border') === 'true';

    if (!(theme in themes)) {
      core.warning(
        `Unknown theme '${theme}'. Falling back to 'default'. Available themes: ${Object.keys(themes).join(', ')}`
      );
    }

    // Custom color overrides
    const background = core.getInput('background') || undefined;
    const stroke = core.getInput('stroke') || undefined;
    const ring = core.getInput('ring') || undefined;
    const fire = core.getInput('fire') || undefined;
    const currStreakNum = core.getInput('currStreakNum') || undefined;
    const sideNums = core.getInput('sideNums') || undefined;
    const currStreakLabel = core.getInput('currStreakLabel') || undefined;
    const sideLabels = core.getInput('sideLabels') || undefined;
    const dates = core.getInput('dates') || undefined;

    core.info(`Fetching streak stats for ${username}...`);

    // Fetch streak stats from GitHub
    const stats = await fetchStreakStats(username, token, { timezone });

    core.info(`Total contributions: ${stats.totalContributions}`);
    core.info(`Current streak: ${stats.currentStreak} days`);
    core.info(`Longest streak: ${stats.longestStreak} days`);

    // Generate SVG
    const svg = generateSvg(stats, {
      theme,
      hideBorder,
      background,
      stroke,
      ring,
      fire,
      currStreakNum,
      sideNums,
      currStreakLabel,
      sideLabels,
      dates,
    });

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (outputDir && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write SVG to file
    fs.writeFileSync(outputPath, svg);
    core.info(`SVG written to ${outputPath}`);

    // Set outputs
    core.setOutput('total-contributions', stats.totalContributions.toString());
    core.setOutput('current-streak', stats.currentStreak.toString());
    core.setOutput('current-streak-start', stats.currentStreakStart ?? '');
    core.setOutput('current-streak-end', stats.currentStreakEnd ?? '');
    core.setOutput('longest-streak', stats.longestStreak.toString());
    core.setOutput('longest-streak-start', stats.longestStreakStart ?? '');
    core.setOutput('longest-streak-end', stats.longestStreakEnd ?? '');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

run();
