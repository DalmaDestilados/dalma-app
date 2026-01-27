import pool from "../config/db.js";

class Valoracion {
  static async upsert({ id_usuario, id_producto, puntuacion }) {
    const [res] = await pool.query(
      `
      INSERT INTO valoraciones (id_usuario, id_producto, puntuacion)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE puntuacion = VALUES(puntuacion)
      `,
      [id_usuario, id_producto, puntuacion]
    );
    return res;
  }

  static async obtenerResumen(id_producto) {
    const [[row]] = await pool.query(
      `
      SELECT 
        ROUND(AVG(puntuacion), 1) AS promedio,
        COUNT(*) AS total
      FROM valoraciones
      WHERE id_producto = ?
      `,
      [id_producto]
    );
    return row;
  }

  static async obtenerUsuario(id_producto, id_usuario) {
    const [[row]] = await pool.query(
      `
      SELECT puntuacion
      FROM valoraciones
      WHERE id_producto = ? AND id_usuario = ?
      `,
      [id_producto, id_usuario]
    );
    return row;
  }
}

export default Valoracion;
