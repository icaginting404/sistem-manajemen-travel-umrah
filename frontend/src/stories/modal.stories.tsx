import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Modal from "@/src/components/atoms/modal.component";

const meta = {
  title: "atoms/modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClose: { action: "closed" },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    children: "This is Modal",
    onClose: () => {},
  },
};