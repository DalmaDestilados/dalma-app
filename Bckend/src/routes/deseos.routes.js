import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

import {
  agregarDeseo,
  quitarDeseo,
  obtenerDeseos
} from '../controllers/deseos.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', obtenerDeseos);
router.post('/:id_producto', agregarDeseo);
router.delete('/:id_producto', quitarDeseo);

export default router;
