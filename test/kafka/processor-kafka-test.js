// const consumer = require('../processor-kafka');
const { Kafka } = require('kafkajs');
const logger = require('../../src/winston');
const kafkaLogger = require('../../src/kafka-winston-config');
const config = require('../../config');
const waitFor = require('kafkajs/src/utils/waitFor');
const { v4: uuidv4 } = require('uuid');
const should = require('should');
const inboundContractData = require('../../contract/examples/inbound.json');
const outboundContractData = require('../../contract/examples/outbound.json');
const evaluator = require('../../processor-kafka');
const moment = require('moment');
const jsonl = require('jsonl');


const updateTimestamp = moment().unix(1)

describe('Evalutaor Test', () => {
  it('Evaluates data', async () => {
    let data = []
    const evalData = inboundContractData;
    let outboundJson = outboundContractData;
      evaluator.evalData(evalData, data);
      fixTimestamp(data);
      fixTimestamp(outboundJson);

      should(JSON.stringify(data)).equal(JSON.stringify(outboundJson));
  });
});

describe('It tests KafkaJS', () => {
  if (config.jenkins) {
    //Kafka doesn't run in Jenkins, so we want to skip these tests
    return;
  }

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
});

function fixTimestamp(inputJson){
    inputJson.forEach(entry => {
      entry.timeStamp = updateTimestamp;
    })
}
