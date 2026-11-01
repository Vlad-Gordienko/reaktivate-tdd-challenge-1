import React from "react";
import { Spinner } from "./Spinner";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  color?: "primary" | "secondary";
}

const variantClasses: Record<NonNullable<ButtonProps["color"]>, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
  secondary: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300",
};

export const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  color = "primary",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        "inline-flex items-center justify-center px-4 py-2 rounded font-medium",
        "focus:outline-none focus:ring-2 transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[color],
      ].join(" ")}
    >
      {loading ? <Spinner className="w-4 h-4" /> : children}
    </button>
  );
};
