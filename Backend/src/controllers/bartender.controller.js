import Bartender from '../models/bartender.model.js';

const ROL_ADMIN = 3;
const ROL_BARTENDER = 2;

/* ========= ADMIN ========= */

// Crear perfil bartender
export const crearBartender = async (req, res) => {
  try {
    const { id_usuario, nombre_publico, region } = req.body;

    if (!id_usuario || !nombre_publico || !region) {
      return res.status(400).json({
        error: 'id_usuario, nombre_publico y region son obligatorios'
      });
    }

    const id = await Bartender.crear(req.body);

    res.status(201).json({
      message: 'Bartender creado correctamente',
      id_bartender: id
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al crear bartender' });
  }
};

// Eliminar (soft delete)
export const eliminarBartender = async (req, res) => {
  try {
    const { id } = req.params;
    await Bartender.desactivar(id);
    res.json({ message: 'Bartender desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar bartender' });
  }
};

/* ========= ADMIN + BARTENDER ========= */

// Actualizar perfil
export const actualizarBartender = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id: id_usuario } = req.usuario;

    const bartender = await Bartender.obtenerPorId(id);
    if (!bartender) {
      return res.status(404).json({ error: 'Bartender no encontrado' });
    }

    // Bartender solo puede editar su propio perfil
    if (rol === ROL_BARTENDER && bartender.id_usuario !== id_usuario) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await Bartender.actualizar(id, req.body);
    res.json({ message: 'Perfil actualizado correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar bartender' });
  }
};

// Obtener mi perfil (bartender)
export const obtenerMiPerfil = async (req, res) => {
  try {
    const bartender = await Bartender.obtenerPorUsuario(req.usuario.id);

    if (!bartender) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json(bartender);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

/* ========= PÚBLICO ========= */

export const obtenerBartendersPublicos = async (req, res) => {
  try {
    const bartenders = await Bartender.obtenerTodos();
    res.json(bartenders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener bartenders' });
  }
};

export const obtenerBartenderPublicoPorId = async (req, res) => {
  try {
    const bartender = await Bartender.obtenerPorId(req.params.id);

    if (!bartender) {
      return res.status(404).json({ error: 'Bartender no encontrado' });
    }

    res.json(bartender);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener bartender' });
  }
};

export const obtenerBartendersPorRegion = async (req, res) => {
  try {
    const bartenders = await Bartender.obtenerPorRegion(req.params.region);
    res.json(bartenders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener bartenders por región' });
  }
};
