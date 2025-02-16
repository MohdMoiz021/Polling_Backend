const express = require('express');
const Poll = require('../models/Poll');
const router = express.Router();


router.post('/poll', async (req, res) => {
  const { question, options } = req.body;
  try {
    const poll = new Poll({
      question,
      options,
      votes: Array(options.length).fill(0), 
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Error creating poll', error: err });
  }
});


router.get('/polls', async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching polls', error: err });
  }
});


router.post('/poll/:id/vote', async (req, res) => {
  const pollId = req.params.id;
  const { optionIndex } = req.body;

  try {
    const poll = await Poll.findById(pollId);

    if (poll) {
      poll.votes[optionIndex] += 1;
      await poll.save();
      res.status(200).json(poll);
    } else {
      res.status(404).json({ message: 'Poll not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error voting on poll', error: err });
  }
});


router.post('/poll/:id/vote', async (req, res) => {
    const pollId = req.params.id;
    const { optionIndex, userId } = req.body; 
  
    try {
      const poll = await Poll.findById(pollId);
  
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
  
  
      if (poll.voters.includes(userId)) {
        return res.status(400).json({ message: 'You have already voted on this poll.' });
      }
  
   
      poll.votes[optionIndex] += 1;
      poll.voters.push(userId); 
      await poll.save();
      res.status(200).json(poll);
    } catch (err) {
      res.status(500).json({ message: 'Error voting on poll', error: err });
    }
  });
  
  

module.exports = router;
