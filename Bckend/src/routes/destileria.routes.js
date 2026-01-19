import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import verificarRol from '../middlewares/rol.middleware.js';
import { uploadDestileriaImage } from '../middlewares/uploadDestileria.middleware.js';
import { uploadGaleriaImages } from '../middlewares/uploadGaleria.middleware.js';
import { uploadPersonaImage } from '../middlewares/uploadPersona.middleware.js';
import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';




import {
  crearDestileria,
  obtenerDestilerias,
  obtenerDestileriaPorId,
  actualizarDestileria,
  eliminarDestileria,
  obtenerDestileriasPublicas,
  obtenerDestileriaPublicaPorId,
  mostrarDestileria
} from '../controllers/destileria.controller.js';

const router = express.Router();

// Rutas publicas
router.get('/public', obtenerDestileriasPublicas);
router.get('/public/:id', obtenerDestileriaPublicaPorId);

//endpoint para obtener todo el perfil de la destileria
router.get('/:id/perfil', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener datos base de la destilería
    const [destileriaRows] = await pool.query(
      `SELECT 
        id_destileria,
        nombre_comercial,
        descripcion,
        logo_url,
        persona_url,
        persona_nombre,
        persona_descripcion
       FROM destilerias
       WHERE id_destileria = ? AND activo = 1`,
      [id]
    );

    if (destileriaRows.length === 0) {
      return res.status(404).json({
        message: 'Destilería no encontrada'
      });
    }

    const destileria = destileriaRows[0];

    //  Obtener galería
    const [galeriaRows] = await pool.query(
      `SELECT id, imagen_url, orden
       FROM destileria_galeria
       WHERE destileria_id = ?
       ORDER BY orden ASC, created_at ASC`,
      [id]
    );

    // Armar respuesta final
    res.json({
      id_destileria: destileria.id_destileria,
      nombre_comercial: destileria.nombre_comercial,
      descripcion: destileria.descripcion,
      logo_url: destileria.logo_url,

      persona: {
        nombre: destileria.persona_nombre,
        descripcion: destileria.persona_descripcion,
        imagen_url: destileria.persona_url
      },

      galeria: galeriaRows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener perfil de destilería',
      error: error.message
    });
  }
});




// Rol ADMIN según la BD
const ROL_ADMIN = 3;

// Middleware global:
// 1. Verifica que el usuario esté autenticado
// 2. Verifica que tenga rol ADMIN
router.use(authMiddleware, verificarRol(ROL_ADMIN));

// Crear una destilería
router.post('/', crearDestileria);

// Obtener todas las destilerías
router.get('/', obtenerDestilerias);

// Obtener una destilería por ID
router.get('/:id', obtenerDestileriaPorId);

// Actualizar una destilería
router.put('/:id', actualizarDestileria);

// oculta (desactivar) una destilería
router.delete('/:id', eliminarDestileria);

// vuelve a mostrar la destileria oculta
router.patch('/:id/mostrar', mostrarDestileria);

//subir imagenes
router.post(
  '/:id/imagen',
  uploadDestileriaImage.single('imagen'),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          message: 'No se subió ninguna imagen'
        });
      }

      // 1️⃣ Buscar logo actual
      const [rows] = await pool.query(
        'SELECT logo_url FROM destilerias WHERE id_destileria = ?',
        [id]
      );

      if (rows.length > 0 && rows[0].logo_url) {
        const oldPath = path.join(process.cwd(), rows[0].logo_url);

        // 2️⃣ Borrar archivo anterior si existe
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // 3️⃣ Guardar nuevo logo
      const logoUrl = req.file.path.replace(/\\/g, '/');

      // 4️⃣ Actualizar BD
      await pool.query(
        'UPDATE destilerias SET logo_url = ? WHERE id_destileria = ?',
        [logoUrl, id]
      );

      res.json({
        message: 'Logo de destilería actualizado correctamente',
        logo_url: logoUrl
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al subir imagen',
        error: error.message
      });
    }
  }
);
//subir imagenes a la galeria para carrusel
router.post(
  '/:id/galeria',
  uploadGaleriaImages.array('imagenes', 10), // hasta 10 imágenes
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: 'No se subieron imágenes'
        });
      }

      // Insertar cada imagen en la BD
      const values = req.files.map(file => [
        id,
        file.path.replace(/\\/g, '/')
      ]);

      await pool.query(
        'INSERT INTO destileria_galeria (destileria_id, imagen_url) VALUES ?',
        [values]
      );

      res.json({
        message: 'Imágenes de galería subidas correctamente',
        cantidad: req.files.length
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al subir imágenes de galería',
        error: error.message
      });
    }
  }
);
// get para obtener las imagenes subidas
router.get('/:id/galeria', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, imagen_url, orden
       FROM destileria_galeria
       WHERE destileria_id = ?
       ORDER BY orden ASC, created_at ASC`,
      [id]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener galería',
      error: error.message
    });
  }
});

//ingresa la imagen de la persona en conocenos 
router.post(
  '/:id/persona',
  uploadPersonaImage.single('imagen'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;

      if (!req.file) {
        return res.status(400).json({
          message: 'No se subió ninguna imagen'
        });
      }

      //  Buscar imagen anterior
      const [rows] = await pool.query(
        'SELECT persona_url FROM destilerias WHERE id_destileria = ?',
        [id]
      );

      //  Borrar imagen anterior si existe
      if (rows.length && rows[0].persona_url) {
        const oldPath = path.join(process.cwd(), rows[0].persona_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      //  Guardar nueva imagen
      const personaUrl = req.file.path.replace(/\\/g, '/');

      //  Actualizar BD
      await pool.query(
        `UPDATE destilerias
         SET persona_url = ?, persona_nombre = ?, persona_descripcion = ?
         WHERE id_destileria = ?`,
        [personaUrl, nombre || null, descripcion || null, id]
      );

      res.json({
        message: 'Persona destacada actualizada correctamente',
        persona_url: personaUrl
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al subir persona destacada',
        error: error.message
      });
    }
  }
);

//endpoint para eliminar las imagenes 
router.delete('/galeria/:imagenId', async (req, res) => {
  try {
    const { imagenId } = req.params;

    // 1️⃣ Buscar imagen en BD
    const [rows] = await pool.query(
      'SELECT imagen_url FROM destileria_galeria WHERE id = ?',
      [imagenId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Imagen no encontrada'
      });
    }

    const imagePath = rows[0].imagen_url;
    const fullPath = path.join(process.cwd(), imagePath);

    // 2️⃣ Borrar archivo físico si existe
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // 3️⃣ Borrar registro BD
    await pool.query(
      'DELETE FROM destileria_galeria WHERE id = ?',
      [imagenId]
    );

    res.json({
      message: 'Imagen de galería eliminada correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al eliminar imagen de galería',
      error: error.message
    });
  }
});



export default router;
