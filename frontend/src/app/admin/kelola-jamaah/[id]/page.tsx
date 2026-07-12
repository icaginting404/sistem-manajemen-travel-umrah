"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/src/components/atoms/card.component";
import Button from "@/src/components/atoms/button.component";
import InfoRow from "@/src/components/atoms/info-row.component";
import { ArrowLeft, FileText } from "lucide-react";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";
import ConfirmationModal from "@/src/components/atoms/confirmation-modal.component";

type KontakDarurat = {
    nama_lengkap: string;
    alamat: string;
    hubungan: string;
    nomor_hp: string;
    urutan: number;
};

type Berkas = {
    id: number;
    jenis_berkas: string;
    nama_berkas: string;
    file_path: string;
};

type DetailJamaah = {
    id: number;
    nama: string;
    email: string;
    nomor_hp: string;

    nama_tambahan: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    nomor_ktp: string;
    nomor_paspor: string;
    tanggal_dikeluarkan_paspor: string;
    tempat_dikeluarkan_paspor: string;
    masa_berlaku_paspor: string;
    jenis_kelamin: string;
    status_perkawinan: string;
    alamat: string;
    kota_kabupaten: string;
    provinsi: string;
    pekerjaan: string;

    kontak_darurat: KontakDarurat[];
    berkas: Berkas[];
};

export default function DetailJamaahPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { toast, showToast, closeToast } = useToast();

    const [jamaah, setJamaah] = useState<DetailJamaah | null>(null);
    const [openDelete, setOpenDelete] = useState(false);

    useEffect(() => {
        const getDetail = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/jamaah/${id}`
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

                setTimeout(() => {
                    router.push("/admin/kelola-jamaah");
                }, 1000);
            }
        };

        getDetail();
    
    }, [id, router]);

    if (!jamaah) {
        return (
            <section className="min-h-screen p-6">
                <p>Memuat data...</p>
            </section>
        );
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/jamaah/${jamaah?.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Gagal menghapus data jamaah"
                );
            }

            setOpenDelete(false);

            showToast(
                "Data jamaah berhasil dihapus",
                "success"
            );

            setTimeout(() => {
                router.push("/admin/kelola-jamaah");
            }, 800);

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
            <div className="max-w-7xl mx-auto space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Button
                            label=""
                            variant="text"
                            color="secondary"
                            prefix={<ArrowLeft size={18} />}
                            radius="oval"
                            onClick={() => router.back()}
                        />

                        <h1 className="text-2xl font-bold">
                            Detail Jamaah
                        </h1>
                    </div>
                </div>

                {/* DATA JAMAAH */}
                <Card shadow>
                    <div className="grid md:grid-cols-2 gap-y-5 gap-x-12">

                        <InfoRow
                            label="Nama Lengkap"
                            value={jamaah.nama || "-"}
                        />

                        <InfoRow
                            label="Email"
                            value={jamaah.email || "-"}
                        />

                        <InfoRow
                            label="Nama Tambahan"
                            value={jamaah.nama_tambahan || "-"}
                        />

                        <InfoRow
                            label="No. Paspor"
                            value={jamaah.nomor_paspor || "-"}
                        />

                        <InfoRow
                            label="Tanggal Lahir"
                            value={
                                jamaah.tanggal_lahir
                                    ? new Date(
                                        jamaah.tanggal_lahir
                                    ).toLocaleDateString("id-ID")
                                    : "-"
                            }
                        />

                        <InfoRow
                            label="Tanggal Dikeluarkan Paspor"
                            value={
                                jamaah.tanggal_dikeluarkan_paspor
                                    ? new Date(
                                        jamaah.tanggal_dikeluarkan_paspor
                                    ).toLocaleDateString("id-ID")
                                    : "-"
                            }
                        />

                        <InfoRow
                            label="Tempat Lahir"
                            value={jamaah.tempat_lahir || "-"}
                        />

                        <InfoRow
                            label="Tempat Dikeluarkan Paspor"
                            value={
                                jamaah.tempat_dikeluarkan_paspor || "-"
                            }
                        />

                        <InfoRow
                            label="No. KTP"
                            value={jamaah.nomor_ktp || "-"}
                        />

                        <InfoRow
                            label="Masa Berlaku Paspor"
                            value={
                                jamaah.masa_berlaku_paspor
                                    ? new Date(
                                        jamaah.masa_berlaku_paspor
                                    ).toLocaleDateString("id-ID")
                                    : "-"
                            }
                        />

                        <InfoRow
                            label="No Telp"
                            value={jamaah.nomor_hp || "-"}
                        />

                        <InfoRow
                            label="Provinsi"
                            value={jamaah.provinsi || "-"}
                        />

                        <InfoRow
                            label="Pekerjaan"
                            value={jamaah.pekerjaan || "-"}
                        />

                        <InfoRow
                            label="Kota/Kabupaten"
                            value={
                                jamaah.kota_kabupaten || "-"
                            }
                        />

                        <InfoRow
                            label="Jenis Kelamin"
                            value={jamaah.jenis_kelamin || "-"}
                        />

                        <InfoRow
                            label="Alamat Tinggal"
                            value={jamaah.alamat || "-"}
                        />

                        <InfoRow
                            label="Status Perkawinan"
                            value={
                                jamaah.status_perkawinan || "-"
                            }
                        />
                    </div>
                </Card>

                {/* KONTAK DARURAT */}
                <Card shadow className="mt-8">
                    <h2 className="text-xl font-bold text-center mb-8">
                        No Telp Yang Bisa Dihubungi
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {jamaah.kontak_darurat.length > 0 ? (
                            jamaah.kontak_darurat.map((kontak) => (
                                <div key={kontak.urutan}>
                                    <h3 className="font-bold mb-4">
                                        Kontak Darurat {kontak.urutan}
                                    </h3>

                                    <div className="space-y-4">
                                        <InfoRow
                                            label="Nama Lengkap"
                                            value={kontak.nama_lengkap || "-"}
                                        />

                                        <InfoRow
                                            label="Alamat Tinggal"
                                            value={kontak.alamat || "-"}
                                        />

                                        <InfoRow
                                            label="Hubungan"
                                            value={kontak.hubungan || "-"}
                                        />

                                        <InfoRow
                                            label="No Telp"
                                            value={kontak.nomor_hp || "-"}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Tidak ada kontak darurat.</p>
                        )}
                    </div>
                </Card>

                {/* BERKAS */}
                <Card shadow>
                    <h2 className="text-xl font-bold mb-6">
                        Dokumen Jamaah
                    </h2>

                    {jamaah.berkas.length > 0 ? (
                        <div className="divide-y divide-sab-gray-200">
                            {jamaah.berkas.map((berkas) => (
                                <div
                                    key={berkas.id}
                                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 py-5"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText
                                            size={22}
                                            className="text-primary shrink-0"
                                        />

                                        <div>
                                            <p className="font-bold text-lg">
                                                {berkas.jenis_berkas}
                                            </p>

                                            <p className="text-sab-gray-500 text-sm break-all">
                                                {berkas.nama_berkas}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        label="Lihat"
                                        radius="oval"
                                        onClick={() =>
                                            window.open(
                                                `${process.env.NEXT_PUBLIC_API_URL}/${berkas.file_path.replace(
                                                    /\\/g,
                                                    "/"
                                                )}`,
                                                "_blank"
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sab-gray-500">
                            Tidak ada dokumen.
                        </p>
                    )}
                </Card>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
                <Button
                    label="Edit"
                    color="primary"
                    radius="oval"
                    onClick={() =>
                        router.push(
                            `/admin/kelola-jamaah/edit/${jamaah.id}`
                        )
                    }
                />

                <Button
                    label="Hapus"
                    color="danger"
                    radius="oval"
                    onClick={() => setOpenDelete(true)}
                />
            </div>
            
            <ConfirmationModal
                open={openDelete}
                title="Hapus Data Jamaah"
                description="Apakah Anda yakin ingin menghapus data jamaah ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                onCancel={() => setOpenDelete(false)}
                onConfirm={handleDelete}
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