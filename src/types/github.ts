export interface GithubContribution {
  date: string;
  count: number;
  level: number;
  dayOfWeek?: number;
}

export interface GithubYearlyTotal {
  [year: string]: number;
}

export interface GithubData {
  total: GithubYearlyTotal;
  contributions: GithubContribution[];
}

export interface ContributionPeriod {
  startDate: string;
  endDate: string;
  contributions: GithubContribution[];
  totalCount: number;
}
