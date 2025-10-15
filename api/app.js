require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { init } = require('./config/db');
const { connect } = require('./config/rabbitmq');

const notifyRoute = require('./routes/notify');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use('/notify', notifyRoute);

app.listen(PORT, async () => {
  console.log(`Notification API listening on port ${PORT}`);
  try {
    await init(process.env.POSTGRES_URL);
    await connect(process.env.RABBITMQ_URL);
    console.log('Connected to DB and RabbitMQ');
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
});
