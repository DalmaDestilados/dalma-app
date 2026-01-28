import pool from '../config/db.js';

const Coctel = {

  // =====================
  // CONTADORES
  // =====================
  async contarPorUsuario(id_usuario) {
    const [[row]] = await pool.query(
      'SELECT COUNT(*) total FROM cocteles WHERE id_usuario = ?',
      [id_usuario]
    );
    return row.total;
  },

  async contarPorDestileria(id_destileria) {
    const [[row]] = await pool.query(
      'SELECT COUNT(*) total FROM cocteles WHERE id_destileria = ?',
      [id_destileria]
    );
    return row.total;
  },

  async contarPorBartender(id_bartender) {
    const [[row]] = await pool.query(
      'SELECT COUNT(*) total FROM cocteles WHERE id_bartender = ?',
      [id_bartender]
    );
    return row.total;
  },

  // =====================
  // CREAR
  // =====================
  async crear(data) {
    const {
      nombre,
      descripcion,
      destilado_principal,
      id_bartender,
      id_destileria,
      id_usuario
    } = data;

    const [result] = await pool.query(
      `INSERT INTO cocteles
       (nombre, descripcion, destilado_principal, id_bartender, id_destileria, id_usuario)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion || null,
        destilado_principal,
        id_bartender || null,
        id_destileria || null,
        id_usuario || null
      ]
    );

    return result.insertId;
  },

  // =====================
  // PÚBLICO
  // =====================
  async obtenerPublicos() {
    const [rows] = await pool.query(`
      SELECT
        c.id_coctel,
        c.nombre,
        c.descripcion,
        c.destilado_principal,
        c.imagen_url,
        c.id_destileria
      FROM cocteles c
      LEFT JOIN destilerias d ON c.id_destileria = d.id_destileria
      WHERE c.activo = 1
        AND (c.id_destileria IS NULL OR d.activo = 1)
      ORDER BY c.created_at DESC
    `);
    return rows;
  },

  async obtenerPublicoPorId(id) {
    const [rows] = await pool.query(`
      SELECT
        c.id_coctel,
        c.nombre,
        c.descripcion,
        c.destilado_principal,
        c.imagen_url,
        c.id_destileria
      FROM cocteles c
      WHERE c.id_coctel = ?
        AND c.activo = 1
      LIMIT 1
    `, [id]);

    return rows[0] || null;
  },

  // =====================
  // 🔥 NUEVO (NO REEMPLAZA NADA)
  // CÓCTEL RECOMENDADO SEGÚN PRODUCTO REAL
  // =====================
  async obtenerRecomendadoPorProducto(id_producto) {

  // 1️⃣ Obtener producto real
  const [[producto]] = await pool.query(
    `
    SELECT id_producto, nombre, id_destileria
    FROM productos
    WHERE id_producto = ?
      AND activo = 1
    `,
    [id_producto]
  );

  if (!producto) return null;

  // 2️⃣ Buscar cóctel cuyo destilado_principal sea ESTE producto
  const [[coctel]] = await pool.query(
  `
  SELECT
    c.id_coctel,
    c.nombre,
    c.descripcion,
    c.destilado_principal,
    c.imagen_url,
    p.id_producto
  FROM cocteles c
  JOIN productos p
    ON p.categoria = c.destilado_principal
   AND p.id_destileria = c.id_destileria
  WHERE c.activo = 1
    AND p.activo = 1
    AND p.id_producto = ?
  ORDER BY c.created_at DESC
  LIMIT 1
  `,
  [id_producto]
);

  if (!coctel) return null;

  // 3️⃣ Ingredientes del cóctel
  const [ingredientes] = await pool.query(
    `
    SELECT ingrediente, cantidad
    FROM coctel_ingredientes
    WHERE id_coctel = ?
    `,
    [coctel.id_coctel]
  );

  return { ...coctel, ingredientes };
},

  // =====================
  // ADMIN
  // =====================
  async obtenerPorId(id) {
    const [rows] = await pool.query(
      'SELECT * FROM cocteles WHERE id_coctel = ?',
      [id]
    );
    return rows[0] || null;
  },

  async actualizar(id, data) {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(data)) {
      campos.push(`${key} = ?`);
      valores.push(value);
    }

    if (!campos.length) return;

    valores.push(id);

    await pool.query(
      `UPDATE cocteles SET ${campos.join(', ')} WHERE id_coctel = ?`,
      valores
    );
  },

  async desactivar(id) {
    await pool.query(
      'UPDATE cocteles SET activo = 0 WHERE id_coctel = ?',
      [id]
    );
  }

};

export default Coctel;
