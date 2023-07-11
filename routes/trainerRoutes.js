const express = require('express');
const router = express.Router();
const { Trainer, Lobby, Team } = require('../database/db');

router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find().populate({
      path: 'teams',
      populate: {
        path: 'pokemons',
      },
    });
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/lobby/:lobbyId', async (req, res) => {
  try {
    const lobbyId = req.params.lobbyId;

    //Get lobby data
    const lobby = await Lobby.findById(lobbyId);

    //Find the teams that are associated with the given lobby.
    const teams = await Team.find({ lobby: req.params.lobbyId });

    // Extract the team ids into an array.
    const teamIds = teams.map(team => team._id);

    // Then, find the trainers that are associated with those teams.
    const trainers = await Trainer.find({ 'teams': { $in: teamIds }}).populate('teams');
    
    res.json({ lobby, trainers });
  } catch (err) {
    res.json({ message: err });
  }
});


router.post('/', async (req, res) => {
  const { name, team, lobby } = req.body;

  // Search for the existing Trainer
  let existingTrainer = await Trainer.findOne({ name });

  // Search for the existing Lobby
  let existingLobby = await Lobby.findOne({ name: lobby.name });

  if (!existingLobby) {
    // Create a new Lobby
    existingLobby = new Lobby({ name: lobby.name });
    try {
      await existingLobby.save();
    } catch (error) {
      res.status(400).send(error);
      return;
    }
  }

  // Create a new Team
  const newTeam = new Team({ pokemons: team.pokemons, lobby: existingLobby._id });
  try {
    await newTeam.save();
  } catch (error) {
    res.status(400).send(error);
    return;
  }

  if (!existingTrainer) {
    // Create a new Trainer with references to the Lobby and Team
    existingTrainer = new Trainer({ name, teams: [newTeam._id], lobbies: [existingLobby._id] });
  } else {
    // Update the existing Trainer with new Team and Lobby
    existingTrainer.teams.push(newTeam._id);
    existingTrainer.lobbies.push(existingLobby._id);
  }

  try {
    await existingTrainer.save();

    // Update the new Team with the Trainer's ID
    newTeam.trainer = existingTrainer._id;
    await newTeam.save();

    // Update the Lobby with the Trainer's ID
    existingLobby.trainers.push(existingTrainer._id);
    await existingLobby.save();

    res.status(201).send(existingTrainer);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
