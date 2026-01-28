import React from "react";

// PUBLIC_INTERFACE
export default function Header() {
  /** App header with title. */
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__titleBlock">
          <h1 className="app-title">To‑Do</h1>
          <p className="app-subtitle">Keep track of what matters—one task at a time.</p>
        </div>
      </div>
    </header>
  );
}
