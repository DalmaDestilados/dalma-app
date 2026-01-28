import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import verificarRol from "../middlewares/rol.middleware.js";
import { uploadEventoImage } from "../middlewares/uploadEvento.middleware.js";

import {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
  obtenerEventosPublicos,
  subirImagenEvento,
  obtenerEventosPorDestileria,
  crearEventoParaDestileria,
} from "../controllers/eventos.controller.js";

const router = express.Router();

// PÚBLICO
router.get("/", obtenerEventosPublicos);
router.get("/destileria/:id_destileria", obtenerEventosPorDestileria);
router.get("/:id", obtenerEventoPorId);


// ADMIN
router.post("/", authMiddleware, verificarRol(3), crearEvento);
router.get("/", authMiddleware, verificarRol(3), obtenerEventos);
router.get("/:id", authMiddleware, verificarRol(3), obtenerEventoPorId);
router.put("/:id", authMiddleware, verificarRol(3), actualizarEvento);
router.delete("/:id", authMiddleware, verificarRol(3), eliminarEvento);
router.post("/:id/imagen",authMiddleware, verificarRol(3),uploadEventoImage.single("imagen"),subirImagenEvento);
router.get("/destileria/:id_destileria", authMiddleware,verificarRol(3),obtenerEventosPorDestileria);
router.post("/destileria/:id_destileria", authMiddleware,verificarRol(3),crearEventoParaDestileria);

export default router;
