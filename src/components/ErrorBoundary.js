import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#f5f3ef',
          fontFamily: 'Jost, sans-serif',
          padding: '2rem'
        }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#c9a96e', marginBottom: '1rem' }}>
            Something Went Wrong
          </h1>
          <p style={{ marginBottom: '2rem', opacity: 0.7 }}>We're sorry — an unexpected error occurred.</p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 32px',
              background: '#c9a96e',
              color: '#0a0a0a',
              border: 'none',
              fontFamily: 'Jost, sans-serif',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              letterSpacing: '0.05em'
            }}
          >
            Return Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
