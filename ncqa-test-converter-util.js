const getSystem = (value) => {
  switch(value) {
    case 'S':
      return 'http://snomed.info/sct';
    case '9':
      return 'http://hl7.org/fhir/sid/icd-9-cm';
    case 'X':
      return 'http://hl7.org/fhir/sid/icd-10-cm';
    case 'C':
      return 'http://www.ama-assn.org/go/cpt';
    case 'H':
      return 'https://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets';
    case 'R':
      return 'http://www.nlm.nih.gov/research/umls/rxnorm';
    default:
      return 'NA';
  }
};

const createCode = (code, systemFlag) => {
  const system = systemFlag.length === 1 ? getSystem(systemFlag) : systemFlag;
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

const createServiceCodeFromVisit = (visit) => {
  if (visit.cpt || visit.hcpcs) {
    let code = '';
    let system = '';
    if (visit.cpt) {
      code = visit.cpt;
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

  if (visit.ubRevenue && visit.ubRevenue.startsWith('045')) {
    resource.procedure = [{
      procedureCodeableConcept: {
        coding: [ createCode('99211', 'C') ],
      },
    }]
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

  visit.icdDiagnosis.forEach((diagnosis) => {
    if (diagnosis) {
      if (resource.diagnosis === undefined) {
        resource.diagnosis = [ { diagnosisCodeableConcept: { coding: [] } } ];
      }
      resource.diagnosis[0].diagnosisCodeableConcept.coding.push(
        createCode(diagnosis, visit.icdIdentifier)
      );
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

const convertDateString = (ncqaDateString) => {
  const year = ncqaDateString.toString().substr(0, 4);
  const month = ncqaDateString.toString().substr(4, 2);
  const day = ncqaDateString.toString().substr(6, 2);

  return `${year}-${month}-${day}`;
}

module.exports = { getSystem, createCode, professionalClaimType, 
  pharmacyClaimType, paidAdjudication, convertDateString, createClaimFromVisit,
  createServiceCodeFromVisit };
