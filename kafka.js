const { Kafka } = require('kafkajs')
const { kafkaConfig } = require("./config");

const kafka = new Kafka({
    clientId: 'cql-execution',
    brokers: [kafkaConfig.brokers[0], 'broker:29092']
})

module.exports = {
    kafka
}