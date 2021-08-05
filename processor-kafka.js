const Kafka = require('node-rdkafka');
const config = require('./config');

function createConsumer(onData) {
  const consumer = new Kafka.KafkaConsumer({
    'bootstrap.servers': config.kafkaServers,
    'sasl.username': config.kafkaUsername,
    'sasl.password': config.kafkaPassword,
    // 'security.protocol': config.kafkaProtocol, // Disabled for now.
    'sasl.mechanisms': config.kafkaMechanisms,
    'group.id': config.kafkaGroupId,
  }, {
    'auto.offset.reset': 'earliest'
  });

  return new Promise((resolve, reject) => {
    consumer
      .on('ready', () => resolve(consumer))
      .on('data', onData);

    consumer.connect();
  });
}

async function runConsumer() {
  console.log(`Consuming records from topic: ${config.kafkaTopic}.`);
  
  let seen = 0;

  const consumer = await createConsumer(({key, value, partition, offset}) => {
    // Processing from processor.js goes here.
    console.log(`Consumed record with key ${key} and value ${value} of partition ${partition} @ offset ${offset}. Updated total count to ${++seen}.`);
  });

  consumer.subscribe([config.topic]);
  consumer.consume();

  process.on('SIGINT', () => {
    console.log('\nDisconnecting consumer...');
    consumer.disconnect();
  });
}

runConsumer()
  .catch((err) => {
    console.error(`Something went wrong: ${err}`);
    process.exit(1);
  });
