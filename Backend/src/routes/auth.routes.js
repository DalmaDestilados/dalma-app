import express from "express";
import {
  login,
  register,
  verifyEmail
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

/* 🔥 FALTABA ESTA */
router.post('/verify-email', verifyEmail);
router.get('/verify-email', verifyEmail);



export default router;
