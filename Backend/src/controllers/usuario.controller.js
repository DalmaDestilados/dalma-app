import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario.model.js';

const ROL_USUARIO = 1;

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
