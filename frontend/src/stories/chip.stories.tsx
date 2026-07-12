import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FilePenLine } from 'lucide-react';

import Chip from "@/src/components/atoms/chip.component";

const meta = {
  title: "atoms/chip",
  component: Chip,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PrimaryRadius5: Story = {
  args: {
    label: "This is chip",
    color: "primary",
    radius: "sm",
    leftIcon: <FilePenLine />,
  },
};