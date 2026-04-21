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

interface ContributionsResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: ContributionCalendar;
    };
  } | null;
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

export interface StreakOptions {
  timezone?: string;
  now?: Date;
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
  token: string,
  options: StreakOptions = {}
): Promise<StreakStats> {
  const octokit = github.getOctokit(token);

  const response = await octokit.graphql<ContributionsResponse>(
    CONTRIBUTIONS_QUERY,
    { username }
  );

  if (!response.user) {
    throw new Error(`GitHub user '${username}' not found`);
  }

  const calendar = response.user.contributionsCollection.contributionCalendar;

  const allDays: ContributionDay[] = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date));

  return calculateStreaks(allDays, calendar.totalContributions, options);
}

function formatYMD(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function calculateStreaks(
  days: ContributionDay[],
  totalContributions: number,
  options: StreakOptions = {}
): StreakStats {
  const timezone = options.timezone ?? 'UTC';
  const now = options.now ?? new Date();
  const today = formatYMD(now, timezone);
  const yesterday = formatYMD(new Date(now.getTime() - 86400000), timezone);

  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakStart: string | null = null;
  let currentStreakEnd: string | null = null;
  let longestStreakStart: string | null = null;
  let longestStreakEnd: string | null = null;

  let tempStreak = 0;
  let tempStreakStart: string | null = null;

  for (const day of days) {
    if (day.contributionCount > 0) {
      if (tempStreak === 0) {
        tempStreakStart = day.date;
      }
      tempStreak++;

      if (day.date === today || day.date === yesterday) {
        currentStreak = tempStreak;
        currentStreakStart = tempStreakStart;
        currentStreakEnd = day.date;
      }

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
