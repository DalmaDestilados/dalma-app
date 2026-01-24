import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';
import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';
import { uploadProductoImage } from '../middlewares/uploadProducto.middleware.js';

import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosPorDestileria,
  actualizarProducto,
  eliminarProducto,
  obtenerProductoPublicoPorId,
  obtenerProductosPublicos,
  obtenerProductosPublicosPorDestileria,
  mostrarProducto
} from '../controllers/producto.controller.js';

const router = express.Router();
const ROL_ADMIN = 3;

/* =====================================================
    RUTAS PÚBLICAS (SOLO PRODUCTOS ACTIVOS)
===================================================== */

// listado público
router.get('/', obtenerProductosPublicos);

// alias público
router.get('/public', obtenerProductosPublicos);

// detalle público
router.get('/public/:id', obtenerProductoPublicoPorId);

// productos públicos por destilería
router.get(
  '/public/destileria/:id_destileria',
  obtenerProductosPublicosPorDestileria
);

/* =====================================================
    RUTAS ADMIN
===================================================== */

router.use(authMiddleware, verificarRol(ROL_ADMIN));

//  LISTADO ADMIN (activos + ocultos)
router.get('/admin/list', obtenerProductos);

// crear producto
router.post('/', crearProducto);

// obtener producto por ID (admin)
router.get('/:id', obtenerProductoPorId);

// obtener productos por destilería (admin)
router.get('/destileria/:id_destileria', obtenerProductosPorDestileria);

// actualizar producto
router.put('/:id', actualizarProducto);

//  ocultar producto (soft delete)
router.delete('/:id', eliminarProducto);

//  mostrar / reactivar producto
router.patch('/:id/mostrar', mostrarProducto);

/* =====================================================
    IMÁGENES DE PRODUCTO
===================================================== */

router.post(
  '/:id/imagen',
  uploadProductoImage.single('imagen'),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          message: 'No se subió ninguna imagen'
        });
      }

      const [rows] = await pool.query(
        'SELECT imagen_url FROM productos WHERE id_producto = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: 'Producto no encontrado'
        });
      }

      // borrar imagen anterior
      if (rows[0].imagen_url) {
        const oldPath = path.join(process.cwd(), rows[0].imagen_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const imagenUrl = req.file.path.replace(/\\/g, '/');

      await pool.query(
        'UPDATE productos SET imagen_url = ? WHERE id_producto = ?',
        [imagenUrl, id]
      );

      res.json({
        message: 'Imagen de producto actualizada correctamente',
        imagen_url: imagenUrl
      });

    } catch (error) {
      res.status(500).json({
        message: 'Error al subir imagen de producto',
        error: error.message
      });
    }
  }
);

router.delete('/:id/imagen', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT imagen_url FROM productos WHERE id_producto = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    const { imagen_url } = rows[0];

    if (imagen_url) {
      const fullPath = path.join(process.cwd(), imagen_url);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await pool.query(
      'UPDATE productos SET imagen_url = NULL WHERE id_producto = ?',
      [id]
    );

    res.json({
      message: 'Imagen del producto eliminada correctamente'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar imagen del producto',
      error: error.message
    });
  }
});

export default router;
