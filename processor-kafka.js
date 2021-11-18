const { Kafka } = require('kafkajs');
const config = require('./config');

const { executeDiabetes } = require('./exec-files/exec-cdc_diabetes-bp');
const { executeA1c } = require('./exec-files/exec-cdc_hba1c-lessThanEight');
const { executeImmunization } = require('./exec-files/exec-childhood-immunization-status');
const { executeDepression } = require('./exec-files/exec-depression-screening');
const { executeAsthma } = require('./exec-files/exec-medication-management-for-people-with-asthma');
const { executePPC } = require('./exec-files/exec-prenatal-postpartum-care');
const { executePreventable } = require('./exec-files/exec-preventable-complications');
const { executeChildWellVisit } = require('./exec-files/exec-childhood-well-visit');
const { executeReadmission } = require('./exec-files/exec-readmission');
const { executeDepressionRemission } = require('./exec-files/exec-drre');
const { executeBreastCancerScreening } = require('./exec-files/exec-bcs');

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
    let workingArray = [];
    workingArray.push(executeA1c(element));
    workingArray.push(executeAsthma(element));
    workingArray.push(executeDepression(element));
    workingArray.push(executeDiabetes(element));
    workingArray.push(executeImmunization(element));
    workingArray.push(executePPC(element));
    workingArray.push(executePreventable(element));
    workingArray.push(executeChildWellVisit(element));
    workingArray.push(executeReadmission(element));
    workingArray.push(executeDepressionRemission(element));
    workingArray.push(executeBreastCancerScreening(element));

    workingArray.forEach(score => {
      if (score.Denominator != 0){
        data.push(score);
      }
    });
  });
}

runner();

const evaluator = {
    evalData: evalData,
}

module.exports = evaluator;