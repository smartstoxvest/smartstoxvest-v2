import * as React from "react";
import { cn } from "@/lib/utils"; // if you're using class merging

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2",
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
