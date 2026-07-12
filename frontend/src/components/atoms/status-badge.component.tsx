interface StatusBadgeProps {
    status: string;
}

const STATUS = {
    menunggu_pembayaran: {
        label: "Menunggu Pembayaran",
        color: "bg-yellow-100 text-yellow-700",
        dot: "bg-yellow-500",
    },
    dalam_cicilan: {
        label: "Dalam Cicilan",
        color: "bg-blue-100 text-blue-700",
        dot: "bg-blue-500",
    },
    lunas: {
        label: "Lunas",
        color: "bg-green-100 text-green-700",
        dot: "bg-green-500",
    },
    dibatalkan: {
        label: "Dibatalkan",
        color: "bg-red-100 text-red-700",
        dot: "bg-red-500",
    },
    expired: {
        label: "Expired",
        color: "bg-gray-100 text-gray-700",
        dot: "bg-gray-500",
    },
    aktif: {
        label: "Aktif",
        color: "bg-green-100 text-green-700",
        dot: "bg-green-500",
    },
    tidak_aktif: {
        label: "Tidak Aktif",
        color: "bg-red-100 text-red-700",
        dot: "bg-red-500",
    },
    penuh: {
        label: "Penuh",
        color: "bg-orange-100 text-orange-700",
        dot: "bg-orange-500",
    },
} as const;

export default function StatusBadge({
    status,
}: StatusBadgeProps) {
    const item =
        STATUS[status as keyof typeof STATUS] ?? {
            label: status,
            color: "bg-gray-100 text-gray-700",
            dot: "bg-gray-500",
        };

    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${item.color}`}
        >
            <span
                className={`w-2 h-2 rounded-full ${item.dot}`}
            />
            {item.label}
        </div>
    );
}