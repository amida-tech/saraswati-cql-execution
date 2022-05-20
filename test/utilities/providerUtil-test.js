const should = require('should');const fs = require('fs');
const path = require('path');
const { createProviderList } = require('../../src/utilities/providerUtil');

const aabData = JSON.parse(fs.readFileSync(`${path.resolve()}/data/patients/aab/bronchitis-patient-1.json`));
const couData = JSON.parse(fs.readFileSync(`${path.resolve()}/data/patients/cou/opioids-continued-patient-1.json`));
const imaeData = JSON.parse(fs.readFileSync(`${path.resolve()}/data/patients/imae/adolescent-immunization-patient.json`));

describe('ProviderUtil test ', () => {
  it('AAB should find 2 providers', () => {
    const resultArray = createProviderList(aabData);
    resultArray.should.have.lengthOf(2);
  });

  it('COU should find 2 providers', () => {
    const resultArray = createProviderList(couData);
    resultArray.should.have.lengthOf(2);
  });

  it('IMA-E should find 3 providers', () => {
    const resultArray = createProviderList(imaeData);
    resultArray.should.have.lengthOf(3);
  });
});
