const express = require('express');
const router = express.Router();
const publisher = require('../queue/publisher');
const { init } = require('../config/db');

// POST /notify
// Body: { recipient, channel, subject?, body }
router.post('/', async (req, res) => {
  const { recipient, channel, subject, body } = req.body;
  if (!recipient || !channel || !body) {
    return res.status(400).json({ error: 'recipient, channel and body are required' });
  }

  try {
    const message = { recipient, channel, subject: subject || null, body };
    await publisher.publish(message);
    return res.status(202).json({ status: 'queued' });
  } catch (err) {
    console.error('Failed to publish', err);
    return res.status(500).json({ error: 'failed to queue notification' });
  }
});

module.exports = router;
