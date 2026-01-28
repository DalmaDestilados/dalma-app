const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {

    // 🔒 Protección: usuario no autenticado
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // 👉 En tu DB el rol es id_rol, no "rol"
    const rol = req.usuario.rol ?? req.usuario.id_rol;

    // 🔒 Protección: rol no definido
    if (!rol) {
      return res.status(403).json({ error: 'Rol no definido' });
    }

    // 🔐 Validación de permisos
    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    next();
  };
};

export default verificarRol;
