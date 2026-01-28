import pool from "../config/db.js";

/* =========================
   CREAR / ACTUALIZAR VALORACIÓN
========================= */
export const valorarProducto = async (req, res) => {
  try {
    const { id_producto, puntuacion } = req.body;
    const id_usuario = req.user?.id_usuario;

    if (!id_usuario) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!id_producto || !puntuacion) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ message: "Puntuación inválida" });
    }

    const [existe] = await pool.query(
      `SELECT id_valoracion FROM valoraciones
       WHERE id_usuario = ? AND id_producto = ?`,
      [id_usuario, id_producto]
    );

    if (existe.length > 0) {
      await pool.query(
        `UPDATE valoraciones
         SET puntuacion = ?
         WHERE id_usuario = ? AND id_producto = ?`,
        [puntuacion, id_usuario, id_producto]
      );
    } else {
      await pool.query(
        `INSERT INTO valoraciones (id_usuario, id_producto, puntuacion)
         VALUES (?, ?, ?)`,
        [id_usuario, id_producto, puntuacion]
      );
    }

    res.json({ message: "Valoración guardada" });
  } catch (error) {
    console.error("ERROR VALORAR:", error);
    res.status(500).json({ message: "Error al valorar producto" });
  }
};

/* =========================
   PROMEDIO DEL PRODUCTO
========================= */
export const obtenerValoracionProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    const [[data]] = await pool.query(
      `SELECT 
        COUNT(*) AS total,
        IFNULL(AVG(puntuacion),0) AS promedio
       FROM valoraciones
       WHERE id_producto = ?`,
      [id_producto]
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener valoración" });
  }
};

/* =========================
   VALORACIÓN DEL USUARIO
========================= */
export const obtenerValoracionUsuario = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const id_usuario = req.user.id_usuario;

    const [[row]] = await pool.query(
      `SELECT puntuacion FROM valoraciones
       WHERE id_usuario = ? AND id_producto = ?`,
      [id_usuario, id_producto]
    );

    res.json(row || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener valoración del usuario" });
  }
};
