const { Trainer, Lobby, LobbyScore } = require('../database/models');
const mongoose = require('mongoose');

const connection_url = "mongodb+srv://pvp_v26:NianticSux12@cluster0.s4iajwl.mongodb.net/pvp-draft-v26?retryWrites=true&w=majority"

async function populateTrainerScore(url = connection_url) {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

    const lobbies = await Lobby.find();

    for (let lobby of lobbies) {
        const trainers = await Trainer.find({ lobbies: lobby._id });
        for(let trainer of trainers) {
            const lobby_data = {
                lobby: lobby._id,
                trainer: trainer._id,
                matchesPlayed: 0,
                matchesWon: 0,
                matchesLost: 0,
                matchesTied: 0,
                points: 0,
            };
            await LobbyScore.create(lobby_data);
        }
    }
    console.log("New trainer scores have been created.");
    await mongoose.disconnect();
}

populateTrainerScore()
    .then(() => console.log("Script completed successfully."));

module.exports = populateTrainerScore;
