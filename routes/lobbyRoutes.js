const express = require('express');
const Lobby = require('../models/Lobby');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lobbies = await Lobby.find().populate('trainers');
    res.json(lobbies);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
