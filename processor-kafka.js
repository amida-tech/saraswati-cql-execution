const { Kafka } = require('kafkajs');
const config = require('./config');
const { evalData } = require('./exec-files/exec-config');

const kafka = new Kafka({
  clientId: 'cql-execution',
  brokers: config.kafkaBrokers
});

const consumer = kafka.consumer({ groupId: config.kafkaGroupId });

const producer = kafka.producer();

async function runner() {
  await consumer.connect();
  await producer.connect();

  let consumedTopic = config.kafkaConsumedTopic;
  let producedTopic = config.kafkaProducedTopic;
  await consumer.subscribe({ topic: consumedTopic, fromBeginning: false });
    
  //Runs each time a message is recieved
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
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
        console.log(dataString);
      }
    },
  });
}

runner();
