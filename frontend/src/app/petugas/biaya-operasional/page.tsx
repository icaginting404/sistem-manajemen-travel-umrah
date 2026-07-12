"use client";

import Button from "@/src/components/atoms/button.component";
import Table from "@/src/components/atoms/table.component";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type PaketUmrah = {
  id: number;
  nama_paket: string;
};

type BiayaOperasional = {
  id: number;
  tanggal: string;
  keterangan: string;
  nominal: number;
};

export default function BiayaOperasionalPetugasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const [selectedPaket, setSelectedPaket] = useState(
    searchParams.get("paketId") || ""
  );

  const [paketUmrah, setPaketUmrah] = useState<PaketUmrah[]>([]);
  const [biayaOperasional, setBiayaOperasional] = useState<
    BiayaOperasional[]
  >([]);

  useEffect(() => {
    const getPaket = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah`
        );

        const data = await response.json();

        setPaketUmrah(data);
      } catch (err) {
        console.log(err);
      }
    };

    getPaket();
  }, []);

  useEffect(() => {
    const getBiayaOperasional = async () => {
      if (!selectedPaket || !user?.id) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/biaya-operasional/petugas?petugas_id=${user.id}&paket_id=${selectedPaket}`
        );

        const data = await response.json();

        setBiayaOperasional(data);
      } catch (err) {
        console.log(err);
      }
    };

    getBiayaOperasional();
  }, [selectedPaket]);

  const handlePaketChange = (event: SelectChangeEvent) => {
    const paketId = event.target.value;

    setSelectedPaket(paketId);

    router.replace(`/petugas/biaya-operasional?paketId=${paketId}`);
  };

  const formatTanggal = (tanggal: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(tanggal));
  };

  const formatRupiah = (nominal: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(nominal);
  };

  const tableData = biayaOperasional.map((item) => [
    formatTanggal(item.tanggal),
    item.keterangan,
    formatRupiah(item.nominal),
    <Button
      key={item.id}
      label="Detail"
      radius="oval"
      variant="contained"
      onClick={() =>
        router.push(
          `/petugas/biaya-operasional/detail/${item.id}`
        )
      }
    />,
  ]);

  return (
    <section className="p-8 bg-sab-bg-gray min-h-screen">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">
          Biaya Operasional
        </h1>

        <div className="flex gap-3 items-center">
          <FormControl size="small">
            <Select
              displayEmpty
              value={selectedPaket}
              onChange={handlePaketChange}
              renderValue={(selected) => {
                if (!selected) return "Pilih Paket Umrah";

                const paket = paketUmrah.find(
                  (item) => String(item.id) === selected
                );

                return (
                  paket?.nama_paket ?? "Pilih Paket Umrah"
                );
              }}
              sx={{
                minWidth: 300,
                bgcolor: "var(--color-primary)",
                color: "white",
                borderRadius: "12px",

                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },

                ".MuiSvgIcon-root": {
                  color: "white",
                },
              }}
            >
              {paketUmrah.map((paket) => (
                <MenuItem
                  key={paket.id}
                  value={String(paket.id)}
                >
                  {paket.nama_paket}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedPaket && (
            <Button
              label="Tambah Biaya"
              prefix={<Plus size={18} />}
              variant="contained"
              onClick={() =>
                router.push(
                  `/petugas/biaya-operasional/add?paketId=${selectedPaket}`
                )
              }
            />
          )}
        </div>
      </div>

      {!selectedPaket ? (
        <div className="mt-8 rounded-xl bg-white p-12 shadow text-center">
          <h2 className="text-xl font-semibold text-secondary">
            Pilih Paket Umrah
          </h2>

          <p className="mt-2 text-gray-500">
            Silakan pilih paket umrah terlebih dahulu
            untuk melihat biaya operasional.
          </p>
        </div>
      ) : (
        <Table
          headers={[
            "Tanggal",
            "Keterangan",
            "Nominal",
            "Aksi",
          ]}
          data={tableData}
        />
      )}
    </section>
  );
}