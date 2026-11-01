import React from "react";

export interface TabOption {
  label: string;
  value: string;
}

export interface TabsProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
}

export const Tabs = ({ options, value, onChange }: TabsProps) => {
  return (
    <div role="tablist" className="inline-flex border-b border-gray-200">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={[
              "px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-t",
              selected
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
