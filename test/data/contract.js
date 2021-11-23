const should = require('should');
const inboundContractData = require('../../contract/examples/inbound.json');
const outboundContractData = require('../../contract/examples/outbound.json');
const { evalData } = require('../../exec-files/exec-config');
const moment = require('moment');
const updateTimestamp = moment().unix(1);

describe('Contract Kafka Processor Test', () => {
  it('Evaluates known input data and compares to known output data', async () => {
    let data = [];
    const inboundJson = inboundContractData;
    let outboundJson = outboundContractData;
    console.log("JAMES")
    console.log(process.env);
    evalData(inboundJson, data);
    fixTimestamp(data);
    fixTimestamp(outboundJson);

    should(JSON.stringify(data)).equal(JSON.stringify(outboundJson));
  });
});

function fixTimestamp(inputJson){
  inputJson.forEach(entry => {
    entry.timeStamp = updateTimestamp;
  });
}