require('dotenv').config();
const { connect } = require('../config/rabbitmq');
const { init } = require('../config/db');

const QUEUE = process.env.QUEUE_NAME || 'notifications';

async function start() {
  await init(process.env.POSTGRES_URL);
  const conn = await connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(QUEUE, { durable: true });
  ch.prefetch(1);
  console.log('Email worker waiting for messages');

  ch.consume(QUEUE, async msg => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      if (payload.channel !== 'email') {
        ch.nack(msg, false, true); // requeue for other workers
        return;
      }
      console.log('[email] delivering to', payload.recipient);
      // Simulate send
      await new Promise(r => setTimeout(r, 500));
      ch.ack(msg);
    } catch (err) {
      console.error('Email worker error', err);
      ch.nack(msg, false, false);
    }
  });
}

start().catch(err => { console.error(err); process.exit(1); });
