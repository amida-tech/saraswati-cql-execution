const parseArgs = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const readline = require('readline');
const path = require('path');

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
    case 'L':
      return 'L unknown';
    case 'D':
      return 'D unknown';
    default:
      return 'NA';
  }
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
}

async function readPharmacy(testDirectory, memberInfo) {
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
}

async function readPharmacyClinical(testDirectory, memberInfo) {
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
}

async function readDiagnosis(testDirectory, memberInfo) {
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

const convertDateString = (ncqaDateString) => {
  const year = ncqaDateString.toString().substr(0, 4);
  const month = ncqaDateString.toString().substr(4, 2);
  const day = ncqaDateString.toString().substr(6, 2);

  return `${year}-${month}-${day}`;
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

    if (!enrollment.payor.startsWith('SN')) {
      resource.type.coding.push({
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'MCPOL',
        display: 'Managed Care Policy',
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

const createProfessionalClaimObjects = (visit, visitEncounter, diagnosis) => {
  const visitList = [];
  var count = 0;
  if (visit) {
    visit.forEach((profClaim) => {
      const claimId = `${profClaim.memberId}-prof-claim-${profClaim.claimId}`;
      const resource = {
        resourceType: 'Claim',
        id: claimId,
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/claim-type',
              code: 'professional',
            }
          ]
        },
        patient: { reference: `Patient/${profClaim.memberId}-patient` },
        provider: { reference: profClaim.providerId },
      }
  
      let procCount = 1;
      if (profClaim.cpt) {
        resource.procedure = [{
          procedureCodeableConcept: {
            coding: [{
              system: 'http://www.ama-assn.org/go/cpt',
              code: profClaim.cpt,
            }],
          },
        }];
        resource.item = [{
          sequence: procCount,
          servicedDate: convertDateString(profClaim.dateOfService),
          productOrService: {
            coding: [
              {
                code: profClaim.cpt,
              }
            ]
          }
        }];
        procCount += 1;
      }
  
      if (profClaim.hcpcs) {
        if (resource.procedure === undefined) {
          resource.procedure = [];
          resource.item = [];
        }
        resource.procedure.push({
          procedureCodeableConcept: {
            coding: [{
              system: 'https://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets',
              code: profClaim.hcpcs,
            }],
          },
        });
        resource.item.push({
          sequence: procCount,
          servicedDate: convertDateString(profClaim.dateOfService),
          productOrService: {
            coding: [
              {
                code: profClaim.hcpcs,
              }
            ]
          }
        });
      }
  
      profClaim.icdDiagnosis.forEach((diagnosis) => {
        if (diagnosis) {
          if (resource.diagnosis === undefined) {
            resource.diagnosis = [ { diagnosisCodeableConcept: { coding: [] } } ];
          }
          resource.diagnosis[0].diagnosisCodeableConcept.coding.push({
            code: diagnosis,
          });
        }
      });
      
      if (count < profClaim.claimId) {
        count = profClaim.claimId;
      }
  
      visitList.push({
        fullUrl: `urn:uuid:${claimId}`,
        resource,
      });
  
      if (profClaim.claimStatus == 1 && profClaim.cpt) {
        const claimResponseId = `${profClaim.memberId}-prof-claimResponse-${profClaim.claimId}`;
        const responseResource = {
          resourceType: 'ClaimResponse',
          id: claimResponseId,
          type: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/claim-type',
                code: 'professional',
              }
            ]
          },
          outcome: 'complete',
          patient: { reference: `Patient/${profClaim.memberId}-patient` },
          request: {
            reference: `Claim/${claimId}`,
          },
          item: [{
            itemSequence: 1,
            servicedDate: convertDateString(profClaim.dateOfService),
            adjudication: [
              {
                category: {
                  coding: [
                    {
                      code: 'benefit'
                    }
                  ]
                },
                amount: {
                  value: 108.45,
                }
              }
            ]
          }],
          addItem: [
            {
              productOrService: {
                coding: [
                  {
                    code: profClaim.cpt,
                  }
                ]
              },
              servicedDate: convertDateString(profClaim.dateOfService),
            }
          ],
        }
        visitList.push({
          fullUrl: `urn:uuid:${claimResponseId}`,
          resource: responseResource,
        });
      }
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
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/claim-type',
              code: 'professional',
            }
          ]
        },
        created: convertDateString(profClaim.serviceDate),
        patient: { reference: `Patient/${profClaim.memberId}-patient` },
        provider: { reference: profClaim.providerId },
        procedure: [
          {
            procedureCodeableConcept: {
              coding: [{
                system: getSystem(profClaim.codeFlag),
                code: profClaim.activityType,
              }],
            },
          }
        ],
        item: [
          {
            sequence: 1,
            servicedDate: convertDateString(profClaim.serviceDate),
            productOrService: {
              coding: [
                {
                  system: getSystem(profClaim.codeFlag),
                  code: profClaim.activityType,
                }
              ]
            }
          }
        ]
      }
      visitEncounterList.push(resource);
    });
  }

  if (diagnosis) {
    diagnosis.forEach((diag) => {
      for (const evisit of visitEncounterList) {
        if (evisit.created === convertDateString(diag.startDate)) {
          evisit.diagnosis = [
            {
              diagnosisCodeableConcept: {
                coding: [
                  {
                    system: getSystem(diag.diagnosisFlag),
                    code: diag.diagnosisCode,
                  }
                ]
              }
            }
          ];
        }
      }
    });
  }
  

  if (visitEncounterList) {
    visitEncounterList.forEach((fullEncounter) => {
      visitList.push({
        fullUrl: `urn:uuid:${fullEncounter.id}`,
        resource: fullEncounter,
      });
    });
  }

  return visitList;
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
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/claim-type',
              code: 'pharmacy',
            }
          ]
        },
        patient: { reference: `Patient/${pharmClinic.memberId}-patient` },
        diagnosis: [
          {
            sequence: 1,
            diagnosisCodeableConcept: {
              coding: [
                {
                  code: 112690009,
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
            coding: [
              {
                code: pharmClinic.drugCode,
              }
            ]
          },
        }],
      }
      pharmacyClaimList.push({
        fullUrl: `urn:uuid:${claimId}`,
        resource,
      });
      claimCount += 1;
    });
  }

  if (pharmacy) {
    pharmacy.forEach((pharm) => {
      const claimId = `${pharm.memberId}-pharm-claim-${claimCount}`;
      const resource = {
        resourceType: 'Claim',
        id: claimId,
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/claim-type',
              code: 'pharmacy',
            }
          ]
        },
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
          type: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/claim-type',
                code: 'pharmacy',
              }
            ]
          },
          outcome: 'complete',
          patient: { reference: `Patient/${pharm.memberId}-patient` },
          request: {
            reference: `Claim/${claimId}`,
          },
          item: [{
            itemSequence: 1,
            servicedDate: convertDateString(pharm.serviceDate),
            adjudication: [
              {
                category: {
                  coding: [
                    {
                      code: 'benefit'
                    }
                  ]
                },
                amount: {
                  value: 108.45,
                }
              }
            ]
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

const createObservations = (observations) => {
  const fhirObsList = [];
  let count = 1;
  
  if (observations) {
    observations.forEach((observation) => {
      const encounterId = `${observation.memberId}-encounter-${count}`;
      const encResource = {
        resourceType: 'Encounter',
        id: encounterId,
        period: {
          start: convertDateString(observation.observationDate),
          end: convertDateString(observation.endDate),
        },
        type: [
          {
            coding: [
              {
                system: getSystem(observation.testCodeFlag),
                code: observation.test,
              }
            ]
          }
        ]
      }
  
      fhirObsList.push({
        fullUrl: `urn:uuid:${encounterId}`,
        resource: encResource,
      });
  
  
      const procedureId = `${observation.memberId}-procedure-${count}`;
      const procResource = {
        resourceType: 'Procedure',
        id: encounterId,
        performedPeriod: {
          start: convertDateString(observation.observationDate),
          end: convertDateString(observation.endDate),
        },
        type: [
          {
            coding: [
              {
                system: getSystem(observation.testCodeFlag),
                code: observation.test,
              }
            ]
          }
        ]
      }
  
      fhirObsList.push({
        fullUrl: `urn:uuid:${procedureId}`,
        resource: procResource,
      });
    });
  }

  return fhirObsList;
}

const createFhirJson = (testDirectory, allMemberInfo) => {
  Object.keys(allMemberInfo).forEach((memberId) => {
    const memberInfo = allMemberInfo[memberId];
    const fhirObject = {};
    fhirObject.resourceType = 'Bundle';
    fhirObject.type = 'transaction';
    
    const patient = createPatientFhirObject(memberInfo.generalMembership);
  
    fhirObject.entry = [{
      fullUrl: `urn:uuid:${memberInfo.generalMembership.memberId}-patient`,
      resource: patient,
    }];
  
    const coverage = createCoverageObjects(memberInfo.membershipEnrollment);
    coverage.forEach((cov) => fhirObject.entry.push(cov));
  
    const visits = createProfessionalClaimObjects(memberInfo.visit, memberInfo.visitEncounter, memberInfo.diagnosis);
    visits.forEach((visit) => fhirObject.entry.push(visit));
  
    const clincalPharm = createPharmacyClaims(memberInfo.pharmacyClinical, memberInfo.pharmacy);
    clincalPharm.forEach((item) => fhirObject.entry.push(item));
  
    const observations = createObservations(memberInfo.observation);
    observations.forEach((item) => fhirObject.entry.push(item));
    try {
      fs.mkdir(`/${testDirectory}/fhirJson`, { recursive: true }, (err) => {if (err) throw err;});
      fs.writeFileSync(`/${testDirectory}/fhirJson/${memberId}.json`, JSON.stringify([fhirObject], null, 2));
    } catch (writeErr) {
      console.error(`\x1b[31mError:\x1b[0m Unable to write to directory:${writeErr}.`);
      process.exit();
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

  console.log(JSON.stringify(allMemberInfo['96002'], null, 2));
  createFhirJson(testDirectory, allMemberInfo);
};

processTestDeck(parseArgs['testDirectory']);