const { Kafka } = require('kafkajs');
const logger = require('./src/winston');
const config = require('./config');

const kafka = new Kafka({
  clientId: 'cql-execution',
  brokers: config.kafkaBrokers
});

const consumer = kafka.consumer({ groupId: config.kafkaGroupId });
const { evalData } = require('./exec-files/exec-config');
const producer = kafka.producer();

async function runner() {
  await consumer.connect();
  await producer.connect();

  let consumedTopic = config.kafkaConsumedTopic;
  let producedTopic = config.kafkaProducedTopic;
  await consumer.subscribe({ topic: consumedTopic, fromBeginning: false });
    
  // Runs each time a message is received.
  await consumer.run({
    eachMessage: async ({ message }) => {
      logger.info(`Received Kafka message for group: ${config.kafkaGroupId}.`);
      const fhirJson = message.value.toString();
      const data = evalData(JSON.parse(fhirJson));
      if (data !== undefined) {
        var dataString = JSON.stringify(data);
        producer.send(
          {
            topic: producedTopic,
            messages: [
              {value: dataString},
            ],
          }
        );
        logger.info(`Sent Kafka message to topic: ${producedTopic}.`);
      } else {
        logger.info('No message sent.');
      }
    },
  });
}

runner();
