import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

import {
  agregarFavorito,
  quitarFavorito,
  obtenerFavoritos
} from '../controllers/favoritos.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', obtenerFavoritos);
router.post('/:id_producto', agregarFavorito);
router.delete('/:id_producto', quitarFavorito);

export default router;
