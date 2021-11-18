const should = require('should');
const inboundContractData = require('../../contract/examples/inbound.json');
const outboundContractData = require('../../contract/examples/outbound.json');
const evaluator = require('../../processor-kafka');
const moment = require('moment');
const updateTimestamp = moment().unix(1);

describe('Contract Kafka Processor Test', () => {
  it('Evaluates known input data and compares to known output data', async () => {
    let data = [];
    const evalData = inboundContractData;
    let outboundJson = outboundContractData;
    evaluator.evalData(evalData, data);
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