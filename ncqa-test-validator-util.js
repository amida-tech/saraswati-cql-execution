const fs = require('fs');
const config = require('./config');
const measure = config.measurementType;
const { getValidPayors, isValidCommercial, 
  isValidExchange, isValidMedicaid, isValidMedicare,
  exchange, medicarePlans, medicaidPlans, commercial } = require('./ncqa-test-payer-util');

const msInADay = 1000 * 60 * 60 * 24;
const msInAYear = msInADay * 365.242; //.242;

const providerInfo = JSON.parse(fs.readFileSync('ncqa-test-provider.json', 'utf8'));

const ethnicityMap = { // Race Map is 1 for 1 to answers.
  11: 1, // Hispanic or Latino
  12: 2, // Not Hispanic or Latino
  18: 3, // Asked but No Answer
  19: 4, // Unknown ethnicity
}

const raceEthnicDSMap = {
 21: 1, // Direct CMS Databases RaceDS
 22: 1, // Direct State Databases RaceDS
 23: 2, // Indirect Surname Analysis RaceDS
 24: 2, // Indirect Geo-Coding Analysis RaceDS
 25: 1, // Direct Health Plan Direct RaceDS
 28: 0, // Unknown Data Collection method, HPDI only should not come up, RaceDS
 29: 1, // Other Direct RaceDS
 91: 1, // Direct CMS Databases EthnicityDS
 92: 1, // Direct State Databases EthnicityDS
 93: 2, // Indirect Surname Analysis EthnicityDS
 94: 2, // Indirect Geo-Coding Analysis EthnicityDS
 95: 1, // Direct Health Plan Direct EthnicityDS
 98: 0, // Unknown Data Collcetion method, HPDI only should not come up, EthnicityDS
 99: 1, // Other Direct EthnicityDS
}

const secondQualifyingEpisodeCheck = (data, index) => {
  if (index === 0) {
    return true;
  }
  return data[data.memberId]['Qualifying Episodes Without Exclusions'].length > 1;
}

const coverageMap = (coverage) => {
  return {
    payor: coverage.payor[0].reference.value,
    date: new Date(coverage.period.end.value).getTime(),
  }
}

const getDefaultPayors = (data, age) => {
  const memberCoverage = data[data.memberId]['Member Coverage'];
  let foundPayors = memberCoverage.map((coverage) => coverageMap(coverage));
  return getValidPayors(foundPayors, age, memberCoverage);
}

const hedisData = {
  aab: {
    measureIds: ['AABA','AABB'],
    eventsOrDiag: true,
    measureCheck: (data, index, measureFunctions) => {
      if (index === 0) {
        return data[data.memberId]['Qualifying Episodes Without Exclusions'].length > 0;
      }
      return data[data.memberId]['Qualifying Episodes Without Exclusions'].length > 1;
    },
    getAge: (data, index) => { // Age must be calculated against first event.
      const event = data[data.memberId]['Encounter with Acute Bronchitis or Bronchiolitis'][index];
      let eventDate = {}
      if (event) {
        eventDate = new Date(data[data.memberId]['Encounter with Acute Bronchitis or Bronchiolitis'][index].low);
      } else {
        eventDate = new Date('2022-01-01');
      }
      return getAge(new Date(data.birthDate), eventDate);
    },
    getEvent: () => 1,
    getContinuousEnrollment: (data) => {
      return data[data.memberId]['Episode Date'].length >= 1 ? 1 : 0;
    },
    getEligiblePopulation: (data, index, measureFunctions) => {
      const payors = measureFunctions.getPayors(data, index, measureFunctions);
      if (payors === undefined) {
        return false;
      }
      const payor = payors[0];
      return !exchange.includes(payor) ? 1 : 0;
    },
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      return data[data.memberId][`Numerator`][index + 1] !== undefined ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions`][index + 1] !== undefined  ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    getPayors: (data, _index, measureFunctions) => getDefaultPayors(data, measureFunctions.getAge(data)),
  },
  adde: {
    measureIds: ['ADD1','ADD2'],
    eventsOrDiag: true,
    getAge: (data) => {
      const eventDate = data[data.memberId]['Last Calendar Day of February'];
      let eventDateCompare = {};
      const birthDate = data.birthDate.split('-');
      const birthDateCompare = {
        year: parseInt(birthDate[0]),
        month: parseInt(birthDate[1]),
        day: parseInt(birthDate[2]),
      }
      if (typeof eventDate === 'string' || eventDate instanceof String) {
        const splitDate = eventDate.split('T')[0].split('-');
        eventDateCompare = {
          year: parseInt(splitDate[0]),
          month: parseInt(splitDate[1]),
          day: parseInt(splitDate[2]),
        };
      } else {
        eventDateCompare = {
          year: eventDate.year,
          month: eventDate.month,
          day: eventDate.day,
        };
      } 
      
      // If you are born during a leap year, use the 29th as the last calendar day of February
      if (birthDateCompare.year % 4 === 0) {
        eventDateCompare.day = 29;
      }

      return getAge2(birthDateCompare, eventDateCompare);
    },
    getEvent: (data, index) => {
      const appAgeWNHN = data[data.memberId]['Member is Appropriate Age and Has IPSD with Negative Medication History'];

      if (index === 0) {
        return appAgeWNHN
          && data[data.memberId]['Acute Inpatient Encounter for Mental Behavioral or Neurodevelopmental Disorders During Initiation Phase'].length === 0
          && data[data.memberId]['Acute Inpatient Discharge for Mental Behavioral or Neurodevelopmental Disorders During Initiation Phase'].length === 0
          ? 1 : 0
      }

      return appAgeWNHN 
        && data[data.memberId]['Has 210 Medication Treatment Days in 301 Day Period Starting on IPSD and Continuing through End of Continuation and Maintenance Phase']
        && data[data.memberId]['Acute Inpatient Encounter for Mental Behavioral or Neurodevelopmental Disorders Before End of Continuation and Maintenance Phase'].length === 0
        && data[data.memberId]['Acute Inpatient Discharge for Mental Behavioral or Neurodevelopmental Disorders Before End of Continuation and Maintenance Phase'].length === 0
          ? 1 : 0;
    },
    getContinuousEnrollment: (data, index) => {
      return data[data.memberId][`Enrolled During Participation Period ${index + 1}`] ? 1 : 0;
    },
    getEligiblePopulation: (data, index, measureFunctions) => {
      const payors = measureFunctions.getPayors(data, index, measureFunctions);
      if (payors === undefined) {
        return false;
      }
      const payor = payors[0];
      return (!medicarePlans.includes(payor) && !exchange.includes(payor)) ? 1 : 0;
    },
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      const numerator = data[data.memberId][`Numerator ${index + 1}`];
      if (!numerator) {
        return 0;
      }

      let hasValidFollowUp = false;
      const followUpEncsI = data[data.memberId]['Follow Up Encounters or Assessments During Initiation Phase'];
      for (const followUpEnc of followUpEncsI) {
        if (followUpEnc.serviceProvider) {
          const provider = providerInfo[followUpEnc.serviceProvider.reference.value];
          if (provider.prescriber) {
            hasValidFollowUp = true;
            break;
          }
        } else if (followUpEnc.performer) {
          const provider = providerInfo[followUpEnc.performer[0].reference.value];
          if (provider.prescriber) {
            hasValidFollowUp = true;
            break;
          }
        } else {
          hasValidFollowUp = true;
          break;
        }
      }

      if (index == 0) {
        return hasValidFollowUp ? 1 : 0;
      }

      const followUpEncsCM = data[data.memberId]['Follow Up Encounters or Assessments During Continuation and Maintenance Phase'];
      const followUpEncsECM = data[data.memberId]['Follow Up Encounter with eVisit or Virtual Check in During Continuation and Maintenance Phase'];

      const twoValidFollowUps = followUpEncsCM.length >= 2 
        || (followUpEncsCM.length === 1 && followUpEncsECM.length >= 1);

      return (hasValidFollowUp && twoValidFollowUps) ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    measureCheck: (data, _index, measureFunctions) => {
      return measureFunctions.getEvent(data, 0, measureFunctions) === 1
        || measureFunctions.getEvent(data, 1, measureFunctions) === 1;
    },
    getPayors: (data, index, measureFunctions) => {
      const compareDate = new Date(data[data.memberId]['Index Prescription Start Date']);
      const memberCoverage = data[data.memberId]['Member Coverage'];
      // filter coverage objects based on dates from Enrolled During Participation Period 1 and 2
      let foundPayors = memberCoverage
        .filter((coverage) => {
          const coverageStart = new Date(coverage.period.start.value);
          const coverageEnd = new Date(coverage.period.end.value);

          if (index == 0) {
            return coverageStart.getTime() <= compareDate.getTime() + (30 * msInADay)
              && coverageEnd.getTime() >= compareDate.getTime() - (120 * msInADay);
          }
          return coverageStart.getTime() <= compareDate.getTime() + (300 * msInADay)
            && coverageEnd.getTime() >= compareDate.getTime() + (31 * msInADay);
          
        })
        .map((coverage) => coverageMap(coverage));
      // if none are found, use the latest is Member Coverage
      return getValidPayors(foundPayors, measureFunctions.getAge(data), memberCoverage);
    }
  },
  aise: {
    measureIds: ['AISINFL','AISTD','AISZOS','AISPNEU'],
    eventsOrDiag: false,
    measureCheck: (data, index, measureFunctions) => {
      const age  = measureFunctions.getAge(data);
      // Check if member meets age range for each measure
      if ((index == 0 || index == 1) && age < 19) {
        return false;
      } else if (index == 2 && age < 50) {
        return false
      } else if (index == 3 && age < 66) {
        return false;
      }
      // Get Payor
      let payor = measureFunctions.getPayors(data, index, measureFunctions);
      if (payor === undefined) {
        return false;
      }
      payor = payor[0];
      // Check if payor and age are valid
      return (isValidCommercial(payor, age))
        || (isValidExchange(payor, age))
        || (isValidMedicaid(payor, age))
        || (isValidMedicare(payor, age));
    },
    getAge: (data) => {
      let eventDate = new Date('2022-01-01');
      return getAge(new Date(data.birthDate), eventDate);
    },
    getEvent: () => 0,
    getContinuousEnrollment: (data) => {
      return data[data.memberId][`Enrolled During Participation Period`] ? 1 : 0;
    },
    getEligiblePopulation: (data, index, measureFunctions) => {
      const payors = measureFunctions.getPayors(data, index, measureFunctions);
      if (payors === undefined) {
        return false;
      }
      const payor = payors[0];
      return !exchange.includes(payor) ? 1 : 0;
    },
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      return data[data.memberId][`Numerator ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    getPayors: (data, _index, measureFunctions) => getDefaultPayors(data, measureFunctions.getAge(data)),
  },
  apme: {
    measureIds: ['APM1','APM2','APM3'],
    eventsOrDiag: true,
    measureCheck: (data, index, measureFunctions) => {
      const payors = measureFunctions.getPayors(data, index, measureFunctions);
      return payors !== undefined && payors.length > 0 && measureFunctions.getAge(data) < 18;
    },
    getAge: (data) => {
      let eventDate = new Date('2022-12-31');
      return getAge(new Date(data.birthDate), eventDate);
    },
    getEligiblePopulation: (data, index, measureFunctions) => {
      const payors = measureFunctions.getPayors(data, index, measureFunctions);
      if (payors === undefined) {
        return false;
      }
      const payor = payors[0];
      return (!medicarePlans.includes(payor) && !exchange.includes(payor)) ? 1 : 0;
    },
    getEvent: (data) => {
      return data[data.memberId]['Antipsychotics on Different Days'] ? 1 : 0;
    },
    getContinuousEnrollment: (data) => {
      return data[data.memberId][`Enrolled During Participation Period`] ? 1 : 0;
    },
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      return data[data.memberId][`Numerator ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    getPayors: (data, _index, measureFunctions) => getDefaultPayors(data, measureFunctions.getAge(data)),
  },
  asfe: {
    measureIds: ['ASFA','ASFB'],
    eventsOrDiag: false,
    measureCheck: (data, _index, measureFunctions) => {
      return measureFunctions.getAge(data) >= 18 && measureFunctions.getPayors(data) !== undefined;
    },
    getAge: (data) => {
      let eventDate = new Date('2022-01-01');
      return getAge(new Date(data.birthDate), eventDate);
    },
    getEligiblePopulation: (data, index, measureFunctions) => {
      const payors = measureFunctions.getPayors(data, index, measureFunctions);
      if (payors === undefined) {
        return 0;
      }
      const payor = payors[0];
      const age = measureFunctions.getAge(data);
      if (isValidExchange(payor, age)) {
        return 0;
      }
      
      return data[data.memberId][`Denominator ${index + 1}`] ? 1 : 0; 
    },
    getEvent: (data, index) => {
      if (index === 0) {
        return 0;
      }
      return data[data.memberId]['Denominator 2'] ? 1 : 0;
    },
    getContinuousEnrollment: (data) => {
      return data[data.memberId][`Enrolled During Participation Period`] ? 1 : 0;
    },
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      return data[data.memberId][`Numerator ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    getPayors: (data) => getDefaultPayors(data), //Don't send age, uses matrix
  },
  bcse: {
    measureIds: ['BCS','BCSNON','BCSLISDE','BCSDIS','BCSCMB','BCSOT'],
    eventsOrDiag: false,
    measureCheck: (data, index, measureFunctions) => {
      let validPayor = false;
      const payors = measureFunctions.getPayors(data, index);
      if (index === 0) {
        validPayor = payors.find((payor) => exchangeOrCommercial.includes(payor) || medicaidPlans.includes(payor));
      } else if (index === 1) {
        validPayor = payors.find((payor) => medicarePlans.includes(payor));
      }
      const age = measureFunctions.getAge(data);
      return validPayor && age >= 18 && age <= 74 && data.gender.startsWith('f');
    },
    getAge: (data) => {
      let eventDate = new Date('2022-12-31');
      return getAge(new Date(data.birthDate), eventDate);
    },
    getEligiblePopulation: (data, index, measureFunctions) => {
      return data[data.memberId][`Initial Population`] ? 1 : 0; 
    },
    getEvent: (data, index) => {
      return 0;
    },
    getContinuousEnrollment: (data) => {
      return data[data.memberId][`Enrolled During Participation Period`] ? 1 : 0;
    },
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      return data[data.memberId][`Numerator`] ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    getPayors: (data, index) => {
      const bcsePayors = getDefaultPayors(data);
      if (index === 0) {
        return bcsePayors.filter((payor) => exchangeOrCommercial.includes(payor) || medicaidPlans.includes(payor));
      } else if (index === 1) {
        return bcsePayors.filter((payor) => medicarePlans.includes(payor));
      }
      return bcsePayors;
    }
  },
  ccs: {
    measureIds: ['CCS'],
    measureCheck: (data, _index, measureFunctions) => {
      const payors = measureFunctions.getPayors(data);
      if (payors == undefined) {
        return 0;
      }
      const age = measureFunctions.getAge(data);
      return age >= 24 && age <= 64 && data.gender.startsWith('f');
    },
    getAge: (data) => {
      let eventDate = new Date('2022-12-31');
      return getAge(new Date(data.birthDate), eventDate);
    },
    getEligiblePopulation: (data, index, measureFunctions) => {
      const payor = measureFunctions.getPayors(data)[0];
      if (medicarePlans.includes(payor)) {
        return 0;
      }
      return data[data.memberId][`Initial Population`] ? 1 : 0; 
    },
    getEvent: (data, index) => {
      return 0;
    },
    getContinuousEnrollment: (data) => {
      return data[data.memberId][`Enrolled During Participation Period`] ? 1 : 0;
    },
    getExclusion: (data) => {
      return data[data.memberId][`Denominator Exceptions`] ? 1 : 0;
    },
    getNumerator: (data, index) => {
      return data[data.memberId][`Numerator`] ? 1 : 0;
    },
    getRequiredExclusion: () => 0,
    getRequiredExclusionID: (data, index) => {
      return data[data.memberId][`Exclusions`] ? 1 : 0;
    },
    getPayors: (data, index) => getDefaultPayors(data),
  },
  cise: {
    measureIds: ['CISDTP','CISOPV','CISMMR','CISHIB','CISHEPB','CISVZV','CISPNEU','CISHEPA','CISROTA','CISINFL','CISCMB3','CISCMB7','CISCMB10'],
    measureCheck: (data, index, measureFunctions) => {
      const age = measureFunctions.getAge(data);
      if (age !== 2) {
        return false;
      }
      if (index === 10 || index === 11) {
        const payors = measureFunctions.getPayors(data);
        if (payors === undefined) {
          return 0;
        }
        return !exchange.includes(payors[0]);
      }
      return true;
    },
    getAge: (data) => {
      let eventDate = new Date('2022-12-31');
      return getAge(new Date(data.birthDate), eventDate);
    },
    getContinuousEnrollment: (data) => {
      return data[data.memberId][`Enrolled During Participation Period`] ? 1 : 0;
    },
    getEvent: () => 0,
    getEligiblePopulation: (data, index, measureFunctions) => {
      const payors = measureFunctions.getPayors(data);
      if (payors === undefined || medicarePlans.includes(payors[0])) {
        return 0;
      }
      return data[data.memberId][`Initial Population ${index + 1}`] ? 1 : 0; 
    },
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      return data[data.memberId][`Numerator ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    getPayors: (data) => getDefaultPayors(data),
  },
  cole: {
    measureIds: ['COL','COLNON','COLLISDE','COLDIS','COLCMB','COLOT'],
    raceRequired: true,
    measureCheck: (data, index, measureFunctions) => {
      let validPayor = false;
      const payors = measureFunctions.getPayors(data, index);
      if (index === 0) {
        validPayor = payors.find((payor) => exchangeOrCommercial.includes(payor) || medicaidPlans.includes(payor));
      } else if (index >= 1) {
        validPayor = payors.find((payor) => medicarePlans.includes(payor));
      }
      const age = measureFunctions.getAge(data);
      return validPayor && age >= 46 && age <= 75;
    },
    getAge: (data) => {
      let eventDate = new Date('2022-12-31');
      return getAge(new Date(data.birthDate), eventDate);
    },
    getContinuousEnrollment: (data) => {
      return data[data.memberId][`Enrolled During Participation Period`] ? 1 : 0;
    },
    getEvent: () => 0,
    getEligiblePopulation: (data, _index, measureFunctions) => {
      const payors = measureFunctions.getPayors(data);
      if (payors === undefined || medicarePlans.includes(payors[0])) {
        return 0;
      }
      return data[data.memberId]['Initial Population'] ? 1 : 0; 
    },
    getExclusion: () => 0,
    getNumerator: (data, _index) => {
      return data[data.memberId]['Numerator'] ? 1 : 0;
    },
    getRequiredExclusion: (data, _index) => {
      return data[data.memberId]['Exclusions'] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    getPayors: (data, index) => {
      const colePayors = getDefaultPayors(data);
      if (index === 0) {
        return colePayors.filter((payor) => exchangeOrCommercial.includes(payor) || medicaidPlans.includes(payor));
      }
      return colePayors.filter((payor) => medicarePlans.includes(payor));
    }
  },
  cou: {
    measureIds: ['COUA','COUB'],
    measureCheck: (data) => {
      return data[data.memberId]['Member is Appropriate Age and Has IPSD with Negative Medication History'];
    },
    getAge: (data) => {
      let eventDate = new Date(data[data.memberId]['November 1 of Year Prior to Measurement Period']);
      return getAge(new Date(data.birthDate), eventDate);
    },
    getContinuousEnrollment: (data) => {
      return data[data.memberId][`Enrolled During Participation Period`] ? 1 : 0;
    },
    getEvent: () => 1,
    getEligiblePopulation: (data, index, measureFunctions) => {
      const payors = measureFunctions.getPayors(data);
      if (payors === undefined 
        || exchange.includes(payors[0])) {
        return 0;
      }
      return data[data.memberId][`Initial Population ${index + 1}`] ? 1 : 0; 
    },
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      return data[data.memberId][`Numerator ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusion: () => 0,
    getRequiredExclusionID: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getPayors: (data) => {
      const memberCoverage = data[data.memberId]['Member Coverage'];
      const prescStartDate = new Date(data[data.memberId]['Index Prescription Start Date']);
      let foundPayors = memberCoverage
        .filter((coverage) => {
          return new Date(coverage.period.start.value).getTime() <= prescStartDate.getTime()
            && new Date(coverage.period.end.value).getTime() >= prescStartDate.getTime();
        })
        .map((coverage) => coverageMap(coverage));
      return getValidPayors(foundPayors, undefined, memberCoverage);
    },
  },
  cwp: {
    measureIds: ['CWPA','CWPB'],
    eventsOrDiag: true,
    ageKey: 'Qualifying Episodes Without Exclusions',
    ageArray: true, 
    measureCheck: secondQualifyingEpisodeCheck,
  },
  dmse: {
    measureIds: ['DMS'],
    measureCheck: (data, index, measureFunctions) => {
      let payor = measureFunctions.getPayors(data, index, measureFunctions);
      if (payor === undefined) {
        return false;
      }
      payor = payor[0];
      if (medicarePlans.includes(payor) && measureFunctions.getAge(data) < 18) {
        return false;
      }
      return measureFunctions.getAge(data) >= 12;
    },
    getAge: (data) => {
      let eventDate = new Date('2022-01-01');
      return getAge(new Date(data.birthDate), eventDate);
    },
    getContinuousEnrollment: (data) => {
      return data[data.memberId][`Enrolled During Participation Period`] ? 1 : 0;
    },
    getEvent: (data) => {
      return ((data[data.memberId]['Event 1'] ? 1 : 0)
        + (data[data.memberId]['Event 2'] ? 1 : 0)
        + (data[data.memberId]['Event 3'] ? 1 : 0));
    },
    getEligiblePopulation: (data, index, measureFunctions) => {
      const payor = measureFunctions.getPayors(data, index, measureFunctions)[0];
      if (exchange.includes(payor)) {
        return 0;
      }
      return ((data[data.memberId]['Initial Population 1'] ? 1 : 0)
      + (data[data.memberId]['Initial Population 2'] ? 1 : 0)
      + (data[data.memberId]['Initial Population 3'] ? 1 : 0));
    },
    getExclusion: () => 0,
    getNumerator: (data) => {
      return ((data[data.memberId]['Numerator 1'] ? 1 : 0)
        + (data[data.memberId]['Numerator 2'] ? 1 : 0)
        + (data[data.memberId]['Numerator 3'] ? 1 : 0));
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    getPayors: (data, _index, measureFunctions) => getDefaultPayors(data, measureFunctions.getAge(data)),
  },
  drre: {
    measureIds: ['DRRA','DRRB','DRRC']
  },
  dsfe: {
    measureIds: ['DSFA','DSFB']
  },
  fum: {
    measureIds: ['FUM30A', 'FUM7A', 'FUM30B', 'FUM7B'],
    eventsOrDiag: true,
    getAge: (data, index) => {
      const dateIndex = Math.floor(index / 2);
      let eventDate = data[data.memberId]['First Eligible ED Visits per 31 Day Period'][dateIndex];
      if (eventDate === undefined) {
        eventDate = data[data.memberId]['ED Visits With Principal Diagnosis of Mental Illness or Intentional Self-Harm'][dateIndex]?.low;
      }
      eventDate = new Date(eventDate);
      eventDate.setUTCHours(0,0,0,0);
      return getAge(new Date(data.birthDate), eventDate);
    },
    getEligiblePopulation: (data, index, measureFunctions) => {
      const age = measureFunctions.getAge(data, index);
      if (age < 6 || isNaN(age)) {
        return 0;
      }

      const payors = measureFunctions.getPayors(data, index, measureFunctions);
      if (payors === undefined) {
        return 0;
      }
      const payor = payors[0];
      return (commercial.includes(payor))
        // || exchange.includes(payor)
        || medicaidPlans.includes(payor)
        || medicarePlans.includes(payor) ? 1 : 0;
    },
    getContinuousEnrollment: (data, index) => {
      return data[data.memberId]['First Eligible ED Visits per 31 Day Period'][Math.floor(index / 2)]
        !== undefined ? 1 : 0;
    },
    getEvent: (data, index) => { //Math.floor(index / 2)
      return data[data.memberId]['ED Visits With Principal Diagnosis of Mental Illness or Intentional Self-Harm'][0]
        !== undefined ? 1 : 0;
    },
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      const numIndex = index % 2 // Deciding between FUM30 and FUM7.
      const dateIndex = Math.floor(index / 2); // Won't ever go over 1. 
      const denominator = data[data.memberId][`Denominator ${numIndex + 1}`][dateIndex];
      return data[data.memberId][`Numerator ${numIndex + 1}`].includes(denominator) ? 1 : 0;
    },
    
    getRequiredExclusion: () => 0, // INCORRECT.
    getRequiredExclusionID: (data, index) => {
      const numIndex = index % 2
      const dateIndex = Math.floor(index / 2);
      return data[data.memberId][`Exclusions ${numIndex + 1}`][dateIndex] !== undefined ? 1 : 0;
    },
    measureCheck: (data, index, measureFunctions) => {
      const age = measureFunctions.getAge(data, index);
      if (isNaN(age) || age < 6) {
        return false;
      }
      if (index < 2) { // We always want a result back for FUM30A and FUM7A.
        return true;
      }
      return data[data.memberId]['Initial Population 2'].length > 1;
    },
    getPayors: (data, _index, measureFunctions) => {
      const memberCoverage = data[data.memberId]['Member Coverage'];
      let foundPayors = memberCoverage
        .map((coverage) => {
          return {
            payor: coverage.payor[0].reference.value,
            date: new Date(coverage.period.end.value).getTime(),
          }
        });
      if (foundPayors === undefined || foundPayors.length === 0) {
        if (memberCoverage.length === 0) {
          return;
        }
        foundPayors = memberCoverage[memberCoverage.length - 1].payor[0].reference.value;
        return getPayors(foundPayors);
      }
      return getPayorArray(foundPayors);
    }
  },
  imae: {
    measureIds: ['IMAMEN','IMATD','IMAHPV','IMACMB1','IMACMB2']
  },
  pdse: {
    measureIds: ['PDS1A','PDS2A','PDS1B','PDS2B']
  },
  pnde: {
    measureIds: ['PND1A','PND2A','PND1B','PND2B']
  },
  prse: {
    measureIds: ['PRSINFLA','PRSTDA','PRSCMBA','PRSINFLB','PRSTDB','PRSCMBB']
  },
  psa: {
    measureIds: ['PSA'],
    measureCheck: () => true,
  },
  uop: {
    measureIds: ['UOPA','UOPB','UOPC']
  },
  uri: {
    measureIds: ['URIA','URIB'],
    eventsOrDiag: true,
    ageKey: 'Qualifying Episodes Without Exclusions', 
    ageArray: true,
    measureCheck: secondQualifyingEpisodeCheck,
  },
}

const getAge = (birthDate, compareDate) => { // Age must be calculated against first event.
  let totalYears = parseInt(compareDate.getFullYear()) - parseInt(birthDate.getFullYear());
  if (compareDate.getMonth() < birthDate.getMonth()) {
    totalYears -= 1;
  }
  if (compareDate.getMonth() === birthDate.getMonth() && compareDate.getDate() < birthDate.getDate()) {
    totalYears -= 1;
  }
  return totalYears;
}

const getAge2 = (birthDate, compareDate) => { // Age must be calculated against first event.
  let totalYears = compareDate.year - birthDate.year;
  if (compareDate.month < birthDate.month) {
    totalYears -= 1;
  }
  if (compareDate.month === birthDate.month && compareDate.day < birthDate.day) {
    totalYears -= 1;
  }
  return totalYears;
}

const getContinuousEnrollment = (data) => {
  const ce = data[data.memberId][hedisData[measure].ceKey];
  if(hedisData[measure].ceArray) {
    return ce.length >= 1 ? 1 : 0;
  } 
  // Handle other case.
}

const getEligiblePopulation = (ce, event, rExcl, rExclD) => {
  if (hedisData[measure].eventsOrDiag) { 
    if (ce === 0 || event === 0 || rExcl === 1 || rExclD === 1) {
      return 0;
    } 
    return 1; // Assumption. ce === 1 && event === 1 && rExcl === 0 && rExclD === 1
  } else { // Measures without events/diagnosis.
    if (ce === 0 || rExcl === 1 || rExclD === 1) { // Or payer does not meet HEDIS criteria.
      return 0;
    }
    return 1; // Assumption. ce === 1 && rExcl === 0 && rExclD === 1 && Payer meets HEDIS criteria.
  } // There's also 2 or 3 for DMS measures, the PHQ-9 measure.
}

const getEvent = (data) => {
  const event = data[data.memberId][hedisData[measure].eventKey];
  if(hedisData[measure].eventArray) {
    return event.length >= 1 ? 1 : 0;
  }
  // Handle other case.
}

const getExclusion = (data, index) => {
  if (hedisData[measure].denArray) {
    if (hedisData[measure].denCount === 1) {
      return data[data.memberId].Exclusions.includes(data[data.memberId].Denominator[index]) ? 1 : 0;
    }
    return data[data.memberId][`Exclusions ${index}`].includes(data[data.memberId][`Denominator ${index}`][index]) ? 1 : 0;
  }
}

const getNumerator = (data, index) => {
  if (hedisData[measure].denArray) {
    if (hedisData[measure].denCount === 1) {
      return data[data.memberId].Numerator.includes(data[data.memberId].Denominator[index]) ? 1 : 0;
    }
    return data[data.memberId][`Numerator ${index}`].includes(data[data.memberId][`Denominator ${index}`][index]) ? 1 : 0;
  } // There's also 2 or 3 for DMS measures, the PHQ-9 measure.
}

const getRequiredExclusion = (data, index) => {
  if (hedisData[measure].denArray) {
    if (hedisData[measure].denCount === 1) {
      return data[data.memberId][hedisData[measure].reqExKey].includes(data[data.memberId].Denominator[index]) ? 1 : 0;
    }
    return data[data.memberId][`Numerator ${index}`].includes(data[data.memberId][`Denominator ${index}`][index]) ? 1 : 0;
  } // There's also 2 or 3 for DMS measures, the PHQ-9 measure.
}

module.exports = { getAge, getContinuousEnrollment, getEligiblePopulation, getEvent, getExclusion, getNumerator, getRequiredExclusion, ethnicityMap, raceEthnicDSMap, hedisData };