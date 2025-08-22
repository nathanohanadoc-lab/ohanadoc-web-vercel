import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-white p-6 shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const SrOnly = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
)

export { Card, SrOnly }