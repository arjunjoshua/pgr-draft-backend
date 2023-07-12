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

const Trainer = mongoose.model('Trainer', TrainerSchema);
const Lobby = mongoose.model('Lobby', LobbySchema);
const Team = mongoose.model('Team', TeamSchema);

module.exports = { Trainer, Lobby, Team };
