import Navbar from "@/src/components/UI/navbar.component";
import { SquarePen, Handbag, CalendarDays, LogOut } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar
        menus={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Paket Umrah",
            href: "/paket-umrah",
          },
          {
            label: "Galeri",
            href: "/galeri",
          },
          {
            label: "Kontak",
            href: "/kontak",
          },
        ]}
        dropdownItems={[
          {
            label: "Edit Profile",
            icon: <SquarePen size={18} />,
            href: "/jamaah/profile",
          },
          {
            label: "Pesanan Saya",
            icon: <Handbag size={18} />,
            href: "/jamaah/pesanan",
          },
          {
            label: "Jadwal Manasik",
            icon: <CalendarDays size={18} />,
            href: "/jamaah/jadwal-manasik",
          },
          {
            label: "Jadwal Kegiatan",
            icon: <CalendarDays size={18} />,
            href: "/jamaah/kegiatan",
          },
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
