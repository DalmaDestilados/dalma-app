import pool from '../config/db.js';

const Usuario = {
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

  async crearUsuario({ nombre, email, password, id_rol }) {
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, id_rol)
       VALUES (?, ?, ?, ?)`,
      [nombre, email, password, id_rol]
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
  }
};

export default Usuario;
