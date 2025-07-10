"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  Search, 
  ArrowLeft, 
  BookOpen, 
  Heart, 
  HelpCircle,
  TrendingUp,
  Zap
} from "lucide-react"

const suggestedPages = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Your nutrition overview and daily insights",
    color: "bg-blue-500/10 text-blue-600 border-blue-200"
  },
  {
    title: "Nutrition Search",
    href: "/dashboard/search",
    icon: Search,
    description: "Find detailed nutrition facts for any food",
    color: "bg-green-500/10 text-green-600 border-green-200"
  },
  {
    title: "Myth Busting",
    href: "/dashboard/myths",
    icon: HelpCircle,
    description: "Get the truth about nutrition claims",
    color: "bg-purple-500/10 text-purple-600 border-purple-200"
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
    description: "Your saved nutrition facts and recipes",
    color: "bg-red-500/10 text-red-600 border-red-200"
  }
]

const quickActions = [
  {
    title: "AI Analysis",
    href: "/dashboard/ai-analysis",
    icon: Zap,
    badge: "NEW"
  },
  {
    title: "Trending",
    href: "/dashboard/trending",
    icon: TrendingUp,
    badge: "HOT"
  },
  {
    title: "Learning Hub",
    href: "/dashboard/learning",
    icon: BookOpen,
    badge: null
  }
]

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-healthy-green/5 via-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-healthy-green/20 to-primary/20 rounded-full animate-pulse" />
            </div>
            <div className="relative flex items-center justify-center">
              <span className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-healthy-green to-primary animate-bounce">
                404
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Oops! Page Not Found
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            It looks like this page doesn't exist or has been moved. 
            Don't worry, we'll help you find what you're looking for!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-healthy-green hover:bg-healthy-green/90">
              <Link href="/dashboard">
                <Home className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/search">
                <Search className="h-5 w-5 mr-2" />
                Search Nutrition
              </Link>
            </Button>
          </div>
        </div>

        {/* Suggested Pages */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Popular Pages
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {suggestedPages.map((page, index) => {
              const Icon = page.icon
              return (
                <Link 
                  key={page.href}
                  href={page.href}
                  className="group block"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${page.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {page.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {page.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Quick Actions
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link 
                  key={action.href}
                  href={action.href}
                  className="group"
                  style={{
                    animationDelay: `${(index + 4) * 100}ms`
                  }}
                >
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                  >
                    <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{action.title}</span>
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-healthy-green/5 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                If you're looking for something specific or experiencing issues, 
                we're here to help you navigate HealthyME.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard/help">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Help Center
                  </Link>
                </Button>
                
                <Button asChild variant="outline">
                  <Link href="/dashboard/contact">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            © 2024 HealthyME. Making nutrition simple and accessible for everyone.
          </p>
        </div>
      </div>
    </div>
  )
}