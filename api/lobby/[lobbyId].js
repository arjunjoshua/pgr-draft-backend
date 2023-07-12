const { Trainer, Lobby, Team } = require('../../database/models');
const connectDB = require('../../database/db');

module.exports = async (req, res) => {
    await connectDB();
    
    try {
        const lobbyId = req.query.lobbyId;

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
};