const {connectDB} = require('../database/db');
const { Trainer, Lobby, Team } = require('../database/models');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

module.exports = async (req, res) => {
    // get version from the request
    const version = req.query.version;
    if (!version || isNaN(Number(version))) {
        return res.status(400).send({ error: 'Version not specified' });
    }
    await connectDB(version);

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: 'Error uploading file.' });
        }

        const results = [];
        const bufferStream = new require('stream').PassThrough();
        bufferStream.end(req.file.buffer);

        bufferStream
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

                    const pokemonsArray = pokemons ? pokemons.split(',') : [];
                    const newTeam = new Team({ pokemons: pokemonsArray, lobby: existingLobby._id });
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
})
};