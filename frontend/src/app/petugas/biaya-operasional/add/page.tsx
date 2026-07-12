"use client";

import Button from "@/src/components/atoms/button.component";
import DateInput from "@/src/components/atoms/date-input.component";
import Modal from "@/src/components/atoms/modal.component";
import Input from "@/src/components/atoms/text-input.component";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useToast } from "@/src/context/toast.context";

function TambahBiayaOperasionalPetugasPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const paketId = searchParams.get("paketId");

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const [namaPaket, setNamaPaket] = useState("");
  const [bukti, setBukti] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    tanggal: "",
    keterangan: "",
    nominal: "",
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
      } catch (err) {
        console.log(err);
      }
    };

    getPaket();
  }, [paketId]);

  const handleSubmit = async () => {
    try {
      if (!user?.id) {
        toast.error("Data petugas tidak ditemukan.");
        return;
      }
      if (!paketId) return;

      if (
        !formData.tanggal ||
        !formData.keterangan ||
        !formData.nominal ||
        !bukti
      ) {
        toast.warning("Semua data harus diisi");
        return;
      }

      const data = new FormData();

      data.append("paket_umrah_id", paketId!);
      data.append("petugas_id", user.id);
      data.append("tanggal", formData.tanggal);
      data.append("keterangan", formData.keterangan);
      data.append("nominal", formData.nominal);
      data.append("bukti", bukti!);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/biaya-operasional/petugas`,
        {
          method: "POST",
          body: data,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      toast.success(" Biaya operasional berhasil ditambahkan.");

      router.push(`/petugas/biaya-operasional?paketId=${paketId}`);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menambahkan biaya operasional.");
    }
  };

  return (
    <section>
      <Modal isOpen={true} onClose={() => {}}>
        <h1 className="text-xl font-bold mb-4 text-secondary">
          Tambah Biaya Operasional
        </h1>

        <div className="flex flex-col gap-3 text-secondary">
          <Input
            label="Nama Paket Umrah"
            variant="primary"
            value={namaPaket}
            disabled
          />

          <DateInput
            label="Tanggal"
            onChange={(value) =>
              setFormData({
                ...formData,
                tanggal: value ? value.format("YYYY-MM-DD") : "",
              })
            }
          />

          <Input
            label="Keterangan"
            variant="primary"
            value={formData.keterangan}
            onChange={(e) =>
              setFormData({
                ...formData,
                keterangan: e.target.value,
              })
            }
          />

          <Input
            label="Nominal"
            variant="primary"
            type="number"
            value={formData.nominal}
            onChange={(e) =>
              setFormData({
                ...formData,
                nominal: e.target.value,
              })
            }
          />

          <Input
            label="Upload Bukti"
            variant="primary"
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setBukti(e.target.files[0]);
              }
            }}
          />
        </div>

        <div className="flex justify-end gap-2 mt-10">
          <Button
            color="secondary"
            label="Batal"
            variant="contained"
            onClick={() =>
              router.push(`/petugas/biaya-operasional?paketId=${paketId}`)
            }
          />

          <Button
            color="primary"
            label="Kirim"
            variant="contained"
            onClick={handleSubmit}
          />
        </div>
      </Modal>
    </section>
  );
}

export default function TambahBiayaOperasionalPetugasPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TambahBiayaOperasionalPetugasPageContent />
    </Suspense>
  );
}
