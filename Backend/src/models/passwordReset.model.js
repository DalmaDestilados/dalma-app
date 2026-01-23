import pool from "../config/db.js";

export const PasswordReset = {
  async crear(usuarioId, token, expiresAt) {
    await pool.query(
      `INSERT INTO password_reset_tokens (usuario_id, token, expires_at)
       VALUES (?, ?, ?)`,
      [usuarioId, token, expiresAt]
    );
  },

  async buscarPorToken(token) {
    const [rows] = await pool.query(
      `SELECT * FROM password_reset_tokens
       WHERE token = ? AND used = 0 AND expires_at > NOW()
       LIMIT 1`,
      [token]
    );
    return rows[0];
  },

  async marcarUsado(id) {
    await pool.query(
      `UPDATE password_reset_tokens SET used = 1 WHERE id = ?`,
      [id]
    );
  },

  async invalidarPorUsuario(usuarioId) {
    await pool.query(
        "UPDATE password_reset_tokens SET used = 1 WHERE usuario_id = ?",
        [usuarioId]
    );
    }
};
