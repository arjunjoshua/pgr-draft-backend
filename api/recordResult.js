const { Match } = require('../database/models.js');
const connectDB = require('../database/db.js');

module.exports = async (req, res) => {
    const { trainer1ID, trainer2ID, winner, winnerName } = req.body;
    await connectDB();

    const match = await Match.findOne({ trainer1: trainer1ID, trainer2: trainer2ID });
    if (!match) {
        return res.status(400).json({ message: 'Match not found' });
        console.log("Match not found");
    }

    if(!match.winnerName) {
        match.winnerName = winnerName;
    }
    match.winner = winner;
    await match.save();
    return res.status(200).json({ message: 'Match result recorded' });
};

