"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/UI/navbar.component";
import { SquarePen, Handbag, CalendarDays, LogOut } from "lucide-react";

export default function JamaahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [punyaPaket, setPunyaPaket] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const userData = localStorage.getItem("user");

      if (!userData) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(userData);

      if (user.role !== "jamaah") {
        router.push("/");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/jamaah/status-paket/${user.id}`,
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil status paket");
        }

        const data = await response.json();

        setPunyaPaket(data.punyaPaket);
      } catch (error) {
        console.log(error);
      }
    };

    checkUser();
  }, [router]);

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

          ...(punyaPaket
            ? [
                {
                  label: "Jadwal Kegiatan",
                  icon: <CalendarDays size={18} />,
                  href: "/jamaah/kegiatan",
                },
              ]
            : []),

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
