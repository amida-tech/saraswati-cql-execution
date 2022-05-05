const getIdentifier = (element) => {
  let id = '';
  if (element.fullUrl) {
    id = element.fullUrl;
  } else if (element.resource && element.resource.id) {
    id = element.resource.id;
  } else if (element.resource && element.resource.reference) {
    id = element.resource.reference;
  } else if (element.id) {
    id = element.id;
  } else if (element.reference) {
    id = element.reference;
  }
  return id;
};

const addToArray = (arrayToCheck, objectToAdd) => {
  let addValue = true;
  for (const element of arrayToCheck) {
    let itemId = getIdentifier(element);
    let objectId = getIdentifier(objectToAdd);

    if (itemId === objectId) {
      addValue = false;
      break;
    }
  }

  if (addValue) {
    arrayToCheck.push(objectToAdd);
  }
};

const addArrayToArray = (arrayToCheck, arrayToAdd) => {
  arrayToAdd.forEach((element) => {
    if (element.actor) {
      addToArray(arrayToCheck, element.actor);
    } else if (element.individual) {
      addToArray(arrayToCheck, element.individual);
    } else if (element.provider) {
      addToArray(arrayToCheck, element.provider);
    } else if (element.reference) {
      addToArray(arrayToCheck, element);
    }
  });
};

const handleEncounter = (providers, fhirResource) => {
  if (fhirResource.serviceProvider) {
    addToArray(providers, fhirResource.serviceProvider);
  }
  if (fhirResource.participant) {
    addArrayToArray(providers, fhirResource.participant);
  }
}

const handleClaim = (providers, fhirResource) => {
  if (fhirResource.provider) {
    addToArray(providers, fhirResource.provider);
  }
  if (fhirResource.careTeam) {
    addArrayToArray(providers, fhirResource.careTeam);
  }
}

const handleObservation = (providers, fhirResource) => {
  if (fhirResource.provider) {
    addToArray(providers, fhirResource.provider);
  }
  if (fhirResource.performer) {
    addArrayToArray(providers, fhirResource.performer);
  }
}

const handleCondition = (providers, fhirResource) => {
  if (fhirResource.recorder) {
    addToArray(providers, fhirResource.recorder);
  }
  if (fhirResource.asserter) {
    addToArray(providers, fhirResource.asserter);
  }
}

const createProviderList = (patient) => {
  const entryList = Array.isArray(patient) ? patient[0].entry : patient.entry;
  let providers = [];
  entryList.forEach((entry) => {
    const fhirResource = entry.resource;
    const resourceType = fhirResource.resourceType;
    if (resourceType === 'Practitioner' ||
        resourceType === 'PractitionerRole' ||
        resourceType === 'Organization') {
      addToArray(providers, entry);
    } else if (resourceType === 'Encounter') {
      handleEncounter(providers, fhirResource);
    } else if (resourceType === 'Claim') {
      handleClaim(providers, fhirResource);
    } else if (resourceType === 'Observation') {
      handleObservation(providers, fhirResource);
    } else if ((resourceType === 'Immunization' ||
                resourceType === 'Procedure' ||
                resourceType === 'MedicationDispense') && fhirResource.performer) {
      addArrayToArray(providers, fhirResource.performer);
    } else if (resourceType === 'Condition' && fhirResource.recorder) {
      handleCondition(providers, fhirResource);
    }
  });

  return providers;
};

module.exports = { createProviderList }