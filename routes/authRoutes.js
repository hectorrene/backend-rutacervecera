const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users.model.js');
const router = express.Router();

// JWT Secret (en producción debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secret_key_aqui';

// Middleware para verificar token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido' });
  }
};

// Función para crear el hash personalizado (manteniendo tu lógica actual)
const createCustomHash = (password) => {
  return password.split("").reverse().join("") + "simpleHash";
};

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, birthDate, password, photo, accountType } = req.body;

    // Validar datos requeridos
    if (!name || !email || !phone || !birthDate || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    console.log('Creating new user for email:', email);

    // NO hashear aquí porque el middleware pre("save") lo hará automáticamente
    const newUser = new User({
      name,
      email,
      phone,
      birthDate,
      password, // La contraseña sin hashear, el middleware se encarga
      photo: photo || '',
      accountType: accountType || 'user'
    });

    await newUser.save(); // Aquí se ejecuta el middleware pre("save")
    console.log('User created successfully');

    // Generar token
    const token = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remover password de la respuesta
    const userResponse = { ...newUser.toObject() };
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que email y password estén presentes
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    console.log('Login attempt for email:', email);

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    console.log('User found, comparing passwords');

    // Verificar contraseña usando tu lógica personalizada
    const hashedInputPassword = createCustomHash(password);
    const isValidPassword = hashedInputPassword === user.password;
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      console.log('Expected hash:', user.password);
      console.log('Received hash:', hashedInputPassword);
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    console.log('Password valid, generating token');

    // Generar token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remover password de la respuesta
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    console.log('Login successful for user:', email);

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Validar token
router.get('/validate', authenticateToken, async (req, res) => {
  try {
    // Remover password de la respuesta
    const userResponse = { ...req.user.toObject() };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Token válido',
      user: userResponse
    });
  } catch (error) {
    console.error('Error al validar token:', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar token'
    });
  }
});

// Obtener perfil del usuario
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userResponse = { ...req.user.toObject() };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil'
    });
  }
});

// Actualizar perfil del usuario
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, birthDate, photo } = req.body;
    
    // Validar que al menos un campo esté presente
    if (!name && !phone && !birthDate && !photo) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (birthDate) updateData.birthDate = birthDate;
    if (photo) updateData.photo = photo;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const userResponse = { ...updatedUser.toObject() };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: userResponse
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil'
    });
  }
});

// Ruta para cambiar contraseña
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    // Verificar contraseña actual
    const currentHashedPassword = createCustomHash(currentPassword);
    if (currentHashedPassword !== req.user.password) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar con nueva contraseña (el middleware pre("save") la hasheará)
    req.user.password = newPassword;
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña'
    });
  }
});

// Ruta para logout (opcional, principalmente para logs)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    console.log('User logged out:', req.user.email);
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error en logout'
    });
  }
});

module.exports = router;