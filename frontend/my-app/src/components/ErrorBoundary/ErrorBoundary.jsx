import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Safely log to the console for developers. 
    // This is safe because it is not exposed in the user-facing UI.
    console.error("ErrorBoundary caught a React rendering error:", error, errorInfo);
  }

  handleReload = () => {
    // Safely force a full application reload to recover from the broken state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h1 className="error-boundary__title">Something went wrong.</h1>
            <button 
              className="error-boundary__button" 
              onClick={this.handleReload}
            >
              Reload Portfolio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;