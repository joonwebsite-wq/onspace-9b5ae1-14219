import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('[ErrorBoundary] Catching error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Error caught:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      console.log('[ErrorBoundary] Rendering error UI');
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: '#4b5563', marginBottom: '16px' }}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details style={{ marginBottom: '16px' }}>
                <summary style={{ cursor: 'pointer', fontSize: '14px', color: '#6b7280' }}>Error details</summary>
                <pre style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                  padding: '8px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {this.state.error.toString()}
                  {this.state.error.stack && '\n\nStack:\n' + this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={() => {
                console.log('[ErrorBoundary] Refreshing page');
                window.location.reload();
              }}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    console.log('[ErrorBoundary] Rendering children');
    return this.props.children;
  }
}
