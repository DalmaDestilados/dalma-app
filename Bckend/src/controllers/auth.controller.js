import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const ROLES = {
  usuario: 1,
  bartender: 2
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no existe' });
    }

    const usuario = rows[0];

    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      message: 'Login correcto',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.id_rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en login' });
  }
};

export const register = async (req, res) => {
  try {
    const { nombre, email, password, edad, telefono, rol } = req.body;

    if (!nombre || !email || !password || !edad || !rol) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    if (edad < 18) {
      return res.status(400).json({ error: 'Debes ser mayor de edad' });
    }

    if (!ROLES[rol]) {
      return res.status(400).json({ error: 'Rol no permitido' });
    }

    const [existe] = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE email = ?',
      [email]
    );

    if (existe.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO usuarios (nombre, email, password, edad, telefono, id_rol)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, email, hash, edad, telefono || null, ROLES[rol]]
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en registro' });
  }
};
