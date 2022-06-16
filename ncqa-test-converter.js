const parseArgs = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const readline = require('readline');
const { createCode, professionalClaimType, pharmacyClaimType,
  paidAdjudication, convertDateString, createClaimFromVisit,
  createServiceCodeFromVisit } = require('./ncqa-test-converter-util');

//const memberId = 105264;

if(parseArgs['testDirectory'] === undefined) {
  console.error('\x1b[31m', 
    '\nError: Please define a directory path to read. Usage: "--testDirectory=<directory>".',
    '\x1b[0m');
  process.exit();
}

const extractValue = (line, start, length) => {
  return line.substring(start - 1, start + length - 1).trim()
}

const readFile = async (file) => {
  return readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  });
}

async function initMembers(testDirectory) {
  const memberObject = {};
  const fileLines = await readFile(`${testDirectory}/member-gm.txt`);
  for await (const text of fileLines) {
    const memberId = extractValue(text, 1, 16);
    memberObject[memberId] = {
      generalMembership: {
        memberId:              extractValue(text, 1, 16),
        gender:                extractValue(text, 17, 1),
        dateOfBirth:           extractValue(text, 18, 8),
        memberLastName:        extractValue(text, 26, 20),
        memberFirstName:       extractValue(text, 46, 20),
        subscriberId:          extractValue(text, 67, 16),
        mailingAddressOne:     extractValue(text, 83, 50),
        mailingAddressTwo:     extractValue(text, 133, 50),
        city:                  extractValue(text, 183, 30),
        state:                 extractValue(text, 213, 2),
        zipCode:               extractValue(text, 215, 5),
        phoneNumber:           extractValue(text, 220, 10),
        guardianFirstName:     extractValue(text, 230, 25),
        guardianMiddleInitial: extractValue(text, 255, 1),
        guardianLastName:      extractValue(text, 256, 25),
        race:                  extractValue(text, 281, 2),
        ethnicity:             extractValue(text, 283, 2),
        raceDataSource:        extractValue(text, 285, 2),
        ethnicityDataSource:   extractValue(text, 287, 2),
        spokenLanguage:        extractValue(text, 289, 2),
        spokenLanguageSource:  extractValue(text, 291, 2),
        writtenLanguage:       extractValue(text, 293, 2),
        writtenLanguageSource: extractValue(text, 295, 2),
        otherLanguage:         extractValue(text, 297, 2),
        otherLanguageSource:   extractValue(text, 299, 2),
      }
    }
  }

  return memberObject;
}

async function readMembershipEnrollment(testDirectory, memberInfo) {
  const fileLines = await readFile(`${testDirectory}/member-en.txt`);
  for await (const text of fileLines) {
    const memberId = extractValue(text, 1, 16);
    const currentMember = memberInfo[memberId];
    if (currentMember.membershipEnrollment === undefined) {
      currentMember.membershipEnrollment = [];
    }
    currentMember.membershipEnrollment.push({
      memberId:           extractValue(text, 1, 16),
      startDate:          extractValue(text, 17, 8),
      disenrollmentDate:  extractValue(text, 25, 8),
      dentalBenefit:      extractValue(text, 33, 1),
      drugBenefit:        extractValue(text, 34, 1),
      mhbInpatient:       extractValue(text, 35, 1),
      mhbIntensive:       extractValue(text, 36, 1),
      mhbOutpatient:      extractValue(text, 37, 1),
      cdbInpatient:       extractValue(text, 38, 1),
      cdbIntensive:       extractValue(text, 39, 1),
      cdbOutpatient:      extractValue(text, 40, 1),
      payor:              extractValue(text, 41, 3),
      healthPlanFlag:     extractValue(text, 44, 1),
      indicator:          extractValue(text, 45, 10),
    });
  }
}

async function readVisit(testDirectory, memberInfo) {
  const fileLines = await readFile(`${testDirectory}/visit.txt`);
  for await (const text of fileLines) {
    const memberId = extractValue(text, 1, 16);
    const currentMember = memberInfo[memberId];
    if (currentMember === undefined) {
      console.log(`No member info for ${memberId}, unable to add visit.txt data.`);
      continue;
    }
    if (currentMember.visit === undefined) {
      currentMember.visit = [];
    }
    const visit = {};
    visit.memberId =          extractValue(text, 1, 16);
    visit.dateOfService =     extractValue(text, 17, 8);
    visit.admissionDate =     extractValue(text, 25, 8);
    visit.dischargeDate =     extractValue(text, 33, 8);
    visit.cpt =               extractValue(text, 41, 5);
    visit.cptModOne =         extractValue(text, 46, 2);
    visit.cptModTwo =         extractValue(text, 48, 2);
    visit.hcpcs =             extractValue(text, 50, 5);
    visit.cptII =             extractValue(text, 55, 5);
    visit.cptIIMod =          extractValue(text, 60, 2);
    visit.icdDiagnosis = [];
    visit.icdDiagnosis[0] =   extractValue(text, 62, 9);
    visit.icdDiagnosis[1] =   extractValue(text, 71, 9);
    visit.icdDiagnosis[2] =   extractValue(text, 80, 9);
    visit.icdDiagnosis[3] =   extractValue(text, 89, 9);
    visit.icdDiagnosis[4] =   extractValue(text, 98, 9);
    visit.icdDiagnosis[5] =   extractValue(text, 107, 9);
    visit.icdDiagnosis[6] =   extractValue(text, 116, 9);
    visit.icdDiagnosis[7] =   extractValue(text, 125, 9);
    visit.icdDiagnosis[8] =   extractValue(text, 134, 9);
    visit.icdDiagnosis[9] =   extractValue(text, 143, 9);
    visit.icdDiagnosis[10] =  extractValue(text, 152, 9);
    visit.icdDiagnosis[11] =  extractValue(text, 161, 9);
    visit.icdDiagnosis[12] =  extractValue(text, 170, 9);
    visit.icdDiagnosis[13] =  extractValue(text, 179, 9);
    visit.icdDiagnosis[14] =  extractValue(text, 188, 9);
    visit.icdDiagnosis[15] =  extractValue(text, 197, 9);
    visit.icdDiagnosis[16] =  extractValue(text, 206, 9);
    visit.icdDiagnosis[17] =  extractValue(text, 215, 9);
    visit.icdDiagnosis[18] =  extractValue(text, 224, 9);
    visit.icdDiagnosis[19] =  extractValue(text, 233, 9);
    visit.icdProcedure = [];
    visit.icdProcedure[0] =   extractValue(text, 242, 8);
    visit.icdProcedure[1] =   extractValue(text, 250, 8);
    visit.icdProcedure[2] =   extractValue(text, 258, 8);
    visit.icdProcedure[3] =   extractValue(text, 266, 8);
    visit.icdProcedure[4] =   extractValue(text, 274, 8);
    visit.icdProcedure[5] =   extractValue(text, 282, 8);
    visit.icdIdentifier =     extractValue(text, 290, 1);
    visit.dischargeStatus =   extractValue(text, 291, 2);
    visit.ubRevenue =         extractValue(text, 293, 4);
    visit.ubTypeOfBill =      extractValue(text, 297, 4);
    visit.cmsPlaceOfService = extractValue(text, 301, 2);
    visit.claimStatus =       extractValue(text, 303, 1);
    visit.providerId =        extractValue(text, 304, 10);
    visit.supplementalData =  extractValue(text, 314, 1);
    visit.claimId =           extractValue(text, 315, 2);

    currentMember.visit.push(visit);
  }
}

async function readVisitEncounter(testDirectory, memberInfo) {
  try {
    const fileLines = await readFile(`${testDirectory}/visit-e.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember.visitEncounter === undefined) {
        currentMember.visitEncounter = [];
      }
      currentMember.visitEncounter.push ({
        memberId:       extractValue(text, 1, 16),
        serviceDate:    extractValue(text, 17, 8),
        activityType:   extractValue(text, 25, 20),
        codeFlag:       extractValue(text, 45, 1),
        endDate:        extractValue(text, 46, 8),
        status:         extractValue(text, 54, 1),
        providerId:     extractValue(text, 55, 10),
        diagnosisCode:  extractValue(text, 65, 20),
        diagnosisFlag:  extractValue(text, 85, 1),
      });
    }
  } catch (readError) {
    console.log(`No visit-e.txt in ${testDirectory}`);
  }
}

async function readPharmacy(testDirectory, memberInfo) {
  try {
    const fileLines = await readFile(`${testDirectory}/pharm.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember.pharmacy === undefined) {
        currentMember.pharmacy = [];
      }
      currentMember.pharmacy.push({
        memberId:           extractValue(text, 1, 16),
        daysSupply:         extractValue(text, 17, 3),
        serviceDate:        extractValue(text, 20, 8),
        ndcDrugCode:        extractValue(text, 28, 11),
        claimStatus:        extractValue(text, 39, 1),
        quantityDispensed:  extractValue(text, 40, 7),
        supplementalData:   extractValue(text, 47, 1),
        providerNpi:        extractValue(text, 48, 10),
        pharmacyNpi:        extractValue(text, 58, 10),
      });
    }
  } catch (readError) {
    console.log(`No pharm.txt in ${testDirectory}`);
  }
}

async function readPharmacyClinical(testDirectory, memberInfo) {
  try {
    const fileLines = await readFile(`${testDirectory}/pharm-c.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember.pharmacyClinical === undefined) {
        currentMember.pharmacyClinical = [];
      }
      currentMember.pharmacyClinical.push({
        memberId:           extractValue(text, 1, 16),
        orderedDate:        extractValue(text, 17, 8),
        startDate:          extractValue(text, 25, 8),
        drugCode:           extractValue(text, 33, 11),
        codeFlag:           extractValue(text, 44, 1),
        frequency:          extractValue(text, 45, 3),
        dispensedDate:      extractValue(text, 48, 8),
        endDate:            extractValue(text, 56, 8),
        active:             extractValue(text, 64, 1),
        yearOfImmunization: extractValue(text, 65, 4),
        quantity:           extractValue(text, 69, 3),
      });
    }
  } catch (readError) {
    console.log(`No pharm-c.txt in ${testDirectory}`);
  }
}

async function readDiagnosis(testDirectory, memberInfo) {
  try {
    const fileLines = await readFile(`${testDirectory}/diag.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember.diagnosis === undefined) {
        currentMember.diagnosis = [];
      }
      currentMember.diagnosis.push({
        memberId:      extractValue(text, 1, 16),
        startDate:     extractValue(text, 17, 8),
        diagnosisCode: extractValue(text, 25, 20),
        diagnosisFlag: extractValue(text, 45, 1),
        endDate:       extractValue(text, 46, 8),
        attribute:     extractValue(text, 54, 20),
      });
    }
  } catch (readError) {
    console.log(`No diag.txt in ${testDirectory}`);
  }
}

async function readObservation(testDirectory, memberInfo) {
  const fileLines = await readFile(`${testDirectory}/obs.txt`);
  for await (const text of fileLines) {
    const memberId = extractValue(text, 1, 16);
    const currentMember = memberInfo[memberId];
    if (currentMember.observation === undefined) {
      currentMember.observation = [];
    }
    currentMember.observation.push({
      memberId:         extractValue(text, 1, 16),
      observationDate:  extractValue(text, 17, 8),
      test:             extractValue(text, 25, 20),
      testCodeFlag:     extractValue(text, 45, 1), 
      value:            extractValue(text, 46, 20),
      units:            extractValue(text, 66, 10),
      endDate:          extractValue(text, 76, 8),
      status:           extractValue(text, 84, 1),
      resultValueFlag:  extractValue(text, 85, 1),
      type:             extractValue(text, 86, 1),
    });
  }
}

async function readProcedure(testDirectory, memberInfo) {
  try {
    const fileLines = await readFile(`${testDirectory}/proc.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember.procedure === undefined) {
        currentMember.procedure = [];
      }
      currentMember.procedure.push({
        memberId:       extractValue(text, 1, 16),
        serviceDate:    extractValue(text, 17, 8),
        procedureCode:  extractValue(text, 25, 20),
        codeFlag:       extractValue(text, 45, 1), 
        endDate:        extractValue(text, 46, 8),
        serviceStatus:  extractValue(text, 54, 3),
      });
    }
  } catch (readError) {
    console.log(`No proc.txt in ${testDirectory}`);
  }
}

async function readLab(testDirectory, memberInfo) {
  try {
    const fileLines = await readFile(`${testDirectory}/lab.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember.lab === undefined) {
        currentMember.lab = [];
      }
      currentMember.lab.push({
        memberId:         extractValue(text, 1, 16),
        cptCode:          extractValue(text, 17, 5),
        loincCode:        extractValue(text, 22, 7),
        value:            extractValue(text, 29, 6), 
        dateOfService:    extractValue(text, 35, 8),
        supplementalData: extractValue(text, 43, 1),
      });
    }
  } catch (readError) {
    console.log(`No lab.txt in ${testDirectory}`);
  }
}

const createPatientFhirObject = (generalMembership) => {
  const patient = { resourceType: 'Patient'};
  patient.id = `${generalMembership.memberId}-patient`;
  patient.name = [{
    family: generalMembership.memberLastName,
    given: [generalMembership.memberFirstName],
  }];
  patient.telcom = {
    system: 'phone',
    value: generalMembership.phoneNumber,
  }
  let gender = 'unknown';
  if (generalMembership.gender === 'M') {
    gender = 'male';
  } else if (generalMembership.gender === 'F') {
    gender = 'female';
  }
  patient.gender = gender;
  patient.address = [{
    line: [generalMembership.mailingAddressOne, generalMembership.mailingAddressTwo],
    city: generalMembership.city,
    state: generalMembership.state,
    postalCode: generalMembership.zipCode,
  }];

  patient.birthDate = convertDateString(generalMembership.dateOfBirth);

  patient.extension = [
    {
      extension: [
        {
          url: 'ombCategory',
          valueCoding: parseInt(generalMembership.race),
        }
      ],
      url : 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race',
    },
    {
      extension: [
        {
          url: 'ombCategory',
          valueCoding: parseInt(generalMembership.ethnicity),
        }
      ],
      url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity',
    }
  ];
  patient.meta = { extension: [] }
  patient.meta.extension.push({
    url: 'raceDS',
    valueString: generalMembership.raceDataSource,
  });
  patient.meta.extension.push({
    url: 'ethnicityDS',
    valueString: generalMembership.ethnicityDataSource,
  });

  return patient;
}

const createCoverageObjects = (membershipEnrollment) => {
  const coverage = [];
  let count = 1;
  
  membershipEnrollment.forEach((enrollment) => {
    const coverageId = `${enrollment.memberId}-coverage-${count}`;

    const resource = {
      resourceType: "Coverage",
      id: coverageId,
      type: { coding: [] },
      patient: { reference: `Patient/${enrollment.memberId}-patient` },
      payor: [ { reference: enrollment.payor } ],
      period: {
        start: convertDateString(enrollment.startDate),
        end: convertDateString(enrollment.disenrollmentDate),
      }
    };

    if (enrollment.drugBenefit === 'Y') {
      resource.type.coding.push({
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'DRUGPOL',
        display: 'Drug Policy',
      });
    }

    if (enrollment.mhbInpatient === 'Y' || enrollment.mhbIntensive === 'Y' || enrollment.mhbOutpatient === 'Y') {
      resource.type.coding.push({
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'MENTPOL',
        display: 'Mental Health Policy',
      });
    }

    if (enrollment.cdbInpatient === 'Y' || enrollment.cdbIntensive === 'Y' || enrollment.cdbOutpatient === 'Y') {
      resource.type.coding.push({
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'SUBPOL',
        display: 'Substance Abuse Policy',
      });
    }

    if (enrollment.payor === 'HMO' || enrollment.payor === 'PPO' || enrollment.payor === 'POS'
      || enrollment.payor === 'SN1' || enrollment.payor === 'SN2' || enrollment.payor === 'SN3') {
      resource.type.coding.push({
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'MCPOL',
        display: 'Managed Care Policy',
      });
    }

    if (enrollment.payor === 'MCR' || enrollment.payor === 'MCS' || enrollment.payor === 'MP'
      || enrollment.payor === 'MC' || enrollment.payor === 'MMP') {
      resource.type.coding.push({
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'RETIRE',
        display: 'Retiree Health Program',
      });
    }

    if (enrollment.payor === 'MD' || enrollment.payor === 'MDE'
      || enrollment.payor === 'MLI' || enrollment.payor === 'MRB') {
      resource.type.coding.push({
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'SUBSIDIZ',
        display: 'Subsidized Health Program',
      });
    }

    coverage.push({
      fullUrl: `urn:uuid:${coverageId}`,
      resource,
    });

    count += 1;
  });

  return coverage;
}

const createProfessionalClaimObjects = (visitList, visitEncounter, diagnosis) => {
  const encounterClaimList = [];
  var count = 0;
  if (visitList) {
    visitList.forEach((visit) => {
      const serviceCode = createServiceCodeFromVisit(visit);
      const encounterClaim = createClaimFromVisit(visit);
      encounterClaimList.push({
        fullUrl: `urn:uuid:${encounterClaim.id}`,
        resource: encounterClaim
      });

      if (serviceCode) {
        const procedureId = `${visit.memberId}-visit-procedure-${visit.claimId}`;
        const procResource = {
          id: procedureId,
          resourceType: 'Procedure',
          subject: { reference: `Patient/${visit.memberId}-patient`
          },
          performedDateTime: convertDateString(visit.dateOfService),
          status: 'completed',
          code: { coding: [ serviceCode ] }
        }
        encounterClaimList.push({
          fullUrl: `urn:uuid:${procedureId}`,
          resource: procResource
        });
      }

      let conditionCount = 1;
      visit.icdDiagnosis.forEach((diagnosis) => {
        if (diagnosis) {
          const conditionId = `${visit.memberId}-diagnosis-condition-${conditionCount}`;
          const condObj = {
            id: conditionId,
            resourceType: 'Condition',
            clinicalStatus: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                  code: 'active'
                }
              ]
            },
            code: { coding: [ createCode(diagnosis, visit.icdIdentifier) ] },
            onsetDateTime: convertDateString(visit.dateOfService),
          }
          encounterClaimList.push({
            fullUrl: `urn:uuid:${conditionId}`,
            resource: condObj
          });
          conditionCount += 1;
        }
      });

      if (visit.cmsPlaceOfService.startsWith('8')) {
        const obcClaimId = `${visit.memberId}-claim-observation-${visit.claimId}`;
        const obsClaim = {
          id: obcClaimId,
          resourceType: 'Observation',
          code: { coding: [ serviceCode ] },
          effectiveDateTime: convertDateString(visit.dateOfService),
        }
        encounterClaimList.push({
          fullUrl: `urn:uuid:${obcClaimId}`,
          resource: obsClaim
        });
      }

      const encounterId = `${visit.memberId}-claim-encounter-${visit.claimId}`;
      const encounter = {
        resourceType: 'Encounter',
        id: encounterId,
        status: 'finished',
        period: {
          start: convertDateString(visit.dateOfService),
          end: convertDateString(visit.dateOfService),
        }
      };
      if (serviceCode) {
        encounter.type = [ { coding: [ serviceCode ] } ]
      }
      if (visit.cmsPlaceOfService.startsWith('7')) {
        encounter.class = createCode('AMB', 'A');
      }
      encounterClaimList.push({
        fullUrl: `urn:uuid:${encounterId}`,
        resource: encounter
      });
  
      if (visit.claimStatus == 1 && serviceCode) {
        
        const claimResponseId = `${visit.memberId}-prof-claimResponse-${visit.claimId}`;
        const responseResource = {
          resourceType: 'ClaimResponse',
          id: claimResponseId,
          type: professionalClaimType(),
          outcome: 'complete',
          patient: { reference: `Patient/${visit.memberId}-patient` },
          request: {
            reference: `Claim/${encounterClaim.id}`,
          },
          item: [{
            itemSequence: 1,
            servicedDate: convertDateString(visit.dateOfService),
            adjudication: paidAdjudication(),
          }],
          addItem: [
            {
              productOrService: {
                coding: [ serviceCode ]
              },
              servicedDate: convertDateString(visit.dateOfService),
            }
          ],
        }
        encounterClaimList.push({
          fullUrl: `urn:uuid:${claimResponseId}`,
          resource: responseResource,
        });
      }
      count += 1;
    });

  }

  const visitEncounterList = [];
  if (visitEncounter) {
    visitEncounter.forEach((profClaim) => {
      count += 1;
      const claimId = `${profClaim.memberId}-prof-claim-${count}`;
      const resource = {
        resourceType: 'Claim',
        id: claimId,
        type: professionalClaimType(),
        created: convertDateString(profClaim.serviceDate),
        patient: { reference: `Patient/${profClaim.memberId}-patient` },
        provider: { reference: profClaim.providerId },
        procedure: [
          {
            procedureCodeableConcept: {
              coding: [ createCode(profClaim.activityType, profClaim.codeFlag) ],
            },
          }
        ],
        item: [
          {
            sequence: 1,
            servicedDate: convertDateString(profClaim.serviceDate),
            productOrService: {
              coding: [ createCode(profClaim.activityType, profClaim.codeFlag) ]
            }
          }
        ]
      }
      if (profClaim.diagnosisCode !== undefined) {
        resource.diagnosis = [
          {
            diagnosisCodeableConcept: {
              coding: [ 
                createCode(profClaim.diagnosisCode, profClaim.diagnosisFlag)
              ]
            }
          }
        ];
      }
      visitEncounterList.push(resource);
    });
  }

  if (diagnosis) {
    diagnosis.forEach((diag) => {
      for (const evisit of visitEncounterList) {
        if (evisit.created === convertDateString(diag.startDate)) {
          if (evisit.diagnosis === undefined) {
            evisit.diagnosis = [ { diagnosisCodeableConcept: { coding: [] } } ]
          }
          evisit.diagnosis[0].diagnosisCodeableConcept.coding.push(createCode(diag.diagnosisCode, diag.diagnosisFlag));
        }
      }
    });
  }
  

  if (visitEncounterList) {
    visitEncounterList.forEach((fullEncounter) => {
      encounterClaimList.push({
        fullUrl: `urn:uuid:${fullEncounter.id}`,
        resource: fullEncounter,
      });
    });
  }

  return encounterClaimList;
};

const createPharmacyClaims = (pharmacyClinical, pharmacy) => {
  const pharmacyClaimList = [];
  let claimCount = 1
  let claimResponseCount = 1;
  if (pharmacyClinical) {
    pharmacyClinical.forEach((pharmClinic) => {
      const claimId = `${pharmClinic.memberId}-pharm-claim-${claimCount}`;
      const resource = {
        resourceType: 'Claim',
        id: claimId,
        type: professionalClaimType(), // Are clinical pharmacys professional claims or pharmacy claims??
        patient: { reference: `Patient/${pharmClinic.memberId}-patient` },
        diagnosis: [
          {
            sequence: 1,
            diagnosisCodeableConcept: {
              coding: [
                {
                  code: '112690009',
                  system: 'http://snomed.info/sct',
                  version: '2020-09',
                  display: 'Nonacute Inpatient Stay'
                }
              ]
            }
          }
        ],
        item: [{
          sequence: 1,
          servicedPeriod: {
            start: convertDateString(pharmClinic.startDate),
            end: convertDateString(pharmClinic.endDate),
          },
          productOrService: {
            coding: [ createCode(pharmClinic.drugCode, pharmClinic.codeFlag, 'RX') ]
          },
        }],
      }

      if (pharmClinic.quantity) {
        resource.quantity = {
          value: pharmClinic.quantity,
        }
      }
      pharmacyClaimList.push({
        fullUrl: `urn:uuid:${claimId}`,
        resource,
      });
      if (pharmClinic.drugCode.length <= 3) {
        const immunoId = `${pharmClinic.memberId}-immunization-${claimCount}`;
        const immunoResource = {
          id: immunoId,
          resourceType: 'Immunization',
          patient: { reference: `Patient/${pharmClinic.memberId}-patient` },
          status: 'completed',
          vaccineCode: { coding: [ createCode(pharmClinic.drugCode, pharmClinic.codeFlag, 'RX') ] },
          occurrenceDateTime: convertDateString(pharmClinic.dispensedDate),
        }
        pharmacyClaimList.push({
          fullUrl: `urn:uuid:${immunoId}`,
          resource: immunoResource,
        });
      }

      claimCount += 1;
    });
  }

  if (pharmacy) {
    pharmacy.forEach((pharm) => {
      const claimId = `${pharm.memberId}-pharm-claim-${claimCount}`;
      const resource = {
        resourceType: 'Claim',
        id: claimId,
        type: pharmacyClaimType(),
        patient: { reference: `Patient/${pharm.memberId}-patient` },
        item: [{
          sequence: 1,
          servicedDate: convertDateString(pharm.serviceDate),
          productOrService: {
            coding: [
              {
                code: pharm.ndcDrugCode,
              }
            ]
          },
          quantity: {
            value: pharm.daysSupply,
          }
        }],
      }
      pharmacyClaimList.push({
        fullUrl: `urn:uuid:${claimId}`,
        resource,
      });
      claimCount += 1;

      if (pharm.claimStatus == 1) {
        const claimResponseId = `${pharm.memberId}-pharm-claimResponse-${claimResponseCount}`;
        const responseResource = {
          resourceType: 'ClaimResponse',
          id: claimResponseId,
          type: pharmacyClaimType(),
          outcome: 'complete',
          patient: { reference: `Patient/${pharm.memberId}-patient` },
          request: {
            reference: `Claim/${claimId}`,
          },
          item: [{
            itemSequence: 1,
            servicedDate: convertDateString(pharm.serviceDate),
            adjudication: paidAdjudication(),
          }],
          addItem: [
            {
              productOrService: {
                coding: [
                  {
                    code: pharm.ndcDrugCode,
                  }
                ]
              },
              servicedDate: convertDateString(pharm.serviceDate),
            }
          ],
        }
        pharmacyClaimList.push({
          fullUrl: `urn:uuid:${claimResponseId}`,
          resource: responseResource,
        });
        claimResponseCount += 1;
      }
    });
  }

  return pharmacyClaimList;
}

const createObservations = (observations, procedures) => {
  const fhirObsList = [];
  let count = 1;
  
  if (observations) {
    observations.forEach((observation) => {
      const obsCode = createCode(observation.test, observation.testCodeFlag);
      if (observation.value) {
        const observationId = `${observation.memberId}-observation-${count}`;
        const obsResource = {
          resourceType: 'Observation',
          id: observationId,
          subject: { reference: `Patient/${observation.memberId}-patient` },
          code: { coding: [ obsCode ] },
          valueInteger: observation.value,
          effectiveDateTime: convertDateString(observation.observationDate),
        }
        fhirObsList.push({
          fullUrl: `urn:uuid:${observationId}`,
          resource: obsResource,
        });
      } else {
        const encounterId = `${observation.memberId}-encounter-${count}`;
        const encResource = {
          resourceType: 'Encounter',
          id: encounterId,
          patient: { reference: `Patient/${observation.memberId}-patient` },
          period: {
            start: convertDateString(observation.observationDate),
            end: convertDateString(observation.endDate),
          },
          type: [ { coding: [ obsCode ] } ]
        }
    
        fhirObsList.push({
          fullUrl: `urn:uuid:${encounterId}`,
          resource: encResource,
        });
    
        const procedureId = `${observation.memberId}-procedure-${count}`;
        const procResource = {
          resourceType: 'Procedure',
          id: encounterId,
          patient: { reference: `Patient/${observation.memberId}-patient` },
          performedPeriod: {
            start: convertDateString(observation.observationDate),
            end: convertDateString(observation.endDate),
          },
          type: [
            {
              coding: [ obsCode ]
            }
          ]
        }
  
        fhirObsList.push({
          fullUrl: `urn:uuid:${procedureId}`,
          resource: procResource,
        });
      }
      count += 1;
    });
  }

  if (procedures) {
    procedures.forEach((procedure) => {
      const encounterId = `${procedure.memberId}-encounter-${count}`;
      const procCode = createCode(procedure.procedureCode, procedure.codeFlag);
      const encResource = {
        resourceType: 'Encounter',
        id: encounterId,
        patient: { reference: `Patient/${procedure.memberId}-patient` },
        period: {
          start: convertDateString(procedure.serviceDate),
          end: convertDateString(procedure.endDate),
        },
        status: procedure.serviceStatus === 'EVN' ? 'completed' : 'in-progress',
        type: [ { coding: [ procCode ] } ]
      }
      fhirObsList.push({
        fullUrl: `urn:uuid:${encounterId}`,
        resource: encResource,
      });

      const procedureId = `${procedure.memberId}-procedure-${count}`;
      const procResource = {
        resourceType: 'Procedure',
        id: procedureId,
        subject: { reference: `Patient/${procedure.memberId}-patient` },
        performedDateTime: convertDateString(procedure.serviceDate),
        status: procedure.serviceStatus === 'EVN' ? 'completed' : 'in-progress',
        code: { coding: [ procCode ] },
      }
      fhirObsList.push({
        fullUrl: `urn:uuid:${encounterId}`,
        resource: procResource,
      });

      const observationId = `${procedure.memberId}-observation-${count}`;
      const obsResource = {
        resourceType: 'Observation',
        id: observationId,
        subject: { reference: `Patient/${procedure.memberId}-patient` },
        effectiveDateTime: convertDateString(procedure.serviceDate),
        status: procedure.serviceStatus === 'EVN' ? 'completed' : 'in-progress',
        code: { coding: [ procCode ] },
      }
      fhirObsList.push({
        fullUrl: `urn:uuid:${observationId}`,
        resource: obsResource,
      });
      
      count += 1;
    });
  }

  return fhirObsList;
}

const createLabs = (labs) => {
  const fhirLabsList = [];
  let count = 1;
  
  if (labs) {
    labs.forEach((lab) => {
      const observId = `${lab.memberId}-observation-${count}`;
      resource = {
        id: observId,
        resourceType: 'Observation',
        effectiveDateTime: convertDateString(lab.dateOfService),
      };
      if (lab.cptCode || lab.loincCode) {
        resource.code = { coding: [] };
        if (lab.cptCode) {
          resource.code.coding.push(createCode(lab.cptCode, 'C'));
        }
        if (lab.loincCode) {
          resource.code.coding.push(createCode(lab.loincCode, 'L'));
        }
      }
      if (lab.value) {
        console.log(`Handle value for ${lab.memberId}`);
      }
      fhirLabsList.push({
        fullUrl: `urn:uuid:${observId}`,
        resource,
      });
    });
  }

  return fhirLabsList;
}

async function createFhirJson(testDirectory, allMemberInfo) {
  Object.keys(allMemberInfo).forEach(async (memberId) => {
    const memberInfo = allMemberInfo[memberId];
    const fhirObject = {};
    fhirObject.resourceType = 'Bundle';
    fhirObject.type = 'transaction';
    
    const patient = createPatientFhirObject(memberInfo.generalMembership);
  
    fhirObject.entry = [{
      fullUrl: `urn:uuid:${memberId}-patient`,
      resource: patient,
    }];
  
    const coverage = createCoverageObjects(memberInfo.membershipEnrollment);
    coverage.forEach((cov) => fhirObject.entry.push(cov));
  
    const visits = createProfessionalClaimObjects(memberInfo.visit, memberInfo.visitEncounter, memberInfo.diagnosis);
    visits.forEach((visit) => fhirObject.entry.push(visit));
  
    const clincalPharm = createPharmacyClaims(memberInfo.pharmacyClinical, memberInfo.pharmacy);
    clincalPharm.forEach((item) => fhirObject.entry.push(item));
  
    const observations = createObservations(memberInfo.observation, memberInfo.procedure);
    observations.forEach((item) => fhirObject.entry.push(item));
  
    const labs = createLabs(memberInfo.lab, memberInfo.procedure);
    labs.forEach((item) => fhirObject.entry.push(item));

    if (memberId === '95030') {
      try {
        fs.mkdir(`${testDirectory}/fhirJson`, { recursive: true }, (err) => {if (err) throw err;});
        fs.writeFileSync(`${testDirectory}/fhirJson/${memberId}.json`, JSON.stringify([fhirObject], null, 2));
      } catch (writeErr) {
        console.error(`\x1b[31mError:\x1b[0m Unable to write to directory:${writeErr}.`);
        process.exit();
      }
    }
  });
}

const processTestDeck = async (testDirectory) => {
  const allMemberInfo = await initMembers(testDirectory);
  await readMembershipEnrollment(testDirectory, allMemberInfo);
  await readVisit(testDirectory, allMemberInfo);
  await readVisitEncounter(testDirectory, allMemberInfo);
  await readPharmacy(testDirectory, allMemberInfo);
  await readPharmacyClinical(testDirectory, allMemberInfo);
  await readDiagnosis(testDirectory, allMemberInfo);
  await readObservation(testDirectory, allMemberInfo);
  await readProcedure(testDirectory, allMemberInfo);
  await readLab(testDirectory, allMemberInfo);

  // console.log(JSON.stringify(allMemberInfo['96002'], null, 2));
  await createFhirJson(testDirectory, allMemberInfo);
};

processTestDeck(parseArgs['testDirectory']);