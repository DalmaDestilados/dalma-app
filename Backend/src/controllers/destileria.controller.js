import Destileria from '../models/destileria.model.js';

// Crea una nueva destilería (solo ADMIN)
export const crearDestileria = async (req, res) => {
  try {
    const { nombre_comercial } = req.body;

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

/* =========================
    ADMIN
========================= */

// ADMIN → activas + inactivas
export const obtenerDestilerias = async (req, res) => {
  try {
    const destilerias = await Destileria.obtenerTodas();
    res.json(destilerias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener destilerías' });
  }
};

// ADMIN → puede ver aunque esté inactiva
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

// SOFT DELETE (NO BORRA)
export const eliminarDestileria = async (req, res) => {
  try {
    const { id } = req.params;

    await Destileria.desactivar(id);

    res.json({ message: 'Destilería desactivada correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar destilería' });
  }
};

// REACTIVAR
export const mostrarDestileria = async (req, res) => {
  try {
    const { id } = req.params;

    await Destileria.mostrar(id);

    res.json({ message: 'Destilería visible nuevamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al mostrar destilería' });
  }
};

/* =========================
    PÚBLICO (USUARIOS)
========================= */

//  SOLO ACTIVAS
//  USUARIOS → SOLO DESTILERÍAS ACTIVAS
export const obtenerDestileriasPublicas = async (req, res) => {
  try {
    const destilerias = await Destileria.obtenerActivas();
    res.json(destilerias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener destilerías públicas' });
  }
};


//  SOLO SI ESTÁ ACTIVA
export const obtenerDestileriaPublicaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const destileria = await Destileria.obtenerActivaPorId(id);

    if (!destileria) {
      return res.status(404).json({ error: 'Destilería no encontrada' });
    }

    res.json(destileria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener destilería pública' });
  }
};
