import Favoritos from '../models/favoritos.model.js';

export const agregarFavorito = async (req, res) => {
  try {
    await Favoritos.agregar(req.usuario.id, req.params.id_producto);
    res.json({ message: 'Producto agregado a favoritos' });
  } catch {
    res.status(500).json({ error: 'Error al agregar favorito' });
  }
};

export const quitarFavorito = async (req, res) => {
  try {
    await Favoritos.quitar(req.usuario.id, req.params.id_producto);
    res.json({ message: 'Producto eliminado de favoritos' });
  } catch {
    res.status(500).json({ error: 'Error al quitar favorito' });
  }
};

export const obtenerFavoritos = async (req, res) => {
  try {
    const favoritos = await Favoritos.obtenerPorUsuario(req.usuario.id);
    res.json(favoritos);
  } catch {
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};
