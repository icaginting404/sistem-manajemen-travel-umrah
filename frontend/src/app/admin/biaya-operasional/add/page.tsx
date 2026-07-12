"use client";

import Button from "@/src/components/atoms/button.component";
import DateInput from "@/src/components/atoms/date-input.component";
import Modal from "@/src/components/atoms/modal.component";
import Input from "@/src/components/atoms/text-input.component";
import { useToast } from "@/src/context/toast.context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TambahBiayaOperasionalPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const paketId = searchParams.get("paketId");

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
          `${process.env.NEXT_PUBLIC_API_URL}/paket-umrah/${paketId}`,
        );

        const data = await response.json();

        setNamaPaket(data.nama_paket);
      } catch (error) {
        console.log(error);
        toast.error("Gagal mengambil data paket.");
      }
    };

    getPaket();
  }, [paketId, toast]);

  const handleSubmit = async () => {
    if (!paketId) {
      toast.error("Paket umrah tidak ditemukan.");
      return;
    }

    if (
      !formData.tanggal ||
      !formData.keterangan ||
      !formData.nominal ||
      !bukti
    ) {
      toast.warning("Semua data harus diisi.");
      return;
    }

    try {
      const data = new FormData();

      data.append("paket_umrah_id", paketId);
      data.append("tanggal", formData.tanggal);
      data.append("keterangan", formData.keterangan);
      data.append("nominal", formData.nominal);
      data.append("bukti", bukti);

      const response = await fetch("http://localhost:5000/biaya-operasional", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }
      setLoading(true);
      toast.success(result.message);

      setTimeout(() => {
        router.push(`/admin/biaya-operasional?paketId=${paketId}`);
      }, 700);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Gagal menambahkan biaya operasional.");
    }
  };

  return (
    <section>
      <Modal isOpen={true} onClose={() => {}}>
        <h1 className="mb-4 text-xl font-bold text-secondary">
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
            label="Bukti Pembayaran"
            variant="primary"
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setBukti(e.target.files[0]);
              }
            }}
          />
        </div>

        <div className="mt-10 flex justify-end gap-2">
          <Button
            color="secondary"
            label="Batal"
            variant="contained"
            onClick={() =>
              router.push(`/admin/biaya-operasional?paketId=${paketId}`)
            }
          />

          <Button
            color="primary"
            label={loading ? "Menyimpan..." : "Kirim"}
            variant="contained"
            onClick={handleSubmit}
          />
        </div>
      </Modal>
    </section>
  );
};

export default TambahBiayaOperasionalPage;
