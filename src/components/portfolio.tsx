'use client';

import { productRecordings } from '@/data/resume';
import { PortfolioItem } from './portfolio-item';

export function ProductRecordings() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {productRecordings.map((item, index) => (
        <PortfolioItem key={index} item={item} />
      ))}
    </div>
  );
}
