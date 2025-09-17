import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bug, Trash2, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { openRouterClient, OpenRouterErrorType } from '@/lib/openrouter';

/**
 * Debug panel component for troubleshooting OpenRouter API issues
 * Only shows in development mode
 */
export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (!(import.meta as any).env?.DEV) {
    return null;
  }

  const loadDebugInfo = () => {
    setDebugInfo(openRouterClient.getDebugInfo());
  };

  const clearLogs = () => {
    openRouterClient.clearDebugLogs();
    setDebugInfo(null);
  };

  const getErrorTypeColor = (errorType: OpenRouterErrorType) => {
    switch (errorType) {
      case OpenRouterErrorType.AUTH_ERROR:
        return 'destructive';
      case OpenRouterErrorType.RATE_LIMIT:
        return 'secondary';
      case OpenRouterErrorType.QUOTA_EXCEEDED:
        return 'destructive';
      case OpenRouterErrorType.JSON_PARSE_ERROR:
        return 'destructive';
      case OpenRouterErrorType.RESPONSE_VALIDATION_ERROR:
        return 'destructive';
      case OpenRouterErrorType.NETWORK_ERROR:
        return 'outline';
      case OpenRouterErrorType.TIMEOUT_ERROR:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getErrorIcon = (errorType: OpenRouterErrorType) => {
    switch (errorType) {
      case OpenRouterErrorType.AUTH_ERROR:
        return <XCircle className="h-4 w-4" />;
      case OpenRouterErrorType.RATE_LIMIT:
        return <Clock className="h-4 w-4" />;
      case OpenRouterErrorType.QUOTA_EXCEEDED:
        return <AlertTriangle className="h-4 w-4" />;
      case OpenRouterErrorType.NETWORK_ERROR:
      case OpenRouterErrorType.TIMEOUT_ERROR:
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsVisible(true);
            loadDebugInfo();
          }}
          className="bg-background shadow-lg"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug OpenRouter
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] overflow-hidden">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bug className="h-5 w-5" />
                OpenRouter Debug
              </CardTitle>
              <CardDescription>API call monitoring & troubleshooting</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
          {/* Controls */}
          <div className="flex gap-2">
            <Button size="sm" onClick={loadDebugInfo}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={clearLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Logs
            </Button>
          </div>

          {debugInfo && (
            <>
              {/* Configuration Status */}
              <div>
                <h4 className="font-semibold mb-2">Configuration</h4>
                <div className="flex items-center gap-2">
                  {debugInfo.apiKeyConfigured ? (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      API Key Configured
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      API Key Missing
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {debugInfo.environment}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Recent Successful Calls */}
              {debugInfo.successfulCalls && debugInfo.successfulCalls.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Recent Successful Calls ({debugInfo.successfulCalls.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {debugInfo.successfulCalls.slice(-5).reverse().map((call: any, index: number) => (
                      <div key={index} className="text-sm p-2 bg-green-50 rounded border border-green-200">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{call.context}</span>
                          <Badge variant="outline" className="text-xs">
                            {call.duration}ms
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Model: {call.model}
                          {call.usage && (
                            <span className="ml-2">
                              Tokens: {call.usage.total_tokens}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(call.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Errors */}
              {debugInfo.errors && debugInfo.errors.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Recent Errors ({debugInfo.errors.length})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {debugInfo.errors.slice(-5).reverse().map((error: any, index: number) => (
                        <div key={index} className="text-sm p-3 bg-red-50 rounded border border-red-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{error.context}</span>
                            <Badge
                              variant={getErrorTypeColor(error.errorType) as any}
                              className="text-xs flex items-center gap-1"
                            >
                              {getErrorIcon(error.errorType)}
                              {error.errorType}
                            </Badge>
                          </div>

                          <div className="text-xs text-red-700 mb-1">
                            {error.message}
                          </div>

                          {error.httpStatus && (
                            <div className="text-xs text-muted-foreground">
                              HTTP {error.httpStatus}
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-muted-foreground">
                              {new Date(error.timestamp).toLocaleTimeString()}
                            </div>
                            {error.shouldRetry && (
                              <Badge variant="outline" className="text-xs">
                                Retryable {error.retryAfter && `in ${error.retryAfter}s`}
                              </Badge>
                            )}
                          </div>

                          {error.details && (
                            <details className="mt-2">
                              <summary className="text-xs cursor-pointer text-muted-foreground">
                                View Details
                              </summary>
                              <pre className="text-xs mt-1 p-2 bg-red-100 rounded overflow-auto max-h-20">
                                {JSON.stringify(error.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* No data message */}
              {(!debugInfo.errors || debugInfo.errors.length === 0) &&
               (!debugInfo.successfulCalls || debugInfo.successfulCalls.length === 0) && (
                <div className="text-center text-muted-foreground py-4">
                  No API calls recorded yet. Use the AI features to see debug information here.
                </div>
              )}

              {/* Troubleshooting Tips */}
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Troubleshooting Tips</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Check browser console for full error details</p>
                  <p>• Rate limits: Wait before retrying</p>
                  <p>• Auth errors: Verify API key in .env</p>
                  <p>• Quota errors: Check OpenRouter balance</p>
                  <p>• JSON parse errors: Model may be returning invalid format</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}