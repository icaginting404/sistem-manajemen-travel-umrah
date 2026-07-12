"use client";
import { useEffect, useState } from "react";
import {
  SquarePen,
  Handbag,
  CalendarDays,
  LogOut,
} from "lucide-react";
import Navbar from "@/src/components/UI/navbar.component";

export default function Home() {
  return (
    <section className="min-h-screen bg-sab-bg-gray">
      <div className="container mx-auto py-20">
        <h1 className="text-4xl font-bold">
          Selamat Datang di Syifa Amanah Baitullah
        </h1>

        <p className="mt-4 text-gray-600">
          Travel Umrah terpercaya untuk perjalanan ibadah Anda.
        </p>
      </div>
    </section>
  );
}
