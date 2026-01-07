import pool from '../config/db.js';

const Coctel = {

  // Crear cóctel
  async crear(data) {
    const {
      nombre,
      descripcion,
      id_bartender,
      id_destileria,
      id_usuario
    } = data;

    const [result] = await pool.query(
      `INSERT INTO cocteles
       (nombre, descripcion, id_bartender, id_destileria, id_usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion,
        id_bartender,
        id_destileria,
        id_usuario
      ]
    );

    return result.insertId;
  },

  // Obtener todos los cócteles públicos
  async obtenerPublicos() {
    const [rows] = await pool.query(
      `SELECT *
       FROM cocteles
       WHERE activo = 1
       ORDER BY created_at DESC`
    );
    return rows;
  },

  // Obtener cóctel por ID
  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT *
       FROM cocteles
       WHERE id_coctel = ? AND activo = 1`,
      [id]
    );
    return rows[0];
  },

  // Obtener por bartender
  async obtenerPorBartender(id_bartender) {
    const [rows] = await pool.query(
      `SELECT *
       FROM cocteles
       WHERE id_bartender = ? AND activo = 1`,
      [id_bartender]
    );
    return rows;
  },

  // Obtener por destilería
  async obtenerPorDestileria(id_destileria) {
    const [rows] = await pool.query(
      `SELECT *
       FROM cocteles
       WHERE id_destileria = ? AND activo = 1`,
      [id_destileria]
    );
    return rows;
  },

  // Actualizar cóctel (parcial)
  async actualizar(id, data) {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(data)) {
      campos.push(`${key} = ?`);
      valores.push(value);
    }

    if (!campos.length) return;

    valores.push(id);

    const sql = `
      UPDATE cocteles
      SET ${campos.join(', ')}
      WHERE id_coctel = ?
    `;

    await pool.query(sql, valores);
  },

  // Eliminar lógico
  async desactivar(id) {
    await pool.query(
      `UPDATE cocteles
       SET activo = 0
       WHERE id_coctel = ?`,
      [id]
    );
  }

};

export default Coctel;
