import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import kegiatanRoute from "./routes/kegiatan.route.js";
import paketRoute from "./routes/paket.route.js";
import path from "path";
import { fileURLToPath } from "url";
import syaratKetentuanRoute from "./routes/syarat-ketentuan.route.js";
import adminRoute from "./routes/admin.route.js";
import jadwalManasikRoute from "./routes/jadwal-manasik.route.js";
import profileRoute from "./routes/profil.route.js";
import jamaahRoute from "./routes/jamaah.route.js";
import pesananRoute from "./routes/pesanan.route.js";
import biayaOperasionalRoutes from "./routes/biaya-operasional.routes.js";
import petugasRoute from "./routes/petugas.route.js";
import penugasanPetugasRoute from "./routes/penugasan-petugas.route.js";
import ownerRoute from "./routes/owner.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Umroh berjalan 🚀");
});

app.use("/api/auth", authRoute);
app.use("/kegiatan", kegiatanRoute);
app.use("/api/paket-umrah", paketRoute);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/syarat-ketentuan", syaratKetentuanRoute);
app.use("/api/admin", adminRoute);
app.use("/api/jadwal-manasik", jadwalManasikRoute);
app.use("/api/profile", profileRoute);
app.use("/api/jamaah", jamaahRoute);
app.use("/api/pesanan", pesananRoute);

app.use("/biaya-operasional", biayaOperasionalRoutes);
app.use("/petugas", petugasRoute);
app.use("/penugasan-petugas", penugasanPetugasRoute);
app.use("/api/owner", ownerRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});

console.log(process.env.MIDTRANS_SERVER_KEY);
