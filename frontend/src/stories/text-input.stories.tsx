import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Input from "../components/atoms/text-input.component";

const meta = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],

  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "auth"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Username",
    placeholder: "Enter your username",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    variant: "secondary",
  },
};

export const Auth: Story = {
  args: {
    label: "Password",
    placeholder: "Enter your password",
    variant: "auth",
    value: "123456",
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "Input without label",
    variant: "primary",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    placeholder: "Can't type here",
    disabled: true,
    variant: "secondary",
  },
};
