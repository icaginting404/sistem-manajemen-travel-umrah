import Table from "@/src/components/atoms/table.component";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "atoms/table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headers: [
      "Tanggal",
      "Jumlah",
      "Keterangan",
    ],

    data: [
      ["07-05-2026", "1.000.000", "Pemasukan"],
      ["08-05-2026", "500.000", "Pengeluaran"],
      ["09-05-2026", "2.500.000", "Pemasukan"],
    ],
  },
};