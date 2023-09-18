const { Match } = require('../database/models.js');
const connectDB = require('../database/db.js');

module.exports = async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
     
    if (req.method === 'OPTIONS') {
        // Handle the preflight request. Respond successfully:
        res.status(200).end();
        return;
    }
    
    const { trainer1ID, trainer2ID, winner, winnerName } = req.body;
    await connectDB();

    const match = await Match.findOne({ trainer1: trainer1ID, trainer2: trainer2ID });
    if (!match) {
        console.log("Match not found");
        return res.status(400).json({ message: 'Match not found' });
    }

    if(!match.winnerName) {
        match.winnerName = winnerName;
    }
    match.winner = winner;
    await match.save();
    return res.status(200).json({ message: 'Match result recorded' });
};

