import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import verificarRol from "../middlewares/rol.middleware.js";
import { uploadDestileriaImage } from "../middlewares/uploadDestileria.middleware.js";
import { uploadGaleriaImages } from "../middlewares/uploadGaleria.middleware.js";
import { uploadPersonaImage } from "../middlewares/uploadPersona.middleware.js";
import fs from "fs";
import path from "path";
import pool from "../config/db.js";

import {
  crearDestileria,
  obtenerDestilerias,
  obtenerDestileriaPorId,
  actualizarDestileria,
  eliminarDestileria,
  obtenerDestileriasPublicas,
  obtenerDestileriaPublicaPorId,
  mostrarDestileria
} from "../controllers/destileria.controller.js";

const router = express.Router();

/* =========================
   🧠 HELPER PATH
========================= */
function normalizeUploadPath(filePath) {
  return filePath
    .replace(process.cwd(), "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");
}

/* =========================
   🌍 RUTAS PÚBLICAS
========================= */

router.get("/", obtenerDestileriasPublicas);
router.get("/public", obtenerDestileriasPublicas);
router.get("/public/:id", obtenerDestileriaPublicaPorId);

/* =========================
   🌍 PERFIL PÚBLICO
========================= */

router.get("/:id/perfil", async (req, res) => {
  try {
    const { id } = req.params;

    const [destileriaRows] = await pool.query(
      `SELECT 
        id_destileria,
        nombre_comercial,
        descripcion,
        logo_url,
        ciudad,
        pais,
        persona_url,
        persona_nombre,
        persona_descripcion
       FROM destilerias
       WHERE id_destileria = ? AND activo = 1`,
      [id]
    );

    if (!destileriaRows.length) {
      return res.status(404).json({ message: "Destilería no encontrada" });
    }

    const destileria = destileriaRows[0];

    const [galeriaRows] = await pool.query(
      `SELECT id, imagen_url, orden
       FROM destileria_galeria
       WHERE destileria_id = ?
       ORDER BY orden ASC, created_at ASC`,
      [id]
    );

    res.json({
      id_destileria: destileria.id_destileria,
      nombre_comercial: destileria.nombre_comercial,
      descripcion: destileria.descripcion,
      logo_url: destileria.logo_url,
      ciudad: destileria.ciudad,
      pais: destileria.pais,
      persona: {
        nombre: destileria.persona_nombre,
        descripcion: destileria.persona_descripcion,
        imagen_url: destileria.persona_url
      },
      galeria: galeriaRows
    });

  } catch (error) {
    res.status(500).json({ message: "Error perfil", error: error.message });
  }
});

/* =====================================================
  
   Devuelve maestros reales con su destilería
===================================================== */
router.get("/public/masters", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        d.id_destileria,
        d.nombre_comercial,
        d.logo_url,
        d.ciudad,
        d.pais,
        d.persona_nombre AS nombre,
        d.persona_descripcion AS descripcion,
        d.persona_url AS foto_url
      FROM destilerias d
      WHERE d.activo = 1
        AND d.persona_nombre IS NOT NULL
        AND d.persona_url IS NOT NULL
      ORDER BY d.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener maestros",
      error: error.message
    });
  }
});

/* =========================
    RUTAS ADMIN
========================= */

const ROL_ADMIN = 3;
router.use(authMiddleware, verificarRol(ROL_ADMIN));

router.get("/admin/list", obtenerDestilerias);
router.get("/admin/:id", obtenerDestileriaPorId);

/*  CREAR DESTILERÍA (SIN IMAGEN) */
router.post("/", crearDestileria);

router.put("/:id", actualizarDestileria);
router.delete("/:id", eliminarDestileria);
router.patch("/:id/mostrar", mostrarDestileria);

/* =========================
    LOGO DESTILERÍA
========================= */

router.post(
  "/:id/imagen",
  uploadDestileriaImage.single("imagen"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: "No se subió ninguna imagen" });
      }

      const [rows] = await pool.query(
        "SELECT logo_url FROM destilerias WHERE id_destileria = ?",
        [id]
      );

      if (rows.length && rows[0].logo_url) {
        const oldPath = path.join(process.cwd(), rows[0].logo_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const logoUrl = normalizeUploadPath(req.file.path);

      await pool.query(
        "UPDATE destilerias SET logo_url = ? WHERE id_destileria = ?",
        [logoUrl, id]
      );

      res.json({ message: "Logo actualizado", logo_url: logoUrl });

    } catch (error) {
      res.status(500).json({ message: "Error al subir imagen", error: error.message });
    }
  }
);

/* =========================
   🧑 PERSONA DESTACADA
========================= */

router.post(
  "/:id/persona",
  uploadPersonaImage.single("imagen"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No se subió imagen" });
      }

      const [rows] = await pool.query(
        "SELECT persona_url FROM destilerias WHERE id_destileria = ?",
        [id]
      );

      if (rows.length && rows[0].persona_url) {
        const oldPath = path.join(process.cwd(), rows[0].persona_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const personaUrl = normalizeUploadPath(req.file.path);

      await pool.query(
        `UPDATE destilerias
         SET persona_url = ?, persona_nombre = ?, persona_descripcion = ?
         WHERE id_destileria = ?`,
        [personaUrl, nombre || null, descripcion || null, id]
      );

      res.json({ message: "Persona actualizada", persona_url: personaUrl });

    } catch (error) {
      res.status(500).json({ message: "Error persona", error: error.message });
    }
  }
);

/* =========================
   🖼 GALERÍA (CARRUSEL)
========================= */

router.post(
  "/:id/galeria",
  uploadGaleriaImages.array("imagenes", 10),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.files || !req.files.length) {
        return res.status(400).json({ message: "No se subieron imágenes" });
      }

      const values = req.files.map(file => [
        id,
        normalizeUploadPath(file.path)
      ]);

      await pool.query(
        "INSERT INTO destileria_galeria (destileria_id, imagen_url) VALUES ?",
        [values]
      );

      res.json({ message: "Galería subida", cantidad: req.files.length });

    } catch (error) {
      res.status(500).json({ message: "Error galería", error: error.message });
    }
  }
);

router.delete("/galeria/:imagenId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT imagen_url FROM destileria_galeria WHERE id = ?",
      [req.params.imagenId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    const fullPath = path.join(process.cwd(), rows[0].imagen_url);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    await pool.query(
      "DELETE FROM destileria_galeria WHERE id = ?",
      [req.params.imagenId]
    );

    res.json({ message: "Imagen eliminada" });

  } catch (error) {
    res.status(500).json({ message: "Error eliminar imagen", error: error.message });
  }
});

export default router;
