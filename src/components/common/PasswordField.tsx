import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type * as React from "react";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import { cn } from "@/lib/utils";

type PasswordFieldProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
  autoComplete?: string;
  rightAdornment?: React.ReactNode;
};

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  className,
  style,
  labelClassName,
  labelStyle,
  inputClassName,
  inputStyle,
  autoComplete,
  rightAdornment,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={cn("space-y-2", className)} style={style}>
      {label ? (
        <Label htmlFor={id} className={labelClassName} style={labelStyle}>
          {label}
        </Label>
      ) : null}
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn("pr-12", inputClassName)}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-stone-500 hover:text-stone-700"
          aria-label={isVisible ? "Hide password" : "Show password"}
          disabled={disabled}
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        {rightAdornment}
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
