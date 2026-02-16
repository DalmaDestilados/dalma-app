import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';
import { uploadCoctelImage } from '../middlewares/uploadCoctel.middleware.js';
import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';
import Coctel from '../models/coctel.model.js';

import {
  crearCoctel,
  obtenerCoctelesPublicos,
  obtenerCoctelPorId,
  actualizarCoctel,
  eliminarCoctel,
  obtenerCoctelRecomendadoPorProducto
} from '../controllers/coctel.controller.js';

const router = express.Router();
const ROL_ADMIN = 3;

/* =====================================================
   🌍 RUTAS PÚBLICAS
===================================================== */

router.get('/', obtenerCoctelesPublicos);
router.get('/public', obtenerCoctelesPublicos);
router.get('/public/:id', obtenerCoctelPorId);

/* 🔥 Cóctel recomendado */
router.get(
  '/public/recomendado/producto/:id_producto',
  obtenerCoctelRecomendadoPorProducto
);

/* 🌍 Cócteles por DESTILERÍA (público) */
router.get('/public/destileria/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT c.*, 
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
    res.status(500).json({ message: 'Error público destilería', error });
  }
});

/* =====================================================
   CÓCTELES POR BARTENDER (PÚBLICO)
===================================================== */
router.get('/public/bartender/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        c.id_coctel,
        c.nombre,
        c.descripcion,
        c.destilado_principal,
        c.imagen_url
      FROM cocteles c
      WHERE c.id_bartender = ?
        AND c.activo = 1
      ORDER BY c.created_at DESC
    `, [id]);

    res.json(rows);
  } catch (error) {
    console.error('ERROR /cocteles/public/bartender:', error);
    res.status(500).json({
      message: 'Error al obtener cócteles del bartender'
    });
  }
});


/* =====================================================
   🔐 RUTAS PRIVADAS (requieren login)
===================================================== */

router.use(authMiddleware);

/* 🔐 Obtener MIS cócteles (bartender logueado) */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { id_usuario, id_rol } = req.user;

    
    if (id_rol === 2) {
      const [bartenderRows] = await pool.query(
        "SELECT id_bartender FROM bartenders WHERE id_usuario = ?",
        [id_usuario]
      );

      if (!bartenderRows.length) {
        return res.json([]);
      }

      const id_bartender = bartenderRows[0].id_bartender;

      const [cocteles] = await pool.query(
        `
        SELECT *
        FROM cocteles
        WHERE id_bartender = ?
        ORDER BY created_at DESC
        `,
        [id_bartender]
      );

      return res.json(cocteles);
    }

    // Si es admin (opcional)
    if (id_rol === 3) {
      const [rows] = await pool.query(
        "SELECT * FROM cocteles ORDER BY created_at DESC"
      );
      return res.json(rows);
    }

    return res.json([]);

  } catch (error) {
    console.error("ERROR /cocteles/me:", error);
    res.status(500).json({ error: "Error al obtener mis cócteles" });
  }
});


/* 🔐 Crear cóctel (admin o bartender) */
router.post('/', crearCoctel);

/* 🔐 Actualizar cóctel */
router.put('/:id', actualizarCoctel);

/* 🔐 Eliminar cóctel (solo admin) */
router.delete('/:id', verificarRol(ROL_ADMIN), eliminarCoctel);

/* 🔐 Guardar ingredientes */
router.post('/:id/ingredientes', async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredientes } = req.body;

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
    res.status(500).json({ message: 'Error ingredientes', error });
  }
});

/* 🔐 Subir imagen */
router.post(
  '/:id/imagen',
  uploadCoctelImage.single('imagen'),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file)
        return res.status(400).json({ message: 'No se subió imagen' });

      const imagenUrl = req.file.path
        .replace(process.cwd(), '')
        .replace(/\\/g, '/')
        .replace(/^\/+/, '');

      await pool.query(
        'UPDATE cocteles SET imagen_url = ? WHERE id_coctel = ?',
        [imagenUrl, id]
      );

      res.json({ message: 'Imagen subida', imagen_url: imagenUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error imagen', error });
    }
  }
);

/* 🔐 Eliminar imagen */
router.delete('/:id/imagen', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT imagen_url FROM cocteles WHERE id_coctel = ?',
      [id]
    );

    if (!rows.length)
      return res.status(404).json({ message: 'No encontrado' });

    const imagen = rows[0].imagen_url;
    if (imagen) {
      const fullPath = path.join(process.cwd(), imagen);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await pool.query(
      'UPDATE cocteles SET imagen_url = NULL WHERE id_coctel = ?',
      [id]
    );

    res.json({ message: 'Imagen eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminar imagen', error });
  }
});

export default router;
