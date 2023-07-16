const express = require('express');
const router = express.Router();
const { Trainer, Lobby, Team } = require('../database/db');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const csv = require('csv-parser');
const fs = require('fs');

router.post('/', upload.single('file'), async (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        for (const row of results) {
          const { trainer, lobby, pokemons } = row;
    
          let existingTrainer = await Trainer.findOne({ name: trainer });
  
          let existingLobby = await Lobby.findOne({ name: lobby });
  
          if (!existingLobby) {
            existingLobby = new Lobby({ name: lobby });
            try {
              await existingLobby.save();
            } catch (error) {
              return res.status(400).send(error);
            }
          }
  
          const pokemonsArray = pokemons.split(',');
          const newTeam = new Team({ pokemons: pokemonsArray, lobby: existingLobby._id });
          try {
            await newTeam.save();
          } catch (error) {
            return res.status(400).send(error);
          }
  
          if (!existingTrainer) {
            existingTrainer = new Trainer({ name: trainer, teams: [newTeam._id], lobbies: [existingLobby._id] });
          } else {
            existingTrainer.teams.push(newTeam._id);
            existingTrainer.lobbies.push(existingLobby._id);
          }
  
          try {
            await existingTrainer.save();
            newTeam.trainer = existingTrainer._id;
            await newTeam.save();
            existingLobby.trainers.push(existingTrainer._id);
            await existingLobby.save();
          } catch (error) {
            return res.status(400).send(error);
          }
        }
        res.status(200).json({ message: 'CSV file successfully processed' });
      });
  });
  

  module.exports = router;