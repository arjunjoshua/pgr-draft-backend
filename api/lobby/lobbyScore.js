const { Trainer, LobbyScore } = require('../../database/models');
const { connectDB } = require('../../database/db');

module.exports = async (req, res) => {
    // Manually set headers for CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    await connectDB();
    const {lobbyID} = req.body;
    const lobbyScores = await LobbyScore.find({lobby: lobbyID}).populate('trainer', 'name');

    if(!lobbyScores) {
        return res.status(400).json({message: 'Lobby not found'});
    }

    res.status(200).json({lobbyScores});
};

