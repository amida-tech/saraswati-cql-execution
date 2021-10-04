const kafka = require('./kafka');

const { kafkaConfig } = require("./config");

const consumer = kafka.consumer({ groupId: 'hedis-measures' })

const producer = kafka.producer()

await consumer.connect()
await producer.connect()

await consumer.subscribe({ topic: kafkaConfig.kafkaConsumedTopic, fromBeginning: false })

//Runs each time a message is recieved
await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        let fhirJson = message.value.toString();
        let patients = JSON.parse(fhirJson);
        let data = [];
        evalData(patients,data)
        if (data != null) {
            producer.send(
                {
                    topic: kafkaConfig.kafkaProducedTopic,
                    messages: [
                        {value: JSON.stringify(data)},
                    ],
                }
            )
            console.log({
                value: message.value.toString(),
            })
        }
    },
})

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

        workingArray.forEach(score => {
            if (score.Denominator != 0){
                data.push(score)
            }
        });
    });
}