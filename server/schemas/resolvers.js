const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    // Fetch the currently logged-in user
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findById(context.user._id).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    // Login a user and return a token
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      
      const correctPw = await user.isCorrectPassword(password);
      
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      
      const token = signToken(user);
      return { token, user };
    },

    // Register a new user and return a token
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    // Save a book to the user's saved books
    saveBook: async (parent, { bookId, authors, description, title, image, link }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          {
            $addToSet: { savedBooks: { bookId, authors, description, title, image, link } },
          },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    // Remove a book from the user's saved books
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          {
            $pull: { savedBooks: { bookId } },
          },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
