const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token

  if (!token) {
    return res.status(403).json({ message: 'No token provided, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user data to req
    next(); // Proceed to the next middleware or route
  } catch (err) {
    res.status(403).json({ message: 'Invalid token, access denied' });
  }
};

module.exports = authMiddleware;
