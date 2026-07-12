"use client";

import Card from "@/src/components/atoms/card.component";
import Input from "@/src/components/atoms/text-input.component";
import Table from "@/src/components/atoms/table.component";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Calendar, Hotel, Plane, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PaketUmrah = {
  id: number;
  nama_paket: string;
  jadwal_keberangkatan: string;
  maskapai: string;
  durasi_perjalanan: string;
  hotel: string;
  total_kuota: number;
};

type Jamaah = {
  id: number;
  nama: string;
  jenis_kelamin: string;
  nomor_hp: string;
};

const InformasiKloterPage = () => {
  const [paketUmrah, setPaketUmrah] = useState<PaketUmrah[]>([]);
  const [selectedPaket, setSelectedPaket] = useState("");

  const [detailPaket, setDetailPaket] =
    useState<PaketUmrah | null>(null);

  const [jamaah, setJamaah] = useState<Jamaah[]>([]);

  const [search, setSearch] = useState("");

  // ===========================
  // GET PAKET UMRAH
  // ===========================
  useEffect(() => {
    const getPaket = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah`
        );

        const data = await response.json();

        setPaketUmrah(data);

        if (data.length > 0) {
          setSelectedPaket(String(data[0].id));
        }
      } catch (err) {
        console.log(err);
      }
    };

    getPaket();
  }, []);

//jamaah
useEffect(() => {
  if (!selectedPaket || paketUmrah.length === 0) return;

  const getInformasiKloter = async () => {
    try {
      // Ambil detail paket dari state paketUmrah
      const paket = paketUmrah.find(
        (item) => String(item.id) === selectedPaket
      );

      if (paket) {
        setDetailPaket(paket);
      }

      // Ambil daftar jamaah sesuai paket
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jamaah/paket/${selectedPaket}`
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data jamaah");
      }

      const data = await response.json();

      setJamaah(data);
    } catch (err) {
      console.error(err);
      setJamaah([]);
    }
  };

  getInformasiKloter();
}, [selectedPaket, paketUmrah]);

  const handlePaketChange = (event: SelectChangeEvent) => {
    setSelectedPaket(event.target.value);
  };

  const filteredJamaah = useMemo(() => {
    return jamaah.filter((item) =>
      item.nama
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [jamaah, search]);

  const formatTanggal = (tanggal: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(tanggal));
  };

  const tableData = filteredJamaah.map((item) => [
    item.nama,
    item.jenis_kelamin,
    item.nomor_hp,
  ]);

    return (
    <section className="min-h-screen bg-sab-bg-gray p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold text-secondary">
              Informasi Kloter
            </h1>

            <p className="text-sab-gray-500 mt-1">
              Informasi paket umrah beserta daftar jamaah.
            </p>
          </div>

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
                <MenuItem
                  key={paket.id}
                  value={String(paket.id)}
                >
                  {paket.nama_paket}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </div>

        {/* INFORMASI PAKET */}

        <Card
          bgColor="white"
          outline="primary"
          className="mb-8"
        >

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-secondary">
                {detailPaket?.nama_paket}
              </h2>

              <p className="text-sab-gray-500 mt-1">
                Informasi keberangkatan paket umrah.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

            {/* Keberangkatan */}

            <div className="rounded-xl border border-primary p-4">

              <div className="flex items-center gap-2 text-primary mb-3">
                <Calendar size={18} />
                <span className="font-semibold">
                  Keberangkatan
                </span>
              </div>

              <p className="font-semibold">
                {detailPaket?.jadwal_keberangkatan
                  ? formatTanggal(
                      detailPaket.jadwal_keberangkatan
                    )
                  : "-"}
              </p>

            </div>

            {/* Maskapai */}

            <div className="rounded-xl border border-primary p-4">

              <div className="flex items-center gap-2 text-primary mb-3">
                <Plane size={18} />
                <span className="font-semibold">
                  Maskapai
                </span>
              </div>

              <p className="font-semibold">
                {detailPaket?.maskapai || "-"}
              </p>

            </div>

            {/* Hotel */}

            <div className="rounded-xl border border-primary p-4">

              <div className="flex items-center gap-2 text-primary mb-3">
                <Hotel size={18} />
                <span className="font-semibold">
                  Hotel
                </span>
              </div>

              <p className="font-semibold">
                {detailPaket?.hotel || "-"}
              </p>

            </div>

            {/* Kuota */}

            <div className="rounded-xl border border-primary p-4">

              <div className="flex items-center gap-2 text-primary mb-3">
                <Users size={18} />
                <span className="font-semibold">
                  Kuota Jamaah
                </span>
              </div>

              <p className="font-semibold">
                {jamaah.length} / {detailPaket?.total_kuota ?? 0}
              </p>

            </div>

          </div>

        </Card>

        {/* DAFTAR JAMAAH */}

        <Card
          bgColor="white"
          outline="primary"
        >

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

            <div>

              <h2 className="text-xl font-bold text-secondary">
                Daftar Jamaah
              </h2>

              <p className="text-sab-gray-500">
                Jamaah yang terdaftar pada paket ini.
              </p>

            </div>

            <div className="relative w-full md:w-72">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                className="pl-11"
                placeholder="Cari nama jamaah..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          <Table
            headers={[
              "Nama Jamaah",
              "Jenis Kelamin",
              "Nomor HP",
            ]}
            data={tableData}
          />

        </Card>

      </div>
    </section>
  );
};

export default InformasiKloterPage;