// components/common/loading-spinner.tsx

import { cn } from '@/lib/utils';
import { Loader2, Heart, Utensils, Search, BookOpen } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'nutrition' | 'search' | 'myth' | 'heart';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const LoadingSpinner = ({
  size = 'md',
  variant = 'default',
  className,
  text,
  fullScreen = false
}: LoadingSpinnerProps) => {
  const getIcon = () => {
    switch (variant) {
      case 'nutrition':
        return <Utensils className={cn(sizeClasses[size], 'animate-pulse')} />;
      case 'search':
        return <Search className={cn(sizeClasses[size], 'animate-pulse')} />;
      case 'myth':
        return <BookOpen className={cn(sizeClasses[size], 'animate-pulse')} />;
      case 'heart':
        return <Heart className={cn(sizeClasses[size], 'animate-pulse text-red-500')} />;
      default:
        return <Loader2 className={cn(sizeClasses[size], 'animate-spin')} />;
    }
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-2',
      fullScreen && 'min-h-screen',
      className
    )}>
      <div className="text-primary">
        {getIcon()}
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

// Specific loading states for different contexts
export const NutritionLoader = ({ text = "Analyzing nutrition facts..." }: { text?: string }) => (
  <LoadingSpinner variant="nutrition" size="lg" text={text} />
);

export const SearchLoader = ({ text = "Searching..." }: { text?: string }) => (
  <LoadingSpinner variant="search" size="md" text={text} />
);

export const MythLoader = ({ text = "Fact-checking myth..." }: { text?: string }) => (
  <LoadingSpinner variant="myth" size="lg" text={text} />
);

export const PageLoader = ({ text = "Loading page..." }: { text?: string }) => (
  <LoadingSpinner size="xl" text={text} fullScreen />
);

export const InlineLoader = ({ text }: { text?: string }) => (
  <LoadingSpinner size="sm" text={text} />
);

export default LoadingSpinner;