"use client";
import Button from "@/src/components/atoms/button.component";
import DateInput from "@/src/components/atoms/date-input.component";
import Modal from "@/src/components/atoms/modal.component";
import Input from "@/src/components/atoms/text-input.component";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function TambahKegiatanPageContent() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const paketId = searchParams.get("paketId");
  console.log("paketId:", paketId);
  const [namaPaket, setNamaPaket] = useState("");

  const [formData, setFormData] = useState({
    tanggal: "",
    kegiatan: [
      {
        nama: "",
        lokasi: "",
      },
    ],
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

  const tambahFormKegiatan = () => {
    setFormData({
      ...formData,
      kegiatan: [
        ...formData.kegiatan,
        {
          nama: "",
          lokasi: "",
        },
      ],
    });
  };

  const hapusFormKegiatan = (index: number) => {
    if (formData.kegiatan.length === 1) return;

    const data = [...formData.kegiatan];
    data.splice(index, 1);

    setFormData({
      ...formData,
      kegiatan: data,
    });
  };

  const updateKegiatan = (
    index: number,
    field: "nama" | "lokasi",
    value: string,
  ) => {
    const data = [...formData.kegiatan];

    data[index][field] = value;

    setFormData({
      ...formData,
      kegiatan: data,
    });
  };

  const tambahKegiatan = async () => {
    try {
      const payload = {
        paket_id: Number(paketId),
        tanggal: formData.tanggal,
        kegiatan: formData.kegiatan,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kegiatan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

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

          <div className="flex flex-col gap-6">
            {formData.kegiatan.map((item, index) => (
              <div key={index} className="border border-primary rounded-xl p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-secondary">
                    Kegiatan {index + 1}
                  </h2>

                  {formData.kegiatan.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 text-sm hover:underline"
                      onClick={() => hapusFormKegiatan(index)}
                    >
                      Hapus
                    </button>
                  )}
                </div>

                <Input
                  label="Nama Kegiatan"
                  variant="primary"
                  value={item.nama}
                  placeholder="Masukkan kegiatan"
                  onChange={(e) =>
                    updateKegiatan(index, "nama", e.target.value)
                  }
                />

                <div className="mt-3">
                  <Input
                    label="Lokasi"
                    variant="primary"
                    value={item.lokasi}
                    placeholder="Masukkan lokasi"
                    onChange={(e) =>
                      updateKegiatan(index, "lokasi", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <Button
            color="primary"
            variant="outline"
            label="+ Tambah Kegiatan"
            onClick={tambahFormKegiatan}
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
}

export default function TambahKegiatanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TambahKegiatanPageContent />
    </Suspense>
  );
}
