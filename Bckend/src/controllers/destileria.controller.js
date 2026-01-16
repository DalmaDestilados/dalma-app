import Destileria from '../models/destileria.model.js';

// Crea una nueva destilería (solo ADMIN)
export const crearDestileria = async (req, res) => {
  try {
    const { nombre_comercial } = req.body;

    // Validación mínima
    if (!nombre_comercial) {
      return res.status(400).json({ error: 'El nombre comercial es obligatorio' });
    }

    const id = await Destileria.crear(req.body);

    res.status(201).json({
      message: 'Destilería creada correctamente',
      id_destileria: id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear destilería' });
  }
};

// Obtiene todas las destilerías activas
export const obtenerDestilerias = async (req, res) => {
  try {
    const destilerias = await Destileria.obtenerTodas();
    res.json(destilerias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener destilerías' });
  }
};

// Obtiene una destilería específica por ID
export const obtenerDestileriaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const destileria = await Destileria.obtenerPorId(id);

    if (!destileria) {
      return res.status(404).json({ error: 'Destilería no encontrada' });
    }

    res.json(destileria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener destilería' });
  }
};

// Actualiza los datos de una destilería existente
export const actualizarDestileria = async (req, res) => {
  try {
    const { id } = req.params;

    const destileria = await Destileria.obtenerPorId(id);
    if (!destileria) {
      return res.status(404).json({ error: 'Destilería no encontrada' });
    }

    await Destileria.actualizar(id, req.body);

    res.json({ message: 'Destilería actualizada correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar destilería' });
  }
};

// oculta una destilería de forma lógica (soft delete)
export const eliminarDestileria = async (req, res) => {
  try {
    const { id } = req.params;

    await Destileria.desactivar(id);

    res.json({ message: 'Destilería desactivada correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar destilería' });
  }
};

// Vuelve a mostrar una destilería (ADMIN)
export const mostrarDestileria = async (req, res) => {
  try {
    const { id } = req.params;

    await Destileria.mostrar(id);

    res.json({ message: 'Destilería visible nuevamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al mostrar destilería' });
  }
};


// Obtener destilerías públicas (sin auth)
export const obtenerDestileriasPublicas = async (req, res) => {
  try {
    const destilerias = await Destileria.obtenerTodas();
    res.json(destilerias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener destilerías públicas' });
  }
};

// Obtener una destilería pública por ID
export const obtenerDestileriaPublicaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const destileria = await Destileria.obtenerPorId(id);

    if (!destileria) {
      return res.status(404).json({ error: 'Destilería no encontrada' });
    }

    res.json(destileria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener destilería pública' });
  }
};

