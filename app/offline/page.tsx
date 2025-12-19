"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              You&apos;re offline
            </CardTitle>
            <CardDescription className="mt-2">
              It looks like you&apos;ve lost your internet connection.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="text-sm font-medium">What you can do:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>Some cached pages may still be available</li>
            </ul>
          </div>
          <Button 
            onClick={handleRefresh} 
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
