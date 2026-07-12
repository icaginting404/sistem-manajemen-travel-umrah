import React from "react";

interface CardProps {
  children: React.ReactNode;
  bgColor?: "white" | "transparent";
  outline?: "none" | "primary" | "secondary" ;
  shadow?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card = ({
  children,
  bgColor = "white",
  outline = "none",
  shadow = false,
  className = "",
  onClick,
}: CardProps) => {
  const styles: string[] = ["p-6", "rounded-2xl"];

  if (bgColor === "white")
    styles.push("bg-white");

  if (bgColor === "transparent")
    styles.push("bg-transparent");

  if (outline === "primary")
    styles.push("border-[5px]", "border-primary");

  if (outline === "secondary")
    styles.push("border-[5px]", "border-secondary");

  if (shadow)
    styles.push("shadow-xl");

  if (className) styles.push(className);

  return (
    <div onClick={onClick} className={styles.join(" ")}>
      {children}
    </div>
  );
};

export default Card;
