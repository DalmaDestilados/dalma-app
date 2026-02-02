import pool from '../config/db.js';

const Usuario = {
  /* =========================
     EXISTENTE (NO TOCADO)
  ========================= */

  async obtenerTodos() {
    const [rows] = await pool.query(`
      SELECT 
        u.id_usuario,
        u.nombre,
        u.email,
        r.nombre AS rol,
        u.created_at
      FROM usuarios u
      INNER JOIN roles r ON u.id_rol = r.id_rol
    `);
    return rows;
  },

  async crearUsuario({ nombre, email, password, id_rol, edad }) {
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, id_rol, edad)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, email, password, id_rol, edad]
    );
    return result.insertId;
  },

  async obtenerPorEmail(email) {
    const [rows] = await pool.query(
      `SELECT 
        u.id_usuario,
        u.nombre,
        u.email,
        u.password,
        r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id_rol
       WHERE u.email = ?`,
      [email]
    );
    return rows[0];
  },

  /* =========================
     🔥 NUEVO – PERFIL USUARIO
  ========================= */

  async obtenerPerfil(id_usuario) {
    const [rows] = await pool.query(
      `SELECT
        id_usuario,
        nombre,
        email,
        edad,
        telefono,
        id_rol,
        foto_perfil
       FROM usuarios
       WHERE id_usuario = ?`,
      [id_usuario]
    );
    return rows[0];
  },

  async actualizarPerfil(id_usuario, { nombre, telefono }) {
    await pool.query(
      `UPDATE usuarios
       SET nombre = ?, telefono = ?
       WHERE id_usuario = ?`,
      [nombre, telefono, id_usuario]
    );
  },

  async actualizarFotoPerfil(id_usuario, foto_perfil) {
    await pool.query(
      `UPDATE usuarios
       SET foto_perfil = ?
       WHERE id_usuario = ?`,
      [foto_perfil, id_usuario]
    );
  }
};

export default Usuario;
