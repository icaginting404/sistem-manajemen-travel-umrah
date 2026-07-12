"use client";
import PaketForm from "@/src/components/forms/paket.component";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";

type FormData = {
    namaPaket: string;
    jadwalKeberangkatan: Dayjs | null;
    harga: string;
    durasiPerjalanan: string;
    hotel: string;
    totalKuota: string;
    maskapai: string;
    statusPaket: string;
    flyer: File | string | null;
    fasilitas: string[];
    tidakTermasukHarga: string[];
};

const EditPaketPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const { toast, showToast, closeToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        namaPaket: "",
        jadwalKeberangkatan: null,
        harga: "",
        durasiPerjalanan: "",
        hotel: "",
        totalKuota: "",
        maskapai: "",
        statusPaket: "",
        flyer: null,
        fasilitas: [""],
        tidakTermasukHarga: [""],
    });

    useEffect(() => {
        const getPaket = async () => {
        try {
            const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah/${id}`
            );

            const data = await res.json();
            console.log(data.flyer);

            setFormData({
            namaPaket: data.nama_paket || "",
            jadwalKeberangkatan: data.jadwal_keberangkatan
                ? dayjs(data.jadwal_keberangkatan)
                : null,
            harga: data.harga?.toString() || "",
            durasiPerjalanan: data.durasi_perjalanan || "",
            hotel: data.hotel || "",
            totalKuota: data.total_kuota?.toString() || "",
            maskapai: data.maskapai || "",
            statusPaket: data.status_paket || "",
            flyer: data.flyer || null,
            fasilitas: data.fasilitas
                ? JSON.parse(data.fasilitas)
                : [""],
            tidakTermasukHarga: data.tidak_termasuk_harga
                ? JSON.parse(data.tidak_termasuk_harga)
                : [""],
            });
        } catch (error) {
            console.log(error);
        }
        };

        if (id) {
        getPaket();
        }
    },[id]);

    // SUBMIT UPDATE
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = new FormData();

            payload.append("nama_paket", formData.namaPaket);

            payload.append("jadwal_keberangkatan", formData.jadwalKeberangkatan?.toISOString() || "");

            payload.append("harga", formData.harga);

            payload.append("durasi_perjalanan", formData.durasiPerjalanan);

            payload.append("hotel", formData.hotel);

            payload.append("total_kuota", formData.totalKuota);

            payload.append("maskapai", formData.maskapai);

            payload.append("status_paket", formData.statusPaket);

            payload.append("fasilitas", JSON.stringify(formData.fasilitas));

            payload.append("tidak_termasuk_harga", JSON.stringify(formData.tidakTermasukHarga));

            if (
                formData.flyer &&
                typeof formData.flyer !== "string"
            ) {
                payload.append("flyer", formData.flyer);
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah/${id}`,
                {
                    method: "PUT",
                    body: payload,
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            showToast("Paket berhasil diupdate", "success");
            setTimeout(() => {
                router.push("/admin/kelola-paket");
            }, 800);

        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="p-6 bg-sab-bg-gray min-h-screen  mb-2">
            <h1 className="text-2xl md:text-2xl ml-2 font-bold text-secondary">
                Kelola Paket Umrah
            </h1>

            <PaketForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                errorMsg={null}
                submitLabel="Update"
                onCancel={() => router.push("/admin/kelola-paket")}
            />
            <ToastComponent
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={closeToast}
            />
        </section>
    );
};


export default EditPaketPage;