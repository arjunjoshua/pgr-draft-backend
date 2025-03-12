const mongoose = require('mongoose');
require('dotenv').config();

const pvp_draft_version = 27;

const connection_url = (version = pvp_draft_version) => {
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;

  return `mongodb+srv://${username}:${password}@cluster0.s4iajwl.mongodb.net/pvp-draft-v${version}?retryWrites=true&w=majority`
}

const connectDB = async (version = pvp_draft_version) => {
  if (mongoose.connections[0].readyState) return; // Use existing database connection if it exists
  // Connect to your MongoDB database
  await mongoose.connect(connection_url(version), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = { connectDB, connection_url };
