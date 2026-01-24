import * as github from '@actions/github';

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface StreakStats {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  currentStreakStart: string | null;
  currentStreakEnd: string | null;
  longestStreakStart: string | null;
  longestStreakEnd: string | null;
}

const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

export async function fetchStreakStats(
  username: string,
  token: string
): Promise<StreakStats> {
  const octokit = github.getOctokit(token);

  const response: any = await octokit.graphql(CONTRIBUTIONS_QUERY, {
    username,
  });

  const calendar: ContributionCalendar =
    response.user.contributionsCollection.contributionCalendar;

  // Flatten all contribution days and sort by date
  const allDays: ContributionDay[] = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date));

  return calculateStreaks(allDays, calendar.totalContributions);
}

export function calculateStreaks(
  days: ContributionDay[],
  totalContributions: number
): StreakStats {
  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakStart: string | null = null;
  let currentStreakEnd: string | null = null;
  let longestStreakStart: string | null = null;
  let longestStreakEnd: string | null = null;

  let tempStreak = 0;
  let tempStreakStart: string | null = null;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Calculate streaks
  for (let i = 0; i < days.length; i++) {
    const day = days[i];

    if (day.contributionCount > 0) {
      if (tempStreak === 0) {
        tempStreakStart = day.date;
      }
      tempStreak++;

      // Check if this is the current streak (ends today or yesterday)
      if (day.date === today || day.date === yesterday) {
        currentStreak = tempStreak;
        currentStreakStart = tempStreakStart;
        currentStreakEnd = day.date;
      }

      // Update longest streak
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStreakStart = tempStreakStart;
        longestStreakEnd = day.date;
      }
    } else {
      tempStreak = 0;
      tempStreakStart = null;
    }
  }

  // If current streak ended before yesterday, reset it
  if (currentStreakEnd && currentStreakEnd !== today && currentStreakEnd !== yesterday) {
    currentStreak = 0;
    currentStreakStart = null;
    currentStreakEnd = null;
  }

  return {
    totalContributions,
    currentStreak,
    longestStreak,
    currentStreakStart,
    currentStreakEnd,
    longestStreakStart,
    longestStreakEnd,
  };
}
