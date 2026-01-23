const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    const { rol } = req.usuario;

    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    next();
  };
};

export default verificarRol;
