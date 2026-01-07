import Producto from '../models/producto.model.js';

// Crear un producto (solo ADMIN)
export const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, id_destileria } = req.body;

    // Validaciones mínimas
    if (!nombre || !precio || !id_destileria) {
      return res.status(400).json({
        error: 'Nombre, precio e id_destileria son obligatorios'
      });
    }

    const id = await Producto.crear(req.body);

    res.status(201).json({
      message: 'Producto creado correctamente',
      id_producto: id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.obtenerTodos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.obtenerPorId(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Obtener productos por destilería
export const obtenerProductosPorDestileria = async (req, res) => {
  try {
    const { id_destileria } = req.params;

    const productos = await Producto.obtenerPorDestileria(id_destileria);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos de la destilería' });
  }
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.obtenerPorId(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await Producto.actualizar(id, req.body);

    res.json({ message: 'Producto actualizado correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar producto (soft delete)
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    await Producto.desactivar(id);

    res.json({ message: 'Producto desactivado correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

// Obtener productos públicos
export const obtenerProductosPublicos = async (req, res) => {
  try {
    const productos = await Producto.obtenerTodos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos públicos' });
  }
};

// Obtener producto público por ID
export const obtenerProductoPublicoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.obtenerPorId(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto público' });
  }
};

// Obtener productos públicos por destilería
export const obtenerProductosPublicosPorDestileria = async (req, res) => {
  try {
    const { id_destileria } = req.params;

    const productos = await Producto.obtenerPorDestileria(id_destileria);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos públicos' });
  }
};

