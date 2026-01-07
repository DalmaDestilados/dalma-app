import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';

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




export default router;
