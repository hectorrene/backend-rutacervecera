const { verifyToken } = require('../utils/jwt');
const User = require('../models/Users.model');

// Middleware para verificar que el usuario está autenticado
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    // Buscar el usuario
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no válido' });
    }

    // Agregar info del usuario al request
    req.user = {
      id: user._id.toString(), // Para que funcione con tu endpoint /api/users/me
      userId: user._id.toString(),
      email: user.email,
      accountType: user.accountType,
      name: user.name
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar que es cuenta business
const requireBusiness = (req, res, next) => {
  if (req.user.accountType !== 'business') {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requiere cuenta business.' 
    });
  }
  next();
};

// Middleware para verificar que el usuario es el owner
const requireOwner = (req, res, next) => {
  const ownerId = req.params.ownerId;
  
  if (req.user.userId !== ownerId) {
    return res.status(403).json({ 
      message: 'Acceso denegado. Solo puedes acceder a tus propios recursos.' 
    });
  }
  next();
};

// Middleware combinado
const requireBusinessOwner = [authenticate, requireBusiness, requireOwner];

module.exports = {
  authenticate,
  requireBusiness,
  requireOwner,
  requireBusinessOwner
};