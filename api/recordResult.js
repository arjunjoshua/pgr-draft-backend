const { Match, LobbyScore } = require('../database/models.js');
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
    
    const { trainer1ID, trainer2ID, winner, winnerName, lobbyID } = req.body;
    await connectDB();

    // Update match
    const match = await Match.findOne({ trainer1: trainer1ID, trainer2: trainer2ID });
    if (!match) {
        console.log("Match not found");
        return res.status(400).json({ message: 'Match not found' });
    }
    else if(match.winnerName) {
        console.log("Match result has already been recorded");
        return res.status(200).json({ message: 'Match result has already been recorded' });
    }

    match.winnerName = winnerName;
    
    if(winner == 0) {
        match.winner = null;
    }
    else{
    match.winner = winner;
    }
    await match.save();

    // Update trainer 1 score
    const lobbyScore1 = await LobbyScore.findOne({ lobby: lobbyID, trainer: trainer1ID });
    if (!lobbyScore1) {
        console.log("Lobby score 1 not found");
        return res.status(400).json({ message: 'Lobby score not found' });
    }

    lobbyScore1.matchesPlayed += 1;
    if (winner === trainer1ID) {
        lobbyScore1.matchesWon += 1;
        lobbyScore1.points += 2;
    } else if (winner === trainer2ID) {
        lobbyScore1.matchesLost += 1;
    } else {
        lobbyScore1.matchesTied += 1;
        lobbyScore1.points += 1;
    }
    await lobbyScore1.save();


    // Update trainer 2 score
    const lobbyScore2 = await LobbyScore.findOne({ lobby: lobbyID, trainer: trainer2ID });
    if (!lobbyScore2) {
        console.log("Lobby score 2 not found");
        return res.status(400).json({ message: 'Lobby score not found' });
    }

    lobbyScore2.matchesPlayed += 1;
    if (winner === trainer2ID) {
        lobbyScore2.matchesWon += 1;
        lobbyScore2.points += 2;
    } else if (winner === trainer1ID) {
        lobbyScore2.matchesLost += 1;
    } else {
        lobbyScore2.matchesTied += 1;
        lobbyScore2.points += 1;
    }
    await lobbyScore2.save();

    return res.status(200).json({ message: 'Match result recorded' });
};
