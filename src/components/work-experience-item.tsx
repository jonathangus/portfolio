'use client';

import { WorkExperience } from '@/data/resume';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface WorkExperienceItemProps {
  experience: WorkExperience;
}

export function WorkExperienceItem({ experience }: WorkExperienceItemProps) {
  const { title, company, period, description, videoUrl } = experience;

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
