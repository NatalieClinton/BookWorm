const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // Fetch the currently logged-in user
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findById(context.user._id).populate('savedBooks');
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    // Login a user and return a token
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      
      if (!user) {
        throw AuthenticationError;
      }
      
      const correctPw = await user.isCorrectPassword(password);
      
      if (!correctPw) {
        throw AuthenticationError;
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
      throw AuthenticationError;
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
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
