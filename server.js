const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const pollRoutes = require('./routes/poll.Routes');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

app.use('/api', pollRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


const io = socketIo(server);


io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('vote', (pollId) => {
    Poll.findById(pollId, (err, poll) => {
      if (poll) {
        io.emit('pollUpdated', poll);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
