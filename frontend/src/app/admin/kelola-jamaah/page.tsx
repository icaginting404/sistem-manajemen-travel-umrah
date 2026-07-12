"use client";

import { useEffect, useState } from "react";
import Table from "@/src/components/atoms/table.component";
import Button from "@/src/components/atoms/button.component";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";

type Jamaah = {
    id: number;
    nama: string;
    email: string;
    nomor_hp: string;
    jenis_kelamin: string;
    tanggal_lahir: string;
    kota_kabupaten: string;
};

export default function JamaahPage() {
    const router = useRouter();
    const { toast, showToast, closeToast } = useToast();
    const [jamaah, setJamaah] = useState<Jamaah[]>([]);

    useEffect(() => {
        const getJamaah = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/jamaah`
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Gagal mengambil data jamaah"
                    );
                }

                setJamaah(data);
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

        getJamaah();
    }, []);

    const tableData = jamaah.map((item, index) => [
        index + 1,

        item.nama,

        item.nomor_hp,

        item.jenis_kelamin
        ? item.jenis_kelamin
        : "-",

        item.tanggal_lahir
        ? new Date(item.tanggal_lahir).toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        )
        : "-",

        item.kota_kabupaten
        ? item.kota_kabupaten
        : "-",

        <span
            key={`email-${item.id}`}
            title={item.email}
        >
            {item.email.length > 15
                ? item.email.slice(0, 15) + "..."
                : item.email}
        </span>,

        <Button
            key={item.id}
            label="Detail"
            radius="oval"
            onClick={() =>
                router.push(`/admin/kelola-jamaah/${item.id}`)
            }
            
        />,
    ]);

    return (
        <section className="bg-sab-bg-gray min-h-screen p-6">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl md:text-2xl font-bold ml-2">
                    Data Jamaah
                </h1>

                <Button
                    label="Tambah"
                    prefix={<Plus size={18} />}
                    radius="oval"
                    onClick={() =>
                        router.push(
                            "/admin/kelola-jamaah/add"
                        )
                    }
                    className="mr-5"
                />
            </div>

            <Table
                headers={[
                    "No",
                    "Nama Lengkap",
                    "No Telp",
                    "Jenis Kelamin",
                    "Tanggal Lahir",
                    "Kabupaten",
                    "Email",
                    "Aksi",
                ]}
                data={tableData}
            />

            <ToastComponent
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={closeToast}
            />
        </section>
    );
}