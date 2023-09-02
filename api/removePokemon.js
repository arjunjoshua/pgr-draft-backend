const { Mongoose } = require('mongoose');
const connectDB = require('../database/db');
const { Team } = require('../database/models');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { teamID, pokemonName } = req.body;
    await connectDB();

    const team = Team.findById(teamID);
    if (!team) {
        return res.status(400).json({ message: 'Team not found' });
    }
    const index = team.pokemons.indexOf(pokemonName);
    if (index > -1) {
        team.pokemons.splice(index, 1);
    }
    await team.save();
    return res.status(200).json({ message: 'Pokemon removed from team' });
};

