interface ButtonProps {
  label: React.ReactNode;
  onClick?: () => void;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  color?: "primary" | "secondary" | "danger";
  variant?: "text" | "outline" | "contained";
  radius?: "square" | "oval";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

const Button = ({
  label,
  onClick,
  prefix,
  suffix,
  color = "primary",
  variant = "contained",
  radius = "square",
  disabled = false,
  type = "button",
  className,
}: ButtonProps) => {
  const containedPrimary =
    "bg-primary hover:bg-primary/80 text-black font-semibold";
  const containedSecondary =
    "bg-sab-gray-300 hover:bg-sab-gray-300/80 text-white font-semibold";
  const containedDanger =
    "bg-sab-red hover:bg-sab-red/80 text-black font-semibold";

  const outlined = "border bg-transparent";
  const outlinePrimary =
    "text-black font-semibold border-primary hover:bg-primary hover:text-white";

  const textPrimary = "text-primary hover:text-primary/80";
  const textSecondary = "text-black hover:text-black/80";

  const textDanger = "text-sab-red hover:text-sab-red/80";

  const radiusStyles = {
    square: "rounded-lg",
    oval: "rounded-3xl",
  };

  const styles: string[] = [];

  if (variant == "contained") {
    if (color == "primary") styles.push(containedPrimary);
    if (color == "secondary") styles.push(containedSecondary);
    if (color == "danger") styles.push(containedDanger);
  }

  if (variant == "outline") {
    styles.push(outlined);
    if (color == "primary") styles.push(outlinePrimary);
  }

  if (variant == "text") {
    if (color == "primary") styles.push(textPrimary);
    if (color == "secondary") styles.push(textSecondary);
    if (color == "danger") styles.push(textDanger);
  }

  return (
    <button
      className={`${styles.join(" ")} 
        ${radiusStyles[radius]}
        flex items-center  gap-2 px-2 py-2 cursor-pointer md:px-6 md:py-2 text-sm 
        ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {prefix}
      {label}
      {suffix}
      </button>
  );
};

export default Button;