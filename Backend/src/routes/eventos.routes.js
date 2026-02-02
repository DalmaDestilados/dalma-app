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

/* =========================
   PÚBLICO
========================= */

// 👉 eventos públicos (globales + destilería)
router.get("/publicos", obtenerEventosPublicos);

// 👉 eventos públicos por destilería
router.get("/publicos/destileria/:id_destileria", obtenerEventosPorDestileria);

// 👉 ver evento público por id
router.get("/publicos/:id", obtenerEventoPorId);

/* =========================
   ADMIN
========================= */

// 👉 crear evento GLOBAL
router.post("/", authMiddleware, verificarRol(3), crearEvento);

// 👉 listar TODOS los eventos (admin)
router.get("/", authMiddleware, verificarRol(3), obtenerEventos);

// 👉 eventos por destilería (admin)
router.get(
  "/destileria/:id_destileria",
  authMiddleware,
  verificarRol(3),
  obtenerEventosPorDestileria
);

// 👉 crear evento para destilería
router.post(
  "/destileria/:id_destileria",
  authMiddleware,
  verificarRol(3),
  crearEventoParaDestileria
);

// 👉 obtener evento por id (admin)
router.get("/:id", authMiddleware, verificarRol(3), obtenerEventoPorId);

// 👉 actualizar evento
router.put("/:id", authMiddleware, verificarRol(3), actualizarEvento);

// 👉 eliminar evento
router.delete("/:id", authMiddleware, verificarRol(3), eliminarEvento);

// 👉 subir imagen evento
router.post(
  "/:id/imagen",
  authMiddleware,
  verificarRol(3),
  uploadEventoImage.single("imagen"),
  subirImagenEvento
);

export default router;
