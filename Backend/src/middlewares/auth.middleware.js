import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔧 NORMALIZAMOS el usuario para TODO el backend
    req.usuario = {
      id_usuario: decoded.id,
      rol: decoded.rol ?? decoded.id_rol,
      id_rol: decoded.id_rol ?? decoded.rol
    };

    // 🔥 NUEVO: alias estándar (CLAVE)
    req.user = req.usuario;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export default authMiddleware;
