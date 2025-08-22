import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          'border-transparent bg-blue-100 text-blue-900': variant === 'default',
          'border-transparent bg-gray-100 text-gray-900': variant === 'secondary',
          'border-transparent bg-red-100 text-red-900': variant === 'destructive',
          'text-gray-900': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }