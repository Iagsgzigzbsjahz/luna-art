import * as React from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-beige/15 bg-ink-soft px-4 py-3 text-sm text-beige placeholder:text-beige/35 transition-colors focus:border-gold/70 focus:outline-none disabled:opacity-50";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-2 block text-sm font-medium text-beige/85", className)} {...props} />;
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(field, className)} {...props} />,
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => <textarea ref={ref} className={cn(field, "min-h-28 resize-y leading-7", className)} {...props} />,
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(field, "appearance-none bg-no-repeat pe-10", className)} {...props}>
      {children}
    </select>
  ),
);
Select.displayName = "Select";
