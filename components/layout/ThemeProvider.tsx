"use client";

// ThemeProvider is no longer needed — theme is handled via inline script in layout.tsx
// This file is kept as a pass-through for compatibility
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
