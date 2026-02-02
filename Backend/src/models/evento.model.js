import pool from "../config/db.js";

const Evento = {
  // =====================
  // ADMIN
  // =====================
  async crear(data) {
    const { titulo, descripcion, categoria, ubicacion, fecha } = data;

    const [result] = await pool.query(
      `INSERT INTO eventos 
      (titulo, descripcion, categoria, ubicacion, fecha)
      VALUES (?, ?, ?, ?, ?)`,
      [titulo, descripcion, categoria, ubicacion, fecha]
    );

    return result.insertId;
  },

  async obtenerTodosAdmin() {
    const [rows] = await pool.query(
      "SELECT * FROM eventos ORDER BY fecha ASC"
    );
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      "SELECT * FROM eventos WHERE id_evento = ?",
      [id]
    );
    return rows[0];
  },

  async actualizar(id, data) {
    const { titulo, descripcion, categoria, ubicacion, fecha } = data;

    await pool.query(
      `UPDATE eventos SET
        titulo = ?,
        descripcion = ?,
        categoria = ?,
        ubicacion = ?,
        fecha = ?
       WHERE id_evento = ?`,
      [titulo, descripcion, categoria, ubicacion, fecha, id]
    );
  },

  async eliminar(id) {
    await pool.query(
      "DELETE FROM eventos WHERE id_evento = ?",
      [id]
    );
  },

  // =====================
  // PÚBLICO
  // =====================
  async obtenerPublicos() {
    const [rows] = await pool.query(
      `
      SELECT * FROM eventos
      WHERE activo = 1
      ORDER BY fecha ASC
      `
    );
    return rows;
  },

  // =====================
  // DESTILERÍA
  // =====================

  // Obtener eventos por destilería
  async obtenerPorDestileria(id_destileria) {
    const [rows] = await pool.query(
      `
      SELECT * FROM eventos
      WHERE id_destileria = ?
      ORDER BY fecha ASC
      `,
      [id_destileria]
    );
    return rows;
  },

  // Crear evento para una destilería
  async crearParaDestileria(id_destileria, data) {
    const { titulo, descripcion, categoria, ubicacion, fecha } = data;

    const [result] = await pool.query(
      `
      INSERT INTO eventos
      (titulo, descripcion, categoria, ubicacion, fecha, id_destileria)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [titulo, descripcion, categoria, ubicacion, fecha, id_destileria]
    );

    return result.insertId;
  },

  // =====================
  // ⭐ NUEVO: EVENTOS GLOBALES
  // =====================
  async obtenerGlobales() {
    const [rows] = await pool.query(
      `
      SELECT * FROM eventos
      WHERE id_destileria IS NULL
      ORDER BY fecha ASC
      `
    );
    return rows;
  }
};

export default Evento;
