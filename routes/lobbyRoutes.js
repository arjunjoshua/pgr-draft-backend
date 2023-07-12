const express = require('express');
const { Lobby } = require('../database/db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lobbies = await Lobby.find().populate('trainers');
    if (!lobbies) {
      return res.status(404).json({ message: "No lobbies found" });
    }
    res.json(lobbies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
