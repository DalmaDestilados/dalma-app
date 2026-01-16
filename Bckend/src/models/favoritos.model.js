import pool from '../config/db.js';

const Favoritos = {

  // Agregar producto a favoritos
  async agregar(id_usuario, id_producto) {
    await pool.query(
      `INSERT IGNORE INTO favoritos_sku (id_usuario, id_producto)
       VALUES (?, ?)`,
      [id_usuario, id_producto]
    );
  },

  // Quitar producto de favoritos
  async quitar(id_usuario, id_producto) {
    await pool.query(
      `DELETE FROM favoritos_sku
       WHERE id_usuario = ? AND id_producto = ?`,
      [id_usuario, id_producto]
    );
  },

  // Obtener favoritos del usuario
  async obtenerPorUsuario(id_usuario) {
    const [rows] = await pool.query(
      `SELECT p.*
       FROM favoritos_sku f
       JOIN productos p ON p.id_producto = f.id_producto
       WHERE f.id_usuario = ?`,
      [id_usuario]
    );
    return rows;
  }

};

export default Favoritos;
