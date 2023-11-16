const { Trainer, Team, Lobby, Match } = require('../../database/models');
const  connectDB  = require('../../database/db');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
    //manually set headers for CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if(req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    await connectDB();
    const trainer1ID = mongoose.Types.ObjectId(req.query.trainer1ID);
    const trainer2ID = mongoose.Types.ObjectId(req.query.trainer2ID);
    const lobbyID = mongoose.Types.ObjectId(req.query.lobbyID);

    const match = await Match.findOne({
        $or: [
            { trainer1: trainer1ID, trainer2: trainer2ID, lobby: lobbyID},
            { trainer1: trainer2ID, trainer2: trainer1ID, lobby: lobbyID}
        ]
    })
    if(!match) {
        return res.status(400).json({message: 'Match not found'});
    }
    return res.status(200).json({match});
}