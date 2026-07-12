import Navbar from "@/src/components/UI/navbar.component";
import { LogOut, SquarePen } from "lucide-react";

export default function PetugasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar
        menus={[
          {
            label: "Informasi Kloter",
            href: "/petugas/informasi-kloter",
          },
          {
            label: "Jadwal Kegiatan",
            href: "/petugas/kegiatan",
          },
          {
            label: "Biaya Operasional",
            href: "/petugas/biaya-operasional",
          },
        ]}
        dropdownItems={[
          {
            label: "Keluar",
            icon: <LogOut size={18} />,
            danger: true,
            divider: true,
          },
        ]}
      />

      <main>{children}</main>
    </>
  );
}
