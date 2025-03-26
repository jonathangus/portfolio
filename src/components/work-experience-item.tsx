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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { GitHubContributionsGrid } from '@/components/github-contributions-grid';
import { getContributionsForPeriod, parsePeriodString } from '@/utils/github';
import Image from 'next/image';

interface WorkExperienceItemProps {
  experience: WorkExperience;
}

export function WorkExperienceItem({ experience }: WorkExperienceItemProps) {
  const {
    title,
    company,
    period,
    description,
    videoUrl,
    showGithub,
    highlights,
  } = experience;

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

      {/* Highlights Section */}
      {highlights && highlights.length > 0 && (
        <div className="mt-4 pb-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="highlights">
              <AccordionTrigger className="text-sm font-mono uppercase tracking-wider text-black data-[state=open]:text-black">
                Highlights
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 py-4">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-[5px] h-[5px] flex-shrink-0 bg-black mt-2" />
                      <div className="space-y-2">
                        <p className="text-muted-foreground">
                          {highlight.text}
                        </p>
                        {highlight.link && (
                          <a
                            href={highlight.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-black hover:underline block"
                          >
                            Read more →
                          </a>
                        )}
                        {highlight.image && (
                          <div className="pt-2">
                            <div className="relative w-full aspect-video mt-4 block">
                              <Image
                                src={highlight.image}
                                alt="Highlight image"
                                fill
                                className="object-cover grayscale transition-all duration-1000 hover:grayscale-0"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

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
