"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import  JadwalManasikForm, 
        {JadwalManasikFormData } 
from "@/src/components/forms/jadwal-manasik.component";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";

export default function TambahJadwalManasikPage() {

    const [formData, setFormData] =
    useState<JadwalManasikFormData>({
        paket_id: "",
        jadwal_keberangkatan: "",
        lokasi_acara: "",
        tanggal_acara: "",
        waktu_acara: "",
        pemateri: "",
        keterangan: "",
    });

    const router = useRouter();
    const { toast, showToast, closeToast } = useToast();
    
    const handleSubmit = async () => {
        try {
            const payload = {
                paket_id: Number(formData.paket_id),
                lokasi_acara: formData.lokasi_acara,
                tanggal_acara: formData.tanggal_acara,
                waktu_acara: formData.waktu_acara,
                pemateri: formData.pemateri,
                keterangan: formData.keterangan,
            };

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/jadwal-manasik`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Gagal menambahkan jadwal manasik"
                );
            }

            showToast("Jadwal manasik berhasil ditambahkan", "success");

            setTimeout(() => {
                router.push("/admin/jadwal-manasik");
            }, 800);

            setFormData({
                paket_id: "",
                jadwal_keberangkatan: "",
                lokasi_acara: "",
                tanggal_acara: "",
                waktu_acara: "",
                pemateri: "",
                keterangan: "",
            });
        } catch (error) {
            console.error(error);
            showToast(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan",
                "error"
            );
        }
    };

    return (
        <section className="bg-sab-bg-gray min-h-screen p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Tambah Jadwal Manasik</h1>
                <JadwalManasikForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    submitLabel="Kirim"
                    onCancel={() => router.push("/admin/jadwal-manasik")}
                />
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