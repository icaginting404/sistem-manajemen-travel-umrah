"use client";
import { useEffect, useState } from "react";
import Table from "@/src/components/atoms/table.component";
import Button from "@/src/components/atoms/button.component";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";
import ConfirmationModal from "@/src/components/atoms/confirmation-modal.component";

type JadwalManasik = {
    id: number;
    nama_paket: string;
    jadwal_keberangkatan: string;
    tanggal_acara: string;
    lokasi_acara: string;
    waktu_acara: string;
    pemateri: string;
    keterangan: string;
};

export default function JadwalManasikPage() {
    const router = useRouter();
    const [jadwal, setJadwal] = useState<JadwalManasik[]>([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { toast, showToast, closeToast } = useToast();

    useEffect(() => {
        const getJadwal = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/jadwal-manasik`
                );

                const data = await res.json();

                setJadwal(data);
            } catch (error) {
                console.error(error);
            }
        };

        getJadwal();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/jadwal-manasik/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                throw new Error("Gagal menghapus jadwal");
            }

            setJadwal((prev) =>
                prev.filter((item) => item.id !== id)
            );

            // Tutup modal
            setOpenDelete(false);
            setSelectedId(null);

            // Baru tampilkan toast
            showToast("Jadwal manasik berhasil dihapus", "success");

        } catch (error) {
            showToast(
                error instanceof Error
                    ? error.message
                    : "Gagal menghapus jadwal",
                "error"
            );
        }
    };

    const tableData = jadwal.map((item, index) => [
        index + 1,
        item.nama_paket,

        new Date(
        item.jadwal_keberangkatan
        ).toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        ),

        new Date(
            item.tanggal_acara
        ).toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        ),

        item.lokasi_acara,
        item.waktu_acara,
        item.pemateri,
        item.keterangan?.length > 10
        ? item.keterangan.substring(0, 20) + "..."
        : item.keterangan,


        <div key={item.id} className="flex gap-3">
            <button
                onClick={() =>
                    router.push(
                        `/admin/jadwal-manasik/edit/${item.id}`
                    )
                }
            >
                <SquarePen size={18} className="text-primary" />
            </button>

            <button onClick={() => {
                setSelectedId(item.id);
                setOpenDelete(true);
            }}>
                <Trash2 size={18} className="text-sab-red"/>
            </button>
        </div>,
    ]);

    return (
        <section className="bg-sab-bg-gray min-h-screen p-6">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl md:text-2xl font-bold ml-2"> Jadwal Manasik</h1>
                <Button
                    label="Tambah"
                    prefix={<Plus size={18} />}
                    radius="oval"
                    onClick={() =>
                        router.push(
                            "/admin/jadwal-manasik/add"
                        )
                    }
                    className="mr-5"
                />
            </div>

            <Table
                headers={[
                    "No",
                    "Paket",
                    "Keberangkatan",
                    "Tanggal Acara",
                    "Lokasi Acara",
                    "Waktu",
                    "Pemateri",
                    "Keterangan",
                    "Aksi",
                ]}
                data={tableData}
            />

            <ConfirmationModal
                open={openDelete}
                title="Hapus Jadwal Manasik"
                description="Apakah Anda yakin ingin menghapus jadwal manasik ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                onCancel={() => {
                    setOpenDelete(false);
                    setSelectedId(null);
                }}
                onConfirm={() => {
                    if (selectedId) {
                        handleDelete(selectedId);
                    }
                }}
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