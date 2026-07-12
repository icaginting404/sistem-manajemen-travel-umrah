"use client";

import Button from "@/src/components/atoms/button.component";
import Table from "@/src/components/atoms/table.component";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Petugas = {
  id: number;
  nama: string;
  email: string;
  nomor_hp: string;
  jumlah_penugasan: number;
};

export default function KelolaPetugasPage() {
  const router = useRouter();
  const [petugas, setPetugas] = useState<Petugas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPetugas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/petugas`);

        const data = await response.json();

        setPetugas(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getPetugas();
  }, []);

  const tableData = petugas.map((item) => [
    item.nama,
    item.email,
    item.nomor_hp,
    item.jumlah_penugasan === 0
      ? "Belum Ditugaskan"
      : `${item.jumlah_penugasan} Paket`,
    <Button
      key={item.id}
      label="Detail"
      radius="oval"
      variant="contained"
      onClick={() => router.push(`/admin/kelola-petugas/detail/${item.id}`)}
    />,
  ]);

  return (
    <section className="bg-sab-bg-gray min-h-screen p-6">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold ">Kelola Petugas</h1>

        <Button
          label="Tambah Petugas"
          prefix={<Plus size={18} />}
          variant="contained"
          onClick={() => router.push("/admin/kelola-petugas/add")}
        />
      </div>
      {loading ? (
        <div className="bg-white rounded-xl p-10 text-center shadow ">
          Memuat data...
        </div>
      ) : petugas.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow">
          <h2 className="text-xl font-semibold text-secondary">
            Belum Ada Petugas
          </h2>

          <p className="text-gray-500 mt-2">
            Silakan tambahkan akun petugas terlebih dahulu.
          </p>
        </div>
      ) : (
        <Table
          headers={["Nama", "Email", "Nomor HP", "Jumlah Penugasan", "Aksi"]}
          data={tableData}
        />
      )}
    </section>
  );
}
