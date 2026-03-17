import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="error-boundary">
        <div className="error-boundary-card">
          <div className="error-boundary-icon">🌿</div>
          <h2>เกิดข้อผิดพลาดบางอย่าง</h2>
          <p>Something went wrong. Please refresh the page.</p>
          {this.state.error && (
            <details>
              <summary style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Error details
              </summary>
              <pre style={{ fontSize: "0.78rem", color: "#ef4444", whiteSpace: "pre-wrap", wordBreak: "break-all", marginTop: 8, maxHeight: 200, overflowY: "auto" }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button
            className="btn-primary"
            style={{ marginTop: 20, padding: "12px 32px", borderRadius: 12 }}
            onClick={() => window.location.reload()}
          >
            รีเฟรชหน้า / Refresh
          </button>
        </div>
      </div>
    );
  }
}
