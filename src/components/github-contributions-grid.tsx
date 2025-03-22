'use client';

import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { GithubContribution } from '@/types/github';
import { getDayOfWeek, formatContributionDate } from '@/utils/github';

interface ContributionsGridProps {
  contributions: GithubContribution[];
  totalCount: number;
  className?: string;
  cellSize?: number;
  cellGap?: number;
}

// Memoize style classes to avoid recalculation
const styleClasses = [
  '', // Level 0 (empty)
  'bg-zinc-800/20 dark:bg-zinc-200/20', // Level 1
  'bg-zinc-800/40 dark:bg-zinc-200/40', // Level 2
  'bg-zinc-800/60 dark:bg-zinc-200/60', // Level 3
  'bg-zinc-800 dark:bg-zinc-200', // Level 4
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function GitHubContributionsGrid({
  contributions,
  totalCount,
  className = '',
  cellSize = 8, // Smaller default size for work experience items
  cellGap = 2,
}: ContributionsGridProps) {
  // Sort contributions by date to ensure correct order
  const sortedContributions = useMemo(() => {
    return [...contributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [contributions]);

  // Group contributions by week to ensure proper alignment
  const { weeks, years } = useMemo(() => {
    const weekGroups: GithubContribution[][] = [];
    const yearSet = new Set<number>();
    let currentWeek: GithubContribution[] = [];
    let lastDate: Date | null = null;

    sortedContributions.forEach((day) => {
      const date = new Date(day.date);
      yearSet.add(date.getFullYear());

      // If we have a last date and there's a gap, fill in empty days
      if (lastDate) {
        const dayDiff = Math.floor(
          (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dayDiff > 1) {
          for (let i = 1; i < dayDiff; i++) {
            const emptyDate = new Date(
              lastDate.getTime() + i * 24 * 60 * 60 * 1000
            );
            currentWeek.push({
              date: emptyDate.toISOString().split('T')[0],
              count: 0,
              level: 0,
            });

            if (currentWeek.length === 7) {
              weekGroups.push(currentWeek);
              currentWeek = [];
            }
          }
        }
      }

      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weekGroups.push(currentWeek);
        currentWeek = [];
      }

      lastDate = date;
    });

    // Add any remaining days in the last week
    if (currentWeek.length > 0) {
      weekGroups.push(currentWeek);
    }

    return {
      weeks: weekGroups,
      years: Array.from(yearSet).sort(),
    };
  }, [sortedContributions]);

  const gridStyle = {
    gap: `${cellGap}px`,
    gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
  };

  return (
    <div className={`font-mono w-full ${className}`}>
      <div className="text-sm mb-2">
        {totalCount.toLocaleString()} contributions during this period
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="relative">
            {/* Grid */}
            <div className="flex">
              {/* Day of week labels */}
              <div className="flex flex-col pr-2 w-6">
                {daysOfWeek.map((day, index) => (
                  <div
                    key={day}
                    className="text-xs h-full flex items-center text-muted-foreground"
                    style={{
                      height: `${cellSize}px`,
                      marginBottom: index < 6 ? `${cellGap}px` : 0,
                    }}
                  >
                    {index === 0 || index === 2 || index === 4 ? day[0] : ''}
                  </div>
                ))}
              </div>

              {/* Contribution cells */}
              <div
                className="grid grid-rows-7 auto-cols-auto"
                style={gridStyle}
              >
                {weeks.map((week, weekIndex) =>
                  week.map((day, dayIndex) => {
                    const cell = (
                      <div
                        className={`${
                          day.count > 0 ? styleClasses[day.level] : ''
                        }`}
                        style={{
                          gridRow: getDayOfWeek(day.date) + 1,
                          gridColumn: weekIndex + 1,
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                        }}
                      />
                    );

                    return day.count > 0 ? (
                      <TooltipProvider
                        key={`${weekIndex}-${dayIndex}`}
                        delayDuration={0}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>{cell}</TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="font-mono text-xs"
                          >
                            {formatContributionDate(day.date)}: {day.count}{' '}
                            contribution{day.count !== 1 ? 's' : ''}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <div key={`${weekIndex}-${dayIndex}`}>{cell}</div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Year labels */}
            {years.length > 1 && (
              <div className="flex pl-6 mt-2">
                {years.map((year) => {
                  const yearWeeks = weeks.filter(
                    (week) => new Date(week[0].date).getFullYear() === year
                  );
                  const width = yearWeeks.length * (cellSize + cellGap);

                  return (
                    <div
                      key={year}
                      className="text-xs text-muted-foreground"
                      style={{ width: `${width}px` }}
                    >
                      {year}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
