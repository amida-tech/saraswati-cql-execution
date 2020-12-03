# Copyright (c) 2014 The MITRE Corporation
# All rights reserved.
# 
# Redistribution and use in source and binary forms, with or without modification, 
# are permitted provided that the following conditions are met:
# 
#     * Redistributions of source code must retain the above copyright notice, this 
#       list of conditions and the following disclaimer.
#     * Redistributions in binary form must reproduce the above copyright notice, 
#       this list of conditions and the following disclaimer in the documentation 
#       and/or other materials provided with the distribution.
#     * Neither the name of HL7 nor the names of its contributors may be used to 
#       endorse or promote products derived from this software without specific 
#       prior written permission.
# 
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
# IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
# INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
# NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR 
# PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
# WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
# POSSIBILITY OF SUCH DAMAGE.
DT = require '../cql-datatypes'
CORE = require('./core')
Element = CORE.Element
Resource = CORE.Resource
Timing = CORE.Timing
Period = CORE.Period
Parameters = CORE.Parameters
Coding = CORE.Coding
Resource = CORE.Resource
Range = CORE.Range
Quantity = CORE.Quantity
Attachment = CORE.Attachment
BackboneElement = CORE.BackboneElement
DomainResource = CORE.DomainResource
ContactPoint = CORE.ContactPoint
ElementDefinition = CORE.ElementDefinition
Extension = CORE.Extension
HumanName = CORE.HumanName
Address = CORE.Address
Ratio = CORE.Ratio
SampledData = CORE.SampledData
Reference = CORE.Reference
CodeableConcept = CORE.CodeableConcept
Identifier = CORE.Identifier
Narrative = CORE.Narrative
Element = CORE.Element
DiagnosisComponent = CORE.DiagnosisComponent

###* 
Embedded class
@class ContactComponent
@exports  ContactComponent as ContactComponent
###
class ContactComponent extends BackboneElement
  constructor: (@json) ->
    super(@json)
  ###*
  The nature of the relationship between the patient and the contact person.
  @returns {Array} an array of {@link CodeableConcept} objects
  ###
  relationship: ->
    if @json['relationship']
      for item in @json['relationship']
        new CodeableConcept(item)
  
  ###*
  A name associated with the person.
  @returns {HumanName}
  ###
  name: -> if @json['name'] then new HumanName(@json['name'])
  
  ###*
  A contact detail for the person, e.g. a telephone number or an email address.
  @returns {Array} an array of {@link ContactPoint} objects
  ###
  telecom: ->
    if @json['telecom']
      for item in @json['telecom']
        new ContactPoint(item)
  
  ###*
  Address for the contact person.
  @returns {Address}
  ###
  address: -> if @json['address'] then new Address(@json['address'])
  
  ###*
  Administrative Gender - the gender that the person is considered to have for administration and record keeping purposes.
  @returns {Array} an array of {@link String} objects
  ###
  gender:-> @json['gender']
  
  ###*
  Organization on behalf of which the contact is acting or for which the contact is working.
  @returns {Reference}
  ###
  organization: -> if @json['organization'] then new Reference(@json['organization'])
  
  ###*
  The period during which this person or organisation is valid to be contacted relating to this patient.
  @returns {Period}
  ###
  period: -> if @json['period'] then new Period(@json['period'])
  

###* 
Embedded class
@class AnimalComponent
@exports  AnimalComponent as AnimalComponent
###
class AnimalComponent extends BackboneElement
  constructor: (@json) ->
    super(@json)
  ###*
  Identifies the high level categorization of the kind of animal.
  @returns {CodeableConcept}
  ###
  species: -> if @json['species'] then new CodeableConcept(@json['species'])
  
  ###*
  Identifies the detailed categorization of the kind of animal.
  @returns {CodeableConcept}
  ###
  breed: -> if @json['breed'] then new CodeableConcept(@json['breed'])
  
  ###*
  Indicates the current state of the animal's reproductive organs.
  @returns {CodeableConcept}
  ###
  genderStatus: -> if @json['genderStatus'] then new CodeableConcept(@json['genderStatus'])
  

###* 
Embedded class
@class PatientLinkComponent
@exports  PatientLinkComponent as PatientLinkComponent
###
class PatientLinkComponent extends BackboneElement
  constructor: (@json) ->
    super(@json)
  ###*
  The other patient resource that the link refers to.
  @returns {Reference}
  ###
  other: -> if @json['other'] then new Reference(@json['other'])
  
  ###*
  The type of link between this patient resource and another patient resource.
  @returns {Array} an array of {@link String} objects
  ###
  type:-> @json['type']
  
###*
A provider issued list of professional services and products which have been provided, or are to be provided, to a patient which is sent to an insurer for reimbursement.
@class Claim
@exports Claim as Claim
###
class Claim extends DomainResource
  constructor: (@json) ->
    super(@json)
  ###*
  The business identifier for the instance: invoice number, claim number, pre-determination or pre-authorization number.
  @returns {Array} an array of {@link Identifier} objects
  ###
  identifier: ->
    if @json['identifier']
      for item in @json['identifier']
        new Identifier(item)
  
  ###*
  The version of the specification on which this instance relies.
  @returns {Coding}
  ###
  ruleset: -> if @json['ruleset'] then new Coding(@json['ruleset'])
  
  ###*
  The version of the specification from which the original instance was created.
  @returns {Coding}
  ###
  originalRuleset: -> if @json['originalRuleset'] then new Coding(@json['originalRuleset'])
  
  ###*
  The date when the enclosed suite of services were performed or completed.
  @returns {Array} an array of {@link Date} objects
  ###
  date:-> if @json['date'] then DT.DateTime.parse(@json['date'])
  
  ###*
  Insurer Identifier, typical BIN number (6 digit).
  @returns {Reference}
  ###
  target: -> if @json['target'] then new Reference(@json['target'])
  
  ###*
  The provider which is responsible for the bill, claim pre-determination, pre-authorization.
  @returns {Reference}
  ###
  provider: -> if @json['provider'] then new Reference(@json['provider'])
  
  ###*
  The organization which is responsible for the bill, claim pre-determination, pre-authorization.
  @returns {Reference}
  ###
  organization: -> if @json['organization'] then new Reference(@json['organization'])
  
  ###*
  Complete (Bill or Claim), Proposed (Pre-Authorization), Exploratory (Pre-determination).
  @returns {Array} an array of {@link String} objects
  ###
  use:-> @json['use']
  
  ###*
  Immediate (STAT), best effort (NORMAL), deferred (DEFER).
  @returns {Coding}
  ###
  priority: -> if @json['priority'] then new Coding(@json['priority'])
  
  ###*
  In the case of a Pre-Determination/Pre-Authorization the provider may request that funds in the amount of the expected Benefit be reserved ('Patient' or 'Provider') to pay for the Benefits determined on the subsequent claim(s). 'None' explicitly indicates no funds reserving is requested.
  @returns {Coding}
  ###
  fundsReserve: -> if @json['fundsReserve'] then new Coding(@json['fundsReserve'])
  
  ###*
  Person who created the invoice/claim/pre-determination or pre-authorization.
  @returns {Reference}
  ###
  enterer: -> if @json['enterer'] then new Reference(@json['enterer'])
  
  ###*
  Facility where the services were provided.
  @returns {Reference}
  ###
  facility: -> if @json['facility'] then new Reference(@json['facility'])
  
  ###*
  Theparty to be reimbused for the services.
  @returns {PayeeComponent}
  ###
  payee: -> if @json['payee'] then new PayeeComponent(@json['payee'])
  
  ###*
  The referral resource which lists the date, practitioner, reason and other supporting information.
  @returns {Reference}
  ###
  referral: -> if @json['referral'] then new Reference(@json['referral'])
  
  ###*
  Ordered list of patient diagnosis for which care is sought.
  @returns {Array} an array of {@link DiagnosisComponent} objects
  ###
  diagnosis: ->
    if @json['diagnosis']
      for item in @json['diagnosis']
        new DiagnosisComponent(item)
  
  ###*
  List of patient conditions for which care is sought.
  @returns {Array} an array of {@link Coding} objects
  ###
  condition: ->
    if @json['condition']
      for item in @json['condition']
        new Coding(item)
  
  ###*
  Patient Resource.
  @returns {Reference}
  ###
  patient: -> if @json['patient'] then new Reference(@json['patient'])
  
  ###*
  Financial instrument by which payment information for health care.
  @returns {Array} an array of {@link CoverageComponent} objects
  ###
  coverage: ->
    if @json['coverage']
      for item in @json['coverage']
        new CoverageComponent(item)
  
  ###*
  Factors which may influence the applicability of coverage.
  @returns {Array} an array of {@link Coding} objects
  ###
  exception: ->
    if @json['exception']
      for item in @json['exception']
        new Coding(item)
  
  ###*
  Name of school for over-aged dependants.
  @returns {Array} an array of {@link String} objects
  ###
  school:-> @json['school']
  
  ###*
  Date of an accident which these services are addessing.
  @returns {Array} an array of {@link Date} objects
  ###
  accident:-> if @json['accident'] then DT.DateTime.parse(@json['accident'])
  
  ###*
  Type of accident: work, auto, etc.
  @returns {Coding}
  ###
  accidentType: -> if @json['accidentType'] then new Coding(@json['accidentType'])
  
  ###*
  A list of intervention and exception codes which may influence the adjudication of the claim.
  @returns {Array} an array of {@link Coding} objects
  ###
  interventionException: ->
    if @json['interventionException']
      for item in @json['interventionException']
        new Coding(item)
  



module.exports.Claim = Claim