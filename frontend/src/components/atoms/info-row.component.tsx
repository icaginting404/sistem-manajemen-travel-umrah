import { LucideIcon } from "lucide-react";

type InfoRowProps = {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  withColon?: boolean;
};

const InfoRow = ({
  label,
  value,
  icon: Icon,
  withColon = true,
}: InfoRowProps) => {
  return (
    <div className="flex items-start gap-2 text-sm">
      <div className="flex items-center gap-2 min-w-40">
        {Icon && <Icon size={20} />}
        <p className="font-bold text-base text-sab-gray-500">{label}</p>
      </div>

      {withColon && (
        <span className="font-medium text-base text-sab-gray-500">:</span>
      )}

      <div className="font-semibold text-base">{value}</div>
    </div>
  );
};

export default InfoRow;
