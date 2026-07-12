"use client";
import Button from "@/src/components/atoms/button.component";
import DateInput from "@/src/components/atoms/date-input.component";
import Modal from "@/src/components/atoms/modal.component";
import Input from "@/src/components/atoms/text-input.component";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const TambahKegiatanPage = () => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const paketId = searchParams.get("paketId");
  console.log("paketId:", paketId);
  const [namaPaket, setNamaPaket] = useState("");

  const [formData, setFormData] = useState({
    tanggal: "",
    status: "",
    nama: "",
    lokasi: "",
  });

  useEffect(() => {
    const getPaket = async () => {
      if (!paketId) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah/${paketId}`,
        );

        const data = await response.json();

        setNamaPaket(data.nama_paket);
      } catch (error) {
        console.log(error);
      }
    };

    getPaket();
  }, [paketId]);

  const tambahKegiatan = async () => {
    try {
      const payload = {
        paket_id: Number(paketId),
        tanggal: formData.tanggal,
        status: "Belum Dimulai",
        kegiatan: [
          {
            nama: formData.nama,
            lokasi: formData.lokasi,
          },
        ],
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kegiatan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log(result);

      route.push(`/admin/kegiatan?paketId=${paketId}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section>
      {/* Modal */}
      <Modal
        isOpen={true}
        onClose={() => route.push(`/admin/kegiatan?paketId=${paketId}`)}
      >
        <h1 className="text-xl font-bold mb-4 text-secondary">
          Tambah Daftar Kegiatan
        </h1>

        <div className="flex flex-col gap-3 text-secondary">
          {/* NAMA PAKET */}
          <Input
            label="Nama Paket Umrah"
            variant="primary"
            value={namaPaket}
            disabled
          />
          {/* TANGGAL */}
          <DateInput
            label="Tanggal"
            onChange={(value) =>
              setFormData({
                ...formData,
                tanggal: value ? value.format("YYYY-MM-DD") : "",
              })
            }
          />

          {/* STATUS */}
          {/* <Input
            label="Status Agenda"
            variant="primary"
            placeholder="Belum Dimulai / Sedang Berlangsung / Selesai"
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
          /> */}

          {/* NAMA */}
          <Input
            label="Nama Kegiatan"
            variant="primary"
            placeholder="Masukkan kegiatan"
            onChange={(e) =>
              setFormData({
                ...formData,
                nama: e.target.value,
              })
            }
          />

          {/* LOKASI */}
          <Input
            label="Lokasi"
            variant="primary"
            placeholder="Masukkan lokasi"
            onChange={(e) =>
              setFormData({
                ...formData,
                lokasi: e.target.value,
              })
            }
          />
        </div>

        {/* BUTTON */}
        <div className="flex gap-2 justify-end mt-10">
          <Button
            color="secondary"
            label="Batal"
            variant="contained"
            onClick={() => route.push(`/admin/kegiatan?paketId=${paketId}`)}
          />

          <Button
            color="primary"
            label="Tambah"
            variant="contained"
            onClick={tambahKegiatan}
          />
        </div>
      </Modal>
    </section>
  );
};

export default TambahKegiatanPage;
