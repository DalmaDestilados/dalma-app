import Producto from '../models/producto.model.js';
import fs from "fs";
import path from "path";
import pool from "../config/db.js";

// =====================
// ADMIN
// =====================

// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      grado_alcoholico,
      id_destileria
    } = req.body;

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
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// ADMIN LIST 
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.obtenerTodosAdmin();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener producto por ID (admin)
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

// Obtener productos por destilería (admin)
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

// Ocultar producto (soft delete)
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await Producto.desactivar(id);
    res.json({ message: 'Producto desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

//  MOSTRAR producto
export const mostrarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await Producto.activar(id);
    res.json({ message: 'Producto activado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al activar producto' });
  }
};

// =====================
// PÚBLICO
// =====================

export const obtenerProductosPublicos = async (req, res) => {
  try {
    const productos = await Producto.obtenerPublicos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos públicos' });
  }
};

export const obtenerProductoPublicoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.obtenerPublicoPorId(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto público' });
  }
};

export const obtenerProductosPublicosPorDestileria = async (req, res) => {
  try {
    const { id_destileria } = req.params;
    const productos = await Producto.obtenerPublicosPorDestileria(id_destileria);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos públicos' });
  }
};

export const subirImagenProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No se subió imagen" });
    }

    const [rows] = await pool.query(
      "SELECT imagen_url FROM productos WHERE id_producto = ?",
      [id]
    );

    if (rows.length && rows[0].imagen_url) {
      const oldPath = path.join(process.cwd(), rows[0].imagen_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const imageUrl = req.file.path.replace(/\\/g, "/");

    await pool.query(
      "UPDATE productos SET imagen_url = ? WHERE id_producto = ?",
      [imageUrl, id]
    );

    res.json({ message: "Imagen actualizada", imagen_url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error imagen producto", error });
  }
};

// =====================
// ⭐ NUEVO: RUEDA DE CATA (ADMIN)
// =====================

export const actualizarCataProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cata_aromas,
      cata_dulzor,
      cata_cuerpo,
      cata_persistencia
    } = req.body;

    await pool.query(
      `UPDATE productos
       SET cata_aromas = ?,
           cata_dulzor = ?,
           cata_cuerpo = ?,
           cata_persistencia = ?
       WHERE id_producto = ?`,
      [
        cata_aromas,
        cata_dulzor,
        cata_cuerpo,
        cata_persistencia,
        id
      ]
    );

    res.json({ message: "Rueda de cata actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar rueda de cata" });
  }
};
