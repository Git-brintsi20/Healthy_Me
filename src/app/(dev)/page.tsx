"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeSwitcher } from '@/components/common/theme-switcher'  
import { designTokens } from '@/lib/design-tokens'
import '@/styles/globals.css' // Ensure global styles are imported

export function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            HealthyME Design System
          </h1>
          <p className="text-muted-foreground">
            Comprehensive design tokens and components for the nutrition app
          </p>
        </div>
        <ThemeSwitcher />
      </div>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Colors */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Primary Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-primary rounded-lg shadow-md"></div>
                <span className="text-sm">Primary</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-secondary rounded-lg shadow-md"></div>
                <span className="text-sm">Secondary</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-accent rounded-lg shadow-md"></div>
                <span className="text-sm">Accent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-muted rounded-lg shadow-md"></div>
                <span className="text-sm">Muted</span>
              </div>
            </div>
          </div>

          {/* Health Colors */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Health Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-healthy-green rounded-lg shadow-md"></div>
                <span className="text-sm">Green</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-healthy-orange rounded-lg shadow-md"></div>
                <span className="text-sm">Orange</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-healthy-blue rounded-lg shadow-md"></div>
                <span className="text-sm">Blue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-healthy-red rounded-lg shadow-md"></div>
                <span className="text-sm">Red</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-healthy-yellow rounded-lg shadow-md"></div>
                <span className="text-sm">Yellow</span>
              </div>
            </div>
          </div>

          {/* Nutrition Colors */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Nutrition Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-nutrition-protein rounded-lg shadow-md"></div>
                <span className="text-sm">Protein</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-nutrition-carbs rounded-lg shadow-md"></div>
                <span className="text-sm">Carbs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-nutrition-fat rounded-lg shadow-md"></div>
                <span className="text-sm">Fat</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-nutrition-fiber rounded-lg shadow-md"></div>
                <span className="text-sm">Fiber</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-nutrition-sugar rounded-lg shadow-md"></div>
                <span className="text-sm">Sugar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-nutrition-sodium rounded-lg shadow-md"></div>
                <span className="text-sm">Sodium</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography Scale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-6xl font-bold text-foreground">Heading 1</div>
          <div className="text-5xl font-bold text-foreground">Heading 2</div>
          <div className="text-4xl font-bold text-foreground">Heading 3</div>
          <div className="text-3xl font-semibold text-foreground">Heading 4</div>
          <div className="text-2xl font-semibold text-foreground">Heading 5</div>
          <div className="text-xl font-medium text-foreground">Heading 6</div>
          <div className="text-lg text-foreground">Large Text</div>
          <div className="text-base text-foreground">Body Text</div>
          <div className="text-sm text-muted-foreground">Small Text</div>
          <div className="text-xs text-muted-foreground">Extra Small Text</div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Badge className="fact-check-true">True</Badge>
            <Badge className="fact-check-false">False</Badge>
            <Badge className="fact-check-partial">Partial</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Card Examples</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="nutrition-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Protein</span>
              <div className="w-4 h-4 bg-nutrition-protein rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">25g</div>
            <div className="text-sm text-muted-foreground">per serving</div>
          </div>
          
          <div className="nutrition-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Carbs</span>
              <div className="w-4 h-4 bg-nutrition-carbs rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">45g</div>
            <div className="text-sm text-muted-foreground">per serving</div>
          </div>
          
          <div className="nutrition-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Fat</span>
              <div className="w-4 h-4 bg-nutrition-fat rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">12g</div>
            <div className="text-sm text-muted-foreground">per serving</div>
          </div>
        </CardContent>
      </Card>

      {/* Gradients */}
      <Card>
        <CardHeader>
          <CardTitle>Gradient Backgrounds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="healthy-gradient h-24 rounded-lg flex items-center justify-center text-white font-semibold">
              Healthy Gradient
            </div>
            <div className="myth-gradient h-24 rounded-lg flex items-center justify-center text-white font-semibold">
              Myth Gradient
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animations */}
      <Card>
        <CardHeader>
          <CardTitle>Animations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg animate-fade-in">
              <span className="text-sm font-medium">Fade In</span>
            </div>
            <div className="bg-secondary/10 p-4 rounded-lg animate-slide-in">
              <span className="text-sm font-medium">Slide In</span>
            </div>
            <div className="bg-accent/10 p-4 rounded-lg animate-bounce-subtle">
              <span className="text-sm font-medium">Bounce Subtle</span>
            </div>
            <div className="bg-muted/10 p-4 rounded-lg">
              <div className="shimmer h-4 rounded"></div>
              <span className="text-sm font-medium">Shimmer</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacing */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 6, 8, 12, 16, 20, 24].map((space) => (
              <div key={space} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-muted-foreground">
                  {space * 4}px
                </div>
                <div 
                  className="bg-primary/20 h-4 rounded"
                  style={{ width: `${space * 4}px` }}
                ></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shadows */}
      <Card>
        <CardHeader>
          <CardTitle>Shadow Utilities</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg shadow-healthy border">
            <span className="text-sm font-medium">Healthy Shadow</span>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-nutrition border">
            <span className="text-sm font-medium">Nutrition Shadow</span>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-myth border">
            <span className="text-sm font-medium">Myth Shadow</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}