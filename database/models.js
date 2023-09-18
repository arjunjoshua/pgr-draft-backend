const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrainerSchema = new Schema({
  name: String,
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  lobbies: [{ type: Schema.Types.ObjectId, ref: 'Lobby' }],
});

const LobbySchema = new Schema({
  name: String,
  trainers: [{ type: Schema.Types.ObjectId, ref: 'Trainer' }],
});

const TeamSchema = new Schema({
  pokemons: [String],
  trainer: { type: Schema.Types.ObjectId, ref: 'Trainer' },
  lobby: { type: Schema.Types.ObjectId, ref: 'Lobby' },
});

const MatchSchema = new Schema({
  lobby: { type: Schema.Types.ObjectId, ref: 'Lobby' },
  trainer1: { type: Schema.Types.ObjectId, ref: 'Trainer' },
  trainer2: { type: Schema.Types.ObjectId, ref: 'Trainer' },
  winner: { type: Schema.Types.ObjectId, ref: 'Trainer' },
  winnerName: String,
});

const Trainer = mongoose.model('Trainer', TrainerSchema);
const Lobby = mongoose.model('Lobby', LobbySchema);
const Team = mongoose.model('Team', TeamSchema);
const Match = mongoose.model('Match', MatchSchema);

module.exports = { Trainer, Lobby, Team, Match };
