import crypto from "crypto";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { PasswordReset } from "../models/passwordReset.model.js";
import { sendMail } from "../services/mail.service.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requerido" });
    }

    const [users] = await pool.query(
      "SELECT id_usuario, email FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    // 🔐 Respuesta genérica por seguridad
    if (!users.length) {
      return res.json({
        message: "Si el email existe, se enviará un correo"
      });
    }

    const user = users[0];

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    // 🔥 invalidar tokens anteriores
    await PasswordReset.invalidarPorUsuario(user.id_usuario);

    // ✅ guardar token nuevo
    await PasswordReset.crear(user.id_usuario, token, expires);

    const link = `${process.env.APP_URL}/reset-password?token=${token}`;

    await sendMail({
      to: user.email,
      subject: "Recuperación de contraseña - Dalma",
      html: `
        <p>Solicitaste recuperar tu contraseña</p>
        <p>
          <a href="${link}">Haz clic aquí para cambiar tu contraseña</a>
        </p>
        <p>Este enlace expira en 30 minutos.</p>
      `
    });

    return res.json({
      message: "Si el email existe, se enviará un correo"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al enviar correo"
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password)
      return res.status(400).json({ message: "Datos incompletos" });

    if (password.length < 8)
      return res.status(400).json({ message: "Contraseña muy corta" });

    const reset = await PasswordReset.buscarPorToken(token);

    if (!reset)
      return res.status(400).json({ message: "Token inválido o expirado" });

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE usuarios SET password = ? WHERE id_usuario = ?",
      [hash, reset.usuario_id]
    );

    await PasswordReset.marcarUsado(reset.id);

    res.json({ message: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al resetear contraseña" });
  }
};
