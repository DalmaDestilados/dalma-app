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
  obtenerProductosPublicosPorDestileria
} from '../controllers/producto.controller.js';

const router = express.Router();
const ROL_ADMIN = 3;

// Rutas publicas
router.get('/public', obtenerProductosPublicos);
router.get('/public/:id', obtenerProductoPublicoPorId);
router.get('/public/destileria/:id_destileria', obtenerProductosPublicosPorDestileria);



// Rutas protegidas solo para ADMIN
router.use(authMiddleware, verificarRol(ROL_ADMIN));

// Crear producto
router.post('/', crearProducto);

// Obtener todos los productos
router.get('/', obtenerProductos);

// Obtener producto por ID
router.get('/:id', obtenerProductoPorId);

// Obtener productos por destilería
router.get('/destileria/:id_destileria', obtenerProductosPorDestileria);

// Actualizar producto
router.put('/:id', actualizarProducto);

// Eliminar producto (soft delete)
router.delete('/:id', eliminarProducto);


// endpoint para subir imagenes de los productos
router.post(
  '/:id/imagen',
  uploadProductoImage.single('imagen'),
  async (req, res) => {
    try {
      const { id } = req.params; // id_producto
      const { id_destileria } = req.body;

      if (!req.file) {
        return res.status(400).json({
          message: 'No se subió ninguna imagen'
        });
      }

      // Buscar imagen anterior
      const [rows] = await pool.query(
        'SELECT imagen_url FROM productos WHERE id_producto = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: 'Producto no encontrado'
        });
      }

      // Borrar imagen anterior si existe
      if (rows[0].imagen_url) {
        const oldPath = path.join(process.cwd(), rows[0].imagen_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      //  Guardar nueva imagen
      const imagenUrl = req.file.path.replace(/\\/g, '/');

      //  Actualizar BD
      await pool.query(
        'UPDATE productos SET imagen_url = ? WHERE id_producto = ?',
        [imagenUrl, id]
      );

      res.json({
        message: 'Imagen de producto actualizada correctamente',
        imagen_url: imagenUrl
      });

    } catch (error) {
      console.error(error);
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

    // Buscar imagen actual
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

    // Borrar archivo físico si existe
    if (imagen_url) {
      const fullPath = path.join(process.cwd(), imagen_url);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    //  Limpiar BD
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
