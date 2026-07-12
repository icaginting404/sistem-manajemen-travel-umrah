import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/dokumentasi");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|mp4|mov/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype =
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/");

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Hanya gambar atau video yang diperbolehkan"
    )
  );
};

export const uploadDokumentasi = multer({
  storage,
  fileFilter,
});