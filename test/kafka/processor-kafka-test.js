// const consumer = require('../processor-kafka');
const { Kafka } = require('kafkajs');
const logger = require('../../src/winston');
const kafkaLogger = require('../../src/kafka-winston-config');
const config = require('../../config');
const waitFor = require('kafkajs/src/utils/waitFor');
const { v4: uuidv4 } = require('uuid');
const should = require('should');
const inboundContractData = require('../../contract/examples/inbound.json');
const outboundContractData = require('../../contract/examples/inbound.json');
const { doesNotThrow } = require('should');

const inbound = inboundContractData[0].entry[0];

describe('It tests KafkaJS', () => {
  const testGroup = uuidv4(); // You want these to be different each time so tests don't collide.
  const testData = uuidv4();


  const kafka = new Kafka({
    clientId: testGroup,
    brokers:  config.kafkaBrokers,
    logLevel: config.logLevel,
    logCreator: kafkaLogger
  });

  const admin = kafka.admin();
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: testGroup });

  afterEach(async () => {
    logger.log('info', 'Testing complete, clearing topic queue.');
    await consumer.disconnect();
    await admin.connect();
    await admin.deleteTopics({
      topics: [testGroup, "jsonTest"],
      timeout: 10000
    });
    await admin.disconnect();
  });
  
  beforeEach(async () => {
    logger.log('info', 'Testing started, creating topic queue.');
  
    await producer.connect();
    await producer.send({
      topic: testGroup,
      messages: [
        { value: testData }
      ],
    });
    await producer.send({
      topic: "jsonTest",
      messages: [
        { value: JSON.stringify(inbound) }
      ],
    });
  
    await producer.disconnect();
  });
  
  describe('Tests Kafka', () => {
    it('Consumes a topic and produces a measurement', async () => {
      const consumedMessages = [];
      await consumer.connect();
      await consumer.subscribe({ topic: testGroup, fromBeginning: true });
      await consumer.run({
        eachMessage: async({ topic, partition, message }) => {
          consumedMessages.push({ topic, partition, message: message.value.toString()});
        }
      });
      await waitFor(() => consumedMessages.length === 1);

      should(consumedMessages[0].message).equal(testData);
    });
  });

  describe('Tests Kafka 2', () => {
    it('Consumes a topic and produces an outbound message', async () => {

      const outbound = outboundContractData
      const consumedMessages = [];
      await consumer.connect();
      console.log(outbound);
      console.log(">>>>>>>>>> 5");
      await consumer.subscribe({ topic: "jsonTest", fromBeginning: true });
      console.log(">>>>>>>>>> 6");
      await consumer.run({
        eachMessage: async({ topic, partition, message }) => {
          console.log(">>>>>>>>>> 7");
          if (topic === "jsonTest"){
            consumedMessages.push({ topic, partition, message: message.value.toString()});
          }
        }
      });
      console.log(">>>>>>>>>> 8");
      await waitFor(() => consumedMessages.length === 1);
        let data = []
        evalData(consumedMessages[0].message, data);
        console.log(data[0]);
      should(consumedMessages[0].message).equal(outbound.toString);
      await consumer.disconnect();
      await done();
    });
  });
});
