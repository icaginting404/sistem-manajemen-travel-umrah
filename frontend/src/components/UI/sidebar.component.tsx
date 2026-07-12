"use client";

import {
  CalendarDays,
  ClipboardPen,
  Maximize2,
  Package,
  ShoppingBag,
  Users,
  Wallet,
  X,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menus = [
  { label: "Kelola Jamaah", href: "/admin/kelola-jamaah", icon: Users },
  {
    label: "Kelola Paket Umrah",
    href: "/admin/kelola-paket",
    icon: Package,
  },
  {
    label: "Pesanan",
    href: "/admin/kelola-pesanan",
    icon: ShoppingBag,
  },
  {
    label: "Biaya Operasional",
    href: "/admin/biaya-operasional",
    icon: Wallet,
  },
  {
    label: "Daftar Kegiatan",
    href: "/admin/kegiatan",
    icon: ClipboardPen,
  },
  {
    label: "Jadwal Manasik",
    href: "/admin/jadwal-manasik",
    icon: CalendarDays,
  },
  {
    label: "Kelola Petugas",
    href: "/admin/kelola-petugas",
    icon: Users,
  },
];

export default function SidebarComponent() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`flex h-full flex-col bg-primary px-5 py-6${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div
        className={`mb-8 flex ${isCollapsed ? "items-center" : "justify-end"}`}
      >
        <button
          className="rounded-md p-1 transition hover:bg-black/10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Maximize2 size={20} /> : <XIcon size={20} />}
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {menus.map((menu) => {
          const isActive = pathname === menu.href;
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive ? "bg-white/30 font-semibold " : "hover:bg-white/20"
              }`}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{menu.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
