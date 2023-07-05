const express = require('express');
const router = express.Router();
const { Trainer, Lobby, Team } = require('../database/db');  

router.post('/', async (req, res) => {
  const { name, team, lobby } = req.body;  // assuming that 'team' and 'lobby' fields are in the request body

  // Create a new Lobby
  const newLobby = new Lobby(lobby);
  try {
    await newLobby.save();
  } catch (error) {
    res.status(400).send(error);
    return;
  }

  // Create a new Team
  const newTeam = new Team(team);
  try {
    await newTeam.save();
  } catch (error) {
    res.status(400).send(error);
    return;
  }

  // Create a new Trainer with references to the Lobby and Team
  const newTrainer = new Trainer({ name, teams: [newTeam._id], lobbies: [newLobby._id] });
  try {
    await newTrainer.save();
    res.status(201).send(newTrainer);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
