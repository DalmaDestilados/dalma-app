import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';
import { obtenerUsuarios, crearUsuario } from '../controllers/usuario.controller.js';

const router = express.Router();

// Obtención de usuarios solo admin (rol 3)
router.get(
  '/',
  authMiddleware,
  verificarRol(3),
  obtenerUsuarios
);

router.post('/', crearUsuario);

export default router;
