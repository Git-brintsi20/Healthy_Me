// components/common/error-boundary.tsx

'use client';

import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  MessageCircle, 
  Bug, 
  Shield,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  showDetails: boolean;
  copied: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'component' | 'critical';
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  maxRetries?: number;
  showReportButton?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error info:', errorInfo);
    }

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to analytics/monitoring service
    this.logErrorToService(error, errorInfo);
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In a real app, send to error tracking service like Sentry
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        timestamp: new Date().toISOString(),
        level: this.props.level || 'component',
      };

      // For demo purposes, log to console
      console.error('Error logged to service:', errorData);
      
      // TODO: Replace with actual error tracking service
      // Example: Sentry.captureException(error, { extra: errorData });
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      return;
    }

    this.setState(prevState => ({
      retryCount: prevState.retryCount + 1,
    }));

    // Add delay before retry to prevent rapid retries
    const timeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        showDetails: false,
        copied: false,
      });
    }, 1000);

    this.retryTimeouts.push(timeout);
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  private handleReport = () => {
    const { error, errorInfo, errorId } = this.state;
    
    if (typeof window !== 'undefined') {
      const subject = encodeURIComponent(`Error Report - ${errorId}`);
      const body = encodeURIComponent(
        `Error ID: ${errorId}\n\n` +
        `Error: ${error?.message || 'Unknown error'}\n\n` +
        `Stack Trace:\n${error?.stack || 'Not available'}\n\n` +
        `Component Stack:\n${errorInfo?.componentStack || 'Not available'}\n\n` +
        `URL: ${window.location.href}\n` +
        `User Agent: ${navigator.userAgent}\n` +
        `Timestamp: ${new Date().toISOString()}`
      );
      
      window.open(`mailto:support@healthyme.com?subject=${subject}&body=${body}`);
    }
  };

  private handleCopyError = async () => {
    const { error, errorInfo, errorId } = this.state;
    
    const errorText = `Error ID: ${errorId}\n` +
      `Error: ${error?.message || 'Unknown error'}\n` +
      `Stack: ${error?.stack || 'Not available'}`;

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copied: true });
      
      setTimeout(() => {
        this.setState({ copied: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy error to clipboard:', err);
    }
  };

  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    const { hasError, error, errorInfo, errorId, retryCount, showDetails, copied } = this.state;
    const { 
      children, 
      fallback, 
      level = 'component', 
      enableRetry = true, 
      maxRetries = 3,
      showReportButton = true 
    } = this.props;

    if (hasError) {
      // Return custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Determine severity and styling based on level
      const isCritical = level === 'critical';
      const isPage = level === 'page';

      return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${isPage ? 'bg-background' : ''}`}>
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-full ${isCritical ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {isCritical ? <Shield className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold">
                {isPage ? 'Page Error' : 'Something went wrong'}
              </CardTitle>
              
              <CardDescription className="mt-2">
                {isPage 
                  ? 'The page encountered an error and could not be displayed.'
                  : 'A component error occurred. You can try refreshing or go back to the home page.'
                }
              </CardDescription>

              <div className="flex items-center justify-center gap-2 mt-4">
                <Badge variant="outline" className="text-xs">
                  Error ID: {errorId}
                </Badge>
                {retryCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Retry #{retryCount}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error message */}
              <Alert>
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  {error?.message || 'An unexpected error occurred'}
                </AlertDescription>
              </Alert>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {enableRetry && retryCount < maxRetries && (
                  <Button 
                    onClick={this.handleRetry}
                    className="flex items-center gap-2"
                    disabled={retryCount >= maxRetries}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again {retryCount > 0 && `(${maxRetries - retryCount} left)`}
                  </Button>
                )}
                
                <Button variant="outline" onClick={this.handleGoHome} className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
                
                {showReportButton && (
                  <Button variant="outline" onClick={this.handleReport} className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Report Issue
                  </Button>
                )}
              </div>

              {/* Error details toggle */}
              {process.env.NODE_ENV === 'development' && (
                <div className="border-t pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={this.toggleDetails}
                    className="w-full justify-between"
                  >
                    <span>Error Details</span>
                    {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  
                  {showDetails && (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={this.handleCopyError}
                          className="flex items-center gap-2"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied!' : 'Copy Error'}
                        </Button>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Error Stack:</h4>
                        <pre className="text-xs overflow-x-auto text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {error?.stack || 'Stack trace not available'}
                        </pre>
                      </div>
                      
                      {errorInfo?.componentStack && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Component Stack:</h4>
                          <pre className="text-xs overflow-x-auto text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for programmatic error reporting
export function useErrorHandler() {
  const reportError = (error: Error, context?: string) => {
    // Create a synthetic error boundary state
    const errorInfo: ErrorInfo = {
      componentStack: context || 'Manual error report',
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Manual error report:', error, errorInfo);
    }

    // TODO: Send to error tracking service
    console.error('Error reported:', { error, context });
  };

  return { reportError };
}

export default ErrorBoundary;