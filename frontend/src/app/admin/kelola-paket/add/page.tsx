"use client";
import PaketForm, { PaketFormData } from "@/src/components/forms/paket.component";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";

const TambahPaketUmrahPage = () => {
  const router = useRouter();
  const { toast, showToast, closeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] =
  useState<PaketFormData>({
    namaPaket: "",
    jadwalKeberangkatan: null,
    harga: "",
    durasiPerjalanan: "",
    hotel: "",
    totalKuota: "",
    maskapai: "",
    statusPaket: "",
    flyer: null,
    fasilitas: [""],
    tidakTermasukHarga: [""],
  });

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.namaPaket.trim()) {
      return setErrorMsg("Nama paket wajib diisi.");
    }

    if (!formData.jadwalKeberangkatan) {
      return setErrorMsg("Jadwal keberangkatan wajib diisi.");
    }

    if (!formData.harga || isNaN(Number(formData.harga))) {
      return setErrorMsg("Harga harus berupa angka.");
    }

    if (!formData.totalKuota || isNaN(Number(formData.totalKuota))) {
      return setErrorMsg("Total kuota harus berupa angka.");
    }

    if (!formData.statusPaket) {
      return setErrorMsg("Status paket wajib dipilih.");
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();

      payload.append("nama_paket", formData.namaPaket);

      payload.append( "jadwal_keberangkatan", formData.jadwalKeberangkatan.toISOString());

      payload.append("harga", formData.harga);

      payload.append("durasi_perjalanan", formData.durasiPerjalanan);

      payload.append("hotel", formData.hotel);

      payload.append("total_kuota", formData.totalKuota);

      payload.append("maskapai", formData.maskapai);

      payload.append("status_paket", formData.statusPaket);

      payload.append("fasilitas", JSON.stringify(formData.fasilitas.filter((f) => f.trim())));

      payload.append("tidak_termasuk_harga", JSON.stringify(formData.tidakTermasukHarga.filter((t) => t.trim())));

      if (formData.flyer) {
        payload.append("flyer", formData.flyer);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah`,
        {
          method: "POST",
          body: payload,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Gagal menambahkan paket"
        );
      }

      showToast("Paket berhasil ditambahkan", "success");

      setTimeout(() => {
          router.push("/admin/kelola-paket");
      }, 800);
    } catch (error) {
      console.log(error);

      const message =
          error instanceof Error
              ? error.message
              : "Terjadi kesalahan";

      setErrorMsg(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="p-6 bg-sab-bg-gray min-h-screen  mb-2">
      <h1 className="text-2xl md:text-2xl ml-2 font-bold text-secondary">
          Kelola Paket Umrah
      </h1>
      <PaketForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errorMsg={errorMsg}
        onCancel={() => router.push("/admin/kelola-paket")}
        submitLabel={
          isSubmitting
            ? "Menyimpan..."
            : "Kirim"
        }
      />
      <ToastComponent
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </section>
  );
};

export default TambahPaketUmrahPage;