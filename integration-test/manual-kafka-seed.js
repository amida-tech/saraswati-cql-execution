const { Kafka } = require('kafkajs');
const kafkaLogger = require('../src/kafka-winston-config');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');
const testJson = require('../data/patients/drre/drre-patient.json');

describe('Setups Kafka for Manual Test', () => {
  const testGroup = uuidv4(); // You want these to be different each time so tests don't collide.
  const kafka = new Kafka({
    clientId: testGroup,
    brokers:  config.kafkaBrokers,
    logLevel: config.logLevel,
    logCreator: kafkaLogger
  });

  const producer = kafka.producer();

  describe('Manual Test for Kafka', async () => {
    await producer.connect();
    await producer.send({
      topic: config.kafkaConsumedTopic,
      groupId: 'hedis-measures',
      messages: [
        { value: JSON.stringify(testJson) }
      ],
    });
  
    await producer.disconnect();
  });

  describe('Test Deck for AAB', async () => {
    await producer.connect();
    var files = fs.readdirSync('../private/2022/test-deck-json/aab');
    files.forEach((fileJson) => {
      await producer.send({
        topic: config.kafkaConsumedTopic,
        groupId: 'hedis-measures',
        messages: [
          { value: JSON.stringify(fileJson) }
        ],
      });
    });
  
    await producer.disconnect();
  })
});