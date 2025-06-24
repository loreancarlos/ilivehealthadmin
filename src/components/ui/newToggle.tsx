import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <label className="flex items-center justify-between cursor-pointer gap-1">
        <div className="relative inline-block w-12 h-6">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={onChange}
          />
          <div
            className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              checked ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-500"
            }`}
          />

          <div
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
              checked ? "transform translate-x-6" : "transform translate-x-0"
            }`}
          />
        </div>
      </label>
    </div>
  );
};

export { Toggle };
