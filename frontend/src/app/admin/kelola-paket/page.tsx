"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/src/components/atoms/button.component";
import Table from "@/src/components/atoms/table.component";
import { SquarePen, Plus, Trash2, Eye } from "lucide-react";
import Modal from "@/src/components/atoms/modal.component";
import InfoRow from "@/src/components/atoms/info-row.component";
import ToastComponent from "@/src/components/atoms/toast.component";
import ConfirmationModal from "@/src/components/atoms/confirmation-modal.component";
import useToast from "@/src/hooks/use-toast";
import StatusBadge from "@/src/components/atoms/status-badge.component";

type PaketUmrah = {
  id: number;
  nama_paket: string;
  jadwal_keberangkatan: string;
  harga: number;
  durasi_perjalanan: string;
  hotel: string;
  total_kuota: number;
  maskapai: string;
  status_paket: string;
  flyer: string;
  fasilitas: string;
  tidak_termasuk_harga: string;
};

const KelolaPaketPage = () => {
  const router = useRouter();

  const [paket, setPaket] = useState<PaketUmrah[]>([]);
  const [selectedPaket, setSelectedPaket] = useState<PaketUmrah | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setLoading] = useState(true);
  const { toast, showToast, closeToast } = useToast();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  //Fetch Data
  useEffect(() => {
    window.scrollTo(0, 0);
    const getData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();
        console.log(data);

        if (Array.isArray(data)) {
          setPaket(data);
        } else {
          setPaket([]);
        }

      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data paket",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleDetail = (item: PaketUmrah) => {
    setSelectedPaket(item);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedDeleteId === null) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah/${selectedDeleteId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Gagal menghapus paket"
        );
      }

      setPaket((prev) =>
        prev.filter(
          (item) => item.id !== selectedDeleteId
        )
      );

      setOpenDelete(false);
      setSelectedDeleteId(null);

      showToast(
        "Paket berhasil dihapus",
        "success"
      );

    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Gagal menghapus paket",
        "error"
      );
    }
  };

  //Table Header
  const headers = [
    "No",
    "Nama Paket",
    "Jadwal Keberangkatan",
    "Harga",
    "Durasi",
    "Kuota",
    "Status",
    "Aksi",
  ];

  //Table Data
  const tableData = paket.map((item, index) => [
    String(index + 1),
    String(item.nama_paket),

    new Date(item.jadwal_keberangkatan).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),

    `Rp ${Number(item.harga).toLocaleString("id-ID")}`,
    String(item.durasi_perjalanan),
    `${item.total_kuota} orang`,
    <StatusBadge
      key={`status-${item.id}`}
      status={item.status_paket}
    />,

    <div key={item.id} className="flex items-center gap-2">
      <Button
        color="primary"
        label=""
        prefix={<Eye size={16} />}
        onClick={() => handleDetail(item)}
        type="button"
        variant="text"
        className="!px-1" 
      />
      <Button
        color="primary"
        label=""
        prefix={<SquarePen size={16} />}
        onClick={() => router.push(`/admin/kelola-paket/edit/${item.id}`)}
        type="button"
        variant="text"
        className="!px-1" 
      />
      <Button
        type="button"
        variant="text"
        color="danger"
        label=""
        className="!px-1"
        prefix={<Trash2 size={16} />}
        onClick={() => {
          setSelectedDeleteId(item.id);
          setOpenDelete(true);
        }}
      />
    </div>,
  ]);

  return (
    <section className="p-6 bg-sab-bg-gray min-h-screen">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl md:text-2xl ml-2 font-bold text-secondary">
          Kelola Paket Umrah
        </h1>

        <Button
          label="Tambah"
          prefix={<Plus size={18} />}
          radius="oval"
          onClick={() => router.push("/admin/kelola-paket/add")}
          className="mr-5"
        />
      </div>

      <Table headers={headers} data={tableData} />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {selectedPaket && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">
              Detail Paket Umrah
            </h2>

            <div className="space-y-2">
              <InfoRow
                label="Nama Paket"
                value={selectedPaket.nama_paket}
              />

              <InfoRow
                label="Harga"
                value={`Rp ${Number(
                  selectedPaket.harga
                ).toLocaleString("id-ID")}`}
              />

              <InfoRow
                label="Jadwal"
                value={new Date(
                  selectedPaket.jadwal_keberangkatan
                ).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />

              <InfoRow
                label="Durasi"
                value={selectedPaket.durasi_perjalanan}
              />

              <InfoRow
                label="Kuota"
                value={`${selectedPaket.total_kuota} Orang`}
              />
              
              <InfoRow
                  label="Status"
                  value={<StatusBadge status={selectedPaket.status_paket} />}
              />

              <InfoRow
                label="Hotel"
                value={selectedPaket.hotel}
              />

              <InfoRow
                label="Maskapai"
                value={selectedPaket.maskapai}
              />
            </div>

            {/* Flyer */}
            {selectedPaket.flyer && (
              <div>
                <p className="font-bold text-sab-gray-500 mb-2">
                  Flyer
                </p>

                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${selectedPaket.flyer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Lihat Flyer
                </a>
              </div>
            )}

            {/* Fasilitas */}
            <div>
              <h3 className="font-bold text-lg mb-2">
                Fasilitas / Benefit
              </h3>

              <ul className="list-disc pl-5 space-y-1">
                {JSON.parse(selectedPaket.fasilitas).map(
                  (item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  )
                )}
              </ul>
            </div>

            {/* Exclude */}
            <div>
              <h3 className="font-bold text-lg mb-2">
                Tidak Termasuk Harga
              </h3>

              <ul className="list-disc pl-5 space-y-1">
                {JSON.parse(
                  selectedPaket.tidak_termasuk_harga
                ).map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmationModal
        open={openDelete}
        title="Hapus Paket Umrah"
        description="Apakah Anda yakin ingin menghapus paket umrah ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onCancel={() => {
          setOpenDelete(false);
          setSelectedDeleteId(null);
        }}
        onConfirm={handleDelete}
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

export default KelolaPaketPage;