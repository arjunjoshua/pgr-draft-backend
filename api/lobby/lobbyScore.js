const { Trainer, LobbyScore } = require('../../database/models');
const connectDB  = require('../../database/db');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
    // Manually set headers for CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if(req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    await connectDB();
    const mLobbyID = new mongoose.Types.ObjectId(req.query.lobbyID);
    const lobbyScores = await LobbyScore.find({lobby: mLobbyID}).populate('trainer', 'name');

    if(!lobbyScores) {
        return res.status(400).json({message: 'Lobby not found'});
    }
    
    res.status(200).json({lobbyScores});
};

