const fs = require('fs');
const config = require('./config');
const measure = config.measurementType;

const msInADay = 1000 * 60 * 60 * 24;
const msInAYear = msInADay * 365.242; //.242;

const exchange = ['MEP', 'MMO', 'MOS', 'MPO'];
const commercial = ['CEP', 'HMO', 'POS', 'PPO'];
const exchangeOrCommercial = ['CEP', 'HMO', 'POS', 'PPO', 'MEP', 'MMO', 'MOS', 'MPO'];
const medicarePlans = ['MCR', 'MCS', 'MP', 'MC', 'MCR', 'SN1', 'SN2', 'SN3', 'MMP'];
const medicaidPlans = ['MD', 'MDE', 'MLI', 'MRB', 'MCD', 'MMP'];
const snpMeasures = []; // I don't think we'll ever have any of these for a while.
const medicareMeasures = ['asfe', 'aise', 'fum'];
const medicaidMeasures = ['adde', 'asfe', 'fum'];
const mmpMeasures = []; // As with SNPs.

const providerInfo = JSON.parse(fs.readFileSync('ncqa-test-provider.json', 'utf8'));

const insPref = {
  snp: snpMeasures.find((snpMeasure) => snpMeasure === measure),
  medicare: medicareMeasures.find((medicareMeasure) => medicareMeasure === measure),
  medicaid: medicaidMeasures.find((medicaidMeasure) => medicaidMeasure === measure),
  mmp: mmpMeasures.find((mmpMeasure) => mmpMeasure === measure),
};

const snpHelper = (payor) => {
  if (insPref.medicare && insPref.snp) {
    return ['MCR', payor];
  } 
  if (!insPref.medicare && insPref.snp) {
    return [payor];
  }
  return ['MCR'];
}

const mmpMatrix = () => {
  if (insPref.medicare && insPref.medicaid && insPref.mmp) {
    return [ 'MCD', 'MCR', 'MMP' ];
  } else if (insPref.medicare && !insPref.medicaid && insPref.mmp) {
    return [ 'MCR', 'MMP' ];
  } else if (insPref.medicare && insPref.medicaid && !insPref.mmp) {
    return [ 'MCD', 'MCR' ];
  } else if (insPref.medicare && !insPref.medicaid && !insPref.mmp) {
    return [ 'MCR' ];
  } else if (!insPref.medicare && insPref.medicaid && !insPref.mmp) {
    return [ 'MCD' ];
  } else if (!insPref.medicare && !insPref.medicaid && insPref.mmp) {
    return [ 'MMP' ];
  }
}

const mmpHelper = (age) => {
  if (age) {
    return age < 66 ? [ 'MCD' ] : [ 'MCR' ];
  }
  return mmpMatrix();
}

const payorMap = (payor, age) => {
  if (payor.startsWith('SN')) {
    return snpHelper(payor);
  } else if (payor === 'MMP') {
    return mmpHelper(age);
  } else if (payor === 'MDE' || payor === 'MD' || payor === 'MLI' || payor === 'MRB') {
    return [ 'MCD' ];
  } else {
    return [ payor ];
  }
}

const getPayors = (payor, age) => {
  if (Array.isArray(payor)) {
    const finalArray = [];
    payor.forEach((pay) => {
      payorMap(pay, age).forEach((map) => finalArray.push(map));
    });
    return finalArray;
  }

  return payorMap(payor, age);
}

const getPreferredPayor = (latestCoverage) => {
  if (latestCoverage.length === 1) {
    return latestCoverage[0].payor;
  }
  const foundMedicare = [];
  const foundMedicaid = [];
  // Check if any are commercial plans
  let anyCommercial = false;
  let allCommercial = true;
  for (const cov of latestCoverage) {
    if (exchangeOrCommercial.includes(cov.payor)) {
      anyCommercial = true;
      continue;
    }
    allCommercial = false;
    if (medicarePlans.includes(cov.payor)) {
      foundMedicare.push(cov.payor);
    }
    if (medicaidPlans.includes(cov.payor)) {
      foundMedicaid.push(cov.payor);
    }
  }

  // If all commercial, use all
  if (allCommercial) {
    return latestCoverage.map((coverage) => coverage.payor)
  }

  // if any commercial plans exist use last item
  if (anyCommercial) {
    return latestCoverage[latestCoverage.length - 1].payor;
  }

  const combined = [];
  if (insPref.medicaid) {
    foundMedicaid.forEach((cov) => combined.push(cov));
  }

  if (insPref.medicare) {
    foundMedicare.forEach((cov) => combined.push(cov));
  }

  if (combined.length > 0) {
    return combined;
  }

  return latestCoverage[latestCoverage.length - 1].payor;
}

const getPayorArray = (foundPayors, age) => {
  // Now that we have the latest for the participation period, find the latest one
  let latestCoverage = [];
  for (const found of foundPayors) {
    if (latestCoverage.length === 0) {
      latestCoverage.push(found);
      continue;
    }
    if (latestCoverage[0].date < found.date) {
      latestCoverage = [found];
    } else if (latestCoverage[0].date == found.date) {
      latestCoverage.push(found);
    }
  }
  // if we have one, use that
  if (latestCoverage.length === 1) {
    return getPayors(latestCoverage[0].payor, age);
  }
  // if we have more than one we need to decide to either choose one or all
  return getPayors(getPreferredPayor(latestCoverage), age);      
}

const getValidPayors = (foundPayors, age, memberCoverage) => {
  if (foundPayors === undefined || foundPayors.length === 0) {
    if (memberCoverage.length === 0) {
      console.log('No coverage exists');
      return;
    }
    
    foundPayors = memberCoverage[memberCoverage.length - 1].payor[0].reference.value;
    return getPayors(foundPayors, age);
  }
  return getPayorArray(foundPayors, age);
}

const isValidCommercial = (payor, age) => {
  return commercial.includes(payor) && age >= 18 && age < 66;
}

const isValidExchange = (payor, age) => {
  return exchange.includes(payor) && age >= 18;
}

const isValidMedicaid = (payor, age) => {
  return medicaidPlans.includes(payor) && age >= 18 && age < 66;
}

const isValidMedicare = (payor, age) => {
  return medicarePlans.includes(payor) && age > 65;
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
    denCount: 1,
    denArray: true,
    eventsOrDiag: true,
    getAge: (data, index) => { // Age must be calculated against first event.
      let eventDate = new Date(data[data.memberId]['Encounter with Acute Bronchitis or Bronchiolitis'][index].low);
      const ageInMilliseconds = new Date(eventDate) - new Date(data.birthDate);
      return Math.floor(ageInMilliseconds / msInAYear);
    },
    ageArray: true, // If true, will use the provided index to get the current event's date. Else assumes it's a single date.
    getContinuousEnrollment: (data) => {
      return data[data.memberId]['Episode Date'].length >= 1 ? 1 : 0;
    },
    ceKey: 'Episode Date', // The key for Continuous Enrollment.
    ceArray: true,
    eventKey: 'Encounter with Acute Bronchitis or Bronchiolitis',
    eventArray: true,
    reqExKey: 'Episodes with Hospice Intervention or Encounter',
    reqExArray: true,
    measureCheck: secondQualifyingEpisodeCheck,
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
    measureCheck: (data, _index, measureFunctions) => {
      return measureFunctions.getAge(data) < 18;
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
    measureIds: ['BCS','BCSNON','BCSLISDE','BCSDIS','BCSCMB','BCSOT']
  },
  ccs: {
    measureIds: ['CCS'],
    measureCheck: () => true,
  },
  cise: {
    measureIds: ['CISDTP','CISOPV','CISMMR','CISHIB','CISHEPB','CISVZV','CISPNEU','CISHEPA','CISROTA','CISINFL','CISCMB3','CISCMB7','CISCMB10']
  },
  cole: {
    measureIds: ['COL','COLNON','COLLISDE','COLDIS','COLCMB','COLOT']
  },
  cou: {
    measureIds: ['COUA','COUB']
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
    measureCheck: () => true,
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

module.exports = { getAge, getContinuousEnrollment, getEligiblePopulation, getEvent, getExclusion, getNumerator, getRequiredExclusion, hedisData };