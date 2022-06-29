const config = require('./config');

const msInADay = 1000 * 60 * 60 * 24;
const msInAYear = msInADay * 365.242;

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
    getAge: (data) => {
      let eventDate = new Date(data[data.memberId]['Last Calendar Day of February']);
      eventDate.setUTCHours(0,0,0,0);
      let eventDateMls = eventDate.getTime();
      const birthDate = new Date(data.birthDate);
      const eventYear = parseInt(eventDate.getFullYear());
      let birthYearCheck = parseInt(birthDate.getFullYear());

      while(birthYearCheck <= eventYear) {
        if (birthYearCheck % 4 === 0 && (birthDate.getMonth() + 1 > 2)) {
          eventDateMls += msInADay;
        }
        birthYearCheck += 1;
      }

      const ageInMilliseconds = eventDateMls - birthDate.getTime();
      return Math.floor(ageInMilliseconds / msInAYear);
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
  },
  aise: {
    measureIds: ['AISINFL','AISTD','AISZOS','AISPNEU']
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
    measureIds: ['FUM30A','FUM30B','FUM7A','FUM7B']
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

const getAge = (data, index) => { // Age must be calculated against first event.
  let eventDate = data[data.memberId][hedisData[config.measurementType].ageKey];
  if (hedisData[config.measurementType].ageArray) {
    eventDate = eventDate[index];
  }
  
  const ageInMilliseconds = new Date(eventDate) - new Date(data.birthDate);
  return Math.floor(ageInMilliseconds / msInAYear);
}

const getContinuousEnrollment = (data) => {
  const ce = data[data.memberId][hedisData[config.measurementType].ceKey];
  if(hedisData[config.measurementType].ceArray) {
    return ce.length >= 1 ? 1 : 0;
  } 
  // Handle other case.
}

const getEligiblePopulation = (ce, event, rExcl, rExclD) => {
  if (hedisData[config.measurementType].eventsOrDiag) { 
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
  const event = data[data.memberId][hedisData[config.measurementType].eventKey];
  if(hedisData[config.measurementType].eventArray) {
    return event.length >= 1 ? 1 : 0;
  }
  // Handle other case.
}

const getExclusion = (data, index) => {
  if (hedisData[config.measurementType].denArray) {
    if (hedisData[config.measurementType].denCount === 1) {
      return data[data.memberId].Exclusions.includes(data[data.memberId].Denominator[index]) ? 1 : 0;
    }
    return data[data.memberId][`Exclusions ${index}`].includes(data[data.memberId][`Denominator ${index}`][index]) ? 1 : 0;
  }
}

const getNumerator = (data, index) => {
  if (hedisData[config.measurementType].denArray) {
    if (hedisData[config.measurementType].denCount === 1) {
      return data[data.memberId].Numerator.includes(data[data.memberId].Denominator[index]) ? 1 : 0;
    }
    return data[data.memberId][`Numerator ${index}`].includes(data[data.memberId][`Denominator ${index}`][index]) ? 1 : 0;
  } // There's also 2 or 3 for DMS measures, the PHQ-9 measure.
}

const getRequiredExclusion = (data, index) => {
  if (hedisData[config.measurementType].denArray) {
    if (hedisData[config.measurementType].denCount === 1) {
      return data[data.memberId][hedisData[config.measurementType].reqExKey].includes(data[data.memberId].Denominator[index]) ? 1 : 0;
    }
    return data[data.memberId][`Numerator ${index}`].includes(data[data.memberId][`Denominator ${index}`][index]) ? 1 : 0;
  } // There's also 2 or 3 for DMS measures, the PHQ-9 measure.
}

module.exports = { getAge, getContinuousEnrollment, getEligiblePopulation, getEvent, getExclusion, getNumerator, getRequiredExclusion, hedisData };