"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, NutritionBadge, FactCheckBadge, HealthStatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Heart, Star, Share2, BookOpen, Info, TrendingUp } from "lucide-react"

// Base InfoCard types
export interface BaseInfoCardProps {
  title: string
  description?: string
  className?: string
  variant?: 'default' | 'nutrition' | 'myth' | 'health' | 'warning' | 'error'
  size?: 'default' | 'sm' | 'lg' | 'compact'
  onFavorite?: () => void
  onShare?: () => void
  isFavorited?: boolean
  isLoading?: boolean
}

// Nutrition-specific props
export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
  servingSize?: string
  healthScore?: number
}

export interface NutritionCardProps extends BaseInfoCardProps {
  type: 'nutrition'
  nutritionInfo: NutritionInfo
  foodName: string
  imageUrl?: string
  tips?: string[]
}

// Myth-busting props
export interface MythInfo {
  factCheck: 'true' | 'false' | 'partial' | 'unverified'
  evidence?: string
  sources?: string[]
  lastUpdated?: Date
  category?: string
}

export interface MythCardProps extends BaseInfoCardProps {
  type: 'myth'
  mythInfo: MythInfo
  question: string
  answer: string
  imageUrl?: string
}

// Recipe props
export interface RecipeInfo {
  cookTime: string
  prepTime: string
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: string[]
  instructions: string[]
  nutritionInfo: NutritionInfo
}

export interface RecipeCardProps extends BaseInfoCardProps {
  type: 'recipe'
  recipeInfo: RecipeInfo
  imageUrl?: string
  tags?: string[]
}

// Union type for all card props
export type InfoCardProps = NutritionCardProps | MythCardProps | RecipeCardProps

// Main InfoCard component
export function InfoCard(props: InfoCardProps) {
  const { title, description, className, variant = 'default', size = 'default', onFavorite, onShare, isFavorited, isLoading } = props

  if (isLoading) {
    return <InfoCardSkeleton />
  }

  const cardVariant = props.type === 'nutrition' ? 'nutrition' : 
                     props.type === 'myth' ? 'myth' : 
                     variant

  return (
    <Card variant={cardVariant} className={cn("group hover:shadow-lg transition-all duration-200", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1 line-clamp-2">{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            {onFavorite && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onFavorite}
                className="h-8 w-8"
              >
                <Heart className={cn("h-4 w-4", isFavorited && "fill-red-500 text-red-500")} />
              </Button>
            )}
            {onShare && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onShare}
                className="h-8 w-8"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {props.type === 'nutrition' && <NutritionCardContent {...props} />}
        {props.type === 'myth' && <MythCardContent {...props} />}
        {props.type === 'recipe' && <RecipeCardContent {...props} />}
      </CardContent>
    </Card>
  )
}

// Nutrition card content
function NutritionCardContent({ nutritionInfo, foodName, imageUrl, tips }: NutritionCardProps) {
  const { calories, protein, carbs, fat, fiber, sugar, sodium, servingSize, healthScore } = nutritionInfo

  return (
    <div className="space-y-4">
      {imageUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={foodName}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{calories} cal</p>
          {servingSize && <p className="text-sm text-muted-foreground">per {servingSize}</p>}
        </div>
        {healthScore && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-healthy-green" />
            <span className="text-sm font-medium">{healthScore}/100</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <NutritionBadge type="protein" value={protein} />
        <NutritionBadge type="carbs" value={carbs} />
        <NutritionBadge type="fat" value={fat} />
      </div>

      {(fiber || sugar || sodium) && (
        <div className="flex flex-wrap gap-2">
          {fiber && <NutritionBadge type="fiber" value={fiber} />}
          {sugar && <NutritionBadge type="sugar" value={sugar} />}
          {sodium && <NutritionBadge type="sodium" value={sodium} unit="mg" />}
        </div>
      )}

      {tips && tips.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4" />
            Health Tips
          </h4>
          <ul className="text-sm space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Myth card content
function MythCardContent({ mythInfo, question, answer, imageUrl }: MythCardProps) {
  const { factCheck, evidence, sources, lastUpdated, category } = mythInfo

  return (
    <div className="space-y-4">
      {imageUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Myth illustration"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FactCheckBadge status={factCheck} />
          {category && <Badge variant="outline">{category}</Badge>}
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Question:</h4>
          <p className="text-sm">{question}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Answer:</h4>
          <p className="text-sm leading-relaxed">{answer}</p>
        </div>

        {evidence && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Evidence:</h4>
            <p className="text-sm text-muted-foreground">{evidence}</p>
          </div>
        )}

        {sources && sources.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Sources
            </h4>
            <ul className="text-xs space-y-1">
              {sources.map((source, index) => (
                <li key={index} className="text-muted-foreground">
                  {index + 1}. {source}
                </li>
              ))}
            </ul>
          </div>
        )}

        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}

// Recipe card content
function RecipeCardContent({ recipeInfo, imageUrl, tags }: RecipeCardProps) {
  const { cookTime, prepTime, servings, difficulty, ingredients, instructions, nutritionInfo } = recipeInfo

  return (
    <div className="space-y-4">
      {imageUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Recipe"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Prep:</span> {prepTime}
        </div>
        <div>
          <span className="font-medium">Cook:</span> {cookTime}
        </div>
        <div>
          <span className="font-medium">Serves:</span> {servings}
        </div>
        <div>
          <span className="font-medium">Difficulty:</span>
          <Badge variant={difficulty === 'easy' ? 'healthy' : difficulty === 'medium' ? 'warning' : 'error'} size="sm" className="ml-2">
            {difficulty}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <NutritionBadge type="protein" value={nutritionInfo.protein} />
        <NutritionBadge type="carbs" value={nutritionInfo.carbs} />
        <NutritionBadge type="fat" value={nutritionInfo.fat} />
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" size="sm">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// Loading skeleton
function InfoCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-6 bg-muted rounded-full" />
          <div className="h-6 bg-muted rounded-full" />
          <div className="h-6 bg-muted rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
      </CardContent>
    </Card>
  )
}

export { InfoCardSkeleton }