const {connectDB} = require('../database/db');
const { Trainer, Lobby, Team } = require('../database/models');


module.exports = async (req, res) => {
const { name, team, lobby } = req.body;
await connectDB();

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
};