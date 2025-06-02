const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        accountType: user.accountType
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  };
  
  const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  };
  
  module.exports = { generateToken, verifyToken };
  