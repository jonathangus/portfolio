'use client';

import { useMemo } from 'react';
import { WorkExperience } from '@/data/resume';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GitHubContributionsGrid } from '@/components/github-contributions-grid';
import { getContributionsForPeriod, parsePeriodString } from '@/utils/github';

interface WorkExperienceItemProps {
  experience: WorkExperience;
}

export function WorkExperienceItem({ experience }: WorkExperienceItemProps) {
  const { title, company, period, description, videoUrl, showGithub } =
    experience;

  // Memoize the contributions data to prevent unnecessary recalculations
  const { contributions, totalCount } = useMemo(() => {
    // Only calculate contributions if showGithub is true
    if (!showGithub) {
      return { contributions: [], totalCount: 0 };
    }
    const { startDate, endDate } = parsePeriodString(period);
    return getContributionsForPeriod(startDate, endDate);
  }, [period, showGithub]);

  // Only render if there are contributions and showGithub is true
  const hasContributions = showGithub && totalCount > 0;

  return (
    <div className="mb-16">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-medium">{title}</h3>
        <span className="text-muted-foreground text-sm font-mono text-right">
          {period}
        </span>
      </div>
      <div
        className={`text-base uppercase tracking-wider mb-3 ${
          description ? 'border-b pb-1 border-black/10' : ''
        }`}
      >
        &gt; {company}
      </div>
      {description && <p className="text-muted-foreground">{description}</p>}

      {/* GitHub Contributions */}
      {hasContributions && (
        <div className="mt-4">
          <GitHubContributionsGrid
            contributions={contributions}
            totalCount={totalCount}
            className="text-muted-foreground"
          />
        </div>
      )}

      {videoUrl && (
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-block bg-gray-100 hover:bg-gray-200 text-xs font-mono uppercase tracking-wider py-1 px-3 rounded-sm">
                Product Video
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>{title} - Product Video</DialogTitle>
              </DialogHeader>
              <div className="aspect-video w-full mt-2">
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
