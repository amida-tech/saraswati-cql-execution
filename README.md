[![Build Status](https://travis-ci.org/cqframework/cql-execution.svg?branch=master)](https://travis-ci.org/cqframework/cql-execution)
[![codecov](https://codecov.io/gh/cqframework/cql-execution/branch/master/graph/badge.svg)](https://codecov.io/gh/cqframework/cql-execution)

# Saraswati CQL Execution
## Missing Medication Codes (Updated: 3/16/2021)
CQL files that require medication codes are don't include all of the necessary codes that are required by the HEDIS spec. This is because we are planning on creating a medication service that programmatically pulls all of the medication associated with a HEDIS measure at some point in the future (James Z/Mike have talked about this).

## Using VSAC URNs instead of the HEDIS specified URNs (Updated: 3/16/2021)
Any valuesets that are listed in CQL files and are NOT commented out are using a valueset URN (and therefore a list of codes in the `data/codes` directory) from VSAC; Long term, we want to be using the valueset URNs (and therefore codes associated with those URNs) from the valuesets listed in the HEDIS excel sheet that a few of us have licesnses to; however, we can't currently grab data from that excel sheet (programmatically or otherwise) due to some licensing issues. However,  Mike is a part of a HEDIS user group and thinks he may have access to the excel sheet, but hasn't looked into it yet.

## Generating ValueSet Codes from HEDISⓇ Measures.
As of September 2021, we received measurements from HEDIS that came with ValueSet codes. To generate these codes quickly, use the following command in this repo:
`node code-generator.js --dir=<directory that contains the files> --name=<output name of .js>`
The script will then generate the needed codes for you. The created file will be in the same directory you indicated, so be sure to move it to `/data/codes` after checking there are no issues and run a test there.

## Running Third Party CQL files
In order to run third party CQL files, please refere to [Third Party CQL Repository](https://github.com/amida-tech/ncqa-cql). From that repository choose which CQL files you would like to execute and placed them under the `private` folder under this repository. If there is not `private` folder, create one. Furthermore, follow the instructions below on how to generate ValueSet Codes from HEDIS measures.

# CQL Execution Framework

The CQL Execution Framework provides a JavaScript library for executing CQL artifacts expressed as
JSON ELM.

For more information, see the [CQL Execution Framework Overview](OVERVIEW.md).

# Data Model and Terminology Service Implementations

This library (`cql-execution`) focuses on supporting CQL's logical constructs; it does not provide
robust support for any particular data model or terminology service. To fully understand the benefit
of the CQL Execution Framework, it must be used with more robust data model providers (called
`PatientSource` implementations) and terminology providers (called `CodeService` implementations).

Implementors interested in executing electronic Clinical Quality Measures (eCQMs) using the QDM data
model should consider using the [cqm-execution](https://github.com/projecttacoma/cqm-execution)
project (which is based on `cql-execution`).

Implementors interested in executing FHIR-based CQL logic should consider using the
[cql-exec-fhir](https://github.com/cqframework/cql-exec-fhir) `PatientSource` with `cql-execution`.

Implementors interested in using the National Library of Medicine's Value Set Authority Center
(VSAC) as a terminology service for looking up value sets should consider using the
[cql-exec-vsac](https://github.com/cqframework/cql-exec-vsac) `CodeService` with `cql-execution`.

The [cql-exec-examples](https://github.com/cqframework/cql-exec-examples) project provides examples
of how `cql-execution`, `cql-exec-fhir`, and `cql-exec-vsac` can be used together.

# Current Limitations

This library supports operations defined in CQL 1.4 and 1.5, but is not yet a complete implementation.
Implementors should be aware of the following limitations and gaps in `cql-execution`:

* Direct support for specific data models is not provided by this library (see above for details).
* `PatientSource`, `CodeService`, and `Results` APIs are still evolving and subject to change.
* Since this library uses the JavaScript `Number` class for both CQL `Integer` and CQL `Decimal`,
  it may display the following limitations related to numbers and math:
  * Reduced precision compared to that which is specified by the CQL specification
  * Issues typically associated with floating point arithmetic
  * Decimals without a decimal portion (e.g., `2.0`) may be treated as CQL `Integer`s
* The following STU (non-normative) features introduced in CQL 1.5 are not yet supported:
  * `Long` datatype
  * Fluent functions
  * Retrieve search paths
  * Retrieve includes
* In addition the following features defined prior to CQL 1.5 are also not yet supported:
  * Related context retrieves
  * Unfiltered context retrieves
  * Unfiltered context references to other libraries
  * External functions

The above is a partial list covering the most significant limitations. For more details, see the
[CQL_Execution_Features.xlsx](CQL_Execution_Features.xlsx) spreadsheet.

# Project Configuration

To use this project, you should perform the following steps:

1. Install [Node.js](http://nodejs.org/)
2. Install [Yarn](https://yarnpkg.com)
3. Execute the following from the root directory: `yarn install`

# To Execute Your CQL

Please note that while the CQL Execution library supports many aspects of CQL, it does not support
everything in the CQL specification.  You should check to see what is implemented (by referencing
the unit tests) before expecting it to work! For a working example, see `examples`.

There are several steps involved to execute CQL. First, you must create a JSON representation of
the ELM. For the easiest integration, we will generate a JSON file using cql-to-elm:

1. Install the [Java 11 SDK](https://adoptopenjdk.net/)
2. Clone the [clinical_quality_language](https://github.com/cqframework/clinical_quality_language)
   repository to a location of your choice
3. `cd ${path_to_clinical_quality_language}/Src/java` (replacing
   `${path_to_clinical_quality_language}` with the path to the local clone)
4. `./gradlew :cql-to-elm:installDist`
5. `./cql-to-elm/build/install/cql-to-elm/bin/cql-to-elm --format=JSON --input ${path_to_cql} --output ${path_to_cql-execution}/customCQL`

The above example puts the example CQL into a subfolder of the `cql-execution` project to make the
relative paths to `cql-execution` libraries easier, but it doesn't _have_ to go there.  If you put
it elsewhere, you'll need to modify the examples below so that the `require` statements point to
the correct location of the `cql` export.

In the rest of the examples, we'll assume an `age.cql` file with the following contents. This
follows the example already in the "examples" folder (but of course you can use your own CQL):

```
library AgeAtMP version '1'

// NOTE: This example uses a custom data model that is very simplistic and suitable only for
// demonstration and testing purposes.  Real-world CQL should use a more appropriate model.
using Simple version '1.0.0'

parameter MeasurementPeriod default Interval[DateTime(2013, 1, 1, 0, 0, 0, 0), DateTime(2014, 1, 1, 0, 0, 0, 0))

context Patient

define InDemographic:
    AgeInYearsAt(start of MeasurementPeriod) >= 2 and AgeInYearsAt(start of MeasurementPeriod) < 18
```

Next, create a JavaScript file to execute the CQL above.  This file will need to contain (or
`require`) JSON patient representations for testing as well.  Our example CQL uses a "Simple"
data model developed only for demonstration and testing purposes.  In this model, each patient is
represented using a simple JSON object.  For ease of use, let's put the file in the `customCQL`
directory:

```js
const cql = require('../src/cql');
const measure = require('./age.json');

const lib = new cql.Library(measure);
const executor = new cql.Executor(lib);
const psource = new cql.PatientSource([ {
  'id' : '1',
  'recordType' : 'Patient',
  'name': 'John Smith',
  'gender': 'M',
  'birthDate' : '1980-02-17T06:15'
}, {
  'id' : '2',
  'recordType' : 'Patient',
  'name': 'Sally Smith',
  'gender': 'F',
  'birthDate' : '2007-08-02T11:47'
} ]);

const result = executor.exec(psource);
console.log(JSON.stringify(result, undefined, 2));

```

In the above file, we've assumed the JSON ELM JSON file for the measure is called
`age.json` and is in the same directory as the file that requires is.  We've
also assumed a couple of very simple patients.  Let's call the file we just created
`exec-age.js`.

Now we can execute the measure using Node.js:

```shell
node ${path_to_cql-execution}/customCQL/exec-age.js
```

If all is well, it should print the result object to standard out.

# To Run the CQL Execution Unit Tests

Execute `yarn test`.

# To Develop Tests

Many of the tests require JSON ELM data.  It is much easier to write CQL rather than JSON ELM, so
test authors should create test data by adding new CQL to _test/elm/*/data.cql_.  Some
conventions are followed to make testing easier.  The following is an example of some test data:

    // @Test: And
    define AllTrue: true and true
    define SomeTrue: true and false
    define AllFalse: false and false

The `// @Test: And` indicates the name of the test suite it applies to ("And").  The group of
statements that follows the `# And` represents the CQL Library that will be supplied as test data
to the "And" test suite.

To convert the CQL to JavaScript containing the JSON ELM representation, execute
`yarn build:test-data`. This will use the java _cql-to-elm_ project to generate the
_test/elm/*/data.js_ file containing the following exported variable declaration
(NOTE: It's been slimmed down a bit here to make it easier to read, but nothing substantial
has been removed):

```js
/* And
library TestSnippet version '1'
using Simple version '1.0.0'
context Patient
define AllTrue: true and true
define SomeTrue: true and false
define AllFalse: false and false
*/

module.exports['And'] = {
   "library" : {
      "identifier" : { "id" : "TestSnippet", "version" : "1" },
      "schemaIdentifier" : { "id" : "urn:hl7-org:elm", "version" : "r1" },
      "usings" : {
         "def" : [
           { "localIdentifier" : "System", "uri" : "urn:hl7-org:elm-types:r1" },
           { "localIdentifier" : "Simple", "uri" : "https://github.com/cqframework/cql-execution/simple", "version" : "1.0.0" }
         ]
      },
      "statements" : {
         "def" : [ {
            "name" : "Patient",
            "context" : "Patient",
            "expression" : {
               "type" : "SingletonFrom",
               "operand" : {
                  "dataType" : "{https://github.com/cqframework/cql-execution/simple}Patient",
                  "type" : "Retrieve"
               }
            }
         }, {
            "name" : "AllTrue",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "And",
               "operand" : [
                  { "valueType" : "{urn:hl7-org:elm-types:r1}Boolean", "value" : "true", "type" : "Literal" },
                  { "valueType" : "{urn:hl7-org:elm-types:r1}Boolean", "value" : "true", "type" : "Literal" }
               ]
            }
         }, {
            "name" : "SomeTrue",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "And",
               "operand" : [
                  { "valueType" : "{urn:hl7-org:elm-types:r1}Boolean", "value" : "true", "type" : "Literal" },
                  { "valueType" : "{urn:hl7-org:elm-types:r1}Boolean", "value" : "false", "type" : "Literal" }
               ]
            }
         }, {
            "name" : "AllFalse",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "And",
               "operand" : [
                  { "valueType" : "{urn:hl7-org:elm-types:r1}Boolean", "value" : "false", "type" : "Literal" },
                  { "valueType" : "{urn:hl7-org:elm-types:r1}Boolean", "value" : "false", "type" : "Literal" }
               ]
            }
         }
      ]}
   }
}
```

Notice that since the CQL didn't declare a library name/version, a data model, or a context,
default values were inserted into the CQL at generation time.  Now this CQL can be used in a test
defined in _test/elm/*/logical-test.js_.  For example:

```js
describe('And', () => {
  this.beforeEach(() => {
    setup(this, data);
  });

  it('should execute allTrue as true', () => {
    this.allTrue.exec(this.ctx).should.be.true();
  });

  it('should execute someTrue as false', () => {
    this.someTrue.exec(this.ctx).should.be.false();
  });

  it('should execute allFalse as false', () => {
    this.allFalse.exec(this.ctx).should.be.false();
  });
});
```

The test suite above uses [Mocha](http://visionmedia.github.io/mocha/) and
[Should.js](https://github.com/shouldjs/should.js).  The `setup` function sets up the test case by
creating `this.lib` (representing the `CqlLibrary` instance of the test data), creating `@this.ctx`
(representing a `Context` for execution), and creating local variables for each defined concept
(in this case, `this.allTrue`, `this.allFalse`, and `this.someTrue`).  Note that the local variables
use lowercase first letters even though the CQL expression name starts with an uppercase letter.

# Watching For Changes

Rather than continually having to run `yarn build:test-data` and `yarn:test` after every
modification to the test data text file, you can setup a process to _watch_ for changes and
regenerate the `data.js` files every time it detects changes in the source text file.  Simply
execute `yarn watch:test-data`.

# Pull Requests

If JavaScript source code is modified, `cql4browsers.js` needs to be included in the pull request,
otherwise Travis CI will fail. To generate this file, run:

```
yarn build:all
```

# Testing
To test locally you can create a Redpanda instance here:
`docker run -d --pull=always --name=redpanda-1 --rm -p 9092:9092 -p 9644:9644 docker.vectorized.io/vectorized/redpanda:latest redpanda start --overprovisioned --smp 1 --memory 1G --reserve-memory 0M --node-id 0 --check=false`

For a container to container approach, try:
`docker network create -d bridge rp`

`docker run -d --pull=always --name=redpanda-1 --network=rp -p 9092:9092 docker.vectorized.io/vectorized/redpanda:latest redpanda start --overprovisioned --smp 1  --memory 1G --reserve-memory 0M --node-id 0 --check=false --kafka-addr "PLAINTEXT://0.0.0.0:29092,OUTSIDE://0.0.0.0:9092" --advertise-kafka-addr "PLAINTEXT://redpanda:29092,OUTSIDE://redpanda-1:9092"`

Drop `--kafka-addr "PLAINTEXT://0.0.0.0:29092,OUTSIDE://0.0.0.0:9092" --advertise-kafka-addr "PLAINTEXT://redpanda:29092,OUTSIDE://redpanda-1:9092"` to connect via localhost.

To run `saraswati-cql-execution`, build with: 
`docker build -t saraswati-cql-execution .` 

Then run the following, but with desired environmental variables:
`docker run --mount type=bind,source=<directory to>\private,target=/app/private -e MEASUREMENT_FILE=private/DRRE_HEDIS_MY2022-1.0.0/elm/DRRE_HEDIS_MY2022-1.0.0.json -e MEASUREMENT_TYPE=drre -e LIRARIES_DIRECTORY=private/DRRE_HEDIS_MY2022-1.0.0/libraryElm/ -e VALUESETS_DIRECTORY=private/DRRE_HEDIS_MY2022-1.0.0/valuesets/ -e KAFKA_BROKERS=["redpanda1:29092", "redpanda1:29093"] -e KAFKA_CONSUMED_TOPIC=fhir-logged -e KAFKA_PRODUCED_TOPIC=hedis-measures saraswati-cql-execution`

# Environmental Variables
`MEASUREMENT_FILE`: The actual measurement file you want to run. For example, `MEASUREMENT_FILE=private\CISE_HEDIS_MY2022-1.0.0\elm\CISE_HEDIS_MY2022-1.0.0.json`
`LIBRARIES_DIRECTORY`: The directory of the required libraries for the `MEASUREMENT_FILE`. For example, `LIBRARIES_DIRECTORY=private\CISE_HEDIS_MY2022-1.0.0\libraryElm\`
`VALUESETS_DIRECTORY`: The directory of the required value sets for the MEASUREMENT_FILE. For example, `VALUESETS_DIRECTORY=private\CISE_HEDIS_MY2022-1.0.0\valuesets\`
`MEASUREMENT_TYPE`: The measurement type. Used to mark the resulting scores. When running `"localread"`
   in development mode, it will check the matching `"data/patients/"` folder.

# Valueset CQL Generation

For AAB, CWP and URI, the following process can rewrite the CQL to be faster. The script can be run by pointing it at the file inside the private folder you want to convert. For example...
`node vset-cql-generator.js --file=C:\Users\James\workspaces\saraswati-cql-execution\private\1.1.0\AAB_HEDIS_MY2022-1.1.0\cql\AAB_HEDIS_MY2022-1.1.0.cql`

Do not move the CQL file from its location in the private folder. It also checks value set files the neighboring folders. When finished, it will inform you of the created script and its location.

Copy this file into the libraryCql folder neighboring the cql folder. To run the cql-to-elm transformation, navigate to the following folder inside the `clinical_quality_language` repo:
`clinical_quality_language\Src\java\cql-to-elm\build\install\cql-to-elm\bin`

Then run this CLI command, changing the folders to your local spots:
`cql-to-elm --format=JSON --compatibility-level=1.4 --input saraswati-cql-execution\private\1.1.0\AAB_HEDIS_MY2022-1.0.0\libraryCql\Amida_AAB_HEDIS_MY2022-1.1.0.cql --output saraswati-cql-execution\private\1.1.0\AAB_HEDIS_MY2022-1.1.0\elm\Amida_AAB_HEDIS_MY2022-1.1.0.json`

`./cql-to-elm --format=JSON --compatibility-level=1.4 --input ~/Documents/saraswati/saraswati-cql-execution/private/2022/1.1.0/AAB_HEDIS_MY2022-1.1.0/libraryCql/AAB_Support-1.1.0.cql --output ~/Documents/saraswati/saraswati-cql-execution/private/2022/1.1.0/AAB_HEDIS_MY2022-1.1.0/elm/AAB_Support-1.1.0.json`

Finally, in saraswati-cql-execution, change the `.env` features to this:

`MEASUREMENT_FILE=private\AAB_HEDIS_MY2022-1.0.0\elm\Amida_AAB_HEDIS_MY2022-1.0.0.json`
`LIBRARIES_DIRECTORY=private\AAB_HEDIS_MY2022-1.0.0\libraryElm\`
`VALUESETS_DIRECTORY=private\AAB_HEDIS_MY2022-1.0.0\valuesets\`
`MEASUREMENT_TYPE=aab`
