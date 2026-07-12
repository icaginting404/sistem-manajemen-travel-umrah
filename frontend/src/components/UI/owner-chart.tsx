"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
);

interface ChartItem {
  bulan: string;
  total: number;
}

interface OwnerChartData {
  jamaah: ChartItem[];
  pendapatan: ChartItem[];
  pengeluaran: ChartItem[];
}

interface Props {
  chart: OwnerChartData;
}

export default function OwnerChart({ chart }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="font-bold text-lg mb-5">Pertumbuhan Jamaah</h2>

        <Line
          data={{
            labels: chart.jamaah.map((i) => i.bulan),
            datasets: [
              {
                label: "Jamaah",
                data: chart.jamaah.map((i) => i.total),
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,0.2)",
                tension: 0.4,
                fill: true,
              },
            ],
          }}
        />
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="font-bold text-lg mb-5">Pendapatan vs Pengeluaran</h2>

        <Bar
          data={{
            labels: chart.pendapatan.map((i) => i.bulan),
            datasets: [
              {
                label: "Pendapatan",
                data: chart.pendapatan.map((i) => i.total),
                backgroundColor: "#22c55e",
              },
              {
                label: "Pengeluaran",
                data: chart.pengeluaran.map((i) => i.total),
                backgroundColor: "#ef4444",
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
