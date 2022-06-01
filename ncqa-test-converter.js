const parseArgs = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const memberId = 95041;

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

async function readGeneralMembership(testDirectory) {
  const generalMembership = {};

  const fileLines = await readFile(`${testDirectory}/member-gm.txt`);
  for await (const text of fileLines) {
    if (text.startsWith(memberId)) {
      generalMembership.memberId =              extractValue(text, 1, 16);
      generalMembership.gender =                extractValue(text, 17, 1);
      generalMembership.dateOfBirth =           extractValue(text, 18, 8);
      generalMembership.memberLastName =        extractValue(text, 26, 20);
      generalMembership.memberFirstName =       extractValue(text, 46, 20);
      generalMembership.subscriberId =          extractValue(text, 67, 16);
      generalMembership.mailingAddressOne =     extractValue(text, 83, 50);
      generalMembership.mailingAddressTwo =     extractValue(text, 133, 50);
      generalMembership.city =                  extractValue(text, 183, 30);
      generalMembership.state =                 extractValue(text, 213, 2);
      generalMembership.zipCode =               extractValue(text, 215, 5);
      generalMembership.phoneNumber =           extractValue(text, 220, 10);
      generalMembership.guardianFirstName =     extractValue(text, 230, 25);
      generalMembership.guardianMiddleInitial = extractValue(text, 255, 1);
      generalMembership.guardianLastName =      extractValue(text, 256, 25);
      generalMembership.race =                  extractValue(text, 281, 2);
      generalMembership.ethnicity =             extractValue(text, 283, 2);
      generalMembership.raceDataSource =        extractValue(text, 285, 2);
      generalMembership.ethnicityDataSource =   extractValue(text, 287, 2);
      generalMembership.spokenLanguage =        extractValue(text, 289, 2);
      generalMembership.spokenLanguageSource =  extractValue(text, 291, 2);
      generalMembership.writtenLanguage =       extractValue(text, 293, 2);
      generalMembership.writtenLanguageSource = extractValue(text, 295, 2);
      generalMembership.otherLanguage =         extractValue(text, 297, 2);
      generalMembership.otherLanguageSource =   extractValue(text, 299, 2);
    }
  }

  return generalMembership;
}

async function readMembershipEnrollment(testDirectory) {
  const membershipEnrollment = [];

  const fileLines = await readFile(`${testDirectory}/member-en.txt`);
  for await (const text of fileLines) {
    if (text.startsWith(memberId)) {
      const enrollment = {}
      enrollment.memberId =           extractValue(text, 1, 16);
      enrollment.startDate =          extractValue(text, 17, 8);
      enrollment.disenrollmentDate =  extractValue(text, 25, 8);
      enrollment.dentalBenefit =      extractValue(text, 33, 1);
      enrollment.drugBenefit =        extractValue(text, 34, 1);
      enrollment.mhbInpatient =       extractValue(text, 35, 1);
      enrollment.mhbIntensive =       extractValue(text, 36, 1);
      enrollment.mhbOutpatient =      extractValue(text, 37, 1);
      enrollment.cdbInpatient =       extractValue(text, 38, 1);
      enrollment.cdbIntensive =       extractValue(text, 39, 1);
      enrollment.cdbOutpatient =      extractValue(text, 40, 1);
      enrollment.payor =              extractValue(text, 41, 3);
      enrollment.employeeFlag =       extractValue(text, 44, 1);
      enrollment.indicator =          extractValue(text, 45, 10);

      membershipEnrollment.push(enrollment);
    }
  }

  return membershipEnrollment;
}

async function readVisit(testDirectory) {
  const visitList = [];

  const fileLines = await readFile(`${testDirectory}/visit.txt`);
  for await (const text of fileLines) {
    if (text.startsWith(memberId)) {
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

      visitList.push(visit);
    }
  }

  return visitList;
}

async function readVisitEncounter(testDirectory) {
  const visitEncounterList = [];

  const fileLines = await readFile(`${testDirectory}/visit-e.txt`);
  for await (const text of fileLines) {
    if (text.startsWith(memberId)) {
      const visitEncounter = {};
      visitEncounter.memberId =       extractValue(text, 1, 16);
      visitEncounter.serviceDate =    extractValue(text, 17, 8);
      visitEncounter.activityType =   extractValue(text, 25, 20);
      visitEncounter.codeFlag =       extractValue(text, 45, 1);
      visitEncounter.endDate =        extractValue(text, 46, 8);
      visitEncounter.status =         extractValue(text, 54, 1);
      visitEncounter.providerId =     extractValue(text, 55, 10);
      visitEncounter.diagnosisCode =  extractValue(text, 65, 20);
      visitEncounter.diagnosisFlag =  extractValue(text, 85, 1);

      visitEncounterList.push(visitEncounter);
    }
  }

  return visitEncounterList;
}

async function readPharmacy(testDirectory) {
  const pharmacyList = [];

  const fileLines = await readFile(`${testDirectory}/pharm.txt`);
  for await (const text of fileLines) {
    if (text.startsWith(memberId)) {
      const pharmacy = {};
      pharmacy.memberId =           extractValue(text, 1, 16);
      pharmacy.daysSupply =         extractValue(text, 17, 3);
      pharmacy.serviceDate =        extractValue(text, 20, 8);
      pharmacy.ndcDrugCode =        extractValue(text, 28, 11);
      pharmacy.claimStatus =        extractValue(text, 39, 1);
      pharmacy.quantityDispensed =  extractValue(text, 40, 7);
      pharmacy.supplementalData =   extractValue(text, 47, 1);
      pharmacy.providerNpi =        extractValue(text, 48, 10);
      pharmacy.pharmacyNpi =        extractValue(text, 58, 10);
      pharmacyList.push(pharmacy);
    }
  }

  return pharmacyList;
}

async function readPharmacyClinical(testDirectory) {
  const pharmacyClinicalList = [];

  const fileLines = await readFile(`${testDirectory}/pharm-c.txt`);
  for await (const text of fileLines) {
    if (text.startsWith(memberId)) {
      const pharmacyClinical = {}
      pharmacyClinical.memberId =           extractValue(text, 1, 16);
      pharmacyClinical.orderedDate =        extractValue(text, 17, 8);
      pharmacyClinical.startDate =          extractValue(text, 25, 8);
      pharmacyClinical.drugCode =           extractValue(text, 33, 11);
      pharmacyClinical.codeFlag =           extractValue(text, 44, 1);
      pharmacyClinical.frequency =          extractValue(text, 45, 3);
      pharmacyClinical.dispensedDate =      extractValue(text, 48, 8);
      pharmacyClinical.endDate =            extractValue(text, 56, 8);
      pharmacyClinical.active =             extractValue(text, 64, 1);
      pharmacyClinical.yearOfImmunization = extractValue(text, 65, 4);
      pharmacyClinical.quantity =           extractValue(text, 69, 3);
      pharmacyClinicalList.push(pharmacyClinical);
    }
  }

  return pharmacyClinicalList;
}

async function readDiagnosis(testDirectory) {
  const diagnosisList = [];

  const fileLines = await readFile(`${testDirectory}/diag.txt`);
  for await (const text of fileLines) {
    if (text.startsWith(memberId)) {
      const diagnosis = {};
      diagnosis.memberId =      extractValue(text, 1, 16);
      diagnosis.startDate =     extractValue(text, 17, 8);
      diagnosis.diagnosisCode = extractValue(text, 25, 20);
      diagnosis.diagnosisFlag = extractValue(text, 45, 1);
      diagnosis.endDate =       extractValue(text, 46, 8);
      diagnosis.attribute =     extractValue(text, 54, 20);
      diagnosisList.push(diagnosis);
    }
  }

  return diagnosisList;
}

const createPatientFhirObject = (generalMembership) => {
  const patient = { resourceType: 'Patient'};
  patient.id = generalMembership.memberId;
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
  const birthDate = generalMembership.dateOfBirth;
  const year = birthDate.toString().substr(0, 4);
  const month = birthDate.toString().substr(4, 2);
  const day = birthDate.toString().substr(6, 2);

  patient.birthDate = `${year}-${month}-${day}`;

  return patient;
}

const createFhirJson = (memberInfo) => {
  const fhirObject = {};
  fhirObject.resourceType = 'Bundle';
  fhirObject.type = 'transaction';
  
  const patient = createPatientFhirObject(memberInfo.generalMembership);

  fhirObject.entry = [];
  fhirObject.entry.push({
    fullUrl: `urn:uuid:${memberInfo.generalMembership.memberId}`,
    resource: patient,
  });

  console.log(JSON.stringify(fhirObject, null, '  '));
}

const processTestDeck = async (testDirectory) => {
  const memberInfo = {}
  memberInfo.generalMembership = await readGeneralMembership(testDirectory);
  memberInfo.membershipEnrollment = await readMembershipEnrollment(testDirectory);
  memberInfo.visit = await readVisit(testDirectory);
  memberInfo.visitEncounter = await readVisitEncounter(testDirectory);
  memberInfo.pharmacy = await readPharmacy(testDirectory);
  memberInfo.pharmacyClinical = await readPharmacyClinical(testDirectory);
  memberInfo.diagnosis = await readDiagnosis(testDirectory);

  createFhirJson(memberInfo);

};

processTestDeck(parseArgs['testDirectory']);