import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  elevated?: boolean;
}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, glass = true, elevated = false, ...props }, ref) => {
  const baseClasses = glass 
    ? 'backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/20 shadow-xl' 
    : elevated 
    ? 'bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-2xl border border-gray-200 dark:border-slate-700' 
    : 'bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700';
    
  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        "rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
        className
      )}
      {...props}
    />
  );
})
Card.displayName = "Card"

const SrOnly = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
)

export { Card, SrOnly }