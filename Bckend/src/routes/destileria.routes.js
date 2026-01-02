import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';

import {
  crearPerfil,
  obtenerMiPerfil,
  actualizarPerfil,
  obtenerPerfilPublico
} from '../controllers/destileria.controller.js';

const router = express.Router();

const ROL_DESTILERIA = 25; 

// Rutas privadas 
router.post(
  '/perfil',
  authMiddleware,
  verificarRol(ROL_DESTILERIA),
  crearPerfil
);

router.get(
  '/perfil',
  authMiddleware,
  verificarRol(ROL_DESTILERIA),
  obtenerMiPerfil
);

router.put(
  '/perfil',
  authMiddleware,
  verificarRol(ROL_DESTILERIA),
  actualizarPerfil
);

//Ruta pública 
router.get(
  '/:id',
  obtenerPerfilPublico
);

export default router;
