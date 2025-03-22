import { githubData } from '@/data/github';
import { ContributionPeriod, GithubContribution } from '@/types/github';

// Cache for parsed dates to avoid repeated parsing
const dateCache = new Map<string, Date>();

function getDateFromCache(dateString: string): Date {
  let date = dateCache.get(dateString);
  if (!date) {
    date = new Date(dateString);
    dateCache.set(dateString, date);
  }
  return date;
}

// Helper function to create a date string in YYYY-MM-DD format
function createDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(
    2,
    '0'
  )}`;
}

// Cache for period parsing results
const periodCache = new Map<string, { startDate: string; endDate: string }>();

export function getContributionsForPeriod(
  startDate: string,
  endDate: string
): ContributionPeriod {
  // First, get all contributions within the date range
  const filteredContributions = githubData.contributions.filter(
    (contribution) =>
      contribution.date >= startDate && contribution.date <= endDate
  );

  // Calculate total in the same loop as filtering to avoid a second iteration
  let totalCount = 0;
  const contributions = filteredContributions.map((contribution) => {
    totalCount += contribution.count;
    return contribution;
  });

  return {
    startDate,
    endDate,
    contributions,
    totalCount,
  };
}

const MONTH_MAP: { [key: string]: number } = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

export function parsePeriodString(period: string): {
  startDate: string;
  endDate: string;
} {
  // Check cache first
  const cached = periodCache.get(period);
  if (cached) {
    return cached;
  }

  // Handle "present" case
  const now = new Date();
  const currentDateString = createDateString(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  try {
    // Split period into parts and handle edge cases
    const parts = period.split(' - ');
    if (!parts || parts.length === 0) {
      const result = {
        startDate: currentDateString,
        endDate: currentDateString,
      };
      periodCache.set(period, result);
      return result;
    }

    // Parse start date
    const startPart = parts[0];
    const [startMonth, startYear] = startPart.split(' ');
    if (!startMonth || !startYear) {
      const result = {
        startDate: currentDateString,
        endDate: currentDateString,
      };
      periodCache.set(period, result);
      return result;
    }

    // Get month number from the map (case insensitive)
    const startMonthNum = MONTH_MAP[startMonth.toLowerCase()];
    const startYearNum = parseInt(startYear);

    // Create exact start date string (first day of the month)
    const startDateString = createDateString(startYearNum, startMonthNum, 1);

    // Parse end date
    let endDateString = currentDateString;
    if (parts.length > 1) {
      const endPart = parts[1].toLowerCase();
      if (endPart !== 'present') {
        const [endMonth, endYear] = endPart.split(' ');
        if (endMonth && endYear) {
          const endMonthNum = MONTH_MAP[endMonth.toLowerCase()];
          const endYearNum = parseInt(endYear);

          // Get the last day of the month
          const lastDay = new Date(endYearNum, endMonthNum + 1, 0).getDate();
          endDateString = createDateString(endYearNum, endMonthNum, lastDay);
        }
      }
    } else {
      // If no end date provided, use the end of the start month
      const lastDay = new Date(startYearNum, startMonthNum + 1, 0).getDate();
      endDateString = createDateString(startYearNum, startMonthNum, lastDay);
    }

    const result = {
      startDate: startDateString,
      endDate: endDateString,
    };
    periodCache.set(period, result);
    return result;
  } catch (error) {
    console.error('Error parsing period string:', period, error);
    const result = {
      startDate: currentDateString,
      endDate: currentDateString,
    };
    periodCache.set(period, result);
    return result;
  }
}

// Cache for day of week calculations
const dayOfWeekCache = new Map<string, number>();

export function getDayOfWeek(dateString: string): number {
  const cached = dayOfWeekCache.get(dateString);
  if (cached !== undefined) {
    return cached;
  }

  const date = getDateFromCache(dateString);
  const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
  dayOfWeekCache.set(dateString, dayOfWeek);
  return dayOfWeek;
}

// Cache for formatted dates
const formattedDateCache = new Map<string, string>();

export function formatContributionDate(dateString: string): string {
  const cached = formattedDateCache.get(dateString);
  if (cached) {
    return cached;
  }

  const date = getDateFromCache(dateString);
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  formattedDateCache.set(dateString, formatted);
  return formatted;
}
