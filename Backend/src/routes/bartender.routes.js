import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';

import {
  crearBartender,
  actualizarBartender,
  eliminarBartender,
  obtenerMiPerfil,
  obtenerBartendersPublicos,
  obtenerBartenderPublicoPorId,
  obtenerBartendersPorRegion
} from '../controllers/bartender.controller.js';

const router = express.Router();

const ROL_ADMIN = 3;
const ROL_BARTENDER = 2;

// Rutas publicas
router.get('/public', obtenerBartendersPublicos);
router.get('/public/:id', obtenerBartenderPublicoPorId);
router.get('/public/region/:region', obtenerBartendersPorRegion);

// Rutas privadas(Solo rol bartender y admin)
router.use(authMiddleware);

// Mi perfil (bartender)
router.get('/me', verificarRol(ROL_BARTENDER), obtenerMiPerfil);

// Crear bartender (ADMIN)
router.post('/', verificarRol(ROL_ADMIN), crearBartender);

// Actualizar perfil (ADMIN o dueño)
router.put('/:id', verificarRol(ROL_ADMIN, ROL_BARTENDER), actualizarBartender);

// Eliminar bartender (ADMIN)
router.delete('/:id', verificarRol(ROL_ADMIN), eliminarBartender);

export default router;
