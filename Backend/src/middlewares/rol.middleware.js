const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const rol = req.user.id_rol;

    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    next();
  };
};

export default verificarRol;