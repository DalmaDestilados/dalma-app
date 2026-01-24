import pool from '../config/db.js';

const Coctel = {

  //contador para limites

  async contarPorUsuario(id_usuario) {
    const [[row]] = await pool.query(
      'SELECT COUNT(*) total FROM cocteles WHERE id_usuario = ?',
      [id_usuario]
    );
    return row.total;
  },

  async contarPorDestileria(id_destileria) {
    const [[row]] = await pool.query(
      'SELECT COUNT(*) total FROM cocteles WHERE id_destileria = ?',
      [id_destileria]
    );
    return row.total;
  },

  async contarPorBartender(id_bartender) {
    const [[row]] = await pool.query(
      'SELECT COUNT(*) total FROM cocteles WHERE id_bartender = ?',
      [id_bartender]
    );
    return row.total;
  },

  //crear

  async crear(data) {
    const {
      nombre,
      descripcion,
      destilado_principal,
      id_bartender,
      id_destileria,
      id_usuario
    } = data;

    const [result] = await pool.query(
      `INSERT INTO cocteles
       (nombre, descripcion, destilado_principal, id_bartender, id_destileria, id_usuario)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion || null,
        destilado_principal,
        id_bartender || null,
        id_destileria || null,
        id_usuario || null
      ]
    );

    return result.insertId;
  },

  //publico

  async obtenerPublicos() {
    const [rows] = await pool.query(`
      SELECT
        c.id_coctel,
        c.nombre,
        c.descripcion,
        c.destilado_principal,
        c.imagen_url,
        c.id_destileria
      FROM cocteles c
      LEFT JOIN destilerias d ON c.id_destileria = d.id_destileria
      WHERE c.activo = 1
        AND (c.id_destileria IS NULL OR d.activo = 1)
      ORDER BY c.created_at DESC
    `);
    return rows;
  },

  // 🔧 FIX AQUÍ (alineado con listado público)
  async obtenerPublicoPorId(id) {
    const [rows] = await pool.query(`
      SELECT
        c.id_coctel,
        c.nombre,
        c.descripcion,
        c.destilado_principal,
        c.imagen_url,
        c.id_destileria
      FROM cocteles c
      WHERE c.id_coctel = ?
        AND c.activo = 1
      LIMIT 1
    `, [id]);

    return rows[0] || null;
  },

  //admin 

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      'SELECT * FROM cocteles WHERE id_coctel = ?',
      [id]
    );
    return rows[0] || null;
  },

  async actualizar(id, data) {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(data)) {
      campos.push(`${key} = ?`);
      valores.push(value);
    }

    if (!campos.length) return;

    valores.push(id);

    await pool.query(
      `UPDATE cocteles SET ${campos.join(', ')} WHERE id_coctel = ?`,
      valores
    );
  },

  async desactivar(id) {
    await pool.query(
      'UPDATE cocteles SET activo = 0 WHERE id_coctel = ?',
      [id]
    );
  }

};

export default Coctel;
