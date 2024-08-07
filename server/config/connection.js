const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://natalieclinton:BookWorm@bookworm.bet8i.mongodb.net/?retryWrites=true&w=majority&appName=BookWorm');

module.exports = mongoose.connection;
