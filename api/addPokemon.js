const connectDB = require('../database/db');
const { Team } = require('../database/models');

module.exports = async (req, res) => {
    //  // Manually set headers for CORS
    //  res.setHeader('Access-Control-Allow-Origin', '*');
    //  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    //  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // if (req.method === 'OPTIONS') {
    //     // Handle the preflight request. Respond successfully:
    //     res.status(200).end();
    //     return;
    // }   
    
    const { trainerID, lobbyID, pokemonName} = req.body;
    const db = await connectDB();

    const team = await Team.findOne({ trainer: trainerID, lobby: lobbyID });
    // if (team.pokemons.length >= 6) {
    //     return res.status(400).json({ message: 'Team is full' });
    // }
    team.pokemons.push(pokemonName);
    await team.save();
    return res.status(200).json({ message: 'Pokemon added to team' });
};