const { signToken, authMiddleware } = require('./server/auth');
const jwt = require('jsonwebtoken');

// Create a sample payload
const sampleUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  _id: '1234567890abcdef'
};

// Generate a token
const token = signToken(sampleUser);
console.log('Generated Token:', token);

// Simulate a request with the token
const req = {
  headers: {
    authorization: `Bearer ${token}`
  }
};

// Use authMiddleware to validate the token
const { user } = authMiddleware({ req });
console.log('Decoded User:', user);
