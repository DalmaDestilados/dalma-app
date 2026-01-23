import pool from '../config/db.js';

const Bartender = {

  // Crear perfil de bartender (ADMIN)
  async crear(data) {
    const {
      id_usuario,
      nombre_publico,
      descripcion,
      region,
      ciudad,
      instagram,
      email_contacto
    } = data;

    const [result] = await pool.query(
      `INSERT INTO bartenders
       (id_usuario, nombre_publico, descripcion, region, ciudad, instagram, email_contacto)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario,
        nombre_publico,
        descripcion,
        region,
        ciudad,
        instagram,
        email_contacto
      ]
    );

    return result.insertId;
  },

  // Obtener todos los bartenders activos
  async obtenerTodos() {
    const [rows] = await pool.query(
      `SELECT *
       FROM bartenders
       WHERE activo = 1
       ORDER BY created_at DESC`
    );
    return rows;
  },

  // Obtener bartender por ID
  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT *
       FROM bartenders
       WHERE id_bartender = ? AND activo = 1`,
      [id]
    );
    return rows[0];
  },

  // Obtener perfil del bartender logueado
  async obtenerPorUsuario(id_usuario) {
    const [rows] = await pool.query(
      `SELECT *
       FROM bartenders
       WHERE id_usuario = ? AND activo = 1`,
      [id_usuario]
    );
    return rows[0];
  },

  // Obtener bartenders por región (público)
  async obtenerPorRegion(region) {
    const [rows] = await pool.query(
      `SELECT *
       FROM bartenders
       WHERE region = ? AND activo = 1`,
      [region]
    );
    return rows;
  },

  // Actualizar bartender (UPDATE parcial)
  async actualizar(id_bartender, data) {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(data)) {
      campos.push(`${key} = ?`);
      valores.push(value);
    }

    if (campos.length === 0) return;

    valores.push(id_bartender);

    const sql = `
      UPDATE bartenders
      SET ${campos.join(', ')}
      WHERE id_bartender = ?
    `;

    await pool.query(sql, valores);
  },

  // Desactivar perfil (ADMIN)
  async desactivar(id) {
    await pool.query(
      `UPDATE bartenders
       SET activo = 0
       WHERE id_bartender = ?`,
      [id]
    );
  }

};

export default Bartender;
