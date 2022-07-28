const minimist = require('minimist');
const fs = require('fs');
const readline = require('readline');
const { createCode, professionalClaimType, pharmacyClaimType, convertDateString,
  createClaimFromVisit, createServiceCodeFromVisit, createClaimEncounter,createDiagnosisCondition,
  createClaimResponse, createPharmacyClaim, isDateDuringPeriod,
  createPractitionerLocation, isValidEncounter } = require('./ncqa-test-converter-util');

const parseArgs = minimist(process.argv.slice(2), {
  alias: {
    t: 'testDirectory',
    m: 'memberId',
  },
});

function checkArgs() {
  if(parseArgs.t === undefined) {
    console.error('\x1b[31m', 
      '\nError: Please define a directory path to read. Usage: "--testDirectory=<directory>".',
      '\x1b[0m');
    process.exit();
  }

  if (parseArgs.m) {
    return parseArgs.m.toString().split(',');
  }
  return undefined;
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

async function initMembers(testDirectory, memberIds) {
  const memberObject = {};
  const fileLines = await readFile(`${testDirectory}/member-gm.txt`);
  for await (const text of fileLines) {
    const memberId = extractValue(text, 1, 16);
    if (memberIds !== undefined && memberIds.find((id) => id !== memberId)) {
      continue;
    }
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
    if (!currentMember) {
      continue;
    }
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
  if (!fs.existsSync(`${testDirectory}/visit-e.txt`)) {
    console.log(`No visit-e.txt in ${testDirectory}`);
    return;
  }

  try {
    const fileLines = await readFile(`${testDirectory}/visit-e.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember === undefined) {
        continue;
      }
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
    console.log(`Error reading visit-e.txt.`);
  }
}

async function readPharmacy(testDirectory, memberInfo) {
  if (!fs.existsSync(`${testDirectory}/pharm.txt`)) {
    console.log(`No pharm.txt in ${testDirectory}`);
    return;
  }

  try {
    const fileLines = await readFile(`${testDirectory}/pharm.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember === undefined) {
        continue;
      }
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
    console.log(`Error reading pharm.txt`);
  }
}

async function readPharmacyClinical(testDirectory, memberInfo) {
  if (!fs.existsSync(`${testDirectory}/pharm-c.txt`)) {
    console.log(`No pharm-c.txt in ${testDirectory}`);
    return;
  }

  try {
    const fileLines = await readFile(`${testDirectory}/pharm-c.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember === undefined) {
        continue;
      }
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
    console.log(`Error reading pharm-c.txt`);
  }
}

async function readDiagnosis(testDirectory, memberInfo) {
  if (!fs.existsSync(`${testDirectory}/diag.txt`)) {
    console.log(`No diag.txt in ${testDirectory}`);
    return
  }

  try {
    const fileLines = await readFile(`${testDirectory}/diag.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember === undefined) {
        continue;
      }
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
    console.log(`Error reading diag.txt`);
  }
}

async function readObservation(testDirectory, memberInfo) {
  const fileLines = await readFile(`${testDirectory}/obs.txt`);
  for await (const text of fileLines) {
    const memberId = extractValue(text, 1, 16);
    const currentMember = memberInfo[memberId];
    if (currentMember === undefined) {
      continue;
    }
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
  if (!fs.existsSync(`${testDirectory}/proc.txt`)) {
    console.log(`No proc.txt in ${testDirectory}`);
    return;
  }

  try {
    const fileLines = await readFile(`${testDirectory}/proc.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember === undefined) {
        continue;
      }
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
    console.log(`Error reading proc.txt in ${testDirectory}`);
  }
}

async function readLab(testDirectory, memberInfo) {
  if (!fs.existsSync(`${testDirectory}/lab.txt`)) {
    console.log(`No lab.txt in ${testDirectory}`);
    return
  }

  try {
    const fileLines = await readFile(`${testDirectory}/lab.txt`);
    for await (const text of fileLines) {
      const memberId = extractValue(text, 1, 16);
      const currentMember = memberInfo[memberId];
      if (currentMember === undefined) {
        continue;
      }
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
    console.log(readError);
    console.log(`Error reading lab.txt in ${testDirectory}`);
  }
}

async function readMmdf(testDirectory, memberInfo) {
  let count = 0;
  while (true) {
    count += 1;
    const fileName = `${testDirectory}/mmdf${count}.txt`;
    if (!fs.existsSync(fileName)) {
      break;
    }
    try {
      const fileLines = await readFile(fileName);
      for await (const text of fileLines) {
        const memberId = extractValue(text, 20, 12);
        const currentMember = memberInfo[memberId];
        if (currentMember === undefined) {
          continue;
        }
        if (currentMember.mmdf === undefined) {
          currentMember.mmdf = [];
        }
        currentMember.mmdf.push({
          contractNumber:   extractValue(text, 1, 5),
          runDate:          extractValue(text, 6, 8),
          paymentDate:      extractValue(text, 14, 6),
          beneficiaryId:    extractValue(text, 20, 12), 
          hospice:          extractValue(text, 61, 1),
          orec:             extractValue(text, 192, 1),
        });
      }
    } catch (readError) {
      console.log(`Error reading ${fileName} in ${testDirectory}`);
    }
  }
}

const createPatientFhirObject = (generalMembership) => {
  const patient = { resourceType: 'Patient'};
  patient.id = `${generalMembership.memberId}-patient`;
  patient.name = [{
    family: generalMembership.memberLastName,
    given: [generalMembership.memberFirstName],
  }];
  patient.telecom = [{
    system: 'phone',
    value: generalMembership.phoneNumber,
  }];
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
      || enrollment.payor === 'SN1' || enrollment.payor === 'SN2' || enrollment.payor === 'SN3'
      || enrollment.payor === 'CEP' || enrollment.payor === 'MOS' || enrollment.payor === 'MPO'
      || enrollment.payor === 'MEP' || enrollment.payor === 'MMP' || enrollment.payor === 'MCR'
      ||  enrollment.payor === 'MC' || enrollment.payor === 'MP' || enrollment.payor === 'MCS') {
      resource.type.coding.push({
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'MCPOL',
        display: 'Managed Care Policy',
      });
    }

    /*if (enrollment.payor === 'MCS') {
      resource.type.coding.push({
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'RETIRE',
        display: 'Retiree Health Program',
      });
    }*/

    if (enrollment.payor === 'MD' || enrollment.payor === 'MDE' || enrollment.payor === 'MMO'
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

const createConditionList = (visitEList, diagnosisList) => {
  const fullConditionList = [];
  const visitConditionList = [];
  let conditionCount = 1;

  if (visitEList) {
    visitEList.forEach((visitEncounter) => {
      if (visitEncounter.diagnosisCode) {
        const condObj = createDiagnosisCondition(
          {
            memberId: visitEncounter.memberId,
            conditionId: `${visitEncounter.memberId}-diagnosis-condition-${conditionCount}`,
            code: visitEncounter.diagnosisCode,
            system: visitEncounter.diagnosisFlag,
            onsetDateTime: visitEncounter.serviceDate,
          }
        );
        fullConditionList.push(condObj);
        conditionCount += 1;
      }
    });
  }
    
  if (diagnosisList) {
    diagnosisList.forEach((diagnosis) => {
      const condition = createDiagnosisCondition(
        {
          memberId: diagnosis.memberId,
          conditionId: `${diagnosis.memberId}-condition-${conditionCount}`,
          code: diagnosis.diagnosisCode,
          system: diagnosis.diagnosisFlag,
          onsetStart: diagnosis.startDate,
          onsetEnd: diagnosis.endDate,
        }
      );
      fullConditionList.push(condition);
      conditionCount += 1;
    });
  }

  return { visitConditionList, fullConditionList };
}

const createClaimEncResponse = (visitEList, observationList, procedureList) => {
  const claims = [];
  const encounters = [];
  const visitEncounters = [];
  const claimResponses = [];

  if (visitEList) {
    visitEList.forEach((visitEncounter, index) => {
      const serviceCode = createCode(visitEncounter.activityType, visitEncounter.codeFlag);
      const encounterId = `${visitEncounter.memberId}-visit-e-encounter-${index + 1}`;
      const encounter = createClaimEncounter(
        {
          memberId: visitEncounter.memberId,
          encounterId,
          period: {
            start: visitEncounter.serviceDate,
            end: visitEncounter.endDate,
          },
          serviceCode,
          serviceProvider: visitEncounter.providerId,
        }
      );
      encounters.push(encounter);
    });
  }

  if (observationList) {
    observationList.forEach((observation, index) => {
      if (observation.value === undefined || observation.value === '') {
        const obsCode = createCode(observation.test, observation.testCodeFlag);
        let matchFound = false;
        for (const enc of encounters) {
          if (convertDateString(observation.observationDate) === enc.period.start
            && convertDateString(observation.endDate) === enc.period.end) {
              enc.status = 'finished';
              if (enc.type) {
                enc.type.push({ coding: [ obsCode ] });
              } else {
                enc.type = [ { coding: [ obsCode ] } ];
              }
              matchFound = true;
              break;
            }
        }
        if (!matchFound) {
          const encResource = {
            resourceType: 'Encounter',
            id: `${observation.memberId}-observation-encounter-${index + 1}`,
            patient: { reference: `Patient/${observation.memberId}-patient` },
            period: {
              start: convertDateString(observation.observationDate),
              end: convertDateString(observation.endDate),
            },
            status: 'finished',
            type: [ { coding: [ obsCode ] } ]
          }
          encounters.push(encResource);
        }
      }
    });
  }

  if (procedureList) {
    procedureList.forEach((procedure, index) => {
      const procCode = createCode(procedure.procedureCode, procedure.codeFlag);
      let matchFound = false;
      for (const enc of encounters) {
        if (convertDateString(procedure.serviceDate) === enc.period.start
          && convertDateString(procedure.endDate) === enc.period.end) {
            enc.status = procedure.serviceStatus === 'EVN' ? 'finished' : 'in-progress';
            if (enc.type) {
              enc.type.push({ coding: [ procCode ] });
            } else {
              enc.type = [ { coding: [ procCode ] } ];
            }
            matchFound = true;
            break;
          }
      }
      if (!matchFound) {
        const encResource = {
          esourceType: 'Encounter',
          id: `${procedure.memberId}-procedure-encounter-${index + 1}`,
          patient: { reference: `Patient/${procedure.memberId}-patient` },
          status: procedure.serviceStatus === 'EVN' ? 'finished' : 'in-progress',
          type: [ { coding: [ procCode ] } ]
        }

        if (procedure.endDate !== '') {
          encResource.period = {
            start: convertDateString(procedure.serviceDate),
            end: convertDateString(procedure.endDate),
          }
        } else {
          encResource.period = {
            start: convertDateString(procedure.serviceDate),
            end: '2022-12-31',
          }
        }
        encounters.push(encResource);
      }
    });
  }

  return { claims, encounters, visitEncounters, claimResponses };
}

const createVisitClaimEncResponse = (visitList) => {
  if (visitList === undefined || visitList.length === 0) {
    return {};
  }

  const claimResponses = [];
  const visitEncounters = [];
  const claims = [];
  const visitConditionList = [];
  for (const visit of visitList) {
    if (!isValidEncounter(visit)) {
      continue;
    }
    const serviceCode = createServiceCodeFromVisit(visit);
    const encounterId = `${visit.memberId}-visit-encounter-${visit.claimId}`;
    let foundVisitMatch = false;
    for (const visitE of visitEncounters) {
      if (encounterId === visitE.id) {
        if (serviceCode) {
          if (visitE.type) {
            visitE.type.push({ coding: [ serviceCode ] });
          } else {
            visitE.type = [ { coding: [ serviceCode ] } ];
          }
        }
        if (visit.ubRevenue) {
          if (visitE.type) {
            visitE.type.push({ coding: [ createCode(visitE.ubRevenue, 'R') ] });
          } else {
            visitE.type = [ { coding: [ createCode(visitE.ubRevenue, 'R') ] } ];
          }
        }
        foundVisitMatch = true;
        break;
      }
    }
    if (!foundVisitMatch) {
      const encounter = createClaimEncounter(
        {
          memberId: visit.memberId,
          encounterId,
          period: {
            start: visit.dateOfService,
            end: visit.dischargeDate ? visit.dischargeDate : visit.dateOfService,
          },
          serviceCode,
          cmsPlaceOfService: visit.cmsPlaceOfService,
          ubRevenue: visit.ubRevenue,
          serviceProvider: visit.providerId,
          cptModOne: visit.cptModOne,
          procedureList: visit.icdProcedure,
          icdIdentifier: visit.icdIdentifier,
        }
      );
      let conditionCount = 1;
      visit.icdDiagnosis.forEach((visitDiagnosis, index) => {
        if (visitDiagnosis && visit.cmsPlaceOfService !== '81') {
          const condObj = createDiagnosisCondition(
            {
              memberId: visit.memberId,
              conditionId: `${visit.memberId}-visit-condition-${visit.claimId}-${conditionCount}`,
              code: visitDiagnosis,
              system: visit.icdIdentifier,
              onsetDateTime: visit.dateOfService,
              recorder: visit.providerId,
            }
          );

          if (encounter.diagnosis === undefined) {
            encounter.diagnosis = [ ]
          }
          encounter.diagnosis.push(
            { 
              condition: { reference: condObj.id },
              rank: index + 1,
            }
          );
          visitConditionList.push(condObj);
          conditionCount += 1;
        }
      });
      visitEncounters.push(encounter);
    }
      
    if (visit.supplementalData === 'N') {
      let foundClaimMatch = false;
      const claimId = `${visit.memberId}-visit-claim-${visit.claimId}`;
      for (const claim of claims) {
        if (claim.id === claimId) {
          if (visit.ubRevenue) {
            if (claim.procedure) {
              claim.procedure.push({
                procedureCodeableConcept: {
                  coding: [ createCode(visit.ubRevenue, 'R') ],
                },
              });
            } else {
              claim.procedure = [{
                procedureCodeableConcept: {
                  coding: [ createCode(visit.ubRevenue, 'R') ],
                },
              }];
            }
          }
          foundClaimMatch = true;
          break;
        }
      }
      if (!foundClaimMatch) {
        const visitClaim = createClaimFromVisit(visit);
        visit.encounter = [ { reference: `Encounter/${encounterId.id}` } ];
        claims.push(visitClaim);

        if (visit.claimStatus == 1 && serviceCode) {
          const responseResource = createClaimResponse(
            {
              idName: 'visit-claimResponse',
              claimType: professionalClaimType(),
              memberId: visit.memberId,
              claimId: visit.claimId,
              fullClaimId: visitClaim.id,
              serviceDate: visit.dateOfService,
              serviceCode: serviceCode,
            }
          );
          claimResponses.push(responseResource);
        }
      }
    }  
  }

  return { visitEncounters, visitConditionList, claims, claimResponses }
}

const linkConditionsToEncounters = (conditions, encounters) => {
  if (conditions && encounters) {
    conditions.forEach((condition) => {
      let onsetPeriod = undefined;
      if (condition.onsetDateTime) {
        onsetPeriod = { start: condition.onsetDateTime };
      } else {
        onsetPeriod = condition.onsetPeriod;
      }
      encounters.forEach((encounter) => {
        if (onsetPeriod && isDateDuringPeriod(encounter.period.start, onsetPeriod)) {
          if (encounter.diagnosis === undefined) {
            encounter.diagnosis = [ ]
          }
          encounter.diagnosis.push(
            { 
              condition: { reference: condition.id },
              rank: encounter.diagnosis.length + 1,
            }
          );
        }
      });
    });
  }
}

const createProcedureList = (visits, observations, procedures, diagnosisList) => {
  const procedureList = [];
  if (visits) {
    for (let index = 0; index < visits.length; index += 1) {
      const visit = visits[index];
      if (!isValidEncounter(visit)) {
        continue;
      }
      const serviceCode = createServiceCodeFromVisit(visit);
      if (serviceCode) {
        const procResource = {
          id: `${visit.memberId}-visit-procedure-${visit.claimId}-${index + 1}`,
          resourceType: 'Procedure',
          subject: { reference: `Patient/${visit.memberId}-patient`},
          performedDateTime: convertDateString(visit.dateOfService),
          performer: [ { actor: { reference: visit.providerId, } } ],
          status: 'completed',
          code: { coding: [ serviceCode ] }
        }
        procedureList.push(procResource);
      }

      if (visit.icdProcedure) {
        visit.icdProcedure.forEach((procedure) => {
          if (procedure !== '') {
            const procCode = createCode(procedure, visit.icdIdentifier);
            const procResource = {
              id: `${visit.memberId}-visit-list-procedure-${visit.claimId}-${index + 1}`,
              resourceType: 'Procedure',
              subject: { reference: `Patient/${visit.memberId}-patient`},
              performedDateTime: convertDateString(visit.dateOfService),
              performer: [ { actor: { reference: visit.providerId, } } ],
              status: 'completed',
              code: { coding: [ procCode ] }
            }
            procedureList.push(procResource);

            const immunoId = `${visit.memberId}-icd-immunization-${visit.claimId}-${index + 1}`;
            const immunoResource = {
              id: immunoId,
              resourceType: 'Immunization',
              patient: { reference: `Patient/${visit.memberId}-patient` },
              status: 'completed',
              vaccineCode: { coding: [ procCode ] },
              occurrenceDateTime: convertDateString(visit.dateOfService),
            }
            procedureList.push(immunoResource);
          }
        });
      }
    }
  }

  if (observations) {
    observations.forEach((observation, index) => {
      const obsCode = createCode(observation.test, observation.testCodeFlag);
      const procResource = {
        resourceType: 'Procedure',
        id: `${observation.memberId}-observation-procedure-${index + 1}`,
        patient: { reference: `Patient/${observation.memberId}-patient` },
        performedPeriod: {
          start: convertDateString(observation.observationDate),
          end: convertDateString(observation.endDate),
        },
        status: 'completed',
        code: { coding: [ obsCode ] },
      }
      procedureList.push(procResource);
    });
  }

  if (procedures) {
    procedures.forEach((procedure, index) => {
      const procCode = createCode(procedure.procedureCode, procedure.codeFlag);
      const procResource = {
        resourceType: 'Procedure',
        id: `${procedure.memberId}-procedure-${index + 1}`,
        subject: { reference: `Patient/${procedure.memberId}-patient` },
        status: procedure.serviceStatus === 'EVN' ? 'completed' : 'in-progress',
        code: { coding: [ procCode ] },
      }
      if (procedure.endDate !== '') {
        procResource.performedPeriod = {
          start: convertDateString(procedure.serviceDate),
          end: convertDateString(procedure.endDate),
        }
      } else {
        procResource.performedPeriod = {
          start: convertDateString(procedure.serviceDate),
          end: convertDateString('2022-12-31'),
        }
      }
      procedureList.push(procResource);
    });
  }

  if (diagnosisList) {
    diagnosisList.forEach((diagnosis, index) => {
      const procCode = createCode(diagnosis.diagnosisCode, diagnosis.diagnosisFlag);
      const procResource = {
        resourceType: 'Procedure',
        id: `${diagnosis.memberId}-diag-procedure-${index + 1}`,
        subject: { reference: `Patient/${diagnosis.memberId}-patient` },
        status: 'completed',
        code: { coding: [ procCode ] },
      }
      if (diagnosis.endDate !== '') {
        procResource.performedPeriod = {
          start: convertDateString(diagnosis.startDate),
          end: convertDateString(diagnosis.endDate),
        }
      } else {
        procResource.performedPeriod = {
          start: convertDateString(diagnosis.startDate),
          end: convertDateString('2022-12-31'),
        }
      }
      procedureList.push(procResource);
    });
  }

  return procedureList;
}

const createObservationList = (visits, visitEList, observations, procedures, labs) => {
  const observationList = [];
  if (visits) {
    visits.forEach((visit, index) => {
      const serviceCode = createServiceCodeFromVisit(visit);
      if (serviceCode && isValidEncounter(visit)) {
        const obsClaim = {
          id: `${visit.memberId}-visit-observation-${visit.claimId}-${index+1}`,
          resourceType: 'Observation',
          code: { coding: [ serviceCode ] },
          performer: [ { reference: visit.providerId } ]
        }
        if (visit.dateOfService) {
          obsClaim.effectivePeriod = {
            start: convertDateString(visit.dateOfService),
            end: convertDateString(visit.dateOfService),
          }
        }
        observationList.push(obsClaim);
      }
    });
  }

  if (visitEList) {
    visitEList.forEach((visitEncounter, index) => {
      const serviceCode = createCode(visitEncounter.activityType, visitEncounter.codeFlag);
      if (serviceCode) {
        const obsClaim = {
          id: `${visitEncounter.memberId}-visit-e-observation-${index+1}`,
          resourceType: 'Observation',
          code: { coding: [ serviceCode ] },
          effectivePeriod: {
            start: convertDateString(visitEncounter.serviceDate),
            end: convertDateString(visitEncounter.endDate),
          },
          performer: [ { reference: visitEncounter.providerId } ]
        }
        observationList.push(obsClaim);
      }
    });
  }

  if (observations) {
    observations.forEach((observation, index) => {
      const obsCode = createCode(observation.test, observation.testCodeFlag);
      const obsResource = {
        resourceType: 'Observation',
        id: `${observation.memberId}-observation-${index + 1}`,
        subject: { reference: `Patient/${observation.memberId}-patient` },
        code: { coding: [ obsCode ] },
      }
      if (observation.value) {
        obsResource.valueInteger = parseInt(observation.value);
      }
      if (observation.endDate) {
        obsResource.effectivePeriod = {
          start: convertDateString(observation.observationDate),
          end: convertDateString(observation.endDate),
        };
      } else {
        obsResource.effectivePeriod = {
          start: convertDateString(observation.observationDate),
          end: convertDateString(observation.observationDate),
        };
      }
      observationList.push(obsResource);        
    });
  }

  if (procedures) {
    procedures.forEach((procedure, index) => {
      const procCode = createCode(procedure.procedureCode, procedure.codeFlag);
      const obsResource = {
        resourceType: 'Observation',
        id: `${procedure.memberId}-procedure-observation-${index + 1}`,
        subject: { reference: `Patient/${procedure.memberId}-patient` },
        effectivePeriod: {
          start: convertDateString(procedure.serviceDate),
          end: convertDateString(procedure.serviceDate),
        },
        status: procedure.serviceStatus === 'EVN' ? 'completed' : 'in-progress',
        code: { coding: [ procCode ] },
      }
      observationList.push(obsResource);
    });
  }

  if (labs) {
    labs.forEach((lab, index) => {
      const resource = {
        id: `${lab.memberId}-lab-observation-${index + 1}`,
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
        // console.log(`Handle value for ${lab.memberId}`);
      }
      observationList.push(resource);
    });
  }

  return observationList;
}

const createPharmacyClaims = (pharmacyClinical, pharmacy) => {
  const pharmacyClaimList = [];
  let claimCount = 1
  let claimResponseCount = 1;
  if (pharmacyClinical) {
    pharmacyClinical.forEach((pharmClinic) => {
      const medicationCode = createCode(pharmClinic.drugCode, pharmClinic.codeFlag, 'RX');
      const resource = createPharmacyClaim({
        claimId: `${pharmClinic.memberId}-pharm-claim-${claimCount}`,
        claimType: professionalClaimType(),
        memberId: pharmClinic.memberId,
        startDate: pharmClinic.startDate,
        endDate: pharmClinic.endDate,
        serviceCode: medicationCode,
        diagnosisCode: {
          code: '112690009',
          system: 'http://snomed.info/sct',
          version: '2020-09',
          display: 'Nonacute Inpatient Stay'
        },
        quantity: pharmClinic.quantity,
      });
      
      pharmacyClaimList.push({
        fullUrl: `urn:uuid:${resource.id}`,
        resource,
      });

      if (pharmClinic.drugCode.length <= 3) {
        const immunoId = `${pharmClinic.memberId}-immunization-${claimCount}`;
        const immunoResource = {
          id: immunoId,
          resourceType: 'Immunization',
          patient: { reference: `Patient/${pharmClinic.memberId}-patient` },
          status: 'completed',
          vaccineCode: { coding: [ medicationCode ] },
          occurrenceDateTime: convertDateString(pharmClinic.dispensedDate),
        }
        pharmacyClaimList.push({
          fullUrl: `urn:uuid:${immunoId}`,
          resource: immunoResource,
        });
      }

      if (pharmClinic.dispensedDate) {
        const medDispenseResource = {
          id: `${pharmClinic.memberId}-medicationDispense-${claimCount}`,
          resourceType: 'MedicationDispense',
          patient: { reference: `Patient/${pharmClinic.memberId}-patient` },
          status: 'completed',
          medicationCodeableConcept: { coding: [ medicationCode ] },
          whenHandedOver: convertDateString(pharmClinic.dispensedDate),
        }

        pharmacyClaimList.push({
          fullUrl: `urn:uuid:${medDispenseResource.id}`,
          resource: medDispenseResource,
        });
      }
      

      claimCount += 1;
    });
  }

  if (pharmacy) {
    const providerNpiHolder = {};
    const pharmacyNpiHolder = {};
    pharmacy //pharm.txt is only a claim when NOT supplemental data
      .filter((item) => item.supplementalData !== 'Y')
      .forEach((pharm) => {
        const resource = createPharmacyClaim({
          claimId: `${pharm.memberId}-pharm-claim-${claimCount}`,
          claimType: pharmacyClaimType(),
          memberId: pharm.memberId,
          serviceDate: pharm.serviceDate,
          serviceCode: { code: pharm.ndcDrugCode },
          quantity: pharm.daysSupply,
        });

        if (pharm.providerNpi) {
          if (!providerNpiHolder[pharm.providerNpi]) {
            providerNpiHolder[pharm.providerNpi] = createPractitionerLocation({
              type: 'Practitioner',
              npi: pharm.providerNpi,
            });
          }

          resource.careTeam = [
            {
              sequence: 1,
                provider: {
                  reference: `Practitioner/${providerNpiHolder[pharm.providerNpi].id}`,
                }
            }
          ]
        }

        if (pharm.pharmacyNpi) {
          if (!pharmacyNpiHolder[pharm.pharmacyNpi]) {
            pharmacyNpiHolder[pharm.pharmacyNpi] = createPractitionerLocation({
              type: 'Location',
              npi: pharm.pharmacyNpi,
            });
          }

          resource.item[0].locationReference = {
            reference: `Location/${pharmacyNpiHolder[pharm.pharmacyNpi].id}`,
          }
        }

      
        pharmacyClaimList.push({
          fullUrl: `urn:uuid:${resource.id}`,
          resource,
        });
        claimCount += 1;

        if (pharm.claimStatus == 1) {
          const responseResource = createClaimResponse(
            {
              idName: 'pharm-claimResponse',
              claimType: pharmacyClaimType(),
              memberId: pharm.memberId,
              claimId: claimResponseCount,
              fullClaimId: resource.id,
              serviceDate: pharm.serviceDate,
              serviceCode: { code:pharm.ndcDrugCode },
            }
          );
          pharmacyClaimList.push({
            fullUrl: `urn:uuid:${responseResource.id}`,
            resource: responseResource,
          });
          claimResponseCount += 1;
        }
      }
    );

    Object.keys(providerNpiHolder).forEach((key) => {
      pharmacyClaimList.push({
        fullUrl: `urn:uuid:${providerNpiHolder[key].id}`,
        resource: providerNpiHolder[key],
      });
    });

    Object.keys(pharmacyNpiHolder).forEach((key) => {
      pharmacyClaimList.push({
        fullUrl: `urn:uuid:${pharmacyNpiHolder[key].id}`,
        resource: pharmacyNpiHolder[key],
      });
    });
  }

  return pharmacyClaimList;
}

const createMmdfResources = (mmdfList) => {
  const mmdfResources = [];
  if (mmdfList) {
    mmdfList.forEach((mmdf, index) => {
      if (mmdf.hospice === 'Y') {
        mmdfResources.push({
          resourceType: 'Encounter',
          id: `${mmdf.beneficiaryId}-mmdf-encounter-${index + 1}`,
          patient: { reference: `Patient/${mmdf.beneficiaryId}-patient` },
          period: {
            start: convertDateString(mmdf.runDate),
            end: convertDateString(mmdf.runDate),
          },
          status: 'finished',
          type: [ { coding: [ createCode('0115', 'R') ] } ],
        });
      }
    });
  }
  return mmdfResources;
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

    const conditions = createConditionList(memberInfo.visitEncounter, memberInfo.diagnosis);

    const claimEncResponse = createClaimEncResponse(
      memberInfo.visitEncounter,
      memberInfo.observation,
      memberInfo.procedure
    );

    claimEncResponse.claims.forEach((claim) => {
      fhirObject.entry.push({
        fullUrl: `urn:uuid:${claim.id}`,
        resource: claim,
      });
    });

    claimEncResponse.claimResponses.forEach((claimResponse) => {
      fhirObject.entry.push({
        fullUrl: `urn:uuid:${claimResponse.id}`,
        resource: claimResponse,
      });
    });

    linkConditionsToEncounters(conditions.fullConditionList, claimEncResponse.encounters);

    claimEncResponse.encounters.forEach((encounter) => {
      fhirObject.entry.push({
        fullUrl: `urn:uuid:${encounter.id}`,
        resource: encounter,
      });
    });

    conditions.fullConditionList.forEach((condition) => {
      fhirObject.entry.push({
        fullUrl: `urn:uuid:${condition.id}`,
        resource: condition,
      });
    });

    const visitClaimEncResponse = createVisitClaimEncResponse(memberInfo.visit);

    if (visitClaimEncResponse.claimResponses) {
      visitClaimEncResponse.claimResponses.forEach((claimResponse) => {
        fhirObject.entry.push({
          fullUrl: `urn:uuid:${claimResponse.id}`,
          resource: claimResponse,
        });
      });
    }

    if (visitClaimEncResponse.claims) {
      visitClaimEncResponse.claims.forEach((claimResponse) => {
        fhirObject.entry.push({
          fullUrl: `urn:uuid:${claimResponse.id}`,
          resource: claimResponse,
        });
      });
    }

    if (visitClaimEncResponse.visitEncounters) {
      visitClaimEncResponse.visitEncounters.forEach((claimResponse) => {
        fhirObject.entry.push({
          fullUrl: `urn:uuid:${claimResponse.id}`,
          resource: claimResponse,
        });
      });
    }

    if (visitClaimEncResponse.visitConditionList) {
      visitClaimEncResponse.visitConditionList.forEach((claimResponse) => {
        fhirObject.entry.push({
          fullUrl: `urn:uuid:${claimResponse.id}`,
          resource: claimResponse,
        });
      });
    }

    const procedures = createProcedureList(
      memberInfo.visit,
      memberInfo.observation,
      memberInfo.procedure,
      memberInfo.diagnosis,
    );

    procedures.forEach((procedure) => {
      fhirObject.entry.push({
        fullUrl: `urn:uuid:${procedure.id}`,
        resource: procedure,
      });
    });
  
    const observations = createObservationList(
      memberInfo.visit,
      memberInfo.visitEncounter,
      memberInfo.observation,
      memberInfo.procedure,
      memberInfo.lab
    );

    observations.forEach((observation) => {
      fhirObject.entry.push({
        fullUrl: `urn:uuid:${observation.id}`,
        resource: observation,
      });
    });
  
    const clincalPharm = createPharmacyClaims(memberInfo.pharmacyClinical, memberInfo.pharmacy);
    clincalPharm.forEach((item) => fhirObject.entry.push(item));

    const mmdfResources = createMmdfResources(memberInfo.mmdf);
    mmdfResources.forEach((item) => {
      fhirObject.entry.push({
        fullUrl: `urn:uuid:${item.id}`,
        resource: item,
      });
    });

    try {
      fs.mkdir(`${testDirectory}/fhirJson`, { recursive: true }, (err) => {if (err) throw err;});
      fs.writeFileSync(`${testDirectory}/fhirJson/${memberId}.json`, JSON.stringify([fhirObject], null, 2));
    } catch (writeErr) {
      console.error(`\x1b[31mError:\x1b[0m Unable to write to directory:${writeErr}.`);
      process.exit();
    }  
    
  });
}

const processTestDeck = async () => {
  const memberIds = checkArgs();
  const testDirectory = parseArgs.t;
  const allMemberInfo = await initMembers(testDirectory, memberIds);
  await readMembershipEnrollment(testDirectory, allMemberInfo);
  await readVisit(testDirectory, allMemberInfo);
  await readVisitEncounter(testDirectory, allMemberInfo);
  await readPharmacy(testDirectory, allMemberInfo);
  await readPharmacyClinical(testDirectory, allMemberInfo);
  await readDiagnosis(testDirectory, allMemberInfo);
  await readObservation(testDirectory, allMemberInfo);
  await readProcedure(testDirectory, allMemberInfo);
  await readLab(testDirectory, allMemberInfo);
  await readMmdf(testDirectory, allMemberInfo);

  await createFhirJson(testDirectory, allMemberInfo);
};

processTestDeck();