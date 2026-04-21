import { fetchStreakStats } from './src/streak.js';
import { generateSvg } from './src/svg.js';
import * as fs from 'fs';

async function main() {
  const username = process.argv[2] || 'be-next';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable is required');
    console.error('Usage: GITHUB_TOKEN=your_token npx ts-node test-local.ts [username]');
    process.exit(1);
  }

  console.log(`Fetching streak stats for ${username}...`);
  const stats = await fetchStreakStats(username, token);
  console.log('Stats:', stats);

  // Generate light theme
  const svgLight = generateSvg(stats, { theme: 'default', hideBorder: true });
  fs.writeFileSync('test-light.svg', svgLight);
  console.log('Generated: test-light.svg');

  // Generate dark theme
  const svgDark = generateSvg(stats, { theme: 'dark', hideBorder: true });
  fs.writeFileSync('test-dark.svg', svgDark);
  console.log('Generated: test-dark.svg');
}

main().catch(console.error);
