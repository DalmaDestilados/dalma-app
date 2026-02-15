import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';

import { 
  obtenerUsuarios, 
  crearUsuario,
  obtenerPerfil,
  actualizarPerfil,
  subirFotoPerfil,
  cambiarEmail // 👈 agrega esto
} from '../controllers/usuario.controller.js';


// 🔥 USAMOS EL MIDDLEWARE QUE YA EXISTE
import { uploadPersonaImage } from '../middlewares/uploadPersona.middleware.js';

const router = express.Router();

/* =========================
   EXISTENTE (NO TOCADO)
========================= */

// Obtención de usuarios solo admin (rol 3)
router.get(
  '/',
  authMiddleware,
  verificarRol(3),
  obtenerUsuarios
);

router.post('/', crearUsuario);

/* =========================
   🔥 NUEVO – PERFIL USUARIO
========================= */
router.put(
  '/perfil/email',
  authMiddleware,
  cambiarEmail
);


// Obtener perfil del usuario logueado
router.get(
  '/perfil',
  authMiddleware,
  obtenerPerfil
);

// Actualizar datos del perfil
router.put(
  '/perfil',
  authMiddleware,
  actualizarPerfil
);

// Subir / cambiar foto de perfil
router.post(
  '/perfil/foto',
  authMiddleware,
  uploadPersonaImage.single('imagen'),
  subirFotoPerfil
);

export default router;
