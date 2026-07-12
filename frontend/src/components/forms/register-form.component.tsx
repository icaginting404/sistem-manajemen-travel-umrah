"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/src/components/atoms/text-input.component";
import Button from "@/src/components/atoms/button.component";
import useToast from "@/src/hooks/use-toast";
import ToastComponent from "@/src/components/atoms/toast.component";

type RegisterFormProps = {
    isAdmin?: boolean;
};

export default function RegisterForm({
    isAdmin = false,
}: RegisterFormProps) {
    const router = useRouter();
    const { toast, showToast, closeToast } = useToast();

    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        nomor_hp: "",
        password: "",
        konfirmasi_password: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
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
                setTimeout(() => {
                    if (isAdmin) {
                        router.push(`/admin/kelola-jamaah/edit/${data.id}`);
                    } else {
                        router.push("/login");
                    }
                }, 800);
            }
        } catch (error) {
            console.log(error);
            showToast(
                "Terjadi kesalahan pada server.",
                "error"
            );
        }
    };

    return (
        <>
            <form
                onSubmit={handleRegister}
                className="flex w-full flex-col gap-4"
            >
                <Input
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    variant="auth"
                    placeholder="Nama Lengkap"
                    required
                />

                <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="auth"
                    type="email"
                    placeholder="Email"
                    required
                />

                <Input
                    name="nomor_hp"
                    value={formData.nomor_hp}
                    onChange={handleChange}
                    variant="auth"
                    type="tel"
                    placeholder="0894xxxxxx"
                    required
                />

                <Input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    variant="auth"
                    type="password"
                    placeholder="Password"
                    required
                />

                <Input
                    name="konfirmasi_password"
                    value={formData.konfirmasi_password}
                    onChange={handleChange}
                    variant="auth"
                    type="password"
                    placeholder="Konfirmasi Password"
                    required
                />

                <Button
                    type="submit"
                    label={
                        isAdmin
                        ? "Simpan Jamaah"
                        : "Daftar"
                    }
                    radius="oval"
                    className="mt-2 w-full justify-center py-3"
                />
            </form>
            <ToastComponent
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={closeToast}
            />
        </>
    );
}   