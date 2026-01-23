import pool from '../config/db.js';

const Deseos = {

  // Agregar producto a lista de deseos
  async agregar(id_usuario, id_producto) {
    await pool.query(
      `INSERT IGNORE INTO lista_deseos (id_usuario, id_producto)
       VALUES (?, ?)`,
      [id_usuario, id_producto]
    );
  },

  // Quitar producto de lista de deseos
  async quitar(id_usuario, id_producto) {
    await pool.query(
      `DELETE FROM lista_deseos
       WHERE id_usuario = ? AND id_producto = ?`,
      [id_usuario, id_producto]
    );
  },

  // Obtener lista de deseos del usuario
  async obtenerPorUsuario(id_usuario) {
    const [rows] = await pool.query(
      `SELECT p.*
       FROM lista_deseos d
       JOIN productos p ON p.id_producto = d.id_producto
       WHERE d.id_usuario = ?`,
      [id_usuario]
    );
    return rows;
  }

};

export default Deseos;
