"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import type { MythData } from "@/types"

interface MythCardProps {
  data: MythData
  question: string
}

export function MythCard({ data, question }: MythCardProps) {
  const getVerdictColor = (verdict: MythData["verdict"]) => {
    switch (verdict) {
      case "TRUE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "FALSE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "PARTIALLY_TRUE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "INCONCLUSIVE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getVerdictLabel = (verdict: MythData["verdict"]) => {
    switch (verdict) {
      case "PARTIALLY_TRUE":
        return "Partially True"
      case "INCONCLUSIVE":
        return "Inconclusive"
      default:
        return verdict
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">{question}</CardTitle>
            <CardDescription className="mt-2">
              <Badge className={getVerdictColor(data.verdict)}>
                {getVerdictLabel(data.verdict)}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Explanation */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Explanation</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.explanation}
          </p>
        </div>

        {/* Key Points */}
        {data.keyPoints && data.keyPoints.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Key Points</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {data.keyPoints.map((point, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sources */}
        {data.sources && data.sources.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Sources</h4>
            <div className="space-y-2">
              {data.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm group"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {source.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {source.authors} • {source.publication} ({source.year})
                    </p>
                    {source.summary && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {source.summary}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {data.recommendation && (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
              Recommendation
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {data.recommendation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
