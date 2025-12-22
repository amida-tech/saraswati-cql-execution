const { Kafka } = require('kafkajs');
const logger = require('./src/winston');
const config = require('./config');
const { DataLakeServiceClient, StorageSharedKeyCredential } = require("@azure/storage-file-datalake");

const kafkaInfo = {
  clientId: 'cql-execution',
  brokers: config.kafkaBrokers,
}

if (config.kafkaProtocol !== 'plaintext') {
  kafkaInfo.ssl = true;
  kafkaInfo.sasl = {
    mechanism: config.kafkaMechanisms,
    username: config.kafkaUsername,
    password: config.kafkaPassword
  };
}

const kafka = new Kafka(kafkaInfo);

const consumer = kafka.consumer({ groupId: config.kafkaGroupId });
const { evalData } = require('./exec-files/exec-config');
const producer = kafka.producer();

let patientResultsFileSystemClient;
let patientBundleFileSystemClient;
let dataLakeServiceClient;

const setDataLakeServiceClient = () => {
  if (!dataLakeServiceClient) {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      config.datalakeAccountName,
      config.datalakeAccountKey
    );
    dataLakeServiceClient = new DataLakeServiceClient(
      `https://${config.datalakeAccountName}.dfs.core.windows.net`,
      sharedKeyCredential
    );
  }
}

const setPatientBundleFileSystemClient = () => {
  if (!patientBundleFileSystemClient) {
    setDataLakeServiceClient();
    patientBundleFileSystemClient = dataLakeServiceClient.getFileSystemClient(config.datalakePatientBundleDirectory);
  }
}

const setPatientResultsFileSystemClient = () => {
  if (!patientResultsFileSystemClient) {
    setDataLakeServiceClient();
    patientResultsFileSystemClient = dataLakeServiceClient.getFileSystemClient(config.datalakePatientResultsDirectory);
  }
}

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

async function runner() {
  await consumer.connect();
  await producer.connect();

  let consumedTopic = config.kafkaConsumedTopic;
  let producedTopic = config.kafkaProducedTopic;
  await consumer.subscribe({ topic: consumedTopic, fromBeginning: false });

  // Runs each time a message is received.
  await consumer.run({
    eachMessage: async ({ message }) => {
      logger.info(`Received Kafka message for group: ${config.kafkaGroupId}.`);
      const jsonMessage = JSON.parse(message.value.toString());
      let fhirJson;
      if (jsonMessage !== undefined && jsonMessage["patient_bundle_path"] !== undefined) {
        logger.info('Retrieve patient bundle from DataLake path: ' + jsonMessage["patient_bundle_path"]);
        setPatientBundleFileSystemClient();
        const fileClient = patientBundleFileSystemClient.getFileClient(jsonMessage["patient_bundle_path"]);
        const downloadResponse = await fileClient.read();
        const downloaded = (await streamToBuffer(downloadResponse.readableStreamBody)).toString();
        fhirJson = JSON.parse(downloaded);
      } else {
        fhirJson = jsonMessage;
      }
      const data = await evalData(fhirJson);
      if (data !== undefined) {
        if (patientBundleFileSystemClient) {
          // DataLake configured, store results there.
          logger.info('Storing patient results to DataLake.');
          setPatientResultsFileSystemClient();

          const resultFileName = `${jsonMessage['patient_id']}/patient-${jsonMessage['patient_id']}-results-${new Date().toISOString()}.json`;
          const fileClient = patientResultsFileSystemClient.getFileClient(resultFileName);
          await fileClient.create();
          await fileClient.append(JSON.stringify(data), 0, Buffer.byteLength(JSON.stringify(data)));
          await fileClient.flush(Buffer.byteLength(JSON.stringify(data)));
          logger.info('Patient results stored to DataLake with filename: ' + resultFileName);
          producer.send(
            {
              topic: producedTopic,
              messages: [
                { patientId: jsonMessage['patient_id'], resultFileName },
              ],
            }
          );
        } else {
          // No DataLake configured, send data directly to Kafka topic.
          var dataString = JSON.stringify(data);
          producer.send(
            {
              topic: producedTopic,
              messages: [
                { value: dataString },
              ],
            }
          );
        }
        logger.info(`Sent Kafka message to topic: ${producedTopic}.`);
      } else {
        logger.info('No message sent.');
      }
    },
  });
}

runner();
