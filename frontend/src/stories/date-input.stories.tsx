import { Layout } from "lucide-react";
import DateInput from "../components/atoms/date-input.component";
import { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
    title: "atoms/date-input",
    component: DateInput,
    parameters: {
        Layout : "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: "Tanggal keberangkatan",
        placeholder: "Pilih tanggal keberangkatan"
    },
};