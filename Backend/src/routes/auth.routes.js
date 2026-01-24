import express from "express";
import {
  login,
  register,
  verifyEmail
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

router.post("/verify-email", verifyEmail);
router.get("/verify-email", verifyEmail);


router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

export default router;
