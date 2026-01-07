import pool from '../config/db.js';

const Producto = {

  // Crear un producto asociado a una destilería
  async crear(data) {
    const {
      nombre,
      descripcion,
      categoria,
      precio,
      stock,
      grado_alcoholico,
      contenido_neto,
      id_destileria
    } = data;

    const [result] = await pool.query(
      `INSERT INTO productos
       (nombre, descripcion, categoria, precio, stock, grado_alcoholico, contenido_neto, id_destileria)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion,
        categoria,
        precio,
        stock,
        grado_alcoholico,
        contenido_neto,
        id_destileria
      ]
    );

    return result.insertId;
  },

  // Obtener todos los productos activos
  async obtenerTodos() {
    const [rows] = await pool.query(
      `SELECT *
       FROM productos
       WHERE activo = 1
       ORDER BY created_at DESC`
    );
    return rows;
  },

  // Obtener un producto por ID
  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT *
       FROM productos
       WHERE id_producto = ? AND activo = 1`,
      [id]
    );
    return rows[0];
  },

  // Obtener productos por destilería
  async obtenerPorDestileria(id_destileria) {
    const [rows] = await pool.query(
      `SELECT *
       FROM productos
       WHERE id_destileria = ? AND activo = 1`,
      [id_destileria]
    );
    return rows;
  },

  // Actualizar producto (UPDATE parcial)
  async actualizar(id, data) {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(data)) {
      campos.push(`${key} = ?`);
      valores.push(value);
    }

    if (campos.length === 0) return;

    valores.push(id);

    const sql = `
      UPDATE productos
      SET ${campos.join(', ')}
      WHERE id_producto = ?
    `;

    await pool.query(sql, valores);
  },

  // Eliminado lógico del producto
  async desactivar(id) {
    await pool.query(
      `UPDATE productos
       SET activo = 0
       WHERE id_producto = ?`,
      [id]
    );
  }

};

export default Producto;
