"use client";
import Button from "@/src/components/atoms/button.component";
import Table from "@/src/components/atoms/table.component";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ChevronDown, Plus } from "lucide-react";
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
  bukti: string | null;
  dibayar_oleh: "admin" | "petugas";
  petugas_id: number | null;
};

const BiayaOperasionalPage = () => {
  const [paketUmrah, setPaketUmrah] = useState<PaketUmrah[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPaket, setSelectedPaket] = useState(
    searchParams.get("paketId") || "",
  );
  const [biayaOperasional, setBiayaOperasional] = useState<BiayaOperasional[]>(
    [],
  );

  

  useEffect(() => {
    const getPaket = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/paket-umrah");

        const data = await response.json();

        setPaketUmrah(data);
      } catch (error) {
        console.log(error);
      }
    };

    getPaket();
  }, []);

  useEffect(() => {
    const getBiayaOperasional = async () => {
      if (!selectedPaket) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/biaya-operasional?paket_id=${selectedPaket}`,
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
    const value = event.target.value;

    setSelectedPaket(value);

    router.replace(`/admin/biaya-operasional?paketId=${value}`);
  };

  const formatRupiah = (nominal: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(nominal);
  };

  const formatTanggal = (tanggal: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(tanggal));
  };

  const tableData = biayaOperasional.map((item) => [
    formatTanggal(item.tanggal),
    item.keterangan,
    formatRupiah(item.nominal),
    item.dibayar_oleh === "admin" ? "Admin" : "Petugas",
    <Button
      key={item.id}
      label="Detail"
      radius="oval"
      variant="contained"
      onClick={() => router.push(`/admin/biaya-operasional/detail/${item.id}`)}
    />,
  ]);

  return (
    <section className="p-8 bg-sab-bg-gray min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Biaya Operasional</h1>
        {selectedPaket && (
          <Button
            label="Tambah"
            prefix={<Plus size={18} />}
            variant="contained"
            onClick={() =>
              router.push(
                `/admin/biaya-operasional/add?paketId=${selectedPaket}`,
              )
            }
          />
        )}
        <FormControl size="small">
          <Select
            displayEmpty
            value={selectedPaket}
            onChange={handlePaketChange}
            renderValue={(selected) => {
              if (!selected) return "Pilih Paket Umrah";

              const paket = paketUmrah.find(
                (item) => String(item.id) === selected,
              );

              return paket?.nama_paket ?? "Pilih Paket Umrah";
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
              <MenuItem key={paket.id} value={String(paket.id)}>
                {paket.nama_paket}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {!selectedPaket ? (
        <div className="mt-8 rounded-xl bg-white p-12 shadow text-center">
          <h2 className="text-xl font-semibold text-secondary">
            Pilih Paket Umrah
          </h2>

          <p className="mt-2 text-gray-500">
            Silakan pilih paket umrah terlebih dahulu untuk melihat dan
            menambahkan biaya operasional.
          </p>
        </div>
      ) : (
        <Table
          headers={["Tanggal", "Keterangan", "Nominal", "Dibayar Oleh", "Aksi"]}
          data={tableData}
        />
      )}
    </section>
  );
};

export default BiayaOperasionalPage;
