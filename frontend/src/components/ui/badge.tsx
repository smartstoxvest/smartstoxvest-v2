// components/ui/badge.tsx
import React from "react";

export const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
    {children}
  </span>
);
