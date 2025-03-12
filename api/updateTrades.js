const {connectDB} = require('../database/db');
const { Trainer, Lobby, Team } = require('../database/models');
const csv = require('csv-parser');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

module.exports = async (req, res) => {
    try {
        await connectDB();

        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).send({ error: 'Error uploading file: ' + err.message });
            }

            // Check if the file is received and exists
            if (!req.file || !req.file.buffer) {
                return res.status(400).send({ error: 'File is undefined or buffer is not available.' });
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
                        let returnMessage = '';
                        for (const row of results) {
                            const { trainer, lobby, pokemons } = row;
                            let existingTrainer = await Trainer.findOne({ name: trainer });
                            if (!existingTrainer) {
                                returnMessage += `, ${trainer} not found. `;
                                continue;
                            }
                            let existingLobby = await Lobby.findOne({ name: lobby });
                            if (!existingLobby) {
                                returnMessage += `, ${lobby} not found. `;
                                continue;
                            }
                            let existingTeam = await Team.findOne({ lobby: existingLobby._id, trainer: existingTrainer._id });
                            if (!existingTeam) {
                                returnMessage += `, ${existingTrainer.name} in ${existingLobby.name} not found. `;
                                continue;
                            }
                            const pokemonsArray = pokemons ? pokemons.split(',') : [];
                            console.log (pokemonsArray);
                            existingTeam.pokemons = pokemonsArray;
                            await existingTeam.save();
                        }
                        returnMessage += ', Except the above, all teams updated successfully.';
                        res.status(200).json({ message: returnMessage });
                    } catch (err) {
                        console.log(err);
                        res.status(500).send({ error: 'Error processing CSV data' });
                    }
                });
        });
    } catch (dbConnectErr) {
        console.log(dbConnectErr);
        res.status(500).send({ error: 'Failed to connect to database' });
    }
};
