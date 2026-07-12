import BiayaOperasional from "../model/biayaoperasionalModel.js";
import fs from "fs";
import path from "path";

export const create = async (req, res) => {
  try {
    const { paket_umrah_id, tanggal, keterangan, nominal } = req.body;

    let bukti = null;

    if (req.file) {
      bukti = req.file.filename;
    }

    await BiayaOperasional.create({
      paket_umrah_id,
      petugas_id: null,
      tanggal,
      keterangan,
      nominal,
      bukti,
      dibayar_oleh: "admin",
    });

    res.status(201).json({
      message: "Biaya operasional berhasil ditambahkan.",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const createPetugas = async (req, res) => {
  try {
    const { paket_umrah_id, petugas_id, tanggal, keterangan, nominal } =
      req.body;

    let bukti = null;

    if (req.file) {
      bukti = req.file.filename;
    }

    await BiayaOperasional.create({
      paket_umrah_id,
      petugas_id,
      tanggal,
      keterangan,
      nominal,
      bukti,
      dibayar_oleh: "petugas",
    });

    res.status(201).json({
      message: "Biaya operasional berhasil ditambahkan.",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await BiayaOperasional.getAll(req.query.paket_id);

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getByPetugas = async (req, res) => {
  try {
    const data = await BiayaOperasional.getByPetugas(
      req.query.petugas_id,
      req.query.paket_id,
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await BiayaOperasional.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Data tidak ditemukan.",
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const lama = await BiayaOperasional.getById(req.params.id);

    if (!lama) {
      return res.status(404).json({
        message: "Data tidak ditemukan.",
      });
    }

    let bukti = lama.bukti;

    if (req.file) {
      bukti = req.file.filename;
    }

    const { tanggal, keterangan, nominal } = req.body;

    await BiayaOperasional.update(req.params.id, {
      tanggal,
      keterangan,
      nominal,
      bukti,
    });

    res.json({
      message: "Biaya operasional berhasil diubah.",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const data = await BiayaOperasional.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Data tidak ditemukan.",
      });
    }

    if (data.bukti) {
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "biaya-operasional",
        data.bukti,
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await BiayaOperasional.remove(req.params.id);

    res.json({
      message: "Biaya operasional berhasil dihapus.",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};
