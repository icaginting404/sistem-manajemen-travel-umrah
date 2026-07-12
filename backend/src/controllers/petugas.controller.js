import bcrypt from "bcryptjs";
import Petugas from "../model/petugasModel.js";

export const create = async (req, res) => {
  try {
    const { nama, email, nomor_hp, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await Petugas.create({
      nama,
      email,
      nomor_hp,
      password: hashedPassword,
    });

    res.json({
      message: "Petugas berhasil ditambahkan",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await Petugas.getAll();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await Petugas.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Petugas tidak ditemukan",
      });
    }

    res.json(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};
