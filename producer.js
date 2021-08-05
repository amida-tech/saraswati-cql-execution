const Kafka = require('node-rdkafka');
const config = require('./config');

const ERR_TOPIC_ALREADY_EXISTS = 36;

function ensureTopicExists() {
  const adminClient = Kafka.AdminClient.create({
    'bootstrap.servers': config.kafkaServers,
    'sasl.username': config.kafkaUsername,
    'sasl.password': config.kafkaPassword,
    // 'security.protocol': config.kafkaProtocol, // Disabled for now.
    'sasl.mechanisms': config.kafkaMechanisms,
  });

  return new Promise((resolve, reject) => {
    adminClient.createTopic({
      topic: config.topic,
      num_partitions: 1,
      replication_factor: 3
    }, (err) => {
      if (!err) { 
        console.log(`Created topic ${config.topic}`);
        return resolve();
      }

      if (err.code === ERR_TOPIC_ALREADY_EXISTS) {
        return resolve();
      }

      return reject(err);
    });
  });
}