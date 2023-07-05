const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pgr-draftleader:NianticSux12@cluster0.s4iajwl.mongodb.net/pgr-draft?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const TrainerSchema = new Schema({
  name: String,
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  lobbies: [{ type: Schema.Types.ObjectId, ref: 'Lobby' }],
});

const LobbySchema = new Schema({
    name: String,
    trainers: [{ type: Schema.Types.ObjectId, ref: 'Trainer' }],  // Will add trainer later
  });
  
  const TeamSchema = new Schema({
    pokemons: [String],
    trainer: { type: Schema.Types.ObjectId, ref: 'Trainer' },  // Will add trainer later
    lobby: { type: Schema.Types.ObjectId, ref: 'Lobby' },  // Will add lobby later
  });
  

const Trainer = mongoose.model('Trainer', TrainerSchema);
const Lobby = mongoose.model('Lobby', LobbySchema);
const Team = mongoose.model('Team', TeamSchema);

module.exports = { Trainer, Lobby, Team };
