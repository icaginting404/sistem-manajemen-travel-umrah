"use client";

import Button from "@/src/components/atoms/button.component";
import Card from "@/src/components/atoms/card.component";
import Chip from "@/src/components/atoms/chip.component";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  Calendar,
  Circle,
  Edit,
  Hotel,
  MapPin,
  Plane,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PaketUmrah = {
  id: number;
  nama_paket: string;
};

type DetailKegiatan = {
  id: number;
  nama: string;
  lokasi: string;
  dokumentasi: string | null;
};

type Kegiatan = {
  id: number;
  paket_id: number;
  tanggal: string;
  status: string;
  kegiatan: DetailKegiatan[];
};

type ApiKegiatan = {
  id: number;
  paket_id: number;
  tanggal: string;
  status: string;
  kegiatan: string;
};

const getStatus = (tanggal: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(tanggal);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate > today) return "Belum Dimulai";
  if (eventDate < today) return "Selesai";

  return "Sedang Berlangsung";
};

const JadwalKegiatanPage = () => {
  const route = useRouter();

  const [dataKegiatan, setDataKegiatan] = useState<Kegiatan[]>([]);
  const [paketUmrah, setPaketUmrah] = useState<PaketUmrah[]>([]);
  const [selectedPaket, setSelectedPaket] = useState("");

  // GET PAKET UMRAH
  useEffect(() => {
    const getPaketUmrah = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah`);

        const data = await response.json();

        setPaketUmrah(data);

        // otomatis pilih paket pertama
        if (data.length > 0) {
          setSelectedPaket(String(data[0].id));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getPaketUmrah();
  }, []);

  // GET KEGIATAN BERDASARKAN PAKET
  useEffect(() => {
    if (!selectedPaket) return;

    const getKegiatan = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/kegiatan?paket_id=${selectedPaket}`,
        );

        const data = await response.json();

        const parsedData: Kegiatan[] = data.map((item: ApiKegiatan) => ({
          ...item,
          kegiatan:
            typeof item.kegiatan === "string"
              ? JSON.parse(item.kegiatan)
              : item.kegiatan,
        }));

        setDataKegiatan(parsedData);
      } catch (error) {
        console.log(error);
      }
    };

    getKegiatan();
  }, [selectedPaket]);

  const handlePaketChange = (event: SelectChangeEvent) => {
    setSelectedPaket(event.target.value);
  };

  const selectedPaketData = paketUmrah.find(
    (item) => String(item.id) === selectedPaket,
  );

  return (
    <section className="min-h-screen p-4 bg-sab-bg-gray">
      <div className="max-w-5xl mx-auto mt-6">
        {/* HEADER */}
        <div className="flex justify-end mb-4">
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

        {/* INFO PAKET */}
        <Card bgColor="white" outline="primary">
          <h1 className="text-2xl font-bold mb-4">
            {selectedPaketData?.nama_paket ?? "Pilih Paket Umrah"}
          </h1>

          <p className="text-gray-500 mt-2">
            Berikut merupakan rangkaian kegiatan selama perjalanan ibadah umrah
            Anda.
          </p>
        </Card>

        {/* LIST KEGIATAN */}
        <div className="flex flex-col gap-8 mt-8">
          {dataKegiatan.map((item, index) => (
            <div key={item.id} className="relative">
              <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full font-bold bg-primary text-2xl shadow-sm">
                {index + 1}
              </div>

              <Card bgColor="white" outline="primary" className="p-8">
                <div className="flex flex-col gap-5 text-secondary">
                  {/* HEADER */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} />

                        <span className="font-medium">
                          {new Date(item.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <span
                        className={`inline-flex mt-3 rounded-full px-3 py-1 text-xs font-semibold
                ${
                  getStatus(item.tanggal) === "Selesai"
                    ? "bg-green-100 text-green-700"
                    : getStatus(item.tanggal) === "Sedang Berlangsung"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
                      >
                        {getStatus(item.tanggal)}
                      </span>
                    </div>

                    <Chip
                      color="primary"
                      label={item.kegiatan[0]?.lokasi}
                      leftIcon={<MapPin size={18} />}
                      radius="full"
                    />
                  </div>

                  {/* DETAIL KEGIATAN */}
                  <div className="flex flex-col gap-4">
                    {item.kegiatan.map((kegiatanItem, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <Circle size={10} />

                          <span className="font-medium">
                            {kegiatanItem.nama}
                          </span>
                        </div>

                        <span className="text-sm text-gray-500">
                          {kegiatanItem.lokasi}
                        </span>

                        <div className="flex items-center gap-4">
                          <Button
                            color="primary"
                            label={
                              <div className="flex items-center gap-2">
                                <Edit size={18} />
                                <span>Ubah Jadwal</span>
                              </div>
                            }
                            variant="contained"
                            onClick={() =>
                              route.push(
                                `/petugas/kegiatan/edit/${item.id}/${index}`,
                              )
                            }
                          />

                          <Button
                            color="secondary"
                            label={
                              <div className="flex items-center gap-2">
                                <Upload size={18} />
                                <span>Upload Dokumentasi</span>
                              </div>
                            }
                            variant="contained"
                            onClick={() =>
                              route.push(
                                `/petugas/kegiatan/upload-dokumentasi/${kegiatanItem.id}`,
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JadwalKegiatanPage;
