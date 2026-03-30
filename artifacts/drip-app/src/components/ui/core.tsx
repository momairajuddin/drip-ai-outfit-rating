import * as React from "react";
import { cn } from "@/lib/utils";

// Minimalist Editorial Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-foreground text-background hover:bg-background hover:text-foreground border-2 border-foreground",
      outline: "bg-transparent text-foreground border-2 border-border hover:border-foreground hover:bg-muted",
      ghost: "bg-transparent text-foreground hover:bg-muted border-2 border-transparent",
      gold: "bg-gold text-background hover:bg-background hover:text-gold border-2 border-gold",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-12 px-6 text-sm",
      lg: "h-14 px-8 text-base",
      icon: "h-12 w-12 flex items-center justify-center p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-none font-display uppercase tracking-[0.2em] font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? <span className="animate-spin mr-2">●</span> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// Editorial Card
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("bg-card border-2 border-border p-6", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full bg-background border-2 border-border px-4 py-2 font-body text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus:border-foreground disabled:cursor-not-allowed disabled:opacity-50 rounded-none",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("font-display uppercase tracking-[0.15em] text-xs font-bold mb-2 block text-muted-foreground", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

export const Badge = ({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "gold" | "outline" }) => {
  const variants = {
    default: "bg-foreground text-background",
    gold: "bg-gold text-background",
    outline: "bg-transparent border border-border text-foreground"
  };
  
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 text-xs font-display uppercase tracking-[0.1em] font-bold", variants[variant], className)}>
      {children}
    </span>
  );
};
