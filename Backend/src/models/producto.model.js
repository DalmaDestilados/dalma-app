import pool from '../config/db.js';

class Producto {

  // =========================
  // ADMIN
  // =========================

  static async crear(data) {
    const [result] = await pool.query(
      `INSERT INTO productos SET ?`,
      [data]
    );
    return result.insertId;
  }

  // 🔹 ADMIN LIST (AGREGADO – NO REEMPLAZA NADA)
  static async obtenerTodosAdmin() {
    const [rows] = await pool.query(`
      SELECT *
      FROM productos
      ORDER BY created_at DESC
    `);
    return rows;
  }

  static async obtenerTodos() {
    const [rows] = await pool.query(
      'SELECT * FROM productos'
    );
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE id_producto = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async obtenerPorDestileria(id_destileria) {
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE id_destileria = ?',
      [id_destileria]
    );
    return rows;
  }

  static async actualizar(id, data) {
    await pool.query(
      'UPDATE productos SET ? WHERE id_producto = ?',
      [data, id]
    );
  }

  // 🔴 OCULTAR (soft delete)
  static async desactivar(id) {
    await pool.query(
      'UPDATE productos SET activo = 0 WHERE id_producto = ?',
      [id]
    );
  }

  // 🟢 MOSTRAR / REACTIVAR
  static async activar(id) {
    await pool.query(
      'UPDATE productos SET activo = 1 WHERE id_producto = ?',
      [id]
    );
  }

  // =========================
  // PÚBLICO
  // =========================

  static async obtenerPublicos() {
    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.categoria,
        p.precio,
        p.stock,
        p.contenido_neto,
        p.grado_alcoholico,
        p.imagen_url,
        p.id_destileria,

        -- ⭐ CATA
        p.cata_aromas,
        p.cata_dulzor,
        p.cata_cuerpo,
        p.cata_persistencia

      FROM productos p
      INNER JOIN destilerias d
        ON p.id_destileria = d.id_destileria
      WHERE p.activo = 1
        AND d.activo = 1
      ORDER BY p.created_at DESC
    `);
    return rows;
  }

  static async obtenerPublicoPorId(id) {
    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.categoria,
        p.precio,
        p.stock,
        p.contenido_neto,
        p.grado_alcoholico,
        p.imagen_url,
        p.id_destileria,

        -- ⭐ CATA
        p.cata_aromas,
        p.cata_dulzor,
        p.cata_cuerpo,
        p.cata_persistencia

      FROM productos p
      INNER JOIN destilerias d
        ON p.id_destileria = d.id_destileria
      WHERE p.id_producto = ?
        AND p.activo = 1
        AND d.activo = 1
      LIMIT 1
    `, [id]);

    return rows[0] || null;
  }

  static async obtenerPublicosPorDestileria(id_destileria) {
    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.categoria,
        p.precio,
        p.stock,
        p.contenido_neto,
        p.grado_alcoholico,
        p.imagen_url,

        -- ⭐ CATA
        p.cata_aromas,
        p.cata_dulzor,
        p.cata_cuerpo,
        p.cata_persistencia

      FROM productos p
      INNER JOIN destilerias d
        ON p.id_destileria = d.id_destileria
      WHERE p.id_destileria = ?
        AND p.activo = 1
        AND d.activo = 1
      ORDER BY p.created_at DESC
    `, [id_destileria]);

    return rows;
  }
}

export default Producto;
