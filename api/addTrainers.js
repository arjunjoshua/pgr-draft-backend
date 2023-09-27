const connectDB = require('../database/db');
const { Trainer, Lobby, Team } = require('../database/models');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
    await connectDB();

    const results = [];
    fs.createReadStream('../csvData/trainerData.csv')
        .pipe(csv())
        .on('data', (row) => {
            results.push(row);
        })
        .on('end', async () => {
            try {
                for (const row of results) {
                    const { trainer, lobby, pokemons } = row;

                    let existingTrainer = await Trainer.findOne({ name: trainer });
                    let existingLobby = await Lobby.findOne({ name: lobby });

                    if (!existingLobby) {
                        existingLobby = new Lobby({ name: lobby });
                        await existingLobby.save();
                    }

                    const newTeam = new Team({ pokemons: pokemons, lobby: existingLobby._id });
                    await newTeam.save();

                    if (!existingTrainer) {
                        existingTrainer = new Trainer({ name: trainer, teams: [newTeam._id], lobbies: [existingLobby._id] });
                    } else {
                        existingTrainer.teams.push(newTeam._id);
                        existingTrainer.lobbies.push(existingLobby._id);
                    }

                    await existingTrainer.save();
                    newTeam.trainer = existingTrainer._id;
                    await newTeam.save();
                    existingLobby.trainers.push(existingTrainer._id);
                    await existingLobby.save();
                }
            res.status(200).json({ message: 'Trainers added to database' });
        } catch (err) {
            console.log(err);
            res.status(400).send({ error: 'Error processing CSV data' });
        } finally {
            mongoose.connection.close();
        }
    });
};