/// <reference types="vite/client" />

// Declare spline-viewer web component
declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': {
      url: string;
      style?: React.CSSProperties;
      className?: string;
    };
  }
}
