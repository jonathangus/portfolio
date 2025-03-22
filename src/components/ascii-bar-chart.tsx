interface Package {
  name: string;
  downloads: number;
}

interface AsciiBarChartProps {
  packageData: Package[];
}

export default function AsciiBarChart({ packageData }: AsciiBarChartProps) {
  const maxDownloads = Math.max(...packageData.map((pkg) => pkg.downloads));
  const maxBarLength = 50;

  const getBarLength = (downloads: number) => {
    return Math.round((downloads / maxDownloads) * maxBarLength);
  };

  return (
    <div className="text-muted-foreground font-mono">
      <pre className="mb-4 text-[8px] xs:text-xs sm:text-sm md:text-base overflow-x-auto">
        {`
╔══════════════════════════════════════════════════════════════════════════════════╗
║                            PACKAGE USAGE ANALYSIS                                 ║
╚══════════════════════════════════════════════════════════════════════════════════╝
`}
      </pre>
      {packageData.map((pkg, index) => {
        const barLength = getBarLength(pkg.downloads);
        const bar =
          '█'.repeat(barLength) + '░'.repeat(maxBarLength - barLength);
        return (
          <div key={pkg.name} className="mb-2">
            <div className="flex items-start">
              <span className="inline-block w-32 sm:w-48 md:w-64 text-right truncate mr-2">
                {pkg.name}
              </span>
              <span className="mr-2">│</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <span className="text-muted-foreground overflow-hidden">
                    {bar}
                  </span>
                  <span className="ml-2 text-muted-foreground/80 whitespace-nowrap">
                    {pkg.downloads}
                  </span>
                </div>
                {index < packageData.length - 1 && (
                  <div className="text-muted overflow-hidden">
                    {'┄'.repeat(maxBarLength + 10)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
