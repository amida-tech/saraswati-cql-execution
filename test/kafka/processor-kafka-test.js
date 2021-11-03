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
const evaluator = require('../../processor-kafka');

describe('It tests KafkaJS', () => {
  // if (config.jenkins) {
  //   //Kafka doesn't run in Jenkins, so we want to skip these tests
  //   return;
  // }

  // const testGroup = uuidv4(); // You want these to be different each time so tests don't collide.
  // const testData = uuidv4();


  // const kafka = new Kafka({
  //   clientId: testGroup,
  //   brokers:  config.kafkaBrokers,
  //   logLevel: config.logLevel,
  //   logCreator: kafkaLogger
  // });

  // const admin = kafka.admin();
  // const producer = kafka.producer();
  // const consumer = kafka.consumer({ groupId: testGroup });

  // afterEach(async () => {
  //   logger.log('info', 'Testing complete, clearing topic queue.');
  //   await consumer.disconnect();
  //   await admin.connect();
  //   await admin.deleteTopics({
  //     topics: [testGroup, "jsonTest"],
  //     timeout: 30000
  //   });
  //   await admin.disconnect();
  // });
  
  // beforeEach(async () => {
  //   logger.log('info', 'Testing started, creating topic queue.');
  
  //   await producer.connect();
  //   await producer.send({
  //     topic: testGroup,
  //     messages: [
  //       { value: testData }
  //     ],
  //   });

  //   let completed = false;

  //   while (!completed) {
  //     inboundContractData[0].entry.forEach(
  //       entry => {
  //         producer.send({
  //           topic: "jsonTest",
  //           messages: [
  //             { value: JSON.stringify(entry) }
  //           ],
  //         });
  //       }
  //     )
  //     completed = true;
  //   }

  
  //   await producer.disconnect();
  // });
  
//   describe('Tests Kafka', () => {
//     it('Consumes a topic and produces a measurement', async () => {
//       const consumedMessages = [];
//       await consumer.connect();
//       await consumer.subscribe({ topic: testGroup, fromBeginning: true });
//       await consumer.run({
//         eachMessage: async({ topic, partition, message }) => {
//           consumedMessages.push({ topic, partition, message: message.value.toString()});
//         }
//       });
//       await waitFor(() => consumedMessages.length === 1);

//       should(consumedMessages[0].message).equal(testData);
//     });
//   });

  describe('Evalutaor Test', () => {
    it('Evaluates data', async () => {
      let data = []
      const evalData = inboundContractData;
      try {evaluator.evalData(evalData, data);}
      catch (error){ console.error(errror)}

      console.log(">>>>>>>>>>>>>>>>>>>>");
      console.log(data);

      should(consumedMessages[0].message).equal(testData);
    });
  });

//   describe('Tests Kafka 2', () => {
//     it('Consumes valid fhir bundle and produces a proccesed outbound message', async () => {

//       const outbound = outboundContractData
//       const consumedMessages = [];
//       await consumer.connect();
//       await consumer.subscribe({ topic: "jsonTest", fromBeginning: true });
//       await consumer.run({
//         eachMessage: async({ topic, partition, message }) => {
//           if (topic === "jsonTest"){
//             console.log(">>>>>>>>>> 7")
//             consumedMessages.push({ topic, partition, message: message.value.toString()});

//           }
//         }
//       });
//       console.log(">>>>>>>>>> 8");
//       await waitFor(() => consumedMessages.length > 1);
//       console.log(">>>>>>>>>> 9")
//         let data = []
//         console.log(consumedMessages)
//         const evalMessage = consumedMessages[1].message;
//         console.log(">>>>>>>>>> 10")
//         console.log(evalMessage)
//         console.log(">>>>>>>>>> 11")
//         try{
//         data.push(executeA1c(evalMessage.resource))}
//         catch (error) {
//           console.error(error)
//         }
//         // evaluator.evalData([evalMessage], data);
//         console.log(">>>>>>>>>> data")
//         console.log(data)
//       should(data).equal(outbound.toString);
//       await consumer.disconnect();
//       await done();
//     });
//   });
});
