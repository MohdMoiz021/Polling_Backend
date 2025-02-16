const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  votes: { type: [Number], required: true },
  voters: [{
    type: String, 
    required: true,
  }],
  responses: [
    {
      userId: { type: String, required: true }, 
      selectedOptionIndex: { type: Number, required: true }, 
    },
  ],
});

module.exports = mongoose.model('Poll', pollSchema);
