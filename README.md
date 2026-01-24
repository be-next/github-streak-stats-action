# GitHub Streak Stats Action

Generate streak stats SVG for your GitHub profile README.

## Features

- Total contributions count
- Current streak (consecutive days with contributions)
- Longest streak
- Multiple themes (default, dark, radical, tokyonight, gruvbox, dracula, nord)
- Custom color overrides
- Light/dark mode support

## Usage

```yaml
name: Update Streak Stats

on:
  schedule:
    - cron: '0 0 * * *' # Daily
  workflow_dispatch:

jobs:
  update-streak:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Generate streak stats (light)
        uses: be-next/github-streak-stats-action@v1
        with:
          username: ${{ github.repository_owner }}
          token: ${{ secrets.GITHUB_TOKEN }}
          output-path: profile/streak-light.svg
          theme: default
          hide-border: true

      - name: Generate streak stats (dark)
        uses: be-next/github-streak-stats-action@v1
        with:
          username: ${{ github.repository_owner }}
          token: ${{ secrets.GITHUB_TOKEN }}
          output-path: profile/streak-dark.svg
          theme: dark
          hide-border: true

      - name: Commit changes
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@users.noreply.github.com"
          git add profile/*.svg
          git commit -m "Update streak stats" || exit 0
          git push
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `username` | GitHub username | Yes | - |
| `token` | GitHub token for API access | Yes | - |
| `output-path` | Path to save the SVG | No | `streak-stats.svg` |
| `theme` | Theme name | No | `default` |
| `hide-border` | Hide card border | No | `false` |

### Custom Colors

Override any theme color using these inputs (hex values without `#`):

| Input | Description |
|-------|-------------|
| `background` | Card background |
| `stroke` | Border color |
| `ring` | Ring around current streak |
| `fire` | Fire icon color |
| `currStreakNum` | Current streak number |
| `sideNums` | Side numbers (total/longest) |
| `currStreakLabel` | Current streak label |
| `sideLabels` | Side labels |
| `dates` | Date range text |

## Outputs

| Output | Description |
|--------|-------------|
| `total-contributions` | Total contributions count |
| `current-streak` | Current streak in days |
| `longest-streak` | Longest streak in days |

## Themes

- `default` - Light theme
- `dark` - Dark theme with black background
- `radical` - Pink/purple theme
- `tokyonight` - Tokyo Night theme
- `gruvbox` - Gruvbox theme
- `dracula` - Dracula theme
- `nord` - Nord theme

## License

MIT
