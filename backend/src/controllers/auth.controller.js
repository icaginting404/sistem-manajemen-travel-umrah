import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {
      nama,
      email,
      nomor_hp,
      password,
      konfirmasi_password,
    } = req.body;

    // validasi password
    if (password !== konfirmasi_password) {
      return res.status(400).json({
        message: "Konfirmasi password tidak cocok",
      });
    }

    // cek email
    const checkEmail =
      "SELECT * FROM users WHERE email = ?";

    db.query(checkEmail, [email], async (err, result) => {
      if (err) {
        console.log("CHECK EMAIL ERROR:", err);

        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }

      if (result.length > 0) {
        return res.status(400).json({
          message: "Email sudah digunakan",
        });
      }

      const hashedPassword = await bcrypt.hash(
        password,
        10
      );
      
      // insert user
      const sql = `
        INSERT INTO users 
        (nama, email, nomor_hp, password, role)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          nama,
          email,
          nomor_hp,
          hashedPassword,
          "jamaah",
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Register gagal",
            });
          }

          return res.status(201).json({
            message: "Register berhasil",
            id: result.insertId,
          });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

//login
export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    const sql =
      "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Server error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Email atau password salah.",
        });
      }

      const user = result[0];

      // cek password
      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Email atau password salah.",
        });
      }

      // generate token
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          nomor_hp: user.nomor_hp,
          role: user.role,
        },
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};