import React, { ReactNode } from "react";

interface ChipProps {
  label: string;
  variant?: "contained" | "outline";
  color?: "primary" | "white" | "gray";
  radius?: "sm" | "full";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

const Chip = ({
  label,
  variant = "contained",
  color = "primary",
  radius = "full",
  leftIcon,
  rightIcon,
  active = false,
  className = "",
  onClick,
}: ChipProps) => {
  const styles: string[] = [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "px-4",
    "py-1.5",
    "text-sm",
    "w-fit",
    "[&_svg]:text-base",
  ];

  if (onClick) {
    styles.push("cursor-pointer", "hover:opacity-80");
  }

  if (radius === "sm") {
    styles.push("rounded-md");
  }

  if (radius === "full") {
    styles.push("rounded-2xl");
  }

  if (variant === "contained") {
    if (color === "primary") {
      styles.push("bg-primary", "text-secondary");
    }

    if (color === "white") {
      styles.push("bg-sab-white-500", "text-secondary");
    }

    if (color === "gray") {
      styles.push("bg-sab-gray-100", "text-secondary");
    }
  }

  if (variant === "outline") {
    styles.push("border-2");

    if (color === "primary") {
      styles.push("border-primary", "text-secondary", "bg-transparent");
    }

    if (color === "gray") {
      styles.push("border-sab-gray-300", "text-secondary", "bg-sab-gray-100");
    }
  }

  if (active) {
    styles.push("ring-2", "ring-primary");
  }

  if (className) {
    styles.push(className);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.join(" ")}
    >
      {leftIcon && leftIcon}

      <span>{label}</span>

      {rightIcon && rightIcon}
    </button>
  );
};

export default Chip;