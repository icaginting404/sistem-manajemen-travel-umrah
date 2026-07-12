"use client";

import Button from "@/src/components/atoms/button.component";
import Card from "@/src/components/atoms/card.component";
import Table from "@/src/components/atoms/table.component";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Petugas = {
  id: number;
  nama: string;
  email: string;
  nomor_hp: string;
};

type Penugasan = {
  id: number;
  nama_paket: string;
  created_at: string;
};

export default function DetailPetugasPage() {
  const router = useRouter();
  const { id } = useParams();

  const [petugas, setPetugas] = useState<Petugas | null>(null);
  const [penugasan, setPenugasan] = useState<Penugasan[]>([]);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Apakah yakin ingin menghapus penugasan ini?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/penugasan-petugas/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Gagal menghapus");
      }

      setPenugasan((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petugasResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/petugas/${id}`,
        );

        const petugasData = await petugasResponse.json();
        setPetugas(petugasData);

        const penugasanResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/penugasan-petugas/${id}`,
        );

        const penugasanData = await penugasanResponse.json();
        setPenugasan(penugasanData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const formatTanggal = (tanggal: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(tanggal));
  };

  const tableData = penugasan.map((item) => [
    item.nama_paket,
    formatTanggal(item.created_at),

    <Button
      key={item.id}
      label="Hapus"
      color="secondary"
      radius="oval"
      variant="contained"
      onClick={() => handleDelete(item.id)}
    />,
  ]);

  return (
    <section className="p-8 bg-sab-bg-gray min-h-screen flex flex-col gap-6">
      <div className="flex  items-center m-5 gap-2">
        <ArrowLeft
          size={24}
          className="cursor-pointer hover:opacity-70 transition"
          onClick={() => router.push("/admin/kelola-petugas")}
        />
        <h1 className="text-2xl font-bold text-secondary">Detail Petugas</h1>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <p className="text-gray-500">Nama</p>
            <p className="font-semibold">{petugas?.nama}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{petugas?.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Nomor HP</p>
            <p className="font-semibold">{petugas?.nomor_hp}</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-2xl font-bold text-secondary">Riwayat Penugasan</h2>

        <Button
          label="Tambah Penugasan"
          prefix={<Plus size={18} />}
          variant="contained"
          onClick={() =>
            router.push(`/admin/kelola-petugas/detail/${id}/add-penugasan`)
          }
        />
      </div>

      <Table
        headers={["Paket Umrah", "Tanggal Ditugaskan", "Aksi"]}
        data={tableData}
      />
    </section>
  );
}
