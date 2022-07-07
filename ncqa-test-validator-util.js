const config = require('./config');
const measure = config.measurementType;

const msInADay = 1000 * 60 * 60 * 24;
const msInAYear = msInADay * 365.242; //.242;

const exchange = ['MEP', 'MMO', 'MOS', 'MPO'];
const commercial = ['CEP', 'HMO', 'POS', 'PPO'];
const exchangeOrCommercial = ['CEP', 'HMO', 'POS', 'PPO', 'MEP', 'MMO', 'MOS', 'MPO'];
const medicarePlans = ['MCR', 'MCS', 'MP', 'MC', 'MCR'];
const medicaidPlans = ['MD', 'MDE', 'MLI', 'MRB', 'MCD'];
const snpMeasures = []; // I don't think we'll ever have any of these for a while.
const medicareMeasures = ['asfe', 'fum'];
const medicaidMeasures = ['adde', 'aise', 'asfe', 'fum'];
const mmpMeasures = []; // As with SNPs.

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

const getPayors = (payor, age) => {
  if (Array.isArray(payor)) {
    return payor;
  }

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

const getPreferredPayor = (latestCoverage) => {
  if (latestCoverage.length === 1) {
    return latestCoverage[0].payor;
  }

  // Check if any are commercial plans
  let anyCommercial = false;
  let allCommercial = true;
  for (const cov of latestCoverage) {
    if (exchangeOrCommercial.includes(cov.payor)) {
      anyCommercial = true;
      continue;
    }
    allCommercial = false;
  }

  // If all commercial, use all
  if (allCommercial) {
    return latestCoverage.map((coverage) => coverage.payor)
  }

  // if any commercial plans exist use last item
  if (anyCommercial) {
    return latestCoverage[latestCoverage.length - 1].payor;
  }


  // If is a medicaid measure, check medicaid first
  if (insPref.medicaid) {
    for (const medicaidPlan of medicaidPlans) {
      for (const cov of latestCoverage) {
        if (cov.payor === medicaidPlan) {
          return medicaidPlan;
        }
      }
    }
    for (const medicarePlan of medicarePlans) {
      for (const cov of latestCoverage) {
        if (cov.payor === medicarePlan) {
          return medicarePlan;
        }
      }
    }
  // If it's a medicare measure, check medicare first
  } else if (insPref.medicare) {
    for (const medicarePlan of medicarePlans) {
      for (const cov of latestCoverage) {
        if (cov.payor === medicarePlan) {
          return medicarePlan;
        }
      }
    }
    for (const medicaidPlan of medicaidPlans) {
      for (const cov of latestCoverage) {
        if (cov.payor === medicaidPlan) {
          return medicaidPlan;
        }
      }
    }
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
  return commercial.includes(payor) && age > 18 && age < 66;
}

const isValidExchange = (payor, age) => {
  return exchange.includes(payor) && age > 18;
}

const isValidMedicaid = (payor, age) => {
  return medicaidPlans.includes(payor) && age > 18 && age < 66;
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
      let eventDate = new Date(data[data.memberId]['Last Calendar Day of February']);
      eventDate.setUTCHours(0,0,0,0);
      return getAge(new Date(data.birthDate), eventDate);
    },
    getEvent: (data, index) => { // Guess?
      const appAgeWNHN = data[data.memberId]['Member is Appropriate Age and Has IPSD with Negative Medication History'];

      if (index === 0) {
        return appAgeWNHN
          && data[data.memberId]['Acute Inpatient Encounter for Mental Behavioral or Neurodevelopmental Disorders During Initiation Phase'].length === 0
          && data[data.memberId]['Acute Inpatient Discharge for Mental Behavioral or Neurodevelopmental Disorders During Initiation Phase'].length === 0
          ? 1 : 0
      }
      return appAgeWNHN 
        && data[data.memberId]['Has 210 Medication Treatment Days in 301 Day Period Starting on IPSD and Continuing through End of Continuation and Maintenance Phase']
        && data[data.memberId]['Acute Inpatient Encounter for Mental Behavioral or Neurodevelopmental Disorders Before End of Continuation and Maintenance Phase']
        && data[data.memberId]['Acute Inpatient Discharge for Mental Behavioral or Neurodevelopmental Disorders Before End of Continuation and Maintenance Phase']
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
      return data[data.memberId][`Numerator ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    measureCheck: () => true,
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
      return measureFunctions.getAge(data) >= 18;
    },
    getAge: (data) => {
      let eventDate = new Date('2022-01-01');
      return getAge(new Date(data.birthDate), eventDate);
    },
    getEligiblePopulation: (data, index, measureFunctions) => {
      if (index == 0) {
        return 1;
      }
      const payors = measureFunctions.getPayors(data, index, measureFunctions);
      if (payors === undefined) {
        return false;
      }
      const payor = payors[0];
      const age = measureFunctions.getAge(data);
      return ((isValidCommercial(payor, age))
        || (isValidExchange(payor, age))
        || (isValidMedicaid(payor, age))
        || (isValidMedicare(payor, age))) ? 1 : 0;
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
    getAge: (data) => {
      let eventDate = data[data.memberId]['First Eligible ED Visits per 31 Day Period'][0];
      if (eventDate === undefined) {
        eventDate = data[data.memberId]['ED Visits With Principal Diagnosis of Mental Illness or Intentional Self-Harm'][0]?.low;
      }
      eventDate = new Date(eventDate);
      eventDate.setUTCHours(0,0,0,0);
      return getAge(new Date(data.birthDate), eventDate);
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
      return data[data.memberId][`Numerator ${numIndex + 1}`][dateIndex] !== undefined ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0, // INCORRECT.
    measureCheck: (data, index, measureFunctions) => {
      const age = measureFunctions.getAge(data);
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
        return getPayors(foundPayors, measureFunctions.getAge(data));
      }
      return getPayorArray(foundPayors, measureFunctions.getAge(data));
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