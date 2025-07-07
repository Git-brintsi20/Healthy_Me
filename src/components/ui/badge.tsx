import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Health-specific variants
        healthy: "border-transparent bg-healthy-green text-white hover:bg-healthy-green/80",
        warning: "border-transparent bg-healthy-orange text-white hover:bg-healthy-orange/80",
        error: "border-transparent bg-healthy-red text-white hover:bg-healthy-red/80",
        // Nutrition-specific variants
        protein: "border-transparent bg-nutrition-protein text-white hover:bg-nutrition-protein/80",
        carbs: "border-transparent bg-nutrition-carbs text-white hover:bg-nutrition-carbs/80",
        fat: "border-transparent bg-nutrition-fat text-white hover:bg-nutrition-fat/80",
        fiber: "border-transparent bg-nutrition-fiber text-white hover:bg-nutrition-fiber/80",
        sugar: "border-transparent bg-nutrition-sugar text-white hover:bg-nutrition-sugar/80",
        sodium: "border-transparent bg-nutrition-sodium text-white hover:bg-nutrition-sodium/80",
        // Myth-busting variants
        true: "border-transparent bg-healthy-green text-white hover:bg-healthy-green/80",
        false: "border-transparent bg-healthy-red text-white hover:bg-healthy-red/80",
        partial: "border-transparent bg-healthy-orange text-white hover:bg-healthy-orange/80",
        unverified: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

// Specialized badge components for nutrition facts
interface NutritionBadgeProps extends Omit<BadgeProps, 'variant'> {
  type: 'protein' | 'carbs' | 'fat' | 'fiber' | 'sugar' | 'sodium'
  value: string | number
  unit?: string
}

function NutritionBadge({ type, value, unit = 'g', className, ...props }: NutritionBadgeProps) {
  return (
    <Badge
      variant={type}
      className={cn("font-mono", className)}
      {...props}
    >
      {value}{unit}
    </Badge>
  )
}

// Specialized badge for fact-checking
interface FactCheckBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'true' | 'false' | 'partial' | 'unverified'
}

function FactCheckBadge({ status, className, ...props }: FactCheckBadgeProps) {
  const statusLabels = {
    true: 'Verified ✓',
    false: 'False ✗',
    partial: 'Partially True ⚠',
    unverified: 'Unverified ?'
  }

  return (
    <Badge
      variant={status}
      className={cn("font-medium", className)}
      {...props}
    >
      {statusLabels[status]}
    </Badge>
  )
}

// Health status badge
interface HealthStatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'healthy' | 'warning' | 'error'
  label?: string
}

function HealthStatusBadge({ status, label, className, ...props }: HealthStatusBadgeProps) {
  const defaultLabels = {
    healthy: 'Healthy',
    warning: 'Moderate',
    error: 'High Risk'
  }

  return (
    <Badge
      variant={status}
      className={cn("font-medium", className)}
      {...props}
    >
      {label || defaultLabels[status]}
    </Badge>
  )
}

export { Badge, NutritionBadge, FactCheckBadge, HealthStatusBadge, badgeVariants }