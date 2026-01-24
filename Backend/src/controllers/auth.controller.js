import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../config/db.js";
import { sendMail } from "../services/mail.service.js";

const ROLES = {
  user: 1,
  bartender: 2,
  admin: 3, // 🔥 AGREGADO
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(400).json({ message: "Usuario no existe" });
    }

    const usuario = rows[0];

    // 🔥 ADMIN NO REQUIERE VERIFICACIÓN DE EMAIL
    if (!usuario.email_verificado && usuario.id_rol !== ROLES.admin) {
      return res
        .status(401)
        .json({ message: "Debes verificar tu correo primero" });
    }

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      token,
      user: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.id_rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en login" });
  }
};

/* =========================
   REGISTER + EMAIL
========================= */
export const register = async (req, res) => {
  try {
    console.log("REGISTER BODY >>>", req.body);

    const {
      nombre,
      email,
      password,
      fecha_nacimiento,
      telefono,
      tipoCuenta,
    } = req.body;

    if (!nombre || !email || !password || !fecha_nacimiento) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const nacimiento = new Date(fecha_nacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

    if (edad < 18) {
      return res.status(400).json({ message: "Debes ser mayor de edad" });
    }

    const rol = ROLES[tipoCuenta] || ROLES.user;

    const [existe] = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE email = ?",
      [email]
    );

    if (existe.length) {
      return res.status(400).json({ message: "Email ya registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO usuarios 
       (nombre, email, password, edad, telefono, id_rol, email_verificado)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [nombre, email, hash, edad, telefono || null, rol]
    );

    const usuarioId = result.insertId;

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await pool.query(
      `INSERT INTO email_verification_tokens 
       (usuario_id, token, expires_at, used)
       VALUES (?, ?, ?, 0)`,
      [usuarioId, token, expires]
    );

    const link = `${process.env.APP_URL}/verify-email?token=${token}&email=${email}`;

    await sendMail({
      to: email,
      subject: "Verifica tu correo - DALMA",
      html: `<a href="${link}">Verificar correo</a>`,
    });

    res.status(201).json({
      message: "Usuario registrado. Revisa tu correo",
    });
  } catch (err) {
    console.error("🔥 REGISTER ERROR >>>", err);
    res.status(500).json({ message: "Error en registro" });
  }
};

/* =========================
   VERIFY EMAIL
========================= */
export const verifyEmail = async (req, res) => {
  try {
    // 👇 aceptar token desde body O query
    const token = req.body.token || req.query.token;

    if (!token) {
      return res.status(400).json({ message: "Token requerido" });
    }

    const [rows] = await pool.query(
      `SELECT * FROM email_verification_tokens
       WHERE token = ? AND used = 0 AND expires_at > NOW()
       LIMIT 1`,
      [token]
    );

    if (!rows.length) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const record = rows[0];

    await pool.query(
      "UPDATE usuarios SET email_verificado = 1 WHERE id_usuario = ?",
      [record.usuario_id]
    );

    await pool.query(
      "UPDATE email_verification_tokens SET used = 1 WHERE id = ?",
      [record.id]
    );

    res.json({ message: "Correo verificado correctamente" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al verificar correo" });
  }
};
