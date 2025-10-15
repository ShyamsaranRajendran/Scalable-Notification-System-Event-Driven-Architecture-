const amqplib = require('amqplib');

let connection = null;

async function connect(url) {
  if (connection) return connection;
  connection = await amqplib.connect(url);
  connection.on('error', err => console.error('RabbitMQ connection error', err));
  connection.on('close', () => {
    console.warn('RabbitMQ connection closed');
    connection = null;
  });
  return connection;
}

module.exports = { connect };
