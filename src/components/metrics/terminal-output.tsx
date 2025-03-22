"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, ChevronDown, Package, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/lib/utils"

interface PackageData {
  name: string
  downloads: number
  color: string
}

interface TerminalOutputProps {
  packageData: PackageData[]
}

export default function TerminalOutput({ packageData }: TerminalOutputProps) {
  const [expandedPackages, setExpandedPackages] = useState<string[]>([])

  const togglePackage = (packageName: string) => {
    setExpandedPackages((prev) =>
      prev.includes(packageName) ? prev.filter((p) => p !== packageName) : [...prev, packageName],
    )
  }

  const totalDownloads = packageData.reduce((sum, pkg) => sum + pkg.downloads, 0)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">$</span>
          <span>npm stats --user --total</span>
        </div>
        <div className="ml-4 border-l border-green-500/50 pl-4">
          <div className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>
              Total Downloads: <span className="text-green-400">{formatNumber(totalDownloads)}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Package className="h-4 w-4" />
            <span>
              Packages: <span className="text-green-400">{packageData.length}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">$</span>
          <span>npm stats --list-packages --verbose</span>
        </div>
        <div className="ml-4 border-l border-green-500/50 pl-4 space-y-3">
          {packageData.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-green-400 hover:text-green-300 hover:bg-transparent"
                onClick={() => togglePackage(pkg.name)}
              >
                {expandedPackages.includes(pkg.name) ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                <Package className="h-4 w-4 mr-2" />
                <span className="font-mono">{pkg.name}</span>
              </Button>

              {expandedPackages.includes(pkg.name) && (
                <div className="ml-6 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Downloads:</span>
                    <span className="text-green-400">{formatNumber(pkg.downloads)}</span>
                  </div>
                  <div className="w-full bg-green-900/20 rounded-full h-2">
                    <motion.div
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(pkg.downloads / Math.max(...packageData.map((p) => p.downloads))) * 100}%`,
                      }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Color:</span>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: pkg.color }} />
                      <span>{pkg.color}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Percentage:</span>
                    <span className="text-green-400">{((pkg.downloads / totalDownloads) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="mt-2 p-2 bg-black/50 rounded border border-green-500/30 font-mono text-xs">
                    <code>{`import ${pkg.name} from "${pkg.name}";`}</code>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">$</span>
          <span className="typing-animation">_</span>
        </div>
      </div>
    </div>
  )
}

