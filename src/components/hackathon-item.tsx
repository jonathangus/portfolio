import { HackathonAward } from '@/data/resume';
import Link from 'next/link';

interface HackathonItemProps {
  award: HackathonAward;
}

export function HackathonItem({ award }: HackathonItemProps) {
  const { event, achievement, githubLink, submissionLink } = award;

  const hasLinks = githubLink || submissionLink;

  return (
    <div className="mb-8">
      <div className="font-medium">{event}</div>
      <p className="text-muted-foreground mb-2">{achievement}</p>

      {hasLinks && (
        <div className="flex mt-2">
          {githubLink && (
            <Link
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="click-action inline-block bg-gray-100 hover:bg-gray-200 text-xs font-mono uppercase tracking-wider py-1 px-3 mr-2 rounded-sm"
            >
              GITHUB
            </Link>
          )}

          {submissionLink && (
            <Link
              href={submissionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="click-action inline-block bg-gray-100 hover:bg-gray-200 text-xs font-mono uppercase tracking-wider py-1 px-3 rounded-sm"
            >
              SUBMISSION
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
