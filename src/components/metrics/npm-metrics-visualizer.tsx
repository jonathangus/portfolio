'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AsciiBarChart from '@/components/ascii-bar-chart';
import { metrics } from '@/data/metrics';

// Process the metrics data to get package counts
const processedPackageData = Object.entries(metrics.packages)
  .map(([name, count]) => ({
    name,
    downloads: count,
  }))
  .sort((a, b) => b.downloads - a.downloads);

export function NpmMetricsVisualizer() {
  const [bootSequence, setBootSequence] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bootProgress, setBootProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Enhanced boot sequence
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setBootSequence(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div ref={containerRef} className="w-full min-h-[60vh] md:min-h-[80vh]" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[60vh] md:min-h-[80vh] overflow-hidden"
    >
      <AnimatePresence>
        {bootSequence ? (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-50 font-mono px-4"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-muted-foreground text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <pre className="text-center text-[8px] xs:text-xs sm:text-sm md:text-base overflow-x-auto">
                {`
███╗   ██╗██████╗ ███╗   ███╗    ███╗   ███╗███████╗████████╗██████╗ ██╗ ██████╗███████╗
████╗  ██║██╔══██╗████╗ ████║    ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██║██╔════╝██╔════╝
██╔██╗ ██║██████╔╝██╔████╔██║    ██╔████╔██║█████╗     ██║   ██████╔╝██║██║     ███████╗
██║╚██╗██║██╔═══╝ ██║╚██╔╝██║    ██║╚██╔╝██║██╔══╝     ██║   ██╔══██╗██║██║     ╚════██║
██║ ╚████║██║     ██║ ╚═╝ ██║    ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║██║╚██████╗███████║
╚═╝  ╚═══╝╚═╝     ╚═╝     ╚═╝    ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝
                                                                                          
`}
              </pre>
              <div className="mt-4 flex flex-col items-center space-y-2">
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">$</span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    initializing system... [{bootProgress}%]
                  </motion.span>
                </div>
                <div className="w-48 h-2 bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-muted-foreground"
                    initial={{ width: 0 }}
                    animate={{ width: `${bootProgress}%` }}
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">$</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: bootProgress > 30 ? 1 : 0 }}
                    className="text-muted-foreground"
                  >
                    found "{metrics.count} package.json in this system"
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 px-4 md:px-0"
          >
            <div>
              <div className="font-mono text-sm h-[45vh] md:h-[60vh] overflow-y-auto custom-scrollbar">
                <AsciiBarChart packageData={processedPackageData} />
              </div>
            </div>

            <pre className="mt-6 text-xs font-mono text-muted-foreground/80">
              {`System Analysis Complete
Total Files Analyzed: ${metrics.count}
Total Unique Packages: ${Object.keys(metrics.packages).length}
Most Used: ${processedPackageData[0].name} (${
                processedPackageData[0].downloads
              } uses)`}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}
