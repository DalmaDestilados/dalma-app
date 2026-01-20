import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';
import { uploadCoctelImage } from '../middlewares/uploadCoctel.middleware.js';
import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';

import {
  crearCoctel,
  obtenerCoctelesPublicos,
  obtenerCoctelPorId,
  actualizarCoctel,
  eliminarCoctel
} from '../controllers/coctel.controller.js';

const router = express.Router();
const ROL_ADMIN = 3;

/* ===== PÚBLICO ===== */
router.get('/public', obtenerCoctelesPublicos);
router.get('/public/:id', obtenerCoctelPorId);

/* ===== PRIVADO ===== */
router.use(authMiddleware);

router.post('/', crearCoctel);
router.put('/:id', actualizarCoctel);
router.delete('/:id', verificarRol(ROL_ADMIN), eliminarCoctel);


//subir imagen
router.post(
  '/:id/imagen',
  uploadCoctelImage.single('imagen'),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          message: 'No se subió ninguna imagen'
        });
      }

      // Buscar imagen anterior
      const [rows] = await pool.query(
        'SELECT imagen_url FROM cocteles WHERE id_coctel = ?',
        [id]
      );

      if (!rows.length) {
        return res.status(404).json({
          message: 'Cóctel no encontrado'
        });
      }

      // Borrar imagen anterior si existe
      if (rows[0].imagen_url) {
        const oldPath = path.join(process.cwd(), rows[0].imagen_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Guardar nueva imagen
      const imagenUrl = req.file.path.replace(/\\/g, '/');

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

//eliminar imagen coctel
router.delete('/:id/imagen', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar imagen actual
    const [rows] = await pool.query(
      'SELECT imagen_url FROM cocteles WHERE id_coctel = ?',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: 'Cóctel no encontrado'
      });
    }

    const { imagen_url } = rows[0];

    if (!imagen_url) {
      return res.status(400).json({
        message: 'El cóctel no tiene imagen para eliminar'
      });
    }

    // Eliminar archivo físico
    const fullPath = path.join(process.cwd(), imagen_url);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Limpiar BD
    await pool.query(
      'UPDATE cocteles SET imagen_url = NULL WHERE id_coctel = ?',
      [id]
    );

    res.json({
      message: 'Imagen del cóctel eliminada correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al eliminar imagen del cóctel',
      error: error.message
    });
  }
});

export default router;
