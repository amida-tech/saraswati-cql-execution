const { Kafka } = require('kafkajs');
const kafkaLogger = require('../../src/kafka-winston-config');
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');
const testJson = require('../../data/patients/drre/drre-patient.json');

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
      topic: 'fhir-logged',
      groupId: 'hedis-measures',
      messages: [
        { value: JSON.stringify(testJson) }
      ],
    });
  
    await producer.disconnect();
  });
});