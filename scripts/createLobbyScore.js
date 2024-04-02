const { Trainer, Lobby, LobbyScore } = require('../database/models');
const mongoose = require('mongoose');

async function populateTrainerScore() {
    await mongoose.connect(`mongodb+srv://pgrv23:NianticSux12@cluster0.s4iajwl.mongodb.net/pvp-draft-v23?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

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
    mongoose.disconnect();
}

populateTrainerScore();
