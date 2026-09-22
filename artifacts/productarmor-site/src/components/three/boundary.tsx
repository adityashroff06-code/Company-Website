import { Component, type ReactNode } from "react";

/**
 * Keeps a WebGL failure — or a 3D chunk that fails to download — from taking the page down:
 * renders the fallback instead. Deliberately free of three.js imports so page shells can use
 * it without pulling the 3D bundle into the main chunk.
 */
export class R3FErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
