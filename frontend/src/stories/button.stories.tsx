import Button from "../components/atoms/button.component";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "atoms/button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Click Me",
    color: "primary",
    variant: "contained",
  },
};

export const Oval: Story = {
  args: {
    label: "Click Me",
    color: "primary",
    variant: "contained",
    radius: "oval",
  },
};
