import React from "react";

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  id?: string;
  "data-testid"?: string;
}

export const Input = ({
  value,
  onChange,
  disabled = false,
  placeholder,
  type = "text",
  id,
  "data-testid": dataTestId,
}: InputProps) => {
  return (
    <input
      type={type}
      id={id}
      data-testid={dataTestId}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={[
        "block w-full px-3 py-2 rounded border text-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500",
        disabled
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white text-gray-900 border-gray-300",
      ].join(" ")}
    />
  );
};

export default Input;
