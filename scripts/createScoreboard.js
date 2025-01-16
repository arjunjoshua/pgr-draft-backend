const { Trainer, Lobby, Match } = require('../database/models');
const mongoose = require('mongoose');
//require('dotenv').config();

async function populateMatches() {
    // const username = process.env.DB_USERNAME;
    // const password = process.env.DB_PASSWORD;

    //this was a temp user on the DB. Will require a new user if the script has to be run again (likely next season)
    await mongoose.connect(`mongodb+srv://pvp_v26:NianticSux12@cluster0.s4iajwl.mongodb.net/pvp-draft-v25?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    const lobbies = await Lobby.find();

    for (let lobby of lobbies) {
        const trainers = await Trainer.find({ lobbies: lobby._id });

        for (let i=0; i < trainers.length; i++) {
            for (let j=i+1; j < trainers.length; j++) {
                const match_data = {
                    lobby: lobby._id,
                    trainer1: trainers[i]._id,
                    trainer2: trainers[j]._id,
                    winner: null,
                    winnerName: null,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    isReported: false
                };
                await Match.create(match_data);
            }
        }
    }

    console.log("All matchups have been created.");
    Mongoose.disconnect();
}

populateMatches();
