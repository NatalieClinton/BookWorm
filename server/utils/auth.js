const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'verydiscreet';
const expiration = '2h';

// Middleware to authenticate requests
const authMiddleware = ({ req }) => {
  // Get token from request headers
  const token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    try {
      // Remove 'Bearer ' from the token
      const tokenValue = token.slice(7, token.length).trim();
      const { data } = jwt.verify(tokenValue, secret, { maxAge: expiration });

      // Return user data to be used in GraphQL context
      return { user: data };
    } catch (err) {
      console.error('Invalid token', err);
      return { user: null };
    }
  }

  // If there's no token or it's not valid, return null user
  return { user: null };
};

// Function to sign a token
const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = {
  authMiddleware,
  signToken,
};
