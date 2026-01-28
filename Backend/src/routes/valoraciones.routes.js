import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  valorarProducto,
  obtenerValoracionProducto,
  obtenerValoracionUsuario,
} from "../controllers/valoraciones.controller.js";

const router = express.Router();

// público
router.get("/producto/:id_producto", obtenerValoracionProducto);

// usuario logueado
router.get(
  "/producto/:id_producto/usuario",
  authMiddleware,
  obtenerValoracionUsuario
);

router.post(
  "/producto",
  authMiddleware,
  valorarProducto
);

export default router;
