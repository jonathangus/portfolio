"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/lib/utils"

interface PackageData {
  name: string
  downloads: number
  color: string
}

interface AsciiBarChartProps {
  packageData: PackageData[]
}

export default function AsciiBarChart({ packageData }: AsciiBarChartProps) {
  const [sortBy, setSortBy] = useState<"name" | "downloads">("downloads")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const toggleSort = (field: "name" | "downloads") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const sortedData = [...packageData].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else {
      return sortOrder === "asc" ? a.downloads - b.downloads : b.downloads - a.downloads
    }
  })

  const maxDownloads = Math.max(...packageData.map((pkg) => pkg.downloads))
  const chartWidth = 50 // Maximum number of characters for the bar

  const getAsciiBar = (downloads: number) => {
    const percentage = downloads / maxDownloads
    const barLength = Math.round(percentage * chartWidth)
    return "█".repeat(barLength)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <pre className="text-green-500 text-xs sm:text-sm inline-block text-left">
          {`
    _    ____   ____ ___ ___    ____ _   _    _    ____ _____ 
   / \\  / ___| / ___|_ _|_ _|  / ___| | | |  / \\  |  _ \\_   _|
  / _ \\ \\___ \\| |    | | | |  | |   | |_| | / _ \\ | |_) || |  
 / ___ \\ ___) | |___ | | | |  | |___|  _  |/ ___ \\|  _ < | |  
/_/   \\_\\____/ \\____|___|___|  \\____|_| |_/_/   \\_\\_| \\_\\|_|  
                                                              
`}
        </pre>
      </div>

      <div className="flex justify-between items-center mb-2 text-xs">
        <Button
          variant="ghost"
          size="sm"
          className="text-green-400 hover:text-green-300 hover:bg-transparent"
          onClick={() => toggleSort("name")}
        >
          Package Name
          {sortBy === "name" &&
            (sortOrder === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />)}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-400 hover:text-green-300 hover:bg-transparent"
          onClick={() => toggleSort("downloads")}
        >
          Downloads
          {sortBy === "downloads" &&
            (sortOrder === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />)}
        </Button>
      </div>

      <div className="space-y-3">
        {sortedData.map((pkg, index) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-1"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="w-24 truncate">{pkg.name}</span>
              <span className="text-green-400">{formatNumber(pkg.downloads)}</span>
            </div>
            <div className="font-mono text-xs whitespace-pre">
              <motion.span
                className="text-green-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              >
                {getAsciiBar(pkg.downloads)}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-xs text-center text-green-400">
        <p>Each █ represents approximately {formatNumber(maxDownloads / chartWidth)} downloads</p>
      </div>
    </div>
  )
}

