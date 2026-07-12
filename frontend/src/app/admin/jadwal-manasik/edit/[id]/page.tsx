"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import  JadwalManasikForm, 
        { JadwalManasikFormData } 
from "@/src/components/forms/jadwal-manasik.component";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";

export default function EditJadwalManasikPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { toast, showToast, closeToast } = useToast();

    const [formData, setFormData] =
    useState<JadwalManasikFormData>({
        paket_id: "",
        jadwal_keberangkatan: "",
        tanggal_acara: "",
        lokasi_acara: "",
        waktu_acara: "",
        pemateri: "",
        keterangan: "",
    });

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/jadwal-manasik/${id}`
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Gagal mengambil data"
                    );
                }

                setFormData({
                    paket_id: data.paket_id.toString(),
                    jadwal_keberangkatan:
                        data.jadwal_keberangkatan
                            ? new Date(
                                data.jadwal_keberangkatan
                            ).toLocaleDateString("id-ID")
                            : "",
                    lokasi_acara: data.lokasi_acara || "",
                    tanggal_acara: data.tanggal_acara?.split("T")[0] || "",
                    waktu_acara: data.waktu_acara || "",
                    pemateri: data.pemateri || "",
                    keterangan: data.keterangan || "",
                });

            } catch (error) {
                console.error(error);

                showToast(
                    error instanceof Error
                        ? error.message
                        : "Gagal mengambil data jadwal",
                    "error"
                );

                setTimeout(() => {
                    router.push("/admin/jadwal-manasik");
                }, 1000);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/jadwal-manasik/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        paket_id: Number(formData.paket_id),
                        tanggal_acara: formData.tanggal_acara,
                        lokasi_acara: formData.lokasi_acara,
                        waktu_acara: formData.waktu_acara,
                        pemateri: formData.pemateri,
                        keterangan: formData.keterangan,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Gagal mengupdate jadwal");
            }

            showToast("Jadwal berhasil diupdate", "success");

            setTimeout(() => {
                router.push("/admin/jadwal-manasik");
            }, 800);

        } catch (error) {
            console.error(error);
            showToast(
                error instanceof Error
                    ? error.message
                    : "Gagal mengupdate jadwal",
                "error"
            );
        }
    };

    return (
        <section className="bg-sab-bg-gray min-h-screen p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Jadwal Manasik</h1>
                <JadwalManasikForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    submitLabel="Simpan"
                    onCancel={() => router.push("/admin/jadwal-manasik")}
                    disablePaket
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