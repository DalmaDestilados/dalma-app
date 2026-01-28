import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';
import { uploadCoctelImage } from '../middlewares/uploadCoctel.middleware.js';
import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';
import Coctel from '../models/coctel.model.js'; // 🔥 AGREGADO

// 🔥 AGREGADO (controller)
import {
  crearCoctel,
  obtenerCoctelesPublicos,
  obtenerCoctelPorId,
  actualizarCoctel,
  eliminarCoctel,
  obtenerCoctelRecomendadoPorProducto // 🔥 NUEVO
} from '../controllers/coctel.controller.js';

const router = express.Router();
const ROL_ADMIN = 3;

/* ===== PÚBLICO ===== */

router.get('/', obtenerCoctelesPublicos);
router.get('/public', obtenerCoctelesPublicos);
router.get('/public/:id', obtenerCoctelPorId);

/* =====================================================
   🔥 CÓCTEL RECOMENDADO POR PRODUCTO (PÚBLICO)
   (VERSIÓN DIRECTA – SE MANTIENE)
===================================================== */
router.get('/public/recomendado/producto/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const coctel = await Coctel.obtenerRecomendadoPorProducto(id);

    if (!coctel) {
      return res.json(null);
    }

    res.json(coctel);
  } catch (error) {
    console.error('ERROR /cocteles/public/recomendado/producto:', error);
    res.status(500).json({
      message: 'Error al obtener cóctel recomendado',
      error: error.message
    });
  }
});

/* =====================================================
   🔥 CÓCTEL RECOMENDADO POR PRODUCTO (PÚBLICO)
   (VERSIÓN LIMPIA USANDO CONTROLLER)
===================================================== */
router.get(
  '/public/recomendado/producto-controller/:id_producto',
  obtenerCoctelRecomendadoPorProducto
);

/* =====================================================
   🌍 CÓCTELES POR DESTILERÍA (PÚBLICO)
===================================================== */
router.get('/public/destileria/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        c.id_coctel,
        c.nombre,
        c.descripcion,
        c.destilado_principal,
        c.imagen_url,
        GROUP_CONCAT(
          CONCAT(
            ci.ingrediente,
            IF(ci.cantidad IS NOT NULL, CONCAT(' (', ci.cantidad, ')'), '')
          )
          SEPARATOR ', '
        ) AS ingredientes
      FROM cocteles c
      LEFT JOIN coctel_ingredientes ci 
        ON ci.id_coctel = c.id_coctel
      WHERE c.id_destileria = ?
        AND c.activo = 1
      GROUP BY c.id_coctel
      ORDER BY c.created_at DESC
      `,
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error('ERROR /cocteles/public/destileria:', error);
    res.status(500).json({
      message: 'Error al obtener cócteles públicos por destilería',
      error: error.message
    });
  }
});

/* =====================================================
   🔐 CÓCTELES POR DESTILERÍA (ADMIN)
===================================================== */
router.get('/destileria/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        c.id_coctel,
        c.nombre,
        c.descripcion,
        c.destilado_principal,
        c.imagen_url,
        c.activo,
        c.created_at,
        GROUP_CONCAT(
          CONCAT(
            ci.ingrediente,
            IF(ci.cantidad IS NOT NULL, CONCAT(' (', ci.cantidad, ')'), '')
          )
          SEPARATOR ', '
        ) AS ingredientes
      FROM cocteles c
      LEFT JOIN coctel_ingredientes ci 
        ON ci.id_coctel = c.id_coctel
      WHERE c.id_destileria = ?
      GROUP BY c.id_coctel
      ORDER BY c.created_at DESC
      `,
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error('ERROR /cocteles/destileria:', error);
    res.status(500).json({
      message: 'Error al obtener cócteles por destilería',
      error: error.message
    });
  }
});

/* ===== PRIVADO ===== */
router.use(authMiddleware);

router.post('/', crearCoctel);
router.put('/:id', actualizarCoctel);
router.delete('/:id', verificarRol(ROL_ADMIN), eliminarCoctel);

/* =====================================================
   🔥 GUARDAR INGREDIENTES
===================================================== */
router.post('/:id/ingredientes', async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredientes } = req.body;

    if (!Array.isArray(ingredientes)) {
      return res.status(400).json({
        message: 'Formato de ingredientes inválido'
      });
    }

    await pool.query(
      'DELETE FROM coctel_ingredientes WHERE id_coctel = ?',
      [id]
    );

    for (const ing of ingredientes) {
      if (!ing.ingrediente) continue;

      await pool.query(
        `
        INSERT INTO coctel_ingredientes
        (id_coctel, ingrediente, cantidad)
        VALUES (?, ?, ?)
        `,
        [id, ing.ingrediente, ing.cantidad || null]
      );
    }

    res.json({ message: 'Ingredientes guardados correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al guardar ingredientes',
      error: error.message
    });
  }
});

/* ===== IMÁGENES ===== */

router.post(
  '/:id/imagen',
  uploadCoctelImage.single('imagen'),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: 'No se subió ninguna imagen' });
      }

      const [rows] = await pool.query(
        'SELECT imagen_url FROM cocteles WHERE id_coctel = ?',
        [id]
      );

      if (!rows.length) {
        return res.status(404).json({ message: 'Cóctel no encontrado' });
      }

      if (rows[0].imagen_url) {
        const oldPath = path.join(process.cwd(), rows[0].imagen_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const imagenUrl = req.file.path
        .replace(process.cwd(), '')
        .replace(/\\/g, '/')
        .replace(/^\/+/, '');

      await pool.query(
        'UPDATE cocteles SET imagen_url = ? WHERE id_coctel = ?',
        [imagenUrl, id]
      );

      res.json({
        message: 'Imagen del cóctel subida correctamente',
        imagen_url: imagenUrl
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al subir imagen del cóctel',
        error: error.message
      });
    }
  }
);

router.delete('/:id/imagen', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT imagen_url FROM cocteles WHERE id_coctel = ?',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Cóctel no encontrado' });
    }

    const { imagen_url } = rows[0];
    if (!imagen_url) {
      return res.status(400).json({
        message: 'El cóctel no tiene imagen para eliminar'
      });
    }

    const fullPath = path.join(process.cwd(), imagen_url);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    await pool.query(
      'UPDATE cocteles SET imagen_url = NULL WHERE id_coctel = ?',
      [id]
    );

    res.json({ message: 'Imagen del cóctel eliminada correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al eliminar imagen del cóctel',
      error: error.message
    });
  }
});

export default router;
