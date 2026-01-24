import pool from '../config/db.js';

const Destileria = {

  // Crea una nueva destilería en la base de datos
  async crear(data) {
    const {
      nombre_comercial,
      descripcion,
      logo_url,
      email_contacto,
      telefono,
      direccion,
      ciudad,
      pais,
      sitio_web
    } = data;

    const [result] = await pool.query(
      `INSERT INTO destilerias
       (nombre_comercial, descripcion, logo_url, email_contacto, telefono, direccion, ciudad, pais, sitio_web, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        nombre_comercial,
        descripcion,
        logo_url,
        email_contacto,
        telefono,
        direccion,
        ciudad,
        pais,
        sitio_web
      ]
    );

    return result.insertId;
  },

  // 🔒 ADMIN → obtiene TODAS (activas + inactivas)
  async obtenerTodas() {
    const [rows] = await pool.query(
      `SELECT *
       FROM destilerias
       ORDER BY created_at DESC`
    );
    return rows;
  },

  // 🌍 USUARIOS → SOLO activas
  async obtenerActivas() {
    const [rows] = await pool.query(
      `SELECT *
       FROM destilerias
       WHERE activo = 1
       ORDER BY created_at DESC`
    );
    return rows;
  },

  // 🔒 ADMIN → obtiene por ID (aunque esté inactiva)
  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT *
       FROM destilerias
       WHERE id_destileria = ?`,
      [id]
    );
    return rows[0];
  },

  // 🌍 USUARIOS → obtiene por ID SOLO si está activa
  async obtenerActivaPorId(id) {
    const [rows] = await pool.query(
      `SELECT *
       FROM destilerias
       WHERE id_destileria = ? AND activo = 1`,
      [id]
    );
    return rows[0];
  },

  // Actualiza los datos de una destilería existente
  async actualizar(id, data) {
    const {
      nombre_comercial,
      descripcion,
      logo_url,
      email_contacto,
      telefono,
      direccion,
      ciudad,
      pais,
      sitio_web
    } = data;

    await pool.query(
      `UPDATE destilerias
       SET nombre_comercial = ?,
           descripcion = ?,
           logo_url = ?,
           email_contacto = ?,
           telefono = ?,
           direccion = ?,
           ciudad = ?,
           pais = ?,
           sitio_web = ?
       WHERE id_destileria = ?`,
      [
        nombre_comercial,
        descripcion,
        logo_url,
        email_contacto,
        telefono,
        direccion,
        ciudad,
        pais,
        sitio_web,
        id
      ]
    );
  },

  // 🔴 DESACTIVAR (SOFT DELETE)
  async desactivar(id) {
    await pool.query(
      `UPDATE destilerias
       SET activo = 0
       WHERE id_destileria = ?`,
      [id]
    );
  },

  // 🟢 REACTIVAR
  async mostrar(id) {
    await pool.query(
      `UPDATE destilerias
       SET activo = 1
       WHERE id_destileria = ?`,
      [id]
    );
  }

};

export default Destileria;
