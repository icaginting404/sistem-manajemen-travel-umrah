import PenugasanPetugas from "../model/penugasanpetugasModel.js";

export const getByPetugas = async (req, res) => {
  try {
    const data = await PenugasanPetugas.getByPetugas(req.params.petugasId);

    res.json(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const { petugas_id, paket_umrah_id } = req.body;

    if (!petugas_id || !paket_umrah_id) {
      return res.status(400).json({
        message: "Data tidak lengkap.",
      });
    }

    const duplicate = await PenugasanPetugas.checkDuplicate(
      petugas_id,
      paket_umrah_id,
    );

    if (duplicate) {
      return res.status(400).json({
        message: "Petugas sudah ditugaskan pada paket ini.",
      });
    }

    await PenugasanPetugas.create({
      petugas_id,
      paket_umrah_id,
    });

    res.json({
      message: "Penugasan berhasil ditambahkan.",
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
    const result = await PenugasanPetugas.delete(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      message: "Penugasan berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
