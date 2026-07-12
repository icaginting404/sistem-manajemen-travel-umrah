import Card from "@/src/components/atoms/card.component";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "atoms/card",
  component: Card,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    outline: "none",
    shadow: false,
    bgColor: "white",
    children: "This is a card",
  },
};
