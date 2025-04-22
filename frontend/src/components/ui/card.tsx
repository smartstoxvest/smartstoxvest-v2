import * as React from "react";
import { cn } from "@/lib/utils"; // Optional helper

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border bg-white p-6 shadow", className)}
    {...props}
  />
));
Card.displayName = "Card";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("pt-4", className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = "CardContent";
