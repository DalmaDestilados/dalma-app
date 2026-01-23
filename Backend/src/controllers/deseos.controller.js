import Deseos from '../models/deseos.model.js';

export const agregarDeseo = async (req, res) => {
  try {
    await Deseos.agregar(req.usuario.id, req.params.id_producto);
    res.json({ message: 'Producto agregado a lista de deseos' });
  } catch {
    res.status(500).json({ error: 'Error al agregar a deseos' });
  }
};

export const quitarDeseo = async (req, res) => {
  try {
    await Deseos.quitar(req.usuario.id, req.params.id_producto);
    res.json({ message: 'Producto eliminado de lista de deseos' });
  } catch {
    res.status(500).json({ error: 'Error al quitar de deseos' });
  }
};

export const obtenerDeseos = async (req, res) => {
  try {
    const deseos = await Deseos.obtenerPorUsuario(req.usuario.id);
    res.json(deseos);
  } catch {
    res.status(500).json({ error: 'Error al obtener lista de deseos' });
  }
};
