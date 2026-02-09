import Bartender from "../models/bartender.model.js";
import pool from "../config/db.js";

const ROL_BARTENDER = 2;

/* =========================
   MI PERFIL (BARTENDER)
========================= */

// 🔹 Obtener mi perfil
export const obtenerMiPerfil = async (req, res) => {
  try {
    const { id_usuario } = req.user;

    const [rows] = await pool.query(
      "SELECT * FROM bartenders WHERE id_usuario = ? LIMIT 1",
      [id_usuario]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "No tienes perfil de bartender",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("ERROR obtenerMiPerfil:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

// 🔹 Crear mi perfil
export const crearMiPerfilBartender = async (req, res) => {
  try {
    const { id_usuario, id_rol } = req.user;

    if (id_rol !== ROL_BARTENDER) {
      return res.status(403).json({
        message: "Solo bartenders pueden crear perfil",
      });
    }

    const [existe] = await pool.query(
      "SELECT id_bartender FROM bartenders WHERE id_usuario = ?",
      [id_usuario]
    );

    if (existe.length) {
      return res.status(409).json({
        message: "Ya tienes un perfil de bartender",
      });
    }

    const {
      nombre_publico,
      descripcion,
      region,
      ciudad,
      instagram,
      email_contacto,
    } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO bartenders
      (id_usuario, nombre_publico, descripcion, region, ciudad, instagram, email_contacto, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `,
      [
        id_usuario,
        nombre_publico,
        descripcion,
        region,
        ciudad,
        instagram,
        email_contacto,
      ]
    );

    res.status(201).json({
      id_bartender: result.insertId,
      message: "Perfil de bartender creado",
    });
  } catch (error) {
    console.error("ERROR crearMiPerfilBartender:", error);
    res.status(500).json({ error: "Error al crear perfil" });
  }
};

// 🔹 Actualizar mi perfil
export const actualizarMiPerfilBartender = async (req, res) => {
  try {
    const { id_usuario } = req.user;
    const data = { ...req.body };

    if (req.files?.foto_perfil) {
      data.foto_perfil = `/uploads/bartenders/${req.files.foto_perfil[0].filename}`;
    }

    if (req.files?.banner_perfil) {
      data.banner_perfil = `/uploads/bartenders/${req.files.banner_perfil[0].filename}`;
    }

    await pool.query(
      "UPDATE bartenders SET ? WHERE id_usuario = ?",
      [data, id_usuario]
    );

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("ERROR actualizarMiPerfilBartender:", error);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
};

/* =========================
   PUBLICOS
========================= */

// 👉 IMPORTANTE: solo bartenders activos
export const obtenerBartendersPublicos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id_bartender,
        nombre_publico,
        foto_perfil,
        descripcion,
        especialidad,
        ciudad,
        region
      FROM bartenders
      WHERE activo = 1
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("ERROR obtenerBartendersPublicos:", error);
    res.status(500).json({ error: "Error al obtener bartenders" });
  }
};

export const obtenerBartenderPublicoPorId = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        id_bartender,
        nombre_publico,
        foto_perfil,
        banner_perfil,
        descripcion,
        especialidad,
        ciudad,
        region,
        instagram,
        email_contacto
      FROM bartenders
      WHERE id_bartender = ? AND activo = 1
      LIMIT 1
      `,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Bartender no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("ERROR obtenerBartenderPublicoPorId:", error);
    res.status(500).json({ error: "Error al obtener bartender" });
  }
};

/* =========================
   ADMIN
========================= */

// 🔒 ADMIN: listar TODOS (activos e inactivos)
export const obtenerBartendersAdmin = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id_bartender,
        nombre_publico,
        foto_perfil,
        activo,
        created_at
      FROM bartenders
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("ERROR obtenerBartendersAdmin:", error);
    res.status(500).json({ error: "Error al obtener bartenders" });
  }
};

// 🔒 ADMIN: activar / desactivar
export const cambiarEstadoBartender = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    await pool.query(
      "UPDATE bartenders SET activo = ? WHERE id_bartender = ?",
      [activo ? 1 : 0, id]
    );

    res.json({
      message: activo
        ? "Bartender activado correctamente"
        : "Bartender desactivado correctamente",
    });
  } catch (error) {
    console.error("ERROR cambiarEstadoBartender:", error);
    res.status(500).json({ error: "Error al cambiar estado" });
  }
};
