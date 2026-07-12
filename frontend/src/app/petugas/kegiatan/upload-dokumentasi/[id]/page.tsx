"use client";
import Button from "@/src/components/atoms/button.component";
import Modal from "@/src/components/atoms/modal.component";
import Input from "@/src/components/atoms/text-input.component";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface DetailKegiatan {
  id: number;
  nama: string;
  lokasi: string;
  dokumentasi: string;
}

const UploadDokumentasiPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const route = useRouter();
  const params = useParams();

  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [loading, setLoading] = useState(false);

  // GET NAMA KEGIATAN
  useEffect(() => {
    const getNamaKegiatan = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/kegiatan/detail/${params.id}`,
        );
        const data = await response.json();

        setNamaKegiatan(data.nama);
      } catch (error) {
        console.error("Error fetching kegiatan data:", error);
      } finally {
        setLoading(false);
      }
    };

    getNamaKegiatan();
  }, [params.id]);

  // HANDLE UPLOAD DOKUMENTASI
  const handelSubmit = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("dokumentasi", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/kegiatan/detail/${params.id}/dokumentasi`,
      {
        method: "POST",
        body: formData,
      },
    );
    const result = await response.json();

    alert(result.message);
    route.back();
  };
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-secondary">Upload Dokumentasi</h1>
        <Input
          label="Kegiatan"
          variant="primary"
          disabled
          value={loading ? "Loading..." : namaKegiatan}
        />
        <Input
          label="Upload Dokumentasi"
          placeholder="Pilih file"
          variant="primary"
          type="file"
          onChange={(e) => {
            const selectedFile = e.target.files && e.target.files[0];

            if (selectedFile) {
              setFile(selectedFile);
            }
          }}
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button
          label="Batal"
          color="secondary"
          variant="contained"
          onClick={() => route.back()}
        />
        <Button
          label="Kirim"
          color="primary"
          variant="contained"
          onClick={handelSubmit}
        />
      </div>
    </Modal>
  );
};

export default UploadDokumentasiPage;
