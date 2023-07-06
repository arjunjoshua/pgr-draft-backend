const express = require('express');
const trainerRoutes = require('./routes/trainerRoutes');
const lobbyRoutes = require('./routes/lobbyRoutes');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/trainers', trainerRoutes);
app.use('/lobbies', lobbyRoutes);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
