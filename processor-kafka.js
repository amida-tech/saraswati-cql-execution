const { Kafka } = require('kafkajs');
const config = require('./config');
const { execute } = require('./exec-files/exec-config');

const kafka = new Kafka({
  clientId: 'cql-execution',
  brokers: [config.kafkaBroker, 'broker:29093']
});

const consumer = kafka.consumer({ groupId: 'hedis-measures' });

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
      let fhirJson = message.value.toString();
      let patients = JSON.parse(fhirJson);
      let data = [];
      evalData(patients,data);
      if (data != null) {
        producer.send(
          {
            topic: producedTopic,
            messages: [
              {value: JSON.stringify(data)},
            ],
          }
        );
        console.log({
          value: message.value.toString(),
        });
      }
    },
  });
}

// This function contains all of the business logic for the evaluation.
function evalData(patients, data){
  patients.forEach(element => {
    const results = execute(element);
    if (results.Denominator != 0){
      data.push(results);
    }
  });
}

runner();

const evaluator = {
  evalData: evalData,
};

module.exports = evaluator;