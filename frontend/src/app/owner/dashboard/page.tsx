"use client";

import { useEffect, useState } from "react";
import OwnerChart from "@/src/components/UI/owner-chart";

interface DashboardData {
  cards: {
    totalJamaah: number;
    totalPaket: number;
    totalPesanan: number;
    pendapatan: number;
    pengeluaran: number;
    laba: number;
  };
}

interface ChartItem {
  bulan: string;
  total: number;
}

interface ChartData {
  jamaah: ChartItem[];
  pendapatan: ChartItem[];
  pengeluaran: ChartItem[];
}

export default function OwnerDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/owner/dashboard`)
      .then((res) => res.json())
      .then((data: DashboardData) => setDashboard(data));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/owner/chart`)
      .then((res) => res.json())
      .then((data: ChartData) => setChart(data));
  }, []);

  if (!dashboard) {
    return <div className="p-8">Loading...</div>;
  }

  const card = dashboard.cards;

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Executive Dashboard</h1>

      <p className="mb-8 text-gray-500">
        Ringkasan kondisi bisnis travel umrah.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <DashboardCard title="Total Jamaah" value={card.totalJamaah} />

        <DashboardCard title="Paket Aktif" value={card.totalPaket} />

        <DashboardCard title="Total Pesanan" value={card.totalPesanan} />

        <DashboardCard
          title="Pendapatan"
          value={`Rp ${card.pendapatan.toLocaleString("id-ID")}`}
        />

        <DashboardCard
          title="Pengeluaran"
          value={`Rp ${card.pengeluaran.toLocaleString("id-ID")}`}
        />

        <DashboardCard
          title="Estimasi Laba"
          value={`Rp ${card.laba.toLocaleString("id-ID")}`}
        />
      </div>
      {chart && <OwnerChart chart={chart} />}
    </div>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-gray-500">{title}</p>

      <h2 className="mt-3 text-3xl font-bold">{value}</h2>
    </div>
  );
}
