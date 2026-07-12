"use client";

import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: "primary" | "secondary" | "auth";
}

const Input = ({
  label,
  variant = "primary",
  className = "",
  onChange,
  value,
  ...props
}: InputProps) => {
  const [inputValue, setInputValue] = useState("");

  const baseStyle =
    "border rounded-full px-4 py-2 outline-none text-sm transition w-full border-2 disabled:bg-gray-100 disabled:text-sab-gray-500 disabled:font-semibold disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:focus:ring-0";

  const variants = {
    primary: "border-primary focus:ring-2 focus:ring-yellow-200",

    secondary: "border-sab-gray-300 focus:ring-2 focus:ring-gray-200",

    auth: "border-primary bg-white",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (onChange) {
      onChange(e);
    }
  };

  const isFilled =
    typeof value === "string" ? value.length > 0 : inputValue.length > 0;

  return (
    <div className="w-full">
      {/* AUTH LABEL MUNCUL DI ATAS */}
      {variant === "auth" && isFilled && label && (
        <label className="block mb-2 text-sm font-medium">{label}</label>
      )}

      {/* DEFAULT LABEL */}
      {variant !== "auth" && label && (
        <label className="block text-sab-gray-500 font-medium pb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        className={`
    ${baseStyle}
    ${variants[variant]}
    ${className}
  `}
        onChange={handleChange}
        {...props}
        {...(props.type !== "file" ? { value: value ?? inputValue } : {})}
      />
    </div>
  );
};

export default Input;
