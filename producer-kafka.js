const Kafka = require('node-rdkafka');
const config = require('./config');

const ERR_TOPIC_ALREADY_EXISTS = 36;

function ensureTopicExists(config) { // Disable in a production environment as something else should handle topic outputs.
  if (config.env === 'development') {

  } else { }
}