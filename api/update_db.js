const { Mongoose } = require('mongoose');
const {connection_url} = require('../database/db');
const {Team, Lobby, LobbyScore, Trainer, Match} = require('../database/models');
const populateTrainerScore = require('../scripts/createLobbyScore')
const populateMatches = require('../scripts/createScoreboard')


module.exports = async (req, res) => {
    // get parameter version from the request
    const { version } = req.query;

    if (!version) {
        return res.status(400).send({ error: 'Version not specified' });
    }

    // run the create lobby score and create scoreboards functions

    await populateTrainerScore();
    await populateMatches();

    // return a success message
    return res.send({ message: 'Database updated successfully' });
}