import pool from '../config/db.js';

const CoctelIngrediente = {

  async agregar(id_coctel, ingrediente, cantidad) {
    await pool.query(
      `INSERT INTO coctel_ingredientes
       (id_coctel, ingrediente, cantidad)
       VALUES (?, ?, ?)`,
      [id_coctel, ingrediente, cantidad]
    );
  },

  async obtenerPorCoctel(id_coctel) {
    const [rows] = await pool.query(
      `SELECT ingrediente, cantidad
       FROM coctel_ingredientes
       WHERE id_coctel = ?`,
      [id_coctel]
    );
    return rows;
  },

  async eliminarPorCoctel(id_coctel) {
    await pool.query(
      `DELETE FROM coctel_ingredientes
       WHERE id_coctel = ?`,
      [id_coctel]
    );
  }

};

export default CoctelIngrediente;
