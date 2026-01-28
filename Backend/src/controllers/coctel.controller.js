import Coctel from '../models/coctel.model.js';
import CoctelIngrediente from '../models/coctelIngrediente.model.js';
import pool from '../config/db.js';

const ROL_USUARIO = 1;
const ROL_BARTENDER = 2;
const ROL_ADMIN = 3;

const LIMITES = {
  [ROL_USUARIO]: 1,
  DESTILERIA: 5,
  [ROL_BARTENDER]: Infinity,
  [ROL_ADMIN]: Infinity
};

// ======================
// CREAR CÓCTEL
// ======================
export const crearCoctel = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      destilado_principal
    } = req.body;

    const {
      rol,
      id,
      id_destileria,
      id_bartender
    } = req.usuario;

    // ✅ FIX: NO validar ingredientes aquí
    if (!nombre || !destilado_principal) {
      return res.status(400).json({
        error: 'Nombre y destilado principal son obligatorios'
      });
    }

    let total = 0;

    // 🔥 FIX REAL: activo = 1
    const data = { 
      nombre, 
      descripcion, 
      destilado_principal,
      activo: 1
    };

    if (rol === ROL_USUARIO) {
      total = await Coctel.contarPorUsuario(id);
      data.id_usuario = id;
    }

    if (rol === ROL_BARTENDER) {
      data.id_bartender = id_bartender;
    }

    if (rol === ROL_ADMIN) {
      if (req.body.id_destileria) {
        data.id_destileria = req.body.id_destileria;
        total = await Coctel.contarPorDestileria(req.body.id_destileria);
      } else {
        return res.status(400).json({
          error: 'ADMIN debe indicar id_destileria al crear un cóctel'
        });
      }
    }

    if (total >= (LIMITES[rol] ?? LIMITES.DESTILERIA)) {
      return res.status(403).json({
        error: 'Límite de cócteles alcanzado'
      });
    }

    const id_coctel = await Coctel.crear(data);

    res.status(201).json({
      message: 'Cóctel creado correctamente',
      id_coctel
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear cóctel' });
  }
};

// ======================
// OBTENER CÓCTELES PÚBLICOS
// ======================
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

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener cócteles' });
  }
};

// ======================
// PERFIL CÓCTEL
// ======================
export const obtenerCoctelPorId = async (req, res) => {
  try {
    const coctel = await Coctel.obtenerPublicoPorId(req.params.id);

    if (!coctel) {
      return res.status(404).json({ error: 'Cóctel no encontrado' });
    }

    const ingredientes = await CoctelIngrediente.obtenerPorCoctel(
      coctel.id_coctel
    );

    res.json({ ...coctel, ingredientes });

  } catch {
    res.status(500).json({ error: 'Error al obtener cóctel' });
  }
};

// ======================
// ACTUALIZAR
// ======================
export const actualizarCoctel = async (req, res) => {
  try {
    const { rol, id } = req.usuario;
    const coctel = await Coctel.obtenerPorId(req.params.id);

    if (!coctel) {
      return res.status(404).json({ error: 'Cóctel no encontrado' });
    }

    if (rol !== ROL_ADMIN && coctel.id_usuario !== id) {
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

// ======================
// ELIMINAR (DESACTIVAR)
// ======================
export const eliminarCoctel = async (req, res) => {
  try {
    await Coctel.desactivar(req.params.id);
    res.json({ message: 'Cóctel eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar cóctel' });
  }
};

// ===================================================
// 🔥 NUEVO: CÓCTEL RECOMENDADO SEGÚN PRODUCTO
// ===================================================
export const obtenerCoctelRecomendadoPorProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    const coctel = await Coctel.obtenerRecomendadoPorProducto(id_producto);

    if (!coctel) {
      return res.json(null);
    }

    res.json(coctel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener cóctel recomendado' });
  }
};
