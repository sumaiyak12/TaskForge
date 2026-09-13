import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "gradient" | "destructive" | "emerald";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const variants = {
      default: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]",
      secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 active:scale-[0.98]",
      outline: "border border-slate-700 bg-transparent hover:bg-slate-800/60 text-slate-200 active:scale-[0.98]",
      ghost: "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white",
      gradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-lg shadow-blue-500/25 active:scale-[0.98]",
      emerald: "bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/20 active:scale-[0.98]",
      destructive: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs rounded-lg",
      md: "h-11 px-5 text-sm rounded-xl",
      lg: "h-13 px-7 text-base rounded-xl font-semibold",
      icon: "h-10 w-10 p-0 rounded-xl justify-center items-center flex",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
