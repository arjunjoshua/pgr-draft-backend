const express = require('express');
const trainerRoutes = require('./routes/trainerRoutes');

const app = express();

app.use(express.json());
app.use('/trainers', trainerRoutes);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
