const {connectDB} = require('../database/db');
const { Trainer, Lobby, Team } = require('../database/models');

module.exports = async (req, res) => {
    const db = connectDB();

    // Manually set headers for CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    // get the first lobby from the Lobbies collection
    const lobby = await db.collection('Lobbies').findOne();

    if (!lobby)
        return res.status(404).send({ error: 'No lobbies found in the database' });

    try {
        const lobbyId = lobby._id;

        // Get lobby data
        const lobby = await Lobby.findById(lobbyId);

        // Find the teams that are associated with the given lobby.
        const teams = await Team.find({ lobby: lobbyId });

        // Extract the team ids into an array.
        const teamIds = teams.map(team => team._id);

        // Then, find the trainers that are associated with those teams.
        const trainers = await Trainer.find({ 'teams': { $in: teamIds }}).populate('teams');

        res.status(200).json({ lobby, trainers });
    } catch (err) {
        res.status(500).json({ message: err });
    }
}