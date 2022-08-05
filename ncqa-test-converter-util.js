const fs = require('fs');
const config = require('./config');

const measure = config.measurementType;

const getSystem = (value) => {
  switch(value) {
    case 'S':
      return 'http://snomed.info/sct';
    case '9':
      return 'http://hl7.org/fhir/sid/icd-9-cm';
    case 'X':
      return 'http://hl7.org/fhir/sid/icd-10-cm';
    case 'X2':
      return 'https://www.cms.gov/Medicare/Coding/ICD10'
    case 'C':
      return 'http://www.ama-assn.org/go/cpt';
    case 'L':
      return 'http://loinc.org'
    case 'H':
      return 'https://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets';
    case 'A':
      return 'http://terminology.hl7.org/CodeSystem/v3-ActCode';
    case 'R':
      return 'https://www.nubc.org/CodeSystem/RevenueCodes';
    default:
      return 'NA';
  }
};

const getRxSystem = (value) => {
  switch(value) {
    case 'R':
      return 'http://www.nlm.nih.gov/research/umls/rxnorm';
    case 'C':
      return 'http://hl7.org/fhir/sid/cvx';
    default:
      return 'NA';
  }
}

const createCode = (code, systemFlag, systemType) => {
  if (code === undefined) {
    return undefined;
  }
  let system = '';
  if (systemType === 'RX') {
    system = systemFlag.length === 1 ? getRxSystem(systemFlag) : systemFlag;
  } else {
    // 10 PNDE Deliveries, 30 for AIS-E bone marrow, GZ for FUM Electro Therapy
    if ((code.startsWith('10') || code.startsWith('30') || code.startsWith('GZ') 
      || code.startsWith('0UTC') || code === '3E0234Z') 
      && code.length === 7 && systemFlag === 'X') {
      system = getSystem('X2');
    } else {
      system = systemFlag.length === 1 ? getSystem(systemFlag) : systemFlag;
    }
  }
  if (system !== 'NA') {
    return {
      system,
      code,
    }
  }
  return { code };
};

const professionalClaimType = () => {
  return {
    coding: [ 
      createCode('professional', 'http://terminology.hl7.org/CodeSystem/claim-type'),
    ],
  }
}

const pharmacyClaimType = () => {
  return {
    coding: [ 
      createCode('pharmacy', 'http://terminology.hl7.org/CodeSystem/claim-type'),
    ],
  }
}

const paidAdjudication = () => {
  return [
    {
      category: {
        coding: [
          {
            code: 'benefit'
          }
        ]
      },
      amount: {
        value: 100.00,
      }
    }
  ]
}

const isDateDuringPeriod = (date, period) => {
  const dateToCheck = Date.parse(date);
  if (period.end) {
    return Date.parse(period.start) <= dateToCheck
      && dateToCheck <= Date.parse(period.end);
  }
  return Date.parse(period.start) <= dateToCheck;
}

const createServiceCodeFromVisit = (visit) => {
  if (visit.cpt || visit.hcpcs || visit.cptII) {
    let code = '';
    let system = '';
    if (visit.cpt || visit.cptII) {
      code = visit.cpt ? visit.cpt : visit.cptII;
      system = 'C';
    } else {
      code = visit.hcpcs;
      system = 'H';
    }
    return createCode(code, system);
  }
  return undefined;
}

const createClaimFromVisit = (visit) => {
  const claimId = `${visit.memberId}-visit-claim-${visit.claimId}`;
  const resource = {
    resourceType: 'Claim',
    id: claimId,
    type: professionalClaimType(),
    patient: { reference: `Patient/${visit.memberId}-patient` },
    provider: { reference: visit.providerId },
  }

  if (visit.ubRevenue) {
    resource.procedure = [{
      procedureCodeableConcept: {
        coding: [ createCode(visit.ubRevenue, 'R') ],
      },
    }];
  }

  let procCount = 1;
  if (visit.cpt) {
    if (resource.procedure === undefined) {
      resource.procedure = [];
      resource.item = [];
    }
    const cptCode = createCode(visit.cpt, 'C');
    resource.procedure.push({
      procedureCodeableConcept: {
        coding: [ cptCode ],
      },
    });
    const item = {
      sequence: procCount,
      servicedDate: convertDateString(visit.dateOfService),
      productOrService: {
        coding: [ cptCode ]
      }
    };
    if (visit.ubRevenue) {
      item.revenue = { coding: [ createCode(visit.ubRevenue, 'R') ] }
    }
    if (resource.item) {
      resource.item.push(item);
    } else {
      resource.item = [ item ];
    }
    
    procCount += 1;
  }

  if (visit.hcpcs) {
    if (resource.procedure === undefined) {
      resource.procedure = [];
      resource.item = [];
    }
    const hcpcsCode = createCode(visit.hcpcs, 'H');
    resource.procedure.push({
      procedureCodeableConcept: {
        coding: [ hcpcsCode ],
      },
    });
    const item = {
      sequence: procCount,
      servicedDate: convertDateString(visit.dateOfService),
      productOrService: {
        coding: [ hcpcsCode ]
      }
    };
    if (visit.ubRevenue) {
      item.revenue = { coding: [ createCode(visit.ubRevenue, 'R') ] }
    }
    if (resource.item) {
      resource.item.push(item);
    } else {
      resource.item = [ item ];
    }
    
    procCount += 1;
  }

  visit.icdDiagnosis.forEach((diagnosis, index) => {
    if (diagnosis) {
      if (resource.diagnosis === undefined) {
        resource.diagnosis = []
      }
      resource.diagnosis.push({
        sequence: index + 1,
        diagnosisCodeableConcept: {
          coding: [ createCode(diagnosis, visit.icdIdentifier) ]
        }
      });
    }
  });

  if (visit.icdDiagnosis[0]) {
    const item = {
      sequence: procCount,
      servicedDate: convertDateString(visit.dateOfService),
    };
    if (visit.ubRevenue) {
      item.revenue = { coding: [ createCode(visit.ubRevenue, 'R') ] }
    }
    if (resource.item) {
      resource.item.push(item);
    } else {
      resource.item = [ item ];
    }
  }

  if (visit.cmsPlaceOfService) {
    resource.locationReference = {
      reference: visit.cmsPlaceOfService,
    };
  }

  return resource;
}

const createDiagnosisCondition = (condition) => {
  const condObj = {
    id: condition.conditionId,
    resourceType: 'Condition',
    subject: { reference: `Patient/${condition.memberId}-patient` },
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active'
        }
      ]
    },
    code: { coding: [ createCode(condition.code, condition.system) ] },
  }

  if (condition.onsetDateTime) {
    condObj.onsetDateTime = convertDateString(condition.onsetDateTime);
    condObj.abatementDateTime = convertDateString(condition.onsetDateTime);
  } else if (condition.onsetStart) {
    if (condition.onsetEnd) {
      condObj.onsetDateTime = convertDateString(condition.onsetStart);
      condObj.abatementDateTime = convertDateString(condition.onsetEnd);
    } else {
      condObj.onsetDateTime = convertDateString(condition.onsetStart);
      condObj.abatementDateTime = convertDateString(condition.onsetStart);
    }
  }
  if (condition.recorder) {
    condObj.recorder = {
      reference: condition.recorder,
    };
  }
  return condObj;
}

const ambulatoryPosList = ['02', '03', '05', '07', '09', '11', '15', '17', '18', '19',
                        '20', '22', '24', '31', '49', '50', '52', '53', '57', '58', '65', '71', '72'];
const homeHealthPosList = ['12', '13', '14', '16', '33'];

const createClaimEncounter = (encounter) => {
  const encounterFhir = {
    resourceType: 'Encounter',
    id: encounter.encounterId,
    subject: { reference: encounter.memberId },
    status: 'finished',
    period: {
      start: convertDateString(encounter.period.start),
      end: convertDateString(encounter.period.end),
    }
  };
  if (encounter.serviceCode) {
    encounterFhir.type = [ { coding: [ encounter.serviceCode ] } ];
  }
  if (encounter.procedureList) {
    encounter.procedureList.forEach((procedure) => {
      if (procedure !== '') {
        if (encounterFhir.type) {
          encounterFhir.type[0].coding.push( createCode(procedure, encounter.icdIdentifier));
        } else {
          encounterFhir.type = [ { coding: [ createCode(procedure, encounter.icdIdentifier) ] } ];
        }
      }
    });
  }

  if (encounter.cmsPlaceOfService || encounter.cptModOne) {
    if (encounter.cmsPlaceOfService === '02'
      || encounter.cptModOne === 'GT') {
      encounterFhir.class = createCode('VR', 'A');
    } else if (ambulatoryPosList.includes(encounter.cmsPlaceOfService)) {
      encounterFhir.class = createCode('AMB', 'A');
    } else if (homeHealthPosList.includes(encounter.cmsPlaceOfService)) {
      encounterFhir.class = createCode('HH', 'A');
    }
    if (encounter.cmsPlaceOfService) {
      encounterFhir.location = [ { location: { reference: encounter.cmsPlaceOfService } } ];
    }
  }

  if (encounter.ubRevenue) {
    if (encounterFhir.type) {
      encounterFhir.type.push({ // Must be R for ADD-E
        coding: [ createCode(encounter.ubRevenue, 'R') ],
      });
    } else {
      encounterFhir.type = [ { coding: [ createCode(encounter.ubRevenue, 'R') ] } ];
    }
  }

  if (encounter.serviceProvider) {
    encounterFhir.serviceProvider = {
      reference: encounter.serviceProvider,
    };
  }

  return encounterFhir;
}

const createClaimResponse = (response) => {
  return {
    resourceType: 'ClaimResponse',
    id: `${response.memberId}-${response.idName}-${response.claimId}`,
    type: response.claimType,
    outcome: 'complete',
    patient: { reference: `Patient/${response.memberId}-patient` },
    request: { reference: `Claim/${response.fullClaimId}` },
    item: [{
      itemSequence: 1,
      servicedDate: convertDateString(response.serviceDate),
      adjudication: paidAdjudication(),
    }],
    addItem: [
      {
        productOrService: { coding: [ response.serviceCode ] },
        servicedDate: convertDateString(response.serviceDate),
      }
    ],
  };
}

const createPractitionerLocation = (locPrac) => {
  return {
    resourceType: locPrac.type,
    id: locPrac.npi,
    identifier: [
      {
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
              code: 'PRN',
            }
          ]
        },
        system: 'http://hl7.org/fhir/sid/us-npi',
        value: locPrac.npi,
      }
    ]
  }
}

const createPharmacyClaim = (pharmacy) => {
  const resource = {
    resourceType: 'Claim',
    id: pharmacy.claimId,
    type: pharmacy.claimType,
    patient: { reference: `Patient/${pharmacy.memberId}-patient` },
  }

  let item = undefined;
  if (pharmacy.serviceDate) {
    item = {
      sequence: 1,
      servicedDate: convertDateString(pharmacy.serviceDate),
      productOrService: {
        coding: [ pharmacy.serviceCode ]
      },
    };
  } else if (pharmacy.startDate && pharmacy.endDate) {
    item = {
      sequence: 1,
      servicedPeriod: {
        start: convertDateString(pharmacy.startDate),
        end: convertDateString(pharmacy.endDate),
      },
      productOrService: {
        coding: [ pharmacy.serviceCode ]
      },
    };
  }

  if (pharmacy.diagnosisCode) {
    resource.diagnosis = [
      {
        sequence: 1,
        diagnosisCodeableConcept: {
          coding: [
            pharmacy.diagnosisCode
          ]
        }
      }
    ]
  }
  
  if (pharmacy.quantity) {
    resource.quantity = {
      value: pharmacy.quantity,
    }
    if (item) {
      item.quantity = {
        value: pharmacy.quantity,
      }
    }
  }

  resource.item = [item];
  return resource;
}

const convertDateString = (ncqaDateString) => {
  const year = ncqaDateString.toString().substr(0, 4);
  const month = ncqaDateString.toString().substr(4, 2);
  const day = ncqaDateString.toString().substr(6, 2);

  return `${year}-${month}-${day}`;
}

const labValueSets = ['2.16.840.1.113883.3.464.1004.1525',
                    '2.16.840.1.113883.3.464.1004.1527',
                    '2.16.840.1.113883.3.464.1004.1769',
                    '2.16.840.1.113883.3.464.1004.1755',
                    '2.16.840.1.113883.3.464.1004.1742',
                    '2.16.840.1.113883.3.464.1004.1751',
                    '2.16.840.1.113883.3.464.1004.1783',
                    '2.16.840.1.113883.3.464.1004.1963'];

const checkValidLabCode = (code) => {
  const dir = config.valuesetsDirectory;
  for (const valueset of labValueSets) {
    try {
      const valueSetInfo = JSON.parse(fs.readFileSync(`${dir}${valueset}.json`, 'utf8'));
      for (const value of valueSetInfo.expansion.contains) {
        if (code === value.code) {
          return true;
        }
      }
    } catch (e) {
      // console.log(`Skipping ${valueset}, not used`);
    }
  }

  return false;
}

const invalidLocations = ['10', '27', '28', '29', '30','35', '36', '37', '38', '39', '40',
                        '43', '44', '45', '46', '47', '48', '58', '59', '63', '64', '66', '67',
                        '68', '69', '70', '73', '74', '75', '76', '77', '78', '79', '80',
                      '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92',
                      '93', '94', '95', '96', '97', '98'];

const isValidEncounter = (visit) => {
  // These codes mean no service was performed on the members requestLaz
  if (visit.cptIIMod === '1P'
    || visit.cptIIMod === '2P'
    || visit.cptIIMod === '3P'
    || visit.cptIIMod === '8P') {
      return false;
  }
  const cmsPlaceOfService = visit.cmsPlaceOfService;
  // Can't be one of the unassaigned locations
  if (invalidLocations.includes(cmsPlaceOfService)) {
    return false;
  }
  let ubTypeOfBill = visit.ubTypeOfBill;
  if (ubTypeOfBill.length === 3) {
    ubTypeOfBill = `0${ubTypeOfBill}`;
  }
  const ubRevenue = visit.ubRevenue;
  // 21 is for inpatient facility, other than psychiatric. 0154 is psychiatric
  if ((cmsPlaceOfService && cmsPlaceOfService === '31') 
    && (ubRevenue && ubRevenue == '0154')) {
    return false;
  }
  // 31 is for skilled nursing facility
  if (cmsPlaceOfService === '31') {
    // If Ub Revenue exists, but is not 002 (skilled nursing) it's invalid
    if (ubRevenue && !ubRevenue.startsWith('002') ) {
      return false;
    }
    // 1 is for hospital, Can't be both, so it's invalid
    if (ubTypeOfBill.charAt(1) === '1') {
      return false;
    }
  }
  // 81 is for laboratory
  if (cmsPlaceOfService === '81') {
    // add-e, ais-e don't use lab codes, so it's invalid
    if (measure === 'adde' || measure === 'aise') {
      return false;
    }
    const visitCode = createServiceCodeFromVisit(visit);
    if (visitCode) {
      return checkValidLabCode(visitCode.code);
    } else if (visit.ubRevenue) {
      return checkValidLabCode(visit.ubRevenue);
    }
  }

  return true;
}

module.exports = { getSystem, createCode, professionalClaimType, 
  pharmacyClaimType, convertDateString, createClaimFromVisit,
  createServiceCodeFromVisit, createClaimEncounter, createDiagnosisCondition,
  createClaimResponse, createPharmacyClaim, isDateDuringPeriod, createPractitionerLocation, isValidEncounter };
