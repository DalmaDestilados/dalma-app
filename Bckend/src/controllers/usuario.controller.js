import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario.model.js';

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
    const { nombre, email, password, id_rol } = req.body;

    if (!nombre || !email || !password || !id_rol) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await Usuario.crearUsuario({
      nombre,
      email,
      password: hashedPassword,
      id_rol
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
