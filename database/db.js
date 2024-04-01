const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; // Use existing database connection if it exists
  // Load your environment variables
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;

  // Connect to your MongoDB database
  await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.s4iajwl.mongodb.net/pvp-draft-v23?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
