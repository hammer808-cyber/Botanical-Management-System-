import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Firestore Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path || 'unknown path'}`;
            isFirestoreError = true;
          }
        }
      } catch (e) {
        // Not a JSON error message, use default
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-card p-8 text-center space-y-6 organic-border">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-error" size={40} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-headline font-bold text-on-surface">Something went wrong</h2>
              <p className="text-on-surface-variant font-body">
                {isFirestoreError ? "We encountered a database permission issue." : "The application encountered an unexpected error."}
              </p>
            </div>

            <div className="p-4 bg-surface-container-high rounded-xl text-left overflow-auto max-h-40">
              <code className="text-xs text-error font-mono break-words">
                {errorMessage}
              </code>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
            >
              <RefreshCcw size={20} />
              <span>Reload Application</span>
            </button>
            
            <p className="text-xs text-on-surface-variant italic">
              If this persists, please check your internet connection or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
