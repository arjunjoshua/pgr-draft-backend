const { Lobby } = require('../database/models');
const connectDB = require('../database/db');

module.exports = async (req, res) => {
    await connectDB();
    
  try {
    const lobbies = await Lobby.find().populate('trainers');
    if (!lobbies) {
      return res.status(404).json({ message: "No lobbies found" });
    }
    res.status(200).json(lobbies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
