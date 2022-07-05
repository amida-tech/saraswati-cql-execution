const config = require('./config');
const measure = config.measurementType;

const msInADay = 1000 * 60 * 60 * 24;
const msInAYear = msInADay * 365.242;

const exchangeOrCommercial = ['CEP', 'HMO', 'POS', 'PPO', 'MEP', 'MMO', 'MOS', 'MPO'];
const medicarePlans = ['MCR', 'MCS', 'MP', 'MC'];
const medicaidPlans = ['MD', 'MDE', 'MLI', 'MRB'];
const snpMeasures = []; // I don't think we'll ever have any of these for a while.
const medicareMeasures = [];
const medicaidMeasures = ['adde'];
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

const mmpHelper = () => {
  if (insPref.medicare && insPref.medicaid && insPref.mmp) {
    return [ 'MCR', 'MCD', 'MMP' ];
  } else if (insPref.medicare && !insPref.medicaid && insPref.mmp) {
    return [ 'MCR', 'MMP' ];
  } else if (insPref.medicare && insPref.medicaid && !insPref.mmp) {
    return [ 'MCR', 'MCD' ];
  } else if (insPref.medicare && !medicaid && !insPref.mmp) {
    return [ 'MCR' ];
  } else if (!insPref.medicare && insPref.medicaid && !insPref.mmp) {
    return [ 'MCD' ];
  } else if (!insPref.medicare && !insPref.medicaid && insPref.mmp) {
    return [ 'MMP' ];
  }
}

const getPayors = (payor) => {
  if (Array.isArray(payor)) {
    return payor;
  }

  if (payor.startsWith('SN')) {
    return snpHelper(payor);
  } else if (payor === 'MMP') {
    return mmpHelper();
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

const getPayorArray = (foundPayors) => {
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
    return getPayors(latestCoverage[0].payor);
  }
  // if we have more than one we need to decide to either choose one or all
  return getPayors(getPreferredPayor(latestCoverage));      
}

const secondQualifyingEpisodeCheck = (data, index) => {
  if (index === 0) {
    return true;
  }
  return data[data.memberId]['Qualifying Episodes Without Exclusions'].length > 1;
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
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      return data[data.memberId][`Numerator ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    measureCheck: () => true,
    getPayors: (data, index) => {
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
        .map((coverage) => {
          return {
            payor: coverage.payor[0].reference.value,
            date: new Date(coverage.period.end.value).getTime(),
          }
        });
      // if none are found, use the latest is Member Coverage
      if (foundPayors === undefined || foundPayors.length === 0) {
        foundPayors = memberCoverage[memberCoverage.length - 1].payor[0].reference.value;
        return getPayors(foundPayors);
      }

      return getPayorArray(foundPayors);
    }
  },
  aise: {
    measureIds: ['AISINFL','AISTD','AISZOS','AISPNEU'],
    eventsOrDiag: false,
    measureCheck: (data, index) => {
      let eventDate = new Date('2022-01-01');
      if (index == 1 || index == 2) {
        return getAge(new Date(data.birthDate), eventDate) >= 19;
      } else if (index == 3) {
        return getAge(new Date(data.birthDate), eventDate) >= 50;
      } else if (index == 4) {
        return getAge(new Date(data.birthDate), eventDate) >= 66;
      }
      return false;
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
    getPayors: (data, index) => {
      return ['test'];
    }
  },
  apme: {
    measureIds: ['APM1','APM2','APM3']
  },
  asfe: {
    measureIds: ['ASFA','ASFB']
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
    getContinuousEnrollment: (data, index) => {
      return data[data.memberId][`First Eligible ED Visits per 31 Day Period`] ? 1 : 0;
    },
    getEvent: (data, index) => {
      return 1;
    },
    getExclusion: () => 0,
    getNumerator: (data, index) => {
      const numIndex = index % 2 // Deciding between FUM30 and FUM7.
      const dateIndex = Math.floor(date / 2); // Won't ever go over 1. 
      return data[data.memberId][`Numerator ${numIndex + 1}`][dateIndex] !== undefined ? 1 : 0;
    },
    getRequiredExclusion: (data, index) => {
      return data[data.memberId][`Exclusions ${index + 1}`] ? 1 : 0;
    },
    getRequiredExclusionID: () => 0,
    measureCheck: (data, index) => {
      if (index < 2) { // We always want a result back for FUM30A and FUM7A.
        return true;
      }
      return data[data.memberId]['Initial Population 2'].length > 1;
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
  let eventDateMls = compareDate.getTime();
  const eventYear = parseInt(compareDate.getFullYear());
  let birthYearCheck = parseInt(birthDate.getFullYear());

  while(birthYearCheck <= eventYear) {
    if (birthYearCheck % 4 === 0 && (birthDate.getMonth() + 1 > 2)) {
      eventDateMls += msInADay;
    }
    birthYearCheck += 1;
  }
  const ageInMilliseconds = eventDateMls - birthDate.getTime();
  return Math.floor(ageInMilliseconds / msInAYear);
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