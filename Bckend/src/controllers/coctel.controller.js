import Coctel from '../models/coctel.model.js';
import CoctelIngrediente from '../models/coctelIngrediente.model.js';

const ROL_ADMIN = 3;
const ROL_BARTENDER = 2;

// Crear cóctel
export const crearCoctel = async (req, res) => {
  try {
    const { nombre, descripcion, ingredientes } = req.body;
    const { rol, id } = req.usuario;

    if (!nombre || !ingredientes?.length) {
      return res.status(400).json({
        error: 'Nombre e ingredientes son obligatorios'
      });
    }

    const data = { nombre, descripcion };

    // Definir origen según rol
    if (rol === ROL_BARTENDER) {
      data.id_bartender = req.bartender.id_bartender;
    } else if (rol === ROL_ADMIN && req.body.id_destileria) {
      data.id_destileria = req.body.id_destileria;
    } else {
      data.id_usuario = id;
    }

    const id_coctel = await Coctel.crear(data);

    // Guardar ingredientes
    for (const ing of ingredientes) {
      await CoctelIngrediente.agregar(
        id_coctel,
        ing.ingrediente,
        ing.cantidad
      );
    }

    res.status(201).json({
      message: 'Cóctel creado correctamente',
      id_coctel
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al crear cóctel' });
  }
};

// Obtener cócteles públicos
export const obtenerCoctelesPublicos = async (req, res) => {
  try {
    const cocteles = await Coctel.obtenerPublicos();
    res.json(cocteles);
  } catch {
    res.status(500).json({ error: 'Error al obtener cócteles' });
  }
};

// Obtener cóctel con ingredientes
export const obtenerCoctelPorId = async (req, res) => {
  try {
    const coctel = await Coctel.obtenerPorId(req.params.id);
    if (!coctel) {
      return res.status(404).json({ error: 'Cóctel no encontrado' });
    }

    const ingredientes = await CoctelIngrediente.obtenerPorCoctel(coctel.id_coctel);
    res.json({ ...coctel, ingredientes });

  } catch {
    res.status(500).json({ error: 'Error al obtener cóctel' });
  }
};

// Actualizar cóctel
export const actualizarCoctel = async (req, res) => {
  try {
    const { rol, id } = req.usuario;
    const coctel = await Coctel.obtenerPorId(req.params.id);

    if (!coctel) {
      return res.status(404).json({ error: 'Cóctel no encontrado' });
    }

    // Validar permisos
    if (
      rol !== ROL_ADMIN &&
      coctel.id_usuario !== id
    ) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await Coctel.actualizar(req.params.id, req.body);

    if (req.body.ingredientes) {
      await CoctelIngrediente.eliminarPorCoctel(req.params.id);
      for (const ing of req.body.ingredientes) {
        await CoctelIngrediente.agregar(
          req.params.id,
          ing.ingrediente,
          ing.cantidad
        );
      }
    }

    res.json({ message: 'Cóctel actualizado correctamente' });

  } catch {
    res.status(500).json({ error: 'Error al actualizar cóctel' });
  }
};

// Eliminar cóctel (ADMIN)
export const eliminarCoctel = async (req, res) => {
  try {
    await Coctel.desactivar(req.params.id);
    res.json({ message: 'Cóctel eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar cóctel' });
  }
};
