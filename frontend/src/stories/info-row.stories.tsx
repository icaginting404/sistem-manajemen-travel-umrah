import { Meta, StoryObj } from "@storybook/nextjs-vite";
import InfoRow from "../components/atoms/info-row.component";
import { MapPin } from "lucide-react";

const meta = {
  title: "atoms/info-row",
  component: InfoRow,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],

  argTypes: {
    withColon: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof InfoRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Nama Paket",
    value: "Umroh Hemat 6",
  },
};

export const WithIcon: Story = {
  args: {
    icon: MapPin,
    label: "Lokasi Acara",
    value: "Masjid Agung Baiturrahman",
  },
};
