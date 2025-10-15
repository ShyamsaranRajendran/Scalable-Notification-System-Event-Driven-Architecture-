const { connect } = require('../config/rabbitmq');

const QUEUE = process.env.QUEUE_NAME || 'notifications';

async function publish(message) {
  const conn = await connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(QUEUE, { durable: true });
  ch.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), { persistent: true });
  await ch.close();
}

module.exports = { publish };
