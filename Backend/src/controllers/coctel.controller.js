import Coctel from '../models/coctel.model.js';
import CoctelIngrediente from '../models/coctelIngrediente.model.js';
import pool from '../config/db.js';

const ROL_USUARIO = 1;
const ROL_BARTENDER = 2;
const ROL_ADMIN = 3;

/* ======================
   CREAR CÓCTEL
====================== */
export const crearCoctel = async (req, res) => {
  try {
    const { nombre, descripcion, destilado_principal } = req.body;

    const { id_usuario, id_rol } = req.user;

    if (!nombre || !destilado_principal) {
      return res.status(400).json({
        error: 'Nombre y destilado principal son obligatorios'
      });
    }

    const data = {
      nombre,
      descripcion,
      destilado_principal,
      activo: 1
    };

    // 👤 BARTENDER (ROL 2)
    if (id_rol === ROL_BARTENDER) {
      const [rows] = await pool.query(
        "SELECT id_bartender FROM bartenders WHERE id_usuario = ?",
        [id_usuario]
      );

  if (!rows.length) {
    return res.status(400).json({
      error: "El usuario no tiene perfil de bartender"
    });
  }

  data.id_bartender = rows[0].id_bartender;
}

    // 👑 ADMIN (ROL 3)
    if (id_rol === ROL_ADMIN) {
      if (!req.body.id_destileria) {
        return res.status(400).json({
          error: 'ADMIN debe indicar id_destileria'
        });
      }

      data.id_destileria = req.body.id_destileria;
    }

    // 👤 USUARIO NORMAL (ROL 1)
    if (id_rol === ROL_USUARIO) {
      data.id_usuario = id_usuario;
    }

    const id_coctel = await Coctel.crear(data);

    return res.status(201).json({
      message: 'Cóctel creado correctamente',
      id_coctel
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear cóctel' });
  }
};



/* ======================
   OBTENER PÚBLICOS
====================== */
export const obtenerCoctelesPublicos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id_coctel,
        c.nombre,
        c.descripcion,
        c.destilado_principal,
        c.imagen_url,
        GROUP_CONCAT(
          CONCAT(
            ci.ingrediente,
            IF(ci.cantidad IS NOT NULL, CONCAT(' (', ci.cantidad, ')'), '')
          )
          SEPARATOR ', '
        ) AS ingredientes
      FROM cocteles c
      LEFT JOIN coctel_ingredientes ci 
        ON ci.id_coctel = c.id_coctel
      WHERE c.activo = 1
      GROUP BY c.id_coctel
      ORDER BY c.created_at DESC
    `);

    return res.json(rows);
  } catch (error) {
    console.error('ERROR obtenerCoctelesPublicos:', error);
    return res.status(500).json({ error: 'Error al obtener cócteles' });
  }
};


/* ======================
   PERFIL CÓCTEL
====================== */
export const obtenerCoctelPorId = async (req, res) => {
  try {
    const coctel = await Coctel.obtenerPublicoPorId(req.params.id);

    if (!coctel) {
      return res.status(404).json({ error: 'Cóctel no encontrado' });
    }

    const ingredientes = await CoctelIngrediente.obtenerPorCoctel(
      coctel.id_coctel
    );

    return res.json({ ...coctel, ingredientes });

  } catch (error) {
    console.error('ERROR obtenerCoctelPorId:', error);
    return res.status(500).json({ error: 'Error al obtener cóctel' });
  }
};


/* ======================
   ACTUALIZAR
====================== */
export const actualizarCoctel = async (req, res) => {
  try {
    const { id_usuario, id_rol } = req.user;
    const coctel = await Coctel.obtenerPorId(req.params.id);

    if (!coctel) {
      return res.status(404).json({ error: "Cóctel no encontrado" });
    }

    // 🔥 ADMIN puede editar todo
    if (id_rol === ROL_ADMIN) {
      await Coctel.actualizar(req.params.id, req.body);
      return res.json({ message: "Cóctel actualizado correctamente" });
    }

    // 🔥 BARTENDER
    if (id_rol === ROL_BARTENDER) {
      const [rows] = await pool.query(
        "SELECT id_bartender FROM bartenders WHERE id_usuario = ?",
        [id_usuario]
      );

      if (!rows.length) {
        return res.status(403).json({ error: "No autorizado" });
      }

      const id_bartender = rows[0].id_bartender;

      if (coctel.id_bartender !== id_bartender) {
        return res.status(403).json({ error: "No autorizado" });
      }

      await Coctel.actualizar(req.params.id, req.body);

      return res.json({ message: "Cóctel actualizado correctamente" });
    }

    return res.status(403).json({ error: "No autorizado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar cóctel" });
  }
};



/* ======================
   ELIMINAR (DESACTIVAR)
====================== */
export const eliminarCoctel = async (req, res) => {
  try {
    await Coctel.desactivar(req.params.id);
    return res.json({ message: 'Cóctel eliminado correctamente' });
  } catch (error) {
    console.error('ERROR eliminarCoctel:', error);
    return res.status(500).json({ error: 'Error al eliminar cóctel' });
  }
};


/* ======================
   RECOMENDADO PRODUCTO
====================== */
export const obtenerCoctelRecomendadoPorProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const coctel = await Coctel.obtenerRecomendadoPorProducto(id_producto);
    return res.json(coctel || null);
  } catch (error) {
    console.error('ERROR recomendado:', error);
    return res.status(500).json({ error: 'Error al obtener cóctel recomendado' });
  }
};
