import * as React from "react"

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={`relative overflow-auto ${className || ""}`} {...props}>
      {children}
    </div>
  )
})
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
