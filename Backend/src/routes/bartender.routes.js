import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import verificarRol from "../middlewares/rol.middleware.js";
import { uploadBartender } from "../middlewares/uploadBartender.middleware.js";

import {
  obtenerMiPerfil,
  crearMiPerfilBartender,
  actualizarMiPerfilBartender,
  obtenerBartendersPublicos,
  obtenerBartenderPublicoPorId,
  cambiarEstadoBartender,
  obtenerBartendersAdmin,
} from "../controllers/bartender.controller.js";

const router = express.Router();

const ROL_BARTENDER = 2;
const ROL_ADMIN = 3;

/* =========================
   PUBLICO (SIN AUTH)
========================= */
router.get("/public", obtenerBartendersPublicos);
router.get("/public/:id", obtenerBartenderPublicoPorId);

/* =========================
   AUTH REQUIRED
========================= */
router.use(authMiddleware);

/* =========================
   BARTENDER (ROL 2)
========================= */
router.get(
  "/me",
  verificarRol(ROL_BARTENDER),
  obtenerMiPerfil
);

router.post(
  "/me",
  verificarRol(ROL_BARTENDER),
  crearMiPerfilBartender
);

router.put(
  "/me",
  verificarRol(ROL_BARTENDER),
  actualizarMiPerfilBartender
);

router.post(
  "/me/upload",
  verificarRol(ROL_BARTENDER),
  uploadBartender.fields([
    { name: "foto_perfil", maxCount: 1 },
    { name: "banner_perfil", maxCount: 1 },
  ]),
  actualizarMiPerfilBartender
);

/* =========================
   ADMIN (ROL 3)
========================= */
router.get(
  "/admin",
  verificarRol(ROL_ADMIN),
  obtenerBartendersAdmin
);

router.patch(
  "/:id/estado",
  verificarRol(ROL_ADMIN),
  cambiarEstadoBartender
);

export default router;
