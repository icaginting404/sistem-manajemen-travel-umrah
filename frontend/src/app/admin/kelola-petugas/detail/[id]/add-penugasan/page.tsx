"use client";

import Button from "@/src/components/atoms/button.component";
import Modal from "@/src/components/atoms/modal.component";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type PaketUmrah = {
  id: number;
  nama_paket: string;
};

type Petugas = {
  id: number;
  nama: string;
};

export default function TambahPenugasanPage() {
  const router = useRouter();
  const { id } = useParams();

  const [petugas, setPetugas] = useState<Petugas | null>(null);
  const [paket, setPaket] = useState<PaketUmrah[]>([]);
  const [selectedPaket, setSelectedPaket] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petugasResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/petugas/${id}`,
        );

        const petugasData = await petugasResponse.json();
        setPetugas(petugasData);

        const paketResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah`,
        );

        const paketData = await paketResponse.json();
        setPaket(paketData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!selectedPaket) {
      alert("Pilih paket umrah.");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/penugasan-petugas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        petugas_id: id,
        paket_umrah_id: selectedPaket,
      }),
    });

    const result = await response.json();

    alert(result.message);

    if (response.ok) {
      router.push(`/admin/kelola-petugas/detail/${id}`);
    }
  };


  return (
    <section>
      <Modal isOpen={true} onClose={() => {}}>
        <h1 className="text-2xl font-bold mb-5 text-secondary">
          Tambah Penugasan
        </h1>

        <div className="space-y-5">
          <div>
            <label className="font-semibold">Nama Petugas</label>

            <div className="mt-2 p-3 rounded-xl bg-gray-100">
              {petugas?.nama}
            </div>
          </div>

          <FormControl fullWidth>
            <label className="mb-2 font-semibold">Paket Umrah</label>

            <Select
              value={selectedPaket}
              displayEmpty
              onChange={(e: SelectChangeEvent) =>
                setSelectedPaket(e.target.value)
              }
            >
              <MenuItem value="">Pilih Paket Umrah</MenuItem>

              {paket.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.nama_paket}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            label="Batal"
            color="secondary"
            variant="contained"
            onClick={() => router.push(`/admin/kelola-petugas/detail/${id}`)}
          />

          <Button label="Simpan" variant="contained" onClick={handleSubmit} />
        </div>
      </Modal>
    </section>
  );
}
