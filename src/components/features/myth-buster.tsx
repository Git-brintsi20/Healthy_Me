// src/components/features/myth-buster.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { designTokens } from '@/lib/design-tokens';
import { MythAnalysis, BaseComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface MythBusterProps extends BaseComponentProps {
  data: MythAnalysis;
  isLoading?: boolean;
  showSources?: boolean;
}

const MythBuster: React.FC<MythBusterProps> = ({
  data,
  isLoading = false,
  showSources = true,
  className,
}) => {
  if (isLoading) {
    return (
      <Card variant="myth" className={cn('animate-pulse', className)}>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getVerdictConfig = (verdict: MythAnalysis['verdict']) => {
    switch (verdict) {
      case 'fact':
        return {
          icon: CheckCircle,
          color: designTokens.colors.mythBusting.true,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          label: 'Fact',
          description: 'This claim is scientifically accurate',
        };
      case 'myth':
        return {
          icon: XCircle,
          color: designTokens.colors.mythBusting.false,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          label: 'Myth',
          description: 'This claim is false or misleading',
        };
      case 'partially_true':
        return {
          icon: AlertCircle,
          color: designTokens.colors.mythBusting.partial,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          label: 'Partially True',
          description: 'This claim has some truth but needs context',
        };
      default:
        return {
          icon: AlertCircle,
          color: designTokens.colors.status.info,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          label: 'Unknown',
          description: 'Unable to determine accuracy',
        };
    }
  };

  const verdictConfig = getVerdictConfig(data.verdict);
  const VerdictIcon = verdictConfig.icon;

  return (
    <Card variant="myth" className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-foreground leading-tight">
              {data.claim}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-2">
              Category: {data.category}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Badge 
              variant={data.confidence > 0.8 ? "default" : "secondary"}
              className="font-medium"
            >
              {Math.round(data.confidence * 100)}% confidence
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Verdict Badge */}
        <div className="flex items-center space-x-3">
          <div className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full',
            verdictConfig.bgColor
          )}>
            <VerdictIcon 
              className={cn('w-6 h-6', verdictConfig.textColor)}
              style={{ color: verdictConfig.color }}
            />
          </div>
          <div>
            <div className="font-semibold text-lg text-foreground">
              {verdictConfig.label}
            </div>
            <div className="text-sm text-muted-foreground">
              {verdictConfig.description}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Explanation</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed">{data.explanation}</p>
          </div>
        </div>

        {/* Scientific Evidence */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Scientific Evidence</h3>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-foreground leading-relaxed">
              {data.scientificEvidence}
            </p>
          </div>
        </div>

        {/* Sources */}
        {showSources && data.sources.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Sources</h3>
            <div className="space-y-2">
              {data.sources.map((source, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-muted/30 rounded-lg">
                  <ExternalLink className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm text-foreground">{source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verdict Summary */}
        <div className={cn(
          'rounded-lg p-4 border-l-4',
          verdictConfig.bgColor
        )}
        style={{ borderLeftColor: verdictConfig.color }}>
          <div className="flex items-center space-x-2">
            <VerdictIcon 
              className="w-5 h-5"
              style={{ color: verdictConfig.color }}
            />
            <span className="font-semibold text-foreground">
              Verdict: {verdictConfig.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {verdictConfig.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MythBuster;