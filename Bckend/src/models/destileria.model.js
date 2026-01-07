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
       (nombre_comercial, descripcion, logo_url, email_contacto, telefono, direccion, ciudad, pais, sitio_web)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    // Retorna el ID de la destilería creada
    return result.insertId;
  },

  // Obtiene todas las destilerías activas
  async obtenerTodas() {
    const [rows] = await pool.query(
      `SELECT *
       FROM destilerias
       WHERE activo = 1
       ORDER BY created_at DESC`
    );
    return rows;
  },

  // Obtiene una destilería activa por su ID
  async obtenerPorId(id) {
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

  // Desactiva una destilería (soft delete)
  async desactivar(id) {
    await pool.query(
      `UPDATE destilerias
       SET activo = 0
       WHERE id_destileria = ?`,
      [id]
    );
  }

};

export default Destileria;
