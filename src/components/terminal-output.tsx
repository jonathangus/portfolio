import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Package {
  name: string;
  downloads: number;
  color: string;
}

interface TerminalOutputProps {
  packageData: Package[];
}

export default function TerminalOutput({ packageData }: TerminalOutputProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const initialLines = [
      'root@npm-analyzer:~$ npm stats --analyze-dependencies',
      'Analyzing package dependencies...',
      '----------------------------------------',
      'DEPENDENCY ANALYSIS REPORT',
      '----------------------------------------',
      ...packageData.map(
        (pkg, index) =>
          `[${String(index + 1).padStart(3, '0')}] ${pkg.name.padEnd(
            30
          )} | Uses: ${pkg.downloads}`
      ),
      '----------------------------------------',
      'Analysis complete.',
      `Total unique packages: ${packageData.length}`,
      `Most frequently used: ${packageData[0].name} (${packageData[0].downloads} uses)`,
      'root@npm-analyzer:~$ _',
    ];

    setLines(initialLines);

    const interval = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev >= initialLines.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [packageData]);

  return (
    <div className="font-mono text-sm">
      <AnimatePresence>
        {lines.slice(0, currentLine + 1).map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={
              line.startsWith('root@')
                ? 'text-muted-foreground'
                : line.includes('ANALYSIS REPORT')
                ? 'text-foreground font-bold'
                : line.startsWith('[')
                ? 'text-muted-foreground'
                : 'text-muted-foreground/80'
            }
          >
            {line}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
