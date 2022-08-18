const config = require('./config');
const measure = config.measurementType;

const exchange = ['MEP', 'MMO', 'MOS', 'MPO'];
const commercial = ['CEP', 'HMO', 'POS', 'PPO'];
const exchangeOrCommercial = ['CEP', 'HMO', 'POS', 'PPO', 'MEP', 'MMO', 'MOS', 'MPO'];
const medicarePlans = ['MCR', 'MCS', 'MP', 'MC', 'MCR', 'SN1', 'SN2', 'SN3', 'MMP'];
const medicaidPlans = ['MD', 'MDE', 'MLI', 'MRB', 'MCD', 'MMP'];
const snpMeasures = []; // I don't think we'll ever have any of these for a while.
const medicareMeasures = ['aab', 'asfe', 'aise', 'bcse', 'cole', 'cou', 'cwp', 'dmse', 'fum', 'psa'];
const medicaidMeasures = ['aab', 'adde', 'apme', 'aise', 'asfe', 'bcse', 'ccs', 'cise', 'cou', 'cwp', 'dmse', 'fum', 'imae', 'pdse'];
const mmpMeasures = []; // As with SNPs.

const measurePlanInfo = {
  aab: {
    commercial: {},
    medicaid: {},
    medicare: {},
  },
  adde: {
    commercial: {},
    medicaid: {},
  },
  aise: {
    commercial: {
      ageStart: 19,
      ageEnd: 65,
    },
    medicaid: {
      ageStart: 19,
      ageEnd: 65
    },
    medicare: {
      ageStart: 66,
    },
  },
  apme: {
    commercial: {
      ageStart: 1,
      ageEnd: 17,
    },
    medicaid: {
      ageStart: 1,
      ageEnd: 17
    },
  },
  asfe: {
    commercial: {
      ageStart: 18,
    },
    medicaid: {
      ageStart: 18,
    },
    medicare: {
      ageStart: 18,
    },
  },
  bcse: {
    commercial: {},
    medicaid: {},
    medicare: {},
  },
  ccs: {
    commercial: {},
    medicaid: {},
  },
  cise: {
    commercial: {},
    medicaid: {},
  },
  cou: {
    commercial: {
      ageStart: 18
    },
    medicaid: {
      ageStart: 18
    },
    medicare: {
      ageStart: 18
    }
  },
  cole: {
    commercial: {},
    medicare: {}
  },
  cwp: {
    commercial: {},
    medicaid: {},
    medicare: {}
  },
  dmse: {
    commercial: {
      ageStart: 12,
    },
    medicaid: {
      ageStart: 12,
    },
    medicare: {
      ageStart: 18,
    },
  },
  fum: {
    commercial: {
      ageStart: 6
    },
    medicaid: {
      ageStart: 6
    },
    medicare: {
      ageStart: 6
    }
  },
  imae: {
    commercial: {},
    medicaid: {}
  },
  pdse: {
    commercial: {},
    medicaid: {}
  },
  psa: {
    commercial: {
      ageStart: 70
    },
    medicaid: {
      ageStart: 70
    },
    medicare: {
      ageStart: 70
    }
  },
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
  const payers = mmpMatrix();
  const finalList = [];
  payers.forEach((payer) => {
    if (medicaidPlans.includes(payer)) {
      if (planAgeCheck(measurePlanInfo[measure].medicaid, age)) {
        finalList.push(payer);
      }
    } else if (medicarePlans.includes(payer)) {
      if (planAgeCheck(measurePlanInfo[measure].medicare, age)) {
        finalList.push(payer);
      }
    } else {
      finalList.push(payer);
    }
  });
  return finalList;
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

const planAgeCheck = (planInfo, age) => {
  if (planInfo == undefined) {
    return false;
  }
  if (planInfo.ageStart && planInfo.ageStart > age) {
    return false;
  }
  return !(planInfo.ageEnd && planInfo.ageEnd < age);
}

const getPreferredPayor = (latestCoverage, age) => {
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
  if ( planAgeCheck(measurePlanInfo[measure].medicaid, age)) {
    foundMedicaid.forEach((cov) => combined.push(cov));
  }

  if (planAgeCheck(measurePlanInfo[measure].medicare, age)) {
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
  return getPayors(getPreferredPayor(latestCoverage, age), age);      
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

module.exports = { getValidPayors, isValidCommercial, isValidExchange, isValidMedicaid, isValidMedicare,
  exchange, medicarePlans, medicaidPlans, commercial, exchangeOrCommercial }
