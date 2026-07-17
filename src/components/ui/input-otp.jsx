import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

/** @type {React.ForwardRefRenderFunction<any, { className?: string, containerClassName?: string, children?: React.ReactNode, maxLength?: number } & Record<string, any>>} */
const InputOTPBase = ({ className, containerClassName, children, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    maxLength={props.maxLength ?? 6}
    {...props}>
    {children ?? null}
  </OTPInput>
)
const InputOTP = React.forwardRef(InputOTPBase)
InputOTP.displayName = "InputOTP"

/** @type {React.ForwardRefRenderFunction<any, { className?: string } & Record<string, any>>} */
const InputOTPGroupBase = ({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
)
const InputOTPGroup = React.forwardRef(InputOTPGroupBase)
InputOTPGroup.displayName = "InputOTPGroup"

/** @type {React.ForwardRefRenderFunction<any, { index?: number, className?: string } & Record<string, any>>} */
const InputOTPSlotBase = ({ index = 0, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    (<div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...props}>
      {char}
      {hasFakeCaret && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>)
  );
}
const InputOTPSlot = React.forwardRef(InputOTPSlotBase)
InputOTPSlot.displayName = "InputOTPSlot"

/** @type {React.ForwardRefRenderFunction<any, Record<string, any>>} */
const InputOTPSeparatorBase = ({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
)
const InputOTPSeparator = React.forwardRef(InputOTPSeparatorBase)
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
