import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive"
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", variant = "default", ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
          variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
          variant === "outline" && "border border-blue-600 text-blue-600 hover:bg-blue-50",
          variant === "ghost" && "text-blue-600 hover:bg-blue-50",
          variant === "destructive" && "text-red-600 hover:bg-red-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }