"use client";

import React from "react";

interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

const SelectInput = ({
  label,
  variant = "primary",
  className = "",
  children,
  ...props
}: SelectInputProps) => {
  const baseStyle =
    "border rounded-full px-4 py-2 pr-10 outline-none text-sm transition w-full border-2 disabled:bg-gray-100 disabled:text-sab-gray-500 disabled:font-semibold disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70";

  const variants = {
    primary: "border-primary focus:ring-2 focus:ring-yellow-200",
    secondary: "border-sab-gray-300 focus:ring-2 focus:ring-gray-200",
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sab-gray-500 font-medium pb-2">
          {label}
          {props.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}

      <select
        className={`
          ${baseStyle}
          ${variants[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default SelectInput;