import Evento from "../models/evento.model.js";
import fs from "fs";
import path from "path";
import pool from "../config/db.js";

// =====================
// ADMIN
// =====================

// Crear evento (GLOBAL – SIN DESTILERÍA)  ⭐ NUEVO
export const crearEvento = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      ubicacion,
      fecha
    } = req.body;

    if (!titulo || !fecha) {
      return res.status(400).json({
        error: "Título y fecha son obligatorios",
      });
    }

    // 👉 Evento GLOBAL → id_destileria = NULL
    const [result] = await pool.query(
      `INSERT INTO eventos
       (titulo, descripcion, categoria, ubicacion, fecha, id_destileria)
       VALUES (?, ?, ?, ?, ?, NULL)`,
      [titulo, descripcion, categoria, ubicacion, fecha]
    );

    res.status(201).json({
      message: "Evento global creado correctamente",
      id_evento: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear evento" });
  }
};

// Listar eventos (admin)
export const obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.obtenerTodosAdmin();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener eventos" });
  }
};

// Obtener evento por ID
export const obtenerEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.obtenerPorId(id);

    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener evento" });
  }
};

// Actualizar evento
export const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.obtenerPorId(id);
    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    await Evento.actualizar(id, req.body);
    res.json({ message: "Evento actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar evento" });
  }
};

// Eliminar evento
export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    await Evento.eliminar(id);
    res.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar evento" });
  }
};

// =====================
// PÚBLICO
// =====================

export const obtenerEventosPublicos = async (req, res) => {
  try {
    const eventos = await Evento.obtenerPublicos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener eventos públicos" });
  }
};

// =====================
// IMAGEN
// =====================

export const subirImagenEvento = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No se subió imagen" });
    }

    const [rows] = await pool.query(
      "SELECT imagen_url FROM eventos WHERE id_evento = ?",
      [id]
    );

    // borrar imagen anterior
    if (rows.length && rows[0].imagen_url) {
      const oldPath = path.join(process.cwd(), rows[0].imagen_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const imageUrl = req.file.path.replace(/\\/g, "/");

    await pool.query(
      "UPDATE eventos SET imagen_url = ? WHERE id_evento = ?",
      [imageUrl, id]
    );

    res.json({ message: "Imagen actualizada", imagen_url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error imagen evento", error });
  }
};

// =====================
// ADMIN – DESTILERÍA
// =====================

// eventos por destilería
export const obtenerEventosPorDestileria = async (req, res) => {
  try {
    const { id_destileria } = req.params;
    const eventos = await Evento.obtenerPorDestileria(id_destileria);
    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener eventos de la destilería",
    });
  }
};

// crear evento para destilería
export const crearEventoParaDestileria = async (req, res) => {
  try {
    const { id_destileria } = req.params;
    const id = await Evento.crearParaDestileria(id_destileria, req.body);
    res.status(201).json({ id_evento: id });
  } catch {
    res.status(500).json({ error: "Error al crear evento" });
  }
};
