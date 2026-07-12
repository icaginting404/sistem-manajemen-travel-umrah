"use client";
import Button from "@/src/components/atoms/button.component";
import Card from "@/src/components/atoms/card.component";
import Input from "@/src/components/atoms/text-input.component";
import { MinusCircle, PlusCircle, Upload, X } from "lucide-react";
import { useRef } from "react";
import { Dayjs } from "dayjs";
import DateInput from "@/src/components/atoms/date-input.component";

const SelectInput = ({
  label,
  value,
  onChange, 
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onCancel?: () => void;
  options: { label: string; value: string }[];
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sab-gray-500 font-medium">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-2 border-primary rounded-full px-4 py-2 outline-none text-sm w-full bg-white focus:ring-2 focus:ring-yellow-200"
    >
      <option value="" disabled>Pilih status...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const FileUploadInput = ({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | string | null;
  onChange: (file: File | string | null) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const isOldFile = typeof file === "string";

  const fileName = () => {
    if (!file) return "Upload Berkas";

    if (typeof file === "string") {
      return file.split("/").pop();
    }

    return file.name;
  };

  const fileUrl = isOldFile
  ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${file}`
  : "";

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-medium text-sab-gray-500">
        {label}
      </label>

      <div className="flex items-center border-2 border-primary rounded-full px-4 py-2 text-sm text-gray-500 w-full">
        
        {/* Kalau masih flyer lama */}
        {isOldFile ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate flex-1 cursor-pointer hover:underline"
          >
            {fileName()}
          </a>
        ) : (
          <>
            {/* kalau belum ada file */}
            {!file ? (
              <button
                type="button"
                onClick={() => ref.current?.click()}
                className="text-left flex flex-row gap-2 items-center"
              >
                <Upload size={18} className="text-primary" />
                Upload Berkas
              </button>
            ) : (
              <span className="truncate flex-1">
                {fileName()}
              </span>
            )}
          </>
        )}

        {file && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="ml-2 text-black hover:text-red-500"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) =>
          onChange(e.target.files?.[0] ?? null)
        }
      />
    </div>
  );
};

const DynamicListInput = ({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) => {
  const add = () => onChange([...items, ""]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Label + tombol tambah/kurang */}
      <div className="flex items-center gap-2">
        <label className="font-medium text-sab-gray-500">{label}</label>
        <button type="button" onClick={add} className="text-primary hover:text-primary/70">
          <PlusCircle size={18} />
        </button>
        {items.length > 1 && (
          <button type="button" onClick={() => remove(items.length - 1)} className="text-red-400 hover:text-red-500">
            <MinusCircle size={18} />
          </button>
        )}
      </div>
      {/* List input */}
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              variant="primary"
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
            />
            {items.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-500 flex-shrink-0">
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export type PaketFormData = {
  namaPaket: string;
  jadwalKeberangkatan: Dayjs | null;
  harga: string;
  durasiPerjalanan: string;
  hotel: string;
  totalKuota: string;
  maskapai: string;
  statusPaket: string;
  flyer: File | string | null;
  fasilitas: string[];
  tidakTermasukHarga: string[];
};

type PaketFormProps = {
  formData: PaketFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<PaketFormData>
  >;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  errorMsg: string | null;
  submitLabel: string;
  onCancel?: () => void;
};

const PaketForm = ({
  formData,
  setFormData,
  handleSubmit,
  isSubmitting,
  errorMsg,
  submitLabel,
  onCancel,
}: PaketFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <Card bgColor="white" shadow className="mt-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <Input
              label="Nama Paket Umroh"
              variant="primary"
              placeholder="Contoh: Paket Ramadhan"
              value={formData.namaPaket}
              onChange={(e) => setFormData({ ...formData, namaPaket: e.target.value })}
            />
            <DateInput
              label="Jadwal Keberangkatan"
              value={formData.jadwalKeberangkatan}
              onChange={(value) =>
                setFormData({
                ...formData,
                jadwalKeberangkatan: value,
                })
              }
            />
            <Input
              label="Harga"
              variant="primary"
              type="number"
              placeholder="Contoh: 25000000"
              value={formData.harga}
              onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
            />
            <Input
              label="Durasi Perjalanan"
              variant="primary"
              placeholder="Contoh: 9 Hari 8 Malam"
              value={formData.durasiPerjalanan}
              onChange={(e) => setFormData({ ...formData, durasiPerjalanan: e.target.value })}
            />
            <Input
              label="Hotel"
              variant="primary"
              placeholder="Contoh: Hotel Hilton Makkah"
              value={formData.hotel}
              onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
            />
            <Input
              label="Total Kuota"
              variant="primary"
              type="number"
              placeholder="Contoh: 40"
              value={formData.totalKuota}
              onChange={(e) => setFormData({ ...formData, totalKuota: e.target.value })}
            />
            <Input
              label="Maskapai"
              variant="primary"
              placeholder="Contoh: Garuda Indonesia"
              value={formData.maskapai}
              onChange={(e) => setFormData({ ...formData, maskapai: e.target.value })}
            />
            <FileUploadInput
              label="Upload Flyer"
              file={formData.flyer}
              onChange={(f) => setFormData({ ...formData, flyer: f })}
            />
            <SelectInput
              label="Status Paket"
              value={formData.statusPaket}
              onChange={(v) => setFormData({ ...formData, statusPaket: v })}
              options={[
                { label: "Aktif", value: "aktif" },
                { label: "Tidak Aktif", value: "tidak_aktif" },
                { label: "Penuh", value: "penuh" },
              ]}
            />
          </div>

          <hr className="my-6 border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <DynamicListInput
              label="Fasilitas / Benefit"
              items={formData.fasilitas}
              onChange={(v) => setFormData({ ...formData, fasilitas: v })}
              placeholder="Contoh: Makan 3x sehari"
            />
            <DynamicListInput
              label="Tidak Termasuk Harga"
              items={formData.tidakTermasukHarga}
              onChange={(v) => setFormData({ ...formData, tidakTermasukHarga: v })}
              placeholder="Contoh: Vaksin Meningitis"
            />
          </div>
      </Card>

      {errorMsg && (
        <p className="text-red-500 text-sm mt-4">
          {errorMsg}
        </p>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button
          label="Cancel"
          type="button"
          variant="contained"
          color="secondary"
          onClick={onCancel}
        />
        <Button
          label={submitLabel}
          color="primary"
          variant="contained"
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};

export default PaketForm;