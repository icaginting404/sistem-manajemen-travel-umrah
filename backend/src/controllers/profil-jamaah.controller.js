import db from "../config/db.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(
      null,
      `${Date.now()}${ext}`
    );
  },
});

export const upload = multer({
  storage,
});

//get profil jamaah
export const getProfilJamaah = (req, res) => {
  const { userId } = req.params;

  const berkasSql = `
    SELECT
      jenis_berkas,
      nama_berkas,
      file_path
    FROM berkas_jamaah
    WHERE user_id = ?
  `;

  const profilSql = `
    SELECT
      u.nama,
      u.email,
      u.nomor_hp,
      p.*
    FROM users u
    LEFT JOIN profil_jamaah p
      ON p.user_id = u.id
    WHERE u.id = ?
  `;

  const kontakSql = `
    SELECT
      nama_lengkap,
      alamat,
      hubungan,
      nomor_hp,
      urutan
    FROM kontak_darurat
    WHERE user_id = ?
    ORDER BY urutan ASC
  `;

  db.query(profilSql, [userId], (err, profilResult) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil profil",
      });
    }

    db.query(kontakSql, [userId], (err, kontakResult) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengambil kontak darurat",
        });
      }

      db.query(
        berkasSql,
        [userId],
        (err, berkasResult) => {
          if (err) {
            return res.status(500).json({
              message: "Gagal mengambil berkas",
            });
          }

          const profil = profilResult[0] || {};

          const requiredFields = [
            profil.tempat_lahir,
            profil.tanggal_lahir,
            profil.nomor_ktp,
            profil.jenis_kelamin,
            profil.alamat,
            profil.kota_kabupaten,
            profil.provinsi,
          ];

          profil.is_profile_complete = requiredFields.every(
            (field) =>
            field !== null &&
            field !== undefined &&
            String(field).trim() !== ""
          );

          profil.kontak_darurat = kontakResult;

          profil.berkas = berkasResult.map((item) => ({
            ...item,
            file_url: `http://localhost:5000/${item.file_path.replace(/\\/g, "/")}`,
          }));

          return res.json(profil);
        }
      );
    });
  });
};

//create profil jamaah
export const simpanProfilJamaah = (req, res) => {
  console.log("BODY :", req.body);
  console.log("FILES :", req.files);

  let {
    user_id: bodyUserId,
    nama_tambahan,
    tempat_lahir,
    tanggal_lahir,
    nomor_ktp,
    nomor_paspor,
    tanggal_dikeluarkan_paspor,
    tempat_dikeluarkan_paspor,
    masa_berlaku_paspor,
    jenis_kelamin,
    status_perkawinan,
    alamat,
    kota_kabupaten,
    provinsi,
    pekerjaan,

    kontak1_nama,
    kontak1_alamat,
    kontak1_hubungan,
    kontak1_telp,

    kontak2_nama,
    kontak2_alamat,
    kontak2_hubungan,
    kontak2_telp,

    deleted_files,
    
    nama,
    nomor_hp,
  } = req.body;

  const user_id = req.params.id || bodyUserId;

  const cekSql =
    "SELECT id FROM profil_jamaah WHERE user_id = ?";

  deleted_files = deleted_files
    ? JSON.parse(deleted_files)
    : [];

  const formatDate = (date) => {
    if (!date) return null;
    return date.split("T")[0];
  };

  tanggal_lahir = formatDate(tanggal_lahir);

  tanggal_dikeluarkan_paspor = formatDate(tanggal_dikeluarkan_paspor);

  masa_berlaku_paspor = formatDate(masa_berlaku_paspor);

  db.query(cekSql, [user_id], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Gagal menyimpan profil",
        error: err.message,
      });
    }

    // update
    if (result.length > 0) {
      const updateSql = `
        UPDATE profil_jamaah SET
          nama_tambahan=?,
          tempat_lahir=?,
          tanggal_lahir=?,
          nomor_ktp=?,
          nomor_paspor=?,
          tanggal_dikeluarkan_paspor=?,
          tempat_dikeluarkan_paspor=?,
          masa_berlaku_paspor=?,
          jenis_kelamin=?,
          status_perkawinan=?,
          alamat=?,
          kota_kabupaten=?,
          provinsi=?,
          pekerjaan=?
        WHERE user_id=?
      `;

      db.query(
        updateSql,
        [
          nama_tambahan,
          tempat_lahir,
          tanggal_lahir,
          nomor_ktp,
          nomor_paspor,
          tanggal_dikeluarkan_paspor,
          tempat_dikeluarkan_paspor,
          masa_berlaku_paspor,
          jenis_kelamin,
          status_perkawinan,
          alamat,
          kota_kabupaten,
          provinsi,
          pekerjaan,
          user_id,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: "Gagal update profil",
            });
          }
          
          updateDataUser(
            user_id,
            nama,
            nomor_hp,
            (err) => {
              if (err) {
                return res.status(500).json({
                  message: "Gagal update user",
                });
              }

              simpanKontakDarurat(
                user_id,
                kontak1_nama,
                kontak1_alamat,
                kontak1_hubungan,
                kontak1_telp,
                kontak2_nama,
                kontak2_alamat,
                kontak2_hubungan,
                kontak2_telp,
                (err) => {
                  if (err) {
                    return res.status(500).json({
                      message: err.message,
                    });
                  }

                  hapusBerkas(
                    user_id,
                    deleted_files,
                    (err) => {
                      if (err) {
                        return res.status(500).json({
                          message: "Gagal menghapus berkas",
                        });
                      }

                      simpanBerkas(
                        user_id,
                        req.files,
                        (err) => {
                          if (err) {
                            return res.status(500).json({
                              message: "Gagal menyimpan berkas",
                            });
                          }

                          return res.json({
                            message: "Profil berhasil diperbarui",
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }

    // insert
    else {
      const insertSql = `
        INSERT INTO profil_jamaah (
          user_id,
          nama_tambahan,
          tempat_lahir,
          tanggal_lahir,
          nomor_ktp,
          nomor_paspor,
          tanggal_dikeluarkan_paspor,
          tempat_dikeluarkan_paspor,
          masa_berlaku_paspor,
          jenis_kelamin,
          status_perkawinan,
          alamat,
          kota_kabupaten,
          provinsi,
          pekerjaan
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query( 
        insertSql,
        [
          user_id,
          nama_tambahan,
          tempat_lahir,
          tanggal_lahir,
          nomor_ktp,
          nomor_paspor,
          tanggal_dikeluarkan_paspor,
          tempat_dikeluarkan_paspor,
          masa_berlaku_paspor,
          jenis_kelamin,
          status_perkawinan,
          alamat,
          kota_kabupaten,
          provinsi,
          pekerjaan,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: "Gagal menyimpan profil",
            });
          }
          simpanKontakDarurat(
            user_id,
            kontak1_nama,
            kontak1_alamat,
            kontak1_hubungan,
            kontak1_telp,
            kontak2_nama,
            kontak2_alamat,
            kontak2_hubungan,
            kontak2_telp,
            (err) => {
              if (err) {
                return res.status(500).json({
                  message: err.message,
                });
              }
              const hapusBerkas = (
                user_id,
                deleted_files,
                callback
              ) => {
                if (deleted_files.length === 0) {
                  return callback(null);
                }

                db.query(
                  `
                    DELETE FROM berkas_jamaah
                    WHERE user_id = ?
                    AND jenis_berkas IN (?)
                  `,
                  [user_id, deleted_files],
                  callback
                );
              };

              simpanBerkas(
                user_id,
                req.files,
                (err) => {
                  if (err) {
                    return res.status(500).json({
                      message: "Gagal menyimpan berkas",
                    });
                  }
                  return res.json({
                    message: "Profil berhasil disimpan",
                  });
                }
              );
            }
          );
        }
      );
    }
  });
}

const simpanKontakDarurat = (
  user_id,
  kontak1_nama,
  kontak1_alamat,
  kontak1_hubungan,
  kontak1_telp,
  kontak2_nama,
  kontak2_alamat,
  kontak2_hubungan,
  kontak2_telp,
  callback
) => {
  if (
    !kontak1_nama ||
    !kontak1_alamat ||
    !kontak1_hubungan ||
    !kontak1_telp
  ) {
    return callback(
      new Error("Data kontak darurat 1 harus lengkap")
    );
  }

  const deleteKontakSql = `
    DELETE FROM kontak_darurat
    WHERE user_id = ?
  `;

  const insertKontakSql = `
    INSERT INTO kontak_darurat (
      user_id,
      nama_lengkap,
      alamat,
      hubungan,
      nomor_hp,
      urutan
    )
    VALUES ?
  `;

  const kontakValues = [
    [
      user_id,
      kontak1_nama,
      kontak1_alamat,
      kontak1_hubungan,
      kontak1_telp,
      1,
    ],
  ];

  if (
    kontak2_nama ||
    kontak2_alamat ||
    kontak2_hubungan ||
    kontak2_telp
  ) {
    if (
      !kontak2_nama ||
      !kontak2_alamat ||
      !kontak2_hubungan ||
      !kontak2_telp
    ) {
      return callback(
        new Error(
          "Kontak darurat 2 harus diisi lengkap atau dikosongkan semua"
        )
      );
    }

    kontakValues.push([
      user_id,
      kontak2_nama,
      kontak2_alamat,
      kontak2_hubungan,
      kontak2_telp,
      2,
    ]);
  }

  db.query(deleteKontakSql, [user_id], (err) => {
    if (err) {
      return callback(err);
    }

    db.query(
      insertKontakSql,
      [kontakValues],
      (err) => {
        if (err) {
          return callback(err);
        }

        callback(null);
      }
    );
  });
};

const hapusBerkas = (
  user_id,
  deleted_files,
  callback
) => {
  if (deleted_files.length === 0) {
    return callback(null);
  }

  db.query(
    `
      DELETE FROM berkas_jamaah
      WHERE user_id = ?
      AND jenis_berkas IN (?)
    `,
    [user_id, deleted_files],
    (err) => {
      callback(err);
    }
  );
};

const simpanBerkas = (user_id, files, callback) => {
  if (!files || Object.keys(files).length === 0) {
    return callback(null);
  }

  const jenisMap = {
    paspor: "Paspor",
    buku_nikah: "Buku Nikah",
    buku_vaksin: "Buku Vaksin",
    pas_foto: "Pas Foto",
    akta_lahir: "Akta Kelahiran",
    lainnya: "Lainnya",
  };

  const entries = Object.entries(files);

  let current = 0;

  const processNext = () => {
    if (current >= entries.length) {
      return callback(null);
    }

    const [fieldName, fileList] = entries[current++];
    const jenisBerkas = jenisMap[fieldName] || fieldName;

    if (!Array.isArray(fileList) || fileList.length === 0) {
      return processNext();
    }

    // hapus hanya file dengan jenis yang sama
    const deleteSql = `
      DELETE FROM berkas_jamaah
      WHERE user_id = ?
      AND jenis_berkas = ?
    `;

    db.query(
      deleteSql,
      [user_id, jenisBerkas],
      (err) => {
        if (err) {
          return callback(err);
        }

        const values = fileList.map((file) => [
          user_id,
          jenisBerkas,
          file.originalname,
          file.path,
        ]);

        const insertSql = `
          INSERT INTO berkas_jamaah (
            user_id,
            jenis_berkas,
            nama_berkas,
            file_path
          )
          VALUES ?
        `;

        db.query(insertSql, [values], (err) => {
          if (err) {
            return callback(err);
          }

          processNext();
        });
      }
    );
  };

  processNext();
};

//update profil jamaah
const updateDataUser = (
  user_id,
  nama,
  nomor_hp,
  callback
) => {
  const sql = `
    UPDATE users
    SET
      nama = ?,
      nomor_hp = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [nama, nomor_hp, user_id],
    callback
  );
};