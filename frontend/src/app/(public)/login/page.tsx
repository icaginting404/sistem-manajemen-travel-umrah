"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/src/components/atoms/card.component";
import Input from "@/src/components/atoms/text-input.component";
import Button from "@/src/components/atoms/button.component";
import useToast from "@/src/hooks/use-toast";
import ToastComponent from "@/src/components/atoms/toast.component";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      showToast(
        data.message,
        response.ok ? "success" : "error"
      );

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          if (data.user.role === "admin") {
            router.replace("/admin/kelola-jamaah");
          } else if (data.user.role === "petugas") {
            router.replace("/petugas/informasi-kloter");
          } else if (data.user.role === "owner") {
            router.replace("/owner/dashboard");
          } else {
            router.replace("/paket-umrah");
          }
        }, 800);
      }
    } catch (error) {
      console.log(error);
      showToast("Terjadi kesalahan pada server.", "error");
    }
  };

  const router = useRouter();
  const { toast, showToast, closeToast } = useToast();

  return (
    <section className="relative min-h-screen overflow-hidden bg-primary">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <Card shadow className="w-full max-w-md">
          <div className="flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={70}
              height={70}
              className="mb-3"
            />

            <h2 className="text-xl font-bold">Masuk Akun</h2>

            <p className="mt-2 text-center text-sm text-sab-gray-300">
              Silakan masuk untuk mendapatkan akses
              <br />
              ke lebih banyak fitur yang tersedia.
            </p>

            <form
              onSubmit={handleLogin}
              className="mt-6 flex w-full flex-col gap-4"
            >
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="auth"
                type="email"
                placeholder="Email"
              />

              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="auth"
                type="password"
                placeholder="Password"
              />

              <Button
                type="submit"
                label="Masuk"
                radius="oval"
                className="mt-2 w-full justify-center py-3"
              />
            </form>

            <p className="mt-5 text-sm text-sab-gray-300">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-primary">
                Daftar
              </Link>
            </p>
          </div>
        </Card>
      </div>
      <ToastComponent
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </section>
  );
}
