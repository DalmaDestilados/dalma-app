import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';

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

export default router;
