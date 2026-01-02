import pool from '../config/db.js';

const Destileria = {

  // Obtener perfil por usuario (destilería logueada)
  async obtenerPorUsuario(id_usuario) {
    const [rows] = await pool.query(
      `SELECT *
       FROM perfil_destileria
       WHERE id_usuario = ?`,
      [id_usuario]
    );

    return rows[0];
  },

  // Crear perfil de destilería
  async crearPerfil(data) {
    const {
      id_usuario,
      nombre_comercial,
      descripcion,
      email_contacto,
      telefono,
      direccion,
      imagen_logo,
      sitio_web
    } = data;

    const [result] = await pool.query(
      `INSERT INTO perfil_destileria
       (id_usuario, nombre_comercial, descripcion, email_contacto, telefono, direccion, imagen_logo, sitio_web)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario,
        nombre_comercial,
        descripcion,
        email_contacto,
        telefono,
        direccion,
        imagen_logo,
        sitio_web
      ]
    );

    return result.insertId;
  },

  // Actualizar perfil
  async actualizarPerfil(id_usuario, data) {
    const {
      nombre_comercial,
      descripcion,
      email_contacto,
      telefono,
      direccion,
      imagen_logo,
      sitio_web
    } = data;

    await pool.query(
      `UPDATE perfil_destileria
       SET nombre_comercial = ?,
           descripcion = ?,
           email_contacto = ?,
           telefono = ?,
           direccion = ?,
           imagen_logo = ?,
           sitio_web = ?
       WHERE id_usuario = ?`,
      [
        nombre_comercial,
        descripcion,
        email_contacto,
        telefono,
        direccion,
        imagen_logo,
        sitio_web,
        id_usuario
      ]
    );
  },

  // Obtener perfil público
  async obtenerPublico(id_perfil_destileria) {
    const [rows] = await pool.query(
      `SELECT
          id_perfil_destileria,
          nombre_comercial,
          descripcion,
          email_contacto,
          telefono,
          direccion,
          imagen_logo,
          sitio_web
       FROM perfil_destileria
       WHERE id_perfil_destileria = ?
         AND activo = TRUE`,
      [id_perfil_destileria]
    );

    return rows[0];
  }

};

export default Destileria;
