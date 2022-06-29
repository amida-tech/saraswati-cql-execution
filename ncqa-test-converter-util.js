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
  let system = '';
  if (systemType === 'RX') {
    system = systemFlag.length === 1 ? getRxSystem(systemFlag) : systemFlag;
  } else {
    // For PNDE Deliveries
    if (code.length === 7 && code.startsWith('10') && systemFlag === 'X') {
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
  const claimId = `${visit.memberId}-prof-claim-${visit.claimId}`;
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
        coding: [ createCode(visit.ubRevenue, 'C') ],
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
    resource.item = [{
      sequence: procCount,
      servicedDate: convertDateString(visit.dateOfService),
      productOrService: {
        coding: [ cptCode ]
      }
    }];
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
    resource.item.push({
      sequence: procCount,
      servicedDate: convertDateString(visit.dateOfService),
      productOrService: {
        coding: [ hcpcsCode ]
      }
    });
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
    if (resource.item) {
      resource.item.push({
        sequence: procCount,
        servicedDate: convertDateString(visit.dateOfService),
      });
    } else {
      resource.item = [{
        sequence: procCount,
        servicedDate: convertDateString(visit.dateOfService),
      }];
    }
  }

  return resource;
}

const createClaimFromVisitEncounter = (visitEncounter, count) => {
  const serviceCode = createCode(visitEncounter.activityType, visitEncounter.codeFlag);
  const resource = {
    resourceType: 'Claim',
    id: `${visitEncounter.memberId}-prof-claim-${count}`,
    type: professionalClaimType(),
    created: convertDateString(visitEncounter.serviceDate),
    patient: { reference: `Patient/${visitEncounter.memberId}-patient` },
    provider: { reference: visitEncounter.providerId },
    procedure: [
      {
        procedureCodeableConcept: {
          coding: [ serviceCode ],
        },
      }
    ],
    item: [
      {
        sequence: 1,
        servicedDate: convertDateString(visitEncounter.serviceDate),
        productOrService: {
          coding: [ serviceCode ]
        }
      }
    ]
  }
  if (visitEncounter.diagnosisCode !== undefined) {
    resource.diagnosis = [
      {
        diagnosisCodeableConcept: {
          coding: [ 
            createCode(visitEncounter.diagnosisCode, visitEncounter.diagnosisFlag)
          ]
        }
      }
    ];
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
  } else if (condition.onsetStart) {
    if (condition.onsetEnd) {
      condObj.onsetPeriod = {
        start: convertDateString(condition.onsetStart),
        end: convertDateString(condition.onsetEnd),
      }
    } else {
      condObj.onsetDateTime = convertDateString(condition.onsetStart);
    }
  }
  return condObj;
}

const createClaimEncounter = (encounter) => {
  const encounterFhir = {
    resourceType: 'Encounter',
    id: `${encounter.memberId}-claim-encounter-${encounter.encounterId}`,
    status: 'finished',
    period: {
      start: convertDateString(encounter.period.start),
      end: convertDateString(encounter.period.end),
    }
  };
  if (encounter.serviceCode) {
    encounterFhir.type = [ { coding: [ encounter.serviceCode ] } ];
  }

  if (encounter.cmsPlaceOfService) {
    if (encounter.cmsPlaceOfService === '02') {
      encounterFhir.class = createCode('VR', 'A');
    } else if (encounter.cmsPlaceOfService === '71') {
      encounterFhir.class = createCode('AMB', 'A');
    }
  }

  if (encounter.ubRevenue) {
    if (encounterFhir.type) {
      encounterFhir.type.push({
        coding: [ createCode(encounter.ubRevenue, 'C') ],
      });
    } else {
      encounterFhir.type = [ { coding: [ createCode(encounter.ubRevenue, 'C') ] } ];
    }
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

module.exports = { getSystem, createCode, professionalClaimType, 
  pharmacyClaimType, convertDateString, createClaimFromVisit, createClaimFromVisitEncounter,
  createServiceCodeFromVisit, createClaimEncounter, createDiagnosisCondition,
  createClaimResponse, createPharmacyClaim, isDateDuringPeriod, createPractitionerLocation };
