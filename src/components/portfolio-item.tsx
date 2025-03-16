'use client';

import { ProductRecording } from '@/data/resume';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProductRecordingItemProps {
  item: ProductRecording;
}

export function PortfolioItem({ item }: ProductRecordingItemProps) {
  const { title, videoUrl } = item;

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer group">
            <div className="p-6 long-dash transition-colors group-hover:border-gray-600 group-focus-within:border-gray-600">
              <h3 className="text-lg font-medium mb-6">{title}</h3>
              <button className="bg-white text-xs font-mono uppercase tracking-wider py-1 px-3 border border-black/20 group-hover:border-black/40 group-focus-within:border-black/40 focus:outline-none">
                WATCH RECORDING
              </button>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] rounded-none focus:outline-none">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full mt-2">
            <video
              src={videoUrl}
              className="w-full h-full focus:outline-none"
              controls
              autoPlay
              style={{ outline: 'none' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
