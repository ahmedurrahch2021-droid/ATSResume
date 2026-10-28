import React from 'react';

/** A failed route/chunk should not leave the entire application blank. */
export class PageErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div role="alert" className="container-page py-12 space-y-4"><h1 className="text-2xl">This page could not be opened.</h1><p className="text-muted">Try opening another page or reload this one. Saved browser drafts are not cleared by this message. Unsaved session-only changes may be lost on reload.</p><button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>Reload page</button></div>;
  }
}
