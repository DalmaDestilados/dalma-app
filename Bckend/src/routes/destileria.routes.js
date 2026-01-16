import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';

import {
  crearDestileria,
  obtenerDestilerias,
  obtenerDestileriaPorId,
  actualizarDestileria,
  eliminarDestileria,
  obtenerDestileriasPublicas,
  obtenerDestileriaPublicaPorId,
  mostrarDestileria
} from '../controllers/destileria.controller.js';

const router = express.Router();

// Rutas publicas
router.get('/public', obtenerDestileriasPublicas);
router.get('/public/:id', obtenerDestileriaPublicaPorId);



// Rol ADMIN según la BD
const ROL_ADMIN = 3;

// Middleware global:
// 1. Verifica que el usuario esté autenticado
// 2. Verifica que tenga rol ADMIN
router.use(authMiddleware, verificarRol(ROL_ADMIN));

// Crear una destilería
router.post('/', crearDestileria);

// Obtener todas las destilerías
router.get('/', obtenerDestilerias);

// Obtener una destilería por ID
router.get('/:id', obtenerDestileriaPorId);

// Actualizar una destilería
router.put('/:id', actualizarDestileria);

// oculta (desactivar) una destilería
router.delete('/:id', eliminarDestileria);

// vuelve a mostrar la destileria oculta
router.patch('/:id/mostrar', mostrarDestileria);




export default router;
