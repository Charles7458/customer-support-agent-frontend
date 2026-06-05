import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  // children is a standard ReactNode representing wrapped components
  children: ReactNode;
  // optional custom fallback UI to display when an error occurs
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Strongly typed state initialization
    this.state = { hasError: false };
  }

  // Updates state so the next render shows the fallback UI
  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // Used for side-effects like logging error information to a service
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, info);
    // Example: logToService(error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI if an error was caught
      return this.props.fallback || <h2>Something went wrong.</h2>;
    }

    // Otherwise, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;