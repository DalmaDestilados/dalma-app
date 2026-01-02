import Destileria from '../models/destileria.model.js';

const ROL_DESTILERIA = 25; 

// Crear perfil de destilería
export const crearPerfil = async (req, res) => {
  try {
    const { id, rol } = req.usuario;

    if (rol !== ROL_DESTILERIA) {
      return res.status(403).json({ error: 'Acceso no permitido' });
    }

    const existePerfil = await Destileria.obtenerPorUsuario(id);
    if (existePerfil) {
      return res.status(400).json({ error: 'El perfil ya existe' });
    }

    const {
      nombre_comercial,
      descripcion,
      email_contacto,
      telefono,
      direccion,
      imagen_logo,
      sitio_web
    } = req.body;

    if (!nombre_comercial) {
      return res.status(400).json({ error: 'El nombre comercial es obligatorio' });
    }

    const idPerfil = await Destileria.crearPerfil({
      id_usuario: id,
      nombre_comercial,
      descripcion,
      email_contacto,
      telefono,
      direccion,
      imagen_logo,
      sitio_web
    });

    res.status(201).json({
      message: 'Perfil de destilería creado correctamente',
      id_perfil_destileria: idPerfil
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear perfil de destilería' });
  }
};

// Obtener mi perfil (destilería logueada)
export const obtenerMiPerfil = async (req, res) => {
  try {
    const { id, rol } = req.usuario;

    if (rol !== ROL_DESTILERIA) {
      return res.status(403).json({ error: 'Acceso no permitido' });
    }

    const perfil = await Destileria.obtenerPorUsuario(id);

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json(perfil);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar mi perfil
export const actualizarPerfil = async (req, res) => {
  try {
    const { id, rol } = req.usuario;

    if (rol !== ROL_DESTILERIA) {
      return res.status(403).json({ error: 'Acceso no permitido' });
    }

    const perfil = await Destileria.obtenerPorUsuario(id);
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await Destileria.actualizarPerfil(id, req.body);

    res.json({ message: 'Perfil actualizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// Obtener perfil público
export const obtenerPerfilPublico = async (req, res) => {
  try {
    const { id } = req.params;

    const perfil = await Destileria.obtenerPublico(id);

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json(perfil);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener perfil público' });
  }
};
