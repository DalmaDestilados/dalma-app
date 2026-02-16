import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario.model.js';
import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';

const ROL_USUARIO = 1;

/* =========================
   EXISTENTE (NO TOCADO)
========================= */

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    console.error('ERROR SQL:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, id_rol, edad } = req.body;

    if (!nombre || !email || !password || !id_rol) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Validación +18 SOLO para usuario normal
    if (id_rol === ROL_USUARIO) {
      if (!edad) {
        return res.status(400).json({ error: 'La edad es obligatoria' });
      }

      if (edad < 18) {
        return res.status(403).json({ error: 'Debes ser mayor de 18 años' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await Usuario.crearUsuario({
      nombre,
      email,
      password: hashedPassword,
      id_rol,
      edad: edad ?? null
    });

    res.status(201).json({
      message: 'Usuario creado correctamente',
      id_usuario: id
    });

  } catch (error) {
    console.error('ERROR AL CREAR USUARIO:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

/* =========================
   🔥 PERFIL USUARIO
========================= */

// Obtener perfil del usuario logueado
export const obtenerPerfil = async (req, res) => {
  try {
    // ✅ FIX REAL: el middleware entrega id_usuario
    const id_usuario = req.user.id_usuario;

    const [rows] = await pool.query(
      `SELECT 
        id_usuario,
        nombre,
        email,
        edad,
        telefono,
        id_rol,
        foto_perfil
       FROM usuarios
       WHERE id_usuario = ?`,
      [id_usuario]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar datos del perfil
export const actualizarPerfil = async (req, res) => {
  try {
    // ✅ FIX REAL
    const id_usuario = req.user.id_usuario;
    const { nombre, telefono } = req.body;

    await pool.query(
      `UPDATE usuarios
       SET nombre = ?, telefono = ?
       WHERE id_usuario = ?`,
      [nombre, telefono ?? null, id_usuario]
    );

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};
// Cambiar correo con validación de contraseña
export const cambiarEmail = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }

    // Buscar usuario actual con contraseña
    const [rows] = await pool.query(
      "SELECT password FROM usuarios WHERE id_usuario = ?",
      [id_usuario]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Verificar si el nuevo email ya existe
    const [existing] = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE email = ?",
      [email]
    );

    if (existing.length) {
      return res.status(409).json({ error: "El correo ya está en uso" });
    }

    await pool.query(
      "UPDATE usuarios SET email = ? WHERE id_usuario = ?",
      [email, id_usuario]
    );

    res.json({ message: "Correo actualizado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar correo" });
  }
};


// Subir / cambiar foto de perfil
export const subirFotoPerfil = async (req, res) => {
  try {
    // ✅ FIX REAL
    const id_usuario = req.user.id_usuario;

    if (!req.file) {
      return res.status(400).json({ error: 'No se subió imagen' });
    }

    // obtener foto anterior (si existe)
    const [rows] = await pool.query(
      'SELECT foto_perfil FROM usuarios WHERE id_usuario = ?',
      [id_usuario]
    );

    if (rows.length && rows[0].foto_perfil) {
      const oldPath = path.join(process.cwd(), rows[0].foto_perfil);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const imageUrl = req.file.path.replace(/\\/g, '/');

    await pool.query(
      'UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?',
      [imageUrl, id_usuario]
    );

    res.json({
      message: 'Foto de perfil actualizada',
      foto_perfil: imageUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir foto de perfil' });
  }

};
