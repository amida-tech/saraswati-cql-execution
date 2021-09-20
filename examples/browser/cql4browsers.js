(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* eslint-disable
    no-undef,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
window.cql = require('../../lib/cql');

window.executeSimpleELM = function (
  elm,
  patientSource,
  valueSets,
  libraryName,
  version,
  executionDateTime,
  parameters = {}
) {
  let lib;
  if (Array.isArray(elm)) {
    if (elm.length > 1) {
      const rep = new window.cql.Repository(elm);
      lib = rep.resolve(libraryName, version);
    } else {
      lib = new window.cql.Library(elm[0]);
    }
  } else {
    lib = new window.cql.Library(elm);
  }

  const codeService = new window.cql.CodeService(valueSets);
  const executor = new window.cql.Executor(lib, codeService, parameters);
  return executor.exec(patientSource, executionDateTime);
};

},{"../../lib/cql":4}],2:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./datatypes/datatypes'),
    Code = _require.Code,
    ValueSet = _require.ValueSet;

var CodeService = /*#__PURE__*/function () {
  function CodeService() {
    var valueSetsJson = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CodeService);

    this.valueSets = {};

    for (var oid in valueSetsJson) {
      this.valueSets[oid] = {};

      for (var version in valueSetsJson[oid]) {
        var codes = valueSetsJson[oid][version].map(function (code) {
          return new Code(code.code, code.system, code.version);
        });
        this.valueSets[oid][version] = new ValueSet(oid, version, codes);
      }
    }
  }

  _createClass(CodeService, [{
    key: "findValueSetsByOid",
    value: function findValueSetsByOid(oid) {
      return this.valueSets[oid] ? Object.values(this.valueSets[oid]) : [];
    }
  }, {
    key: "findValueSet",
    value: function findValueSet(oid, version) {
      if (version != null) {
        return this.valueSets[oid] != null ? this.valueSets[oid][version] : undefined;
      } else {
        var results = this.findValueSetsByOid(oid);

        if (results.length === 0) {
          return null;
        } else {
          return results.reduce(function (a, b) {
            if (a.version > b.version) {
              return a;
            } else {
              return b;
            }
          });
        }
      }
    }
  }]);

  return CodeService;
}();

module.exports.CodeService = CodeService;
},{"./datatypes/datatypes":6}],3:[function(require,module,exports){
"use strict";

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DT = require('./datatypes/datatypes');

var Record = /*#__PURE__*/function () {
  function Record(json) {
    _classCallCheck(this, Record);

    this.json = json;
    this.id = this.json.id;
  }

  _createClass(Record, [{
    key: "_is",
    value: function _is(typeSpecifier) {
      return this._typeHierarchy().some(function (t) {
        return t.type === typeSpecifier.type && t.name == typeSpecifier.name;
      });
    }
  }, {
    key: "_typeHierarchy",
    value: function _typeHierarchy() {
      return [{
        name: "{https://github.com/cqframework/cql-execution/simple}".concat(this.json.recordType),
        type: 'NamedTypeSpecifier'
      }, {
        name: '{https://github.com/cqframework/cql-execution/simple}Record',
        type: 'NamedTypeSpecifier'
      }, {
        name: '{urn:hl7-org:elm-types:r1}Any',
        type: 'NamedTypeSpecifier'
      }];
    }
  }, {
    key: "_recursiveGet",
    value: function _recursiveGet(field) {
      if (field != null && field.indexOf('.') >= 0) {
        var _field$split = field.split('.', 2),
            _field$split2 = _slicedToArray(_field$split, 2),
            root = _field$split2[0],
            rest = _field$split2[1];

        return new Record(this._recursiveGet(root))._recursiveGet(rest);
      }

      return this.json[field];
    }
  }, {
    key: "get",
    value: function get(field) {
      // the model should return the correct type for the field. For this simple model example,
      // we just cheat and use the shape of the value to determine it. Real implementations should
      // have a more sophisticated approach
      var value = this._recursiveGet(field);

      if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}(T[\d\-.]+)?/.test(value)) {
        return this.getDate(field);
      }

      if (value != null && _typeof(value) === 'object' && value.code != null && value.system != null) {
        return this.getCode(field);
      }

      if (value != null && _typeof(value) === 'object' && (value.low != null || value.high != null)) {
        return this.getInterval(field);
      }

      return value;
    }
  }, {
    key: "getId",
    value: function getId() {
      return this.id;
    }
  }, {
    key: "getDate",
    value: function getDate(field) {
      var val = this._recursiveGet(field);

      if (val != null) {
        return DT.DateTime.parse(val);
      } else {
        return null;
      }
    }
  }, {
    key: "getInterval",
    value: function getInterval(field) {
      var val = this._recursiveGet(field);

      if (val != null && _typeof(val) === 'object') {
        var low = val.low != null ? DT.DateTime.parse(val.low) : null;
        var high = val.high != null ? DT.DateTime.parse(val.high) : null;
        return new DT.Interval(low, high);
      }
    }
  }, {
    key: "getDateOrInterval",
    value: function getDateOrInterval(field) {
      var val = this._recursiveGet(field);

      if (val != null && _typeof(val) === 'object') {
        return this.getInterval(field);
      } else {
        return this.getDate(field);
      }
    }
  }, {
    key: "getCode",
    value: function getCode(field) {
      var val = this._recursiveGet(field);

      if (val != null && _typeof(val) === 'object') {
        return new DT.Code(val.code, val.system, val.version);
      }
    }
  }]);

  return Record;
}();

var Patient = /*#__PURE__*/function (_Record) {
  _inherits(Patient, _Record);

  var _super = _createSuper(Patient);

  function Patient(json) {
    var _this;

    _classCallCheck(this, Patient);

    _this = _super.call(this, json);
    _this.name = json.name;
    _this.gender = json.gender;
    _this.birthDate = json.birthDate != null ? DT.DateTime.parse(json.birthDate) : undefined;
    _this.records = {};
    (json.records || []).forEach(function (r) {
      if (_this.records[r.recordType] == null) {
        _this.records[r.recordType] = [];
      }

      _this.records[r.recordType].push(new Record(r));
    });
    return _this;
  }

  _createClass(Patient, [{
    key: "findRecords",
    value: function findRecords(profile) {
      if (profile == null) {
        return [];
      }

      var recordType = profile.match(/(\{https:\/\/github\.com\/cqframework\/cql-execution\/simple\})?(.*)/)[2];

      if (recordType === 'Patient') {
        return [this];
      } else {
        return this.records[recordType] || [];
      }
    }
  }]);

  return Patient;
}(Record);

var PatientSource = /*#__PURE__*/function () {
  function PatientSource(patients) {
    _classCallCheck(this, PatientSource);

    this.patients = patients;
    this.nextPatient();
  }

  _createClass(PatientSource, [{
    key: "currentPatient",
    value: function currentPatient() {
      return this.current;
    }
  }, {
    key: "nextPatient",
    value: function nextPatient() {
      var currentJSON = this.patients.shift();
      this.current = currentJSON ? new Patient(currentJSON) : undefined;
      return this.current;
    }
  }]);

  return PatientSource;
}();

module.exports.Patient = Patient;
module.exports.PatientSource = PatientSource;
},{"./datatypes/datatypes":6}],4:[function(require,module,exports){
"use strict";

var library = require('./elm/library');

var expression = require('./elm/expression');

var repository = require('./runtime/repository');

var context = require('./runtime/context');

var exec = require('./runtime/executor');

var results = require('./runtime/results');

var datatypes = require('./datatypes/datatypes');

var patient = require('./cql-patient');

var codeservice = require('./cql-code-service'); // Library-related classes


module.exports.Library = library.Library;
module.exports.Repository = repository.Repository;
module.exports.Expression = expression.Expression; // Execution-related classes

module.exports.Context = context.Context;
module.exports.Executor = exec.Executor;
module.exports.PatientContext = context.PatientContext;
module.exports.UnfilteredContext = context.UnfilteredContext;
module.exports.Results = results.Results; // PatientSource-related classes

module.exports.Patient = patient.Patient;
module.exports.PatientSource = patient.PatientSource; // TerminologyService-related classes

module.exports.CodeService = codeservice.CodeService; // DataType classes

module.exports.Code = datatypes.Code;
module.exports.CodeSystem = datatypes.CodeSystem;
module.exports.Concept = datatypes.Concept;
module.exports.Date = datatypes.Date;
module.exports.DateTime = datatypes.DateTime;
module.exports.Interval = datatypes.Interval;
module.exports.Quantity = datatypes.Quantity;
module.exports.Ratio = datatypes.Ratio;
module.exports.ValueSet = datatypes.ValueSet;
},{"./cql-code-service":2,"./cql-patient":3,"./datatypes/datatypes":6,"./elm/expression":22,"./elm/library":27,"./runtime/context":41,"./runtime/executor":42,"./runtime/repository":43,"./runtime/results":44}],5:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../util/util'),
    typeIsArray = _require.typeIsArray;

var Code = /*#__PURE__*/function () {
  function Code(code, system, version, display) {
    _classCallCheck(this, Code);

    this.code = code;
    this.system = system;
    this.version = version;
    this.display = display;
  }

  _createClass(Code, [{
    key: "hasMatch",
    value: function hasMatch(code) {
      if (typeof code === 'string') {
        // the specific behavior for this is not in the specification. Matching codesystem behavior.
        return code === this.code;
      } else {
        return codesInList(toCodeList(code), [this]);
      }
    }
  }, {
    key: "isCode",
    get: function get() {
      return true;
    }
  }]);

  return Code;
}();

var Concept = /*#__PURE__*/function () {
  function Concept(codes, display) {
    _classCallCheck(this, Concept);

    this.codes = codes || [];
    this.display = display;
  }

  _createClass(Concept, [{
    key: "hasMatch",
    value: function hasMatch(code) {
      return codesInList(toCodeList(code), this.codes);
    }
  }, {
    key: "isConcept",
    get: function get() {
      return true;
    }
  }]);

  return Concept;
}();

var ValueSet = /*#__PURE__*/function () {
  function ValueSet(oid, version, codes) {
    _classCallCheck(this, ValueSet);

    this.oid = oid;
    this.version = version;
    this.codes = codes || [];
  }

  _createClass(ValueSet, [{
    key: "hasMatch",
    value: function hasMatch(code) {
      var codesList = toCodeList(code); // InValueSet String Overload

      if (codesList.length === 1 && typeof codesList[0] === 'string') {
        var matchFound = false;
        var multipleCodeSystemsExist = false;

        var _iterator = _createForOfIteratorHelper(this.codes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var codeItem = _step.value;

            // Confirm all code systems match
            if (codeItem.system !== this.codes[0].system) {
              multipleCodeSystemsExist = true;
            }

            if (codeItem.code === codesList[0]) {
              matchFound = true;
            }

            if (multipleCodeSystemsExist && matchFound) {
              throw new Error('In (valueset) is ambiguous -- multiple codes with multiple code systems exist in value set.');
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return matchFound;
      } else {
        return codesInList(codesList, this.codes);
      }
    }
  }, {
    key: "isValueSet",
    get: function get() {
      return true;
    }
  }]);

  return ValueSet;
}();

function toCodeList(c) {
  if (c == null) {
    return [];
  } else if (typeIsArray(c)) {
    var list = [];

    var _iterator2 = _createForOfIteratorHelper(c),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var c2 = _step2.value;
        list = list.concat(toCodeList(c2));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return list;
  } else if (typeIsArray(c.codes)) {
    return c.codes;
  } else {
    return [c];
  }
}

function codesInList(cl1, cl2) {
  // test each code in c1 against each code in c2 looking for a match
  return cl1.some(function (c1) {
    return cl2.some(function (c2) {
      // only the left argument (cl1) can contain strings. cl2 will only contain codes.
      if (typeof c1 === 'string') {
        // for "string in codesystem" this should compare the string to
        // the code's "code" field according to the specification.
        return c1 === c2.code;
      } else {
        return codesMatch(c1, c2);
      }
    });
  });
}

function codesMatch(code1, code2) {
  return code1.code === code2.code && code1.system === code2.system;
}

var CodeSystem = function CodeSystem(id, version) {
  _classCallCheck(this, CodeSystem);

  this.id = id;
  this.version = version;
};

module.exports = {
  Code: Code,
  Concept: Concept,
  ValueSet: ValueSet,
  CodeSystem: CodeSystem
};
},{"../util/util":47}],6:[function(require,module,exports){
"use strict";

var logic = require('./logic');

var clinical = require('./clinical');

var uncertainty = require('./uncertainty');

var datetime = require('./datetime');

var interval = require('./interval');

var quantity = require('./quantity');

var ratio = require('./ratio');

var libs = [logic, clinical, uncertainty, datetime, interval, quantity, ratio];

for (var _i = 0, _libs = libs; _i < _libs.length; _i++) {
  var lib = _libs[_i];

  for (var _i2 = 0, _Object$keys = Object.keys(lib); _i2 < _Object$keys.length; _i2++) {
    var element = _Object$keys[_i2];
    module.exports[element] = lib[element];
  }
}
},{"./clinical":5,"./datetime":7,"./interval":9,"./logic":10,"./quantity":11,"./ratio":12,"./uncertainty":13}],7:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./uncertainty'),
    Uncertainty = _require.Uncertainty;

var _require2 = require('../util/util'),
    jsDate = _require2.jsDate,
    normalizeMillisecondsField = _require2.normalizeMillisecondsField,
    normalizeMillisecondsFieldInString = _require2.normalizeMillisecondsFieldInString,
    getTimezoneSeparatorFromString = _require2.getTimezoneSeparatorFromString;

var moment = require('moment');

var DateTime = /*#__PURE__*/function () {
  _createClass(DateTime, null, [{
    key: "parse",
    value: function parse(string) {
      if (string === null) {
        return null;
      }

      var matches = /(\d{4})(-(\d{2}))?(-(\d{2}))?(T((\d{2})(:(\d{2})(:(\d{2})(\.(\d+))?)?)?)?(Z|(([+-])(\d{2})(:?(\d{2}))?))?)?/.exec(string);

      if (matches == null) {
        return null;
      }

      var years = matches[1];
      var months = matches[3];
      var days = matches[5];
      var hours = matches[8];
      var minutes = matches[10];
      var seconds = matches[12];
      var milliseconds = matches[14];

      if (milliseconds != null) {
        milliseconds = normalizeMillisecondsField(milliseconds);
      }

      if (milliseconds != null) {
        string = normalizeMillisecondsFieldInString(string, matches[14]);
      }

      if (!isValidDateTimeStringFormat(string)) {
        return null;
      } // convert the args to integers


      var args = [years, months, days, hours, minutes, seconds, milliseconds].map(function (arg) {
        return arg != null ? parseInt(arg) : arg;
      }); // convert timezone offset to decimal and add it to arguments

      if (matches[18] != null) {
        var num = parseInt(matches[18]) + (matches[20] != null ? parseInt(matches[20]) / 60 : 0);
        args.push(matches[17] === '+' ? num : num * -1);
      } else if (matches[15] === 'Z') {
        args.push(0);
      }

      return _construct(DateTime, _toConsumableArray(args));
    }
  }, {
    key: "fromJSDate",
    value: function fromJSDate(date, timezoneOffset) {
      //This is from a JS Date, not a CQL Date
      if (date instanceof DateTime) {
        return date;
      }

      if (timezoneOffset != null) {
        date = new jsDate(date.getTime() + timezoneOffset * 60 * 60 * 1000);
        return new DateTime(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds(), timezoneOffset);
      } else {
        return new DateTime(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
      }
    }
  }]);

  function DateTime() {
    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var hour = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var minute = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var second = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var millisecond = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var timezoneOffset = arguments.length > 7 ? arguments[7] : undefined;

    _classCallCheck(this, DateTime);

    // from the spec: If no timezone is specified, the timezone of the evaluation request timestamp is used.
    // NOTE: timezoneOffset will be explicitly null for the Time overload, whereas
    // it will be undefined if simply unspecified
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.millisecond = millisecond;
    this.timezoneOffset = timezoneOffset;

    if (this.timezoneOffset === undefined) {
      this.timezoneOffset = new jsDate().getTimezoneOffset() / 60 * -1;
    }
  }

  _createClass(DateTime, [{
    key: "copy",
    value: function copy() {
      return new DateTime(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond, this.timezoneOffset);
    }
  }, {
    key: "successor",
    value: function successor() {
      if (this.millisecond != null) {
        return this.add(1, DateTime.Unit.MILLISECOND);
      } else if (this.second != null) {
        return this.add(1, DateTime.Unit.SECOND);
      } else if (this.minute != null) {
        return this.add(1, DateTime.Unit.MINUTE);
      } else if (this.hour != null) {
        return this.add(1, DateTime.Unit.HOUR);
      } else if (this.day != null) {
        return this.add(1, DateTime.Unit.DAY);
      } else if (this.month != null) {
        return this.add(1, DateTime.Unit.MONTH);
      } else if (this.year != null) {
        return this.add(1, DateTime.Unit.YEAR);
      }
    }
  }, {
    key: "predecessor",
    value: function predecessor() {
      if (this.millisecond != null) {
        return this.add(-1, DateTime.Unit.MILLISECOND);
      } else if (this.second != null) {
        return this.add(-1, DateTime.Unit.SECOND);
      } else if (this.minute != null) {
        return this.add(-1, DateTime.Unit.MINUTE);
      } else if (this.hour != null) {
        return this.add(-1, DateTime.Unit.HOUR);
      } else if (this.day != null) {
        return this.add(-1, DateTime.Unit.DAY);
      } else if (this.month != null) {
        return this.add(-1, DateTime.Unit.MONTH);
      } else if (this.year != null) {
        return this.add(-1, DateTime.Unit.YEAR);
      }
    }
  }, {
    key: "convertToTimezoneOffset",
    value: function convertToTimezoneOffset() {
      var timezoneOffset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var d = DateTime.fromJSDate(this.toJSDate(), timezoneOffset);
      return d.reducedPrecision(this.getPrecision());
    }
  }, {
    key: "differenceBetween",
    value: function differenceBetween(other, unitField) {
      other = this._implicitlyConvert(other);

      if (other == null || !other.isDateTime) {
        return null;
      } // According to CQL spec, to calculate difference, you can just floor lesser precisions and do a duration
      // Make copies since we'll be flooring values and mucking with timezones


      var a = this.copy();
      var b = other.copy(); // Use moment.js for day or finer granularity due to the daylight savings time fall back/spring forward

      if (unitField === DateTime.Unit.MONTH || unitField === DateTime.Unit.YEAR || unitField === DateTime.Unit.WEEK || unitField === DateTime.Unit.DAY) {
        // The dates need to agree on where the boundaries are, so we must normalize to the same time zone
        if (a.timezoneOffset !== b.timezoneOffset) {
          b = b.convertToTimezoneOffset(a.timezoneOffset);
        } // JS always represents dates in the current locale, but in locales with DST, we want to account for the
        // potential difference in offset from one date to the other.  We try to simulate them being in the same
        // timezone, because we don't want midnight to roll back to 11:00pm since that will mess up day boundaries.


        if (!a.isUTC() || !b.isUTC()) {
          var aJS = a.toJSDate(true);
          var bJS = b.toJSDate(true);
          var tzDiff = aJS.getTimezoneOffset() - bJS.getTimezoneOffset();

          if (tzDiff !== 0) {
            // Since we'll be doing duration later, account for timezone offset by adding to the time (if possible)
            if (b.year != null && b.month != null && b.day != null && b.hour != null && b.minute != null) {
              b = b.add(tzDiff, DateTime.Unit.MINUTE);
            } else if (b.year != null && b.month != null && b.day != null && b.hour != null) {
              b = b.add(tzDiff / 60, DateTime.Unit.HOUR);
            } else {
              b.timezoneOffset = b.timezoneOffset + tzDiff / 60;
            }
          }
        }
      } // Now floor lesser precisions before we go on to calculate duration


      if (unitField === DateTime.Unit.YEAR) {
        a = new DateTime(a.year, 1, 1, 12, 0, 0, 0, a.timezoneOffset);
        b = new DateTime(b.year, 1, 1, 12, 0, 0, 0, b.timezoneOffset);
      } else if (unitField === DateTime.Unit.MONTH) {
        a = new DateTime(a.year, a.month, 1, 12, 0, 0, 0, a.timezoneOffset);
        b = new DateTime(b.year, b.month, 1, 12, 0, 0, 0, b.timezoneOffset);
      } else if (unitField === DateTime.Unit.WEEK) {
        a = this._floorWeek(a);
        b = this._floorWeek(b);
      } else if (unitField === DateTime.Unit.DAY) {
        a = new DateTime(a.year, a.month, a.day, 12, 0, 0, 0, a.timezoneOffset);
        b = new DateTime(b.year, b.month, b.day, 12, 0, 0, 0, b.timezoneOffset);
      } else if (unitField === DateTime.Unit.HOUR) {
        a = new DateTime(a.year, a.month, a.day, a.hour, 30, 0, 0, a.timezoneOffset);
        b = new DateTime(b.year, b.month, b.day, b.hour, 30, 0, 0, b.timezoneOffset);
      } else if (unitField === DateTime.Unit.MINUTE) {
        a = new DateTime(a.year, a.month, a.day, a.hour, a.minute, 0, 0, a.timezoneOffset);
        b = new DateTime(b.year, b.month, b.day, b.hour, b.minute, 0, 0, b.timezoneOffset);
      } else if (unitField === DateTime.Unit.SECOND) {
        a = new DateTime(a.year, a.month, a.day, a.hour, a.minute, a.second, 0, a.timezoneOffset);
        b = new DateTime(b.year, b.month, b.day, b.hour, b.minute, b.second, 0, b.timezoneOffset);
      } // Because moment.js handles years and months differently, use the existing durationBetween for those
      // Finer granularity times can be handled by the DST-aware moment.js library.


      if (unitField === DateTime.Unit.YEAR || unitField === DateTime.Unit.MONTH) {
        return a.durationBetween(b, unitField);
      } else {
        var aUncertainty = a.toUncertainty();
        var bUncertainty = b.toUncertainty();
        var aLowMoment = moment(aUncertainty.low).utc();
        var aHighMoment = moment(aUncertainty.high).utc();
        var bLowMoment = moment(bUncertainty.low).utc();
        var bHighMoment = moment(bUncertainty.high).utc(); // moment uses the plural form of the unitField

        return new Uncertainty(bLowMoment.diff(aHighMoment, unitField + 's'), bHighMoment.diff(aLowMoment, unitField + 's'));
      }
    }
  }, {
    key: "_floorWeek",
    value: function _floorWeek(d) {
      // To "floor" a week, we need to go back to the last Sunday (that's when getDay() == 0 in javascript)
      // But if we don't know the day, then just return it as-is
      if (d.day == null) {
        return d;
      }

      var floored = new jsDate(d.year, d.month - 1, d.day);

      while (floored.getDay() > 0) {
        floored.setDate(floored.getDate() - 1);
      }

      return new DateTime(floored.getFullYear(), floored.getMonth() + 1, floored.getDate(), 12, 0, 0, 0, d.timezoneOffset);
    }
  }, {
    key: "durationBetween",
    value: function durationBetween(other, unitField) {
      other = this._implicitlyConvert(other);

      if (other == null || !other.isDateTime) {
        return null;
      }

      var a = this.toUncertainty();
      var b = other.toUncertainty();
      return new Uncertainty(this._durationBetweenDates(a.high, b.low, unitField), this._durationBetweenDates(a.low, b.high, unitField));
    } // NOTE: a and b are real JS dates -- not DateTimes

  }, {
    key: "_durationBetweenDates",
    value: function _durationBetweenDates(a, b, unitField) {
      // DurationBetween is different than DifferenceBetween in that DurationBetween counts whole elapsed time periods, but
      // DifferenceBetween counts boundaries.  For example:
      // difference in days between @2012-01-01T23:59:59.999 and @2012-01-02T00:00:00.0 calculates to 1 (since it crosses day boundary)
      // days between @2012-01-01T23:59:59.999 and @2012-01-02T00:00:00.0 calculates to 0 (since there are no full days between them)
      var msDiff = b.getTime() - a.getTime();

      if (msDiff === 0) {
        return 0;
      } // If it's a negative delta, we need to use ceiling instead of floor when truncating


      var truncFunc = msDiff > 0 ? Math.floor : Math.ceil; // For ms, s, min, hr, day, and week this is trivial

      if (unitField === DateTime.Unit.MILLISECOND) {
        return msDiff;
      } else if (unitField === DateTime.Unit.SECOND) {
        return truncFunc(msDiff / 1000);
      } else if (unitField === DateTime.Unit.MINUTE) {
        return truncFunc(msDiff / (60 * 1000));
      } else if (unitField === DateTime.Unit.HOUR) {
        return truncFunc(msDiff / (60 * 60 * 1000));
      } else if (unitField === DateTime.Unit.DAY) {
        return truncFunc(msDiff / (24 * 60 * 60 * 1000));
      } else if (unitField === DateTime.Unit.WEEK) {
        return truncFunc(msDiff / (7 * 24 * 60 * 60 * 1000)); // Months and years are trickier since months are variable length
      } else if (unitField === DateTime.Unit.MONTH || unitField === DateTime.Unit.YEAR) {
        // First get the rough months, essentially counting month "boundaries"
        var months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()); // Now we need to look at the smaller units to see how they compare.  Since we only care about comparing
        // days and below at this point, it's much easier to bring a up to b so it's in the same month, then
        // we can compare on just the remaining units.

        var aInMonth = new jsDate(a.getTime()); // Remember the original timezone offset because if it changes when we bring it up a month, we need to fix it

        var aInMonthOriginalOffset = aInMonth.getTimezoneOffset();
        aInMonth.setMonth(a.getMonth() + months);

        if (aInMonthOriginalOffset !== aInMonth.getTimezoneOffset()) {
          aInMonth.setMinutes(aInMonth.getMinutes() + (aInMonthOriginalOffset - aInMonth.getTimezoneOffset()));
        } // When a is before b, then if a's smaller units are greater than b's, a whole month hasn't elapsed, so adjust


        if (msDiff > 0 && aInMonth > b) {
          months = months - 1; // When b is before a, then if a's smaller units are less than b's, a whole month hasn't elaspsed backwards, so adjust
        } else if (msDiff < 0 && aInMonth < b) {
          months = months + 1;
        } // If this is months, just return them, but if it's years, we need to convert


        if (unitField === DateTime.Unit.MONTH) {
          return months;
        } else {
          return truncFunc(months / 12);
        }
      } else {
        return null;
      }
    }
  }, {
    key: "isUTC",
    value: function isUTC() {
      // A timezoneOffset of 0 indicates UTC time.
      return !this.timezoneOffset;
    }
  }, {
    key: "getPrecision",
    value: function getPrecision() {
      var result = null;

      if (this.year != null) {
        result = DateTime.Unit.YEAR;
      } else {
        return result;
      }

      if (this.month != null) {
        result = DateTime.Unit.MONTH;
      } else {
        return result;
      }

      if (this.day != null) {
        result = DateTime.Unit.DAY;
      } else {
        return result;
      }

      if (this.hour != null) {
        result = DateTime.Unit.HOUR;
      } else {
        return result;
      }

      if (this.minute != null) {
        result = DateTime.Unit.MINUTE;
      } else {
        return result;
      }

      if (this.second != null) {
        result = DateTime.Unit.SECOND;
      } else {
        return result;
      }

      if (this.millisecond != null) {
        result = DateTime.Unit.MILLISECOND;
      }

      return result;
    }
  }, {
    key: "toUncertainty",
    value: function toUncertainty() {
      var ignoreTimezone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var low = this.toJSDate(ignoreTimezone);
      var high = new DateTime(this.year, this.month != null ? this.month : 12, // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate
      this.day != null ? this.day : new jsDate(this.year, this.month != null ? this.month : 12, 0).getDate(), this.hour != null ? this.hour : 23, this.minute != null ? this.minute : 59, this.second != null ? this.second : 59, this.millisecond != null ? this.millisecond : 999, this.timezoneOffset).toJSDate(ignoreTimezone);
      return new Uncertainty(low, high);
    }
  }, {
    key: "toJSDate",
    value: function toJSDate() {
      var ignoreTimezone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var date;
      var _ref = [this.year, this.month != null ? this.month - 1 : 0, this.day != null ? this.day : 1, this.hour != null ? this.hour : 0, this.minute != null ? this.minute : 0, this.second != null ? this.second : 0, this.millisecond != null ? this.millisecond : 0],
          y = _ref[0],
          mo = _ref[1],
          d = _ref[2],
          h = _ref[3],
          mi = _ref[4],
          s = _ref[5],
          ms = _ref[6];

      if (this.timezoneOffset != null && !ignoreTimezone) {
        date = new jsDate(jsDate.UTC(y, mo, d, h, mi, s, ms) - this.timezoneOffset * 60 * 60 * 1000); // TODO: This fixes any case that would not cross the year boundary due to a timezone.
        // Mainly used to solve the issue with the MIN_DATETIME_VALUE being converted from
        // year 0001 to year 1900 because of strange JSDate behavior between year 0 and 100
        // Also else case below

        if (y < 100) {
          date.setUTCFullYear(y);
        }

        return date;
      } else {
        date = new jsDate(y, mo, d, h, mi, s, ms);

        if (y < 100) {
          date.setFullYear(y);
        }

        return date;
      }
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.toString();
    }
  }, {
    key: "_pad",
    value: function _pad(num) {
      return String('0' + num).slice(-2);
    }
  }, {
    key: "toString",
    value: function toString() {
      if (this.isTime()) {
        return this.toStringTime();
      } else {
        return this.toStringDateTime();
      }
    }
  }, {
    key: "toStringTime",
    value: function toStringTime() {
      var str = '';

      if (this.hour != null) {
        str += +this._pad(this.hour);

        if (this.minute != null) {
          str += ':' + this._pad(this.minute);

          if (this.second != null) {
            str += ':' + this._pad(this.second);

            if (this.millisecond != null) {
              str += '.' + String('00' + this.millisecond).slice(-3);
            }
          }
        }
      }

      return str;
    }
  }, {
    key: "toStringDateTime",
    value: function toStringDateTime() {
      var str = '';

      if (this.year != null) {
        str += this.year;

        if (this.month != null) {
          str += '-' + this._pad(this.month);

          if (this.day != null) {
            str += '-' + this._pad(this.day);

            if (this.hour != null) {
              str += 'T' + this._pad(this.hour);

              if (this.minute != null) {
                str += ':' + this._pad(this.minute);

                if (this.second != null) {
                  str += ':' + this._pad(this.second);

                  if (this.millisecond != null) {
                    str += '.' + String('00' + this.millisecond).slice(-3);
                  }
                }
              }
            }
          }
        }
      }

      if (str.indexOf('T') !== -1 && this.timezoneOffset != null) {
        str += this.timezoneOffset < 0 ? '-' : '+';
        var offsetHours = Math.floor(Math.abs(this.timezoneOffset));
        str += this._pad(offsetHours);
        var offsetMin = (Math.abs(this.timezoneOffset) - offsetHours) * 60;
        str += ':' + this._pad(offsetMin);
      }

      return str;
    }
  }, {
    key: "getDateTime",
    value: function getDateTime() {
      return this;
    }
  }, {
    key: "getDate",
    value: function getDate() {
      return new _Date(this.year, this.month, this.day);
    }
  }, {
    key: "getTime",
    value: function getTime() {
      // Times no longer have timezoneOffets, so we must explicitly set it to null
      return new DateTime(0, 1, 1, this.hour, this.minute, this.second, this.millisecond, null);
    }
  }, {
    key: "isTime",
    value: function isTime() {
      return this.year === 0 && this.month === 1 && this.day === 1;
    }
  }, {
    key: "_implicitlyConvert",
    value: function _implicitlyConvert(other) {
      if (other != null && other.isDate) {
        return other.getDateTime();
      }

      return other;
    }
  }, {
    key: "reducedPrecision",
    value: function reducedPrecision() {
      var unitField = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DateTime.Unit.MILLISECOND;
      var reduced = this.copy();

      if (unitField !== DateTime.Unit.MILLISECOND) {
        var fieldIndex = DateTime.FIELDS.indexOf(unitField);
        var fieldsToRemove = DateTime.FIELDS.slice(fieldIndex + 1);

        var _iterator = _createForOfIteratorHelper(fieldsToRemove),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var field = _step.value;
            reduced[field] = null;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      return reduced;
    }
  }, {
    key: "isDateTime",
    get: function get() {
      return true;
    }
  }]);

  return DateTime;
}();

DateTime.Unit = {
  YEAR: 'year',
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
  MILLISECOND: 'millisecond'
};
DateTime.FIELDS = [DateTime.Unit.YEAR, DateTime.Unit.MONTH, DateTime.Unit.DAY, DateTime.Unit.HOUR, DateTime.Unit.MINUTE, DateTime.Unit.SECOND, DateTime.Unit.MILLISECOND];

var _Date = /*#__PURE__*/function () {
  _createClass(_Date, null, [{
    key: "parse",
    value: function parse(string) {
      if (string === null) {
        return null;
      }

      var matches = /(\d{4})(-(\d{2}))?(-(\d{2}))?/.exec(string);

      if (matches == null) {
        return null;
      }

      var years = matches[1];
      var months = matches[3];
      var days = matches[5];

      if (!isValidDateStringFormat(string)) {
        return null;
      } // convert args to integers


      var args = [years, months, days].map(function (arg) {
        return arg != null ? parseInt(arg) : arg;
      });
      return _construct(_Date, _toConsumableArray(args));
    }
  }]);

  function _Date() {
    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, _Date);

    this.year = year;
    this.month = month;
    this.day = day;
  }

  _createClass(_Date, [{
    key: "copy",
    value: function copy() {
      return new _Date(this.year, this.month, this.day);
    }
  }, {
    key: "successor",
    value: function successor() {
      if (this.day != null) {
        return this.add(1, _Date.Unit.DAY);
      } else if (this.month != null) {
        return this.add(1, _Date.Unit.MONTH);
      } else if (this.year != null) {
        return this.add(1, _Date.Unit.YEAR);
      }
    }
  }, {
    key: "predecessor",
    value: function predecessor() {
      if (this.day != null) {
        return this.add(-1, _Date.Unit.DAY);
      } else if (this.month != null) {
        return this.add(-1, _Date.Unit.MONTH);
      } else if (this.year != null) {
        return this.add(-1, _Date.Unit.YEAR);
      }
    }
  }, {
    key: "differenceBetween",
    value: function differenceBetween(other, unitField) {
      if (other != null && other.isDateTime) {
        return this.getDateTime().differenceBetween(other, unitField);
      }

      if (other == null || !other.isDate) {
        return null;
      }

      var a = this;
      var b = other; // According to CQL spec, to calculate difference, you can just floor lesser precisions and do a duration

      if (unitField === _Date.Unit.YEAR) {
        a = new _Date(a.year, 1, 1);
        b = new _Date(b.year, 1, 1);
      } else if (unitField === _Date.Unit.MONTH) {
        a = new _Date(a.year, a.month, 1);
        b = new _Date(b.year, b.month, 1);
      } else if (unitField === _Date.Unit.WEEK) {
        a = this._floorWeek(a);
        b = this._floorWeek(b);
      }

      return a.durationBetween(b, unitField);
    }
  }, {
    key: "_floorWeek",
    value: function _floorWeek(d) {
      // To "floor" a week, we need to go back to the last Sunday (that's when getDay() == 0 in javascript)
      // But if we don't know the day, then just return it as-is
      if (d.day == null) {
        return d;
      }

      var floored = new jsDate(d.year, d.month - 1, d.day);

      while (floored.getDay() > 0) {
        floored.setDate(floored.getDate() - 1);
      }

      return new _Date(floored.getFullYear(), floored.getMonth() + 1, floored.getDate());
    }
  }, {
    key: "durationBetween",
    value: function durationBetween(other, unitField) {
      if (other != null && other.isDateTime) {
        return this.getDateTime().durationBetween(other, unitField);
      }

      if (other == null || !other.isDate) {
        return null;
      }

      var a = this.toUncertainty();
      var b = other.toUncertainty();
      return new Uncertainty(this._durationBetweenDates(a.high, b.low, unitField), this._durationBetweenDates(a.low, b.high, unitField));
    } // NOTE: a and b are real JS dates -- not DateTimes. Also this expects time components to be zero!

  }, {
    key: "_durationBetweenDates",
    value: function _durationBetweenDates(a, b, unitField) {
      //we need to fix offsets to match so we dont get any JS DST interference, to avoid crossing day boundaries put it in the middle of the day
      //DST stuff should only be +/- one hour so this should work
      a.setTime(a.getTime() + 12 * 60 * 60 * 1000);
      b.setTime(b.getTime() + 12 * 60 * 60 * 1000);
      var tzdiff = a.getTimezoneOffset() - b.getTimezoneOffset();
      b.setTime(b.getTime() + tzdiff * 60 * 1000); // DurationBetween is different than DifferenceBetween in that DurationBetween counts whole elapsed time periods, but
      // DifferenceBetween counts boundaries.  For example:
      // difference in days between @2012-01-01T23:59:59.999 and @2012-01-02T00:00:00.0 calculates to 1 (since it crosses day boundary)
      // days between @2012-01-01T23:59:59.999 and @2012-01-02T00:00:00.0 calculates to 0 (since there are no full days between them)

      var msDiff = b.getTime() - a.getTime();

      if (msDiff === 0) {
        return 0;
      } // If it's a negative delta, we need to use ceiling instead of floor when truncating


      var truncFunc = msDiff > 0 ? Math.floor : Math.ceil; // For ms, s, min, hr, day, and week this is trivial

      if (unitField === _Date.Unit.DAY) {
        return truncFunc(msDiff / (24 * 60 * 60 * 1000));
      } else if (unitField === _Date.Unit.WEEK) {
        return truncFunc(msDiff / (7 * 24 * 60 * 60 * 1000)); // Months and years are trickier since months are variable length
      } else if (unitField === _Date.Unit.MONTH || unitField === _Date.Unit.YEAR) {
        // First get the rough months, essentially counting month "boundaries"
        var months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()); // Now we need to look at the smaller units to see how they compare.  Since we only care about comparing
        // days and below at this point, it's much easier to bring a up to b so it's in the same month, then
        // we can compare on just the remaining units.

        var aInMonth = new jsDate(a.getTime()); // Remember the original timezone offset because if it changes when we bring it up a month, we need to fix it

        var aInMonthOriginalOffset = aInMonth.getTimezoneOffset();
        aInMonth.setMonth(a.getMonth() + months);

        if (aInMonthOriginalOffset !== aInMonth.getTimezoneOffset()) {
          aInMonth.setMinutes(aInMonth.getMinutes() + (aInMonthOriginalOffset - aInMonth.getTimezoneOffset()));
        } // When a is before b, then if a's smaller units are greater than b's, a whole month hasn't elapsed, so adjust


        if (msDiff > 0 && aInMonth > b) {
          months = months - 1; // When b is before a, then if a's smaller units are less than b's, a whole month hasn't elaspsed backwards, so adjust
        } else if (msDiff < 0 && aInMonth < b) {
          months = months + 1;
        } // If this is months, just return them, but if it's years, we need to convert


        if (unitField === _Date.Unit.MONTH) {
          return months;
        } else {
          return truncFunc(months / 12);
        }
      } else {
        return null;
      }
    }
  }, {
    key: "getPrecision",
    value: function getPrecision() {
      var result = null;

      if (this.year != null) {
        result = _Date.Unit.YEAR;
      } else {
        return result;
      }

      if (this.month != null) {
        result = _Date.Unit.MONTH;
      } else {
        return result;
      }

      if (this.day != null) {
        result = _Date.Unit.DAY;
      } else {
        return result;
      }

      return result;
    }
  }, {
    key: "toUncertainty",
    value: function toUncertainty() {
      var low = this.toJSDate();
      var high = new _Date(this.year, this.month != null ? this.month : 12, // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate
      this.day != null ? this.day : new jsDate(this.year, this.month != null ? this.month : 12, 0).getDate()).toJSDate();
      return new Uncertainty(low, high);
    }
  }, {
    key: "toJSDate",
    value: function toJSDate() {
      var _ref2 = [this.year, this.month != null ? this.month - 1 : 0, this.day != null ? this.day : 1],
          y = _ref2[0],
          mo = _ref2[1],
          d = _ref2[2];
      return new jsDate(y, mo, d);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.toString();
    }
  }, {
    key: "toString",
    value: function toString() {
      var str = '';

      if (this.year != null) {
        str += this.year.toString();

        if (this.month != null) {
          str += '-' + this.month.toString().padStart(2, '0');

          if (this.day != null) {
            str += '-' + this.day.toString().padStart(2, '0');
          }
        }
      }

      return str;
    }
  }, {
    key: "getDateTime",
    value: function getDateTime() {
      // from the spec: the result will be a DateTime with the time components set to zero,
      // except for the timezone offset, which will be set to the timezone offset of the evaluation
      // request timestamp. (this last part is acheived by just not passing in timezone offset)
      if (this.year != null && this.month != null && this.day != null) {
        return new DateTime(this.year, this.month, this.day, 0, 0, 0, 0); // from spec: no component may be specified at a precision below an unspecified precision.
        // For example, hour may be null, but if it is, minute, second, and millisecond must all be null as well.
      } else {
        return new DateTime(this.year, this.month, this.day);
      }
    }
  }, {
    key: "reducedPrecision",
    value: function reducedPrecision() {
      var unitField = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _Date.Unit.DAY;
      var reduced = this.copy();

      if (unitField !== _Date.Unit.DAY) {
        var fieldIndex = _Date.FIELDS.indexOf(unitField);

        var fieldsToRemove = _Date.FIELDS.slice(fieldIndex + 1);

        var _iterator2 = _createForOfIteratorHelper(fieldsToRemove),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var field = _step2.value;
            reduced[field] = null;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      return reduced;
    }
  }, {
    key: "isDate",
    get: function get() {
      return true;
    }
  }], [{
    key: "fromJSDate",
    value: function fromJSDate(date) {
      if (date instanceof _Date) {
        return date;
      }

      return new _Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }
  }]);

  return _Date;
}();

var MIN_DATETIME_VALUE = DateTime.parse('0001-01-01T00:00:00.000');
var MAX_DATETIME_VALUE = DateTime.parse('9999-12-31T23:59:59.999');

var MIN_DATE_VALUE = _Date.parse('0001-01-01');

var MAX_DATE_VALUE = _Date.parse('9999-12-31');

var MIN_TIME_VALUE = DateTime.parse('0000-01-01T00:00:00.000');
var MAX_TIME_VALUE = DateTime.parse('0000-01-01T23:59:59.999');
_Date.Unit = {
  YEAR: 'year',
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day'
};
_Date.FIELDS = [_Date.Unit.YEAR, _Date.Unit.MONTH, _Date.Unit.DAY]; // Shared Funtions For Date and DateTime

DateTime.prototype.isPrecise = _Date.prototype.isPrecise = function () {
  var _this = this;

  return this.constructor.FIELDS.every(function (field) {
    return _this[field] != null;
  });
};

DateTime.prototype.isImprecise = _Date.prototype.isImprecise = function () {
  return !this.isPrecise();
}; // This function can take another Date-ish object, or a precision string (e.g. 'month')


DateTime.prototype.isMorePrecise = _Date.prototype.isMorePrecise = function (other) {
  if (typeof other === 'string' && this.constructor.FIELDS.includes(other)) {
    if (this[other] == null) {
      return false;
    }
  } else {
    var _iterator3 = _createForOfIteratorHelper(this.constructor.FIELDS),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var field = _step3.value;

        if (other[field] != null && this[field] == null) {
          return false;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }

  return !this.isSamePrecision(other);
}; // This function can take another Date-ish object, or a precision string (e.g. 'month')


DateTime.prototype.isLessPrecise = _Date.prototype.isLessPrecise = function (other) {
  return !this.isSamePrecision(other) && !this.isMorePrecise(other);
}; // This function can take another Date-ish object, or a precision string (e.g. 'month')


DateTime.prototype.isSamePrecision = _Date.prototype.isSamePrecision = function (other) {
  if (typeof other === 'string' && this.constructor.FIELDS.includes(other)) {
    return other === this.getPrecision();
  }

  var _iterator4 = _createForOfIteratorHelper(this.constructor.FIELDS),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var field = _step4.value;

      if (this[field] != null && other[field] == null) {
        return false;
      }

      if (this[field] == null && other[field] != null) {
        return false;
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  return true;
};

DateTime.prototype.equals = _Date.prototype.equals = function (other) {
  return compareWithDefaultResult(this, other, null);
};

DateTime.prototype.equivalent = _Date.prototype.equivalent = function (other) {
  return compareWithDefaultResult(this, other, false);
};

DateTime.prototype.sameAs = _Date.prototype.sameAs = function (other, precision) {
  if (!(other.isDate || other.isDateTime)) {
    return null;
  } else if (this.isDate && other.isDateTime) {
    return this.getDateTime().sameAs(other, precision);
  } else if (this.isDateTime && other.isDate) {
    other = other.getDateTime();
  }

  if (precision != null && this.constructor.FIELDS.indexOf(precision) < 0) {
    throw new Error("Invalid precision: ".concat(precision));
  } // make a copy of other in the correct timezone offset if they don't match.


  if (this.timezoneOffset !== other.timezoneOffset) {
    other = other.convertToTimezoneOffset(this.timezoneOffset);
  }

  var _iterator5 = _createForOfIteratorHelper(this.constructor.FIELDS),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var field = _step5.value;

      // if both have this precision defined
      if (this[field] != null && other[field] != null) {
        // if they are different then return with false
        if (this[field] !== other[field]) {
          return false;
        } // if both dont have this precision, return true of precision is not defined

      } else if (this[field] == null && other[field] == null) {
        if (precision == null) {
          return true;
        } else {
          // we havent met precision yet
          return null;
        } // otherwise they have inconclusive precision, return null

      } else {
        return null;
      } // if precision is defined and we have reached expected precision, we can leave the loop


      if (precision != null && precision === field) {
        break;
      }
    } // if we made it here, then all fields matched.

  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }

  return true;
};

DateTime.prototype.sameOrBefore = _Date.prototype.sameOrBefore = function (other, precision) {
  if (!(other.isDate || other.isDateTime)) {
    return null;
  } else if (this.isDate && other.isDateTime) {
    return this.getDateTime().sameOrBefore(other, precision);
  } else if (this.isDateTime && other.isDate) {
    other = other.getDateTime();
  }

  if (precision != null && this.constructor.FIELDS.indexOf(precision) < 0) {
    throw new Error("Invalid precision: ".concat(precision));
  } // make a copy of other in the correct timezone offset if they don't match.


  if (this.timezoneOffset !== other.timezoneOffset) {
    other = other.convertToTimezoneOffset(this.timezoneOffset);
  }

  var _iterator6 = _createForOfIteratorHelper(this.constructor.FIELDS),
      _step6;

  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var field = _step6.value;

      // if both have this precision defined
      if (this[field] != null && other[field] != null) {
        // if this value is less than the other return with true. this is before other
        if (this[field] < other[field]) {
          return true; // if this value is greater than the other return with false. this is after
        } else if (this[field] > other[field]) {
          return false;
        } // execution continues if the values are the same
        // if both dont have this precision, return true if precision is not defined

      } else if (this[field] == null && other[field] == null) {
        if (precision == null) {
          return true;
        } else {
          // we havent met precision yet
          return null;
        } // otherwise they have inconclusive precision, return null

      } else {
        return null;
      } // if precision is defined and we have reached expected precision, we can leave the loop


      if (precision != null && precision === field) {
        break;
      }
    } // if we made it here, then all fields matched and they are same

  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }

  return true;
};

DateTime.prototype.sameOrAfter = _Date.prototype.sameOrAfter = function (other, precision) {
  if (!(other.isDate || other.isDateTime)) {
    return null;
  } else if (this.isDate && other.isDateTime) {
    return this.getDateTime().sameOrAfter(other, precision);
  } else if (this.isDateTime && other.isDate) {
    other = other.getDateTime();
  }

  if (precision != null && this.constructor.FIELDS.indexOf(precision) < 0) {
    throw new Error("Invalid precision: ".concat(precision));
  } // make a copy of other in the correct timezone offset if they don't match.


  if (this.timezoneOffset !== other.timezoneOffset) {
    other = other.convertToTimezoneOffset(this.timezoneOffset);
  }

  var _iterator7 = _createForOfIteratorHelper(this.constructor.FIELDS),
      _step7;

  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var field = _step7.value;

      // if both have this precision defined
      if (this[field] != null && other[field] != null) {
        // if this value is greater than the other return with true. this is after other
        if (this[field] > other[field]) {
          return true; // if this value is greater than the other return with false. this is before
        } else if (this[field] < other[field]) {
          return false;
        } // execution continues if the values are the same
        // if both dont have this precision, return true if precision is not defined

      } else if (this[field] == null && other[field] == null) {
        if (precision == null) {
          return true;
        } else {
          // we havent met precision yet
          return null;
        } // otherwise they have inconclusive precision, return null

      } else {
        return null;
      } // if precision is defined and we have reached expected precision, we can leave the loop


      if (precision != null && precision === field) {
        break;
      }
    } // if we made it here, then all fields matched and they are same

  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }

  return true;
};

DateTime.prototype.before = _Date.prototype.before = function (other, precision) {
  if (!(other.isDate || other.isDateTime)) {
    return null;
  } else if (this.isDate && other.isDateTime) {
    return this.getDateTime().before(other, precision);
  } else if (this.isDateTime && other.isDate) {
    other = other.getDateTime();
  }

  if (precision != null && this.constructor.FIELDS.indexOf(precision) < 0) {
    throw new Error("Invalid precision: ".concat(precision));
  } // make a copy of other in the correct timezone offset if they don't match.


  if (this.timezoneOffset !== other.timezoneOffset) {
    other = other.convertToTimezoneOffset(this.timezoneOffset);
  }

  var _iterator8 = _createForOfIteratorHelper(this.constructor.FIELDS),
      _step8;

  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var field = _step8.value;

      // if both have this precision defined
      if (this[field] != null && other[field] != null) {
        // if this value is less than the other return with true. this is before other
        if (this[field] < other[field]) {
          return true; // if this value is greater than the other return with false. this is after
        } else if (this[field] > other[field]) {
          return false;
        } // execution continues if the values are the same
        // if both dont have this precision, return false if precision is not defined

      } else if (this[field] == null && other[field] == null) {
        if (precision == null) {
          return false;
        } else {
          // we havent met precision yet
          return null;
        } // otherwise they have inconclusive precision, return null

      } else {
        return null;
      } // if precision is defined and we have reached expected precision, we can leave the loop


      if (precision != null && precision === field) {
        break;
      }
    } // if we made it here, then all fields matched and they are same

  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }

  return false;
};

DateTime.prototype.after = _Date.prototype.after = function (other, precision) {
  if (!(other.isDate || other.isDateTime)) {
    return null;
  } else if (this.isDate && other.isDateTime) {
    return this.getDateTime().after(other, precision);
  } else if (this.isDateTime && other.isDate) {
    other = other.getDateTime();
  }

  if (precision != null && this.constructor.FIELDS.indexOf(precision) < 0) {
    throw new Error("Invalid precision: ".concat(precision));
  } // make a copy of other in the correct timezone offset if they don't match.


  if (this.timezoneOffset !== other.timezoneOffset) {
    other = other.convertToTimezoneOffset(this.timezoneOffset);
  }

  var _iterator9 = _createForOfIteratorHelper(this.constructor.FIELDS),
      _step9;

  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var field = _step9.value;

      // if both have this precision defined
      if (this[field] != null && other[field] != null) {
        // if this value is greater than the other return with true. this is after other
        if (this[field] > other[field]) {
          return true; // if this value is greater than the other return with false. this is before
        } else if (this[field] < other[field]) {
          return false;
        } // execution continues if the values are the same
        // if both dont have this precision, return false if precision is not defined

      } else if (this[field] == null && other[field] == null) {
        if (precision == null) {
          return false;
        } else {
          // we havent met precision yet
          return null;
        } // otherwise they have inconclusive precision, return null

      } else {
        return null;
      } // if precision is defined and we have reached expected precision, we can leave the loop


      if (precision != null && precision === field) {
        break;
      }
    } // if we made it here, then all fields matched and they are same

  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }

  return false;
};

DateTime.prototype.add = _Date.prototype.add = function (offset, field) {
  var result = this.copy();

  if (offset === 0) {
    return result;
  } // If weeks, convert to days


  if (field === this.constructor.Unit.WEEK) {
    offset = offset * 7;
    field = this.constructor.Unit.DAY;
  }

  var offsetIsMorePrecise = result[field] == null; //whether the quantity we are adding is more precise than @
  // From the spec: "The operation is performed by converting the time-based quantity to the most precise value
  // specified in the date/time (truncating any resulting decimal portion) and then adding it to the date/time value."
  // However, since you can't really convert e.g. days to months,  if @ is less precise than the field being added, we can
  // "floor" UP to the incoming field precision, then add the offset, then reduce back down to original precision.
  // For negative offsets, we use the cieling

  if (offsetIsMorePrecise) {
    if (this.year == null) {
      result.year = new jsDate().getFullYear();
    } //in case there is no year, proceed as if in this year, year will be nullified later


    var fieldFloorOrCiel = offset >= 0 ? this.getFieldFloor : this.getFieldCieling;

    var _iterator10 = _createForOfIteratorHelper(this.constructor.FIELDS),
        _step10;

    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var f = _step10.value;
        // this relies on FIELDS being sorted least to most precise
        result[f] = result[f] != null ? result[f] : fieldFloorOrCiel.call(result, f);

        if (result[field] != null) {
          break;
        }
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }
  } // Increment the field, then round-trip to JS date and back for calendar math


  result[field] = result[field] + offset;
  var normalized = this.constructor.fromJSDate(result.toJSDate(), this.timezoneOffset);

  var _iterator11 = _createForOfIteratorHelper(this.constructor.FIELDS),
      _step11;

  try {
    for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
      field = _step11.value;

      if (result[field] != null) {
        result[field] = normalized[field];
      }
    } // remove any fields we added (go back to original precision)

  } catch (err) {
    _iterator11.e(err);
  } finally {
    _iterator11.f();
  }

  if (offsetIsMorePrecise) {
    var _iterator12 = _createForOfIteratorHelper(this.constructor.FIELDS),
        _step12;

    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var _f = _step12.value;

        if (this[_f] == null) {
          result[_f] = null;
        }
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }
  } // Can't use overflowsOrUnderflows from math.js due to circular dependencies when we require it


  if (result.after(MAX_DATETIME_VALUE || result.before(MIN_DATETIME_VALUE))) {
    return null;
  } else {
    return result;
  }
};

DateTime.prototype.getFieldFloor = _Date.prototype.getFieldFloor = function (field) {
  switch (field) {
    case 'month':
      return 1;

    case 'day':
      return 1;

    case 'hour':
      return 0;

    case 'minute':
      return 0;

    case 'second':
      return 0;

    case 'millisecond':
      return 0;

    default:
      throw new Error('Tried to floor a field that has no floor value: ' + field);
  }
};

DateTime.prototype.getFieldCieling = _Date.prototype.getFieldCieling = function (field) {
  switch (field) {
    case 'month':
      return 12;

    case 'day':
      return daysInMonth(this.year, this.month);

    case 'hour':
      return 23;

    case 'minute':
      return 59;

    case 'second':
      return 59;

    case 'millisecond':
      return 999;

    default:
      throw new Error('Tried to clieling a field that has no cieling value: ' + field);
  }
};

function compareWithDefaultResult(a, b, defaultResult) {
  // return false there is a type mismatch
  if ((!a.isDate || !b.isDate) && (!a.isDateTime || !b.isDateTime)) {
    return false;
  } // make a copy of other in the correct timezone offset if they don't match.


  if (a.timezoneOffset !== b.timezoneOffset) {
    b = b.convertToTimezoneOffset(a.timezoneOffset);
  }

  var _iterator13 = _createForOfIteratorHelper(a.constructor.FIELDS),
      _step13;

  try {
    for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
      var field = _step13.value;

      // if both have this precision defined
      if (a[field] != null && b[field] != null) {
        // For the purposes of comparison, seconds and milliseconds are combined
        // as a single precision using a decimal, with decimal equality semantics
        if (field === 'second') {
          // NOTE: if millisecond is null it will calcualte like this anyway, but
          // if millisecond is undefined, using it will result in NaN calculations
          var aMillisecond = a['millisecond'] != null ? a['millisecond'] : 0;
          var aSecondAndMillisecond = a[field] + aMillisecond / 1000;
          var bMillisecond = b['millisecond'] != null ? b['millisecond'] : 0;
          var bSecondAndMillisecond = b[field] + bMillisecond / 1000; // second/millisecond is the most precise comparison, so we can directly return

          return aSecondAndMillisecond === bSecondAndMillisecond;
        } // if they are different then return with false


        if (a[field] !== b[field]) {
          return false;
        } // if both dont have this precision, return true

      } else if (a[field] == null && b[field] == null) {
        return true; // otherwise they have inconclusive precision, return defaultResult
      } else {
        return defaultResult;
      }
    } // if we made it here, then all fields matched.

  } catch (err) {
    _iterator13.e(err);
  } finally {
    _iterator13.f();
  }

  return true;
}

function daysInMonth(year, month) {
  if (year == null || month == null) {
    throw new Error('daysInMonth requires year and month as arguments');
  } // Month is 1-indexed here because of the 0 day


  return new jsDate(year, month, 0).getDate();
}

function isValidDateStringFormat(string) {
  if (typeof string !== 'string') {
    return false;
  }

  var cqlFormats = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'];
  var cqlFormatStringWithLength = {};

  for (var _i = 0, _cqlFormats = cqlFormats; _i < _cqlFormats.length; _i++) {
    var format = _cqlFormats[_i];
    cqlFormatStringWithLength[format.length] = format;
  }

  if (cqlFormatStringWithLength[string.length] == null) {
    return false;
  }

  var strict = true;
  return moment(string, cqlFormatStringWithLength[string.length], strict).isValid();
}

function isValidDateTimeStringFormat(string) {
  if (typeof string !== 'string') {
    return false;
  }

  var cqlFormats = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD', 'YYYY-MM-DDTZ', 'YYYY-MM-DDT+hh', 'YYYY-MM-DDT+hh:mm', 'YYYY-MM-DDT-hh', 'YYYY-MM-DDT-hh:mm', 'YYYY-MM-DDThh', 'YYYY-MM-DDThhZ', 'YYYY-MM-DDThh+hh', 'YYYY-MM-DDThh+hh:mm', 'YYYY-MM-DDThh-hh', 'YYYY-MM-DDThh-hh:mm', 'YYYY-MM-DDThh:mm', 'YYYY-MM-DDThh:mmZ', 'YYYY-MM-DDThh:mm+hh', 'YYYY-MM-DDThh:mm+hh:mm', 'YYYY-MM-DDThh:mm-hh', 'YYYY-MM-DDThh:mm-hh:mm', 'YYYY-MM-DDThh:mm:ss', 'YYYY-MM-DDThh:mm:ssZ', 'YYYY-MM-DDThh:mm:ss+hh', 'YYYY-MM-DDThh:mm:ss+hh:mm', 'YYYY-MM-DDThh:mm:ss-hh', 'YYYY-MM-DDThh:mm:ss-hh:mm', 'YYYY-MM-DDThh:mm:ss.fff', 'YYYY-MM-DDThh:mm:ss.fffZ', 'YYYY-MM-DDThh:mm:ss.fff+hh', 'YYYY-MM-DDThh:mm:ss.fff+hh:mm', 'YYYY-MM-DDThh:mm:ss.fff-hh', 'YYYY-MM-DDThh:mm:ss.fff-hh:mm'];
  var cqlFormatStringWithLength = {};

  for (var _i2 = 0, _cqlFormats2 = cqlFormats; _i2 < _cqlFormats2.length; _i2++) {
    var format = _cqlFormats2[_i2];
    cqlFormatStringWithLength[format.length] = format;
  }

  if (cqlFormatStringWithLength[string.length] == null) {
    return false;
  } // Moment.js has 2 options for parsing, strict or forgiving.
  // Strict parsing requires that the format and input match exactly, including delimeters.
  // Due to CQL using slightly different delimiters than moment, we need to use forgiving.


  var strict = false;
  return moment(string, cqlFormatStringToMomentFormatString(cqlFormatStringWithLength[string.length]), strict).isValid();
}

function cqlFormatStringToMomentFormatString(string) {
  // CQL: 'YYYY-MM-DDThh:mm:ss.fff-hh:mm', Moment: 'YYYY-MM-DD[T]hh:mm:ss.SSS[Z]'
  var timezoneSeparator;

  var _string$split = string.split('T'),
      _string$split2 = _slicedToArray(_string$split, 2),
      yearMonthDay = _string$split2[0],
      timeAndTimeZoneOffset = _string$split2[1];

  if (timeAndTimeZoneOffset != null) {
    timezoneSeparator = getTimezoneSeparatorFromString(timeAndTimeZoneOffset);
  }

  var momentString = yearMonthDay;

  if (string.match(/T/) != null) {
    momentString += '[T]';
  }

  if (timezoneSeparator) {
    momentString += timeAndTimeZoneOffset.substring(0, timeAndTimeZoneOffset.search(timezoneSeparator)) + '[Z]';
  } else {
    momentString += timeAndTimeZoneOffset;
  }

  return momentString = momentString.replace(/f/g, 'S');
}

module.exports = {
  DateTime: DateTime,
  Date: _Date,
  MIN_DATETIME_VALUE: MIN_DATETIME_VALUE,
  MAX_DATETIME_VALUE: MAX_DATETIME_VALUE,
  MIN_DATE_VALUE: MIN_DATE_VALUE,
  MAX_DATE_VALUE: MAX_DATE_VALUE,
  MIN_TIME_VALUE: MIN_TIME_VALUE,
  MAX_TIME_VALUE: MAX_TIME_VALUE
}; // Require MIN/MAX here because math.js requires this file, and when we make this file require
// math.js before it exports DateTime and Date, it errors due to the circular dependency...
// const { MAX_DATETIME_VALUE, MIN_DATETIME_VALUE } = require('../util/math');
},{"../util/util":47,"./uncertainty":13,"moment":48}],8:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exception = function Exception(message, wrapped) {
  _classCallCheck(this, Exception);

  this.message = message;
  this.wrapped = wrapped;
};

module.exports = {
  Exception: Exception
};
},{}],9:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./uncertainty'),
    Uncertainty = _require.Uncertainty;

var _require2 = require('../datatypes/quantity'),
    Quantity = _require2.Quantity,
    doSubtraction = _require2.doSubtraction;

var _require3 = require('./logic'),
    ThreeValuedLogic = _require3.ThreeValuedLogic;

var _require4 = require('../util/math'),
    successor = _require4.successor,
    predecessor = _require4.predecessor,
    maxValueForInstance = _require4.maxValueForInstance,
    minValueForInstance = _require4.minValueForInstance;

var cmp = require('../util/comparison');

var Interval = /*#__PURE__*/function () {
  function Interval(low, high, lowClosed, highClosed) {
    _classCallCheck(this, Interval);

    this.low = low;
    this.high = high;
    this.lowClosed = lowClosed != null ? lowClosed : true;
    this.highClosed = highClosed != null ? highClosed : true;
  }

  _createClass(Interval, [{
    key: "copy",
    value: function copy() {
      var newLow = this.low;
      var newHigh = this.high;

      if (this.low != null && typeof this.low.copy === 'function') {
        newLow = this.low.copy();
      }

      if (this.high != null && typeof this.high.copy === 'function') {
        newHigh = this.high.copy();
      }

      return new Interval(newLow, newHigh, this.lowClosed, this.highClosed);
    }
  }, {
    key: "contains",
    value: function contains(item, precision) {
      // These first two checks ensure correct handling of edge case where an item equals the closed boundary
      if (this.lowClosed && this.low != null && cmp.equals(this.low, item)) {
        return true;
      }

      if (this.highClosed && this.high != null && cmp.equals(this.high, item)) {
        return true;
      }

      if (item != null && item.isInterval) {
        throw new Error('Argument to contains must be a point');
      }

      var lowFn;

      if (this.lowClosed && this.low == null) {
        lowFn = function lowFn() {
          return true;
        };
      } else if (this.lowClosed) {
        lowFn = cmp.lessThanOrEquals;
      } else {
        lowFn = cmp.lessThan;
      }

      var highFn;

      if (this.highClosed && this.high == null) {
        highFn = function highFn() {
          return true;
        };
      } else if (this.highClosed) {
        highFn = cmp.greaterThanOrEquals;
      } else {
        highFn = cmp.greaterThan;
      }

      return ThreeValuedLogic.and(lowFn(this.low, item, precision), highFn(this.high, item, precision));
    }
  }, {
    key: "properlyIncludes",
    value: function properlyIncludes(other, precision) {
      if (other == null || !other.isInterval) {
        throw new Error('Argument to properlyIncludes must be an interval');
      }

      return ThreeValuedLogic.and(this.includes(other, precision), ThreeValuedLogic.not(other.includes(this, precision)));
    }
  }, {
    key: "includes",
    value: function includes(other, precision) {
      if (other == null || !other.isInterval) {
        return this.contains(other, precision);
      }

      var a = this.toClosed();
      var b = other.toClosed();
      return ThreeValuedLogic.and(cmp.lessThanOrEquals(a.low, b.low, precision), cmp.greaterThanOrEquals(a.high, b.high, precision));
    }
  }, {
    key: "includedIn",
    value: function includedIn(other, precision) {
      // For the point overload, this operator is a synonym for the in operator
      if (other == null || !other.isInterval) {
        return this.contains(other, precision);
      } else {
        return other.includes(this);
      }
    }
  }, {
    key: "overlaps",
    value: function overlaps(item, precision) {
      var closed = this.toClosed();

      var _ref = function () {
        if (item != null && item.isInterval) {
          var itemClosed = item.toClosed();
          return [itemClosed.low, itemClosed.high];
        } else {
          return [item, item];
        }
      }(),
          _ref2 = _slicedToArray(_ref, 2),
          low = _ref2[0],
          high = _ref2[1];

      return ThreeValuedLogic.and(cmp.lessThanOrEquals(closed.low, high, precision), cmp.greaterThanOrEquals(closed.high, low, precision));
    }
  }, {
    key: "overlapsAfter",
    value: function overlapsAfter(item, precision) {
      var closed = this.toClosed();
      var high = item != null && item.isInterval ? item.toClosed().high : item;
      return ThreeValuedLogic.and(cmp.lessThanOrEquals(closed.low, high, precision), cmp.greaterThan(closed.high, high, precision));
    }
  }, {
    key: "overlapsBefore",
    value: function overlapsBefore(item, precision) {
      var closed = this.toClosed();
      var low = item != null && item.isInterval ? item.toClosed().low : item;
      return ThreeValuedLogic.and(cmp.lessThan(closed.low, low, precision), cmp.greaterThanOrEquals(closed.high, low, precision));
    }
  }, {
    key: "union",
    value: function union(other) {
      if (other == null || !other.isInterval) {
        throw new Error('Argument to union must be an interval');
      } // Note that interval union is only defined if the arguments overlap or meet.


      if (this.overlaps(other) || this.meets(other)) {
        var _ref3 = [this.toClosed(), other.toClosed()],
            a = _ref3[0],
            b = _ref3[1];
        var l, lc;

        if (cmp.lessThanOrEquals(a.low, b.low)) {
          var _ref4 = [this.low, this.lowClosed];
          l = _ref4[0];
          lc = _ref4[1];
        } else if (cmp.greaterThanOrEquals(a.low, b.low)) {
          var _ref5 = [other.low, other.lowClosed];
          l = _ref5[0];
          lc = _ref5[1];
        } else if (areNumeric(a.low, b.low)) {
          var _ref6 = [lowestNumericUncertainty(a.low, b.low), true];
          l = _ref6[0];
          lc = _ref6[1];
        } else if (areDateTimes(a.low, b.low) && a.low.isMorePrecise(b.low)) {
          var _ref7 = [other.low, other.lowClosed];
          l = _ref7[0];
          lc = _ref7[1];
        } else {
          var _ref8 = [this.low, this.lowClosed];
          l = _ref8[0];
          lc = _ref8[1];
        }

        var h, hc;

        if (cmp.greaterThanOrEquals(a.high, b.high)) {
          var _ref9 = [this.high, this.highClosed];
          h = _ref9[0];
          hc = _ref9[1];
        } else if (cmp.lessThanOrEquals(a.high, b.high)) {
          var _ref10 = [other.high, other.highClosed];
          h = _ref10[0];
          hc = _ref10[1];
        } else if (areNumeric(a.high, b.high)) {
          var _ref11 = [highestNumericUncertainty(a.high, b.high), true];
          h = _ref11[0];
          hc = _ref11[1];
        } else if (areDateTimes(a.high, b.high) && a.high.isMorePrecise(b.high)) {
          var _ref12 = [other.high, other.highClosed];
          h = _ref12[0];
          hc = _ref12[1];
        } else {
          var _ref13 = [this.high, this.highClosed];
          h = _ref13[0];
          hc = _ref13[1];
        }

        return new Interval(l, h, lc, hc);
      } else {
        return null;
      }
    }
  }, {
    key: "intersect",
    value: function intersect(other) {
      if (other == null || !other.isInterval) {
        throw new Error('Argument to union must be an interval');
      } // Note that interval union is only defined if the arguments overlap.


      if (this.overlaps(other)) {
        var _ref14 = [this.toClosed(), other.toClosed()],
            a = _ref14[0],
            b = _ref14[1];
        var l, lc;

        if (cmp.greaterThanOrEquals(a.low, b.low)) {
          var _ref15 = [this.low, this.lowClosed];
          l = _ref15[0];
          lc = _ref15[1];
        } else if (cmp.lessThanOrEquals(a.low, b.low)) {
          var _ref16 = [other.low, other.lowClosed];
          l = _ref16[0];
          lc = _ref16[1];
        } else if (areNumeric(a.low, b.low)) {
          var _ref17 = [highestNumericUncertainty(a.low, b.low), true];
          l = _ref17[0];
          lc = _ref17[1];
        } else if (areDateTimes(a.low, b.low) && b.low.isMorePrecise(a.low)) {
          var _ref18 = [other.low, other.lowClosed];
          l = _ref18[0];
          lc = _ref18[1];
        } else {
          var _ref19 = [this.low, this.lowClosed];
          l = _ref19[0];
          lc = _ref19[1];
        }

        var h, hc;

        if (cmp.lessThanOrEquals(a.high, b.high)) {
          var _ref20 = [this.high, this.highClosed];
          h = _ref20[0];
          hc = _ref20[1];
        } else if (cmp.greaterThanOrEquals(a.high, b.high)) {
          var _ref21 = [other.high, other.highClosed];
          h = _ref21[0];
          hc = _ref21[1];
        } else if (areNumeric(a.high, b.high)) {
          var _ref22 = [lowestNumericUncertainty(a.high, b.high), true];
          h = _ref22[0];
          hc = _ref22[1];
        } else if (areDateTimes(a.high, b.high) && b.high.isMorePrecise(a.high)) {
          var _ref23 = [other.high, other.highClosed];
          h = _ref23[0];
          hc = _ref23[1];
        } else {
          var _ref24 = [this.high, this.highClosed];
          h = _ref24[0];
          hc = _ref24[1];
        }

        return new Interval(l, h, lc, hc);
      } else {
        return null;
      }
    }
  }, {
    key: "except",
    value: function except(other) {
      if (other === null) {
        return null;
      }

      if (other == null || !other.isInterval) {
        throw new Error('Argument to except must be an interval');
      }

      var ol = this.overlaps(other);

      if (ol === true) {
        var olb = this.overlapsBefore(other);
        var ola = this.overlapsAfter(other);

        if (olb === true && ola === false) {
          return new Interval(this.low, other.low, this.lowClosed, !other.lowClosed);
        } else if (ola === true && olb === false) {
          return new Interval(other.high, this.high, !other.highClosed, this.highClosed);
        } else {
          return null;
        }
      } else if (ol === false) {
        return this;
      } else {
        // ol is null
        return null;
      }
    }
  }, {
    key: "sameAs",
    value: function sameAs(other, precision) {
      // This large if and else if block handles the scenarios where there is an open ended null
      // If both lows or highs exists, it can be determined that intervals are not Same As
      if (this.low != null && other.low != null && this.high == null && other.high != null && !this.highClosed || this.low != null && other.low != null && this.high != null && other.high == null && !other.highClosed || this.low != null && other.low != null && this.high == null && other.high == null && !other.highClosed && !this.highClosed) {
        if (typeof this.low === 'number') {
          if (!(this.start() === other.start())) {
            return false;
          }
        } else {
          if (!this.start().sameAs(other.start(), precision)) {
            return false;
          }
        }
      } else if (this.low != null && other.low == null && this.high != null && other.high != null || this.low == null && other.low != null && this.high != null && other.high != null || this.low == null && other.low == null && this.high != null && other.high != null) {
        if (typeof this.high === 'number') {
          if (!(this.end() === other.end())) {
            return false;
          }
        } else {
          if (!this.end().sameAs(other.end(), precision)) {
            return false;
          }
        }
      } // Checks to see if any of the Intervals have a open, null boundary


      if (this.low == null && !this.lowClosed || this.high == null && !this.highClosed || other.low == null && !other.lowClosed || other.high == null && !other.highClosed) {
        return null;
      } // For the special cases where @ is Interval[null,null]


      if (this.lowClosed && this.low == null && this.highClosed && this.high == null) {
        return other.lowClosed && other.low == null && other.highClosed && other.high == null;
      } // For the special case where Interval[...] same as Interval[null,null] should return false.
      // This accounts for the inverse of the if statement above: where the second Interval is
      // [null,null] and not the first Interval.
      // The reason why this isn't caught below is due to how start() and end() work.
      // There is no way to tell the datatype for MIN and MAX if both boundaries are null.


      if (other.lowClosed && other.low == null && other.highClosed && other.high == null) {
        return false;
      }

      if (typeof this.low === 'number') {
        return this.start() === other.start() && this.end() === other.end();
      } else {
        return this.start().sameAs(other.start(), precision) && this.end().sameAs(other.end(), precision);
      }
    }
  }, {
    key: "sameOrBefore",
    value: function sameOrBefore(other, precision) {
      if (this.end() == null || other == null || other.start() == null) {
        return null;
      } else {
        return this.end().sameOrBefore(other.start(), precision);
      }
    }
  }, {
    key: "sameOrAfter",
    value: function sameOrAfter(other, precision) {
      if (this.start() == null || other == null || other.end() == null) {
        return null;
      } else {
        return this.start().sameOrAfter(other.end(), precision);
      }
    }
  }, {
    key: "equals",
    value: function equals(other) {
      if (other != null && other.isInterval) {
        var _ref25 = [this.toClosed(), other.toClosed()],
            a = _ref25[0],
            b = _ref25[1];
        return ThreeValuedLogic.and(cmp.equals(a.low, b.low), cmp.equals(a.high, b.high));
      } else {
        return false;
      }
    }
  }, {
    key: "after",
    value: function after(other, precision) {
      var closed = this.toClosed(); // Meets spec, but not 100% correct (e.g., (null, 5] after [6, 10] --> null)
      // Simple way to fix it: and w/ not overlaps

      if (other.toClosed) {
        return cmp.greaterThan(closed.low, other.toClosed().high, precision);
      } else {
        return cmp.greaterThan(closed.low, other, precision);
      }
    }
  }, {
    key: "before",
    value: function before(other, precision) {
      var closed = this.toClosed(); // Meets spec, but not 100% correct (e.g., (null, 5] after [6, 10] --> null)
      // Simple way to fix it: and w/ not overlaps

      if (other.toClosed) {
        return cmp.lessThan(closed.high, other.toClosed().low, precision);
      } else {
        return cmp.lessThan(closed.high, other, precision);
      }
    }
  }, {
    key: "meets",
    value: function meets(other, precision) {
      return ThreeValuedLogic.or(this.meetsBefore(other, precision), this.meetsAfter(other, precision));
    }
  }, {
    key: "meetsAfter",
    value: function meetsAfter(other, precision) {
      try {
        if (precision != null && this.low != null && this.low.isDateTime) {
          return this.toClosed().low.sameAs(other.toClosed().high != null ? other.toClosed().high.add(1, precision) : null, precision);
        } else {
          return cmp.equals(this.toClosed().low, successor(other.toClosed().high));
        }
      } catch (error) {
        return false;
      }
    }
  }, {
    key: "meetsBefore",
    value: function meetsBefore(other, precision) {
      try {
        if (precision != null && this.high != null && this.high.isDateTime) {
          return this.toClosed().high.sameAs(other.toClosed().low != null ? other.toClosed().low.add(-1, precision) : null, precision);
        } else {
          return cmp.equals(this.toClosed().high, predecessor(other.toClosed().low));
        }
      } catch (error) {
        return false;
      }
    }
  }, {
    key: "start",
    value: function start() {
      if (this.low == null) {
        if (this.lowClosed) {
          return minValueForInstance(this.high);
        } else {
          return this.low;
        }
      }

      return this.toClosed().low;
    }
  }, {
    key: "end",
    value: function end() {
      if (this.high == null) {
        if (this.highClosed) {
          return maxValueForInstance(this.low);
        } else {
          return this.high;
        }
      }

      return this.toClosed().high;
    }
  }, {
    key: "starts",
    value: function starts(other, precision) {
      var startEqual;

      if (precision != null && this.low != null && this.low.isDateTime) {
        startEqual = this.low.sameAs(other.low, precision);
      } else {
        startEqual = cmp.equals(this.low, other.low);
      }

      var endLessThanOrEqual = cmp.lessThanOrEquals(this.high, other.high, precision);
      return startEqual && endLessThanOrEqual;
    }
  }, {
    key: "ends",
    value: function ends(other, precision) {
      var endEqual;
      var startGreaterThanOrEqual = cmp.greaterThanOrEquals(this.low, other.low, precision);

      if (precision != null && (this.low != null ? this.low.isDateTime : undefined)) {
        endEqual = this.high.sameAs(other.high, precision);
      } else {
        endEqual = cmp.equals(this.high, other.high);
      }

      return startGreaterThanOrEqual && endEqual;
    }
  }, {
    key: "width",
    value: function width() {
      if (this.low != null && (this.low.isDateTime || this.low.isDate || this.low.isTime) || this.high != null && (this.high.isDateTime || this.high.isDate || this.high.isTime)) {
        throw new Error('Width of Date, DateTime, and Time intervals is not supported');
      }

      var closed = this.toClosed();

      if (closed.low != null && closed.low.isUncertainty || closed.high != null && closed.high.isUncertainty) {
        return null;
      } else if (closed.low.isQuantity) {
        if (closed.low.unit !== closed.high.unit) {
          throw new Error('Cannot calculate width of Quantity Interval with different units');
        }

        var lowValue = closed.low.value;
        var highValue = closed.high.value;
        var diff = Math.abs(highValue - lowValue);
        diff = Math.round(diff * Math.pow(10, 8)) / Math.pow(10, 8);
        return new Quantity(diff, closed.low.unit);
      } else {
        // TODO: Fix precision to 8 decimals in other places that return numbers
        var _diff = Math.abs(closed.high - closed.low);

        return Math.round(_diff * Math.pow(10, 8)) / Math.pow(10, 8);
      }
    }
  }, {
    key: "size",
    value: function size() {
      var pointSize = this.getPointSize();

      if (this.low != null && (this.low.isDateTime || this.low.isDate || this.low.isTime) || this.high != null && (this.high.isDateTime || this.high.isDate || this.high.isTime)) {
        throw new Error('Size of Date, DateTime, and Time intervals is not supported');
      }

      var closed = this.toClosed();

      if (closed.low != null && closed.low.isUncertainty || closed.high != null && closed.high.isUncertainty) {
        return null;
      } else if (closed.low.isQuantity) {
        if (closed.low.unit !== closed.high.unit) {
          throw new Error('Cannot calculate size of Quantity Interval with different units');
        }

        var lowValue = closed.low.value;
        var highValue = closed.high.value;
        var diff = Math.abs(highValue - lowValue) + pointSize.value;
        Math.round(diff * Math.pow(10, 8)) / Math.pow(10, 8);
        return new Quantity(diff, closed.low.unit);
      } else {
        var _diff2 = Math.abs(closed.high - closed.low) + pointSize.value;

        return Math.round(_diff2 * Math.pow(10, 8)) / Math.pow(10, 8);
      }
    }
  }, {
    key: "getPointSize",
    value: function getPointSize() {
      var pointSize;

      if (this.low != null) {
        if (this.low.isDateTime) {
          pointSize = new Quantity(1, this.low.getPrecision());
        } else if (this.low.isQuantity) {
          pointSize = doSubtraction(successor(this.low), this.low);
        } else {
          pointSize = successor(this.low) - this.low;
        }
      } else if (this.high != null) {
        if (this.high.isDateTime) {
          pointSize = new Quantity(1, this.high.getPrecision());
        } else if (this.high.isQuantity) {
          pointSize = doSubtraction(successor(this.high), this.high);
        } else {
          pointSize = successor(this.high) - this.high;
        }
      } else {
        throw new Error('Point type of intervals cannot be determined.');
      }

      if (typeof pointSize === 'number') {
        pointSize = new Quantity(pointSize, '1');
      }

      return pointSize;
    }
  }, {
    key: "toClosed",
    value: function toClosed() {
      var point = this.low != null ? this.low : this.high;

      if (typeof point === 'number' || point != null && (point.isDateTime || point.isQuantity || point.isDate)) {
        var low;

        if (this.lowClosed && this.low == null) {
          low = minValueForInstance(point);
        } else if (!this.lowClosed && this.low != null) {
          low = successor(this.low);
        } else {
          low = this.low;
        }

        var high;

        if (this.highClosed && this.high == null) {
          high = maxValueForInstance(point);
        } else if (!this.highClosed && this.high != null) {
          high = predecessor(this.high);
        } else {
          high = this.high;
        }

        if (low == null) {
          low = new Uncertainty(minValueForInstance(point), high);
        }

        if (high == null) {
          high = new Uncertainty(low, maxValueForInstance(point));
        }

        return new Interval(low, high, true, true);
      } else {
        return new Interval(this.low, this.high, true, true);
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      var start = this.lowClosed ? '[' : '(';
      var end = this.highClosed ? ']' : ')';
      return start + this.low.toString() + ', ' + this.high.toString() + end;
    }
  }, {
    key: "isInterval",
    get: function get() {
      return true;
    }
  }]);

  return Interval;
}();

function areDateTimes(x, y) {
  return [x, y].every(function (z) {
    return z != null && z.isDateTime;
  });
}

function areNumeric(x, y) {
  return [x, y].every(function (z) {
    return typeof z === 'number' || z != null && z.isUncertainty && typeof z.low === 'number';
  });
}

function lowestNumericUncertainty(x, y) {
  if (x == null || !x.isUncertainty) {
    x = new Uncertainty(x);
  }

  if (y == null || !y.isUncertainty) {
    y = new Uncertainty(y);
  }

  var low = x.low < y.low ? x.low : y.low;
  var high = x.high < y.high ? x.high : y.high;

  if (low !== high) {
    return new Uncertainty(low, high);
  } else {
    return low;
  }
}

function highestNumericUncertainty(x, y) {
  if (x == null || !x.isUncertainty) {
    x = new Uncertainty(x);
  }

  if (y == null || !y.isUncertainty) {
    y = new Uncertainty(y);
  }

  var low = x.low > y.low ? x.low : y.low;
  var high = x.high > y.high ? x.high : y.high;

  if (low !== high) {
    return new Uncertainty(low, high);
  } else {
    return low;
  }
}

module.exports = {
  Interval: Interval
};
},{"../datatypes/quantity":11,"../util/comparison":45,"../util/math":46,"./logic":10,"./uncertainty":13}],10:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ThreeValuedLogic = /*#__PURE__*/function () {
  function ThreeValuedLogic() {
    _classCallCheck(this, ThreeValuedLogic);
  }

  _createClass(ThreeValuedLogic, null, [{
    key: "and",
    value: function and() {
      for (var _len = arguments.length, val = new Array(_len), _key = 0; _key < _len; _key++) {
        val[_key] = arguments[_key];
      }

      if (val.includes(false)) {
        return false;
      } else if (val.includes(null)) {
        return null;
      } else {
        return true;
      }
    }
  }, {
    key: "or",
    value: function or() {
      for (var _len2 = arguments.length, val = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        val[_key2] = arguments[_key2];
      }

      if (val.includes(true)) {
        return true;
      } else if (val.includes(null)) {
        return null;
      } else {
        return false;
      }
    }
  }, {
    key: "xor",
    value: function xor() {
      for (var _len3 = arguments.length, val = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        val[_key3] = arguments[_key3];
      }

      if (val.includes(null)) {
        return null;
      } else {
        return val.reduce(function (a, b) {
          return (!a ^ !b) === 1;
        });
      }
    }
  }, {
    key: "not",
    value: function not(val) {
      if (val != null) {
        return !val;
      } else {
        return null;
      }
    }
  }]);

  return ThreeValuedLogic;
}();

module.exports = {
  ThreeValuedLogic: ThreeValuedLogic
};
},{}],11:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../util/math'),
    decimalAdjust = _require.decimalAdjust,
    isValidDecimal = _require.isValidDecimal,
    overflowsOrUnderflows = _require.overflowsOrUnderflows;

var ucum = require('ucum');

var Quantity = /*#__PURE__*/function () {
  function Quantity(value, unit) {
    _classCallCheck(this, Quantity);

    this.value = value;
    this.unit = unit;

    if (this.value == null || isNaN(this.value)) {
      throw new Error('Cannot create a quantity with an undefined value');
    } else if (!isValidDecimal(this.value)) {
      throw new Error('Cannot create a quantity with an invalid decimal value');
    } // Attempt to parse the unit with UCUM. If it fails, throw a friendly error.


    if (this.unit != null && !is_valid_ucum_unit(this.unit)) {
      throw new Error("'".concat(this.unit, "' is not a valid UCUM unit."));
    }
  }

  _createClass(Quantity, [{
    key: "clone",
    value: function clone() {
      return new Quantity(this.value, this.unit);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "".concat(this.value, " '").concat(this.unit, "'");
    }
  }, {
    key: "sameOrBefore",
    value: function sameOrBefore(other) {
      if (other != null && other.isQuantity) {
        var other_v = convert_value(other.value, ucum_unit(other.unit), ucum_unit(this.unit));

        if (other_v == null) {
          return null;
        } else {
          return this.value <= other_v;
        }
      }
    }
  }, {
    key: "sameOrAfter",
    value: function sameOrAfter(other) {
      if (other != null && other.isQuantity) {
        var other_v = convert_value(other.value, ucum_unit(other.unit), ucum_unit(this.unit));

        if (other_v == null) {
          return null;
        } else {
          return this.value >= other_v;
        }
      }
    }
  }, {
    key: "after",
    value: function after(other) {
      if (other != null && other.isQuantity) {
        var other_v = convert_value(other.value, ucum_unit(other.unit), ucum_unit(this.unit));

        if (other_v == null) {
          return null;
        } else {
          return this.value > other_v;
        }
      }
    }
  }, {
    key: "before",
    value: function before(other) {
      if (other != null && other.isQuantity) {
        var other_v = convert_value(other.value, ucum_unit(other.unit), ucum_unit(this.unit));

        if (other_v == null) {
          return null;
        } else {
          return this.value < other_v;
        }
      }
    }
  }, {
    key: "equals",
    value: function equals(other) {
      if (other != null && other.isQuantity) {
        if (!this.unit && other.unit || this.unit && !other.unit) {
          return false;
        } else if (!this.unit && !other.unit) {
          return this.value === other.value;
        } else {
          var other_v = convert_value(other.value, ucum_unit(other.unit), ucum_unit(this.unit));

          if (other_v == null) {
            return null;
          } else {
            return decimalAdjust('round', this.value, -8) === decimalAdjust('round', other_v, -8);
          }
        }
      }
    }
  }, {
    key: "convertUnit",
    value: function convertUnit(to_unit) {
      var value = convert_value(this.value, this.unit, to_unit);
      var unit = to_unit; // Need to pass through constructor again to catch invalid units

      return new Quantity(value, unit);
    }
  }, {
    key: "dividedBy",
    value: function dividedBy(other) {
      return this.multiplyDivide(other, '/');
    }
  }, {
    key: "multiplyBy",
    value: function multiplyBy(other) {
      return this.multiplyDivide(other, '.'); // in ucum . represents multiplication
    }
  }, {
    key: "multiplyDivide",
    value: function multiplyDivide(other, operator) {
      if (other != null && other.isQuantity) {
        var a = this.unit != null ? this : new Quantity(this.value, '1');
        var b = other.unit != null ? other : new Quantity(other.value, '1');
        var can_val = a.to_ucum();
        var other_can_value = b.to_ucum();
        var ucum_value = ucum_multiply(can_val, [[operator, other_can_value]]);

        if (overflowsOrUnderflows(ucum_value.value)) {
          return null;
        }

        try {
          return new Quantity(ucum_value.value, units_to_string(ucum_value.units));
        } catch (e) {
          return null;
        }
      } else {
        var value = operator === '/' ? this.value / other : this.value * other;

        if (overflowsOrUnderflows(value)) {
          return null;
        }

        try {
          return new Quantity(decimalAdjust('round', value, -8), coalesceToOne(this.unit));
        } catch (e) {
          return null;
        }
      }
    }
  }, {
    key: "to_ucum",
    value: function to_ucum() {
      var u = ucum.parse(ucum_unit(this.unit));
      u.value *= this.value;
      return u;
    }
  }, {
    key: "isQuantity",
    get: function get() {
      return true;
    }
  }]);

  return Quantity;
}();

function clean_unit(units) {
  if (ucum_time_units[units]) {
    return ucum_to_cql_units[ucum_time_units[units]];
  } else {
    return units;
  }
} // Hash of time units and their UCUM equivalents, both case-sensitive and case-insensitive
// See http://unitsofmeasure.org/ucum.html#para-31
// The CQL specification says that dates are based on the Gregorian calendar
// UCUM says that years should be Julian. As a result, CQL-based year and month identifiers will
// be matched to the UCUM gregorian units. UCUM-based year and month identifiers will be matched
// to the UCUM julian units.


var ucum_time_units = {
  years: 'a_g',
  year: 'a_g',
  YEARS: 'a_g',
  YEAR: 'a_g',
  a_g: 'a_g',
  a: 'a_j',
  ANN: 'a_j',
  ann: 'a_j',
  A: 'a_j',
  a_j: 'a_j',
  months: 'mo_g',
  month: 'mo_g',
  mo_g: 'mo_g',
  mo: 'mo_j',
  MO: 'mo_j',
  mo_j: 'mo_j',
  weeks: 'wk',
  week: 'wk',
  wk: 'wk',
  WK: 'wk',
  days: 'd',
  day: 'd',
  d: 'd',
  D: 'd',
  hours: 'h',
  hour: 'h',
  h: 'h',
  H: 'h',
  minutes: 'min',
  minute: 'min',
  min: 'min',
  MIN: 'min',
  seconds: 's',
  second: 's',
  s: 's',
  S: 's',
  milliseconds: 'ms',
  millisecond: 'ms',
  ms: 'ms',
  MS: 'ms'
};
var ucum_to_cql_units = {
  a_j: 'year',
  a_g: 'year',
  mo_j: 'month',
  mo_g: 'month',
  wk: 'week',
  d: 'day',
  h: 'hour',
  min: 'minute',
  s: 'second',
  ms: 'millisecond'
}; // this is used to perform any conversions of CQL date time fields to their ucum equivalents

function ucum_unit(unit) {
  return ucum_time_units[unit] || unit || '';
} // just a wrapper function to deal with possible exceptions being thrown


function convert_value(value, from, to) {
  try {
    if (from === to) {
      return value;
    } else {
      return decimalAdjust('round', ucum.convert(value, ucum_unit(from), ucum_unit(to)), -8);
    } // If the units could not be alignied ie: incompareable, exception will be thrown, return null

  } catch (e) {
    return null;
  }
} // Cache for unit validity results so we dont have to go to ucum.js for every check.
// Is a map of unit string to boolean validity


var unitValidityCache = {}; // Helper for checking if a unit is valid. Checks the cache first, checks with ucum.js otherwise.

function is_valid_ucum_unit(unit) {
  if (unitValidityCache[unit] != null) {
    return unitValidityCache[unit];
  } else {
    try {
      ucum.parse(ucum_unit(unit));
      unitValidityCache[unit] = true;
      return true;
    } catch (error) {
      unitValidityCache[unit] = false;
      return false;
    }
  }
} // This method will take a ucum.js representation of units and convert them to a string
// ucum.js units are a has of unit => power values.  For instance m/h (meters per hour) in
// ucum.js will be reprsented by the json object {m: 1, h:-1}  negative values are inverted and
// are akin to denominator values in a fraction.  Positive values are somewhat a kin to numerator
// values in that they preceed the inverted values.  It is possible in ucum to have multiple non inverted
// or inverted values.  This method combines all of the non inverted values and appends them with
// the ucum multiplication operator '.' and then appends the inverted values separated by the ucum
// divisor '/' .


function units_to_string() {
  var units = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var numer = [];
  var denom = [];

  for (var _i = 0, _Object$keys = Object.keys(units); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    var v = units[key];
    var pow = Math.abs(v);
    var str = pow === 1 ? key : key + pow;

    if (v < 0) {
      denom.push(str);
    } else {
      numer.push(str);
    }
  }

  var unit_string = '';
  unit_string += numer.join('.');

  if (denom.length > 0) {
    unit_string += '/' + denom.join('/');
  }

  if (unit_string === '') {
    return '1';
  } else {
    return unit_string;
  }
} // this method is taken from the ucum.js library which it does not  export
// so we need to replicate the behavior here in order to perform multiplication
// and division of the ucum values.
// t:  the ucum quantity being multiplied/divided .  This method modifies the object t that is passed in
// ms: an array of arrays whoes format is [<operator>,<ucum quantity>] an example would be [['.', {value: 1, units: {m:2}}]]
// this would represent multiply t by the value m^2


function ucum_multiply(t) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (ms.length === 0) {
    return t;
  }

  var ret = t;

  var _iterator = _createForOfIteratorHelper(ms),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var mterm = _step.value;
      var sign = mterm[0] === '.' ? 1 : -1;
      var b = mterm[1];
      ret.value *= Math.pow(b.value, sign);

      for (var k in b.units) {
        var v = b.units[k];
        ret.units[k] = ret.units[k] || 0;
        ret.units[k] = ret.units[k] + sign * v;

        if (ret.units[k] === 0) {
          delete ret.units[k];
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return ret;
}

function parseQuantity(str) {
  var components = /([+|-]?\d+\.?\d*)\s*('(.+)')?/.exec(str);

  if (components != null && components[1] != null) {
    var value = parseFloat(components[1]);

    if (!isValidDecimal(value)) {
      return null;
    }

    var unit;

    if (components[3] != null) {
      unit = components[3].trim();
    } else {
      unit = '';
    }

    return new Quantity(value, unit);
  } else {
    return null;
  }
}

function doScaledAddition(a, b, scaleForB) {
  var b_unit;

  if (a != null && a.isQuantity && b != null && b.isQuantity) {
    var a_unit;
    var _ref = [coalesceToOne(a.unit), coalesceToOne(b.unit)];
    a_unit = _ref[0];
    b_unit = _ref[1];
    // The units don't have to match (m and m^2), but must be convertable
    // we will choose the unit of a to be the unit we return
    var val = convert_value(b.value * scaleForB, b_unit, a_unit);

    if (val == null) {
      return null;
    }

    var sum = a.value + val;

    if (overflowsOrUnderflows(sum)) {
      return null;
    } else {
      return new Quantity(sum, a_unit);
    }
  } else if (a.copy && a.add) {
    b_unit = b != null && b.isQuantity ? coalesceToOne(b.unit) : b.unit;
    return a.copy().add(b.value * scaleForB, clean_unit(b_unit));
  } else {
    throw new Error('Unsupported argument types.');
  }
}

function doAddition(a, b) {
  return doScaledAddition(a, b, 1);
}

function doSubtraction(a, b) {
  return doScaledAddition(a, b, -1);
}

function doDivision(a, b) {
  if (a != null && a.isQuantity) {
    return a.dividedBy(b);
  }
}

function doMultiplication(a, b) {
  if (a != null && a.isQuantity) {
    return a.multiplyBy(b);
  } else {
    return b.multiplyBy(a);
  }
}

function coalesceToOne(o) {
  if (o == null || o.trim != null && !o.trim()) {
    return '1';
  } else {
    return o;
  }
}

function compare_units(unit_a, unit_b) {
  try {
    var c = ucum.convert(1, ucum_unit(unit_a), ucum_unit(unit_b));

    if (c > 1) {
      return 1; // unit_a is bigger (less precise)
    }

    if (c < 1) {
      return -1; // unit_a is smaller
    }

    return 0; //units are the same
  } catch (e) {
    return null;
  }
}

module.exports = {
  Quantity: Quantity,
  convert_value: convert_value,
  parseQuantity: parseQuantity,
  doAddition: doAddition,
  doSubtraction: doSubtraction,
  doDivision: doDivision,
  doMultiplication: doMultiplication,
  compare_units: compare_units
};
},{"../util/math":46,"ucum":56}],12:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Ratio = /*#__PURE__*/function () {
  function Ratio(numerator, denominator) {
    _classCallCheck(this, Ratio);

    this.numerator = numerator;
    this.denominator = denominator;

    if (this.numerator == null) {
      throw new Error('Cannot create a ratio with an undefined numerator');
    }

    if (this.denominator == null) {
      throw new Error('Cannot create a ratio with an undefined denominator');
    }
  }

  _createClass(Ratio, [{
    key: "clone",
    value: function clone() {
      return new Ratio(this.numerator.clone(), this.denominator.clone());
    }
  }, {
    key: "toString",
    value: function toString() {
      return "".concat(this.numerator.toString(), " : ").concat(this.denominator.toString());
    }
  }, {
    key: "equals",
    value: function equals(other) {
      if (other != null && other.isRatio) {
        var divided_this = this.numerator.dividedBy(this.denominator);
        var divided_other = other.numerator.dividedBy(other.denominator);
        return divided_this.equals(divided_other);
      } else {
        return false;
      }
    }
  }, {
    key: "equivalent",
    value: function equivalent(other) {
      var equal = this.equals(other);
      return equal != null ? equal : false;
    }
  }, {
    key: "isRatio",
    get: function get() {
      return true;
    }
  }]);

  return Ratio;
}();

module.exports = {
  Ratio: Ratio
};
},{}],13:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./logic'),
    ThreeValuedLogic = _require.ThreeValuedLogic;

var Uncertainty = /*#__PURE__*/function () {
  _createClass(Uncertainty, null, [{
    key: "from",
    value: function from(obj) {
      if (obj != null && obj.isUncertainty) {
        return obj;
      } else {
        return new Uncertainty(obj);
      }
    }
  }]);

  function Uncertainty() {
    var low = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var high = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, Uncertainty);

    this.low = low;
    this.high = high;

    var gt = function gt(a, b) {
      if (_typeof(a) !== _typeof(b)) {
        // TODO: This should probably throw rather than return false.
        // Uncertainties with different types probably shouldn't be supported.
        return false;
      }

      if (typeof a.after === 'function') {
        return a.after(b);
      } else {
        return a > b;
      }
    };

    var isNonEnumerable = function isNonEnumerable(val) {
      return val != null && (val.isCode || val.isConcept || val.isValueSet);
    };

    if (typeof this.high === 'undefined') {
      this.high = this.low;
    }

    if (isNonEnumerable(this.low) || isNonEnumerable(this.high)) {
      this.low = this.high = null;
    }

    if (this.low != null && this.high != null && gt(this.low, this.high)) {
      var _ref = [this.high, this.low];
      this.low = _ref[0];
      this.high = _ref[1];
    }
  }

  _createClass(Uncertainty, [{
    key: "copy",
    value: function copy() {
      var newLow = this.low;
      var newHigh = this.high;

      if (typeof this.low.copy === 'function') {
        newLow = this.low.copy();
      }

      if (typeof this.high.copy === 'function') {
        newHigh = this.high.copy();
      }

      return new Uncertainty(newLow, newHigh);
    }
  }, {
    key: "isPoint",
    value: function isPoint() {
      // Note: Can't use normal equality, as that fails for Javascript dates
      // TODO: Fix after we don't need to support Javascript date uncertainties anymore
      var lte = function lte(a, b) {
        if (_typeof(a) !== _typeof(b)) {
          return false;
        }

        if (typeof a.sameOrBefore === 'function') {
          return a.sameOrBefore(b);
        } else {
          return a <= b;
        }
      };

      var gte = function gte(a, b) {
        if (_typeof(a) !== _typeof(b)) {
          return false;
        }

        if (typeof a.sameOrBefore === 'function') {
          return a.sameOrAfter(b);
        } else {
          return a >= b;
        }
      };

      return this.low != null && this.high != null && lte(this.low, this.high) && gte(this.low, this.high);
    }
  }, {
    key: "equals",
    value: function equals(other) {
      other = Uncertainty.from(other);
      return ThreeValuedLogic.not(ThreeValuedLogic.or(this.lessThan(other), this.greaterThan(other)));
    }
  }, {
    key: "lessThan",
    value: function lessThan(other) {
      var lt = function lt(a, b) {
        if (_typeof(a) !== _typeof(b)) {
          return false;
        }

        if (typeof a.before === 'function') {
          return a.before(b);
        } else {
          return a < b;
        }
      };

      other = Uncertainty.from(other);
      var bestCase = this.low == null || other.high == null || lt(this.low, other.high);
      var worstCase = this.high != null && other.low != null && lt(this.high, other.low);

      if (bestCase === worstCase) {
        return bestCase;
      } else {
        return null;
      }
    }
  }, {
    key: "greaterThan",
    value: function greaterThan(other) {
      return Uncertainty.from(other).lessThan(this);
    }
  }, {
    key: "lessThanOrEquals",
    value: function lessThanOrEquals(other) {
      return ThreeValuedLogic.not(this.greaterThan(Uncertainty.from(other)));
    }
  }, {
    key: "greaterThanOrEquals",
    value: function greaterThanOrEquals(other) {
      return ThreeValuedLogic.not(this.lessThan(Uncertainty.from(other)));
    }
  }, {
    key: "isUncertainty",
    get: function get() {
      return true;
    }
  }]);

  return Uncertainty;
}();

module.exports = {
  Uncertainty: Uncertainty
};
},{"./logic":10}],14:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('../util/util'),
    typeIsArray = _require2.typeIsArray,
    allTrue = _require2.allTrue,
    anyTrue = _require2.anyTrue,
    removeNulls = _require2.removeNulls,
    numerical_sort = _require2.numerical_sort;

var _require3 = require('./builder'),
    build = _require3.build;

var _require4 = require('../datatypes/exception'),
    Exception = _require4.Exception;

var _require5 = require('../util/comparison'),
    greaterThan = _require5.greaterThan,
    lessThan = _require5.lessThan;

var _require6 = require('../datatypes/quantity'),
    Quantity = _require6.Quantity;

var AggregateExpression = /*#__PURE__*/function (_Expression) {
  _inherits(AggregateExpression, _Expression);

  var _super = _createSuper(AggregateExpression);

  function AggregateExpression(json) {
    var _this;

    _classCallCheck(this, AggregateExpression);

    _this = _super.call(this, json);
    _this.source = build(json.source);
    return _this;
  }

  return AggregateExpression;
}(Expression);

var Count = /*#__PURE__*/function (_AggregateExpression) {
  _inherits(Count, _AggregateExpression);

  var _super2 = _createSuper(Count);

  function Count(json) {
    _classCallCheck(this, Count);

    return _super2.call(this, json);
  }

  _createClass(Count, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);

      if (!typeIsArray(items)) {
        return null;
      }

      return removeNulls(items).length;
    }
  }]);

  return Count;
}(AggregateExpression);

var Sum = /*#__PURE__*/function (_AggregateExpression2) {
  _inherits(Sum, _AggregateExpression2);

  var _super3 = _createSuper(Sum);

  function Sum(json) {
    _classCallCheck(this, Sum);

    return _super3.call(this, json);
  }

  _createClass(Sum, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);

      if (!typeIsArray(items)) {
        return null;
      }

      try {
        items = processQuantities(items);
      } catch (e) {
        return null;
      }

      if (items.length === 0) {
        return null;
      }

      if (hasOnlyQuantities(items)) {
        var values = getValuesFromQuantities(items);
        var sum = values.reduce(function (x, y) {
          return x + y;
        });
        return new Quantity(sum, items[0].unit);
      } else {
        return items.reduce(function (x, y) {
          return x + y;
        });
      }
    }
  }]);

  return Sum;
}(AggregateExpression);

var Min = /*#__PURE__*/function (_AggregateExpression3) {
  _inherits(Min, _AggregateExpression3);

  var _super4 = _createSuper(Min);

  function Min(json) {
    _classCallCheck(this, Min);

    return _super4.call(this, json);
  }

  _createClass(Min, [{
    key: "exec",
    value: function exec(ctx) {
      var list = this.source.execute(ctx);

      if (list == null) {
        return null;
      }

      var listWithoutNulls = removeNulls(list); // Check for incompatible units and return null. We don't want to convert
      // the units for Min/Max, so we throw away the converted array if it succeeds

      try {
        processQuantities(list);
      } catch (e) {
        return null;
      }

      if (listWithoutNulls.length === 0) {
        return null;
      } // We assume the list is an array of all the same type.


      var minimum = listWithoutNulls[0];

      var _iterator = _createForOfIteratorHelper(listWithoutNulls),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var element = _step.value;

          if (lessThan(element, minimum)) {
            minimum = element;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return minimum;
    }
  }]);

  return Min;
}(AggregateExpression);

var Max = /*#__PURE__*/function (_AggregateExpression4) {
  _inherits(Max, _AggregateExpression4);

  var _super5 = _createSuper(Max);

  function Max(json) {
    _classCallCheck(this, Max);

    return _super5.call(this, json);
  }

  _createClass(Max, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);

      if (items == null) {
        return null;
      }

      var listWithoutNulls = removeNulls(items); // Check for incompatible units and return null. We don't want to convert
      // the units for Min/Max, so we throw away the converted array if it succeeds

      try {
        processQuantities(items);
      } catch (e) {
        return null;
      }

      if (listWithoutNulls.length === 0) {
        return null;
      } // We assume the list is an array of all the same type.


      var maximum = listWithoutNulls[0];

      var _iterator2 = _createForOfIteratorHelper(listWithoutNulls),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var element = _step2.value;

          if (greaterThan(element, maximum)) {
            maximum = element;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return maximum;
    }
  }]);

  return Max;
}(AggregateExpression);

var Avg = /*#__PURE__*/function (_AggregateExpression5) {
  _inherits(Avg, _AggregateExpression5);

  var _super6 = _createSuper(Avg);

  function Avg(json) {
    _classCallCheck(this, Avg);

    return _super6.call(this, json);
  }

  _createClass(Avg, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);

      if (!typeIsArray(items)) {
        return null;
      }

      try {
        items = processQuantities(items);
      } catch (e) {
        return null;
      }

      if (items.length === 0) {
        return null;
      }

      if (hasOnlyQuantities(items)) {
        var values = getValuesFromQuantities(items);
        var sum = values.reduce(function (x, y) {
          return x + y;
        });
        return new Quantity(sum / values.length, items[0].unit);
      } else {
        var _sum = items.reduce(function (x, y) {
          return x + y;
        });

        return _sum / items.length;
      }
    }
  }]);

  return Avg;
}(AggregateExpression);

var Median = /*#__PURE__*/function (_AggregateExpression6) {
  _inherits(Median, _AggregateExpression6);

  var _super7 = _createSuper(Median);

  function Median(json) {
    _classCallCheck(this, Median);

    return _super7.call(this, json);
  }

  _createClass(Median, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);

      if (!typeIsArray(items)) {
        return null;
      }

      if (items.length === 0) {
        return null;
      }

      try {
        items = processQuantities(items);
      } catch (e) {
        return null;
      }

      if (!hasOnlyQuantities(items)) {
        return medianOfNumbers(items);
      }

      var values = getValuesFromQuantities(items);
      var median = medianOfNumbers(values);
      return new Quantity(median, items[0].unit);
    }
  }]);

  return Median;
}(AggregateExpression);

var Mode = /*#__PURE__*/function (_AggregateExpression7) {
  _inherits(Mode, _AggregateExpression7);

  var _super8 = _createSuper(Mode);

  function Mode(json) {
    _classCallCheck(this, Mode);

    return _super8.call(this, json);
  }

  _createClass(Mode, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);

      if (!typeIsArray(items)) {
        return null;
      }

      if (items.length === 0) {
        return null;
      }

      var filtered;

      try {
        filtered = processQuantities(items);
      } catch (e) {
        return null;
      }

      if (hasOnlyQuantities(filtered)) {
        var values = getValuesFromQuantities(filtered);
        var mode = this.mode(values);

        if (mode.length === 1) {
          mode = mode[0];
        }

        return new Quantity(mode, items[0].unit);
      } else {
        var _mode = this.mode(filtered);

        if (_mode.length === 1) {
          return _mode[0];
        } else {
          return _mode;
        }
      }
    }
  }, {
    key: "mode",
    value: function mode(arr) {
      var max = 0;
      var counts = {};
      var results = [];

      var _iterator3 = _createForOfIteratorHelper(arr),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var elem = _step3.value;
          var cnt = counts[elem] = (counts[elem] != null ? counts[elem] : 0) + 1;

          if (cnt === max && !results.includes(elem)) {
            results.push(elem);
          } else if (cnt > max) {
            results = [elem];
            max = cnt;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return results;
    }
  }]);

  return Mode;
}(AggregateExpression);

var StdDev = /*#__PURE__*/function (_AggregateExpression8) {
  _inherits(StdDev, _AggregateExpression8);

  var _super9 = _createSuper(StdDev);

  // TODO: This should be a derived class of an abstract base class 'Statistic'
  // rather than the base class
  function StdDev(json) {
    var _this2;

    _classCallCheck(this, StdDev);

    _this2 = _super9.call(this, json);
    _this2.type = 'standard_deviation';
    return _this2;
  }

  _createClass(StdDev, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);

      if (!typeIsArray(items)) {
        return null;
      }

      try {
        items = processQuantities(items);
      } catch (e) {
        return null;
      }

      if (items.length === 0) {
        return null;
      }

      if (hasOnlyQuantities(items)) {
        var values = getValuesFromQuantities(items);
        var stdDev = this.standardDeviation(values);
        return new Quantity(stdDev, items[0].unit);
      } else {
        return this.standardDeviation(items);
      }
    }
  }, {
    key: "standardDeviation",
    value: function standardDeviation(list) {
      var val = this.stats(list);

      if (val) {
        return val[this.type];
      }
    }
  }, {
    key: "stats",
    value: function stats(list) {
      var sum = list.reduce(function (x, y) {
        return x + y;
      });
      var mean = sum / list.length;
      var sumOfSquares = 0;

      var _iterator4 = _createForOfIteratorHelper(list),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var sq = _step4.value;
          sumOfSquares += Math.pow(sq - mean, 2);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var std_var = 1 / list.length * sumOfSquares;
      var pop_var = 1 / (list.length - 1) * sumOfSquares;
      var std_dev = Math.sqrt(std_var);
      var pop_dev = Math.sqrt(pop_var);
      return {
        standard_variance: std_var,
        population_variance: pop_var,
        standard_deviation: std_dev,
        population_deviation: pop_dev
      };
    }
  }]);

  return StdDev;
}(AggregateExpression);

var Product = /*#__PURE__*/function (_AggregateExpression9) {
  _inherits(Product, _AggregateExpression9);

  var _super10 = _createSuper(Product);

  function Product(json) {
    _classCallCheck(this, Product);

    return _super10.call(this, json);
  }

  _createClass(Product, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);

      if (!typeIsArray(items)) {
        return null;
      }

      try {
        items = processQuantities(items);
      } catch (e) {
        return null;
      }

      if (items.length === 0) {
        return null;
      }

      if (hasOnlyQuantities(items)) {
        var values = getValuesFromQuantities(items);
        var product = values.reduce(function (x, y) {
          return x * y;
        }); // Units are not multiplied for the geometric product

        return new Quantity(product, items[0].unit);
      } else {
        return items.reduce(function (x, y) {
          return x * y;
        });
      }
    }
  }]);

  return Product;
}(AggregateExpression);

var GeometricMean = /*#__PURE__*/function (_AggregateExpression10) {
  _inherits(GeometricMean, _AggregateExpression10);

  var _super11 = _createSuper(GeometricMean);

  function GeometricMean(json) {
    _classCallCheck(this, GeometricMean);

    return _super11.call(this, json);
  }

  _createClass(GeometricMean, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);

      if (!typeIsArray(items)) {
        return null;
      }

      try {
        items = processQuantities(items);
      } catch (e) {
        return null;
      }

      if (items.length === 0) {
        return null;
      }

      if (hasOnlyQuantities(items)) {
        var values = getValuesFromQuantities(items);
        var product = values.reduce(function (x, y) {
          return x * y;
        });
        var geoMean = Math.pow(product, 1.0 / items.length);
        return new Quantity(geoMean, items[0].unit);
      } else {
        var _product = items.reduce(function (x, y) {
          return x * y;
        });

        return Math.pow(_product, 1.0 / items.length);
      }
    }
  }]);

  return GeometricMean;
}(AggregateExpression);

var PopulationStdDev = /*#__PURE__*/function (_StdDev) {
  _inherits(PopulationStdDev, _StdDev);

  var _super12 = _createSuper(PopulationStdDev);

  function PopulationStdDev(json) {
    var _this3;

    _classCallCheck(this, PopulationStdDev);

    _this3 = _super12.call(this, json);
    _this3.type = 'population_deviation';
    return _this3;
  }

  return PopulationStdDev;
}(StdDev);

var Variance = /*#__PURE__*/function (_StdDev2) {
  _inherits(Variance, _StdDev2);

  var _super13 = _createSuper(Variance);

  function Variance(json) {
    var _this4;

    _classCallCheck(this, Variance);

    _this4 = _super13.call(this, json);
    _this4.type = 'standard_variance';
    return _this4;
  }

  return Variance;
}(StdDev);

var PopulationVariance = /*#__PURE__*/function (_StdDev3) {
  _inherits(PopulationVariance, _StdDev3);

  var _super14 = _createSuper(PopulationVariance);

  function PopulationVariance(json) {
    var _this5;

    _classCallCheck(this, PopulationVariance);

    _this5 = _super14.call(this, json);
    _this5.type = 'population_variance';
    return _this5;
  }

  return PopulationVariance;
}(StdDev);

var AllTrue = /*#__PURE__*/function (_AggregateExpression11) {
  _inherits(AllTrue, _AggregateExpression11);

  var _super15 = _createSuper(AllTrue);

  function AllTrue(json) {
    _classCallCheck(this, AllTrue);

    return _super15.call(this, json);
  }

  _createClass(AllTrue, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);
      return allTrue(items);
    }
  }]);

  return AllTrue;
}(AggregateExpression);

var AnyTrue = /*#__PURE__*/function (_AggregateExpression12) {
  _inherits(AnyTrue, _AggregateExpression12);

  var _super16 = _createSuper(AnyTrue);

  function AnyTrue(json) {
    _classCallCheck(this, AnyTrue);

    return _super16.call(this, json);
  }

  _createClass(AnyTrue, [{
    key: "exec",
    value: function exec(ctx) {
      var items = this.source.execute(ctx);
      return anyTrue(items);
    }
  }]);

  return AnyTrue;
}(AggregateExpression);

function processQuantities(values) {
  var items = removeNulls(values);

  if (hasOnlyQuantities(items)) {
    return convertAllUnits(items);
  } else if (hasSomeQuantities(items)) {
    throw new Exception('Cannot perform aggregate operations on mixed values of Quantities and non Quantities');
  } else {
    return items;
  }
}

function getValuesFromQuantities(quantities) {
  return quantities.map(function (quantity) {
    return quantity.value;
  });
}

function hasOnlyQuantities(arr) {
  return arr.every(function (x) {
    return x.isQuantity;
  });
}

function hasSomeQuantities(arr) {
  return arr.some(function (x) {
    return x.isQuantity;
  });
}

function convertAllUnits(arr) {
  // convert all quantities in array to match the unit of the first item
  return arr.map(function (q) {
    return q.convertUnit(arr[0].unit);
  });
}

function medianOfNumbers(numbers) {
  var items = numerical_sort(numbers, 'asc');

  if (items.length % 2 === 1) {
    // Odd number of items
    return items[(items.length - 1) / 2];
  } else {
    // Even number of items
    return (items[items.length / 2 - 1] + items[items.length / 2]) / 2;
  }
}

module.exports = {
  Count: Count,
  Sum: Sum,
  Min: Min,
  Max: Max,
  Avg: Avg,
  Median: Median,
  Mode: Mode,
  StdDev: StdDev,
  Product: Product,
  GeometricMean: GeometricMean,
  PopulationStdDev: PopulationStdDev,
  Variance: Variance,
  PopulationVariance: PopulationVariance,
  AllTrue: AllTrue,
  AnyTrue: AnyTrue
};
},{"../datatypes/exception":8,"../datatypes/quantity":11,"../util/comparison":45,"../util/util":47,"./builder":16,"./expression":22}],15:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('./builder'),
    build = _require2.build;

var MathUtil = require('../util/math');

var _require3 = require('../datatypes/quantity'),
    Quantity = _require3.Quantity,
    doAddition = _require3.doAddition,
    doSubtraction = _require3.doSubtraction,
    doMultiplication = _require3.doMultiplication,
    doDivision = _require3.doDivision;

var Add = /*#__PURE__*/function (_Expression) {
  _inherits(Add, _Expression);

  var _super = _createSuper(Add);

  function Add(json) {
    _classCallCheck(this, Add);

    return _super.call(this, json);
  }

  _createClass(Add, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args == null || args.some(function (x) {
        return x == null;
      })) {
        return null;
      }

      var sum = args.reduce(function (x, y) {
        if (x.isQuantity || x.isDateTime || x.isDate || x.isTime) {
          return doAddition(x, y);
        } else {
          return x + y;
        }
      });

      if (MathUtil.overflowsOrUnderflows(sum)) {
        return null;
      }

      return sum;
    }
  }]);

  return Add;
}(Expression);

var Subtract = /*#__PURE__*/function (_Expression2) {
  _inherits(Subtract, _Expression2);

  var _super2 = _createSuper(Subtract);

  function Subtract(json) {
    _classCallCheck(this, Subtract);

    return _super2.call(this, json);
  }

  _createClass(Subtract, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args == null || args.some(function (x) {
        return x == null;
      })) {
        return null;
      }

      var difference = args.reduce(function (x, y) {
        if (x.isQuantity || x.isDateTime || x.isDate) {
          return doSubtraction(x, y);
        } else {
          return x - y;
        }
      });

      if (MathUtil.overflowsOrUnderflows(difference)) {
        return null;
      }

      return difference;
    }
  }]);

  return Subtract;
}(Expression);

var Multiply = /*#__PURE__*/function (_Expression3) {
  _inherits(Multiply, _Expression3);

  var _super3 = _createSuper(Multiply);

  function Multiply(json) {
    _classCallCheck(this, Multiply);

    return _super3.call(this, json);
  }

  _createClass(Multiply, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args == null || args.some(function (x) {
        return x == null;
      })) {
        null;
      }

      var product = args.reduce(function (x, y) {
        if (x.isQuantity || y.isQuantity) {
          return doMultiplication(x, y);
        } else {
          return x * y;
        }
      });

      if (MathUtil.overflowsOrUnderflows(product)) {
        return null;
      }

      return product;
    }
  }]);

  return Multiply;
}(Expression);

var Divide = /*#__PURE__*/function (_Expression4) {
  _inherits(Divide, _Expression4);

  var _super4 = _createSuper(Divide);

  function Divide(json) {
    _classCallCheck(this, Divide);

    return _super4.call(this, json);
  }

  _createClass(Divide, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args == null || args.some(function (x) {
        return x == null;
      })) {
        return null;
      }

      var quotient = args.reduce(function (x, y) {
        if (x.isQuantity) {
          return doDivision(x, y);
        } else {
          return x / y;
        }
      }); // Note, anything divided by 0 is Infinity in Javascript, which will be
      // considered as overflow by this check.

      if (MathUtil.overflowsOrUnderflows(quotient)) {
        return null;
      }

      return quotient;
    }
  }]);

  return Divide;
}(Expression);

var TruncatedDivide = /*#__PURE__*/function (_Expression5) {
  _inherits(TruncatedDivide, _Expression5);

  var _super5 = _createSuper(TruncatedDivide);

  function TruncatedDivide(json) {
    _classCallCheck(this, TruncatedDivide);

    return _super5.call(this, json);
  }

  _createClass(TruncatedDivide, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args == null || args.some(function (x) {
        return x == null;
      })) {
        return null;
      }

      var quotient = Math.floor(args.reduce(function (x, y) {
        return x / y;
      }));

      if (MathUtil.overflowsOrUnderflows(quotient)) {
        return null;
      }

      return quotient;
    }
  }]);

  return TruncatedDivide;
}(Expression);

var Modulo = /*#__PURE__*/function (_Expression6) {
  _inherits(Modulo, _Expression6);

  var _super6 = _createSuper(Modulo);

  function Modulo(json) {
    _classCallCheck(this, Modulo);

    return _super6.call(this, json);
  }

  _createClass(Modulo, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args == null || args.some(function (x) {
        return x == null;
      })) {
        return null;
      }

      return args.reduce(function (x, y) {
        return x % y;
      });
    }
  }]);

  return Modulo;
}(Expression);

var Ceiling = /*#__PURE__*/function (_Expression7) {
  _inherits(Ceiling, _Expression7);

  var _super7 = _createSuper(Ceiling);

  function Ceiling(json) {
    _classCallCheck(this, Ceiling);

    return _super7.call(this, json);
  }

  _createClass(Ceiling, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        return null;
      }

      return Math.ceil(arg);
    }
  }]);

  return Ceiling;
}(Expression);

var Floor = /*#__PURE__*/function (_Expression8) {
  _inherits(Floor, _Expression8);

  var _super8 = _createSuper(Floor);

  function Floor(json) {
    _classCallCheck(this, Floor);

    return _super8.call(this, json);
  }

  _createClass(Floor, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        return null;
      }

      return Math.floor(arg);
    }
  }]);

  return Floor;
}(Expression);

var Truncate = /*#__PURE__*/function (_Floor) {
  _inherits(Truncate, _Floor);

  var _super9 = _createSuper(Truncate);

  function Truncate() {
    _classCallCheck(this, Truncate);

    return _super9.apply(this, arguments);
  }

  return Truncate;
}(Floor);

var Abs = /*#__PURE__*/function (_Expression9) {
  _inherits(Abs, _Expression9);

  var _super10 = _createSuper(Abs);

  function Abs(json) {
    _classCallCheck(this, Abs);

    return _super10.call(this, json);
  }

  _createClass(Abs, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        return null;
      } else if (arg.isQuantity) {
        return new Quantity(Math.abs(arg.value), arg.unit);
      } else {
        return Math.abs(arg);
      }
    }
  }]);

  return Abs;
}(Expression);

var Negate = /*#__PURE__*/function (_Expression10) {
  _inherits(Negate, _Expression10);

  var _super11 = _createSuper(Negate);

  function Negate(json) {
    _classCallCheck(this, Negate);

    return _super11.call(this, json);
  }

  _createClass(Negate, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        return null;
      } else if (arg.isQuantity) {
        return new Quantity(arg.value * -1, arg.unit);
      } else {
        return arg * -1;
      }
    }
  }]);

  return Negate;
}(Expression);

var Round = /*#__PURE__*/function (_Expression11) {
  _inherits(Round, _Expression11);

  var _super12 = _createSuper(Round);

  function Round(json) {
    var _this;

    _classCallCheck(this, Round);

    _this = _super12.call(this, json);
    _this.precision = build(json.precision);
    return _this;
  }

  _createClass(Round, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        return null;
      }

      var dec = this.precision != null ? this.precision.execute(ctx) : 0;
      return Math.round(arg * Math.pow(10, dec)) / Math.pow(10, dec);
    }
  }]);

  return Round;
}(Expression);

var Ln = /*#__PURE__*/function (_Expression12) {
  _inherits(Ln, _Expression12);

  var _super13 = _createSuper(Ln);

  function Ln(json) {
    _classCallCheck(this, Ln);

    return _super13.call(this, json);
  }

  _createClass(Ln, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        return null;
      }

      return Math.log(arg);
    }
  }]);

  return Ln;
}(Expression);

var Exp = /*#__PURE__*/function (_Expression13) {
  _inherits(Exp, _Expression13);

  var _super14 = _createSuper(Exp);

  function Exp(json) {
    _classCallCheck(this, Exp);

    return _super14.call(this, json);
  }

  _createClass(Exp, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        return null;
      }

      var power = Math.exp(arg);

      if (MathUtil.overflowsOrUnderflows(power)) {
        return null;
      }

      return power;
    }
  }]);

  return Exp;
}(Expression);

var Log = /*#__PURE__*/function (_Expression14) {
  _inherits(Log, _Expression14);

  var _super15 = _createSuper(Log);

  function Log(json) {
    _classCallCheck(this, Log);

    return _super15.call(this, json);
  }

  _createClass(Log, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args == null || args.some(function (x) {
        return x == null;
      })) {
        return null;
      }

      return args.reduce(function (x, y) {
        return Math.log(x) / Math.log(y);
      });
    }
  }]);

  return Log;
}(Expression);

var Power = /*#__PURE__*/function (_Expression15) {
  _inherits(Power, _Expression15);

  var _super16 = _createSuper(Power);

  function Power(json) {
    _classCallCheck(this, Power);

    return _super16.call(this, json);
  }

  _createClass(Power, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args == null || args.some(function (x) {
        return x == null;
      })) {
        null;
      }

      var power = args.reduce(function (x, y) {
        return Math.pow(x, y);
      });

      if (MathUtil.overflowsOrUnderflows(power)) {
        return null;
      }

      return power;
    }
  }]);

  return Power;
}(Expression);

var MinValue = /*#__PURE__*/function (_Expression16) {
  _inherits(MinValue, _Expression16);

  var _super17 = _createSuper(MinValue);

  function MinValue(json) {
    var _this2;

    _classCallCheck(this, MinValue);

    _this2 = _super17.call(this, json);
    _this2.valueType = json.valueType;
    return _this2;
  }

  _createClass(MinValue, [{
    key: "exec",
    value: function exec(ctx) {
      if (MinValue.MIN_VALUES[this.valueType]) {
        if (this.valueType === '{urn:hl7-org:elm-types:r1}DateTime') {
          var minDateTime = MinValue.MIN_VALUES[this.valueType].copy();
          minDateTime.timezoneOffset = ctx.getTimezoneOffset();
          return minDateTime;
        } else {
          return MinValue.MIN_VALUES[this.valueType];
        }
      } else {
        throw new Error("Minimum not supported for ".concat(this.valueType));
      }
    }
  }]);

  return MinValue;
}(Expression);

MinValue.MIN_VALUES = {};
MinValue.MIN_VALUES['{urn:hl7-org:elm-types:r1}Integer'] = MathUtil.MIN_INT_VALUE;
MinValue.MIN_VALUES['{urn:hl7-org:elm-types:r1}Decimal'] = MathUtil.MIN_FLOAT_VALUE;
MinValue.MIN_VALUES['{urn:hl7-org:elm-types:r1}DateTime'] = MathUtil.MIN_DATETIME_VALUE;
MinValue.MIN_VALUES['{urn:hl7-org:elm-types:r1}Date'] = MathUtil.MIN_DATE_VALUE;
MinValue.MIN_VALUES['{urn:hl7-org:elm-types:r1}Time'] = MathUtil.MIN_TIME_VALUE;

var MaxValue = /*#__PURE__*/function (_Expression17) {
  _inherits(MaxValue, _Expression17);

  var _super18 = _createSuper(MaxValue);

  function MaxValue(json) {
    var _this3;

    _classCallCheck(this, MaxValue);

    _this3 = _super18.call(this, json);
    _this3.valueType = json.valueType;
    return _this3;
  }

  _createClass(MaxValue, [{
    key: "exec",
    value: function exec(ctx) {
      if (MaxValue.MAX_VALUES[this.valueType] != null) {
        if (this.valueType === '{urn:hl7-org:elm-types:r1}DateTime') {
          var maxDateTime = MaxValue.MAX_VALUES[this.valueType].copy();
          maxDateTime.timezoneOffset = ctx.getTimezoneOffset();
          return maxDateTime;
        } else {
          return MaxValue.MAX_VALUES[this.valueType];
        }
      } else {
        throw new Error("Maximum not supported for ".concat(this.valueType));
      }
    }
  }]);

  return MaxValue;
}(Expression);

MaxValue.MAX_VALUES = {};
MaxValue.MAX_VALUES['{urn:hl7-org:elm-types:r1}Integer'] = MathUtil.MAX_INT_VALUE;
MaxValue.MAX_VALUES['{urn:hl7-org:elm-types:r1}Decimal'] = MathUtil.MAX_FLOAT_VALUE;
MaxValue.MAX_VALUES['{urn:hl7-org:elm-types:r1}DateTime'] = MathUtil.MAX_DATETIME_VALUE;
MaxValue.MAX_VALUES['{urn:hl7-org:elm-types:r1}Date'] = MathUtil.MAX_DATE_VALUE;
MaxValue.MAX_VALUES['{urn:hl7-org:elm-types:r1}Time'] = MathUtil.MAX_TIME_VALUE;

var Successor = /*#__PURE__*/function (_Expression18) {
  _inherits(Successor, _Expression18);

  var _super19 = _createSuper(Successor);

  function Successor(json) {
    _classCallCheck(this, Successor);

    return _super19.call(this, json);
  }

  _createClass(Successor, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        null;
      }

      var successor = null;

      try {
        // MathUtil.successor throws on overflow, and the exception is used in
        // the logic for evaluating `meets`, so it can't be changed to just return null
        successor = MathUtil.successor(arg);
      } catch (e) {
        if (e instanceof MathUtil.OverFlowException) {
          return null;
        }
      }

      if (MathUtil.overflowsOrUnderflows(successor)) {
        return null;
      }

      return successor;
    }
  }]);

  return Successor;
}(Expression);

var Predecessor = /*#__PURE__*/function (_Expression19) {
  _inherits(Predecessor, _Expression19);

  var _super20 = _createSuper(Predecessor);

  function Predecessor(json) {
    _classCallCheck(this, Predecessor);

    return _super20.call(this, json);
  }

  _createClass(Predecessor, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        null;
      }

      var predecessor = null;

      try {
        // MathUtil.predecessor throws on underflow, and the exception is used in
        // the logic for evaluating `meets`, so it can't be changed to just return null
        predecessor = MathUtil.predecessor(arg);
      } catch (e) {
        if (e instanceof MathUtil.OverFlowException) {
          return null;
        }
      }

      if (MathUtil.overflowsOrUnderflows(predecessor)) {
        return null;
      }

      return predecessor;
    }
  }]);

  return Predecessor;
}(Expression);

module.exports = {
  Abs: Abs,
  Add: Add,
  Ceiling: Ceiling,
  Divide: Divide,
  Exp: Exp,
  Floor: Floor,
  Ln: Ln,
  Log: Log,
  MaxValue: MaxValue,
  MinValue: MinValue,
  Modulo: Modulo,
  Multiply: Multiply,
  Negate: Negate,
  Power: Power,
  Predecessor: Predecessor,
  Round: Round,
  Subtract: Subtract,
  Successor: Successor,
  Truncate: Truncate,
  TruncatedDivide: TruncatedDivide
};
},{"../datatypes/quantity":11,"../util/math":46,"./builder":16,"./expression":22}],16:[function(require,module,exports){
"use strict";

var E = require('./expressions');

var _require = require('../util/util'),
    typeIsArray = _require.typeIsArray;

function build(json) {
  if (json == null) {
    return json;
  }

  if (typeIsArray(json)) {
    return json.map(function (child) {
      return build(child);
    });
  }

  if (json.type === 'FunctionRef') {
    return new E.FunctionRef(json);
  } else if (json.type === 'Literal') {
    return E.Literal.from(json);
  } else if (functionExists(json.type)) {
    return constructByName(json.type, json);
  } else {
    return null;
  }
}

function functionExists(name) {
  return typeof E[name] === 'function';
}

function constructByName(name, json) {
  return new E[name](json);
}

module.exports = {
  build: build
};
},{"../util/util":47,"./expressions":23}],17:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var dt = require('../datatypes/datatypes');

var _require2 = require('./builder'),
    build = _require2.build;

var ValueSetDef = /*#__PURE__*/function (_Expression) {
  _inherits(ValueSetDef, _Expression);

  var _super = _createSuper(ValueSetDef);

  function ValueSetDef(json) {
    var _this;

    _classCallCheck(this, ValueSetDef);

    _this = _super.call(this, json);
    _this.name = json.name;
    _this.id = json.id;
    _this.version = json.version;
    return _this;
  } //todo: code systems and versions


  _createClass(ValueSetDef, [{
    key: "exec",
    value: function exec(ctx) {
      var valueset = ctx.codeService.findValueSet(this.id, this.version) || new dt.ValueSet(this.id, this.version);
      ctx.rootContext().set(this.name, valueset);
      return valueset;
    }
  }]);

  return ValueSetDef;
}(Expression);

var ValueSetRef = /*#__PURE__*/function (_Expression2) {
  _inherits(ValueSetRef, _Expression2);

  var _super2 = _createSuper(ValueSetRef);

  function ValueSetRef(json) {
    var _this2;

    _classCallCheck(this, ValueSetRef);

    _this2 = _super2.call(this, json);
    _this2.name = json.name;
    _this2.libraryName = json.libraryName;
    return _this2;
  }

  _createClass(ValueSetRef, [{
    key: "exec",
    value: function exec(ctx) {
      // TODO: This calls the code service every time-- should be optimized
      var valueset = ctx.getValueSet(this.name, this.libraryName);

      if (valueset instanceof Expression) {
        valueset = valueset.execute(ctx);
      }

      return valueset;
    }
  }]);

  return ValueSetRef;
}(Expression);

var AnyInValueSet = /*#__PURE__*/function (_Expression3) {
  _inherits(AnyInValueSet, _Expression3);

  var _super3 = _createSuper(AnyInValueSet);

  function AnyInValueSet(json) {
    var _this3;

    _classCallCheck(this, AnyInValueSet);

    _this3 = _super3.call(this, json);
    _this3.codes = build(json.codes);
    _this3.valueset = new ValueSetRef(json.valueset);
    return _this3;
  }

  _createClass(AnyInValueSet, [{
    key: "exec",
    value: function exec(ctx) {
      var valueset = this.valueset.execute(ctx); // If the value set reference cannot be resolved, a run-time error is thrown.

      if (valueset == null || !valueset.isValueSet) {
        throw new Error('ValueSet must be provided to InValueSet function');
      }

      var codes = this.codes.exec(ctx);
      return codes != null && codes.some(function (code) {
        return valueset.hasMatch(code);
      });
    }
  }]);

  return AnyInValueSet;
}(Expression);

var InValueSet = /*#__PURE__*/function (_Expression4) {
  _inherits(InValueSet, _Expression4);

  var _super4 = _createSuper(InValueSet);

  function InValueSet(json) {
    var _this4;

    _classCallCheck(this, InValueSet);

    _this4 = _super4.call(this, json);
    _this4.code = build(json.code);
    _this4.valueset = new ValueSetRef(json.valueset);
    return _this4;
  }

  _createClass(InValueSet, [{
    key: "exec",
    value: function exec(ctx) {
      // If the code argument is null, the result is false
      if (this.code == null) {
        return false;
      }

      if (this.valueset == null) {
        throw new Error('ValueSet must be provided to InValueSet function');
      }

      var code = this.code.execute(ctx); // spec indicates to return false if code is null, throw error if value set cannot be resolved

      if (code == null) {
        return false;
      }

      var valueset = this.valueset.execute(ctx);

      if (valueset == null || !valueset.isValueSet) {
        throw new Error('ValueSet must be provided to InValueSet function');
      } // If there is a code and valueset return whether or not the valueset has the code


      return valueset.hasMatch(code);
    }
  }]);

  return InValueSet;
}(Expression);

var CodeSystemDef = /*#__PURE__*/function (_Expression5) {
  _inherits(CodeSystemDef, _Expression5);

  var _super5 = _createSuper(CodeSystemDef);

  function CodeSystemDef(json) {
    var _this5;

    _classCallCheck(this, CodeSystemDef);

    _this5 = _super5.call(this, json);
    _this5.name = json.name;
    _this5.id = json.id;
    _this5.version = json.version;
    return _this5;
  }

  _createClass(CodeSystemDef, [{
    key: "exec",
    value: function exec(ctx) {
      return new dt.CodeSystem(this.id, this.version);
    }
  }]);

  return CodeSystemDef;
}(Expression);

var CodeDef = /*#__PURE__*/function (_Expression6) {
  _inherits(CodeDef, _Expression6);

  var _super6 = _createSuper(CodeDef);

  function CodeDef(json) {
    var _this6;

    _classCallCheck(this, CodeDef);

    _this6 = _super6.call(this, json);
    _this6.name = json.name;
    _this6.id = json.id;
    _this6.systemName = json.codeSystem.name;
    _this6.display = json.display;
    return _this6;
  }

  _createClass(CodeDef, [{
    key: "exec",
    value: function exec(ctx) {
      var system = ctx.getCodeSystem(this.systemName).execute(ctx);
      return new dt.Code(this.id, system.id, system.version, this.display);
    }
  }]);

  return CodeDef;
}(Expression);

var CodeRef = /*#__PURE__*/function (_Expression7) {
  _inherits(CodeRef, _Expression7);

  var _super7 = _createSuper(CodeRef);

  function CodeRef(json) {
    var _this7;

    _classCallCheck(this, CodeRef);

    _this7 = _super7.call(this, json);
    _this7.name = json.name;
    _this7.library = json.libraryName;
    return _this7;
  }

  _createClass(CodeRef, [{
    key: "exec",
    value: function exec(ctx) {
      ctx = this.library ? ctx.getLibraryContext(this.library) : ctx;
      var codeDef = ctx.getCode(this.name);
      return codeDef ? codeDef.execute(ctx) : undefined;
    }
  }]);

  return CodeRef;
}(Expression);

var Code = /*#__PURE__*/function (_Expression8) {
  _inherits(Code, _Expression8);

  var _super8 = _createSuper(Code);

  function Code(json) {
    var _this8;

    _classCallCheck(this, Code);

    _this8 = _super8.call(this, json);
    _this8.code = json.code;
    _this8.systemName = json.system.name;
    _this8.version = json.version;
    _this8.display = json.display;
    return _this8;
  } // Define a simple getter to allow type-checking of this class without instanceof
  // and in a way that survives minification (as opposed to checking constructor.name)


  _createClass(Code, [{
    key: "exec",
    value: function exec(ctx) {
      var system = ctx.getCodeSystem(this.systemName) || {};
      return new dt.Code(this.code, system.id, this.version, this.display);
    }
  }, {
    key: "isCode",
    get: function get() {
      return true;
    }
  }]);

  return Code;
}(Expression);

var ConceptDef = /*#__PURE__*/function (_Expression9) {
  _inherits(ConceptDef, _Expression9);

  var _super9 = _createSuper(ConceptDef);

  function ConceptDef(json) {
    var _this9;

    _classCallCheck(this, ConceptDef);

    _this9 = _super9.call(this, json);
    _this9.name = json.name;
    _this9.display = json.display;
    _this9.codes = json.code;
    return _this9;
  }

  _createClass(ConceptDef, [{
    key: "exec",
    value: function exec(ctx) {
      var codes = this.codes.map(function (code) {
        var codeDef = ctx.getCode(code.name);
        return codeDef ? codeDef.execute(ctx) : undefined;
      });
      return new dt.Concept(codes, this.display);
    }
  }]);

  return ConceptDef;
}(Expression);

var ConceptRef = /*#__PURE__*/function (_Expression10) {
  _inherits(ConceptRef, _Expression10);

  var _super10 = _createSuper(ConceptRef);

  function ConceptRef(json) {
    var _this10;

    _classCallCheck(this, ConceptRef);

    _this10 = _super10.call(this, json);
    _this10.name = json.name;
    return _this10;
  }

  _createClass(ConceptRef, [{
    key: "exec",
    value: function exec(ctx) {
      var conceptDef = ctx.getConcept(this.name);
      return conceptDef ? conceptDef.execute(ctx) : undefined;
    }
  }]);

  return ConceptRef;
}(Expression);

var Concept = /*#__PURE__*/function (_Expression11) {
  _inherits(Concept, _Expression11);

  var _super11 = _createSuper(Concept);

  function Concept(json) {
    var _this11;

    _classCallCheck(this, Concept);

    _this11 = _super11.call(this, json);
    _this11.codes = json.code;
    _this11.display = json.display;
    return _this11;
  } // Define a simple getter to allow type-checking of this class without instanceof
  // and in a way that survives minification (as opposed to checking constructor.name)


  _createClass(Concept, [{
    key: "toCode",
    value: function toCode(ctx, code) {
      var system = ctx.getCodeSystem(code.system.name) || {};
      return new dt.Code(code.code, system.id, code.version, code.display);
    }
  }, {
    key: "exec",
    value: function exec(ctx) {
      var _this12 = this;

      var codes = this.codes.map(function (code) {
        return _this12.toCode(ctx, code);
      });
      return new dt.Concept(codes, this.display);
    }
  }, {
    key: "isConcept",
    get: function get() {
      return true;
    }
  }]);

  return Concept;
}(Expression);

var CalculateAge = /*#__PURE__*/function (_Expression12) {
  _inherits(CalculateAge, _Expression12);

  var _super12 = _createSuper(CalculateAge);

  function CalculateAge(json) {
    var _this13;

    _classCallCheck(this, CalculateAge);

    _this13 = _super12.call(this, json);
    _this13.precision = json.precision;
    return _this13;
  }

  _createClass(CalculateAge, [{
    key: "exec",
    value: function exec(ctx) {
      var date1 = this.execArgs(ctx);
      var date2 = dt.DateTime.fromJSDate(ctx.getExecutionDateTime());
      var result = date1 != null ? date1.durationBetween(date2, this.precision.toLowerCase()) : undefined;

      if (result != null && result.isPoint()) {
        return result.low;
      } else {
        return result;
      }
    }
  }]);

  return CalculateAge;
}(Expression);

var CalculateAgeAt = /*#__PURE__*/function (_Expression13) {
  _inherits(CalculateAgeAt, _Expression13);

  var _super13 = _createSuper(CalculateAgeAt);

  function CalculateAgeAt(json) {
    var _this14;

    _classCallCheck(this, CalculateAgeAt);

    _this14 = _super13.call(this, json);
    _this14.precision = json.precision;
    return _this14;
  }

  _createClass(CalculateAgeAt, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs = this.execArgs(ctx),
          _this$execArgs2 = _slicedToArray(_this$execArgs, 2),
          date1 = _this$execArgs2[0],
          date2 = _this$execArgs2[1];

      if (date1 != null && date2 != null) {
        // date1 is the birthdate, convert it to date if date2 is a date (to support ignoring time)
        if (date2.isDate && date1.isDateTime) {
          date1 = date1.getDate();
        }

        var result = date1.durationBetween(date2, this.precision.toLowerCase());

        if (result != null && result.isPoint()) {
          return result.low;
        } else {
          return result;
        }
      }

      return null;
    }
  }]);

  return CalculateAgeAt;
}(Expression);

module.exports = {
  AnyInValueSet: AnyInValueSet,
  CalculateAge: CalculateAge,
  CalculateAgeAt: CalculateAgeAt,
  Code: Code,
  CodeDef: CodeDef,
  CodeRef: CodeRef,
  CodeSystemDef: CodeSystemDef,
  Concept: Concept,
  ConceptDef: ConceptDef,
  ConceptRef: ConceptRef,
  InValueSet: InValueSet,
  ValueSetDef: ValueSetDef,
  ValueSetRef: ValueSetRef
};
},{"../datatypes/datatypes":6,"./builder":16,"./expression":22}],18:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('../datatypes/datatypes'),
    Uncertainty = _require2.Uncertainty; // Equal is completely handled by overloaded#Equal
// NotEqual is completely handled by overloaded#Equal


var Less = /*#__PURE__*/function (_Expression) {
  _inherits(Less, _Expression);

  var _super = _createSuper(Less);

  function Less(json) {
    _classCallCheck(this, Less);

    return _super.call(this, json);
  }

  _createClass(Less, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx).map(function (x) {
        return Uncertainty.from(x);
      });

      if (args[0] == null || args[1] == null) {
        return null;
      }

      return args[0].lessThan(args[1]);
    }
  }]);

  return Less;
}(Expression);

var LessOrEqual = /*#__PURE__*/function (_Expression2) {
  _inherits(LessOrEqual, _Expression2);

  var _super2 = _createSuper(LessOrEqual);

  function LessOrEqual(json) {
    _classCallCheck(this, LessOrEqual);

    return _super2.call(this, json);
  }

  _createClass(LessOrEqual, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx).map(function (x) {
        return Uncertainty.from(x);
      });

      if (args[0] == null || args[1] == null) {
        return null;
      }

      return args[0].lessThanOrEquals(args[1]);
    }
  }]);

  return LessOrEqual;
}(Expression);

var Greater = /*#__PURE__*/function (_Expression3) {
  _inherits(Greater, _Expression3);

  var _super3 = _createSuper(Greater);

  function Greater(json) {
    _classCallCheck(this, Greater);

    return _super3.call(this, json);
  }

  _createClass(Greater, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx).map(function (x) {
        return Uncertainty.from(x);
      });

      if (args[0] == null || args[1] == null) {
        return null;
      }

      return args[0].greaterThan(args[1]);
    }
  }]);

  return Greater;
}(Expression);

var GreaterOrEqual = /*#__PURE__*/function (_Expression4) {
  _inherits(GreaterOrEqual, _Expression4);

  var _super4 = _createSuper(GreaterOrEqual);

  function GreaterOrEqual(json) {
    _classCallCheck(this, GreaterOrEqual);

    return _super4.call(this, json);
  }

  _createClass(GreaterOrEqual, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx).map(function (x) {
        return Uncertainty.from(x);
      });

      if (args[0] == null || args[1] == null) {
        return null;
      }

      return args[0].greaterThanOrEquals(args[1]);
    }
  }]);

  return GreaterOrEqual;
}(Expression);

module.exports = {
  Greater: Greater,
  GreaterOrEqual: GreaterOrEqual,
  Less: Less,
  LessOrEqual: LessOrEqual
};
},{"../datatypes/datatypes":6,"./expression":22}],19:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('./builder'),
    build = _require2.build;

var _require3 = require('../util/comparison'),
    equals = _require3.equals; // TODO: Spec lists "Conditional", but it's "If" in the XSD


var If = /*#__PURE__*/function (_Expression) {
  _inherits(If, _Expression);

  var _super = _createSuper(If);

  function If(json) {
    var _this;

    _classCallCheck(this, If);

    _this = _super.call(this, json);
    _this.condition = build(json.condition);
    _this.th = build(json.then);
    _this.els = build(json.else);
    return _this;
  }

  _createClass(If, [{
    key: "exec",
    value: function exec(ctx) {
      if (this.condition.execute(ctx)) {
        return this.th.execute(ctx);
      } else {
        return this.els.execute(ctx);
      }
    }
  }]);

  return If;
}(Expression);

var CaseItem = function CaseItem(json) {
  _classCallCheck(this, CaseItem);

  this.when = build(json.when);
  this.then = build(json.then);
};

var Case = /*#__PURE__*/function (_Expression2) {
  _inherits(Case, _Expression2);

  var _super2 = _createSuper(Case);

  function Case(json) {
    var _this2;

    _classCallCheck(this, Case);

    _this2 = _super2.call(this, json);
    _this2.comparand = build(json.comparand);
    _this2.caseItems = json.caseItem.map(function (ci) {
      return new CaseItem(ci);
    });
    _this2.els = build(json.else);
    return _this2;
  }

  _createClass(Case, [{
    key: "exec",
    value: function exec(ctx) {
      if (this.comparand) {
        return this.exec_selected(ctx);
      } else {
        return this.exec_standard(ctx);
      }
    }
  }, {
    key: "exec_selected",
    value: function exec_selected(ctx) {
      var val = this.comparand.execute(ctx);

      var _iterator = _createForOfIteratorHelper(this.caseItems),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var ci = _step.value;

          if (equals(ci.when.execute(ctx), val)) {
            return ci.then.execute(ctx);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return this.els.execute(ctx);
    }
  }, {
    key: "exec_standard",
    value: function exec_standard(ctx) {
      var _iterator2 = _createForOfIteratorHelper(this.caseItems),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var ci = _step2.value;

          if (ci.when.execute(ctx)) {
            return ci.then.execute(ctx);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return this.els.execute(ctx);
    }
  }]);

  return Case;
}(Expression);

module.exports = {
  Case: Case,
  CaseItem: CaseItem,
  If: If
};
},{"../util/comparison":45,"./builder":16,"./expression":22}],20:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('./builder'),
    build = _require2.build;

var _require3 = require('./literal'),
    Literal = _require3.Literal;

var DT = require('../datatypes/datatypes');

var DateTime = /*#__PURE__*/function (_Expression) {
  _inherits(DateTime, _Expression);

  var _super = _createSuper(DateTime);

  function DateTime(json) {
    var _this;

    _classCallCheck(this, DateTime);

    _this = _super.call(this, json);
    _this.json = json;
    return _this;
  }

  _createClass(DateTime, [{
    key: "exec",
    value: function exec(ctx) {
      var _this2 = this;

      var _iterator = _createForOfIteratorHelper(DateTime.PROPERTIES),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var property = _step.value;

          // if json does not contain 'timezoneOffset' set it to the executionDateTime from the context
          if (this.json[property] != null) {
            this[property] = build(this.json[property]);
          } else if (property === 'timezoneOffset' && ctx.getTimezoneOffset() != null) {
            this[property] = Literal.from({
              type: 'Literal',
              value: ctx.getTimezoneOffset(),
              valueType: '{urn:hl7-org:elm-types:r1}Integer'
            });
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var args = DateTime.PROPERTIES.map(function (p) {
        return _this2[p] != null ? _this2[p].execute(ctx) : undefined;
      });
      return _construct(DT.DateTime, _toConsumableArray(args));
    }
  }]);

  return DateTime;
}(Expression);

DateTime.PROPERTIES = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond', 'timezoneOffset'];

var _Date = /*#__PURE__*/function (_Expression2) {
  _inherits(_Date, _Expression2);

  var _super2 = _createSuper(_Date);

  function _Date(json) {
    var _this3;

    _classCallCheck(this, _Date);

    _this3 = _super2.call(this, json);
    _this3.json = json;
    return _this3;
  }

  _createClass(_Date, [{
    key: "exec",
    value: function exec(ctx) {
      var _this4 = this;

      var _iterator2 = _createForOfIteratorHelper(_Date.PROPERTIES),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var property = _step2.value;

          if (this.json[property] != null) {
            this[property] = build(this.json[property]);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var args = _Date.PROPERTIES.map(function (p) {
        return _this4[p] != null ? _this4[p].execute(ctx) : undefined;
      });

      return _construct(DT.Date, _toConsumableArray(args));
    }
  }]);

  return _Date;
}(Expression);

_Date.PROPERTIES = ['year', 'month', 'day'];

var Time = /*#__PURE__*/function (_Expression3) {
  _inherits(Time, _Expression3);

  var _super3 = _createSuper(Time);

  function Time(json) {
    var _this5;

    _classCallCheck(this, Time);

    _this5 = _super3.call(this, json);

    var _iterator3 = _createForOfIteratorHelper(Time.PROPERTIES),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var property = _step3.value;

        if (json[property] != null) {
          _this5[property] = build(json[property]);
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return _this5;
  }

  _createClass(Time, [{
    key: "exec",
    value: function exec(ctx) {
      var _this6 = this;

      var args = Time.PROPERTIES.map(function (p) {
        return _this6[p] != null ? _this6[p].execute(ctx) : undefined;
      });
      return _construct(DT.DateTime, [0, 1, 1].concat(_toConsumableArray(args))).getTime();
    }
  }]);

  return Time;
}(Expression);

Time.PROPERTIES = ['hour', 'minute', 'second', 'millisecond'];

var Today = /*#__PURE__*/function (_Expression4) {
  _inherits(Today, _Expression4);

  var _super4 = _createSuper(Today);

  function Today(json) {
    _classCallCheck(this, Today);

    return _super4.call(this, json);
  }

  _createClass(Today, [{
    key: "exec",
    value: function exec(ctx) {
      return ctx.getExecutionDateTime().getDate();
    }
  }]);

  return Today;
}(Expression);

var Now = /*#__PURE__*/function (_Expression5) {
  _inherits(Now, _Expression5);

  var _super5 = _createSuper(Now);

  function Now(json) {
    _classCallCheck(this, Now);

    return _super5.call(this, json);
  }

  _createClass(Now, [{
    key: "exec",
    value: function exec(ctx) {
      return ctx.getExecutionDateTime();
    }
  }]);

  return Now;
}(Expression);

var TimeOfDay = /*#__PURE__*/function (_Expression6) {
  _inherits(TimeOfDay, _Expression6);

  var _super6 = _createSuper(TimeOfDay);

  function TimeOfDay(json) {
    _classCallCheck(this, TimeOfDay);

    return _super6.call(this, json);
  }

  _createClass(TimeOfDay, [{
    key: "exec",
    value: function exec(ctx) {
      return ctx.getExecutionDateTime().getTime();
    }
  }]);

  return TimeOfDay;
}(Expression);

var DateTimeComponentFrom = /*#__PURE__*/function (_Expression7) {
  _inherits(DateTimeComponentFrom, _Expression7);

  var _super7 = _createSuper(DateTimeComponentFrom);

  function DateTimeComponentFrom(json) {
    var _this7;

    _classCallCheck(this, DateTimeComponentFrom);

    _this7 = _super7.call(this, json);
    _this7.precision = json.precision;
    return _this7;
  }

  _createClass(DateTimeComponentFrom, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        return arg[this.precision.toLowerCase()];
      } else {
        return null;
      }
    }
  }]);

  return DateTimeComponentFrom;
}(Expression);

var DateFrom = /*#__PURE__*/function (_Expression8) {
  _inherits(DateFrom, _Expression8);

  var _super8 = _createSuper(DateFrom);

  function DateFrom(json) {
    _classCallCheck(this, DateFrom);

    return _super8.call(this, json);
  }

  _createClass(DateFrom, [{
    key: "exec",
    value: function exec(ctx) {
      var date = this.execArgs(ctx);

      if (date != null) {
        return date.getDate();
      } else {
        return null;
      }
    }
  }]);

  return DateFrom;
}(Expression);

var TimeFrom = /*#__PURE__*/function (_Expression9) {
  _inherits(TimeFrom, _Expression9);

  var _super9 = _createSuper(TimeFrom);

  function TimeFrom(json) {
    _classCallCheck(this, TimeFrom);

    return _super9.call(this, json);
  }

  _createClass(TimeFrom, [{
    key: "exec",
    value: function exec(ctx) {
      var date = this.execArgs(ctx);

      if (date != null) {
        return date.getTime();
      } else {
        return null;
      }
    }
  }]);

  return TimeFrom;
}(Expression);

var TimezoneOffsetFrom = /*#__PURE__*/function (_Expression10) {
  _inherits(TimezoneOffsetFrom, _Expression10);

  var _super10 = _createSuper(TimezoneOffsetFrom);

  function TimezoneOffsetFrom(json) {
    _classCallCheck(this, TimezoneOffsetFrom);

    return _super10.call(this, json);
  }

  _createClass(TimezoneOffsetFrom, [{
    key: "exec",
    value: function exec(ctx) {
      var date = this.execArgs(ctx);

      if (date != null) {
        return date.timezoneOffset;
      } else {
        return null;
      }
    }
  }]);

  return TimezoneOffsetFrom;
}(Expression); // Delegated to by overloaded#After


function doAfter(a, b, precision) {
  return a.after(b, precision);
} // Delegated to by overloaded#Before


function doBefore(a, b, precision) {
  return a.before(b, precision);
}

var DifferenceBetween = /*#__PURE__*/function (_Expression11) {
  _inherits(DifferenceBetween, _Expression11);

  var _super11 = _createSuper(DifferenceBetween);

  function DifferenceBetween(json) {
    var _this8;

    _classCallCheck(this, DifferenceBetween);

    _this8 = _super11.call(this, json);
    _this8.precision = json.precision;
    return _this8;
  }

  _createClass(DifferenceBetween, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx); // Check to make sure args exist and that they have differenceBetween functions so that they can be compared to one another

      if (args[0] == null || args[1] == null || typeof args[0].differenceBetween !== 'function' || typeof args[1].differenceBetween !== 'function') {
        return null;
      }

      var result = args[0].differenceBetween(args[1], this.precision != null ? this.precision.toLowerCase() : undefined);

      if (result != null && result.isPoint()) {
        return result.low;
      } else {
        return result;
      }
    }
  }]);

  return DifferenceBetween;
}(Expression);

var DurationBetween = /*#__PURE__*/function (_Expression12) {
  _inherits(DurationBetween, _Expression12);

  var _super12 = _createSuper(DurationBetween);

  function DurationBetween(json) {
    var _this9;

    _classCallCheck(this, DurationBetween);

    _this9 = _super12.call(this, json);
    _this9.precision = json.precision;
    return _this9;
  }

  _createClass(DurationBetween, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx); // Check to make sure args exist and that they have durationBetween functions so that they can be compared to one another

      if (args[0] == null || args[1] == null || typeof args[0].durationBetween !== 'function' || typeof args[1].durationBetween !== 'function') {
        return null;
      }

      var result = args[0].durationBetween(args[1], this.precision != null ? this.precision.toLowerCase() : undefined);

      if (result != null && result.isPoint()) {
        return result.low;
      } else {
        return result;
      }
    }
  }]);

  return DurationBetween;
}(Expression);

module.exports = {
  Date: _Date,
  DateFrom: DateFrom,
  DateTime: DateTime,
  DateTimeComponentFrom: DateTimeComponentFrom,
  DifferenceBetween: DifferenceBetween,
  DurationBetween: DurationBetween,
  Now: Now,
  Time: Time,
  TimeFrom: TimeFrom,
  TimeOfDay: TimeOfDay,
  TimezoneOffsetFrom: TimezoneOffsetFrom,
  Today: Today,
  doAfter: doAfter,
  doBefore: doBefore
};
},{"../datatypes/datatypes":6,"./builder":16,"./expression":22,"./literal":29}],21:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    UnimplementedExpression = _require.UnimplementedExpression;

var UsingDef = /*#__PURE__*/function (_UnimplementedExpress) {
  _inherits(UsingDef, _UnimplementedExpress);

  var _super = _createSuper(UsingDef);

  function UsingDef() {
    _classCallCheck(this, UsingDef);

    return _super.apply(this, arguments);
  }

  return UsingDef;
}(UnimplementedExpression);

var IncludeDef = /*#__PURE__*/function (_UnimplementedExpress2) {
  _inherits(IncludeDef, _UnimplementedExpress2);

  var _super2 = _createSuper(IncludeDef);

  function IncludeDef() {
    _classCallCheck(this, IncludeDef);

    return _super2.apply(this, arguments);
  }

  return IncludeDef;
}(UnimplementedExpression);

var VersionedIdentifier = /*#__PURE__*/function (_UnimplementedExpress3) {
  _inherits(VersionedIdentifier, _UnimplementedExpress3);

  var _super3 = _createSuper(VersionedIdentifier);

  function VersionedIdentifier() {
    _classCallCheck(this, VersionedIdentifier);

    return _super3.apply(this, arguments);
  }

  return VersionedIdentifier;
}(UnimplementedExpression);

module.exports = {
  UsingDef: UsingDef,
  IncludeDef: IncludeDef,
  VersionedIdentifier: VersionedIdentifier
};
},{"./expression":22}],22:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./builder'),
    build = _require.build;

var _require2 = require('../util/util'),
    typeIsArray = _require2.typeIsArray;

var Expression = /*#__PURE__*/function () {
  function Expression(json) {
    _classCallCheck(this, Expression);

    if (json.operand != null) {
      var op = build(json.operand);

      if (typeIsArray(json.operand)) {
        this.args = op;
      } else {
        this.arg = op;
      }
    }

    if (json.localId != null) {
      this.localId = json.localId;
    }
  }

  _createClass(Expression, [{
    key: "execute",
    value: function execute(ctx) {
      if (this.localId != null) {
        // Store the localId and result on the root context of this library
        var execValue = this.exec(ctx);
        ctx.rootContext().setLocalIdWithResult(this.localId, execValue);
        return execValue;
      } else {
        return this.exec(ctx);
      }
    }
  }, {
    key: "exec",
    value: function exec(ctx) {
      return this;
    }
  }, {
    key: "execArgs",
    value: function execArgs(ctx) {
      switch (false) {
        case this.args == null:
          return this.args.map(function (arg) {
            return arg.execute(ctx);
          });

        case this.arg == null:
          return this.arg.execute(ctx);

        default:
          return null;
      }
    }
  }]);

  return Expression;
}();

var UnimplementedExpression = /*#__PURE__*/function (_Expression) {
  _inherits(UnimplementedExpression, _Expression);

  var _super = _createSuper(UnimplementedExpression);

  function UnimplementedExpression(json) {
    var _this;

    _classCallCheck(this, UnimplementedExpression);

    _this = _super.call(this, json);
    _this.json = json;
    return _this;
  }

  _createClass(UnimplementedExpression, [{
    key: "exec",
    value: function exec(ctx) {
      throw new Error("Unimplemented Expression: ".concat(this.json.type));
    }
  }]);

  return UnimplementedExpression;
}(Expression);

module.exports = {
  Expression: Expression,
  UnimplementedExpression: UnimplementedExpression
};
},{"../util/util":47,"./builder":16}],23:[function(require,module,exports){
"use strict";

var expression = require('./expression');

var aggregate = require('./aggregate');

var arithmetic = require('./arithmetic');

var clinical = require('./clinical');

var comparison = require('./comparison');

var conditional = require('./conditional');

var datetime = require('./datetime');

var declaration = require('./declaration');

var external = require('./external');

var instance = require('./instance');

var interval = require('./interval');

var list = require('./list');

var literal = require('./literal');

var logical = require('./logical');

var nullological = require('./nullological');

var parameters = require('./parameters');

var quantity = require('./quantity');

var query = require('./query');

var ratio = require('./ratio');

var reusable = require('./reusable');

var string = require('./string');

var structured = require('./structured');

var type = require('./type');

var overloaded = require('./overloaded');

var libs = [expression, aggregate, arithmetic, clinical, comparison, conditional, datetime, declaration, external, instance, interval, list, literal, logical, nullological, parameters, query, quantity, ratio, reusable, string, structured, type, overloaded];

for (var _i = 0, _libs = libs; _i < _libs.length; _i++) {
  var lib = _libs[_i];

  for (var _i2 = 0, _Object$keys = Object.keys(lib); _i2 < _Object$keys.length; _i2++) {
    var element = _Object$keys[_i2];
    module.exports[element] = lib[element];
  }
}
},{"./aggregate":14,"./arithmetic":15,"./clinical":17,"./comparison":18,"./conditional":19,"./datetime":20,"./declaration":21,"./expression":22,"./external":24,"./instance":25,"./interval":26,"./list":28,"./literal":29,"./logical":30,"./nullological":31,"./overloaded":32,"./parameters":33,"./quantity":34,"./query":35,"./ratio":36,"./reusable":37,"./string":38,"./structured":39,"./type":40}],24:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('./builder'),
    build = _require2.build;

var _require3 = require('../util/util'),
    typeIsArray = _require3.typeIsArray;

var Retrieve = /*#__PURE__*/function (_Expression) {
  _inherits(Retrieve, _Expression);

  var _super = _createSuper(Retrieve);

  function Retrieve(json) {
    var _this;

    _classCallCheck(this, Retrieve);

    _this = _super.call(this, json);
    _this.datatype = json.dataType;
    _this.templateId = json.templateId;
    _this.codeProperty = json.codeProperty;
    _this.codes = build(json.codes);
    _this.dateProperty = json.dateProperty;
    _this.dateRange = build(json.dateRange);
    return _this;
  }

  _createClass(Retrieve, [{
    key: "exec",
    value: function exec(ctx) {
      var _this2 = this;

      var records = ctx.findRecords(this.templateId != null ? this.templateId : this.datatype);
      var codes = this.codes;

      if (this.codes && typeof this.codes.exec === 'function') {
        codes = this.codes.execute(ctx);

        if (codes == null) {
          return [];
        }
      }

      if (codes) {
        records = records.filter(function (r) {
          return _this2.recordMatchesCodesOrVS(r, codes);
        });
      } // TODO: Added @dateProperty check due to previous fix in cql4browsers in cql_qdm_patient_api hash: ddbc57


      if (this.dateRange && this.dateProperty) {
        var range = this.dateRange.execute(ctx);
        records = records.filter(function (r) {
          return range.includes(r.getDateOrInterval(_this2.dateProperty));
        });
      }

      if (Array.isArray(records)) {
        var _ctx$evaluatedRecords;

        (_ctx$evaluatedRecords = ctx.evaluatedRecords).push.apply(_ctx$evaluatedRecords, _toConsumableArray(records));
      } else {
        ctx.evaluatedRecords.push(records);
      }

      return records;
    }
  }, {
    key: "recordMatchesCodesOrVS",
    value: function recordMatchesCodesOrVS(record, codes) {
      var _this3 = this;

      if (typeIsArray(codes)) {
        return codes.some(function (c) {
          return c.hasMatch(record.getCode(_this3.codeProperty));
        });
      } else {
        return codes.hasMatch(record.getCode(this.codeProperty));
      }
    }
  }]);

  return Retrieve;
}(Expression);

module.exports = {
  Retrieve: Retrieve
};
},{"../util/util":47,"./builder":16,"./expression":22}],25:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('./builder'),
    build = _require2.build;

var _require3 = require('../datatypes/quantity'),
    Quantity = _require3.Quantity;

var _require4 = require('../datatypes/datatypes'),
    Code = _require4.Code,
    Concept = _require4.Concept;

var Element = /*#__PURE__*/function () {
  function Element(json) {
    _classCallCheck(this, Element);

    this.name = json.name;
    this.value = build(json.value);
  }

  _createClass(Element, [{
    key: "exec",
    value: function exec(ctx) {
      return this.value != null ? this.value.execute(ctx) : undefined;
    }
  }]);

  return Element;
}();

var Instance = /*#__PURE__*/function (_Expression) {
  _inherits(Instance, _Expression);

  var _super = _createSuper(Instance);

  function Instance(json) {
    var _this;

    _classCallCheck(this, Instance);

    _this = _super.call(this, json);
    _this.classType = json.classType;
    _this.element = json.element.map(function (child) {
      return new Element(child);
    });
    return _this;
  }

  _createClass(Instance, [{
    key: "exec",
    value: function exec(ctx) {
      var obj = {};

      var _iterator = _createForOfIteratorHelper(this.element),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var el = _step.value;
          obj[el.name] = el.exec(ctx);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      switch (this.classType) {
        case '{urn:hl7-org:elm-types:r1}Quantity':
          return new Quantity(obj.value, obj.unit);

        case '{urn:hl7-org:elm-types:r1}Code':
          return new Code(obj.code, obj.system, obj.version, obj.display);

        case '{urn:hl7-org:elm-types:r1}Concept':
          return new Concept(obj.codes, obj.display);

        default:
          return obj;
      }
    }
  }]);

  return Instance;
}(Expression);

module.exports = {
  Instance: Instance
};
},{"../datatypes/datatypes":6,"../datatypes/quantity":11,"./builder":16,"./expression":22}],26:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('./builder'),
    build = _require2.build;

var _require3 = require('../datatypes/quantity'),
    Quantity = _require3.Quantity,
    doAddition = _require3.doAddition,
    compare_units = _require3.compare_units,
    convert_value = _require3.convert_value;

var _require4 = require('../util/math'),
    successor = _require4.successor,
    predecessor = _require4.predecessor,
    MAX_DATETIME_VALUE = _require4.MAX_DATETIME_VALUE,
    MIN_DATETIME_VALUE = _require4.MIN_DATETIME_VALUE;

var dtivl = require('../datatypes/interval');

var Interval = /*#__PURE__*/function (_Expression) {
  _inherits(Interval, _Expression);

  var _super = _createSuper(Interval);

  function Interval(json) {
    var _this;

    _classCallCheck(this, Interval);

    _this = _super.call(this, json);
    _this.lowClosed = json.lowClosed;
    _this.highClosed = json.highClosed;
    _this.low = build(json.low);
    _this.high = build(json.high);
    return _this;
  } // Define a simple getter to allow type-checking of this class without instanceof
  // and in a way that survives minification (as opposed to checking constructor.name)


  _createClass(Interval, [{
    key: "exec",
    value: function exec(ctx) {
      return new dtivl.Interval(this.low.execute(ctx), this.high.execute(ctx), this.lowClosed, this.highClosed);
    }
  }, {
    key: "isInterval",
    get: function get() {
      return true;
    }
  }]);

  return Interval;
}(Expression); // Equal is completely handled by overloaded#Equal
// NotEqual is completely handled by overloaded#Equal
// Delegated to by overloaded#Contains and overloaded#In


function doContains(interval, item, precision) {
  return interval.contains(item, precision);
} // Delegated to by overloaded#Includes and overloaded#IncludedIn


function doIncludes(interval, subinterval, precision) {
  return interval.includes(subinterval, precision);
} // Delegated to by overloaded#ProperIncludes and overloaded@ProperIncludedIn


function doProperIncludes(interval, subinterval, precision) {
  return interval.properlyIncludes(subinterval, precision);
} // Delegated to by overloaded#After


function doAfter(a, b, precision) {
  return a.after(b, precision);
} // Delegated to by overloaded#Before


function doBefore(a, b, precision) {
  return a.before(b, precision);
}

var Meets = /*#__PURE__*/function (_Expression2) {
  _inherits(Meets, _Expression2);

  var _super2 = _createSuper(Meets);

  function Meets(json) {
    var _this2;

    _classCallCheck(this, Meets);

    _this2 = _super2.call(this, json);
    _this2.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this2;
  }

  _createClass(Meets, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs = this.execArgs(ctx),
          _this$execArgs2 = _slicedToArray(_this$execArgs, 2),
          a = _this$execArgs2[0],
          b = _this$execArgs2[1];

      if (a != null && b != null) {
        return a.meets(b, this.precision);
      } else {
        return null;
      }
    }
  }]);

  return Meets;
}(Expression);

var MeetsAfter = /*#__PURE__*/function (_Expression3) {
  _inherits(MeetsAfter, _Expression3);

  var _super3 = _createSuper(MeetsAfter);

  function MeetsAfter(json) {
    var _this3;

    _classCallCheck(this, MeetsAfter);

    _this3 = _super3.call(this, json);
    _this3.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this3;
  }

  _createClass(MeetsAfter, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs3 = this.execArgs(ctx),
          _this$execArgs4 = _slicedToArray(_this$execArgs3, 2),
          a = _this$execArgs4[0],
          b = _this$execArgs4[1];

      if (a != null && b != null) {
        return a.meetsAfter(b, this.precision);
      } else {
        return null;
      }
    }
  }]);

  return MeetsAfter;
}(Expression);

var MeetsBefore = /*#__PURE__*/function (_Expression4) {
  _inherits(MeetsBefore, _Expression4);

  var _super4 = _createSuper(MeetsBefore);

  function MeetsBefore(json) {
    var _this4;

    _classCallCheck(this, MeetsBefore);

    _this4 = _super4.call(this, json);
    _this4.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this4;
  }

  _createClass(MeetsBefore, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs5 = this.execArgs(ctx),
          _this$execArgs6 = _slicedToArray(_this$execArgs5, 2),
          a = _this$execArgs6[0],
          b = _this$execArgs6[1];

      if (a != null && b != null) {
        return a.meetsBefore(b, this.precision);
      } else {
        return null;
      }
    }
  }]);

  return MeetsBefore;
}(Expression);

var Overlaps = /*#__PURE__*/function (_Expression5) {
  _inherits(Overlaps, _Expression5);

  var _super5 = _createSuper(Overlaps);

  function Overlaps(json) {
    var _this5;

    _classCallCheck(this, Overlaps);

    _this5 = _super5.call(this, json);
    _this5.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this5;
  }

  _createClass(Overlaps, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs7 = this.execArgs(ctx),
          _this$execArgs8 = _slicedToArray(_this$execArgs7, 2),
          a = _this$execArgs8[0],
          b = _this$execArgs8[1];

      if (a != null && b != null) {
        return a.overlaps(b, this.precision);
      } else {
        return null;
      }
    }
  }]);

  return Overlaps;
}(Expression);

var OverlapsAfter = /*#__PURE__*/function (_Expression6) {
  _inherits(OverlapsAfter, _Expression6);

  var _super6 = _createSuper(OverlapsAfter);

  function OverlapsAfter(json) {
    var _this6;

    _classCallCheck(this, OverlapsAfter);

    _this6 = _super6.call(this, json);
    _this6.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this6;
  }

  _createClass(OverlapsAfter, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs9 = this.execArgs(ctx),
          _this$execArgs10 = _slicedToArray(_this$execArgs9, 2),
          a = _this$execArgs10[0],
          b = _this$execArgs10[1];

      if (a != null && b != null) {
        return a.overlapsAfter(b, this.precision);
      } else {
        return null;
      }
    }
  }]);

  return OverlapsAfter;
}(Expression);

var OverlapsBefore = /*#__PURE__*/function (_Expression7) {
  _inherits(OverlapsBefore, _Expression7);

  var _super7 = _createSuper(OverlapsBefore);

  function OverlapsBefore(json) {
    var _this7;

    _classCallCheck(this, OverlapsBefore);

    _this7 = _super7.call(this, json);
    _this7.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this7;
  }

  _createClass(OverlapsBefore, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs11 = this.execArgs(ctx),
          _this$execArgs12 = _slicedToArray(_this$execArgs11, 2),
          a = _this$execArgs12[0],
          b = _this$execArgs12[1];

      if (a != null && b != null) {
        return a.overlapsBefore(b, this.precision);
      } else {
        return null;
      }
    }
  }]);

  return OverlapsBefore;
}(Expression); // Delegated to by overloaded#Union


function doUnion(a, b) {
  return a.union(b);
} // Delegated to by overloaded#Except


function doExcept(a, b) {
  if (a != null && b != null) {
    return a.except(b);
  } else {
    return null;
  }
} // Delegated to by overloaded#Intersect


function doIntersect(a, b) {
  if (a != null && b != null) {
    return a.intersect(b);
  } else {
    return null;
  }
}

var Width = /*#__PURE__*/function (_Expression8) {
  _inherits(Width, _Expression8);

  var _super8 = _createSuper(Width);

  function Width(json) {
    _classCallCheck(this, Width);

    return _super8.call(this, json);
  }

  _createClass(Width, [{
    key: "exec",
    value: function exec(ctx) {
      var interval = this.arg.execute(ctx);

      if (interval == null) {
        return null;
      }

      return interval.width();
    }
  }]);

  return Width;
}(Expression);

var Size = /*#__PURE__*/function (_Expression9) {
  _inherits(Size, _Expression9);

  var _super9 = _createSuper(Size);

  function Size(json) {
    _classCallCheck(this, Size);

    return _super9.call(this, json);
  }

  _createClass(Size, [{
    key: "exec",
    value: function exec(ctx) {
      var interval = this.arg.execute(ctx);

      if (interval == null) {
        return null;
      }

      return interval.size();
    }
  }]);

  return Size;
}(Expression);

var Start = /*#__PURE__*/function (_Expression10) {
  _inherits(Start, _Expression10);

  var _super10 = _createSuper(Start);

  function Start(json) {
    _classCallCheck(this, Start);

    return _super10.call(this, json);
  }

  _createClass(Start, [{
    key: "exec",
    value: function exec(ctx) {
      var interval = this.arg.execute(ctx);

      if (interval == null) {
        return null;
      }

      var start = interval.start(); // fix the timezoneOffset of minimum Datetime to match context offset

      if (start && start.isDateTime && start.equals(MIN_DATETIME_VALUE)) {
        start.timezoneOffset = ctx.getTimezoneOffset();
      }

      return start;
    }
  }]);

  return Start;
}(Expression);

var End = /*#__PURE__*/function (_Expression11) {
  _inherits(End, _Expression11);

  var _super11 = _createSuper(End);

  function End(json) {
    _classCallCheck(this, End);

    return _super11.call(this, json);
  }

  _createClass(End, [{
    key: "exec",
    value: function exec(ctx) {
      var interval = this.arg.execute(ctx);

      if (interval == null) {
        return null;
      }

      var end = interval.end(); // fix the timezoneOffset of maximum Datetime to match context offset

      if (end && end.isDateTime && end.equals(MAX_DATETIME_VALUE)) {
        end.timezoneOffset = ctx.getTimezoneOffset();
      }

      return end;
    }
  }]);

  return End;
}(Expression);

var Starts = /*#__PURE__*/function (_Expression12) {
  _inherits(Starts, _Expression12);

  var _super12 = _createSuper(Starts);

  function Starts(json) {
    var _this8;

    _classCallCheck(this, Starts);

    _this8 = _super12.call(this, json);
    _this8.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this8;
  }

  _createClass(Starts, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs13 = this.execArgs(ctx),
          _this$execArgs14 = _slicedToArray(_this$execArgs13, 2),
          a = _this$execArgs14[0],
          b = _this$execArgs14[1];

      if (a != null && b != null) {
        return a.starts(b, this.precision);
      } else {
        return null;
      }
    }
  }]);

  return Starts;
}(Expression);

var Ends = /*#__PURE__*/function (_Expression13) {
  _inherits(Ends, _Expression13);

  var _super13 = _createSuper(Ends);

  function Ends(json) {
    var _this9;

    _classCallCheck(this, Ends);

    _this9 = _super13.call(this, json);
    _this9.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this9;
  }

  _createClass(Ends, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs15 = this.execArgs(ctx),
          _this$execArgs16 = _slicedToArray(_this$execArgs15, 2),
          a = _this$execArgs16[0],
          b = _this$execArgs16[1];

      if (a != null && b != null) {
        return a.ends(b, this.precision);
      } else {
        return null;
      }
    }
  }]);

  return Ends;
}(Expression);

function intervalListType(intervals) {
  // Returns one of null, 'time', 'date', 'datetime', 'quantity', 'integer', 'decimal' or 'mismatch'
  var type = null;

  var _iterator = _createForOfIteratorHelper(intervals),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var itvl = _step.value;

      if (itvl == null) {
        continue;
      }

      if (itvl.low == null && itvl.high == null) {
        //can't really determine type from this
        continue;
      } // if one end is null (but not both), the type can be determined from the other end


      var low = itvl.low != null ? itvl.low : itvl.high;
      var high = itvl.high != null ? itvl.high : itvl.low;

      if (typeof low.isTime === 'function' && low.isTime() && typeof high.isTime === 'function' && high.isTime()) {
        if (type == null) {
          type = 'time';
        } else if (type === 'time') {
          continue;
        } else {
          return 'mismatch';
        } // if an interval mixes date and datetime, type is datetime (for implicit conversion)

      } else if ((low.isDateTime || high.isDateTime) && (low.isDateTime || low.isDate) && (high.isDateTime || high.isDate)) {
        if (type == null || type === 'date') {
          type = 'datetime';
        } else if (type === 'datetime') {
          continue;
        } else {
          return 'mismatch';
        }
      } else if (low.isDate && high.isDate) {
        if (type == null) {
          type = 'date';
        } else if (type === 'date' || type === 'datetime') {
          continue;
        } else {
          return 'mismatch';
        }
      } else if (low.isQuantity && high.isQuantity) {
        if (type == null) {
          type = 'quantity';
        } else if (type === 'quantity') {
          continue;
        } else {
          return 'mismatch';
        }
      } else if (Number.isInteger(low) && Number.isInteger(high)) {
        if (type == null) {
          type = 'integer';
        } else if (type === 'integer' || type === 'decimal') {
          continue;
        } else {
          return 'mismatch';
        }
      } else if (typeof low === 'number' && typeof high === 'number') {
        if (type == null || type === 'integer') {
          type = 'decimal';
        } else if (type === 'decimal') {
          continue;
        } else {
          return 'mismatch';
        } //if we are here ends are mismatched

      } else {
        return 'mismatch';
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return type;
}

var Expand = /*#__PURE__*/function (_Expression14) {
  _inherits(Expand, _Expression14);

  var _super14 = _createSuper(Expand);

  function Expand(json) {
    _classCallCheck(this, Expand);

    return _super14.call(this, json);
  }

  _createClass(Expand, [{
    key: "exec",
    value: function exec(ctx) {
      // expand(argument List<Interval<T>>, per Quantity) List<Interval<T>>
      var defaultPer, expandFunction;

      var _this$execArgs17 = this.execArgs(ctx),
          _this$execArgs18 = _slicedToArray(_this$execArgs17, 2),
          intervals = _this$execArgs18[0],
          per = _this$execArgs18[1];

      var type = intervalListType(intervals);

      if (type === 'mismatch') {
        throw new Error('List of intervals contains mismatched types.');
      }

      if (type == null) {
        return null;
      } // this step collapses overlaps, and also returns a clone of intervals so we can feel free to mutate


      intervals = collapseIntervals(intervals, per);

      if (intervals.length === 0) {
        return [];
      }

      if (['time', 'date', 'datetime'].includes(type)) {
        expandFunction = this.expandDTishInterval;

        defaultPer = function defaultPer(interval) {
          return new Quantity(1, interval.low.getPrecision());
        };
      } else if (['quantity'].includes(type)) {
        expandFunction = this.expandQuantityInterval;

        defaultPer = function defaultPer(interval) {
          return new Quantity(1, interval.low.unit);
        };
      } else if (['integer', 'decimal'].includes(type)) {
        expandFunction = this.expandNumericInterval;

        defaultPer = function defaultPer(interval) {
          return new Quantity(1, '1');
        };
      } else {
        throw new Error('Interval list type not yet supported.');
      }

      var results = [];

      var _iterator2 = _createForOfIteratorHelper(intervals),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var interval = _step2.value;

          if (interval == null) {
            continue;
          } // We do not support open ended intervals since result would likely be too long


          if (interval.low == null || interval.high == null) {
            return null;
          }

          if (type === 'datetime') {
            //support for implicitly converting dates to datetime
            interval.low = interval.low.getDateTime();
            interval.high = interval.high.getDateTime();
          }

          per = per != null ? per : defaultPer(interval);
          var items = expandFunction.call(this, interval, per);

          if (items === null) {
            return null;
          }

          results.push.apply(results, _toConsumableArray(items || []));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return results;
    }
  }, {
    key: "expandDTishInterval",
    value: function expandDTishInterval(interval, per) {
      if (['week', 'weeks'].includes(per.unit)) {
        per.value *= 7;
        per.unit = 'day';
      } // Precision Checks
      // return null if precision not applicable (e.g. gram, or minutes for dates)


      if (!interval.low.constructor.FIELDS.includes(per.unit)) {
        return null;
      } // open interval with null boundaries do not contribute to output
      // closed interval with null boundaries are not allowed for performance reasons


      if (interval.low == null || interval.high == null) {
        return null;
      }

      var low = interval.lowClosed ? interval.low : interval.low.successor();
      var high = interval.highClosed ? interval.high : interval.high.predecessor();

      if (low.after(high)) {
        return [];
      }

      if (interval.low.isLessPrecise(per.unit) || interval.high.isLessPrecise(per.unit)) {
        return [];
      }

      var current_low = low;
      var results = [];
      low = this.truncateToPrecision(low, per.unit);
      high = this.truncateToPrecision(high, per.unit);
      var current_high = current_low.add(per.value, per.unit).predecessor();
      var intervalToAdd = new dtivl.Interval(current_low, current_high, true, true);

      while (intervalToAdd.high.sameOrBefore(high)) {
        results.push(intervalToAdd);
        current_low = current_low.add(per.value, per.unit);
        current_high = current_low.add(per.value, per.unit).predecessor();
        intervalToAdd = new dtivl.Interval(current_low, current_high, true, true);
      }

      return results;
    }
  }, {
    key: "truncateToPrecision",
    value: function truncateToPrecision(value, unit) {
      // If interval boundaries are more precise than per quantity, truncate to
      // the precision specified by the per
      var shouldTruncate = false;

      var _iterator3 = _createForOfIteratorHelper(value.constructor.FIELDS),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var field = _step3.value;

          if (shouldTruncate) {
            value[field] = null;
          }

          if (field === unit) {
            // Start truncating after this unit
            shouldTruncate = true;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return value;
    }
  }, {
    key: "expandQuantityInterval",
    value: function expandQuantityInterval(interval, per) {
      // we want to convert everything to the more precise of the interval.low or per
      var result_units;

      if (compare_units(interval.low.unit, per.unit) > 0) {
        //interval.low.unit is 'bigger' aka les precise
        result_units = per.unit;
      } else {
        result_units = interval.low.unit;
      }

      var low_value = convert_value(interval.low.value, interval.low.unit, result_units);
      var high_value = convert_value(interval.high.value, interval.high.unit, result_units);
      var per_value = convert_value(per.value, per.unit, result_units); // return null if unit conversion failed, must have mismatched units

      if (!(low_value != null && high_value != null && per_value != null)) {
        return null;
      }

      var results = this.makeNumericIntervalList(low_value, high_value, interval.lowClosed, interval.highClosed, per_value);

      var _iterator4 = _createForOfIteratorHelper(results),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var itvl = _step4.value;
          itvl.low = new Quantity(itvl.low, result_units);
          itvl.high = new Quantity(itvl.high, result_units);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return results;
    }
  }, {
    key: "expandNumericInterval",
    value: function expandNumericInterval(interval, per) {
      if (per.unit !== '1' && per.unit !== '') {
        return null;
      }

      return this.makeNumericIntervalList(interval.low, interval.high, interval.lowClosed, interval.highClosed, per.value);
    }
  }, {
    key: "makeNumericIntervalList",
    value: function makeNumericIntervalList(low, high, lowClosed, highClosed, perValue) {
      // If the per value is a Decimal (has a .), 8 decimal places are appropriate
      // Integers should have 0 Decimal places
      var perIsDecimal = perValue.toString().includes('.');
      var decimalPrecision = perIsDecimal ? 8 : 0;
      low = lowClosed ? low : successor(low);
      high = highClosed ? high : predecessor(high); // If the interval boundaries are more precise than the per quantity, the
      // more precise values will be truncated to the precision specified by the
      // per quantity.

      low = truncateDecimal(low, decimalPrecision);
      high = truncateDecimal(high, decimalPrecision);

      if (low > high) {
        return [];
      }

      if (low == null || high == null) {
        return [];
      }

      var perUnitSize = perIsDecimal ? 0.00000001 : 1;

      if (low === high && Number.isInteger(low) && Number.isInteger(high) && !Number.isInteger(perValue)) {
        high = parseFloat((high + 1).toFixed(decimalPrecision));
      }

      var current_low = low;
      var results = [];

      if (perValue > high - low + perUnitSize) {
        return [];
      }

      var current_high = parseFloat((current_low + perValue - perUnitSize).toFixed(decimalPrecision));
      var intervalToAdd = new dtivl.Interval(current_low, current_high, true, true);

      while (intervalToAdd.high <= high) {
        results.push(intervalToAdd);
        current_low = parseFloat((current_low + perValue).toFixed(decimalPrecision));
        current_high = parseFloat((current_low + perValue - perUnitSize).toFixed(decimalPrecision));
        intervalToAdd = new dtivl.Interval(current_low, current_high, true, true);
      }

      return results;
    }
  }]);

  return Expand;
}(Expression);

var Collapse = /*#__PURE__*/function (_Expression15) {
  _inherits(Collapse, _Expression15);

  var _super15 = _createSuper(Collapse);

  function Collapse(json) {
    _classCallCheck(this, Collapse);

    return _super15.call(this, json);
  }

  _createClass(Collapse, [{
    key: "exec",
    value: function exec(ctx) {
      // collapse(argument List<Interval<T>>, per Quantity) List<Interval<T>>
      var _this$execArgs19 = this.execArgs(ctx),
          _this$execArgs20 = _slicedToArray(_this$execArgs19, 2),
          intervals = _this$execArgs20[0],
          perWidth = _this$execArgs20[1];

      return collapseIntervals(intervals, perWidth);
    }
  }]);

  return Collapse;
}(Expression);

function collapseIntervals(intervals, perWidth) {
  // Clone intervals so this function remains idempotent
  var intervalsClone = [];

  var _iterator5 = _createForOfIteratorHelper(intervals),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var interval = _step5.value;

      // The spec says to ignore null intervals
      if (interval != null) {
        intervalsClone.push(interval.copy());
      }
    } // If the list is null, return null

  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }

  if (intervals == null) {
    return null;
  } else if (intervalsClone.length <= 1) {
    return intervalsClone;
  } else {
    // If the per argument is null, the default unit interval for the point type
    // of the intervals involved will be used (i.e. the interval that has a
    // width equal to the result of the successor function for the point type).
    if (perWidth == null) {
      perWidth = intervalsClone[0].getPointSize();
    } // sort intervalsClone by start


    intervalsClone.sort(function (a, b) {
      if (a.low && typeof a.low.before === 'function') {
        if (b.low != null && a.low.before(b.low)) {
          return -1;
        }

        if (b.low == null || a.low.after(b.low)) {
          return 1;
        }
      } else if (a.low != null && b.low != null) {
        if (a.low < b.low) {
          return -1;
        }

        if (a.low > b.low) {
          return 1;
        }
      } else if (a.low != null && b.low == null) {
        return 1;
      } else if (a.low == null && b.low != null) {
        return -1;
      } // if both lows are undefined, sort by high


      if (a.high && typeof a.high.before === 'function') {
        if (b.high == null || a.high.before(b.high)) {
          return -1;
        }

        if (a.high.after(b.high)) {
          return 1;
        }
      } else if (a.high != null && b.high != null) {
        if (a.high < b.high) {
          return -1;
        }

        if (a.high > b.high) {
          return 1;
        }
      } else if (a.high != null && b.high == null) {
        return -1;
      } else if (a.high == null && b.high != null) {
        return 1;
      }

      return 0;
    }); // collapse intervals as necessary

    var collapsedIntervals = [];
    var a = intervalsClone.shift();
    var b = intervalsClone.shift();

    while (b) {
      if (b.low && typeof b.low.durationBetween === 'function') {
        // handle DateTimes using durationBetween
        if (a.high != null ? a.high.sameOrAfter(b.low) : undefined) {
          // overlap
          if (b.high == null || b.high.after(a.high)) {
            a.high = b.high;
          }
        } else if ((a.high != null ? a.high.durationBetween(b.low, perWidth.unit).high : undefined) <= perWidth.value) {
          a.high = b.high;
        } else {
          collapsedIntervals.push(a);
          a = b;
        }
      } else if (b.low && typeof b.low.sameOrBefore === 'function') {
        if (a.high != null && b.low.sameOrBefore(doAddition(a.high, perWidth))) {
          if (b.high == null || b.high.after(a.high)) {
            a.high = b.high;
          }
        } else {
          collapsedIntervals.push(a);
          a = b;
        }
      } else {
        if (b.low - a.high <= perWidth.value) {
          if (b.high > a.high || b.high == null) {
            a.high = b.high;
          }
        } else {
          collapsedIntervals.push(a);
          a = b;
        }
      }

      b = intervalsClone.shift();
    }

    collapsedIntervals.push(a);
    return collapsedIntervals;
  }
}

function truncateDecimal(decimal, decimalPlaces) {
  // like parseFloat().toFixed() but floor rather than round
  // Needed for when per precision is less than the interval input precision
  var re = new RegExp('^-?\\d+(?:.\\d{0,' + (decimalPlaces || -1) + '})?');
  return parseFloat(decimal.toString().match(re)[0]);
}

module.exports = {
  Collapse: Collapse,
  End: End,
  Ends: Ends,
  Expand: Expand,
  Interval: Interval,
  Meets: Meets,
  MeetsAfter: MeetsAfter,
  MeetsBefore: MeetsBefore,
  Overlaps: Overlaps,
  OverlapsAfter: OverlapsAfter,
  OverlapsBefore: OverlapsBefore,
  Size: Size,
  Start: Start,
  Starts: Starts,
  Width: Width,
  doContains: doContains,
  doIncludes: doIncludes,
  doProperIncludes: doProperIncludes,
  doAfter: doAfter,
  doBefore: doBefore,
  doUnion: doUnion,
  doExcept: doExcept,
  doIntersect: doIntersect
};
},{"../datatypes/interval":9,"../datatypes/quantity":11,"../util/math":46,"./builder":16,"./expression":22}],27:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Library = /*#__PURE__*/function () {
  function Library(json, libraryManager) {
    _classCallCheck(this, Library);

    this.source = json; // usings

    var usingDefs = json.library.usings && json.library.usings.def || [];
    this.usings = usingDefs.filter(function (u) {
      return u.localIdentifier !== 'System';
    }).map(function (u) {
      return {
        name: u.localIdentifier,
        version: u.version
      };
    }); // parameters

    var paramDefs = json.library.parameters && json.library.parameters.def || [];
    this.parameters = {};

    var _iterator = _createForOfIteratorHelper(paramDefs),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var param = _step.value;
        this.parameters[param.name] = new ParameterDef(param);
      } // code systems

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var csDefs = json.library.codeSystems && json.library.codeSystems.def || [];
    this.codesystems = {};

    var _iterator2 = _createForOfIteratorHelper(csDefs),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var codesystem = _step2.value;
        this.codesystems[codesystem.name] = new CodeSystemDef(codesystem);
      } // value sets

    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    var vsDefs = json.library.valueSets && json.library.valueSets.def || [];
    this.valuesets = {};

    var _iterator3 = _createForOfIteratorHelper(vsDefs),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var valueset = _step3.value;
        this.valuesets[valueset.name] = new ValueSetDef(valueset);
      } // codes

    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    var codeDefs = json.library.codes && json.library.codes.def || [];
    this.codes = {};

    var _iterator4 = _createForOfIteratorHelper(codeDefs),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var code = _step4.value;
        this.codes[code.name] = new CodeDef(code);
      } // concepts

    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    var conceptDefs = json.library.concepts && json.library.concepts.def || [];
    this.concepts = {};

    var _iterator5 = _createForOfIteratorHelper(conceptDefs),
        _step5;

    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var concept = _step5.value;
        this.concepts[concept.name] = new ConceptDef(concept);
      } // expressions

    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }

    var exprDefs = json.library.statements && json.library.statements.def || [];
    this.expressions = {};
    this.functions = {};

    var _iterator6 = _createForOfIteratorHelper(exprDefs),
        _step6;

    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var expr = _step6.value;

        if (expr.type === 'FunctionDef') {
          if (!this.functions[expr.name]) {
            this.functions[expr.name] = [];
          }

          this.functions[expr.name].push(new FunctionDef(expr));
        } else {
          this.expressions[expr.name] = new ExpressionDef(expr);
        }
      } // includes

    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }

    var inclDefs = json.library.includes && json.library.includes.def || [];
    this.includes = {};

    var _iterator7 = _createForOfIteratorHelper(inclDefs),
        _step7;

    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var incl = _step7.value;

        if (libraryManager) {
          this.includes[incl.localIdentifier] = libraryManager.resolve(incl.path, incl.version);
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
  }

  _createClass(Library, [{
    key: "getFunction",
    value: function getFunction(identifier) {
      return this.functions[identifier];
    }
  }, {
    key: "get",
    value: function get(identifier) {
      return this.expressions[identifier] || this.includes[identifier] || this.getFunction(identifier);
    }
  }, {
    key: "getValueSet",
    value: function getValueSet(identifier, libraryName) {
      if (this.valuesets[identifier] != null) {
        return this.valuesets[identifier];
      }

      return this.includes[libraryName] != null ? this.includes[libraryName].valuesets[identifier] : undefined;
    }
  }, {
    key: "getCodeSystem",
    value: function getCodeSystem(identifier) {
      return this.codesystems[identifier];
    }
  }, {
    key: "getCode",
    value: function getCode(identifier) {
      return this.codes[identifier];
    }
  }, {
    key: "getConcept",
    value: function getConcept(identifier) {
      return this.concepts[identifier];
    }
  }, {
    key: "getParameter",
    value: function getParameter(name) {
      return this.parameters[name];
    }
  }]);

  return Library;
}(); // These requires are at the end of the file because having them first in the
// file creates errors due to the order that the libraries are loaded.


var _require = require('./expressions'),
    ExpressionDef = _require.ExpressionDef,
    FunctionDef = _require.FunctionDef,
    ParameterDef = _require.ParameterDef,
    ValueSetDef = _require.ValueSetDef,
    CodeSystemDef = _require.CodeSystemDef,
    CodeDef = _require.CodeDef,
    ConceptDef = _require.ConceptDef;

module.exports = {
  Library: Library
};
},{"./expressions":23}],28:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression,
    UnimplementedExpression = _require.UnimplementedExpression;

var _require2 = require('./builder'),
    build = _require2.build;

var _require3 = require('../util/util'),
    typeIsArray = _require3.typeIsArray;

var _require4 = require('../util/comparison'),
    equals = _require4.equals;

var List = /*#__PURE__*/function (_Expression) {
  _inherits(List, _Expression);

  var _super = _createSuper(List);

  function List(json) {
    var _this;

    _classCallCheck(this, List);

    _this = _super.call(this, json);
    _this.elements = build(json.element) || [];
    return _this;
  }

  _createClass(List, [{
    key: "exec",
    value: function exec(ctx) {
      return this.elements.map(function (item) {
        return item.execute(ctx);
      });
    }
  }, {
    key: "isList",
    get: function get() {
      return true;
    }
  }]);

  return List;
}(Expression);

var Exists = /*#__PURE__*/function (_Expression2) {
  _inherits(Exists, _Expression2);

  var _super2 = _createSuper(Exists);

  function Exists(json) {
    _classCallCheck(this, Exists);

    return _super2.call(this, json);
  }

  _createClass(Exists, [{
    key: "exec",
    value: function exec(ctx) {
      var list = this.execArgs(ctx); // if list exists and has non empty length we need to make sure it isnt just full of nulls

      if (list) {
        return list.some(function (item) {
          return item != null;
        });
      }

      return false;
    }
  }]);

  return Exists;
}(Expression); // Equal is completely handled by overloaded#Equal
// NotEqual is completely handled by overloaded#Equal
// Delegated to by overloaded#Union


function doUnion(a, b) {
  var distinct = doDistinct(a.concat(b));
  return removeDuplicateNulls(distinct);
} // Delegated to by overloaded#Except


function doExcept(a, b) {
  var distinct = doDistinct(a);
  var setList = removeDuplicateNulls(distinct);
  return setList.filter(function (item) {
    return !doContains(b, item);
  });
} // Delegated to by overloaded#Intersect


function doIntersect(a, b) {
  var distinct = doDistinct(a);
  var setList = removeDuplicateNulls(distinct);
  return setList.filter(function (item) {
    return doContains(b, item);
  });
} // ELM-only, not a product of CQL


var Times = /*#__PURE__*/function (_UnimplementedExpress) {
  _inherits(Times, _UnimplementedExpress);

  var _super3 = _createSuper(Times);

  function Times() {
    _classCallCheck(this, Times);

    return _super3.apply(this, arguments);
  }

  return Times;
}(UnimplementedExpression); // ELM-only, not a product of CQL


var Filter = /*#__PURE__*/function (_UnimplementedExpress2) {
  _inherits(Filter, _UnimplementedExpress2);

  var _super4 = _createSuper(Filter);

  function Filter() {
    _classCallCheck(this, Filter);

    return _super4.apply(this, arguments);
  }

  return Filter;
}(UnimplementedExpression);

var SingletonFrom = /*#__PURE__*/function (_Expression3) {
  _inherits(SingletonFrom, _Expression3);

  var _super5 = _createSuper(SingletonFrom);

  function SingletonFrom(json) {
    _classCallCheck(this, SingletonFrom);

    return _super5.call(this, json);
  }

  _createClass(SingletonFrom, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null && arg.length > 1) {
        throw new Error("IllegalArgument: 'SingletonFrom' requires a 0 or 1 arg array");
      } else if (arg != null && arg.length === 1) {
        return arg[0];
      } else {
        return null;
      }
    }
  }]);

  return SingletonFrom;
}(Expression);

var ToList = /*#__PURE__*/function (_Expression4) {
  _inherits(ToList, _Expression4);

  var _super6 = _createSuper(ToList);

  function ToList(json) {
    _classCallCheck(this, ToList);

    return _super6.call(this, json);
  }

  _createClass(ToList, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        return [arg];
      } else {
        return [];
      }
    }
  }]);

  return ToList;
}(Expression);

var IndexOf = /*#__PURE__*/function (_Expression5) {
  _inherits(IndexOf, _Expression5);

  var _super7 = _createSuper(IndexOf);

  function IndexOf(json) {
    var _this2;

    _classCallCheck(this, IndexOf);

    _this2 = _super7.call(this, json);
    _this2.source = build(json.source);
    _this2.element = build(json.element);
    return _this2;
  }

  _createClass(IndexOf, [{
    key: "exec",
    value: function exec(ctx) {
      var index;
      var src = this.source.execute(ctx);
      var el = this.element.execute(ctx);

      if (src == null || el == null) {
        return null;
      }

      for (var i = 0; i < src.length; i++) {
        var itm = src[i];

        if (equals(itm, el)) {
          index = i;
          break;
        }
      }

      if (index != null) {
        return index;
      } else {
        return -1;
      }
    }
  }]);

  return IndexOf;
}(Expression); // Indexer is completely handled by overloaded#Indexer
// Delegated to by overloaded#Contains and overloaded#In


function doContains(container, item) {
  return container.some(function (element) {
    return equals(element, item);
  });
} // Delegated to by overloaded#Includes and overloaded@IncludedIn


function doIncludes(list, sublist) {
  return sublist.every(function (x) {
    return doContains(list, x);
  });
} // Delegated to by overloaded#ProperIncludes and overloaded@ProperIncludedIn


function doProperIncludes(list, sublist) {
  return list.length > sublist.length && doIncludes(list, sublist);
} // ELM-only, not a product of CQL


var ForEach = /*#__PURE__*/function (_UnimplementedExpress3) {
  _inherits(ForEach, _UnimplementedExpress3);

  var _super8 = _createSuper(ForEach);

  function ForEach() {
    _classCallCheck(this, ForEach);

    return _super8.apply(this, arguments);
  }

  return ForEach;
}(UnimplementedExpression);

var Flatten = /*#__PURE__*/function (_Expression6) {
  _inherits(Flatten, _Expression6);

  var _super9 = _createSuper(Flatten);

  function Flatten(json) {
    _classCallCheck(this, Flatten);

    return _super9.call(this, json);
  }

  _createClass(Flatten, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (typeIsArray(arg) && arg.every(function (x) {
        return typeIsArray(x);
      })) {
        return arg.reduce(function (x, y) {
          return x.concat(y);
        }, []);
      } else {
        return arg;
      }
    }
  }]);

  return Flatten;
}(Expression);

var Distinct = /*#__PURE__*/function (_Expression7) {
  _inherits(Distinct, _Expression7);

  var _super10 = _createSuper(Distinct);

  function Distinct(json) {
    _classCallCheck(this, Distinct);

    return _super10.call(this, json);
  }

  _createClass(Distinct, [{
    key: "exec",
    value: function exec(ctx) {
      var result = this.execArgs(ctx);

      if (result == null) {
        return null;
      }

      return doDistinct(result);
    }
  }]);

  return Distinct;
}(Expression);

function doDistinct(list) {
  var distinct = [];
  list.forEach(function (item) {
    var isNew = distinct.every(function (seenItem) {
      return !equals(item, seenItem);
    });

    if (isNew) {
      distinct.push(item);
    }
  });
  return distinct;
}

function removeDuplicateNulls(list) {
  // Remove duplicate null elements
  var firstNullFound = false;
  var setList = [];

  var _iterator = _createForOfIteratorHelper(list),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;

      if (item !== null) {
        setList.push(item);
      } else if (item === null && !firstNullFound) {
        setList.push(item);
        firstNullFound = true;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return setList;
} // ELM-only, not a product of CQL


var Current = /*#__PURE__*/function (_UnimplementedExpress4) {
  _inherits(Current, _UnimplementedExpress4);

  var _super11 = _createSuper(Current);

  function Current() {
    _classCallCheck(this, Current);

    return _super11.apply(this, arguments);
  }

  return Current;
}(UnimplementedExpression);

var First = /*#__PURE__*/function (_Expression8) {
  _inherits(First, _Expression8);

  var _super12 = _createSuper(First);

  function First(json) {
    var _this3;

    _classCallCheck(this, First);

    _this3 = _super12.call(this, json);
    _this3.source = build(json.source);
    return _this3;
  }

  _createClass(First, [{
    key: "exec",
    value: function exec(ctx) {
      var src = this.source.exec(ctx);

      if (src != null && typeIsArray(src) && src.length > 0) {
        return src[0];
      } else {
        return null;
      }
    }
  }]);

  return First;
}(Expression);

var Last = /*#__PURE__*/function (_Expression9) {
  _inherits(Last, _Expression9);

  var _super13 = _createSuper(Last);

  function Last(json) {
    var _this4;

    _classCallCheck(this, Last);

    _this4 = _super13.call(this, json);
    _this4.source = build(json.source);
    return _this4;
  }

  _createClass(Last, [{
    key: "exec",
    value: function exec(ctx) {
      var src = this.source.exec(ctx);

      if (src != null && typeIsArray(src) && src.length > 0) {
        return src[src.length - 1];
      } else {
        return null;
      }
    }
  }]);

  return Last;
}(Expression); // Length is completely handled by overloaded#Length


module.exports = {
  Current: Current,
  Distinct: Distinct,
  Exists: Exists,
  Filter: Filter,
  First: First,
  Flatten: Flatten,
  ForEach: ForEach,
  IndexOf: IndexOf,
  Last: Last,
  List: List,
  SingletonFrom: SingletonFrom,
  Times: Times,
  ToList: ToList,
  doContains: doContains,
  doIncludes: doIncludes,
  doProperIncludes: doProperIncludes,
  doUnion: doUnion,
  doExcept: doExcept,
  doIntersect: doIntersect
};
},{"../util/comparison":45,"../util/util":47,"./builder":16,"./expression":22}],29:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var Literal = /*#__PURE__*/function (_Expression) {
  _inherits(Literal, _Expression);

  var _super = _createSuper(Literal);

  _createClass(Literal, null, [{
    key: "from",
    value: function from(json) {
      switch (json.valueType) {
        case '{urn:hl7-org:elm-types:r1}Boolean':
          return new BooleanLiteral(json);

        case '{urn:hl7-org:elm-types:r1}Integer':
          return new IntegerLiteral(json);

        case '{urn:hl7-org:elm-types:r1}Decimal':
          return new DecimalLiteral(json);

        case '{urn:hl7-org:elm-types:r1}String':
          return new StringLiteral(json);

        default:
          return new Literal(json);
      }
    }
  }]);

  function Literal(json) {
    var _this;

    _classCallCheck(this, Literal);

    _this = _super.call(this, json);
    _this.valueType = json.valueType;
    _this.value = json.value;
    return _this;
  }

  _createClass(Literal, [{
    key: "exec",
    value: function exec(ctx) {
      return this.value;
    }
  }]);

  return Literal;
}(Expression); // The following are not defined in ELM, but helpful for execution


var BooleanLiteral = /*#__PURE__*/function (_Literal) {
  _inherits(BooleanLiteral, _Literal);

  var _super2 = _createSuper(BooleanLiteral);

  function BooleanLiteral(json) {
    var _this2;

    _classCallCheck(this, BooleanLiteral);

    _this2 = _super2.call(this, json);
    _this2.value = _this2.value === 'true';
    return _this2;
  } // Define a simple getter to allow type-checking of this class without instanceof
  // and in a way that survives minification (as opposed to checking constructor.name)


  _createClass(BooleanLiteral, [{
    key: "exec",
    value: function exec(ctx) {
      return this.value;
    }
  }, {
    key: "isBooleanLiteral",
    get: function get() {
      return true;
    }
  }]);

  return BooleanLiteral;
}(Literal);

var IntegerLiteral = /*#__PURE__*/function (_Literal2) {
  _inherits(IntegerLiteral, _Literal2);

  var _super3 = _createSuper(IntegerLiteral);

  function IntegerLiteral(json) {
    var _this3;

    _classCallCheck(this, IntegerLiteral);

    _this3 = _super3.call(this, json);
    _this3.value = parseInt(_this3.value, 10);
    return _this3;
  } // Define a simple getter to allow type-checking of this class without instanceof
  // and in a way that survives minification (as opposed to checking constructor.name)


  _createClass(IntegerLiteral, [{
    key: "exec",
    value: function exec(ctx) {
      return this.value;
    }
  }, {
    key: "isIntegerLiteral",
    get: function get() {
      return true;
    }
  }]);

  return IntegerLiteral;
}(Literal);

var DecimalLiteral = /*#__PURE__*/function (_Literal3) {
  _inherits(DecimalLiteral, _Literal3);

  var _super4 = _createSuper(DecimalLiteral);

  function DecimalLiteral(json) {
    var _this4;

    _classCallCheck(this, DecimalLiteral);

    _this4 = _super4.call(this, json);
    _this4.value = parseFloat(_this4.value);
    return _this4;
  } // Define a simple getter to allow type-checking of this class without instanceof
  // and in a way that survives minification (as opposed to checking constructor.name)


  _createClass(DecimalLiteral, [{
    key: "exec",
    value: function exec(ctx) {
      return this.value;
    }
  }, {
    key: "isDecimalLiteral",
    get: function get() {
      return true;
    }
  }]);

  return DecimalLiteral;
}(Literal);

var StringLiteral = /*#__PURE__*/function (_Literal4) {
  _inherits(StringLiteral, _Literal4);

  var _super5 = _createSuper(StringLiteral);

  function StringLiteral(json) {
    _classCallCheck(this, StringLiteral);

    return _super5.call(this, json);
  } // Define a simple getter to allow type-checking of this class without instanceof
  // and in a way that survives minification (as opposed to checking constructor.name)


  _createClass(StringLiteral, [{
    key: "exec",
    value: function exec(ctx) {
      // TODO: Remove these replacements when CQL-to-ELM fixes bug: https://github.com/cqframework/clinical_quality_language/issues/82
      return this.value.replace(/\\'/g, "'").replace(/\\"/g, '"');
    }
  }, {
    key: "isStringLiteral",
    get: function get() {
      return true;
    }
  }]);

  return StringLiteral;
}(Literal);

module.exports = {
  BooleanLiteral: BooleanLiteral,
  DecimalLiteral: DecimalLiteral,
  IntegerLiteral: IntegerLiteral,
  Literal: Literal,
  StringLiteral: StringLiteral
};
},{"./expression":22}],30:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('../datatypes/datatypes'),
    ThreeValuedLogic = _require2.ThreeValuedLogic;

var And = /*#__PURE__*/function (_Expression) {
  _inherits(And, _Expression);

  var _super = _createSuper(And);

  function And(json) {
    _classCallCheck(this, And);

    return _super.call(this, json);
  }

  _createClass(And, [{
    key: "exec",
    value: function exec(ctx) {
      return ThreeValuedLogic.and.apply(ThreeValuedLogic, _toConsumableArray(this.execArgs(ctx)));
    }
  }]);

  return And;
}(Expression);

var Or = /*#__PURE__*/function (_Expression2) {
  _inherits(Or, _Expression2);

  var _super2 = _createSuper(Or);

  function Or(json) {
    _classCallCheck(this, Or);

    return _super2.call(this, json);
  }

  _createClass(Or, [{
    key: "exec",
    value: function exec(ctx) {
      return ThreeValuedLogic.or.apply(ThreeValuedLogic, _toConsumableArray(this.execArgs(ctx)));
    }
  }]);

  return Or;
}(Expression);

var Not = /*#__PURE__*/function (_Expression3) {
  _inherits(Not, _Expression3);

  var _super3 = _createSuper(Not);

  function Not(json) {
    _classCallCheck(this, Not);

    return _super3.call(this, json);
  }

  _createClass(Not, [{
    key: "exec",
    value: function exec(ctx) {
      return ThreeValuedLogic.not(this.execArgs(ctx));
    }
  }]);

  return Not;
}(Expression);

var Xor = /*#__PURE__*/function (_Expression4) {
  _inherits(Xor, _Expression4);

  var _super4 = _createSuper(Xor);

  function Xor(json) {
    _classCallCheck(this, Xor);

    return _super4.call(this, json);
  }

  _createClass(Xor, [{
    key: "exec",
    value: function exec(ctx) {
      return ThreeValuedLogic.xor.apply(ThreeValuedLogic, _toConsumableArray(this.execArgs(ctx)));
    }
  }]);

  return Xor;
}(Expression);

var IsTrue = /*#__PURE__*/function (_Expression5) {
  _inherits(IsTrue, _Expression5);

  var _super5 = _createSuper(IsTrue);

  function IsTrue(json) {
    _classCallCheck(this, IsTrue);

    return _super5.call(this, json);
  }

  _createClass(IsTrue, [{
    key: "exec",
    value: function exec(ctx) {
      return true === this.execArgs(ctx);
    }
  }]);

  return IsTrue;
}(Expression);

var IsFalse = /*#__PURE__*/function (_Expression6) {
  _inherits(IsFalse, _Expression6);

  var _super6 = _createSuper(IsFalse);

  function IsFalse(json) {
    _classCallCheck(this, IsFalse);

    return _super6.call(this, json);
  }

  _createClass(IsFalse, [{
    key: "exec",
    value: function exec(ctx) {
      return false === this.execArgs(ctx);
    }
  }]);

  return IsFalse;
}(Expression);

module.exports = {
  And: And,
  IsFalse: IsFalse,
  IsTrue: IsTrue,
  Not: Not,
  Or: Or,
  Xor: Xor
};
},{"../datatypes/datatypes":6,"./expression":22}],31:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var Null = /*#__PURE__*/function (_Expression) {
  _inherits(Null, _Expression);

  var _super = _createSuper(Null);

  function Null(json) {
    _classCallCheck(this, Null);

    return _super.call(this, json);
  }

  _createClass(Null, [{
    key: "exec",
    value: function exec(ctx) {
      return null;
    }
  }]);

  return Null;
}(Expression);

var IsNull = /*#__PURE__*/function (_Expression2) {
  _inherits(IsNull, _Expression2);

  var _super2 = _createSuper(IsNull);

  function IsNull(json) {
    _classCallCheck(this, IsNull);

    return _super2.call(this, json);
  }

  _createClass(IsNull, [{
    key: "exec",
    value: function exec(ctx) {
      return this.execArgs(ctx) == null;
    }
  }]);

  return IsNull;
}(Expression);

var Coalesce = /*#__PURE__*/function (_Expression3) {
  _inherits(Coalesce, _Expression3);

  var _super3 = _createSuper(Coalesce);

  function Coalesce(json) {
    _classCallCheck(this, Coalesce);

    return _super3.call(this, json);
  }

  _createClass(Coalesce, [{
    key: "exec",
    value: function exec(ctx) {
      var _iterator = _createForOfIteratorHelper(this.args),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var arg = _step.value;
          var result = arg.execute(ctx); // if a single arg that's a list, coalesce over the list

          if (this.args.length === 1 && Array.isArray(result)) {
            var item = result.find(function (item) {
              return item != null;
            });

            if (item != null) {
              return item;
            }
          } else {
            if (result != null) {
              return result;
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return null;
    }
  }]);

  return Coalesce;
}(Expression);

module.exports = {
  Coalesce: Coalesce,
  IsNull: IsNull,
  Null: Null
};
},{"./expression":22}],32:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('../datatypes/logic'),
    ThreeValuedLogic = _require2.ThreeValuedLogic;

var _require3 = require('../datatypes/datetime'),
    DateTime = _require3.DateTime;

var _require4 = require('../util/util'),
    typeIsArray = _require4.typeIsArray;

var _require5 = require('../util/comparison'),
    equals = _require5.equals,
    equivalent = _require5.equivalent;

var DT = require('./datetime');

var LIST = require('./list');

var IVL = require('./interval');

var Equal = /*#__PURE__*/function (_Expression) {
  _inherits(Equal, _Expression);

  var _super = _createSuper(Equal);

  function Equal(json) {
    _classCallCheck(this, Equal);

    return _super.call(this, json);
  }

  _createClass(Equal, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args[0] == null || args[1] == null) {
        return null;
      }

      return equals.apply(void 0, _toConsumableArray(this.execArgs(ctx)));
    }
  }]);

  return Equal;
}(Expression);

var Equivalent = /*#__PURE__*/function (_Expression2) {
  _inherits(Equivalent, _Expression2);

  var _super2 = _createSuper(Equivalent);

  function Equivalent(json) {
    _classCallCheck(this, Equivalent);

    return _super2.call(this, json);
  }

  _createClass(Equivalent, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs = this.execArgs(ctx),
          _this$execArgs2 = _slicedToArray(_this$execArgs, 2),
          a = _this$execArgs2[0],
          b = _this$execArgs2[1];

      if (a == null && b == null) {
        return true;
      } else if (a == null || b == null) {
        return false;
      } else {
        return equivalent(a, b);
      }
    }
  }]);

  return Equivalent;
}(Expression);

var NotEqual = /*#__PURE__*/function (_Expression3) {
  _inherits(NotEqual, _Expression3);

  var _super3 = _createSuper(NotEqual);

  function NotEqual(json) {
    _classCallCheck(this, NotEqual);

    return _super3.call(this, json);
  }

  _createClass(NotEqual, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args[0] == null || args[1] == null) {
        return null;
      }

      return ThreeValuedLogic.not(equals.apply(void 0, _toConsumableArray(this.execArgs(ctx))));
    }
  }]);

  return NotEqual;
}(Expression);

var Union = /*#__PURE__*/function (_Expression4) {
  _inherits(Union, _Expression4);

  var _super4 = _createSuper(Union);

  function Union(json) {
    _classCallCheck(this, Union);

    return _super4.call(this, json);
  }

  _createClass(Union, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs3 = this.execArgs(ctx),
          _this$execArgs4 = _slicedToArray(_this$execArgs3, 2),
          a = _this$execArgs4[0],
          b = _this$execArgs4[1];

      if (a == null || b == null) {
        return null;
      }

      var lib = typeIsArray(a) ? LIST : IVL;
      return lib.doUnion(a, b);
    }
  }]);

  return Union;
}(Expression);

var Except = /*#__PURE__*/function (_Expression5) {
  _inherits(Except, _Expression5);

  var _super5 = _createSuper(Except);

  function Except(json) {
    _classCallCheck(this, Except);

    return _super5.call(this, json);
  }

  _createClass(Except, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs5 = this.execArgs(ctx),
          _this$execArgs6 = _slicedToArray(_this$execArgs5, 2),
          a = _this$execArgs6[0],
          b = _this$execArgs6[1];

      if (a == null || b == null) {
        return null;
      }

      var lib = typeIsArray(a) ? LIST : IVL;
      return lib.doExcept(a, b);
    }
  }]);

  return Except;
}(Expression);

var Intersect = /*#__PURE__*/function (_Expression6) {
  _inherits(Intersect, _Expression6);

  var _super6 = _createSuper(Intersect);

  function Intersect(json) {
    _classCallCheck(this, Intersect);

    return _super6.call(this, json);
  }

  _createClass(Intersect, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs7 = this.execArgs(ctx),
          _this$execArgs8 = _slicedToArray(_this$execArgs7, 2),
          a = _this$execArgs8[0],
          b = _this$execArgs8[1];

      if (a == null || b == null) {
        return null;
      }

      var lib = typeIsArray(a) ? LIST : IVL;
      return lib.doIntersect(a, b);
    }
  }]);

  return Intersect;
}(Expression);

var Indexer = /*#__PURE__*/function (_Expression7) {
  _inherits(Indexer, _Expression7);

  var _super7 = _createSuper(Indexer);

  function Indexer(json) {
    _classCallCheck(this, Indexer);

    return _super7.call(this, json);
  }

  _createClass(Indexer, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs9 = this.execArgs(ctx),
          _this$execArgs10 = _slicedToArray(_this$execArgs9, 2),
          operand = _this$execArgs10[0],
          index = _this$execArgs10[1];

      if (operand == null || index == null) {
        return null;
      }

      if (index < 0 || index >= operand.length) {
        return null;
      }

      return operand[index];
    }
  }]);

  return Indexer;
}(Expression);

var In = /*#__PURE__*/function (_Expression8) {
  _inherits(In, _Expression8);

  var _super8 = _createSuper(In);

  function In(json) {
    var _this;

    _classCallCheck(this, In);

    _this = _super8.call(this, json);
    _this.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this;
  }

  _createClass(In, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs11 = this.execArgs(ctx),
          _this$execArgs12 = _slicedToArray(_this$execArgs11, 2),
          item = _this$execArgs12[0],
          container = _this$execArgs12[1];

      if (container == null || item == null) {
        return null;
      }

      var lib = typeIsArray(container) ? LIST : IVL;
      return lib.doContains(container, item, this.precision);
    }
  }]);

  return In;
}(Expression);

var Contains = /*#__PURE__*/function (_Expression9) {
  _inherits(Contains, _Expression9);

  var _super9 = _createSuper(Contains);

  function Contains(json) {
    var _this2;

    _classCallCheck(this, Contains);

    _this2 = _super9.call(this, json);
    _this2.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this2;
  }

  _createClass(Contains, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs13 = this.execArgs(ctx),
          _this$execArgs14 = _slicedToArray(_this$execArgs13, 2),
          container = _this$execArgs14[0],
          item = _this$execArgs14[1];

      if (container == null || item == null) {
        return null;
      }

      var lib = typeIsArray(container) ? LIST : IVL;
      return lib.doContains(container, item, this.precision);
    }
  }]);

  return Contains;
}(Expression);

var Includes = /*#__PURE__*/function (_Expression10) {
  _inherits(Includes, _Expression10);

  var _super10 = _createSuper(Includes);

  function Includes(json) {
    var _this3;

    _classCallCheck(this, Includes);

    _this3 = _super10.call(this, json);
    _this3.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this3;
  }

  _createClass(Includes, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs15 = this.execArgs(ctx),
          _this$execArgs16 = _slicedToArray(_this$execArgs15, 2),
          container = _this$execArgs16[0],
          contained = _this$execArgs16[1];

      if (container == null || contained == null) {
        return null;
      }

      var lib = typeIsArray(container) ? LIST : IVL;
      return lib.doIncludes(container, contained, this.precision);
    }
  }]);

  return Includes;
}(Expression);

var IncludedIn = /*#__PURE__*/function (_Expression11) {
  _inherits(IncludedIn, _Expression11);

  var _super11 = _createSuper(IncludedIn);

  function IncludedIn(json) {
    var _this4;

    _classCallCheck(this, IncludedIn);

    _this4 = _super11.call(this, json);
    _this4.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this4;
  }

  _createClass(IncludedIn, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs17 = this.execArgs(ctx),
          _this$execArgs18 = _slicedToArray(_this$execArgs17, 2),
          contained = _this$execArgs18[0],
          container = _this$execArgs18[1];

      if (container == null || contained == null) {
        return null;
      }

      var lib = typeIsArray(container) ? LIST : IVL;
      return lib.doIncludes(container, contained, this.precision);
    }
  }]);

  return IncludedIn;
}(Expression);

var ProperIncludes = /*#__PURE__*/function (_Expression12) {
  _inherits(ProperIncludes, _Expression12);

  var _super12 = _createSuper(ProperIncludes);

  function ProperIncludes(json) {
    var _this5;

    _classCallCheck(this, ProperIncludes);

    _this5 = _super12.call(this, json);
    _this5.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this5;
  }

  _createClass(ProperIncludes, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs19 = this.execArgs(ctx),
          _this$execArgs20 = _slicedToArray(_this$execArgs19, 2),
          container = _this$execArgs20[0],
          contained = _this$execArgs20[1];

      if (container == null || contained == null) {
        return null;
      }

      var lib = typeIsArray(container) ? LIST : IVL;
      return lib.doProperIncludes(container, contained, this.precision);
    }
  }]);

  return ProperIncludes;
}(Expression);

var ProperIncludedIn = /*#__PURE__*/function (_Expression13) {
  _inherits(ProperIncludedIn, _Expression13);

  var _super13 = _createSuper(ProperIncludedIn);

  function ProperIncludedIn(json) {
    var _this6;

    _classCallCheck(this, ProperIncludedIn);

    _this6 = _super13.call(this, json);
    _this6.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this6;
  }

  _createClass(ProperIncludedIn, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs21 = this.execArgs(ctx),
          _this$execArgs22 = _slicedToArray(_this$execArgs21, 2),
          contained = _this$execArgs22[0],
          container = _this$execArgs22[1];

      if (container == null || contained == null) {
        return null;
      }

      var lib = typeIsArray(container) ? LIST : IVL;
      return lib.doProperIncludes(container, contained, this.precision);
    }
  }]);

  return ProperIncludedIn;
}(Expression);

var Length = /*#__PURE__*/function (_Expression14) {
  _inherits(Length, _Expression14);

  var _super14 = _createSuper(Length);

  function Length(json) {
    _classCallCheck(this, Length);

    return _super14.call(this, json);
  }

  _createClass(Length, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        return arg.length;
      } else {
        return null;
      }
    }
  }]);

  return Length;
}(Expression);

var After = /*#__PURE__*/function (_Expression15) {
  _inherits(After, _Expression15);

  var _super15 = _createSuper(After);

  function After(json) {
    var _this7;

    _classCallCheck(this, After);

    _this7 = _super15.call(this, json);
    _this7.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this7;
  }

  _createClass(After, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs23 = this.execArgs(ctx),
          _this$execArgs24 = _slicedToArray(_this$execArgs23, 2),
          a = _this$execArgs24[0],
          b = _this$execArgs24[1];

      if (a == null || b == null) {
        return null;
      }

      var lib = a instanceof DateTime ? DT : IVL;
      return lib.doAfter(a, b, this.precision);
    }
  }]);

  return After;
}(Expression);

var Before = /*#__PURE__*/function (_Expression16) {
  _inherits(Before, _Expression16);

  var _super16 = _createSuper(Before);

  function Before(json) {
    var _this8;

    _classCallCheck(this, Before);

    _this8 = _super16.call(this, json);
    _this8.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    return _this8;
  }

  _createClass(Before, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs25 = this.execArgs(ctx),
          _this$execArgs26 = _slicedToArray(_this$execArgs25, 2),
          a = _this$execArgs26[0],
          b = _this$execArgs26[1];

      if (a == null || b == null) {
        return null;
      }

      var lib = a instanceof DateTime ? DT : IVL;
      return lib.doBefore(a, b, this.precision);
    }
  }]);

  return Before;
}(Expression);

var SameAs = /*#__PURE__*/function (_Expression17) {
  _inherits(SameAs, _Expression17);

  var _super17 = _createSuper(SameAs);

  function SameAs(json) {
    var _this9;

    _classCallCheck(this, SameAs);

    _this9 = _super17.call(this, json);
    _this9.precision = json.precision;
    return _this9;
  }

  _createClass(SameAs, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs27 = this.execArgs(ctx),
          _this$execArgs28 = _slicedToArray(_this$execArgs27, 2),
          a = _this$execArgs28[0],
          b = _this$execArgs28[1];

      if (a != null && b != null) {
        return a.sameAs(b, this.precision != null ? this.precision.toLowerCase() : undefined);
      } else {
        return null;
      }
    }
  }]);

  return SameAs;
}(Expression);

var SameOrAfter = /*#__PURE__*/function (_Expression18) {
  _inherits(SameOrAfter, _Expression18);

  var _super18 = _createSuper(SameOrAfter);

  function SameOrAfter(json) {
    var _this10;

    _classCallCheck(this, SameOrAfter);

    _this10 = _super18.call(this, json);
    _this10.precision = json.precision;
    return _this10;
  }

  _createClass(SameOrAfter, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs29 = this.execArgs(ctx),
          _this$execArgs30 = _slicedToArray(_this$execArgs29, 2),
          d1 = _this$execArgs30[0],
          d2 = _this$execArgs30[1];

      if (d1 != null && d2 != null) {
        return d1.sameOrAfter(d2, this.precision != null ? this.precision.toLowerCase() : undefined);
      } else {
        return null;
      }
    }
  }]);

  return SameOrAfter;
}(Expression);

var SameOrBefore = /*#__PURE__*/function (_Expression19) {
  _inherits(SameOrBefore, _Expression19);

  var _super19 = _createSuper(SameOrBefore);

  function SameOrBefore(json) {
    var _this11;

    _classCallCheck(this, SameOrBefore);

    _this11 = _super19.call(this, json);
    _this11.precision = json.precision;
    return _this11;
  }

  _createClass(SameOrBefore, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs31 = this.execArgs(ctx),
          _this$execArgs32 = _slicedToArray(_this$execArgs31, 2),
          d1 = _this$execArgs32[0],
          d2 = _this$execArgs32[1];

      if (d1 != null && d2 != null) {
        return d1.sameOrBefore(d2, this.precision != null ? this.precision.toLowerCase() : undefined);
      } else {
        return null;
      }
    }
  }]);

  return SameOrBefore;
}(Expression);

module.exports = {
  After: After,
  Before: Before,
  Contains: Contains,
  Equal: Equal,
  Equivalent: Equivalent,
  Except: Except,
  In: In,
  IncludedIn: IncludedIn,
  Includes: Includes,
  Indexer: Indexer,
  Intersect: Intersect,
  Length: Length,
  NotEqual: NotEqual,
  ProperIncludedIn: ProperIncludedIn,
  ProperIncludes: ProperIncludes,
  SameAs: SameAs,
  SameOrAfter: SameOrAfter,
  SameOrBefore: SameOrBefore,
  Union: Union
};
},{"../datatypes/datetime":7,"../datatypes/logic":10,"../util/comparison":45,"../util/util":47,"./datetime":20,"./expression":22,"./interval":26,"./list":28}],33:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('./builder'),
    build = _require2.build;

var ParameterDef = /*#__PURE__*/function (_Expression) {
  _inherits(ParameterDef, _Expression);

  var _super = _createSuper(ParameterDef);

  function ParameterDef(json) {
    var _this;

    _classCallCheck(this, ParameterDef);

    _this = _super.call(this, json);
    _this.name = json.name;
    _this.default = build(json.default);
    _this.parameterTypeSpecifier = json.parameterTypeSpecifier;
    return _this;
  }

  _createClass(ParameterDef, [{
    key: "exec",
    value: function exec(ctx) {
      // If context parameters contains the name, return value.
      if (ctx && ctx.parameters[this.name] !== undefined) {
        return ctx.parameters[this.name]; // If the parent context contains the name, return that
      } else if (ctx.getParentParameter(this.name) !== undefined) {
        var parentParam = ctx.getParentParameter(this.name);
        return parentParam.default != null ? parentParam.default.execute(ctx) : parentParam; // If default type exists, execute the default type
      } else if (this.default != null) {
        this.default.execute(ctx);
      }
    }
  }]);

  return ParameterDef;
}(Expression);

var ParameterRef = /*#__PURE__*/function (_Expression2) {
  _inherits(ParameterRef, _Expression2);

  var _super2 = _createSuper(ParameterRef);

  function ParameterRef(json) {
    var _this2;

    _classCallCheck(this, ParameterRef);

    _this2 = _super2.call(this, json);
    _this2.name = json.name;
    _this2.library = json.libraryName;
    return _this2;
  }

  _createClass(ParameterRef, [{
    key: "exec",
    value: function exec(ctx) {
      ctx = this.library ? ctx.getLibraryContext(this.library) : ctx;
      var param = ctx.getParameter(this.name);
      return param != null ? param.execute(ctx) : undefined;
    }
  }]);

  return ParameterRef;
}(Expression);

module.exports = {
  ParameterDef: ParameterDef,
  ParameterRef: ParameterRef
};
},{"./builder":16,"./expression":22}],34:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var DT = require('../datatypes/datatypes'); // Unit conversation is currently implemented on for time duration comparison operations
// TODO: Implement unit conversation for time duration mathematical operations


var Quantity = /*#__PURE__*/function (_Expression) {
  _inherits(Quantity, _Expression);

  var _super = _createSuper(Quantity);

  function Quantity(json) {
    var _this;

    _classCallCheck(this, Quantity);

    _this = _super.call(this, json);
    _this.value = parseFloat(json.value);
    _this.unit = json.unit;
    return _this;
  }

  _createClass(Quantity, [{
    key: "exec",
    value: function exec(ctx) {
      return new DT.Quantity(this.value, this.unit);
    }
  }]);

  return Quantity;
}(Expression);

module.exports = {
  Quantity: Quantity
};
},{"../datatypes/datatypes":6,"./expression":22}],35:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./expression'),
    Expression = _require.Expression,
    UnimplementedExpression = _require.UnimplementedExpression;

var _require2 = require('../runtime/context'),
    Context = _require2.Context;

var _require3 = require('./builder'),
    build = _require3.build;

var _require4 = require('../util/util'),
    typeIsArray = _require4.typeIsArray,
    allTrue = _require4.allTrue;

var _require5 = require('../util/comparison'),
    equals = _require5.equals;

var AliasedQuerySource = function AliasedQuerySource(json) {
  _classCallCheck(this, AliasedQuerySource);

  this.alias = json.alias;
  this.expression = build(json.expression);
};

var LetClause = function LetClause(json) {
  _classCallCheck(this, LetClause);

  this.identifier = json.identifier;
  this.expression = build(json.expression);
};

var With = /*#__PURE__*/function (_Expression) {
  _inherits(With, _Expression);

  var _super = _createSuper(With);

  function With(json) {
    var _this;

    _classCallCheck(this, With);

    _this = _super.call(this, json);
    _this.alias = json.alias;
    _this.expression = build(json.expression);
    _this.suchThat = build(json.suchThat);
    return _this;
  }

  _createClass(With, [{
    key: "exec",
    value: function exec(ctx) {
      var _this2 = this;

      var records = this.expression.execute(ctx);

      if (!typeIsArray(records)) {
        records = [records];
      }

      var returns = records.map(function (rec) {
        var childCtx = ctx.childContext();
        childCtx.set(_this2.alias, rec);
        return _this2.suchThat.execute(childCtx);
      });
      return returns.some(function (x) {
        return x;
      });
    }
  }]);

  return With;
}(Expression);

var Without = /*#__PURE__*/function (_With) {
  _inherits(Without, _With);

  var _super2 = _createSuper(Without);

  function Without(json) {
    _classCallCheck(this, Without);

    return _super2.call(this, json);
  }

  _createClass(Without, [{
    key: "exec",
    value: function exec(ctx) {
      return !_get(_getPrototypeOf(Without.prototype), "exec", this).call(this, ctx);
    }
  }]);

  return Without;
}(With); // ELM-only, not a product of CQL


var Sort = /*#__PURE__*/function (_UnimplementedExpress) {
  _inherits(Sort, _UnimplementedExpress);

  var _super3 = _createSuper(Sort);

  function Sort() {
    _classCallCheck(this, Sort);

    return _super3.apply(this, arguments);
  }

  return Sort;
}(UnimplementedExpression);

var ByDirection = /*#__PURE__*/function (_Expression2) {
  _inherits(ByDirection, _Expression2);

  var _super4 = _createSuper(ByDirection);

  function ByDirection(json) {
    var _this3;

    _classCallCheck(this, ByDirection);

    _this3 = _super4.call(this, json);
    _this3.direction = json.direction;
    _this3.low_order = _this3.direction === 'asc' ? -1 : 1;
    _this3.high_order = _this3.low_order * -1;
    return _this3;
  }

  _createClass(ByDirection, [{
    key: "exec",
    value: function exec(ctx, a, b) {
      if (a === b) {
        return 0;
      } else if (a.isQuantity && b.isQuantity) {
        if (a.before(b)) {
          return this.low_order;
        } else {
          return this.high_order;
        }
      } else if (a < b) {
        return this.low_order;
      } else {
        return this.high_order;
      }
    }
  }]);

  return ByDirection;
}(Expression);

var ByExpression = /*#__PURE__*/function (_Expression3) {
  _inherits(ByExpression, _Expression3);

  var _super5 = _createSuper(ByExpression);

  function ByExpression(json) {
    var _this4;

    _classCallCheck(this, ByExpression);

    _this4 = _super5.call(this, json);
    _this4.expression = build(json.expression);
    _this4.direction = json.direction;
    _this4.low_order = _this4.direction === 'asc' ? -1 : 1;
    _this4.high_order = _this4.low_order * -1;
    return _this4;
  }

  _createClass(ByExpression, [{
    key: "exec",
    value: function exec(ctx, a, b) {
      var sctx = ctx.childContext(a);
      var a_val = this.expression.execute(sctx);
      sctx = ctx.childContext(b);
      var b_val = this.expression.execute(sctx);

      if (a_val === b_val) {
        return 0;
      } else if (a_val.isQuantity && b_val.isQuantity) {
        if (a_val.before(b_val)) {
          return this.low_order;
        } else {
          return this.high_order;
        }
      } else if (a_val < b_val) {
        return this.low_order;
      } else {
        return this.high_order;
      }
    }
  }]);

  return ByExpression;
}(Expression);

var ByColumn = /*#__PURE__*/function (_ByExpression) {
  _inherits(ByColumn, _ByExpression);

  var _super6 = _createSuper(ByColumn);

  function ByColumn(json) {
    var _this5;

    _classCallCheck(this, ByColumn);

    _this5 = _super6.call(this, json);
    _this5.expression = build({
      name: json.path,
      type: 'IdentifierRef'
    });
    return _this5;
  }

  return ByColumn;
}(ByExpression);

var ReturnClause = function ReturnClause(json) {
  _classCallCheck(this, ReturnClause);

  this.expression = build(json.expression);
  this.distinct = json.distinct != null ? json.distinct : true;
};

var SortClause = /*#__PURE__*/function () {
  function SortClause(json) {
    _classCallCheck(this, SortClause);

    this.by = build(json != null ? json.by : undefined);
  }

  _createClass(SortClause, [{
    key: "sort",
    value: function sort(ctx, values) {
      var _this6 = this;

      if (this.by) {
        return values.sort(function (a, b) {
          var order = 0;

          var _iterator = _createForOfIteratorHelper(_this6.by),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;
              // Do not use execute here because the value of the sort order is not important.
              order = item.exec(ctx, a, b);

              if (order !== 0) {
                break;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return order;
        });
      }
    }
  }]);

  return SortClause;
}();

var toDistinctList = function toDistinctList(xList) {
  var yList = [];
  xList.forEach(function (x) {
    if (!yList.some(function (y) {
      return equals(x, y);
    })) {
      yList.push(x);
    }
  });
  return yList;
};

var Query = /*#__PURE__*/function (_Expression4) {
  _inherits(Query, _Expression4);

  var _super7 = _createSuper(Query);

  function Query(json) {
    var _this7;

    _classCallCheck(this, Query);

    _this7 = _super7.call(this, json);
    _this7.sources = new MultiSource(json.source.map(function (s) {
      return new AliasedQuerySource(s);
    }));
    _this7.letClauses = json.let != null ? json.let.map(function (d) {
      return new LetClause(d);
    }) : [];
    _this7.relationship = json.relationship != null ? build(json.relationship) : [];
    _this7.where = build(json.where);
    _this7.returnClause = json.return != null ? new ReturnClause(json.return) : null;
    _this7.aliases = _this7.sources.aliases();
    _this7.sortClause = json.sort != null ? new SortClause(json.sort) : null;
    return _this7;
  }

  _createClass(Query, [{
    key: "exec",
    value: function exec(ctx) {
      var _this8 = this;

      var returnedValues = [];
      this.sources.forEach(ctx, function (rctx) {
        var _iterator2 = _createForOfIteratorHelper(_this8.letClauses),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var def = _step2.value;
            rctx.set(def.identifier, def.expression.execute(rctx));
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var relations = _this8.relationship.map(function (rel) {
          var child_ctx = rctx.childContext();
          return rel.execute(child_ctx);
        });

        var passed = allTrue(relations) && (_this8.where ? _this8.where.execute(rctx) : true);

        if (passed) {
          if (_this8.returnClause != null) {
            var val = _this8.returnClause.expression.execute(rctx);

            returnedValues.push(val);
          } else {
            if (_this8.aliases.length === 1) {
              returnedValues.push(rctx.get(_this8.aliases[0]));
            } else {
              returnedValues.push(rctx.context_values);
            }
          }
        }
      });
      var distinct = this.returnClause != null ? this.returnClause.distinct : true;

      if (distinct) {
        returnedValues = toDistinctList(returnedValues);
      }

      if (this.sortClause != null) {
        this.sortClause.sort(ctx, returnedValues);
      }

      if (this.sources.returnsList()) {
        return returnedValues;
      } else {
        return returnedValues[0];
      }
    }
  }]);

  return Query;
}(Expression);

var AliasRef = /*#__PURE__*/function (_Expression5) {
  _inherits(AliasRef, _Expression5);

  var _super8 = _createSuper(AliasRef);

  function AliasRef(json) {
    var _this9;

    _classCallCheck(this, AliasRef);

    _this9 = _super8.call(this, json);
    _this9.name = json.name;
    return _this9;
  }

  _createClass(AliasRef, [{
    key: "exec",
    value: function exec(ctx) {
      return ctx != null ? ctx.get(this.name) : undefined;
    }
  }]);

  return AliasRef;
}(Expression);

var QueryLetRef = /*#__PURE__*/function (_AliasRef) {
  _inherits(QueryLetRef, _AliasRef);

  var _super9 = _createSuper(QueryLetRef);

  function QueryLetRef(json) {
    _classCallCheck(this, QueryLetRef);

    return _super9.call(this, json);
  }

  return QueryLetRef;
}(AliasRef); // The following is not defined by ELM but is helpful for execution


var MultiSource = /*#__PURE__*/function () {
  function MultiSource(sources) {
    _classCallCheck(this, MultiSource);

    this.sources = sources;
    this.alias = this.sources[0].alias;
    this.expression = this.sources[0].expression;
    this.isList = true;

    if (this.sources.length > 1) {
      this.rest = new MultiSource(this.sources.slice(1));
    }
  }

  _createClass(MultiSource, [{
    key: "aliases",
    value: function aliases() {
      var a = [this.alias];

      if (this.rest) {
        a = a.concat(this.rest.aliases());
      }

      return a;
    }
  }, {
    key: "returnsList",
    value: function returnsList() {
      return this.isList || this.rest && this.rest.returnsList();
    }
  }, {
    key: "forEach",
    value: function forEach(ctx, func) {
      var _this10 = this;

      var records = this.expression.execute(ctx);
      this.isList = typeIsArray(records);
      records = this.isList ? records : [records];
      return records.map(function (rec) {
        var rctx = new Context(ctx);
        rctx.set(_this10.alias, rec);

        if (_this10.rest) {
          return _this10.rest.forEach(rctx, func);
        } else {
          return func(rctx);
        }
      });
    }
  }]);

  return MultiSource;
}();

module.exports = {
  AliasedQuerySource: AliasedQuerySource,
  AliasRef: AliasRef,
  ByColumn: ByColumn,
  ByDirection: ByDirection,
  ByExpression: ByExpression,
  LetClause: LetClause,
  Query: Query,
  QueryLetRef: QueryLetRef,
  ReturnClause: ReturnClause,
  Sort: Sort,
  SortClause: SortClause,
  With: With,
  Without: Without
};
},{"../runtime/context":41,"../util/comparison":45,"../util/util":47,"./builder":16,"./expression":22}],36:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('../datatypes/quantity'),
    Quantity = _require2.Quantity;

var DT = require('../datatypes/datatypes');

var Ratio = /*#__PURE__*/function (_Expression) {
  _inherits(Ratio, _Expression);

  var _super = _createSuper(Ratio);

  function Ratio(json) {
    var _this;

    _classCallCheck(this, Ratio);

    _this = _super.call(this, json);

    if (json.numerator == null) {
      throw new Error('Cannot create a ratio with an undefined numerator value');
    } else {
      _this.numerator = new Quantity(json.numerator.value, json.numerator.unit);
    }

    if (json.denominator == null) {
      throw new Error('Cannot create a ratio with an undefined denominator value');
    } else {
      _this.denominator = new Quantity(json.denominator.value, json.denominator.unit);
    }

    return _this;
  }

  _createClass(Ratio, [{
    key: "exec",
    value: function exec(ctx) {
      return new DT.Ratio(this.numerator, this.denominator);
    }
  }]);

  return Ratio;
}(Expression);

module.exports = {
  Ratio: Ratio
};
},{"../datatypes/datatypes":6,"../datatypes/quantity":11,"./expression":22}],37:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('./builder'),
    build = _require2.build;

var ExpressionDef = /*#__PURE__*/function (_Expression) {
  _inherits(ExpressionDef, _Expression);

  var _super = _createSuper(ExpressionDef);

  function ExpressionDef(json) {
    var _this;

    _classCallCheck(this, ExpressionDef);

    _this = _super.call(this, json);
    _this.name = json.name;
    _this.context = json.context;
    _this.expression = build(json.expression);
    return _this;
  }

  _createClass(ExpressionDef, [{
    key: "exec",
    value: function exec(ctx) {
      var value = this.expression != null ? this.expression.execute(ctx) : undefined;
      ctx.rootContext().set(this.name, value);
      return value;
    }
  }]);

  return ExpressionDef;
}(Expression);

var ExpressionRef = /*#__PURE__*/function (_Expression2) {
  _inherits(ExpressionRef, _Expression2);

  var _super2 = _createSuper(ExpressionRef);

  function ExpressionRef(json) {
    var _this2;

    _classCallCheck(this, ExpressionRef);

    _this2 = _super2.call(this, json);
    _this2.name = json.name;
    _this2.library = json.libraryName;
    return _this2;
  }

  _createClass(ExpressionRef, [{
    key: "exec",
    value: function exec(ctx) {
      ctx = this.library ? ctx.getLibraryContext(this.library) : ctx;
      var value = ctx.get(this.name);

      if (value instanceof Expression) {
        value = value.execute(ctx);
      }

      return value;
    }
  }]);

  return ExpressionRef;
}(Expression);

var FunctionDef = /*#__PURE__*/function (_Expression3) {
  _inherits(FunctionDef, _Expression3);

  var _super3 = _createSuper(FunctionDef);

  function FunctionDef(json) {
    var _this3;

    _classCallCheck(this, FunctionDef);

    _this3 = _super3.call(this, json);
    _this3.name = json.name;
    _this3.expression = build(json.expression);
    _this3.parameters = json.operand;
    return _this3;
  }

  _createClass(FunctionDef, [{
    key: "exec",
    value: function exec(ctx) {
      return this;
    }
  }]);

  return FunctionDef;
}(Expression);

var FunctionRef = /*#__PURE__*/function (_Expression4) {
  _inherits(FunctionRef, _Expression4);

  var _super4 = _createSuper(FunctionRef);

  function FunctionRef(json) {
    var _this4;

    _classCallCheck(this, FunctionRef);

    _this4 = _super4.call(this, json);
    _this4.name = json.name;
    _this4.library = json.libraryName;
    return _this4;
  }

  _createClass(FunctionRef, [{
    key: "exec",
    value: function exec(ctx) {
      var functionDefs, child_ctx;

      if (this.library) {
        var lib = ctx.get(this.library);
        functionDefs = lib ? lib.getFunction(this.name) : undefined;
        var libCtx = ctx.getLibraryContext(this.library);
        child_ctx = libCtx ? libCtx.childContext() : undefined;
      } else {
        functionDefs = ctx.get(this.name);
        child_ctx = ctx.childContext();
      }

      var args = this.execArgs(ctx); // Filter out functions w/ wrong number of arguments.

      functionDefs = functionDefs.filter(function (f) {
        return f.parameters.length === args.length;
      }); // If there is still > 1 matching function, filter by argument types

      if (functionDefs.length > 1) {
        functionDefs = functionDefs.filter(function (f) {
          var match = true;

          for (var i = 0; i < args.length && match; i++) {
            if (args[i] !== null) {
              var operandTypeSpecifier = f.parameters[i].operandTypeSpecifier;

              if (operandTypeSpecifier == null && f.parameters[i].operandType != null) {
                // convert it to a NamedTypedSpecifier
                operandTypeSpecifier = {
                  name: f.parameters[i].operandType,
                  type: 'NamedTypeSpecifier'
                };
              }

              match = ctx.matchesTypeSpecifier(args[i], operandTypeSpecifier);
            }
          }

          return match;
        });
      } // If there is still > 1 matching function, calculate a score based on quality of matches


      if (functionDefs.length > 1) {// TODO
      }

      if (functionDefs.length === 0) {
        throw new Error('no function with matching signature could be found');
      } // By this point, we should have only one function, but until implementation is completed,
      // use the last one (no matter how many still remain)


      var functionDef = functionDefs[functionDefs.length - 1];

      for (var i = 0; i < functionDef.parameters.length; i++) {
        child_ctx.set(functionDef.parameters[i].name, args[i]);
      }

      return functionDef.expression.execute(child_ctx);
    }
  }]);

  return FunctionRef;
}(Expression);

var OperandRef = /*#__PURE__*/function (_Expression5) {
  _inherits(OperandRef, _Expression5);

  var _super5 = _createSuper(OperandRef);

  function OperandRef(json) {
    var _this5;

    _classCallCheck(this, OperandRef);

    _this5 = _super5.call(this, json);
    _this5.name = json.name;
    return _this5;
  }

  _createClass(OperandRef, [{
    key: "exec",
    value: function exec(ctx) {
      return ctx.get(this.name);
    }
  }]);

  return OperandRef;
}(Expression);

var IdentifierRef = /*#__PURE__*/function (_Expression6) {
  _inherits(IdentifierRef, _Expression6);

  var _super6 = _createSuper(IdentifierRef);

  function IdentifierRef(json) {
    var _this6;

    _classCallCheck(this, IdentifierRef);

    _this6 = _super6.call(this, json);
    _this6.name = json.name;
    _this6.library = json.libraryName;
    return _this6;
  }

  _createClass(IdentifierRef, [{
    key: "exec",
    value: function exec(ctx) {
      // TODO: Technically, the ELM Translator should never output one of these
      // but this code is needed since it does, as a work-around to get queries
      // to work properly when sorting by a field in a tuple
      var lib = this.library ? ctx.get(this.library) : undefined;
      var val = lib ? lib.get(this.name) : ctx.get(this.name);

      if (val == null) {
        var parts = this.name.split('.');
        val = ctx.get(parts[0]);

        if (val != null && parts.length > 1) {
          var curr_obj = val;

          var _iterator = _createForOfIteratorHelper(parts.slice(1)),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var part = _step.value;

              // _obj = curr_obj?[part] ? curr_obj?.get?(part)
              // curr_obj = if _obj instanceof Function then _obj.call(curr_obj) else _obj
              var _obj = void 0;

              if (curr_obj != null) {
                _obj = curr_obj[part];

                if (_obj === undefined && typeof curr_obj.get === 'function') {
                  _obj = curr_obj.get(part);
                }
              }

              curr_obj = _obj instanceof Function ? _obj.call(curr_obj) : _obj;
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          val = curr_obj;
        }
      }

      if (val instanceof Function) {
        return val.call(ctx.context_values);
      } else {
        return val;
      }
    }
  }]);

  return IdentifierRef;
}(Expression);

module.exports = {
  ExpressionDef: ExpressionDef,
  ExpressionRef: ExpressionRef,
  FunctionDef: FunctionDef,
  FunctionRef: FunctionRef,
  IdentifierRef: IdentifierRef,
  OperandRef: OperandRef
};
},{"./builder":16,"./expression":22}],38:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression;

var _require2 = require('./builder'),
    build = _require2.build;

var Concatenate = /*#__PURE__*/function (_Expression) {
  _inherits(Concatenate, _Expression);

  var _super = _createSuper(Concatenate);

  function Concatenate(json) {
    _classCallCheck(this, Concatenate);

    return _super.call(this, json);
  }

  _createClass(Concatenate, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args.some(function (x) {
        return x == null;
      })) {
        return null;
      } else {
        return args.reduce(function (x, y) {
          return x + y;
        });
      }
    }
  }]);

  return Concatenate;
}(Expression);

var Combine = /*#__PURE__*/function (_Expression2) {
  _inherits(Combine, _Expression2);

  var _super2 = _createSuper(Combine);

  function Combine(json) {
    var _this;

    _classCallCheck(this, Combine);

    _this = _super2.call(this, json);
    _this.source = build(json.source);
    _this.separator = build(json.separator);
    return _this;
  }

  _createClass(Combine, [{
    key: "exec",
    value: function exec(ctx) {
      var source = this.source.execute(ctx);
      var separator = this.separator != null ? this.separator.execute(ctx) : '';

      if (source == null) {
        return null;
      } else {
        var filteredArray = source.filter(function (x) {
          return x != null;
        });

        if (filteredArray.length === 0) {
          return null;
        } else {
          return filteredArray.join(separator);
        }
      }
    }
  }]);

  return Combine;
}(Expression);

var Split = /*#__PURE__*/function (_Expression3) {
  _inherits(Split, _Expression3);

  var _super3 = _createSuper(Split);

  function Split(json) {
    var _this2;

    _classCallCheck(this, Split);

    _this2 = _super3.call(this, json);
    _this2.stringToSplit = build(json.stringToSplit);
    _this2.separator = build(json.separator);
    return _this2;
  }

  _createClass(Split, [{
    key: "exec",
    value: function exec(ctx) {
      var stringToSplit = this.stringToSplit.execute(ctx);
      var separator = this.separator.execute(ctx);

      if (stringToSplit == null || separator == null) {
        return null;
      } else {
        return stringToSplit.split(separator);
      }
    }
  }]);

  return Split;
}(Expression);

var SplitOnMatches = /*#__PURE__*/function (_Expression4) {
  _inherits(SplitOnMatches, _Expression4);

  var _super4 = _createSuper(SplitOnMatches);

  function SplitOnMatches(json) {
    var _this3;

    _classCallCheck(this, SplitOnMatches);

    _this3 = _super4.call(this, json);
    _this3.stringToSplit = build(json.stringToSplit);
    _this3.separatorPattern = build(json.separatorPattern);
    return _this3;
  }

  _createClass(SplitOnMatches, [{
    key: "exec",
    value: function exec(ctx) {
      var stringToSplit = this.stringToSplit.execute(ctx);
      var separatorPattern = this.separatorPattern.execute(ctx);

      if (stringToSplit == null || separatorPattern == null) {
        return null;
      } else {
        return stringToSplit.split(new RegExp(separatorPattern));
      }
    }
  }]);

  return SplitOnMatches;
}(Expression); // Length is completely handled by overloaded#Length


var Upper = /*#__PURE__*/function (_Expression5) {
  _inherits(Upper, _Expression5);

  var _super5 = _createSuper(Upper);

  function Upper(json) {
    _classCallCheck(this, Upper);

    return _super5.call(this, json);
  }

  _createClass(Upper, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        return arg.toUpperCase();
      } else {
        return null;
      }
    }
  }]);

  return Upper;
}(Expression);

var Lower = /*#__PURE__*/function (_Expression6) {
  _inherits(Lower, _Expression6);

  var _super6 = _createSuper(Lower);

  function Lower(json) {
    _classCallCheck(this, Lower);

    return _super6.call(this, json);
  }

  _createClass(Lower, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        return arg.toLowerCase();
      } else {
        return null;
      }
    }
  }]);

  return Lower;
}(Expression); // Indexer is completely handled by overloaded#Indexer


var PositionOf = /*#__PURE__*/function (_Expression7) {
  _inherits(PositionOf, _Expression7);

  var _super7 = _createSuper(PositionOf);

  function PositionOf(json) {
    var _this4;

    _classCallCheck(this, PositionOf);

    _this4 = _super7.call(this, json);
    _this4.pattern = build(json.pattern);
    _this4.string = build(json.string);
    return _this4;
  }

  _createClass(PositionOf, [{
    key: "exec",
    value: function exec(ctx) {
      var pattern = this.pattern.execute(ctx);
      var string = this.string.execute(ctx);

      if (pattern == null || string == null) {
        return null;
      } else {
        return string.indexOf(pattern);
      }
    }
  }]);

  return PositionOf;
}(Expression);

var Matches = /*#__PURE__*/function (_Expression8) {
  _inherits(Matches, _Expression8);

  var _super8 = _createSuper(Matches);

  function Matches(json) {
    _classCallCheck(this, Matches);

    return _super8.call(this, json);
  }

  _createClass(Matches, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs = this.execArgs(ctx),
          _this$execArgs2 = _slicedToArray(_this$execArgs, 2),
          string = _this$execArgs2[0],
          pattern = _this$execArgs2[1];

      if (string == null || pattern == null) {
        return null;
      }

      if (string.match(new RegExp(pattern))) {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return Matches;
}(Expression);

var Substring = /*#__PURE__*/function (_Expression9) {
  _inherits(Substring, _Expression9);

  var _super9 = _createSuper(Substring);

  function Substring(json) {
    var _this5;

    _classCallCheck(this, Substring);

    _this5 = _super9.call(this, json);
    _this5.stringToSub = build(json.stringToSub);
    _this5.startIndex = build(json.startIndex);
    _this5.length = build(json['length']);
    return _this5;
  }

  _createClass(Substring, [{
    key: "exec",
    value: function exec(ctx) {
      var stringToSub = this.stringToSub.execute(ctx);
      var startIndex = this.startIndex.execute(ctx);
      var length = this.length != null ? this.length.execute(ctx) : null; // According to spec: If stringToSub or startIndex is null, or startIndex is out of range, the result is null.

      if (stringToSub == null || startIndex == null || startIndex < 0 || startIndex >= stringToSub.length) {
        return null;
      } else if (length != null) {
        return stringToSub.substr(startIndex, length);
      } else {
        return stringToSub.substr(startIndex);
      }
    }
  }]);

  return Substring;
}(Expression);

var StartsWith = /*#__PURE__*/function (_Expression10) {
  _inherits(StartsWith, _Expression10);

  var _super10 = _createSuper(StartsWith);

  function StartsWith(json) {
    _classCallCheck(this, StartsWith);

    return _super10.call(this, json);
  }

  _createClass(StartsWith, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args.some(function (x) {
        return x == null;
      })) {
        return null;
      } else {
        return args[0].slice(0, args[1].length) === args[1];
      }
    }
  }]);

  return StartsWith;
}(Expression);

var EndsWith = /*#__PURE__*/function (_Expression11) {
  _inherits(EndsWith, _Expression11);

  var _super11 = _createSuper(EndsWith);

  function EndsWith(json) {
    _classCallCheck(this, EndsWith);

    return _super11.call(this, json);
  }

  _createClass(EndsWith, [{
    key: "exec",
    value: function exec(ctx) {
      var args = this.execArgs(ctx);

      if (args.some(function (x) {
        return x == null;
      })) {
        return null;
      } else {
        return args[1] === '' || args[0].slice(-args[1].length) === args[1];
      }
    }
  }]);

  return EndsWith;
}(Expression);

module.exports = {
  Combine: Combine,
  Concatenate: Concatenate,
  EndsWith: EndsWith,
  Lower: Lower,
  Matches: Matches,
  PositionOf: PositionOf,
  Split: Split,
  SplitOnMatches: SplitOnMatches,
  StartsWith: StartsWith,
  Substring: Substring,
  Upper: Upper
};
},{"./builder":16,"./expression":22}],39:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression,
    UnimplementedExpression = _require.UnimplementedExpression;

var _require2 = require('./builder'),
    build = _require2.build;

var Property = /*#__PURE__*/function (_Expression) {
  _inherits(Property, _Expression);

  var _super = _createSuper(Property);

  function Property(json) {
    var _this;

    _classCallCheck(this, Property);

    _this = _super.call(this, json);
    _this.scope = json.scope;
    _this.source = build(json.source);
    _this.path = json.path;
    return _this;
  }

  _createClass(Property, [{
    key: "exec",
    value: function exec(ctx) {
      var obj = this.scope != null ? ctx.get(this.scope) : this.source;

      if (obj instanceof Expression) {
        obj = obj.execute(ctx);
      }

      var val = getPropertyFromObject(obj, this.path);

      if (val == null) {
        var parts = this.path.split('.');
        var curr_obj = obj;

        var _iterator = _createForOfIteratorHelper(parts),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var part = _step.value;

            var _obj = getPropertyFromObject(curr_obj, part);

            curr_obj = _obj instanceof Function ? _obj.call(curr_obj) : _obj;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        val = curr_obj != null ? curr_obj : null; // convert undefined to null
      }

      if (val instanceof Function) {
        return val.call(obj);
      } else {
        return val;
      }
    }
  }]);

  return Property;
}(Expression);

function getPropertyFromObject(obj, path) {
  var val;

  if (obj != null) {
    val = obj[path];

    if (val === undefined && typeof obj.get === 'function') {
      val = obj.get(path);
    }
  }

  return val;
}

var Tuple = /*#__PURE__*/function (_Expression2) {
  _inherits(Tuple, _Expression2);

  var _super2 = _createSuper(Tuple);

  function Tuple(json) {
    var _this2;

    _classCallCheck(this, Tuple);

    _this2 = _super2.call(this, json);
    var elements = json.element != null ? json.element : [];
    _this2.elements = elements.map(function (el) {
      return {
        name: el.name,
        value: build(el.value)
      };
    });
    return _this2;
  }

  _createClass(Tuple, [{
    key: "exec",
    value: function exec(ctx) {
      var val = {};

      var _iterator2 = _createForOfIteratorHelper(this.elements),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var el = _step2.value;
          val[el.name] = el.value != null ? el.value.execute(ctx) : undefined;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return val;
    }
  }, {
    key: "isTuple",
    get: function get() {
      return true;
    }
  }]);

  return Tuple;
}(Expression);

var TupleElement = /*#__PURE__*/function (_UnimplementedExpress) {
  _inherits(TupleElement, _UnimplementedExpress);

  var _super3 = _createSuper(TupleElement);

  function TupleElement() {
    _classCallCheck(this, TupleElement);

    return _super3.apply(this, arguments);
  }

  return TupleElement;
}(UnimplementedExpression);

var TupleElementDefinition = /*#__PURE__*/function (_UnimplementedExpress2) {
  _inherits(TupleElementDefinition, _UnimplementedExpress2);

  var _super4 = _createSuper(TupleElementDefinition);

  function TupleElementDefinition() {
    _classCallCheck(this, TupleElementDefinition);

    return _super4.apply(this, arguments);
  }

  return TupleElementDefinition;
}(UnimplementedExpression);

module.exports = {
  Property: Property,
  Tuple: Tuple,
  TupleElement: TupleElement,
  TupleElementDefinition: TupleElementDefinition
};
},{"./builder":16,"./expression":22}],40:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('./expression'),
    Expression = _require.Expression,
    UnimplementedExpression = _require.UnimplementedExpression;

var _require2 = require('../datatypes/datetime'),
    DateTime = _require2.DateTime,
    _Date = _require2.Date;

var _require3 = require('../datatypes/clinical'),
    Concept = _require3.Concept;

var _require4 = require('../datatypes/quantity'),
    parseQuantity = _require4.parseQuantity;

var _require5 = require('../util/math'),
    isValidDecimal = _require5.isValidDecimal,
    isValidInteger = _require5.isValidInteger,
    limitDecimalPrecision = _require5.limitDecimalPrecision;

var _require6 = require('../util/util'),
    normalizeMillisecondsField = _require6.normalizeMillisecondsField;

var _require7 = require('../datatypes/ratio'),
    Ratio = _require7.Ratio; // TODO: Casting and Conversion needs unit tests!


var As = /*#__PURE__*/function (_Expression) {
  _inherits(As, _Expression);

  var _super = _createSuper(As);

  function As(json) {
    var _this;

    _classCallCheck(this, As);

    _this = _super.call(this, json);

    if (json.asTypeSpecifier) {
      _this.asTypeSpecifier = json.asTypeSpecifier;
    } else if (json.asType) {
      // convert it to a NamedTypedSpecifier
      _this.asTypeSpecifier = {
        name: json.asType,
        type: 'NamedTypeSpecifier'
      };
    }

    _this.strict = json.strict != null ? json.strict : false;
    return _this;
  }

  _createClass(As, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx); // If it is null, return null

      if (arg == null) {
        return null;
      }

      if (typeof arg._is !== 'function' && !isSystemType(this.asTypeSpecifier)) {
        // We need an _is implementation in order to check non System types
        // If this is not found then we should just return the arg to match old functionality.
        return arg;
      }

      if (ctx.matchesTypeSpecifier(arg, this.asTypeSpecifier)) {
        // TODO: request patient source to change type identification
        return arg;
      } else {
        return null;
      }
    }
  }]);

  return As;
}(Expression);

var ToBoolean = /*#__PURE__*/function (_Expression2) {
  _inherits(ToBoolean, _Expression2);

  var _super2 = _createSuper(ToBoolean);

  function ToBoolean(json) {
    _classCallCheck(this, ToBoolean);

    return _super2.call(this, json);
  }

  _createClass(ToBoolean, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        var strArg = arg.toString().toLowerCase();

        if (['true', 't', 'yes', 'y', '1'].includes(strArg)) {
          return true;
        } else if (['false', 'f', 'no', 'n', '0'].includes(strArg)) {
          return false;
        }
      }

      return null;
    }
  }]);

  return ToBoolean;
}(Expression);

var ToConcept = /*#__PURE__*/function (_Expression3) {
  _inherits(ToConcept, _Expression3);

  var _super3 = _createSuper(ToConcept);

  function ToConcept(json) {
    _classCallCheck(this, ToConcept);

    return _super3.call(this, json);
  }

  _createClass(ToConcept, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        return new Concept([arg], arg.display);
      } else {
        return null;
      }
    }
  }]);

  return ToConcept;
}(Expression);

var ToDate = /*#__PURE__*/function (_Expression4) {
  _inherits(ToDate, _Expression4);

  var _super4 = _createSuper(ToDate);

  function ToDate(json) {
    _classCallCheck(this, ToDate);

    return _super4.call(this, json);
  }

  _createClass(ToDate, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        return null;
      } else if (arg.isDateTime) {
        return arg.getDate();
      } else {
        return _Date.parse(arg.toString());
      }
    }
  }]);

  return ToDate;
}(Expression);

var ToDateTime = /*#__PURE__*/function (_Expression5) {
  _inherits(ToDateTime, _Expression5);

  var _super5 = _createSuper(ToDateTime);

  function ToDateTime(json) {
    _classCallCheck(this, ToDateTime);

    return _super5.call(this, json);
  }

  _createClass(ToDateTime, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg == null) {
        return null;
      } else if (arg.isDate) {
        return arg.getDateTime();
      } else {
        return DateTime.parse(arg.toString());
      }
    }
  }]);

  return ToDateTime;
}(Expression);

var ToDecimal = /*#__PURE__*/function (_Expression6) {
  _inherits(ToDecimal, _Expression6);

  var _super6 = _createSuper(ToDecimal);

  function ToDecimal(json) {
    _classCallCheck(this, ToDecimal);

    return _super6.call(this, json);
  }

  _createClass(ToDecimal, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        var decimal = limitDecimalPrecision(parseFloat(arg.toString()));

        if (isValidDecimal(decimal)) {
          return decimal;
        }
      }

      return null;
    }
  }]);

  return ToDecimal;
}(Expression);

var ToInteger = /*#__PURE__*/function (_Expression7) {
  _inherits(ToInteger, _Expression7);

  var _super7 = _createSuper(ToInteger);

  function ToInteger(json) {
    _classCallCheck(this, ToInteger);

    return _super7.call(this, json);
  }

  _createClass(ToInteger, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        var integer = parseInt(arg.toString());

        if (isValidInteger(integer)) {
          return integer;
        }
      }

      return null;
    }
  }]);

  return ToInteger;
}(Expression);

var ToQuantity = /*#__PURE__*/function (_Expression8) {
  _inherits(ToQuantity, _Expression8);

  var _super8 = _createSuper(ToQuantity);

  function ToQuantity(json) {
    _classCallCheck(this, ToQuantity);

    return _super8.call(this, json);
  }

  _createClass(ToQuantity, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        return parseQuantity(arg.toString());
      } else {
        return null;
      }
    }
  }]);

  return ToQuantity;
}(Expression);

var ToRatio = /*#__PURE__*/function (_Expression9) {
  _inherits(ToRatio, _Expression9);

  var _super9 = _createSuper(ToRatio);

  function ToRatio(json) {
    _classCallCheck(this, ToRatio);

    return _super9.call(this, json);
  }

  _createClass(ToRatio, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        // Argument will be of form '<quantity>:<quantity>'
        var denominator, numerator;

        try {
          // String will be split into an array. Numerator will be at index 1, Denominator will be at index 4
          var splitRatioString = arg.toString().match(/^(\d+(\.\d+)?\s*('.+')?)\s*:\s*(\d+(\.\d+)?\s*('.+')?)$/);

          if (splitRatioString == null) {
            return null;
          }

          numerator = parseQuantity(splitRatioString[1]);
          denominator = parseQuantity(splitRatioString[4]);
        } catch (error) {
          // If the input string is not formatted correctly, or cannot be
          // interpreted as a valid Quantity value, the result is null.
          return null;
        } // The value element of a Quantity must be present.


        if (numerator == null || denominator == null) {
          return null;
        }

        return new Ratio(numerator, denominator);
      } else {
        return null;
      }
    }
  }]);

  return ToRatio;
}(Expression);

var ToString = /*#__PURE__*/function (_Expression10) {
  _inherits(ToString, _Expression10);

  var _super10 = _createSuper(ToString);

  function ToString(json) {
    _classCallCheck(this, ToString);

    return _super10.call(this, json);
  }

  _createClass(ToString, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        return arg.toString();
      } else {
        return null;
      }
    }
  }]);

  return ToString;
}(Expression);

var ToTime = /*#__PURE__*/function (_Expression11) {
  _inherits(ToTime, _Expression11);

  var _super11 = _createSuper(ToTime);

  function ToTime(json) {
    _classCallCheck(this, ToTime);

    return _super11.call(this, json);
  }

  _createClass(ToTime, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg != null) {
        var timeString = arg.toString(); // Return null if string doesn't represent a valid ISO-8601 Time
        // hh:mm:ss.fff or hh:mm:ss.fff

        var matches = /^((\d{2})(:(\d{2})(:(\d{2})(\.(\d+))?)?)?)?$/.exec(timeString);

        if (matches == null) {
          return null;
        }

        var hours = matches[2];
        var minutes = matches[4];
        var seconds = matches[6]; // Validate h/m/s if they exist, but allow null

        if (hours != null) {
          if (hours < 0 || hours > 23) {
            return null;
          }

          hours = parseInt(hours, 10);
        }

        if (minutes != null) {
          if (minutes < 0 || minutes > 59) {
            return null;
          }

          minutes = parseInt(minutes, 10);
        }

        if (seconds != null) {
          if (seconds < 0 || seconds > 59) {
            return null;
          }

          seconds = parseInt(seconds, 10);
        }

        var milliseconds = matches[8];

        if (milliseconds != null) {
          milliseconds = parseInt(normalizeMillisecondsField(milliseconds));
        } // Time is implemented as Datetime with year 0, month 1, day 1 and null timezoneOffset


        return new DateTime(0, 1, 1, hours, minutes, seconds, milliseconds, null);
      } else {
        return null;
      }
    }
  }]);

  return ToTime;
}(Expression);

var Convert = /*#__PURE__*/function (_Expression12) {
  _inherits(Convert, _Expression12);

  var _super12 = _createSuper(Convert);

  function Convert(json) {
    var _this2;

    _classCallCheck(this, Convert);

    _this2 = _super12.call(this, json);
    _this2.operand = json.operand;
    _this2.toType = json.toType;
    return _this2;
  }

  _createClass(Convert, [{
    key: "exec",
    value: function exec(ctx) {
      switch (this.toType) {
        case '{urn:hl7-org:elm-types:r1}Boolean':
          return new ToBoolean({
            type: 'ToBoolean',
            operand: this.operand
          }).execute(ctx);

        case '{urn:hl7-org:elm-types:r1}Concept':
          return new ToConcept({
            type: 'ToConcept',
            operand: this.operand
          }).execute(ctx);

        case '{urn:hl7-org:elm-types:r1}Decimal':
          return new ToDecimal({
            type: 'ToDecimal',
            operand: this.operand
          }).execute(ctx);

        case '{urn:hl7-org:elm-types:r1}Integer':
          return new ToInteger({
            type: 'ToInteger',
            operand: this.operand
          }).execute(ctx);

        case '{urn:hl7-org:elm-types:r1}String':
          return new ToString({
            type: 'ToString',
            operand: this.operand
          }).execute(ctx);

        case '{urn:hl7-org:elm-types:r1}Quantity':
          return new ToQuantity({
            type: 'ToQuantity',
            operand: this.operand
          }).execute(ctx);

        case '{urn:hl7-org:elm-types:r1}DateTime':
          return new ToDateTime({
            type: 'ToDateTime',
            operand: this.operand
          }).execute(ctx);

        case '{urn:hl7-org:elm-types:r1}Date':
          return new ToDate({
            type: 'ToDate',
            operand: this.operand
          }).execute(ctx);

        case '{urn:hl7-org:elm-types:r1}Time':
          return new ToTime({
            type: 'ToTime',
            operand: this.operand
          }).execute(ctx);

        default:
          return this.execArgs(ctx);
      }
    }
  }]);

  return Convert;
}(Expression);

var ConvertsToBoolean = /*#__PURE__*/function (_Expression13) {
  _inherits(ConvertsToBoolean, _Expression13);

  var _super13 = _createSuper(ConvertsToBoolean);

  function ConvertsToBoolean(json) {
    var _this3;

    _classCallCheck(this, ConvertsToBoolean);

    _this3 = _super13.call(this, json);
    _this3.operand = json.operand;
    return _this3;
  }

  _createClass(ConvertsToBoolean, [{
    key: "exec",
    value: function exec(ctx) {
      var operatorValue = this.execArgs(ctx);

      if (operatorValue === null) {
        return null;
      } else {
        return canConvertToType(ToBoolean, this.operand, ctx);
      }
    }
  }]);

  return ConvertsToBoolean;
}(Expression);

var ConvertsToDate = /*#__PURE__*/function (_Expression14) {
  _inherits(ConvertsToDate, _Expression14);

  var _super14 = _createSuper(ConvertsToDate);

  function ConvertsToDate(json) {
    var _this4;

    _classCallCheck(this, ConvertsToDate);

    _this4 = _super14.call(this, json);
    _this4.operand = json.operand;
    return _this4;
  }

  _createClass(ConvertsToDate, [{
    key: "exec",
    value: function exec(ctx) {
      var operatorValue = this.execArgs(ctx);

      if (operatorValue === null) {
        return null;
      } else {
        return canConvertToType(ToDate, this.operand, ctx);
      }
    }
  }]);

  return ConvertsToDate;
}(Expression);

var ConvertsToDateTime = /*#__PURE__*/function (_Expression15) {
  _inherits(ConvertsToDateTime, _Expression15);

  var _super15 = _createSuper(ConvertsToDateTime);

  function ConvertsToDateTime(json) {
    var _this5;

    _classCallCheck(this, ConvertsToDateTime);

    _this5 = _super15.call(this, json);
    _this5.operand = json.operand;
    return _this5;
  }

  _createClass(ConvertsToDateTime, [{
    key: "exec",
    value: function exec(ctx) {
      var operatorValue = this.execArgs(ctx);

      if (operatorValue === null) {
        return null;
      } else {
        return canConvertToType(ToDateTime, this.operand, ctx);
      }
    }
  }]);

  return ConvertsToDateTime;
}(Expression);

var ConvertsToDecimal = /*#__PURE__*/function (_Expression16) {
  _inherits(ConvertsToDecimal, _Expression16);

  var _super16 = _createSuper(ConvertsToDecimal);

  function ConvertsToDecimal(json) {
    var _this6;

    _classCallCheck(this, ConvertsToDecimal);

    _this6 = _super16.call(this, json);
    _this6.operand = json.operand;
    return _this6;
  }

  _createClass(ConvertsToDecimal, [{
    key: "exec",
    value: function exec(ctx) {
      var operatorValue = this.execArgs(ctx);

      if (operatorValue === null) {
        return null;
      } else {
        return canConvertToType(ToDecimal, this.operand, ctx);
      }
    }
  }]);

  return ConvertsToDecimal;
}(Expression);

var ConvertsToInteger = /*#__PURE__*/function (_Expression17) {
  _inherits(ConvertsToInteger, _Expression17);

  var _super17 = _createSuper(ConvertsToInteger);

  function ConvertsToInteger(json) {
    var _this7;

    _classCallCheck(this, ConvertsToInteger);

    _this7 = _super17.call(this, json);
    _this7.operand = json.operand;
    return _this7;
  }

  _createClass(ConvertsToInteger, [{
    key: "exec",
    value: function exec(ctx) {
      var operatorValue = this.execArgs(ctx);

      if (operatorValue === null) {
        return null;
      } else {
        return canConvertToType(ToInteger, this.operand, ctx);
      }
    }
  }]);

  return ConvertsToInteger;
}(Expression);

var ConvertsToQuantity = /*#__PURE__*/function (_Expression18) {
  _inherits(ConvertsToQuantity, _Expression18);

  var _super18 = _createSuper(ConvertsToQuantity);

  function ConvertsToQuantity(json) {
    var _this8;

    _classCallCheck(this, ConvertsToQuantity);

    _this8 = _super18.call(this, json);
    _this8.operand = json.operand;
    return _this8;
  }

  _createClass(ConvertsToQuantity, [{
    key: "exec",
    value: function exec(ctx) {
      var operatorValue = this.execArgs(ctx);

      if (operatorValue === null) {
        return null;
      } else {
        return canConvertToType(ToQuantity, this.operand, ctx);
      }
    }
  }]);

  return ConvertsToQuantity;
}(Expression);

var ConvertsToRatio = /*#__PURE__*/function (_Expression19) {
  _inherits(ConvertsToRatio, _Expression19);

  var _super19 = _createSuper(ConvertsToRatio);

  function ConvertsToRatio(json) {
    var _this9;

    _classCallCheck(this, ConvertsToRatio);

    _this9 = _super19.call(this, json);
    _this9.operand = json.operand;
    return _this9;
  }

  _createClass(ConvertsToRatio, [{
    key: "exec",
    value: function exec(ctx) {
      var operatorValue = this.execArgs(ctx);

      if (operatorValue === null) {
        return null;
      } else {
        return canConvertToType(ToRatio, this.operand, ctx);
      }
    }
  }]);

  return ConvertsToRatio;
}(Expression);

var ConvertsToString = /*#__PURE__*/function (_Expression20) {
  _inherits(ConvertsToString, _Expression20);

  var _super20 = _createSuper(ConvertsToString);

  function ConvertsToString(json) {
    var _this10;

    _classCallCheck(this, ConvertsToString);

    _this10 = _super20.call(this, json);
    _this10.operand = json.operand;
    return _this10;
  }

  _createClass(ConvertsToString, [{
    key: "exec",
    value: function exec(ctx) {
      var operatorValue = this.execArgs(ctx);

      if (operatorValue === null) {
        return null;
      } else {
        return canConvertToType(ToString, this.operand, ctx);
      }
    }
  }]);

  return ConvertsToString;
}(Expression);

var ConvertsToTime = /*#__PURE__*/function (_Expression21) {
  _inherits(ConvertsToTime, _Expression21);

  var _super21 = _createSuper(ConvertsToTime);

  function ConvertsToTime(json) {
    var _this11;

    _classCallCheck(this, ConvertsToTime);

    _this11 = _super21.call(this, json);
    _this11.operand = json.operand;
    return _this11;
  }

  _createClass(ConvertsToTime, [{
    key: "exec",
    value: function exec(ctx) {
      var operatorValue = this.execArgs(ctx);

      if (operatorValue === null) {
        return null;
      } else {
        return canConvertToType(ToTime, this.operand, ctx);
      }
    }
  }]);

  return ConvertsToTime;
}(Expression);

function canConvertToType(toFunction, operand, ctx) {
  try {
    var value = new toFunction({
      type: toFunction.name,
      operand: operand
    }).execute(ctx);

    if (value != null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

var ConvertQuantity = /*#__PURE__*/function (_Expression22) {
  _inherits(ConvertQuantity, _Expression22);

  var _super22 = _createSuper(ConvertQuantity);

  function ConvertQuantity(json) {
    _classCallCheck(this, ConvertQuantity);

    return _super22.call(this, json);
  }

  _createClass(ConvertQuantity, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs = this.execArgs(ctx),
          _this$execArgs2 = _slicedToArray(_this$execArgs, 2),
          quantity = _this$execArgs2[0],
          newUnit = _this$execArgs2[1];

      if (quantity != null && newUnit != null) {
        try {
          return quantity.convertUnit(newUnit);
        } catch (error) {
          // Cannot convert input to target unit, spec says to return null
          return null;
        }
      }
    }
  }]);

  return ConvertQuantity;
}(Expression);

var CanConvertQuantity = /*#__PURE__*/function (_Expression23) {
  _inherits(CanConvertQuantity, _Expression23);

  var _super23 = _createSuper(CanConvertQuantity);

  function CanConvertQuantity(json) {
    _classCallCheck(this, CanConvertQuantity);

    return _super23.call(this, json);
  }

  _createClass(CanConvertQuantity, [{
    key: "exec",
    value: function exec(ctx) {
      var _this$execArgs3 = this.execArgs(ctx),
          _this$execArgs4 = _slicedToArray(_this$execArgs3, 2),
          quantity = _this$execArgs4[0],
          newUnit = _this$execArgs4[1];

      if (quantity != null && newUnit != null) {
        try {
          quantity.convertUnit(newUnit);
          return true;
        } catch (error) {
          return false;
        }
      }

      return null;
    }
  }]);

  return CanConvertQuantity;
}(Expression);

var Is = /*#__PURE__*/function (_Expression24) {
  _inherits(Is, _Expression24);

  var _super24 = _createSuper(Is);

  function Is(json) {
    var _this12;

    _classCallCheck(this, Is);

    _this12 = _super24.call(this, json);

    if (json.isTypeSpecifier) {
      _this12.isTypeSpecifier = json.isTypeSpecifier;
    } else if (json.isType) {
      // Convert it to a NamedTypeSpecifier
      _this12.isTypeSpecifier = {
        name: json.isType,
        type: 'NamedTypeSpecifier'
      };
    }

    return _this12;
  }

  _createClass(Is, [{
    key: "exec",
    value: function exec(ctx) {
      var arg = this.execArgs(ctx);

      if (arg === null) {
        return false;
      }

      if (typeof arg._is !== 'function' && !isSystemType(this.isTypeSpecifier)) {
        // We need an _is implementation in order to check non System types
        throw new Error("Patient Source does not support Is operation for localId: ".concat(this.localId));
      }

      return ctx.matchesTypeSpecifier(arg, this.isTypeSpecifier);
    }
  }]);

  return Is;
}(Expression);

function isSystemType(spec) {
  switch (spec.type) {
    case 'NamedTypeSpecifier':
      return spec.name.startsWith('{urn:hl7-org:elm-types:r1}');

    case 'ListTypeSpecifier':
      return isSystemType(spec.elementType);

    case 'TupleTypeSpecifier':
      return spec.element.every(function (e) {
        return isSystemType(e.elementType);
      });

    case 'IntervalTypeSpecifier':
      return isSystemType(spec.pointType);

    case 'ChoiceTypeSpecifier':
      return spec.choice.every(function (c) {
        return isSystemType(c);
      });

    default:
      return false;
  }
}

var IntervalTypeSpecifier = /*#__PURE__*/function (_UnimplementedExpress) {
  _inherits(IntervalTypeSpecifier, _UnimplementedExpress);

  var _super25 = _createSuper(IntervalTypeSpecifier);

  function IntervalTypeSpecifier() {
    _classCallCheck(this, IntervalTypeSpecifier);

    return _super25.apply(this, arguments);
  }

  return IntervalTypeSpecifier;
}(UnimplementedExpression);

var ListTypeSpecifier = /*#__PURE__*/function (_UnimplementedExpress2) {
  _inherits(ListTypeSpecifier, _UnimplementedExpress2);

  var _super26 = _createSuper(ListTypeSpecifier);

  function ListTypeSpecifier() {
    _classCallCheck(this, ListTypeSpecifier);

    return _super26.apply(this, arguments);
  }

  return ListTypeSpecifier;
}(UnimplementedExpression);

var NamedTypeSpecifier = /*#__PURE__*/function (_UnimplementedExpress3) {
  _inherits(NamedTypeSpecifier, _UnimplementedExpress3);

  var _super27 = _createSuper(NamedTypeSpecifier);

  function NamedTypeSpecifier() {
    _classCallCheck(this, NamedTypeSpecifier);

    return _super27.apply(this, arguments);
  }

  return NamedTypeSpecifier;
}(UnimplementedExpression);

var TupleTypeSpecifier = /*#__PURE__*/function (_UnimplementedExpress4) {
  _inherits(TupleTypeSpecifier, _UnimplementedExpress4);

  var _super28 = _createSuper(TupleTypeSpecifier);

  function TupleTypeSpecifier() {
    _classCallCheck(this, TupleTypeSpecifier);

    return _super28.apply(this, arguments);
  }

  return TupleTypeSpecifier;
}(UnimplementedExpression);

module.exports = {
  As: As,
  CanConvertQuantity: CanConvertQuantity,
  Convert: Convert,
  ConvertQuantity: ConvertQuantity,
  ConvertsToBoolean: ConvertsToBoolean,
  ConvertsToDate: ConvertsToDate,
  ConvertsToDateTime: ConvertsToDateTime,
  ConvertsToDecimal: ConvertsToDecimal,
  ConvertsToInteger: ConvertsToInteger,
  ConvertsToQuantity: ConvertsToQuantity,
  ConvertsToRatio: ConvertsToRatio,
  ConvertsToString: ConvertsToString,
  ConvertsToTime: ConvertsToTime,
  IntervalTypeSpecifier: IntervalTypeSpecifier,
  Is: Is,
  ListTypeSpecifier: ListTypeSpecifier,
  NamedTypeSpecifier: NamedTypeSpecifier,
  ToBoolean: ToBoolean,
  ToConcept: ToConcept,
  ToDate: ToDate,
  ToDateTime: ToDateTime,
  ToDecimal: ToDecimal,
  ToInteger: ToInteger,
  ToQuantity: ToQuantity,
  ToRatio: ToRatio,
  ToString: ToString,
  ToTime: ToTime,
  TupleTypeSpecifier: TupleTypeSpecifier
};
},{"../datatypes/clinical":5,"../datatypes/datetime":7,"../datatypes/quantity":11,"../datatypes/ratio":12,"../util/math":46,"../util/util":47,"./expression":22}],41:[function(require,module,exports){
"use strict";

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../datatypes/exception'),
    Exception = _require.Exception;

var _require2 = require('../util/util'),
    typeIsArray = _require2.typeIsArray;

var dt = require('../datatypes/datatypes');

var Context = /*#__PURE__*/function () {
  function Context(parent) {
    var _codeService = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var _parameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Context);

    this.parent = parent;
    this._codeService = _codeService;
    this.context_values = {};
    this.library_context = {};
    this.localId_context = {};
    this.evaluatedRecords = []; // TODO: If there is an issue with number of parameters look into cql4browsers fix: 387ea77538182833283af65e6341e7a05192304c

    this.checkParameters(_parameters); // not crazy about possibly throwing an error in a constructor, but...

    this._parameters = _parameters;
  }

  _createClass(Context, [{
    key: "withParameters",
    value: function withParameters(params) {
      this.parameters = params || {};
      return this;
    }
  }, {
    key: "withCodeService",
    value: function withCodeService(cs) {
      this.codeService = cs;
      return this;
    }
  }, {
    key: "rootContext",
    value: function rootContext() {
      if (this.parent) {
        return this.parent.rootContext();
      } else {
        return this;
      }
    }
  }, {
    key: "findRecords",
    value: function findRecords(profile) {
      return this.parent && this.parent.findRecords(profile);
    }
  }, {
    key: "childContext",
    value: function childContext() {
      var context_values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var ctx = new Context(this);
      ctx.context_values = context_values;
      return ctx;
    }
  }, {
    key: "getLibraryContext",
    value: function getLibraryContext(library) {
      return this.parent && this.parent.getLibraryContext(library);
    }
  }, {
    key: "getLocalIdContext",
    value: function getLocalIdContext(localId) {
      return this.parent && this.parent.getLocalIdContext(localId);
    }
  }, {
    key: "getParameter",
    value: function getParameter(name) {
      return this.parent && this.parent.getParameter(name);
    }
  }, {
    key: "getParentParameter",
    value: function getParentParameter(name) {
      if (this.parent) {
        if (this.parent.parameters[name] != null) {
          return this.parent.parameters[name];
        } else {
          return this.parent.getParentParameter(name);
        }
      }
    }
  }, {
    key: "getTimezoneOffset",
    value: function getTimezoneOffset() {
      if (this.executionDateTime != null) {
        return this.executionDateTime.timezoneOffset;
      } else if (this.parent && this.parent.getTimezoneOffset != null) {
        return this.parent.getTimezoneOffset();
      } else {
        throw new Exception('No Timezone Offset has been set');
      }
    }
  }, {
    key: "getExecutionDateTime",
    value: function getExecutionDateTime() {
      if (this.executionDateTime != null) {
        return this.executionDateTime;
      } else if (this.parent && this.parent.getExecutionDateTime != null) {
        return this.parent.getExecutionDateTime();
      } else {
        throw new Exception('No Execution DateTime has been set');
      }
    }
  }, {
    key: "getValueSet",
    value: function getValueSet(name, library) {
      return this.parent && this.parent.getValueSet(name, library);
    }
  }, {
    key: "getCodeSystem",
    value: function getCodeSystem(name) {
      return this.parent && this.parent.getCodeSystem(name);
    }
  }, {
    key: "getCode",
    value: function getCode(name) {
      return this.parent && this.parent.getCode(name);
    }
  }, {
    key: "getConcept",
    value: function getConcept(name) {
      return this.parent && this.parent.getConcept(name);
    }
  }, {
    key: "get",
    value: function get(identifier) {
      // Check for undefined because if its null, we actually *do* want to return null (rather than
      // looking at parent), but if it's really undefined, *then* look at the parent
      if (typeof this.context_values[identifier] !== 'undefined') {
        return this.context_values[identifier];
      } else if (identifier === '$this') {
        return this.context_values;
      } else {
        return this.parent != null && this.parent.get(identifier);
      }
    }
  }, {
    key: "set",
    value: function set(identifier, value) {
      this.context_values[identifier] = value;
    }
  }, {
    key: "setLocalIdWithResult",
    value: function setLocalIdWithResult(localId, value) {
      // Temporary fix. Real fix will be to return a list of all result values for a given localId.
      var ctx = this.localId_context[localId];

      if (ctx === false || ctx === null || ctx === undefined || ctx.length === 0) {
        this.localId_context[localId] = value;
      }
    }
  }, {
    key: "getLocalIdResult",
    value: function getLocalIdResult(localId) {
      return this.localId_context[localId];
    } // Returns an object of objects containing each library name
    // with the localIds and result values

  }, {
    key: "getAllLocalIds",
    value: function getAllLocalIds() {
      var localIdResults = {}; // Add the localIds and result values from the main library

      localIdResults[this.parent.source.library.identifier.id] = {};
      localIdResults[this.parent.source.library.identifier.id] = this.localId_context; // Iterate over support libraries and store localIds

      for (var libName in this.library_context) {
        var lib = this.library_context[libName];
        this.supportLibraryLocalIds(lib, localIdResults);
      }

      return localIdResults;
    } // Recursive function that will grab nested support library localId results

  }, {
    key: "supportLibraryLocalIds",
    value: function supportLibraryLocalIds(lib, localIdResults) {
      var _this = this;

      // Set library identifier name as the key and the object of localIds with their results as the value
      // if it already exists then we need to merge the results instead of overwriting
      if (localIdResults[lib.library.source.library.identifier.id] != null) {
        this.mergeLibraryLocalIdResults(localIdResults, lib.library.source.library.identifier.id, lib.localId_context);
      } else {
        localIdResults[lib.library.source.library.identifier.id] = lib.localId_context;
      } // Iterate over any support libraries in the current support library


      Object.values(lib.library_context).forEach(function (supportLib) {
        _this.supportLibraryLocalIds(supportLib, localIdResults);
      });
    } // Merges the localId results for a library into the already collected results. The logic used for which result
    // to keep is the same as the logic used above in setLocalIdWithResult, "falsey" results are always replaced.

  }, {
    key: "mergeLibraryLocalIdResults",
    value: function mergeLibraryLocalIdResults(localIdResults, libraryId, libraryResults) {
      for (var localId in libraryResults) {
        var localIdResult = libraryResults[localId];
        var existingResult = localIdResults[libraryId][localId]; // overwite this localid result if the existing result is "falsey". future work could track all results for each localid

        if (existingResult === false || existingResult === null || existingResult === undefined || existingResult.length === 0) {
          localIdResults[libraryId][localId] = localIdResult;
        }
      }
    }
  }, {
    key: "checkParameters",
    value: function checkParameters(params) {
      for (var pName in params) {
        var pVal = params[pName];
        var pDef = this.getParameter(pName);

        if (pVal == null) {
          return; // Null can theoretically be any type
        }

        if (typeof pDef === 'undefined') {
          return; // This will happen if the parameter is declared in a different (included) library
        } else if (pDef.parameterTypeSpecifier != null && !this.matchesTypeSpecifier(pVal, pDef.parameterTypeSpecifier)) {
          throw new Error("Passed in parameter '".concat(pName, "' is wrong type"));
        } else if (pDef['default'] != null && !this.matchesInstanceType(pVal, pDef['default'])) {
          throw new Error("Passed in parameter '".concat(pName, "' is wrong type"));
        }
      }

      return true;
    }
  }, {
    key: "matchesTypeSpecifier",
    value: function matchesTypeSpecifier(val, spec) {
      switch (spec.type) {
        case 'NamedTypeSpecifier':
          return this.matchesNamedTypeSpecifier(val, spec);

        case 'ListTypeSpecifier':
          return this.matchesListTypeSpecifier(val, spec);

        case 'TupleTypeSpecifier':
          return this.matchesTupleTypeSpecifier(val, spec);

        case 'IntervalTypeSpecifier':
          return this.matchesIntervalTypeSpecifier(val, spec);

        case 'ChoiceTypeSpecifier':
          return this.matchesChoiceTypeSpecifier(val, spec);

        default:
          return true;
        // default to true when we don't know
      }
    }
  }, {
    key: "matchesListTypeSpecifier",
    value: function matchesListTypeSpecifier(val, spec) {
      var _this2 = this;

      return typeIsArray(val) && val.every(function (x) {
        return _this2.matchesTypeSpecifier(x, spec.elementType);
      });
    }
  }, {
    key: "matchesTupleTypeSpecifier",
    value: function matchesTupleTypeSpecifier(val, spec) {
      var _this3 = this;

      return _typeof(val) === 'object' && !typeIsArray(val) && spec.element.every(function (x) {
        return typeof val[x.name] === 'undefined' || _this3.matchesTypeSpecifier(val[x.name], x.elementType);
      });
    }
  }, {
    key: "matchesIntervalTypeSpecifier",
    value: function matchesIntervalTypeSpecifier(val, spec) {
      return val.isInterval && (val.low == null || this.matchesTypeSpecifier(val.low, spec.pointType)) && (val.high == null || this.matchesTypeSpecifier(val.high, spec.pointType));
    }
  }, {
    key: "matchesChoiceTypeSpecifier",
    value: function matchesChoiceTypeSpecifier(val, spec) {
      var _this4 = this;

      return spec.choice.some(function (c) {
        return _this4.matchesTypeSpecifier(val, c);
      });
    }
  }, {
    key: "matchesNamedTypeSpecifier",
    value: function matchesNamedTypeSpecifier(val, spec) {
      if (val == null) {
        return true;
      }

      switch (spec.name) {
        case '{urn:hl7-org:elm-types:r1}Boolean':
          return typeof val === 'boolean';

        case '{urn:hl7-org:elm-types:r1}Decimal':
          return typeof val === 'number';

        case '{urn:hl7-org:elm-types:r1}Integer':
          return typeof val === 'number' && Math.floor(val) === val;

        case '{urn:hl7-org:elm-types:r1}String':
          return typeof val === 'string';

        case '{urn:hl7-org:elm-types:r1}Concept':
          return val && val.isConcept;

        case '{urn:hl7-org:elm-types:r1}Code':
          return val && val.isCode;

        case '{urn:hl7-org:elm-types:r1}DateTime':
          return val && val.isDateTime;

        case '{urn:hl7-org:elm-types:r1}Date':
          return val && val.isDate;

        case '{urn:hl7-org:elm-types:r1}Quantity':
          return val && val.isQuantity;

        case '{urn:hl7-org:elm-types:r1}Time':
          return val && val.isDateTime && val.isTime();

        default:
          // Use the data model's implementation of _is, if it is available
          if (typeof val._is === 'function') {
            return val._is(spec);
          } // otherwise just default to true


          return true;
      }
    }
  }, {
    key: "matchesInstanceType",
    value: function matchesInstanceType(val, inst) {
      switch (false) {
        case !inst.isBooleanLiteral:
          return typeof val === 'boolean';

        case !inst.isDecimalLiteral:
          return typeof val === 'number';

        case !inst.isIntegerLiteral:
          return typeof val === 'number' && Math.floor(val) === val;

        case !inst.isStringLiteral:
          return typeof val === 'string';

        case !inst.isCode:
          return val && val.isCode;

        case !inst.isConcept:
          return val && val.isConcept;

        case !inst.isDateTime:
          return val && val.isDateTime;

        case !inst.isQuantity:
          return val && val.isQuantity;

        case !inst.isTime:
          return val && val.isDateTime && val.isTime();

        case !inst.isList:
          return this.matchesListInstanceType(val, inst);

        case !inst.isTuple:
          return this.matchesTupleInstanceType(val, inst);

        case !inst.isInterval:
          return this.matchesIntervalInstanceType(val, inst);

        default:
          return true;
        // default to true when we don't know for sure
      }
    }
  }, {
    key: "matchesListInstanceType",
    value: function matchesListInstanceType(val, list) {
      var _this5 = this;

      return typeIsArray(val) && val.every(function (x) {
        return _this5.matchesInstanceType(x, list.elements[0]);
      });
    }
  }, {
    key: "matchesTupleInstanceType",
    value: function matchesTupleInstanceType(val, tpl) {
      var _this6 = this;

      return _typeof(val) === 'object' && !typeIsArray(val) && tpl.elements.every(function (x) {
        return typeof val[x.name] === 'undefined' || _this6.matchesInstanceType(val[x.name], x.value);
      });
    }
  }, {
    key: "matchesIntervalInstanceType",
    value: function matchesIntervalInstanceType(val, ivl) {
      var pointType = ivl.low != null ? ivl.low : ivl.high;
      return val.isInterval && (val.low == null || this.matchesInstanceType(val.low, pointType)) && (val.high == null || this.matchesInstanceType(val.high, pointType));
    }
  }, {
    key: "parameters",
    get: function get() {
      return this._parameters || this.parent && this.parent.parameters;
    },
    set: function set(params) {
      this.checkParameters(params);
      this._parameters = params;
    }
  }, {
    key: "codeService",
    get: function get() {
      return this._codeService || this.parent && this.parent.codeService;
    },
    set: function set(cs) {
      this._codeService = cs;
    }
  }]);

  return Context;
}();

var PatientContext = /*#__PURE__*/function (_Context) {
  _inherits(PatientContext, _Context);

  var _super = _createSuper(PatientContext);

  function PatientContext(library, patient, codeService, parameters) {
    var _this7;

    var executionDateTime = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : dt.DateTime.fromJSDate(new Date());

    _classCallCheck(this, PatientContext);

    _this7 = _super.call(this, library, codeService, parameters);
    _this7.library = library;
    _this7.patient = patient;
    _this7.executionDateTime = executionDateTime;
    return _this7;
  }

  _createClass(PatientContext, [{
    key: "rootContext",
    value: function rootContext() {
      return this;
    }
  }, {
    key: "getLibraryContext",
    value: function getLibraryContext(library) {
      if (this.library_context[library] == null) {
        this.library_context[library] = new PatientContext(this.get(library), this.patient, this.codeService, this.parameters, this.executionDateTime);
      }

      return this.library_context[library];
    }
  }, {
    key: "getLocalIdContext",
    value: function getLocalIdContext(localId) {
      if (this.localId_context[localId] == null) {
        this.localId_context[localId] = new PatientContext(this.get(localId), this.patient, this.codeService, this.parameters, this.executionDateTime);
      }

      return this.localId_context[localId];
    }
  }, {
    key: "findRecords",
    value: function findRecords(profile) {
      return this.patient && this.patient.findRecords(profile);
    }
  }]);

  return PatientContext;
}(Context);

var UnfilteredContext = /*#__PURE__*/function (_Context2) {
  _inherits(UnfilteredContext, _Context2);

  var _super2 = _createSuper(UnfilteredContext);

  function UnfilteredContext(library, results, codeService, parameters) {
    var _this8;

    var executionDateTime = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : dt.DateTime.fromJSDate(new Date());

    _classCallCheck(this, UnfilteredContext);

    _this8 = _super2.call(this, library, codeService, parameters);
    _this8.library = library;
    _this8.results = results;
    _this8.executionDateTime = executionDateTime;
    return _this8;
  }

  _createClass(UnfilteredContext, [{
    key: "rootContext",
    value: function rootContext() {
      return this;
    }
  }, {
    key: "findRecords",
    value: function findRecords(template) {
      throw new Exception('Retreives are not currently supported in Unfiltered Context');
    }
  }, {
    key: "getLibraryContext",
    value: function getLibraryContext(library) {
      throw new Exception('Library expressions are not currently supported in Unfiltered Context');
    }
  }, {
    key: "get",
    value: function get(identifier) {
      //First check to see if the identifier is a unfiltered context expression that has already been cached
      if (this.context_values[identifier]) {
        return this.context_values[identifier];
      } //if not look to see if the library has a unfiltered expression of that identifier


      if (this.library[identifier] && this.library[identifier].context === 'Unfiltered') {
        return this.library.expressions[identifier];
      } //lastley attempt to gather all patient level results that have that identifier
      // should this compact null values before return ?


      return Object.values(this.results.patientResults).map(function (pr) {
        return pr[identifier];
      });
    }
  }]);

  return UnfilteredContext;
}(Context);

module.exports = {
  Context: Context,
  PatientContext: PatientContext,
  UnfilteredContext: UnfilteredContext
};
},{"../datatypes/datatypes":6,"../datatypes/exception":8,"../util/util":47}],42:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./results'),
    Results = _require.Results;

var _require2 = require('./context'),
    UnfilteredContext = _require2.UnfilteredContext,
    PatientContext = _require2.PatientContext;

var Executor = /*#__PURE__*/function () {
  function Executor(library, codeService, parameters) {
    _classCallCheck(this, Executor);

    this.library = library;
    this.codeService = codeService;
    this.parameters = parameters;
  }

  _createClass(Executor, [{
    key: "withLibrary",
    value: function withLibrary(lib) {
      this.library = lib;
      return this;
    }
  }, {
    key: "withParameters",
    value: function withParameters(params) {
      this.parameters = params != null ? params : {};
      return this;
    }
  }, {
    key: "withCodeService",
    value: function withCodeService(cs) {
      this.codeService = cs;
      return this;
    }
  }, {
    key: "exec_expression",
    value: function exec_expression(expression, patientSource) {
      var r = new Results();
      var expr = this.library.expressions[expression];

      if (expr != null) {
        while (patientSource.currentPatient()) {
          var patient_ctx = new PatientContext(this.library, patientSource.currentPatient(), this.codeService, this.parameters);
          r.recordPatientResult(patient_ctx, expression, expr.execute(patient_ctx));
          patientSource.nextPatient();
        }
      }

      return r;
    }
  }, {
    key: "exec",
    value: function exec(patientSource, executionDateTime) {
      var r = this.exec_patient_context(patientSource, executionDateTime);
      var unfilteredContext = new UnfilteredContext(this.library, r, this.codeService, this.parameters);

      for (var key in this.library.expressions) {
        var expr = this.library.expressions[key];

        if (expr.context === 'Unfiltered') {
          r.recordUnfilteredResult(key, expr.exec(unfilteredContext));
        }
      }

      return r;
    }
  }, {
    key: "exec_patient_context",
    value: function exec_patient_context(patientSource, executionDateTime) {
      var r = new Results();

      while (patientSource.currentPatient()) {
        var patient_ctx = new PatientContext(this.library, patientSource.currentPatient(), this.codeService, this.parameters, executionDateTime);

        for (var key in this.library.expressions) {
          var expr = this.library.expressions[key];

          if (expr.context === 'Patient') {
            r.recordPatientResult(patient_ctx, key, expr.execute(patient_ctx));
          }
        }

        patientSource.nextPatient();
      }

      return r;
    }
  }]);

  return Executor;
}();

module.exports = {
  Executor: Executor
};
},{"./context":41,"./results":44}],43:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../elm/library'),
    Library = _require.Library;

var Repository = /*#__PURE__*/function () {
  function Repository(data) {
    _classCallCheck(this, Repository);

    this.data = data;
    this.libraries = Array.from(Object.values(data));
  }

  _createClass(Repository, [{
    key: "resolve",
    value: function resolve(library, version) {
      var _iterator = _createForOfIteratorHelper(this.libraries),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var lib = _step.value;

          if (lib.library && lib.library.identifier) {
            var id = lib.library.identifier;

            if (id.id === library && id.version === version) {
              return new Library(lib, this);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);

  return Repository;
}();

module.exports = {
  Repository: Repository
};
},{"../elm/library":27}],44:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Results = /*#__PURE__*/function () {
  function Results() {
    _classCallCheck(this, Results);

    this.patientResults = {};
    this.unfilteredResults = {};
    this.localIdPatientResultsMap = {};
    this.evaluatedRecords = [];
  }

  _createClass(Results, [{
    key: "recordPatientResult",
    value: function recordPatientResult(patient_ctx, resultName, result) {
      var _this = this;

      var p = patient_ctx.patient; // NOTE: From now on prefer getId() over id() because some data models may have an id property
      // that is not a string (e.g., FHIR) -- so reserve getId() for the API (and expect a string
      // representation) but leave id() for data-model specific formats.

      var patientId = typeof p.getId === 'function' ? p.getId() : p.id();

      if (this.patientResults[patientId] == null) {
        this.patientResults[patientId] = {};
      }

      this.patientResults[patientId][resultName] = result;
      this.localIdPatientResultsMap[patientId] = patient_ctx.getAllLocalIds(); // Merge evaluatedRecords with an aggregated array across all libraries

      this.evaluatedRecords = _toConsumableArray(patient_ctx.evaluatedRecords);
      Object.values(patient_ctx.library_context).forEach(function (ctx) {
        var _this$evaluatedRecord;

        (_this$evaluatedRecord = _this.evaluatedRecords).push.apply(_this$evaluatedRecord, _toConsumableArray(ctx.evaluatedRecords));
      });
    }
  }, {
    key: "recordUnfilteredResult",
    value: function recordUnfilteredResult(resultName, result) {
      this.unfilteredResults[resultName] = result;
    }
  }]);

  return Results;
}();

module.exports = {
  Results: Results
};
},{}],45:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('../datatypes/uncertainty'),
    Uncertainty = _require.Uncertainty;

function areNumbers(a, b) {
  return typeof a === 'number' && typeof b === 'number';
}

function areDateTimesOrQuantities(a, b) {
  return a && a.isDateTime && b && b.isDateTime || a && a.isDate && b && b.isDate || a && a.isTime && b && b.isTime || a && a.isQuantity && b && b.isQuantity;
}

function isUncertainty(x) {
  return x instanceof Uncertainty;
}

function lessThan(a, b, precision) {
  if (areNumbers(a, b)) {
    return a < b;
  } else if (areDateTimesOrQuantities(a, b)) {
    return a.before(b, precision);
  } else if (isUncertainty(a)) {
    return a.lessThan(b);
  } else if (isUncertainty(b)) {
    return Uncertainty.from(a).lessThan(b);
  } else {
    return null;
  }
}

function lessThanOrEquals(a, b, precision) {
  if (areNumbers(a, b)) {
    return a <= b;
  } else if (areDateTimesOrQuantities(a, b)) {
    return a.sameOrBefore(b, precision);
  } else if (isUncertainty(a)) {
    return a.lessThanOrEquals(b);
  } else if (isUncertainty(b)) {
    return Uncertainty.from(a).lessThanOrEquals(b);
  } else {
    return null;
  }
}

function greaterThan(a, b, precision) {
  if (areNumbers(a, b)) {
    return a > b;
  } else if (areDateTimesOrQuantities(a, b)) {
    return a.after(b, precision);
  } else if (isUncertainty(a)) {
    return a.greaterThan(b);
  } else if (isUncertainty(b)) {
    return Uncertainty.from(a).greaterThan(b);
  } else {
    return null;
  }
}

function greaterThanOrEquals(a, b, precision) {
  if (areNumbers(a, b)) {
    return a >= b;
  } else if (areDateTimesOrQuantities(a, b)) {
    return a.sameOrAfter(b, precision);
  } else if (isUncertainty(a)) {
    return a.greaterThanOrEquals(b);
  } else if (isUncertainty(b)) {
    return Uncertainty.from(a).greaterThanOrEquals(b);
  } else {
    return null;
  }
}

function equivalent(a, b) {
  if (a == null && b == null) {
    return true;
  }

  if (a == null || b == null) {
    return false;
  }

  if (isCode(a)) {
    return codesAreEquivalent(a, b);
  } // Use overloaded 'equivalent' function if it is available


  if (typeof a.equivalent === 'function') {
    return a.equivalent(b);
  }

  var _getClassOfObjects = getClassOfObjects(a, b),
      _getClassOfObjects2 = _slicedToArray(_getClassOfObjects, 2),
      aClass = _getClassOfObjects2[0],
      bClass = _getClassOfObjects2[1];

  switch (aClass) {
    case '[object Array]':
      return compareEveryItemInArrays(a, b, equivalent);

    case '[object Object]':
      return compareObjects(a, b, equivalent);

    case '[object String]':
      // Make sure b is also a string
      if (bClass === '[object String]') {
        // String equivalence is case- and locale insensitive
        a = a.replace(/\s/g, ' ');
        b = b.replace(/\s/g, ' ');
        return a.localeCompare(b, 'en', {
          sensitivity: 'base'
        }) === 0;
      }

      break;
  }

  return equals(a, b);
}

function isCode(object) {
  return object.hasMatch && typeof object.hasMatch === 'function';
}

function codesAreEquivalent(code1, code2) {
  return code1.hasMatch(code2);
}

function getClassOfObjects(object1, object2) {
  return [object1, object2].map(function (obj) {
    return {}.toString.call(obj);
  });
}

function compareEveryItemInArrays(array1, array2, comparisonFunction) {
  return array1.length === array2.length && array1.every(function (item, i) {
    return comparisonFunction(item, array2[i]);
  });
}

function compareObjects(a, b, comparisonFunction) {
  if (!classesEqual(a, b)) {
    return false;
  }

  return deepCompareKeysAndValues(a, b, comparisonFunction);
}

function classesEqual(object1, object2) {
  return object2 instanceof object1.constructor && object1 instanceof object2.constructor;
}

function deepCompareKeysAndValues(a, b, comparisonFunction) {
  var finalComparisonResult;
  var aKeys = getKeysFromObject(a).sort();
  var bKeys = getKeysFromObject(b).sort(); // Array.every() will only return true or false, so set a flag for if we should return null

  var shouldReturnNull = false; // Check if both arrays of keys are the same length and key names match

  if (aKeys.length === bKeys.length && aKeys.every(function (value, index) {
    return value === bKeys[index];
  })) {
    finalComparisonResult = aKeys.every(function (key) {
      // if both are null we should return true to satisfy ignoring empty values in tuples
      if (a[key] == null && b[key] == null) {
        return true;
      }

      var comparisonResult = comparisonFunction(a[key], b[key]);

      if (comparisonResult === null) {
        shouldReturnNull = true;
      }

      return comparisonResult;
    });
  } else {
    finalComparisonResult = false;
  }

  if (shouldReturnNull) {
    return null;
  }

  return finalComparisonResult;
}

function getKeysFromObject(object) {
  return Object.keys(object).filter(function (k) {
    return !isFunction(object[k]);
  });
}

function isFunction(input) {
  return input instanceof Function || {}.toString.call(input) === '[object Function]';
}

function equals(a, b) {
  // Handle null cases first: spec says if either is null, return null
  if (a == null || b == null) {
    return null;
  } // If one is a Quantity, use the Quantity equals function


  if (a && a.isQuantity) {
    return a.equals(b);
  } // If one is a Ratio, use the ratio equals function


  if (a && a.isRatio) {
    return a.equals(b);
  } // If one is an Uncertainty, convert the other to an Uncertainty


  if (a instanceof Uncertainty) {
    b = Uncertainty.from(b);
  } else if (b instanceof Uncertainty) {
    a = Uncertainty.from(a);
  } // Use overloaded 'equals' function if it is available


  if (typeof a.equals === 'function') {
    return a.equals(b);
  } // Return true of the objects are primitives and are strictly equal


  if (_typeof(a) === _typeof(b) && typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') {
    return a === b;
  } // Return false if they are instances of different classes


  var _getClassOfObjects3 = getClassOfObjects(a, b),
      _getClassOfObjects4 = _slicedToArray(_getClassOfObjects3, 2),
      aClass = _getClassOfObjects4[0],
      bClass = _getClassOfObjects4[1];

  if (aClass !== bClass) {
    return false;
  }

  switch (aClass) {
    case '[object Date]':
      // Compare the ms since epoch
      return a.getTime() === b.getTime();

    case '[object RegExp]':
      // Compare the components of the regular expression
      return ['source', 'global', 'ignoreCase', 'multiline'].every(function (p) {
        return a[p] === b[p];
      });

    case '[object Array]':
      if (a.indexOf(null) >= 0 || a.indexOf(undefined) >= 0 || b.indexOf(null) >= 0 || b.indexOf(undefined) >= 0) {
        return null;
      }

      return compareEveryItemInArrays(a, b, equals);

    case '[object Object]':
      return compareObjects(a, b, equals);

    case '[object Function]':
      return a.toString() === b.toString();
  } // If we made it this far, we can't handle it


  return false;
}

module.exports = {
  lessThan: lessThan,
  lessThanOrEquals: lessThanOrEquals,
  greaterThan: greaterThan,
  greaterThanOrEquals: greaterThanOrEquals,
  equivalent: equivalent,
  equals: equals
};
},{"../datatypes/uncertainty":13}],46:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('../datatypes/exception'),
    Exception = _require.Exception;

var _require2 = require('../datatypes/datetime'),
    MIN_DATETIME_VALUE = _require2.MIN_DATETIME_VALUE,
    MAX_DATETIME_VALUE = _require2.MAX_DATETIME_VALUE,
    MIN_DATE_VALUE = _require2.MIN_DATE_VALUE,
    MAX_DATE_VALUE = _require2.MAX_DATE_VALUE,
    MIN_TIME_VALUE = _require2.MIN_TIME_VALUE,
    MAX_TIME_VALUE = _require2.MAX_TIME_VALUE;

var _require3 = require('../datatypes/uncertainty'),
    Uncertainty = _require3.Uncertainty;

var MAX_INT_VALUE = Math.pow(2, 31) - 1;
var MIN_INT_VALUE = Math.pow(-2, 31);
var MAX_FLOAT_VALUE = 99999999999999999999999999999.99999999;
var MIN_FLOAT_VALUE = -99999999999999999999999999999.99999999;
var MIN_FLOAT_PRECISION_VALUE = Math.pow(10, -8);

function overflowsOrUnderflows(value) {
  if (value == null) {
    return false;
  }

  if (value.isQuantity) {
    if (!isValidDecimal(value.value)) {
      return true;
    }
  } else if (value.isTime != null && value.isTime()) {
    if (value.after(MAX_TIME_VALUE)) {
      return true;
    }

    if (value.before(MIN_TIME_VALUE)) {
      return true;
    }
  } else if (value.isDateTime) {
    if (value.after(MAX_DATETIME_VALUE)) {
      return true;
    }

    if (value.before(MIN_DATETIME_VALUE)) {
      return true;
    }
  } else if (value.isDate) {
    if (value.after(MAX_DATE_VALUE)) {
      return true;
    }

    if (value.before(MIN_DATE_VALUE)) {
      return true;
    }
  } else if (Number.isInteger(value)) {
    if (!isValidInteger(value)) {
      return true;
    }
  } else {
    if (!isValidDecimal(value)) {
      return true;
    }
  }

  return false;
}

function isValidInteger(integer) {
  if (isNaN(integer)) {
    return false;
  }

  if (integer > MAX_INT_VALUE) {
    return false;
  }

  if (integer < MIN_INT_VALUE) {
    return false;
  }

  return true;
}

function isValidDecimal(decimal) {
  if (isNaN(decimal)) {
    return false;
  }

  if (decimal > MAX_FLOAT_VALUE) {
    return false;
  }

  if (decimal < MIN_FLOAT_VALUE) {
    return false;
  }

  return true;
}

function limitDecimalPrecision(decimal) {
  var decimalString = decimal.toString(); // For decimals so large that they are represented in scientific notation, javascript has already limited
  // the decimal to its own constraints, so we can't determine the original precision.  Leave as-is unless
  // this becomes problematic, in which case we would need our own parseFloat.

  if (decimalString.indexOf('e') !== -1) {
    return decimal;
  }

  var splitDecimalString = decimalString.split('.');
  var decimalPoints = splitDecimalString[1];

  if (decimalPoints != null && decimalPoints.length > 8) {
    decimalString = splitDecimalString[0] + '.' + splitDecimalString[1].substring(0, 8);
  }

  return parseFloat(decimalString);
}

var OverFlowException = /*#__PURE__*/function (_Exception) {
  _inherits(OverFlowException, _Exception);

  var _super = _createSuper(OverFlowException);

  function OverFlowException() {
    _classCallCheck(this, OverFlowException);

    return _super.apply(this, arguments);
  }

  return OverFlowException;
}(Exception);

function successor(val) {
  if (typeof val === 'number') {
    if (parseInt(val) === val) {
      if (val === MAX_INT_VALUE) {
        throw new OverFlowException();
      } else {
        return val + 1;
      }
    } else {
      if (val === MAX_FLOAT_VALUE) {
        throw new OverFlowException();
      } else {
        return val + MIN_FLOAT_PRECISION_VALUE;
      }
    }
  } else if (val && val.isDateTime) {
    if (val.sameAs(MAX_DATETIME_VALUE)) {
      throw new OverFlowException();
    } else {
      return val.successor();
    }
  } else if (val && val.isDate) {
    if (val.sameAs(MAX_DATE_VALUE)) {
      throw new OverFlowException();
    } else {
      return val.successor();
    }
  } else if (val && val.isTime) {
    if (val.sameAs(MAX_TIME_VALUE)) {
      throw new OverFlowException();
    } else {
      return val.successor();
    }
  } else if (val && val.isUncertainty) {
    // For uncertainties, if the high is the max val, don't increment it
    var high = function () {
      try {
        return successor(val.high);
      } catch (e) {
        return val.high;
      }
    }();

    return new Uncertainty(successor(val.low), high);
  } else if (val && val.isQuantity) {
    var succ = val.clone();
    succ.value = successor(val.value);
    return succ;
  } else if (val == null) {
    return null;
  }
}

function predecessor(val) {
  if (typeof val === 'number') {
    if (parseInt(val) === val) {
      if (val === MIN_INT_VALUE) {
        throw new OverFlowException();
      } else {
        return val - 1;
      }
    } else {
      if (val === MIN_FLOAT_VALUE) {
        throw new OverFlowException();
      } else {
        return val - MIN_FLOAT_PRECISION_VALUE;
      }
    }
  } else if (val && val.isDateTime) {
    if (val.sameAs(MIN_DATETIME_VALUE)) {
      throw new OverFlowException();
    } else {
      return val.predecessor();
    }
  } else if (val && val.isDate) {
    if (val.sameAs(MIN_DATE_VALUE)) {
      throw new OverFlowException();
    } else {
      return val.predecessor();
    }
  } else if (val && val.isTime) {
    if (val.sameAs(MIN_TIME_VALUE)) {
      throw new OverFlowException();
    } else {
      return val.predecessor();
    }
  } else if (val && val.isUncertainty) {
    // For uncertainties, if the low is the min val, don't decrement it
    var low = function () {
      try {
        return predecessor(val.low);
      } catch (e) {
        return val.low;
      }
    }();

    return new Uncertainty(low, predecessor(val.high));
  } else if (val && val.isQuantity) {
    var pred = val.clone();
    pred.value = predecessor(val.value);
    return pred;
  } else if (val == null) {
    return null;
  }
}

function maxValueForInstance(val) {
  if (typeof val === 'number') {
    if (parseInt(val) === val) {
      return MAX_INT_VALUE;
    } else {
      return MAX_FLOAT_VALUE;
    }
  } else if (val && val.isDateTime) {
    return MAX_DATETIME_VALUE.copy();
  } else if (val && val.isDate) {
    return MAX_DATE_VALUE.copy();
  } else if (val && val.isTime) {
    return MAX_TIME_VALUE.copy();
  } else if (val && val.isQuantity) {
    var val2 = val.clone();
    val2.value = maxValueForInstance(val2.value);
    return val2;
  } else {
    return null;
  }
}

function minValueForInstance(val) {
  if (typeof val === 'number') {
    if (parseInt(val) === val) {
      return MIN_INT_VALUE;
    } else {
      return MIN_FLOAT_VALUE;
    }
  } else if (val && val.isDateTime) {
    return MIN_DATETIME_VALUE.copy();
  } else if (val && val.isDate) {
    return MIN_DATE_VALUE.copy();
  } else if (val && val.isTime) {
    return MIN_TIME_VALUE.copy();
  } else if (val && val.isQuantity) {
    var val2 = val.clone();
    val2.value = minValueForInstance(val2.value);
    return val2;
  } else {
    return null;
  }
}

function decimalAdjust(type, value, exp) {
  //If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }

  value = +value;
  exp = +exp; //If the value is not a number or the exp is not an integer...

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  } //Shift


  value = value.toString().split('e');
  var v = value[1] ? +value[1] - exp : -exp;
  value = Math[type](+(value[0] + 'e' + v)); //Shift back

  value = value.toString().split('e');
  v = value[1] ? +value[1] + exp : exp;
  return +(value[0] + 'e' + v);
}

module.exports = {
  MAX_INT_VALUE: MAX_INT_VALUE,
  MIN_INT_VALUE: MIN_INT_VALUE,
  MAX_FLOAT_VALUE: MAX_FLOAT_VALUE,
  MIN_FLOAT_VALUE: MIN_FLOAT_VALUE,
  MIN_FLOAT_PRECISION_VALUE: MIN_FLOAT_PRECISION_VALUE,
  MIN_DATETIME_VALUE: MIN_DATETIME_VALUE,
  MAX_DATETIME_VALUE: MAX_DATETIME_VALUE,
  MIN_DATE_VALUE: MIN_DATE_VALUE,
  MAX_DATE_VALUE: MAX_DATE_VALUE,
  MIN_TIME_VALUE: MIN_TIME_VALUE,
  MAX_TIME_VALUE: MAX_TIME_VALUE,
  overflowsOrUnderflows: overflowsOrUnderflows,
  isValidInteger: isValidInteger,
  isValidDecimal: isValidDecimal,
  limitDecimalPrecision: limitDecimalPrecision,
  OverFlowException: OverFlowException,
  successor: successor,
  predecessor: predecessor,
  maxValueForInstance: maxValueForInstance,
  minValueForInstance: minValueForInstance,
  decimalAdjust: decimalAdjust
};
},{"../datatypes/datetime":7,"../datatypes/exception":8,"../datatypes/uncertainty":13}],47:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function removeNulls(things) {
  return things.filter(function (x) {
    return x != null;
  });
}

function numerical_sort(things, direction) {
  return things.sort(function (a, b) {
    if (direction == null || direction === 'asc') {
      return a - b;
    } else {
      return b - a;
    }
  });
}

function isNull(value) {
  return value === null;
}

var typeIsArray = Array.isArray || function (value) {
  return {}.toString.call(value) === '[object Array]';
};

function allTrue(things) {
  if (typeIsArray(things)) {
    return things.every(function (x) {
      return x;
    });
  } else {
    return things;
  }
}

function anyTrue(things) {
  if (typeIsArray(things)) {
    return things.some(function (x) {
      return x;
    });
  } else {
    return things;
  }
} //The export below is to make it easier if js Date is overwritten with CQL Date


var jsDate = Date;

function normalizeMillisecondsFieldInString(string, msString) {
  // TODO: verify we are only removing numeral digits
  var timezoneField;
  msString = normalizeMillisecondsField(msString);

  var _string$split = string.split('.'),
      _string$split2 = _slicedToArray(_string$split, 2),
      beforeMs = _string$split2[0],
      msAndAfter = _string$split2[1];

  var timezoneSeparator = getTimezoneSeparatorFromString(msAndAfter);

  if (timezoneSeparator) {
    timezoneField = msAndAfter != null ? msAndAfter.split(timezoneSeparator)[1] : undefined;
  }

  if (timezoneField == null) {
    timezoneField = '';
  }

  return string = beforeMs + '.' + msString + timezoneSeparator + timezoneField;
}

function normalizeMillisecondsField(msString) {
  // fix up milliseconds by padding zeros and/or truncating (5 --> 500, 50 --> 500, 54321 --> 543, etc.)
  return msString = (msString + '00').substring(0, 3);
}

function getTimezoneSeparatorFromString(string) {
  if (string != null) {
    var matches = string.match(/-/);

    if (matches && matches.length === 1) {
      return '-';
    }

    matches = string.match(/\+/);

    if (matches && matches.length === 1) {
      return '+';
    }
  }

  return '';
}

module.exports = {
  removeNulls: removeNulls,
  numerical_sort: numerical_sort,
  isNull: isNull,
  typeIsArray: typeIsArray,
  allTrue: allTrue,
  anyTrue: anyTrue,
  jsDate: jsDate,
  normalizeMillisecondsFieldInString: normalizeMillisecondsFieldInString,
  normalizeMillisecondsField: normalizeMillisecondsField,
  getTimezoneSeparatorFromString: getTimezoneSeparatorFromString
};
},{}],48:[function(require,module,exports){
//! moment.js
//! version : 2.27.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return (
            input instanceof Array ||
            Object.prototype.toString.call(input) === '[object Array]'
        );
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            Object.prototype.toString.call(input) === '[object Object]'
        );
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return (
            typeof input === 'number' ||
            Object.prototype.toString.call(input) === '[object Number]'
        );
    }

    function isDate(input) {
        return (
            input instanceof Date ||
            Object.prototype.toString.call(input) === '[object Date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false,
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m),
                parsedParts = some.call(flags.parsedDateParts, function (i) {
                    return i != null;
                }),
                isNowValid =
                    !isNaN(m._d.getTime()) &&
                    flags.overflow < 0 &&
                    !flags.empty &&
                    !flags.invalidEra &&
                    !flags.invalidMonth &&
                    !flags.invalidWeekday &&
                    !flags.weekdayMismatch &&
                    !flags.nullInput &&
                    !flags.invalidFormat &&
                    !flags.userInvalidated &&
                    (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid =
                    isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = (hooks.momentProperties = []),
        updateInProgress = false;

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return (
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [],
                    arg,
                    i,
                    key;
                for (i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasOwnProp(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\nArguments: ' +
                        Array.prototype.slice.call(args).join('') +
                        '\n' +
                        new Error().stack
                );
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return (
            (typeof Function !== 'undefined' && input instanceof Function) ||
            Object.prototype.toString.call(input) === '[object Function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasOwnProp(config, i)) {
                prop = config[i];
                if (isFunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (
                hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (
            (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
            absNumber
        );
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        formatFunctions = {},
        formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] =
            formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(
                localFormattingTokens,
                replaceLongDateFormatTokens
            );
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper
            .match(formattingTokens)
            .map(function (tok) {
                if (
                    tok === 'MMMM' ||
                    tok === 'MM' ||
                    tok === 'DD' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d',
        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output)
            ? output(number, withoutSuffix, string, isFuture)
            : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.toLowerCase()]
            : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [],
            u;
        for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid()
            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
            : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (
                unit === 'FullYear' &&
                isLeapYear(mom.year()) &&
                mom.month() === 1 &&
                mom.date() === 29
            ) {
                value = toInt(value);
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                    value,
                    mom.month(),
                    daysInMonth(value, mom.month())
                );
            } else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i;
            for (i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchUnsigned = /\d+/, //       0 - inf
        matchSigned = /[+-]?\d+/, //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
        regexes;

    regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex)
            ? regex
            : function (isStrict, localeData) {
                  return isStrict && strictRegex ? strictRegex : regex;
              };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(
            s
                .replace('\\', '')
                .replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (
                    matched,
                    p1,
                    p2,
                    p3,
                    p4
                ) {
                    return p1 || p2 || p3 || p4;
                })
        );
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,
        WEEK = 7,
        WEEKDAY = 8;

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1
            ? isLeapYear(year)
                ? 29
                : 28
            : 31 - ((modMonth % 7) % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
            '_'
        ),
        defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split(
            '_'
        ),
        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        defaultMonthsShortRegex = matchWord,
        defaultMonthsRegex = matchWord;

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isArray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort)
            ? this._monthsShort[m.month()]
            : this._monthsShort[
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortMonthsParse[i] = new RegExp(
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsParse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'MMMM' &&
                this._longMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'MMM' &&
                this._shortMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict
                ? this._monthsShortStrictRegex
                : this._monthsShortRegex;
        }
    }

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict
                ? this._monthsStrictRegex
                : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._monthsShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] =
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate(y) {
        var date, args;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear,
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear,
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
            '_'
        ),
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        defaultWeekdaysRegex = matchWord,
        defaultWeekdaysShortRegex = matchWord,
        defaultWeekdaysMinRegex = matchWord;

    function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isFormat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftWeekdays(weekdays, this._week.dow)
            : m
            ? weekdays[m.day()]
            : weekdays;
    }

    function localeWeekdaysShort(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : m
            ? this._weekdaysShort[m.day()]
            : this._weekdaysShort;
    }

    function localeWeekdaysMin(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : m
            ? this._weekdaysMin[m.day()]
            : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysParse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysShort(mom, '') +
                    '|^' +
                    this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict
                ? this._weekdaysStrictRegex
                : this._weekdaysRegex;
        }
    }

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict
                ? this._weekdaysShortStrictRegex
                : this._weekdaysShortRegex;
        }
    }

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict
                ? this._weekdaysMinStrictRegex
                : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._weekdaysShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
        this._weekdaysMinStrictRegex = new RegExp(
            '^(' + minPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return (
            '' +
            hFormat.apply(this) +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse,
    };

    // internal storage for locale config files
    var locales = {},
        localeFamilies = {},
        globalLocale;

    function commonPrefix(arr1, arr2) {
        var i,
            minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonPrefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null,
            aliasedRequire;
        // TODO: Find a better way to register and load all the locales in Node
        if (
            locales[name] === undefined &&
            typeof module !== 'undefined' &&
            module &&
            module.exports
        ) {
            try {
                oldLocale = globalLocale._abbr;
                aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high CPU
                // when trying to find en-US, en_US, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'Locale ' + key + ' not found. Did you forget to load it?'
                    );
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
                // Update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
                // MERGE
                tmpLocale = loadLocale(name);
                if (tmpLocale != null) {
                    parentConfig = tmpLocale._config;
                }
                config = mergeConfigs(parentConfig, config);
                if (tmpLocale == null) {
                    // updateLocale is called for creating a new locale
                    // Set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new Locale(config);
                locale.parentLocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                    if (name === getSetGlobalLocale()) {
                        getSetGlobalLocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow,
            a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11
                    ? MONTH
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                    ? DATE
                    : a[HOUR] < 0 ||
                      a[HOUR] > 24 ||
                      (a[HOUR] === 24 &&
                          (a[MINUTE] !== 0 ||
                              a[SECOND] !== 0 ||
                              a[MILLISECOND] !== 0))
                    ? HOUR
                    : a[MINUTE] < 0 || a[MINUTE] > 59
                    ? MINUTE
                    : a[SECOND] < 0 || a[SECOND] > 59
                    ? SECOND
                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                    ? MILLISECOND
                    : -1;

            if (
                getParsingFlags(m)._overflowDayOfYear &&
                (overflow < YEAR || overflow > DATE)
            ) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, false],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
            ['YYYYDDD', /\d{7}/],
            ['YYYYMM', /\d{6}/, false],
            ['YYYY', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        obsOffsets = {
            UT: 0,
            GMT: 0,
            EDT: -4 * 60,
            EST: -5 * 60,
            CDT: -5 * 60,
            CST: -6 * 60,
            MDT: -6 * 60,
            MST: -7 * 60,
            PDT: -7 * 60,
            PST: -8 * 60,
        };

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function extractFromRFC2822Strings(
        yearStr,
        monthStr,
        dayStr,
        hourStr,
        minuteStr,
        secondStr
    ) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10),
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^)]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(
                    parsedInput[0],
                    parsedInput[1],
                    parsedInput[2]
                ).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)),
            parsedArray;
        if (match) {
            parsedArray = extractFromRFC2822Strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        if (config._strict) {
            config._isValid = false;
        } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
            'discouraged and will be removed in an upcoming major release. Please refer to ' +
            'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate(),
            ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            expectedWeekday,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (
                config._dayOfYear > daysInYear(yearToUse) ||
                config._dayOfYear === 0
            ) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (
            config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0
        ) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(
            null,
            input
        );
        expectedWeekday = config._useUTC
            ? config._d.getUTCDay()
            : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedWeekday
        ) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(
                w.GG,
                config._a[YEAR],
                weekOfYear(createLocal(), 1, 4).year
            );
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0,
            era;

        tokens =
            expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(
                    string.indexOf(parsedInput) + parsedInput.length
                );
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver =
            stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0
        ) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(
            config._locale,
            config._a[HOUR],
            config._meridiem
        );

        // handle era
        era = getParsingFlags(config).era;
        if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore,
            validFormatFound,
            bestFormatIsValid = false;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
                validFormatFound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
                if (
                    scoreToBeat == null ||
                    currentScore < scoreToBeat ||
                    validFormatFound
                ) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                    if (validFormatFound) {
                        bestFormatIsValid = true;
                    }
                }
            } else {
                if (currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i),
            dayOrDate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseInt(obj, 10);
            }
        );

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        ),
        prototypeMax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isDurationValid(m) {
        var key,
            unitHasDecimal = false,
            i;
        for (key in m) {
            if (
                hasOwnProp(m, key) &&
                !(
                    indexOf.call(ordering, key) !== -1 &&
                    (m[key] == null || !isNaN(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zeroFill(~~(offset / 60), 2) +
                separator +
                zeroFill(~~offset % 60, 2)
            );
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff =
                (isMoment(input) || isDate(input)
                    ? input.valueOf()
                    : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(
                        this,
                        createDuration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {},
            other;

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted =
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months,
            };
        } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffRes = momentsDifference(
                createLocal(duration.from),
                createLocal(duration.to)
            );

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. Please use moment().' +
                        name +
                        '(number, period). ' +
                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add'),
        subtract = createAdder(-1, 'subtract');

    function isString(input) {
        return typeof input === 'string' || input instanceof String;
    }

    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    function isMomentInput(input) {
        return (
            isMoment(input) ||
            isDate(input) ||
            isString(input) ||
            isNumber(input) ||
            isNumberOrStringArray(input) ||
            isMomentInputObject(input) ||
            input === null ||
            input === undefined
        );
    }

    function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'M',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'D',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function isNumberOrStringArray(input) {
        var arrayTest = isArray(input),
            dataTypeTest = false;
        if (arrayTest) {
            dataTypeTest =
                input.filter(function (item) {
                    return !isNumber(item) && isString(input);
                }).length === 0;
        }
        return arrayTest && dataTypeTest;
    }

    function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'sameDay',
                'nextDay',
                'lastDay',
                'nextWeek',
                'lastWeek',
                'sameElse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameElse'
            : diff < -1
            ? 'lastWeek'
            : diff < 0
            ? 'lastDay'
            : diff < 1
            ? 'sameDay'
            : diff < 2
            ? 'nextDay'
            : diff < 7
            ? 'nextWeek'
            : 'sameElse';
    }

    function calendar$1(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (isMomentInput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse',
            output =
                formats &&
                (isFunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localeData().calendar(format, this, createLocal(now))
        );
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isAfter(localFrom, units)
                : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isBefore(localTo, units)
                : !this.isAfter(localTo, units))
        );
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return (
                this.clone().startOf(units).valueOf() <= inputMs &&
                inputMs <= this.clone().endOf(units).valueOf()
            );
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(
                m,
                utc
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                    .toISOString()
                    .replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(
            m,
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
        );
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        datetime = '-MM-DD[T]HH:mm:ss.SSS';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc()
                ? hooks.defaultFormatUtc
                : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    var MS_PER_SECOND = 1000,
        MS_PER_MINUTE = 60 * MS_PER_SECOND,
        MS_PER_HOUR = 60 * MS_PER_MINUTE,
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoWeek':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoWeekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                    MS_PER_HOUR
                );
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoWeek':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time +=
                    MS_PER_HOUR -
                    mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        };
    }

    addFormatToken('N', 0, 0, 'eraAbbr');
    addFormatToken('NN', 0, 0, 'eraAbbr');
    addFormatToken('NNN', 0, 0, 'eraAbbr');
    addFormatToken('NNNN', 0, 0, 'eraName');
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    addRegexToken('N', matchEraAbbr);
    addRegexToken('NN', matchEraAbbr);
    addRegexToken('NNN', matchEraAbbr);
    addRegexToken('NNNN', matchEraName);
    addRegexToken('NNNNN', matchEraNarrow);

    addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (
        input,
        array,
        config,
        token
    ) {
        var era = config._locale.erasParse(input, token, config._strict);
        if (era) {
            getParsingFlags(config).era = era;
        } else {
            getParsingFlags(config).invalidEra = input;
        }
    });

    addRegexToken('y', matchUnsigned);
    addRegexToken('yy', matchUnsigned);
    addRegexToken('yyy', matchUnsigned);
    addRegexToken('yyyy', matchUnsigned);
    addRegexToken('yo', matchEraYearOrdinal);

    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    addParseToken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
        }

        if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
            array[YEAR] = parseInt(input, 10);
        }
    });

    function localeEras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getLocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startOf('day');
                    eras[i].since = date.valueOf();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +Infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startOf('day').valueOf();
                    eras[i].until = date.valueOf();
                    break;
            }
        }
        return eras;
    }

    function localeErasParse(eraName, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraName = eraName.toUpperCase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
                switch (format) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                        if (abbr === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNN':
                        if (name === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNNN':
                        if (narrow === eraName) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                return eras[i];
            }
        }
    }

    function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function getEraName() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function getEraNarrow() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function getEraAbbr() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function getEraYear() {
        var i,
            l,
            dir,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.startOf('day').valueOf();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
    }

    function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }

    function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }

    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }

    function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }

    function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }

    function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }

    function computeErasParse() {
        var abbrPieces = [],
            namePieces = [],
            narrowPieces = [],
            mixedPieces = [],
            i,
            l,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            namePieces.push(regexEscape(eras[i].name));
            abbrPieces.push(regexEscape(eras[i].abbr));
            narrowPieces.push(regexEscape(eras[i].narrow));

            mixedPieces.push(regexEscape(eras[i].name));
            mixedPieces.push(regexEscape(eras[i].abbr));
            mixedPieces.push(regexEscape(eras[i].narrow));
        }

        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
        this._erasNarrowRegex = new RegExp(
            '^(' + narrowPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy
        );
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.isoWeek(),
            this.isoWeekday(),
            1,
            4
        );
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null
            ? Math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
            : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear =
            Math.round(
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
            ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token, getSetMillisecond;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }

    getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
        };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
        'dates accessor is deprecated. Use date instead.',
        getSetDayOfMonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. Use month instead',
        getSetMonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. Use year instead',
        getSetYear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getSetZone
    );
    proto.isDSTShifted = deprecate(
        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isDaylightSavingTimeShifted
    );

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale(),
            utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toInt((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                        ? 'st'
                        : b === 2
                        ? 'nd'
                        : b === 3
                        ? 'rd'
                        : 'th';
            return number + output;
        },
    });

    // Side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        getSetGlobalLocale
    );
    hooks.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        getLocale
    );

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms'),
        asSeconds = makeAs('s'),
        asMinutes = makeAs('m'),
        asHours = makeAs('h'),
        asDays = makeAs('d'),
        asWeeks = makeAs('w'),
        asMonths = makeAs('M'),
        asQuarters = makeAs('Q'),
        asYears = makeAs('y');

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds'),
        seconds = makeGetter('seconds'),
        minutes = makeGetter('minutes'),
        hours = makeGetter('hours'),
        days = makeGetter('days'),
        months = makeGetter('months'),
        years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            M: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['M']) ||
            (months < thresholds.M && ['MM', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var withSuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argWithSuffix === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
        }
        if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === 'object') {
            th = Object.assign({}, thresholds, argThresholds);
            if (argThresholds.s != null && argThresholds.ss == null) {
                th.ss = argThresholds.s - 1;
            }
        }

        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asSeconds(),
            totalSign,
            ymSign,
            daysSign,
            hmsSign;

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

        totalSign = total < 0 ? '-' : '';
        ymSign = sign(this._months) !== sign(total) ? '-' : '';
        daysSign = sign(this._days) !== sign(total) ? '-' : '';
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalSign +
            'P' +
            (years ? ymSign + years + 'Y' : '') +
            (months ? ymSign + months + 'M' : '') +
            (days ? daysSign + days + 'D' : '') +
            (hours || minutes || seconds ? 'T' : '') +
            (hours ? hmsSign + hours + 'H' : '') +
            (minutes ? hmsSign + minutes + 'M' : '') +
            (seconds ? hmsSign + s + 'S' : '')
        );
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate(
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
        toISOString$1
    );
    proto$2.lang = lang;

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    //! moment.js

    hooks.version = '2.27.0';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM', // <input type="month" />
    };

    return hooks;

})));

},{}],49:[function(require,module,exports){
module.exports={
  "10*": {
    "value": 10,
    "ucum": "1"
  },
  "10^": {
    "value": 10,
    "ucum": "1"
  },
  "[pi]": {
    "value": 3.141592653589793,
    "ucum": "1"
  },
  "%": {
    "value": 1,
    "ucum": "10*-2"
  },
  "[ppth]": {
    "value": 1,
    "ucum": "10*-3"
  },
  "[ppm]": {
    "value": 1,
    "ucum": "10*-6"
  },
  "[ppb]": {
    "value": 1,
    "ucum": "10*-9"
  },
  "[pptr]": {
    "value": 1,
    "ucum": "10*-12"
  },
  "mol": {
    "value": 6.0221367,
    "ucum": "10*23"
  },
  "sr": {
    "value": 1,
    "ucum": "rad2"
  },
  "Hz": {
    "value": 1,
    "ucum": "s-1"
  },
  "N": {
    "value": 1,
    "ucum": "kg.m/s2"
  },
  "Pa": {
    "value": 1,
    "ucum": "N/m2"
  },
  "J": {
    "value": 1,
    "ucum": "N.m"
  },
  "W": {
    "value": 1,
    "ucum": "J/s"
  },
  "A": {
    "value": 1,
    "ucum": "C/s"
  },
  "V": {
    "value": 1,
    "ucum": "J/C"
  },
  "F": {
    "value": 1,
    "ucum": "C/V"
  },
  "Ohm": {
    "value": 1,
    "ucum": "V/A"
  },
  "S": {
    "value": 1,
    "ucum": "Ohm-1"
  },
  "Wb": {
    "value": 1,
    "ucum": "V.s"
  },
  "Cel": {
    "value": null,
    "ucum": "cel(1 K)"
  },
  "T": {
    "value": 1,
    "ucum": "Wb/m2"
  },
  "H": {
    "value": 1,
    "ucum": "Wb/A"
  },
  "lm": {
    "value": 1,
    "ucum": "cd.sr"
  },
  "lx": {
    "value": 1,
    "ucum": "lm/m2"
  },
  "Bq": {
    "value": 1,
    "ucum": "s-1"
  },
  "Gy": {
    "value": 1,
    "ucum": "J/kg"
  },
  "Sv": {
    "value": 1,
    "ucum": "J/kg"
  },
  "gon": {
    "value": 0.9,
    "ucum": "deg"
  },
  "deg": {
    "value": 2,
    "ucum": "[pi].rad/360"
  },
  "'": {
    "value": 1,
    "ucum": "deg/60"
  },
  "''": {
    "value": 1,
    "ucum": "'/60"
  },
  "l": {
    "value": 1,
    "ucum": "dm3"
  },
  "L": {
    "value": 1,
    "ucum": "l"
  },
  "ar": {
    "value": 100,
    "ucum": "m2"
  },
  "min": {
    "value": 60,
    "ucum": "s"
  },
  "h": {
    "value": 60,
    "ucum": "min"
  },
  "d": {
    "value": 24,
    "ucum": "h"
  },
  "a_t": {
    "value": 365.24219,
    "ucum": "d"
  },
  "a_j": {
    "value": 365.25,
    "ucum": "d"
  },
  "a_g": {
    "value": 365.2425,
    "ucum": "d"
  },
  "a": {
    "value": 1,
    "ucum": "a_j"
  },
  "wk": {
    "value": 7,
    "ucum": "d"
  },
  "mo_s": {
    "value": 29.53059,
    "ucum": "d"
  },
  "mo_j": {
    "value": 1,
    "ucum": "a_j/12"
  },
  "mo_g": {
    "value": 1,
    "ucum": "a_g/12"
  },
  "mo": {
    "value": 1,
    "ucum": "mo_j"
  },
  "t": {
    "value": 1000,
    "ucum": "kg"
  },
  "bar": {
    "value": 100000,
    "ucum": "Pa"
  },
  "u": {
    "value": 1.6605402e-24,
    "ucum": "g"
  },
  "eV": {
    "value": 1,
    "ucum": "[e].V"
  },
  "AU": {
    "value": 149597.870691,
    "ucum": "Mm"
  },
  "pc": {
    "value": 30856780000000000,
    "ucum": "m"
  },
  "[c]": {
    "value": 299792458,
    "ucum": "m/s"
  },
  "[h]": {
    "value": 6.6260755e-24,
    "ucum": "J.s"
  },
  "[k]": {
    "value": 1.380658e-23,
    "ucum": "J/K"
  },
  "[eps_0]": {
    "value": 8.854187817e-12,
    "ucum": "F/m"
  },
  "[mu_0]": {
    "value": 1,
    "ucum": "4.[pi].10*-7.N/A2"
  },
  "[e]": {
    "value": 1.60217733e-19,
    "ucum": "C"
  },
  "[m_e]": {
    "value": 9.1093897e-28,
    "ucum": "g"
  },
  "[m_p]": {
    "value": 1.6726231e-24,
    "ucum": "g"
  },
  "[G]": {
    "value": 6.67259e-11,
    "ucum": "m3.kg-1.s-2"
  },
  "[g]": {
    "value": 9.80665,
    "ucum": "m/s2"
  },
  "atm": {
    "value": 101325,
    "ucum": "Pa"
  },
  "[ly]": {
    "value": 1,
    "ucum": "[c].a_j"
  },
  "gf": {
    "value": 1,
    "ucum": "g.[g]"
  },
  "[lbf_av]": {
    "value": 1,
    "ucum": "[lb_av].[g]"
  },
  "Ky": {
    "value": 1,
    "ucum": "cm-1"
  },
  "Gal": {
    "value": 1,
    "ucum": "cm/s2"
  },
  "dyn": {
    "value": 1,
    "ucum": "g.cm/s2"
  },
  "erg": {
    "value": 1,
    "ucum": "dyn.cm"
  },
  "P": {
    "value": 1,
    "ucum": "dyn.s/cm2"
  },
  "Bi": {
    "value": 10,
    "ucum": "A"
  },
  "St": {
    "value": 1,
    "ucum": "cm2/s"
  },
  "Mx": {
    "value": 1e-8,
    "ucum": "Wb"
  },
  "G": {
    "value": 0.0001,
    "ucum": "T"
  },
  "Oe": {
    "value": 250,
    "ucum": "/[pi].A/m"
  },
  "Gb": {
    "value": 1,
    "ucum": "Oe.cm"
  },
  "sb": {
    "value": 1,
    "ucum": "cd/cm2"
  },
  "Lmb": {
    "value": 1,
    "ucum": "cd/cm2/[pi]"
  },
  "ph": {
    "value": 0.0001,
    "ucum": "lx"
  },
  "Ci": {
    "value": 37000000000,
    "ucum": "Bq"
  },
  "R": {
    "value": 0.000258,
    "ucum": "C/kg"
  },
  "RAD": {
    "value": 100,
    "ucum": "erg/g"
  },
  "REM": {
    "value": 1,
    "ucum": "RAD"
  },
  "[in_i]": {
    "value": 2.54,
    "ucum": "cm"
  },
  "[ft_i]": {
    "value": 12,
    "ucum": "[in_i]"
  },
  "[yd_i]": {
    "value": 3,
    "ucum": "[ft_i]"
  },
  "[mi_i]": {
    "value": 5280,
    "ucum": "[ft_i]"
  },
  "[fth_i]": {
    "value": 6,
    "ucum": "[ft_i]"
  },
  "[nmi_i]": {
    "value": 1852,
    "ucum": "m"
  },
  "[kn_i]": {
    "value": 1,
    "ucum": "[nmi_i]/h"
  },
  "[sin_i]": {
    "value": 1,
    "ucum": "[in_i]2"
  },
  "[sft_i]": {
    "value": 1,
    "ucum": "[ft_i]2"
  },
  "[syd_i]": {
    "value": 1,
    "ucum": "[yd_i]2"
  },
  "[cin_i]": {
    "value": 1,
    "ucum": "[in_i]3"
  },
  "[cft_i]": {
    "value": 1,
    "ucum": "[ft_i]3"
  },
  "[cyd_i]": {
    "value": 1,
    "ucum": "[yd_i]3"
  },
  "[bf_i]": {
    "value": 144,
    "ucum": "[in_i]3"
  },
  "[cr_i]": {
    "value": 128,
    "ucum": "[ft_i]3"
  },
  "[mil_i]": {
    "value": 0.001,
    "ucum": "[in_i]"
  },
  "[cml_i]": {
    "value": 1,
    "ucum": "[pi]/4.[mil_i]2"
  },
  "[hd_i]": {
    "value": 4,
    "ucum": "[in_i]"
  },
  "[ft_us]": {
    "value": 1200,
    "ucum": "m/3937"
  },
  "[yd_us]": {
    "value": 3,
    "ucum": "[ft_us]"
  },
  "[in_us]": {
    "value": 1,
    "ucum": "[ft_us]/12"
  },
  "[rd_us]": {
    "value": 16.5,
    "ucum": "[ft_us]"
  },
  "[ch_us]": {
    "value": 4,
    "ucum": "[rd_us]"
  },
  "[lk_us]": {
    "value": 1,
    "ucum": "[ch_us]/100"
  },
  "[rch_us]": {
    "value": 100,
    "ucum": "[ft_us]"
  },
  "[rlk_us]": {
    "value": 1,
    "ucum": "[rch_us]/100"
  },
  "[fth_us]": {
    "value": 6,
    "ucum": "[ft_us]"
  },
  "[fur_us]": {
    "value": 40,
    "ucum": "[rd_us]"
  },
  "[mi_us]": {
    "value": 8,
    "ucum": "[fur_us]"
  },
  "[acr_us]": {
    "value": 160,
    "ucum": "[rd_us]2"
  },
  "[srd_us]": {
    "value": 1,
    "ucum": "[rd_us]2"
  },
  "[smi_us]": {
    "value": 1,
    "ucum": "[mi_us]2"
  },
  "[sct]": {
    "value": 1,
    "ucum": "[mi_us]2"
  },
  "[twp]": {
    "value": 36,
    "ucum": "[sct]"
  },
  "[mil_us]": {
    "value": 0.001,
    "ucum": "[in_us]"
  },
  "[in_br]": {
    "value": 2.539998,
    "ucum": "cm"
  },
  "[ft_br]": {
    "value": 12,
    "ucum": "[in_br]"
  },
  "[rd_br]": {
    "value": 16.5,
    "ucum": "[ft_br]"
  },
  "[ch_br]": {
    "value": 4,
    "ucum": "[rd_br]"
  },
  "[lk_br]": {
    "value": 1,
    "ucum": "[ch_br]/100"
  },
  "[fth_br]": {
    "value": 6,
    "ucum": "[ft_br]"
  },
  "[pc_br]": {
    "value": 2.5,
    "ucum": "[ft_br]"
  },
  "[yd_br]": {
    "value": 3,
    "ucum": "[ft_br]"
  },
  "[mi_br]": {
    "value": 5280,
    "ucum": "[ft_br]"
  },
  "[nmi_br]": {
    "value": 6080,
    "ucum": "[ft_br]"
  },
  "[kn_br]": {
    "value": 1,
    "ucum": "[nmi_br]/h"
  },
  "[acr_br]": {
    "value": 4840,
    "ucum": "[yd_br]2"
  },
  "[gal_us]": {
    "value": 231,
    "ucum": "[in_i]3"
  },
  "[bbl_us]": {
    "value": 42,
    "ucum": "[gal_us]"
  },
  "[qt_us]": {
    "value": 1,
    "ucum": "[gal_us]/4"
  },
  "[pt_us]": {
    "value": 1,
    "ucum": "[qt_us]/2"
  },
  "[gil_us]": {
    "value": 1,
    "ucum": "[pt_us]/4"
  },
  "[foz_us]": {
    "value": 1,
    "ucum": "[gil_us]/4"
  },
  "[fdr_us]": {
    "value": 1,
    "ucum": "[foz_us]/8"
  },
  "[min_us]": {
    "value": 1,
    "ucum": "[fdr_us]/60"
  },
  "[crd_us]": {
    "value": 128,
    "ucum": "[ft_i]3"
  },
  "[bu_us]": {
    "value": 2150.42,
    "ucum": "[in_i]3"
  },
  "[gal_wi]": {
    "value": 1,
    "ucum": "[bu_us]/8"
  },
  "[pk_us]": {
    "value": 1,
    "ucum": "[bu_us]/4"
  },
  "[dqt_us]": {
    "value": 1,
    "ucum": "[pk_us]/8"
  },
  "[dpt_us]": {
    "value": 1,
    "ucum": "[dqt_us]/2"
  },
  "[tbs_us]": {
    "value": 1,
    "ucum": "[foz_us]/2"
  },
  "[tsp_us]": {
    "value": 1,
    "ucum": "[tbs_us]/3"
  },
  "[cup_us]": {
    "value": 16,
    "ucum": "[tbs_us]"
  },
  "[foz_m]": {
    "value": 30,
    "ucum": "mL"
  },
  "[cup_m]": {
    "value": 240,
    "ucum": "mL"
  },
  "[tsp_m]": {
    "value": 5,
    "ucum": "mL"
  },
  "[tbs_m]": {
    "value": 15,
    "ucum": "mL"
  },
  "[gal_br]": {
    "value": 4.54609,
    "ucum": "l"
  },
  "[pk_br]": {
    "value": 2,
    "ucum": "[gal_br]"
  },
  "[bu_br]": {
    "value": 4,
    "ucum": "[pk_br]"
  },
  "[qt_br]": {
    "value": 1,
    "ucum": "[gal_br]/4"
  },
  "[pt_br]": {
    "value": 1,
    "ucum": "[qt_br]/2"
  },
  "[gil_br]": {
    "value": 1,
    "ucum": "[pt_br]/4"
  },
  "[foz_br]": {
    "value": 1,
    "ucum": "[gil_br]/5"
  },
  "[fdr_br]": {
    "value": 1,
    "ucum": "[foz_br]/8"
  },
  "[min_br]": {
    "value": 1,
    "ucum": "[fdr_br]/60"
  },
  "[gr]": {
    "value": 64.79891,
    "ucum": "mg"
  },
  "[lb_av]": {
    "value": 7000,
    "ucum": "[gr]"
  },
  "[oz_av]": {
    "value": 1,
    "ucum": "[lb_av]/16"
  },
  "[dr_av]": {
    "value": 1,
    "ucum": "[oz_av]/16"
  },
  "[scwt_av]": {
    "value": 100,
    "ucum": "[lb_av]"
  },
  "[lcwt_av]": {
    "value": 112,
    "ucum": "[lb_av]"
  },
  "[ston_av]": {
    "value": 20,
    "ucum": "[scwt_av]"
  },
  "[lton_av]": {
    "value": 20,
    "ucum": "[lcwt_av]"
  },
  "[stone_av]": {
    "value": 14,
    "ucum": "[lb_av]"
  },
  "[pwt_tr]": {
    "value": 24,
    "ucum": "[gr]"
  },
  "[oz_tr]": {
    "value": 20,
    "ucum": "[pwt_tr]"
  },
  "[lb_tr]": {
    "value": 12,
    "ucum": "[oz_tr]"
  },
  "[sc_ap]": {
    "value": 20,
    "ucum": "[gr]"
  },
  "[dr_ap]": {
    "value": 3,
    "ucum": "[sc_ap]"
  },
  "[oz_ap]": {
    "value": 8,
    "ucum": "[dr_ap]"
  },
  "[lb_ap]": {
    "value": 12,
    "ucum": "[oz_ap]"
  },
  "[oz_m]": {
    "value": 28,
    "ucum": "g"
  },
  "[lne]": {
    "value": 1,
    "ucum": "[in_i]/12"
  },
  "[pnt]": {
    "value": 1,
    "ucum": "[lne]/6"
  },
  "[pca]": {
    "value": 12,
    "ucum": "[pnt]"
  },
  "[pnt_pr]": {
    "value": 0.013837,
    "ucum": "[in_i]"
  },
  "[pca_pr]": {
    "value": 12,
    "ucum": "[pnt_pr]"
  },
  "[pied]": {
    "value": 32.48,
    "ucum": "cm"
  },
  "[pouce]": {
    "value": 1,
    "ucum": "[pied]/12"
  },
  "[ligne]": {
    "value": 1,
    "ucum": "[pouce]/12"
  },
  "[didot]": {
    "value": 1,
    "ucum": "[ligne]/6"
  },
  "[cicero]": {
    "value": 12,
    "ucum": "[didot]"
  },
  "[degF]": {
    "value": null,
    "ucum": "degf(5 K/9)"
  },
  "[degR]": {
    "value": 5,
    "ucum": "K/9"
  },
  "cal_[15]": {
    "value": 4.1858,
    "ucum": "J"
  },
  "cal_[20]": {
    "value": 4.1819,
    "ucum": "J"
  },
  "cal_m": {
    "value": 4.19002,
    "ucum": "J"
  },
  "cal_IT": {
    "value": 4.1868,
    "ucum": "J"
  },
  "cal_th": {
    "value": 4.184,
    "ucum": "J"
  },
  "cal": {
    "value": 1,
    "ucum": "cal_th"
  },
  "[Cal]": {
    "value": 1,
    "ucum": "kcal_th"
  },
  "[Btu_39]": {
    "value": 1.05967,
    "ucum": "kJ"
  },
  "[Btu_59]": {
    "value": 1.0548,
    "ucum": "kJ"
  },
  "[Btu_60]": {
    "value": 1.05468,
    "ucum": "kJ"
  },
  "[Btu_m]": {
    "value": 1.05587,
    "ucum": "kJ"
  },
  "[Btu_IT]": {
    "value": 1.05505585262,
    "ucum": "kJ"
  },
  "[Btu_th]": {
    "value": 1.05435,
    "ucum": "kJ"
  },
  "[Btu]": {
    "value": 1,
    "ucum": "[Btu_th]"
  },
  "[HP]": {
    "value": 550,
    "ucum": "[ft_i].[lbf_av]/s"
  },
  "tex": {
    "value": 1,
    "ucum": "g/km"
  },
  "[den]": {
    "value": 1,
    "ucum": "g/9/km"
  },
  "m[H2O]": {
    "value": 9.80665,
    "ucum": "kPa"
  },
  "m[Hg]": {
    "value": 133.322,
    "ucum": "kPa"
  },
  "[in_i'H2O]": {
    "value": 1,
    "ucum": "m[H2O].[in_i]/m"
  },
  "[in_i'Hg]": {
    "value": 1,
    "ucum": "m[Hg].[in_i]/m"
  },
  "[PRU]": {
    "value": 1,
    "ucum": "mm[Hg].s/ml"
  },
  "[wood'U]": {
    "value": 1,
    "ucum": "mm[Hg].min/L"
  },
  "[diop]": {
    "value": 1,
    "ucum": "/m"
  },
  "[p'diop]": {
    "value": null,
    "ucum": "100tan(1 rad)"
  },
  "%[slope]": {
    "value": null,
    "ucum": "100tan(1 rad)"
  },
  "[mesh_i]": {
    "value": 1,
    "ucum": "/[in_i]"
  },
  "[Ch]": {
    "value": 1,
    "ucum": "mm/3"
  },
  "[drp]": {
    "value": 1,
    "ucum": "ml/20"
  },
  "[hnsf'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[MET]": {
    "value": 3.5,
    "ucum": "mL/min/kg"
  },
  "[hp'_X]": {
    "value": null,
    "ucum": "hpX(1 1)"
  },
  "[hp'_C]": {
    "value": null,
    "ucum": "hpC(1 1)"
  },
  "[hp'_M]": {
    "value": null,
    "ucum": "hpM(1 1)"
  },
  "[hp'_Q]": {
    "value": null,
    "ucum": "hpQ(1 1)"
  },
  "[hp_X]": {
    "value": 1,
    "ucum": "1"
  },
  "[hp_C]": {
    "value": 1,
    "ucum": "1"
  },
  "[hp_M]": {
    "value": 1,
    "ucum": "1"
  },
  "[hp_Q]": {
    "value": 1,
    "ucum": "1"
  },
  "[kp_X]": {
    "value": 1,
    "ucum": "1"
  },
  "[kp_C]": {
    "value": 1,
    "ucum": "1"
  },
  "[kp_M]": {
    "value": 1,
    "ucum": "1"
  },
  "[kp_Q]": {
    "value": 1,
    "ucum": "1"
  },
  "eq": {
    "value": 1,
    "ucum": "mol"
  },
  "osm": {
    "value": 1,
    "ucum": "mol"
  },
  "[pH]": {
    "value": null,
    "ucum": "pH(1 mol/l)"
  },
  "g%": {
    "value": 1,
    "ucum": "g/dl"
  },
  "[S]": {
    "value": 1,
    "ucum": "10*-13.s"
  },
  "[HPF]": {
    "value": 1,
    "ucum": "1"
  },
  "[LPF]": {
    "value": 100,
    "ucum": "1"
  },
  "kat": {
    "value": 1,
    "ucum": "mol/s"
  },
  "U": {
    "value": 1,
    "ucum": "umol/min"
  },
  "[iU]": {
    "value": 1,
    "ucum": "1"
  },
  "[IU]": {
    "value": 1,
    "ucum": "[iU]"
  },
  "[arb'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[USP'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[GPL'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[MPL'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[APL'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[beth'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[anti'Xa'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[todd'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[dye'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[smgy'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[bdsk'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[ka'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[knk'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[mclg'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[tb'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[CCID_50]": {
    "value": 1,
    "ucum": "1"
  },
  "[TCID_50]": {
    "value": 1,
    "ucum": "1"
  },
  "[EID_50]": {
    "value": 1,
    "ucum": "1"
  },
  "[PFU]": {
    "value": 1,
    "ucum": "1"
  },
  "[FFU]": {
    "value": 1,
    "ucum": "1"
  },
  "[CFU]": {
    "value": 1,
    "ucum": "1"
  },
  "[BAU]": {
    "value": 1,
    "ucum": "1"
  },
  "[AU]": {
    "value": 1,
    "ucum": "1"
  },
  "[Amb'a'1'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[PNU]": {
    "value": 1,
    "ucum": "1"
  },
  "[Lf]": {
    "value": 1,
    "ucum": "1"
  },
  "[D'ag'U]": {
    "value": 1,
    "ucum": "1"
  },
  "[FEU]": {
    "value": 1,
    "ucum": "1"
  },
  "[ELU]": {
    "value": 1,
    "ucum": "1"
  },
  "[EU]": {
    "value": 1,
    "ucum": "1"
  },
  "Np": {
    "value": null,
    "ucum": "ln(1 1)"
  },
  "B": {
    "value": null,
    "ucum": "lg(1 1)"
  },
  "B[SPL]": {
    "value": null,
    "ucum": "2lg(2 10*-5.Pa)"
  },
  "B[V]": {
    "value": null,
    "ucum": "2lg(1 V)"
  },
  "B[mV]": {
    "value": null,
    "ucum": "2lg(1 mV)"
  },
  "B[uV]": {
    "value": null,
    "ucum": "2lg(1 uV)"
  },
  "B[10.nV]": {
    "value": null,
    "ucum": "2lg(10 nV)"
  },
  "B[W]": {
    "value": null,
    "ucum": "lg(1 W)"
  },
  "B[kW]": {
    "value": null,
    "ucum": "lg(1 kW)"
  },
  "st": {
    "value": 1,
    "ucum": "m3"
  },
  "Ao": {
    "value": 0.1,
    "ucum": "nm"
  },
  "b": {
    "value": 100,
    "ucum": "fm2"
  },
  "att": {
    "value": 1,
    "ucum": "kgf/cm2"
  },
  "mho": {
    "value": 1,
    "ucum": "S"
  },
  "[psi]": {
    "value": 1,
    "ucum": "[lbf_av]/[in_i]2"
  },
  "circ": {
    "value": 2,
    "ucum": "[pi].rad"
  },
  "sph": {
    "value": 4,
    "ucum": "[pi].sr"
  },
  "[car_m]": {
    "value": 0.2,
    "ucum": "g"
  },
  "[car_Au]": {
    "value": 1,
    "ucum": "/24"
  },
  "[smoot]": {
    "value": 67,
    "ucum": "[in_i]"
  },
  "bit_s": {
    "value": null,
    "ucum": "ld(1 1)"
  },
  "bit": {
    "value": 1,
    "ucum": "1"
  },
  "By": {
    "value": 8,
    "ucum": "bit"
  },
  "Bd": {
    "value": 1,
    "ucum": "/s"
  }
}

},{}],50:[function(require,module,exports){
module.exports={"mol":true,"sr":true,"Hz":true,"N":true,"Pa":true,"J":true,"W":true,"A":true,"V":true,"F":true,"Ohm":true,"S":true,"Wb":true,"Cel":true,"T":true,"H":true,"lm":true,"lx":true,"Bq":true,"Gy":true,"Sv":true,"l":true,"L":true,"ar":true,"t":true,"bar":true,"u":true,"eV":true,"pc":true,"[c]":true,"[h]":true,"[k]":true,"[eps_0]":true,"[mu_0]":true,"[e]":true,"[m_e]":true,"[m_p]":true,"[G]":true,"[g]":true,"[ly]":true,"gf":true,"Ky":true,"Gal":true,"dyn":true,"erg":true,"P":true,"Bi":true,"St":true,"Mx":true,"G":true,"Oe":true,"Gb":true,"sb":true,"Lmb":true,"ph":true,"Ci":true,"R":true,"RAD":true,"REM":true,"cal_[15]":true,"cal_[20]":true,"cal_m":true,"cal_IT":true,"cal_th":true,"cal":true,"tex":true,"m[H2O]":true,"m[Hg]":true,"eq":true,"osm":true,"g%":true,"kat":true,"U":true,"[iU]":true,"[IU]":true,"Np":true,"B":true,"B[SPL]":true,"B[V]":true,"B[mV]":true,"B[uV]":true,"B[10.nV]":true,"B[W]":true,"B[kW]":true,"st":true,"mho":true,"bit":true,"By":true,"Bd":true,"m":true,"s":true,"g":true,"rad":true,"K":true,"C":true,"cd":true}

},{}],51:[function(require,module,exports){
module.exports={
  "Y": {
    "CODE": "YA",
    "names": [
      "yotta"
    ],
    "printSymbols": [
      "Y"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>24</sup>",
        "numeric": 1e+24
      }
    ]
  },
  "Z": {
    "CODE": "ZA",
    "names": [
      "zetta"
    ],
    "printSymbols": [
      "Z"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>21</sup>",
        "numeric": 1e+21
      }
    ]
  },
  "E": {
    "CODE": "EX",
    "names": [
      "exa"
    ],
    "printSymbols": [
      "E"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>18</sup>",
        "numeric": 1000000000000000000
      }
    ]
  },
  "P": {
    "CODE": "PT",
    "names": [
      "peta"
    ],
    "printSymbols": [
      "P"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>15</sup>",
        "numeric": 1000000000000000
      }
    ]
  },
  "T": {
    "CODE": "TR",
    "names": [
      "tera"
    ],
    "printSymbols": [
      "T"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>12</sup>",
        "numeric": 1000000000000
      }
    ]
  },
  "G": {
    "CODE": "GA",
    "names": [
      "giga"
    ],
    "printSymbols": [
      "G"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>9</sup>",
        "numeric": 1000000000
      }
    ]
  },
  "M": {
    "CODE": "MA",
    "names": [
      "mega"
    ],
    "printSymbols": [
      "M"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>6</sup>",
        "numeric": 1000000
      }
    ]
  },
  "k": {
    "CODE": "K",
    "names": [
      "kilo"
    ],
    "printSymbols": [
      "k"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>3</sup>",
        "numeric": 1000
      }
    ]
  },
  "h": {
    "CODE": "H",
    "names": [
      "hecto"
    ],
    "printSymbols": [
      "h"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>2</sup>",
        "numeric": 100
      }
    ]
  },
  "da": {
    "CODE": "DA",
    "names": [
      "deka"
    ],
    "printSymbols": [
      "da"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>1</sup>",
        "numeric": 10
      }
    ]
  },
  "d": {
    "CODE": "D",
    "names": [
      "deci"
    ],
    "printSymbols": [
      "d"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-1</sup>",
        "numeric": 0.1
      }
    ]
  },
  "c": {
    "CODE": "C",
    "names": [
      "centi"
    ],
    "printSymbols": [
      "c"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-2</sup>",
        "numeric": 0.01
      }
    ]
  },
  "m": {
    "CODE": "M",
    "names": [
      "milli"
    ],
    "printSymbols": [
      "m"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-3</sup>",
        "numeric": 0.001
      }
    ]
  },
  "u": {
    "CODE": "U",
    "names": [
      "micro"
    ],
    "printSymbols": [
      "&#956;"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-6</sup>",
        "numeric": 0.000001
      }
    ]
  },
  "n": {
    "CODE": "N",
    "names": [
      "nano"
    ],
    "printSymbols": [
      "n"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-9</sup>",
        "numeric": 1e-9
      }
    ]
  },
  "p": {
    "CODE": "P",
    "names": [
      "pico"
    ],
    "printSymbols": [
      "p"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-12</sup>",
        "numeric": 1e-12
      }
    ]
  },
  "f": {
    "CODE": "F",
    "names": [
      "femto"
    ],
    "printSymbols": [
      "f"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-15</sup>",
        "numeric": 1e-15
      }
    ]
  },
  "a": {
    "CODE": "A",
    "names": [
      "atto"
    ],
    "printSymbols": [
      "a"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-18</sup>",
        "numeric": 1e-18
      }
    ]
  },
  "z": {
    "CODE": "ZO",
    "names": [
      "zepto"
    ],
    "printSymbols": [
      "z"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-21</sup>",
        "numeric": 1e-21
      }
    ]
  },
  "y": {
    "CODE": "YO",
    "names": [
      "yocto"
    ],
    "printSymbols": [
      "y"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-24</sup>",
        "numeric": 1e-24
      }
    ]
  },
  "Ki": {
    "CODE": "KIB",
    "names": [
      "kibi"
    ],
    "printSymbols": [
      "Ki"
    ],
    "values": [
      {
        "printable": "1024",
        "numeric": 1024
      }
    ]
  },
  "Mi": {
    "CODE": "MIB",
    "names": [
      "mebi"
    ],
    "printSymbols": [
      "Mi"
    ],
    "values": [
      {
        "printable": "1048576",
        "numeric": 1048576
      }
    ]
  },
  "Gi": {
    "CODE": "GIB",
    "names": [
      "gibi"
    ],
    "printSymbols": [
      "Gi"
    ],
    "values": [
      {
        "printable": "1073741824",
        "numeric": 1073741824
      }
    ]
  },
  "Ti": {
    "CODE": "TIB",
    "names": [
      "tebi"
    ],
    "printSymbols": [
      "Ti"
    ],
    "values": [
      {
        "printable": "1099511627776",
        "numeric": 1099511627776
      }
    ]
  }
}

},{}],52:[function(require,module,exports){
module.exports={
  "Y": 1e+24,
  "Z": 1e+21,
  "E": 1000000000000000000,
  "P": 1000000000000000,
  "T": 1000000000000,
  "G": 1000000000,
  "M": 1000000,
  "k": 1000,
  "h": 100,
  "da": 10,
  "d": 0.1,
  "c": 0.01,
  "m": 0.001,
  "u": 0.000001,
  "n": 1e-9,
  "p": 1e-12,
  "f": 1e-15,
  "a": 1e-18,
  "z": 1e-21,
  "y": 1e-24,
  "Ki": 1024,
  "Mi": 1048576,
  "Gi": 1073741824,
  "Ti": 1099511627776
}

},{}],53:[function(require,module,exports){
module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleIndices = { start: 0 },
        peg$startRuleIndex   = 0,

        peg$consts = [
          function(e) {
            return e ; // cleanup(e);
          },
          peg$FAILED,
          "/",
          { type: "literal", value: "/", description: "\"/\"" },
          function(e) {return multiply({value:1, units:{}}, [["/", e]]);},
          ".",
          { type: "literal", value: ".", description: "\".\"" },
          [],
          function(t, ms) {
            return multiply(t, ms);
          },
          null,
          function(e, exp) {return e.ann && exp;},
          void 0,
          function(e, exp) {
            return topower(e, exp);
          },
          function(d) {
           var ret = {
              value: d,
              units: {}
            };
            return ret;
          },
          function(u) {return u;},
          "(",
          { type: "literal", value: "(", description: "\"(\"" },
          ")",
          { type: "literal", value: ")", description: "\")\"" },
          function(e) {return e;},
          /^[+\-]/,
          { type: "class", value: "[+\\-]", description: "[+\\-]" },
          function(s, d) {return (s=="-") ? (-1*d) : d},
          function(p, a) {return(p && !ismetric(a));},
          function(p, a) {
            var ret = a;
            var u = Object.keys(ret.units)[0];

            // console.log("simpleUnit: p:", JSON.stringify(p, null, 2), "a: ", JSON.stringify(a, null, 2));

            if (p){
              ret.value = ret.value * prefixes[p];
              ret.metadata = {};
              if(prefixMetadata[p]){
                // if this prefix has metadata, augment the return with it
                Object.keys(prefixMetadata[p]).forEach(function(key){
                  if(!ret.metadata[u]){
                    ret.metadata[u] = { prefix: {} };
                  }
                  ret.metadata[u].prefix[key] = prefixMetadata[p][key];
                });
              }

              // merge in the unit metadata
              if(unitMetadata[u]){
                //console.log("simpleUnit: ", JSON.stringify(unitMetadata[u], null ,2));
                Object.keys(unitMetadata[u]).forEach(function(key){
                  if(!ret.metadata[u]){
                    ret.metadata[u] = {};
                  }
                  ret.metadata[u][key] = unitMetadata[u][key];
                });
              }
            }

            //console.log("simpleUnit: ret: ", JSON.stringify(ret, null ,2));
            return ret;
          },
          /^[0-9]/,
          { type: "class", value: "[0-9]", description: "[0-9]" },
          "e",
          { type: "literal", value: "e", description: "\"e\"" },
          function(v, epresent, e) {return (!epresent && !!e);},
          function(v, epresent, e) {
            return parseInt(v.join(""))*Math.pow(10, e||0);
          },
          "{",
          { type: "literal", value: "{", description: "\"{\"" },
          /^[^}]/,
          { type: "class", value: "[^}]", description: "[^}]" },
          "}",
          { type: "literal", value: "}", description: "\"}\"" },
          function(m) {return /[^\x00-\x7F]/.test(m);},
          function(m) { return {value: 1, units:{}, ann: m} },
          "[anti'Xa'U]",
          { type: "literal", value: "[anti'Xa'U]", description: "\"[anti'Xa'U]\"" },
          function(u) {return {"value": 1, "units": {"[anti'Xa'U]": 1}, "metadata": {"[anti'Xa'U]":{"isBase":false,"CODE":"[ANTI'XA'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["anti factor Xa unit"],"properties":["biologic activity of factor Xa inhibitor (heparin)"],"values":[{"printable":"1","numeric":1}]}}};},
          "[Amb'a'1'U]",
          { type: "literal", value: "[Amb'a'1'U]", description: "\"[Amb'a'1'U]\"" },
          function(u) {return {"value": 1, "units": {"[Amb'a'1'U]": 1}, "metadata": {"[Amb'a'1'U]":{"isBase":false,"CODE":"[AMB'A'1'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["allergen unit for Ambrosia artemisiifolia"],"printSymbols":["Amb a 1 U"],"properties":["procedure defined amount of the major allergen of ragweed."],"values":[{"printable":"1","numeric":1}]}}};},
          "[stone_av]",
          { type: "literal", value: "[stone_av]", description: "\"[stone_av]\"" },
          function(u) {return {"value": 1, "units": {"[stone_av]": 1}, "metadata": {"[stone_av]":{"isBase":false,"CODE":"[STONE_AV]","isMetric":"no","class":"avoirdupois","names":["stone","British stone"],"properties":["mass"],"values":[{"printable":"14","numeric":14}]}}};},
          "[in_i'H2O]",
          { type: "literal", value: "[in_i'H2O]", description: "\"[in_i'H2O]\"" },
          function(u) {return {"value": 1, "units": {"[in_i'H2O]": 1}, "metadata": {"[in_i'H2O]":{"isBase":false,"CODE":"[IN_I'H2O]","isMetric":"no","class":"clinical","names":["inch of water column"],"printSymbols":["in&#160;H<sub>\n            <r>2</r>\n         </sub>O"],"properties":["pressure"],"values":[{"printable":"1","numeric":1}]}}};},
          "[ston_av]",
          { type: "literal", value: "[ston_av]", description: "\"[ston_av]\"" },
          function(u) {return {"value": 1, "units": {"[ston_av]": 1}, "metadata": {"[ston_av]":{"isBase":false,"CODE":"[STON_AV]","isMetric":"no","class":"avoirdupois","names":["short ton","U.S. ton"],"properties":["mass"],"values":[{"printable":"20","numeric":20}]}}};},
          "[TCID_50]",
          { type: "literal", value: "[TCID_50]", description: "\"[TCID_50]\"" },
          function(u) {return {"value": 1, "units": {"[TCID_50]": 1}, "metadata": {"[TCID_50]":{"isBase":false,"CODE":"[TCID_50]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["50% tissue culture infectious dose"],"printSymbols":["TCID<sub>50</sub>"],"properties":["biologic activity (infectivity) of an infectious agent preparation"],"values":[{"printable":"1","numeric":1}]}}};},
          "[CCID_50]",
          { type: "literal", value: "[CCID_50]", description: "\"[CCID_50]\"" },
          function(u) {return {"value": 1, "units": {"[CCID_50]": 1}, "metadata": {"[CCID_50]":{"isBase":false,"CODE":"[CCID_50]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["50% cell culture infectious dose"],"printSymbols":["CCID<sub>50</sub>"],"properties":["biologic activity (infectivity) of an infectious agent preparation"],"values":[{"printable":"1","numeric":1}]}}};},
          "[scwt_av]",
          { type: "literal", value: "[scwt_av]", description: "\"[scwt_av]\"" },
          function(u) {return {"value": 1, "units": {"[scwt_av]": 1}, "metadata": {"[scwt_av]":{"isBase":false,"CODE":"[SCWT_AV]","isMetric":"no","class":"avoirdupois","names":["short hundredweight","U.S. hundredweight"],"properties":["mass"],"values":[{"printable":"100","numeric":100}]}}};},
          "[lcwt_av]",
          { type: "literal", value: "[lcwt_av]", description: "\"[lcwt_av]\"" },
          function(u) {return {"value": 1, "units": {"[lcwt_av]": 1}, "metadata": {"[lcwt_av]":{"isBase":false,"CODE":"[LCWT_AV]","isMetric":"no","class":"avoirdupois","names":["long hunderdweight","British hundredweight"],"properties":["mass"],"values":[{"printable":"112","numeric":112}]}}};},
          "[lton_av]",
          { type: "literal", value: "[lton_av]", description: "\"[lton_av]\"" },
          function(u) {return {"value": 1, "units": {"[lton_av]": 1}, "metadata": {"[lton_av]":{"isBase":false,"CODE":"[LTON_AV]","isMetric":"no","class":"avoirdupois","names":["long ton","British ton"],"properties":["mass"],"values":[{"printable":"20","numeric":20}]}}};},
          "[in_i'Hg]",
          { type: "literal", value: "[in_i'Hg]", description: "\"[in_i'Hg]\"" },
          function(u) {return {"value": 1, "units": {"[in_i'Hg]": 1}, "metadata": {"[in_i'Hg]":{"isBase":false,"CODE":"[IN_I'HG]","isMetric":"no","class":"clinical","names":["inch of mercury column"],"printSymbols":["in&#160;Hg"],"properties":["pressure"],"values":[{"printable":"1","numeric":1}]}}};},
          "[tbs_us]",
          { type: "literal", value: "[tbs_us]", description: "\"[tbs_us]\"" },
          function(u) {return {"value": 1, "units": {"[tbs_us]": 1}, "metadata": {"[tbs_us]":{"isBase":false,"CODE":"[TBS_US]","isMetric":"no","class":"us-volumes","names":["tablespoon"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[dpt_us]",
          { type: "literal", value: "[dpt_us]", description: "\"[dpt_us]\"" },
          function(u) {return {"value": 1, "units": {"[dpt_us]": 1}, "metadata": {"[dpt_us]":{"isBase":false,"CODE":"[DPT_US]","isMetric":"no","class":"us-volumes","names":["dry pint"],"properties":["dry volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[bdsk'U]",
          { type: "literal", value: "[bdsk'U]", description: "\"[bdsk'U]\"" },
          function(u) {return {"value": 1, "units": {"[bdsk'U]": 1}, "metadata": {"[bdsk'U]":{"isBase":false,"CODE":"[BDSK'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["Bodansky unit"],"properties":["biologic activity of phosphatase"],"values":[{"printable":"1","numeric":1}]}}};},
          "[smgy'U]",
          { type: "literal", value: "[smgy'U]", description: "\"[smgy'U]\"" },
          function(u) {return {"value": 1, "units": {"[smgy'U]": 1}, "metadata": {"[smgy'U]":{"isBase":false,"CODE":"[SMGY'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["Somogyi unit"],"properties":["biologic activity of amylase"],"values":[{"printable":"1","numeric":1}]}}};},
          "[dqt_us]",
          { type: "literal", value: "[dqt_us]", description: "\"[dqt_us]\"" },
          function(u) {return {"value": 1, "units": {"[dqt_us]": 1}, "metadata": {"[dqt_us]":{"isBase":false,"CODE":"[DQT_US]","isMetric":"no","class":"us-volumes","names":["dry quart"],"properties":["dry volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[todd'U]",
          { type: "literal", value: "[todd'U]", description: "\"[todd'U]\"" },
          function(u) {return {"value": 1, "units": {"[todd'U]": 1}, "metadata": {"[todd'U]":{"isBase":false,"CODE":"[TODD'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["Todd unit"],"properties":["biologic activity antistreptolysin O"],"values":[{"printable":"1","numeric":1}]}}};},
          "[D'ag'U]",
          { type: "literal", value: "[D'ag'U]", description: "\"[D'ag'U]\"" },
          function(u) {return {"value": 1, "units": {"[D'ag'U]": 1}, "metadata": {"[D'ag'U]":{"isBase":false,"CODE":"[D'AG'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["D-antigen unit"],"printSymbols":[""],"properties":["procedure defined amount of a poliomyelitis d-antigen substance"],"values":[{"printable":"1","numeric":1}]}}};},
          "[beth'U]",
          { type: "literal", value: "[beth'U]", description: "\"[beth'U]\"" },
          function(u) {return {"value": 1, "units": {"[beth'U]": 1}, "metadata": {"[beth'U]":{"isBase":false,"CODE":"[BETH'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["Bethesda unit"],"properties":["biologic activity of factor VIII inhibitor"],"values":[{"printable":"1","numeric":1}]}}};},
          "[gal_wi]",
          { type: "literal", value: "[gal_wi]", description: "\"[gal_wi]\"" },
          function(u) {return {"value": 1, "units": {"[gal_wi]": 1}, "metadata": {"[gal_wi]":{"isBase":false,"CODE":"[GAL_WI]","isMetric":"no","class":"us-volumes","names":["historical winchester gallon"],"properties":["dry volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[crd_us]",
          { type: "literal", value: "[crd_us]", description: "\"[crd_us]\"" },
          function(u) {return {"value": 1, "units": {"[crd_us]": 1}, "metadata": {"[crd_us]":{"isBase":false,"CODE":"[CRD_US]","isMetric":"no","class":"us-volumes","names":["cord"],"properties":["fluid volume"],"values":[{"printable":"128","numeric":128}]}}};},
          "[min_us]",
          { type: "literal", value: "[min_us]", description: "\"[min_us]\"" },
          function(u) {return {"value": 1, "units": {"[min_us]": 1}, "metadata": {"[min_us]":{"isBase":false,"CODE":"[MIN_US]","isMetric":"no","class":"us-volumes","names":["minim"],"properties":["fluid volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[fdr_us]",
          { type: "literal", value: "[fdr_us]", description: "\"[fdr_us]\"" },
          function(u) {return {"value": 1, "units": {"[fdr_us]": 1}, "metadata": {"[fdr_us]":{"isBase":false,"CODE":"[FDR_US]","isMetric":"no","class":"us-volumes","names":["fluid dram"],"properties":["fluid volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[foz_us]",
          { type: "literal", value: "[foz_us]", description: "\"[foz_us]\"" },
          function(u) {return {"value": 1, "units": {"[foz_us]": 1}, "metadata": {"[foz_us]":{"isBase":false,"CODE":"[FOZ_US]","isMetric":"no","class":"us-volumes","names":["fluid ounce"],"printSymbols":["oz fl"],"properties":["fluid volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[gil_us]",
          { type: "literal", value: "[gil_us]", description: "\"[gil_us]\"" },
          function(u) {return {"value": 1, "units": {"[gil_us]": 1}, "metadata": {"[gil_us]":{"isBase":false,"CODE":"[GIL_US]","isMetric":"no","class":"us-volumes","names":["gill"],"properties":["fluid volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[bbl_us]",
          { type: "literal", value: "[bbl_us]", description: "\"[bbl_us]\"" },
          function(u) {return {"value": 1, "units": {"[bbl_us]": 1}, "metadata": {"[bbl_us]":{"isBase":false,"CODE":"[BBL_US]","isMetric":"no","class":"us-volumes","names":["barrel"],"properties":["fluid volume"],"values":[{"printable":"42","numeric":42}]}}};},
          "[gal_us]",
          { type: "literal", value: "[gal_us]", description: "\"[gal_us]\"" },
          function(u) {return {"value": 1, "units": {"[gal_us]": 1}, "metadata": {"[gal_us]":{"isBase":false,"CODE":"[GAL_US]","isMetric":"no","class":"us-volumes","names":["Queen Anne's wine gallon"],"properties":["fluid volume"],"values":[{"printable":"231","numeric":231}]}}};},
          "[acr_br]",
          { type: "literal", value: "[acr_br]", description: "\"[acr_br]\"" },
          function(u) {return {"value": 1, "units": {"[acr_br]": 1}, "metadata": {"[acr_br]":{"isBase":false,"CODE":"[ACR_BR]","isMetric":"no","class":"brit-length","names":["acre"],"properties":["area"],"values":[{"printable":"4840","numeric":4840}]}}};},
          "[nmi_br]",
          { type: "literal", value: "[nmi_br]", description: "\"[nmi_br]\"" },
          function(u) {return {"value": 1, "units": {"[nmi_br]": 1}, "metadata": {"[nmi_br]":{"isBase":false,"CODE":"[NMI_BR]","isMetric":"no","class":"brit-length","names":["nautical mile"],"properties":["length"],"values":[{"printable":"6080","numeric":6080}]}}};},
          "[fth_br]",
          { type: "literal", value: "[fth_br]", description: "\"[fth_br]\"" },
          function(u) {return {"value": 1, "units": {"[fth_br]": 1}, "metadata": {"[fth_br]":{"isBase":false,"CODE":"[FTH_BR]","isMetric":"no","class":"brit-length","names":["fathom"],"properties":["length"],"values":[{"printable":"6","numeric":6}]}}};},
          "[mil_us]",
          { type: "literal", value: "[mil_us]", description: "\"[mil_us]\"" },
          function(u) {return {"value": 1, "units": {"[mil_us]": 1}, "metadata": {"[mil_us]":{"isBase":false,"CODE":"[MIL_US]","isMetric":"no","class":"us-lengths","names":["mil"],"properties":["length"],"values":[{"printable":"1 &#215; 10<sup>-3</sup>","numeric":0.001}]}}};},
          "[smi_us]",
          { type: "literal", value: "[smi_us]", description: "\"[smi_us]\"" },
          function(u) {return {"value": 1, "units": {"[smi_us]": 1}, "metadata": {"[smi_us]":{"isBase":false,"CODE":"[SMI_US]","isMetric":"no","class":"us-lengths","names":["square mile"],"properties":["area"],"values":[{"printable":"1","numeric":1}]}}};},
          "[acr_us]",
          { type: "literal", value: "[acr_us]", description: "\"[acr_us]\"" },
          function(u) {return {"value": 1, "units": {"[acr_us]": 1}, "metadata": {"[acr_us]":{"isBase":false,"CODE":"[ACR_US]","isMetric":"no","class":"us-lengths","names":["acre"],"properties":["area"],"values":[{"printable":"160","numeric":160}]}}};},
          "[fur_us]",
          { type: "literal", value: "[fur_us]", description: "\"[fur_us]\"" },
          function(u) {return {"value": 1, "units": {"[fur_us]": 1}, "metadata": {"[fur_us]":{"isBase":false,"CODE":"[FUR_US]","isMetric":"no","class":"us-lengths","names":["furlong"],"properties":["length"],"values":[{"printable":"40","numeric":40}]}}};},
          "[fth_us]",
          { type: "literal", value: "[fth_us]", description: "\"[fth_us]\"" },
          function(u) {return {"value": 1, "units": {"[fth_us]": 1}, "metadata": {"[fth_us]":{"isBase":false,"CODE":"[FTH_US]","isMetric":"no","class":"us-lengths","names":["fathom"],"properties":["length"],"values":[{"printable":"6","numeric":6}]}}};},
          "[rlk_us]",
          { type: "literal", value: "[rlk_us]", description: "\"[rlk_us]\"" },
          function(u) {return {"value": 1, "units": {"[rlk_us]": 1}, "metadata": {"[rlk_us]":{"isBase":false,"CODE":"[RLK_US]","isMetric":"no","class":"us-lengths","names":["link for Ramden's chain"],"properties":["length"],"values":[{"printable":"1","numeric":1}]}}};},
          "[rch_us]",
          { type: "literal", value: "[rch_us]", description: "\"[rch_us]\"" },
          function(u) {return {"value": 1, "units": {"[rch_us]": 1}, "metadata": {"[rch_us]":{"isBase":false,"CODE":"[RCH_US]","isMetric":"no","class":"us-lengths","names":["Ramden's chain","Engineer's chain"],"properties":["length"],"values":[{"printable":"100","numeric":100}]}}};},
          "[lbf_av]",
          { type: "literal", value: "[lbf_av]", description: "\"[lbf_av]\"" },
          function(u) {return {"value": 1, "units": {"[lbf_av]": 1}, "metadata": {"[lbf_av]":{"isBase":false,"CODE":"[LBF_AV]","isMetric":"no","class":"const","names":["pound force"],"printSymbols":["lbf"],"properties":["force"],"values":[{"printable":"1","numeric":1}]}}};},
          "[hnsf'U]",
          { type: "literal", value: "[hnsf'U]", description: "\"[hnsf'U]\"" },
          function(u) {return {"value": 1, "units": {"[hnsf'U]": 1}, "metadata": {"[hnsf'U]":{"isBase":false,"CODE":"[HNSF'U]","isMetric":"no","class":"clinical","names":["Hounsfield unit"],"printSymbols":["HF"],"properties":["x-ray attenuation"],"values":[{"printable":"1","numeric":1}]}}};},
          "[mesh_i]",
          { type: "literal", value: "[mesh_i]", description: "\"[mesh_i]\"" },
          function(u) {return {"value": 1, "units": {"[mesh_i]": 1}, "metadata": {"[mesh_i]":{"isBase":false,"CODE":"[MESH_I]","isMetric":"no","class":"clinical","names":["mesh"],"properties":["lineic number"],"values":[{"printable":"1","numeric":1}]}}};},
          "%[slope]",
          { type: "literal", value: "%[slope]", description: "\"%[slope]\"" },
          function(u) {return {"value": 1, "units": {"%[slope]": 1}, "metadata": {"%[slope]":{"isBase":false,"CODE":"%[SLOPE]","isMetric":"no","isSpecial":"yes","class":"clinical","names":["percent of slope"],"printSymbols":["%"],"properties":["slope"],"values":[{"printable":"<function name=\"100tan\" value=\"1\" Unit=\"deg\"/>","numeric":null}]}}};},
          "[p'diop]",
          { type: "literal", value: "[p'diop]", description: "\"[p'diop]\"" },
          function(u) {return {"value": 1, "units": {"[p'diop]": 1}, "metadata": {"[p'diop]":{"isBase":false,"CODE":"[P'DIOP]","isMetric":"no","isSpecial":"yes","class":"clinical","names":["prism diopter"],"printSymbols":["PD"],"properties":["refraction of a prism"],"values":[{"printable":"<function name=\"tanTimes100\" value=\"1\" Unit=\"deg\"/>","numeric":null}]}}};},
          "[gil_br]",
          { type: "literal", value: "[gil_br]", description: "\"[gil_br]\"" },
          function(u) {return {"value": 1, "units": {"[gil_br]": 1}, "metadata": {"[gil_br]":{"isBase":false,"CODE":"[GIL_BR]","isMetric":"no","class":"brit-volumes","names":["gill"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[wood'U]",
          { type: "literal", value: "[wood'U]", description: "\"[wood'U]\"" },
          function(u) {return {"value": 1, "units": {"[wood'U]": 1}, "metadata": {"[wood'U]":{"isBase":false,"CODE":"[WOOD'U]","isMetric":"no","class":"clinical","names":["Wood unit"],"printSymbols":["Wood U."],"properties":["fluid resistance"],"values":[{"printable":"1","numeric":1}]}}};},
          "cal_[15]",
          { type: "literal", value: "cal_[15]", description: "\"cal_[15]\"" },
          function(u) {return {"value": 1, "units": {"cal_[15]": 1}, "metadata": {"cal_[15]":{"isBase":false,"CODE":"CAL_[15]","isMetric":"yes","class":"heat","names":["calorie at 15 °C"],"printSymbols":["cal<sub>15&#176;C</sub>"],"properties":["energy"],"values":[{"printable":"4.18580","numeric":4.1858}]}}};},
          "cal_[20]",
          { type: "literal", value: "cal_[20]", description: "\"cal_[20]\"" },
          function(u) {return {"value": 1, "units": {"cal_[20]": 1}, "metadata": {"cal_[20]":{"isBase":false,"CODE":"CAL_[20]","isMetric":"yes","class":"heat","names":["calorie at 20 °C"],"printSymbols":["cal<sub>20&#176;C</sub>"],"properties":["energy"],"values":[{"printable":"4.18190","numeric":4.1819}]}}};},
          "[foz_br]",
          { type: "literal", value: "[foz_br]", description: "\"[foz_br]\"" },
          function(u) {return {"value": 1, "units": {"[foz_br]": 1}, "metadata": {"[foz_br]":{"isBase":false,"CODE":"[FOZ_BR]","isMetric":"no","class":"brit-volumes","names":["fluid ounce"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[fdr_br]",
          { type: "literal", value: "[fdr_br]", description: "\"[fdr_br]\"" },
          function(u) {return {"value": 1, "units": {"[fdr_br]": 1}, "metadata": {"[fdr_br]":{"isBase":false,"CODE":"[FDR_BR]","isMetric":"no","class":"brit-volumes","names":["fluid dram"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[srd_us]",
          { type: "literal", value: "[srd_us]", description: "\"[srd_us]\"" },
          function(u) {return {"value": 1, "units": {"[srd_us]": 1}, "metadata": {"[srd_us]":{"isBase":false,"CODE":"[SRD_US]","isMetric":"no","class":"us-lengths","names":["square rod"],"properties":["area"],"values":[{"printable":"1","numeric":1}]}}};},
          "[min_br]",
          { type: "literal", value: "[min_br]", description: "\"[min_br]\"" },
          function(u) {return {"value": 1, "units": {"[min_br]": 1}, "metadata": {"[min_br]":{"isBase":false,"CODE":"[MIN_BR]","isMetric":"no","class":"brit-volumes","names":["minim"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[EID_50]",
          { type: "literal", value: "[EID_50]", description: "\"[EID_50]\"" },
          function(u) {return {"value": 1, "units": {"[EID_50]": 1}, "metadata": {"[EID_50]":{"isBase":false,"CODE":"[EID_50]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["50% embryo infectious dose"],"printSymbols":["EID<sub>50</sub>"],"properties":["biologic activity (infectivity) of an infectious agent preparation"],"values":[{"printable":"1","numeric":1}]}}};},
          "[Btu_th]",
          { type: "literal", value: "[Btu_th]", description: "\"[Btu_th]\"" },
          function(u) {return {"value": 1, "units": {"[Btu_th]": 1}, "metadata": {"[Btu_th]":{"isBase":false,"CODE":"[BTU_TH]","isMetric":"no","class":"heat","names":["thermochemical British thermal unit"],"printSymbols":["Btu<sub>th</sub>"],"properties":["energy"],"values":[{"printable":"1.054350","numeric":1.05435}]}}};},
          "[Btu_IT]",
          { type: "literal", value: "[Btu_IT]", description: "\"[Btu_IT]\"" },
          function(u) {return {"value": 1, "units": {"[Btu_IT]": 1}, "metadata": {"[Btu_IT]":{"isBase":false,"CODE":"[BTU_IT]","isMetric":"no","class":"heat","names":["international table British thermal unit"],"printSymbols":["Btu<sub>IT</sub>"],"properties":["energy"],"values":[{"printable":"1.05505585262","numeric":1.05505585262}]}}};},
          "[car_Au]",
          { type: "literal", value: "[car_Au]", description: "\"[car_Au]\"" },
          function(u) {return {"value": 1, "units": {"[car_Au]": 1}, "metadata": {"[car_Au]":{"isBase":false,"CODE":"[CAR_AU]","isMetric":"no","class":"misc","names":["carat of gold alloys"],"printSymbols":["ct<sub>\n            <r>Au</r>\n         </sub>"],"properties":["mass fraction"],"values":[{"printable":"1","numeric":1}]}}};},
          "[Btu_60]",
          { type: "literal", value: "[Btu_60]", description: "\"[Btu_60]\"" },
          function(u) {return {"value": 1, "units": {"[Btu_60]": 1}, "metadata": {"[Btu_60]":{"isBase":false,"CODE":"[BTU_60]","isMetric":"no","class":"heat","names":["British thermal unit at 60 °F"],"printSymbols":["Btu<sub>60&#176;F</sub>"],"properties":["energy"],"values":[{"printable":"1.05468","numeric":1.05468}]}}};},
          "[Btu_59]",
          { type: "literal", value: "[Btu_59]", description: "\"[Btu_59]\"" },
          function(u) {return {"value": 1, "units": {"[Btu_59]": 1}, "metadata": {"[Btu_59]":{"isBase":false,"CODE":"[BTU_59]","isMetric":"no","class":"heat","names":["British thermal unit at 59 °F"],"printSymbols":["Btu<sub>59&#176;F</sub>"],"properties":["energy"],"values":[{"printable":"1.05480","numeric":1.0548}]}}};},
          "[Btu_39]",
          { type: "literal", value: "[Btu_39]", description: "\"[Btu_39]\"" },
          function(u) {return {"value": 1, "units": {"[Btu_39]": 1}, "metadata": {"[Btu_39]":{"isBase":false,"CODE":"[BTU_39]","isMetric":"no","class":"heat","names":["British thermal unit at 39 °F"],"printSymbols":["Btu<sub>39&#176;F</sub>"],"properties":["energy"],"values":[{"printable":"1.05967","numeric":1.05967}]}}};},
          "[cup_us]",
          { type: "literal", value: "[cup_us]", description: "\"[cup_us]\"" },
          function(u) {return {"value": 1, "units": {"[cup_us]": 1}, "metadata": {"[cup_us]":{"isBase":false,"CODE":"[CUP_US]","isMetric":"no","class":"us-volumes","names":["cup"],"properties":["volume"],"values":[{"printable":"16","numeric":16}]}}};},
          "B[10.nV]",
          { type: "literal", value: "B[10.nV]", description: "\"B[10.nV]\"" },
          function(u) {return {"value": 1, "units": {"B[10.nV]": 1}, "metadata": {"B[10.nV]":{"isBase":false,"CODE":"B[10.NV]","isMetric":"yes","isSpecial":"yes","class":"levels","names":["bel 10 nanovolt"],"printSymbols":["B(10 nV)"],"properties":["electric potential level"],"values":[{"printable":"<function name=\"lgTimes2\" value=\"10\" Unit=\"nV\"/>","numeric":null}]}}};},
          "[tsp_us]",
          { type: "literal", value: "[tsp_us]", description: "\"[tsp_us]\"" },
          function(u) {return {"value": 1, "units": {"[tsp_us]": 1}, "metadata": {"[tsp_us]":{"isBase":false,"CODE":"[TSP_US]","isMetric":"no","class":"us-volumes","names":["teaspoon"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[mclg'U]",
          { type: "literal", value: "[mclg'U]", description: "\"[mclg'U]\"" },
          function(u) {return {"value": 1, "units": {"[mclg'U]": 1}, "metadata": {"[mclg'U]":{"isBase":false,"CODE":"[MCLG'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["Mac Lagan unit"],"properties":["arbitrary biologic activity"],"values":[{"printable":"1","numeric":1}]}}};},
          "[cicero]",
          { type: "literal", value: "[cicero]", description: "\"[cicero]\"" },
          function(u) {return {"value": 1, "units": {"[cicero]": 1}, "metadata": {"[cicero]":{"isBase":false,"CODE":"[CICERO]","isMetric":"no","class":"typeset","names":["cicero","Didot's pica"],"properties":["length"],"values":[{"printable":"12","numeric":12}]}}};},
          "[pwt_tr]",
          { type: "literal", value: "[pwt_tr]", description: "\"[pwt_tr]\"" },
          function(u) {return {"value": 1, "units": {"[pwt_tr]": 1}, "metadata": {"[pwt_tr]":{"isBase":false,"CODE":"[PWT_TR]","isMetric":"no","class":"troy","names":["pennyweight"],"printSymbols":["dwt"],"properties":["mass"],"values":[{"printable":"24","numeric":24}]}}};},
          "[pnt_pr]",
          { type: "literal", value: "[pnt_pr]", description: "\"[pnt_pr]\"" },
          function(u) {return {"value": 1, "units": {"[pnt_pr]": 1}, "metadata": {"[pnt_pr]":{"isBase":false,"CODE":"[PNT_PR]","isMetric":"no","class":"typeset","names":["Printer's point"],"properties":["length"],"values":[{"printable":"0.013837","numeric":0.013837}]}}};},
          "[pca_pr]",
          { type: "literal", value: "[pca_pr]", description: "\"[pca_pr]\"" },
          function(u) {return {"value": 1, "units": {"[pca_pr]": 1}, "metadata": {"[pca_pr]":{"isBase":false,"CODE":"[PCA_PR]","isMetric":"no","class":"typeset","names":["Printer's pica"],"properties":["length"],"values":[{"printable":"12","numeric":12}]}}};},
          "[gal_br]",
          { type: "literal", value: "[gal_br]", description: "\"[gal_br]\"" },
          function(u) {return {"value": 1, "units": {"[gal_br]": 1}, "metadata": {"[gal_br]":{"isBase":false,"CODE":"[GAL_BR]","isMetric":"no","class":"brit-volumes","names":["gallon"],"properties":["volume"],"values":[{"printable":"4.54609","numeric":4.54609}]}}};},
          "[yd_us]",
          { type: "literal", value: "[yd_us]", description: "\"[yd_us]\"" },
          function(u) {return {"value": 1, "units": {"[yd_us]": 1}, "metadata": {"[yd_us]":{"isBase":false,"CODE":"[YD_US]","isMetric":"no","class":"us-lengths","names":["yard"],"properties":["length"],"values":[{"printable":"3","numeric":3}]}}};},
          "[ligne]",
          { type: "literal", value: "[ligne]", description: "\"[ligne]\"" },
          function(u) {return {"value": 1, "units": {"[ligne]": 1}, "metadata": {"[ligne]":{"isBase":false,"CODE":"[LIGNE]","isMetric":"no","class":"typeset","names":["ligne","French line"],"properties":["length"],"values":[{"printable":"1","numeric":1}]}}};},
          "[tbs_m]",
          { type: "literal", value: "[tbs_m]", description: "\"[tbs_m]\"" },
          function(u) {return {"value": 1, "units": {"[tbs_m]": 1}, "metadata": {"[tbs_m]":{"isBase":false,"CODE":"[TBS_M]","isMetric":"no","class":"us-volumes","names":["metric tablespoon"],"properties":["volume"],"values":[{"printable":"15","numeric":15}]}}};},
          "[lb_ap]",
          { type: "literal", value: "[lb_ap]", description: "\"[lb_ap]\"" },
          function(u) {return {"value": 1, "units": {"[lb_ap]": 1}, "metadata": {"[lb_ap]":{"isBase":false,"CODE":"[LB_AP]","isMetric":"no","class":"apoth","names":["pound"],"printSymbols":["<strike>lb</strike>"],"properties":["mass"],"values":[{"printable":"12","numeric":12}]}}};},
          "[oz_ap]",
          { type: "literal", value: "[oz_ap]", description: "\"[oz_ap]\"" },
          function(u) {return {"value": 1, "units": {"[oz_ap]": 1}, "metadata": {"[oz_ap]":{"isBase":false,"CODE":"[OZ_AP]","isMetric":"no","class":"apoth","names":["ounce"],"printSymbols":["&#8485;"],"properties":["mass"],"values":[{"printable":"8","numeric":8}]}}};},
          "[dr_ap]",
          { type: "literal", value: "[dr_ap]", description: "\"[dr_ap]\"" },
          function(u) {return {"value": 1, "units": {"[dr_ap]": 1}, "metadata": {"[dr_ap]":{"isBase":false,"CODE":"[DR_AP]","isMetric":"no","class":"apoth","names":["dram","drachm"],"printSymbols":["&#658;"],"properties":["mass"],"values":[{"printable":"3","numeric":3}]}}};},
          "[sc_ap]",
          { type: "literal", value: "[sc_ap]", description: "\"[sc_ap]\"" },
          function(u) {return {"value": 1, "units": {"[sc_ap]": 1}, "metadata": {"[sc_ap]":{"isBase":false,"CODE":"[SC_AP]","isMetric":"no","class":"apoth","names":["scruple"],"printSymbols":["&#8456;"],"properties":["mass"],"values":[{"printable":"20","numeric":20}]}}};},
          "[tsp_m]",
          { type: "literal", value: "[tsp_m]", description: "\"[tsp_m]\"" },
          function(u) {return {"value": 1, "units": {"[tsp_m]": 1}, "metadata": {"[tsp_m]":{"isBase":false,"CODE":"[TSP_M]","isMetric":"no","class":"us-volumes","names":["metric teaspoon"],"properties":["volume"],"values":[{"printable":"5","numeric":5}]}}};},
          "[cup_m]",
          { type: "literal", value: "[cup_m]", description: "\"[cup_m]\"" },
          function(u) {return {"value": 1, "units": {"[cup_m]": 1}, "metadata": {"[cup_m]":{"isBase":false,"CODE":"[CUP_M]","isMetric":"no","class":"us-volumes","names":["metric cup"],"properties":["volume"],"values":[{"printable":"240","numeric":240}]}}};},
          "[lb_tr]",
          { type: "literal", value: "[lb_tr]", description: "\"[lb_tr]\"" },
          function(u) {return {"value": 1, "units": {"[lb_tr]": 1}, "metadata": {"[lb_tr]":{"isBase":false,"CODE":"[LB_TR]","isMetric":"no","class":"troy","names":["troy pound"],"printSymbols":["lb t"],"properties":["mass"],"values":[{"printable":"12","numeric":12}]}}};},
          "[oz_tr]",
          { type: "literal", value: "[oz_tr]", description: "\"[oz_tr]\"" },
          function(u) {return {"value": 1, "units": {"[oz_tr]": 1}, "metadata": {"[oz_tr]":{"isBase":false,"CODE":"[OZ_TR]","isMetric":"no","class":"troy","names":["troy ounce"],"printSymbols":["oz t"],"properties":["mass"],"values":[{"printable":"20","numeric":20}]}}};},
          "[didot]",
          { type: "literal", value: "[didot]", description: "\"[didot]\"" },
          function(u) {return {"value": 1, "units": {"[didot]": 1}, "metadata": {"[didot]":{"isBase":false,"CODE":"[DIDOT]","isMetric":"no","class":"typeset","names":["didot","Didot's point"],"properties":["length"],"values":[{"printable":"1","numeric":1}]}}};},
          "[foz_m]",
          { type: "literal", value: "[foz_m]", description: "\"[foz_m]\"" },
          function(u) {return {"value": 1, "units": {"[foz_m]": 1}, "metadata": {"[foz_m]":{"isBase":false,"CODE":"[FOZ_M]","isMetric":"no","class":"us-volumes","names":["metric fluid ounce"],"printSymbols":["oz fl"],"properties":["fluid volume"],"values":[{"printable":"30","numeric":30}]}}};},
          "[car_m]",
          { type: "literal", value: "[car_m]", description: "\"[car_m]\"" },
          function(u) {return {"value": 1, "units": {"[car_m]": 1}, "metadata": {"[car_m]":{"isBase":false,"CODE":"[CAR_M]","isMetric":"no","class":"misc","names":["metric carat"],"printSymbols":["ct<sub>m</sub>"],"properties":["mass"],"values":[{"printable":"0.2","numeric":0.2}]}}};},
          "[smoot]",
          { type: "literal", value: "[smoot]", description: "\"[smoot]\"" },
          function(u) {return {"value": 1, "units": {"[smoot]": 1}, "metadata": {"[smoot]":{"isBase":false,"CODE":"[SMOOT]","isMetric":"no","class":"misc","names":["Smoot"],"printSymbols":[""],"properties":["length"],"values":[{"printable":"67","numeric":67}]}}};},
          "[knk'U]",
          { type: "literal", value: "[knk'U]", description: "\"[knk'U]\"" },
          function(u) {return {"value": 1, "units": {"[knk'U]": 1}, "metadata": {"[knk'U]":{"isBase":false,"CODE":"[KNK'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["Kunkel unit"],"properties":["arbitrary biologic activity"],"values":[{"printable":"1","numeric":1}]}}};},
          "[Btu_m]",
          { type: "literal", value: "[Btu_m]", description: "\"[Btu_m]\"" },
          function(u) {return {"value": 1, "units": {"[Btu_m]": 1}, "metadata": {"[Btu_m]":{"isBase":false,"CODE":"[BTU_M]","isMetric":"no","class":"heat","names":["mean British thermal unit"],"printSymbols":["Btu<sub>m</sub>"],"properties":["energy"],"values":[{"printable":"1.05587","numeric":1.05587}]}}};},
          "[dr_av]",
          { type: "literal", value: "[dr_av]", description: "\"[dr_av]\"" },
          function(u) {return {"value": 1, "units": {"[dr_av]": 1}, "metadata": {"[dr_av]":{"isBase":false,"CODE":"[DR_AV]","isMetric":"no","class":"avoirdupois","names":["dram"],"properties":["mass"],"values":[{"printable":"1","numeric":1}]}}};},
          "[oz_av]",
          { type: "literal", value: "[oz_av]", description: "\"[oz_av]\"" },
          function(u) {return {"value": 1, "units": {"[oz_av]": 1}, "metadata": {"[oz_av]":{"isBase":false,"CODE":"[OZ_AV]","isMetric":"no","class":"avoirdupois","names":["ounce"],"printSymbols":["oz"],"properties":["mass"],"values":[{"printable":"1","numeric":1}]}}};},
          "[lb_av]",
          { type: "literal", value: "[lb_av]", description: "\"[lb_av]\"" },
          function(u) {return {"value": 1, "units": {"[lb_av]": 1}, "metadata": {"[lb_av]":{"isBase":false,"CODE":"[LB_AV]","isMetric":"no","class":"avoirdupois","names":["pound"],"printSymbols":["lb"],"properties":["mass"],"values":[{"printable":"7000","numeric":7000}]}}};},
          "[dye'U]",
          { type: "literal", value: "[dye'U]", description: "\"[dye'U]\"" },
          function(u) {return {"value": 1, "units": {"[dye'U]": 1}, "metadata": {"[dye'U]":{"isBase":false,"CODE":"[DYE'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["Dye unit"],"properties":["biologic activity of amylase"],"values":[{"printable":"1","numeric":1}]}}};},
          "[pk_us]",
          { type: "literal", value: "[pk_us]", description: "\"[pk_us]\"" },
          function(u) {return {"value": 1, "units": {"[pk_us]": 1}, "metadata": {"[pk_us]":{"isBase":false,"CODE":"[PK_US]","isMetric":"no","class":"us-volumes","names":["peck"],"properties":["dry volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[APL'U]",
          { type: "literal", value: "[APL'U]", description: "\"[APL'U]\"" },
          function(u) {return {"value": 1, "units": {"[APL'U]": 1}, "metadata": {"[APL'U]":{"isBase":false,"CODE":"[APL'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["APL unit"],"properties":["biologic activity of anticardiolipin IgA"],"values":[{"printable":"1","numeric":1}]}}};},
          "[bu_us]",
          { type: "literal", value: "[bu_us]", description: "\"[bu_us]\"" },
          function(u) {return {"value": 1, "units": {"[bu_us]": 1}, "metadata": {"[bu_us]":{"isBase":false,"CODE":"[BU_US]","isMetric":"no","class":"us-volumes","names":["bushel"],"properties":["dry volume"],"values":[{"printable":"2150.42","numeric":2150.42}]}}};},
          "[pt_br]",
          { type: "literal", value: "[pt_br]", description: "\"[pt_br]\"" },
          function(u) {return {"value": 1, "units": {"[pt_br]": 1}, "metadata": {"[pt_br]":{"isBase":false,"CODE":"[PT_BR]","isMetric":"no","class":"brit-volumes","names":["pint"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[qt_br]",
          { type: "literal", value: "[qt_br]", description: "\"[qt_br]\"" },
          function(u) {return {"value": 1, "units": {"[qt_br]": 1}, "metadata": {"[qt_br]":{"isBase":false,"CODE":"[QT_BR]","isMetric":"no","class":"brit-volumes","names":["quart"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[bu_br]",
          { type: "literal", value: "[bu_br]", description: "\"[bu_br]\"" },
          function(u) {return {"value": 1, "units": {"[bu_br]": 1}, "metadata": {"[bu_br]":{"isBase":false,"CODE":"[BU_BR]","isMetric":"no","class":"brit-volumes","names":["bushel"],"properties":["volume"],"values":[{"printable":"4","numeric":4}]}}};},
          "[hp'_X]",
          { type: "literal", value: "[hp'_X]", description: "\"[hp'_X]\"" },
          function(u) {return {"value": 1, "units": {"[hp'_X]": 1}, "metadata": {"[hp'_X]":{"isBase":false,"CODE":"[HP'_X]","isMetric":"no","isSpecial":"yes","class":"clinical","names":["homeopathic potency of decimal series (retired)"],"printSymbols":["X"],"properties":["homeopathic potency (retired)"],"values":[{"printable":"<function name=\"hpX\" value=\"1\" Unit=\"1\"/>","numeric":null}]}}};},
          "[MPL'U]",
          { type: "literal", value: "[MPL'U]", description: "\"[MPL'U]\"" },
          function(u) {return {"value": 1, "units": {"[MPL'U]": 1}, "metadata": {"[MPL'U]":{"isBase":false,"CODE":"[MPL'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["MPL unit"],"properties":["biologic activity of anticardiolipin IgM"],"values":[{"printable":"1","numeric":1}]}}};},
          "[GPL'U]",
          { type: "literal", value: "[GPL'U]", description: "\"[GPL'U]\"" },
          function(u) {return {"value": 1, "units": {"[GPL'U]": 1}, "metadata": {"[GPL'U]":{"isBase":false,"CODE":"[GPL'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["GPL unit"],"properties":["biologic activity of anticardiolipin IgG"],"values":[{"printable":"1","numeric":1}]}}};},
          "[USP'U]",
          { type: "literal", value: "[USP'U]", description: "\"[USP'U]\"" },
          function(u) {return {"value": 1, "units": {"[USP'U]": 1}, "metadata": {"[USP'U]":{"isBase":false,"CODE":"[USP'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["United States Pharmacopeia unit"],"printSymbols":["U.S.P."],"properties":["arbitrary"],"values":[{"printable":"1","numeric":1}]}}};},
          "[eps_0]",
          { type: "literal", value: "[eps_0]", description: "\"[eps_0]\"" },
          function(u) {return {"value": 1, "units": {"[eps_0]": 1}, "metadata": {"[eps_0]":{"isBase":false,"CODE":"[EPS_0]","isMetric":"yes","class":"const","names":["permittivity of vacuum"],"printSymbols":["<i>&#949;<sub>\n               <r>0</r>\n            </sub>\n         </i>"],"properties":["electric permittivity"],"values":[{"printable":"8.854187817 &#215; 10<sup>-12</sup>","numeric":8.854187817e-12}]}}};},
          "[fth_i]",
          { type: "literal", value: "[fth_i]", description: "\"[fth_i]\"" },
          function(u) {return {"value": 1, "units": {"[fth_i]": 1}, "metadata": {"[fth_i]":{"isBase":false,"CODE":"[FTH_I]","isMetric":"no","class":"intcust","names":["fathom"],"printSymbols":["fth"],"properties":["depth of water"],"values":[{"printable":"6","numeric":6}]}}};},
          "[nmi_i]",
          { type: "literal", value: "[nmi_i]", description: "\"[nmi_i]\"" },
          function(u) {return {"value": 1, "units": {"[nmi_i]": 1}, "metadata": {"[nmi_i]":{"isBase":false,"CODE":"[NMI_I]","isMetric":"no","class":"intcust","names":["nautical mile"],"printSymbols":["n.mi"],"properties":["length"],"values":[{"printable":"1852","numeric":1852}]}}};},
          "[pt_us]",
          { type: "literal", value: "[pt_us]", description: "\"[pt_us]\"" },
          function(u) {return {"value": 1, "units": {"[pt_us]": 1}, "metadata": {"[pt_us]":{"isBase":false,"CODE":"[PT_US]","isMetric":"no","class":"us-volumes","names":["pint"],"properties":["fluid volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[sin_i]",
          { type: "literal", value: "[sin_i]", description: "\"[sin_i]\"" },
          function(u) {return {"value": 1, "units": {"[sin_i]": 1}, "metadata": {"[sin_i]":{"isBase":false,"CODE":"[SIN_I]","isMetric":"no","class":"intcust","names":["square inch"],"properties":["area"],"values":[{"printable":"1","numeric":1}]}}};},
          "[sft_i]",
          { type: "literal", value: "[sft_i]", description: "\"[sft_i]\"" },
          function(u) {return {"value": 1, "units": {"[sft_i]": 1}, "metadata": {"[sft_i]":{"isBase":false,"CODE":"[SFT_I]","isMetric":"no","class":"intcust","names":["square foot"],"properties":["area"],"values":[{"printable":"1","numeric":1}]}}};},
          "[syd_i]",
          { type: "literal", value: "[syd_i]", description: "\"[syd_i]\"" },
          function(u) {return {"value": 1, "units": {"[syd_i]": 1}, "metadata": {"[syd_i]":{"isBase":false,"CODE":"[SYD_I]","isMetric":"no","class":"intcust","names":["square yard"],"properties":["area"],"values":[{"printable":"1","numeric":1}]}}};},
          "[cin_i]",
          { type: "literal", value: "[cin_i]", description: "\"[cin_i]\"" },
          function(u) {return {"value": 1, "units": {"[cin_i]": 1}, "metadata": {"[cin_i]":{"isBase":false,"CODE":"[CIN_I]","isMetric":"no","class":"intcust","names":["cubic inch"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[cft_i]",
          { type: "literal", value: "[cft_i]", description: "\"[cft_i]\"" },
          function(u) {return {"value": 1, "units": {"[cft_i]": 1}, "metadata": {"[cft_i]":{"isBase":false,"CODE":"[CFT_I]","isMetric":"no","class":"intcust","names":["cubic foot"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[cyd_i]",
          { type: "literal", value: "[cyd_i]", description: "\"[cyd_i]\"" },
          function(u) {return {"value": 1, "units": {"[cyd_i]": 1}, "metadata": {"[cyd_i]":{"isBase":false,"CODE":"[CYD_I]","isMetric":"no","class":"intcust","names":["cubic yard"],"printSymbols":["cu.yd"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[qt_us]",
          { type: "literal", value: "[qt_us]", description: "\"[qt_us]\"" },
          function(u) {return {"value": 1, "units": {"[qt_us]": 1}, "metadata": {"[qt_us]":{"isBase":false,"CODE":"[QT_US]","isMetric":"no","class":"us-volumes","names":["quart"],"properties":["fluid volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[arb'U]",
          { type: "literal", value: "[arb'U]", description: "\"[arb'U]\"" },
          function(u) {return {"value": 1, "units": {"[arb'U]": 1}, "metadata": {"[arb'U]":{"isBase":false,"CODE":"[ARB'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["arbitary unit"],"printSymbols":["arb. U"],"properties":["arbitrary"],"values":[{"printable":"1","numeric":1}]}}};},
          "[mil_i]",
          { type: "literal", value: "[mil_i]", description: "\"[mil_i]\"" },
          function(u) {return {"value": 1, "units": {"[mil_i]": 1}, "metadata": {"[mil_i]":{"isBase":false,"CODE":"[MIL_I]","isMetric":"no","class":"intcust","names":["mil"],"printSymbols":["mil"],"properties":["length"],"values":[{"printable":"1 &#215; 10<sup>-3</sup>","numeric":0.001}]}}};},
          "[cml_i]",
          { type: "literal", value: "[cml_i]", description: "\"[cml_i]\"" },
          function(u) {return {"value": 1, "units": {"[cml_i]": 1}, "metadata": {"[cml_i]":{"isBase":false,"CODE":"[CML_I]","isMetric":"no","class":"intcust","names":["circular mil"],"printSymbols":["circ.mil"],"properties":["area"],"values":[{"printable":"1","numeric":1}]}}};},
          "[kn_br]",
          { type: "literal", value: "[kn_br]", description: "\"[kn_br]\"" },
          function(u) {return {"value": 1, "units": {"[kn_br]": 1}, "metadata": {"[kn_br]":{"isBase":false,"CODE":"[KN_BR]","isMetric":"no","class":"brit-length","names":["knot"],"properties":["velocity"],"values":[{"printable":"1","numeric":1}]}}};},
          "[ft_us]",
          { type: "literal", value: "[ft_us]", description: "\"[ft_us]\"" },
          function(u) {return {"value": 1, "units": {"[ft_us]": 1}, "metadata": {"[ft_us]":{"isBase":false,"CODE":"[FT_US]","isMetric":"no","class":"us-lengths","names":["foot"],"printSymbols":["ft<sub>us</sub>"],"properties":["length"],"values":[{"printable":"1200","numeric":1200}]}}};},
          "[pouce]",
          { type: "literal", value: "[pouce]", description: "\"[pouce]\"" },
          function(u) {return {"value": 1, "units": {"[pouce]": 1}, "metadata": {"[pouce]":{"isBase":false,"CODE":"[POUCE]","isMetric":"no","class":"typeset","names":["pouce","French inch"],"properties":["length"],"values":[{"printable":"1","numeric":1}]}}};},
          "[in_us]",
          { type: "literal", value: "[in_us]", description: "\"[in_us]\"" },
          function(u) {return {"value": 1, "units": {"[in_us]": 1}, "metadata": {"[in_us]":{"isBase":false,"CODE":"[IN_US]","isMetric":"no","class":"us-lengths","names":["inch"],"properties":["length"],"values":[{"printable":"1","numeric":1}]}}};},
          "[rd_us]",
          { type: "literal", value: "[rd_us]", description: "\"[rd_us]\"" },
          function(u) {return {"value": 1, "units": {"[rd_us]": 1}, "metadata": {"[rd_us]":{"isBase":false,"CODE":"[RD_US]","isMetric":"no","class":"us-lengths","names":["rod"],"properties":["length"],"values":[{"printable":"16.5","numeric":16.5}]}}};},
          "[ch_us]",
          { type: "literal", value: "[ch_us]", description: "\"[ch_us]\"" },
          function(u) {return {"value": 1, "units": {"[ch_us]": 1}, "metadata": {"[ch_us]":{"isBase":false,"CODE":"[CH_US]","isMetric":"no","class":"us-lengths","names":["Gunter's chain","Surveyor's chain"],"properties":["length"],"values":[{"printable":"4","numeric":4}]}}};},
          "[lk_us]",
          { type: "literal", value: "[lk_us]", description: "\"[lk_us]\"" },
          function(u) {return {"value": 1, "units": {"[lk_us]": 1}, "metadata": {"[lk_us]":{"isBase":false,"CODE":"[LK_US]","isMetric":"no","class":"us-lengths","names":["link for Gunter's chain"],"properties":["length"],"values":[{"printable":"1","numeric":1}]}}};},
          "[hp'_C]",
          { type: "literal", value: "[hp'_C]", description: "\"[hp'_C]\"" },
          function(u) {return {"value": 1, "units": {"[hp'_C]": 1}, "metadata": {"[hp'_C]":{"isBase":false,"CODE":"[HP'_C]","isMetric":"no","isSpecial":"yes","class":"clinical","names":["homeopathic potency of centesimal series (retired)"],"printSymbols":["C"],"properties":["homeopathic potency (retired)"],"values":[{"printable":"<function name=\"hpC\" value=\"1\" Unit=\"1\"/>","numeric":null}]}}};},
          "[hp'_M]",
          { type: "literal", value: "[hp'_M]", description: "\"[hp'_M]\"" },
          function(u) {return {"value": 1, "units": {"[hp'_M]": 1}, "metadata": {"[hp'_M]":{"isBase":false,"CODE":"[HP'_M]","isMetric":"no","isSpecial":"yes","class":"clinical","names":["homeopathic potency of millesimal series (retired)"],"printSymbols":["M"],"properties":["homeopathic potency (retired)"],"values":[{"printable":"<function name=\"hpM\" value=\"1\" Unit=\"1\"/>","numeric":null}]}}};},
          "[hp'_Q]",
          { type: "literal", value: "[hp'_Q]", description: "\"[hp'_Q]\"" },
          function(u) {return {"value": 1, "units": {"[hp'_Q]": 1}, "metadata": {"[hp'_Q]":{"isBase":false,"CODE":"[HP'_Q]","isMetric":"no","isSpecial":"yes","class":"clinical","names":["homeopathic potency of quintamillesimal series (retired)"],"printSymbols":["Q"],"properties":["homeopathic potency (retired)"],"values":[{"printable":"<function name=\"hpQ\" value=\"1\" Unit=\"1\"/>","numeric":null}]}}};},
          "[mi_br]",
          { type: "literal", value: "[mi_br]", description: "\"[mi_br]\"" },
          function(u) {return {"value": 1, "units": {"[mi_br]": 1}, "metadata": {"[mi_br]":{"isBase":false,"CODE":"[MI_BR]","isMetric":"no","class":"brit-length","names":["mile"],"properties":["length"],"values":[{"printable":"5280","numeric":5280}]}}};},
          "[mi_us]",
          { type: "literal", value: "[mi_us]", description: "\"[mi_us]\"" },
          function(u) {return {"value": 1, "units": {"[mi_us]": 1}, "metadata": {"[mi_us]":{"isBase":false,"CODE":"[MI_US]","isMetric":"no","class":"us-lengths","names":["mile"],"properties":["length"],"values":[{"printable":"8","numeric":8}]}}};},
          "[yd_br]",
          { type: "literal", value: "[yd_br]", description: "\"[yd_br]\"" },
          function(u) {return {"value": 1, "units": {"[yd_br]": 1}, "metadata": {"[yd_br]":{"isBase":false,"CODE":"[YD_BR]","isMetric":"no","class":"brit-length","names":["yard"],"properties":["length"],"values":[{"printable":"3","numeric":3}]}}};},
          "[pk_br]",
          { type: "literal", value: "[pk_br]", description: "\"[pk_br]\"" },
          function(u) {return {"value": 1, "units": {"[pk_br]": 1}, "metadata": {"[pk_br]":{"isBase":false,"CODE":"[PK_BR]","isMetric":"no","class":"brit-volumes","names":["peck"],"properties":["volume"],"values":[{"printable":"2","numeric":2}]}}};},
          "[pc_br]",
          { type: "literal", value: "[pc_br]", description: "\"[pc_br]\"" },
          function(u) {return {"value": 1, "units": {"[pc_br]": 1}, "metadata": {"[pc_br]":{"isBase":false,"CODE":"[PC_BR]","isMetric":"no","class":"brit-length","names":["pace"],"properties":["length"],"values":[{"printable":"2.5","numeric":2.5}]}}};},
          "[lk_br]",
          { type: "literal", value: "[lk_br]", description: "\"[lk_br]\"" },
          function(u) {return {"value": 1, "units": {"[lk_br]": 1}, "metadata": {"[lk_br]":{"isBase":false,"CODE":"[LK_BR]","isMetric":"no","class":"brit-length","names":["link for Gunter's chain"],"properties":["length"],"values":[{"printable":"1","numeric":1}]}}};},
          "[in_br]",
          { type: "literal", value: "[in_br]", description: "\"[in_br]\"" },
          function(u) {return {"value": 1, "units": {"[in_br]": 1}, "metadata": {"[in_br]":{"isBase":false,"CODE":"[IN_BR]","isMetric":"no","class":"brit-length","names":["inch"],"properties":["length"],"values":[{"printable":"2.539998","numeric":2.539998}]}}};},
          "[ft_br]",
          { type: "literal", value: "[ft_br]", description: "\"[ft_br]\"" },
          function(u) {return {"value": 1, "units": {"[ft_br]": 1}, "metadata": {"[ft_br]":{"isBase":false,"CODE":"[FT_BR]","isMetric":"no","class":"brit-length","names":["foot"],"properties":["length"],"values":[{"printable":"12","numeric":12}]}}};},
          "[rd_br]",
          { type: "literal", value: "[rd_br]", description: "\"[rd_br]\"" },
          function(u) {return {"value": 1, "units": {"[rd_br]": 1}, "metadata": {"[rd_br]":{"isBase":false,"CODE":"[RD_BR]","isMetric":"no","class":"brit-length","names":["rod"],"properties":["length"],"values":[{"printable":"16.5","numeric":16.5}]}}};},
          "[ch_br]",
          { type: "literal", value: "[ch_br]", description: "\"[ch_br]\"" },
          function(u) {return {"value": 1, "units": {"[ch_br]": 1}, "metadata": {"[ch_br]":{"isBase":false,"CODE":"[CH_BR]","isMetric":"no","class":"brit-length","names":["Gunter's chain"],"properties":["length"],"values":[{"printable":"4","numeric":4}]}}};},
          "[ft_i]",
          { type: "literal", value: "[ft_i]", description: "\"[ft_i]\"" },
          function(u) {return {"value": 1, "units": {"[ft_i]": 1}, "metadata": {"[ft_i]":{"isBase":false,"CODE":"[FT_I]","isMetric":"no","class":"intcust","names":["foot"],"printSymbols":["ft"],"properties":["length"],"values":[{"printable":"12","numeric":12}]}}};},
          "[hp_Q]",
          { type: "literal", value: "[hp_Q]", description: "\"[hp_Q]\"" },
          function(u) {return {"value": 1, "units": {"[hp_Q]": 1}, "metadata": {"[hp_Q]":{"isBase":false,"CODE":"[HP_Q]","isMetric":"no","isArbitrary":"yes","class":"clinical","names":["homeopathic potency of quintamillesimal hahnemannian series"],"printSymbols":["Q"],"properties":["homeopathic potency (Hahnemann)"],"values":[{"printable":"1","numeric":1}]}}};},
          "[hp_M]",
          { type: "literal", value: "[hp_M]", description: "\"[hp_M]\"" },
          function(u) {return {"value": 1, "units": {"[hp_M]": 1}, "metadata": {"[hp_M]":{"isBase":false,"CODE":"[HP_M]","isMetric":"no","isArbitrary":"yes","class":"clinical","names":["homeopathic potency of millesimal hahnemannian series"],"printSymbols":["M"],"properties":["homeopathic potency (Hahnemann)"],"values":[{"printable":"1","numeric":1}]}}};},
          "[hp_C]",
          { type: "literal", value: "[hp_C]", description: "\"[hp_C]\"" },
          function(u) {return {"value": 1, "units": {"[hp_C]": 1}, "metadata": {"[hp_C]":{"isBase":false,"CODE":"[HP_C]","isMetric":"no","isArbitrary":"yes","class":"clinical","names":["homeopathic potency of centesimal hahnemannian series"],"printSymbols":["C"],"properties":["homeopathic potency (Hahnemann)"],"values":[{"printable":"1","numeric":1}]}}};},
          "[hp_X]",
          { type: "literal", value: "[hp_X]", description: "\"[hp_X]\"" },
          function(u) {return {"value": 1, "units": {"[hp_X]": 1}, "metadata": {"[hp_X]":{"isBase":false,"CODE":"[HP_X]","isMetric":"no","isArbitrary":"yes","class":"clinical","names":["homeopathic potency of decimal hahnemannian series"],"printSymbols":["X"],"properties":["homeopathic potency (Hahnemann)"],"values":[{"printable":"1","numeric":1}]}}};},
          "[kp_C]",
          { type: "literal", value: "[kp_C]", description: "\"[kp_C]\"" },
          function(u) {return {"value": 1, "units": {"[kp_C]": 1}, "metadata": {"[kp_C]":{"isBase":false,"CODE":"[KP_C]","isMetric":"no","isArbitrary":"yes","class":"clinical","names":["homeopathic potency of centesimal korsakovian series"],"printSymbols":["C"],"properties":["homeopathic potency (Korsakov)"],"values":[{"printable":"1","numeric":1}]}}};},
          "[hd_i]",
          { type: "literal", value: "[hd_i]", description: "\"[hd_i]\"" },
          function(u) {return {"value": 1, "units": {"[hd_i]": 1}, "metadata": {"[hd_i]":{"isBase":false,"CODE":"[HD_I]","isMetric":"no","class":"intcust","names":["hand"],"printSymbols":["hd"],"properties":["height of horses"],"values":[{"printable":"4","numeric":4}]}}};},
          "[kp_M]",
          { type: "literal", value: "[kp_M]", description: "\"[kp_M]\"" },
          function(u) {return {"value": 1, "units": {"[kp_M]": 1}, "metadata": {"[kp_M]":{"isBase":false,"CODE":"[KP_M]","isMetric":"no","isArbitrary":"yes","class":"clinical","names":["homeopathic potency of millesimal korsakovian series"],"printSymbols":["M"],"properties":["homeopathic potency (Korsakov)"],"values":[{"printable":"1","numeric":1}]}}};},
          "[kp_Q]",
          { type: "literal", value: "[kp_Q]", description: "\"[kp_Q]\"" },
          function(u) {return {"value": 1, "units": {"[kp_Q]": 1}, "metadata": {"[kp_Q]":{"isBase":false,"CODE":"[KP_Q]","isMetric":"no","isArbitrary":"yes","class":"clinical","names":["homeopathic potency of quintamillesimal korsakovian series"],"printSymbols":["Q"],"properties":["homeopathic potency (Korsakov)"],"values":[{"printable":"1","numeric":1}]}}};},
          "[cr_i]",
          { type: "literal", value: "[cr_i]", description: "\"[cr_i]\"" },
          function(u) {return {"value": 1, "units": {"[cr_i]": 1}, "metadata": {"[cr_i]":{"isBase":false,"CODE":"[CR_I]","isMetric":"no","class":"intcust","names":["cord"],"properties":["volume"],"values":[{"printable":"128","numeric":128}]}}};},
          "[bf_i]",
          { type: "literal", value: "[bf_i]", description: "\"[bf_i]\"" },
          function(u) {return {"value": 1, "units": {"[bf_i]": 1}, "metadata": {"[bf_i]":{"isBase":false,"CODE":"[BF_I]","isMetric":"no","class":"intcust","names":["board foot"],"properties":["volume"],"values":[{"printable":"144","numeric":144}]}}};},
          "[kn_i]",
          { type: "literal", value: "[kn_i]", description: "\"[kn_i]\"" },
          function(u) {return {"value": 1, "units": {"[kn_i]": 1}, "metadata": {"[kn_i]":{"isBase":false,"CODE":"[KN_I]","isMetric":"no","class":"intcust","names":["knot"],"printSymbols":["knot"],"properties":["velocity"],"values":[{"printable":"1","numeric":1}]}}};},
          "[mu_0]",
          { type: "literal", value: "[mu_0]", description: "\"[mu_0]\"" },
          function(u) {return {"value": 1, "units": {"[mu_0]": 1}, "metadata": {"[mu_0]":{"isBase":false,"CODE":"[MU_0]","isMetric":"yes","class":"const","names":["permeability of vacuum"],"printSymbols":["<i>&#956;<sub>\n               <r>0</r>\n            </sub>\n         </i>"],"properties":["magnetic permeability"],"values":[{"printable":"1","numeric":1}]}}};},
          "[mi_i]",
          { type: "literal", value: "[mi_i]", description: "\"[mi_i]\"" },
          function(u) {return {"value": 1, "units": {"[mi_i]": 1}, "metadata": {"[mi_i]":{"isBase":false,"CODE":"[MI_I]","isMetric":"no","class":"intcust","names":["statute mile"],"printSymbols":["mi"],"properties":["length"],"values":[{"printable":"5280","numeric":5280}]}}};},
          "[yd_i]",
          { type: "literal", value: "[yd_i]", description: "\"[yd_i]\"" },
          function(u) {return {"value": 1, "units": {"[yd_i]": 1}, "metadata": {"[yd_i]":{"isBase":false,"CODE":"[YD_I]","isMetric":"no","class":"intcust","names":["yard"],"printSymbols":["yd"],"properties":["length"],"values":[{"printable":"3","numeric":3}]}}};},
          "[kp_X]",
          { type: "literal", value: "[kp_X]", description: "\"[kp_X]\"" },
          function(u) {return {"value": 1, "units": {"[kp_X]": 1}, "metadata": {"[kp_X]":{"isBase":false,"CODE":"[KP_X]","isMetric":"no","isArbitrary":"yes","class":"clinical","names":["homeopathic potency of decimal korsakovian series"],"printSymbols":["X"],"properties":["homeopathic potency (Korsakov)"],"values":[{"printable":"1","numeric":1}]}}};},
          "[in_i]",
          { type: "literal", value: "[in_i]", description: "\"[in_i]\"" },
          function(u) {return {"value": 1, "units": {"[in_i]": 1}, "metadata": {"[in_i]":{"isBase":false,"CODE":"[IN_I]","isMetric":"no","class":"intcust","names":["inch"],"printSymbols":["in"],"properties":["length"],"values":[{"printable":"2.54","numeric":2.54}]}}};},
          "[diop]",
          { type: "literal", value: "[diop]", description: "\"[diop]\"" },
          function(u) {return {"value": 1, "units": {"[diop]": 1}, "metadata": {"[diop]":{"isBase":false,"CODE":"[DIOP]","isMetric":"no","class":"clinical","names":["diopter"],"printSymbols":["dpt"],"properties":["refraction of a lens"],"values":[{"printable":"1","numeric":1}]}}};},
          "cal_IT",
          { type: "literal", value: "cal_IT", description: "\"cal_IT\"" },
          function(u) {return {"value": 1, "units": {"cal_IT": 1}, "metadata": {"cal_IT":{"isBase":false,"CODE":"CAL_IT","isMetric":"yes","class":"heat","names":["international table calorie"],"printSymbols":["cal<sub>IT</sub>"],"properties":["energy"],"values":[{"printable":"4.1868","numeric":4.1868}]}}};},
          "cal_th",
          { type: "literal", value: "cal_th", description: "\"cal_th\"" },
          function(u) {return {"value": 1, "units": {"cal_th": 1}, "metadata": {"cal_th":{"isBase":false,"CODE":"CAL_TH","isMetric":"yes","class":"heat","names":["thermochemical calorie"],"printSymbols":["cal<sub>th</sub>"],"properties":["energy"],"values":[{"printable":"4.184","numeric":4.184}]}}};},
          "m[H2O]",
          { type: "literal", value: "m[H2O]", description: "\"m[H2O]\"" },
          function(u) {return {"value": 1, "units": {"m[H2O]": 1}, "metadata": {"m[H2O]":{"isBase":false,"CODE":"M[H2O]","isMetric":"yes","class":"clinical","names":["meter of water column"],"printSymbols":["m&#160;H<sub>\n            <r>2</r>\n         </sub>O"],"properties":["pressure"],"values":[{"printable":"9.80665","numeric":9.80665}]}}};},
          "[ka'U]",
          { type: "literal", value: "[ka'U]", description: "\"[ka'U]\"" },
          function(u) {return {"value": 1, "units": {"[ka'U]": 1}, "metadata": {"[ka'U]":{"isBase":false,"CODE":"[KA'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["King-Armstrong unit"],"properties":["biologic activity of phosphatase"],"values":[{"printable":"1","numeric":1}]}}};},
          "B[SPL]",
          { type: "literal", value: "B[SPL]", description: "\"B[SPL]\"" },
          function(u) {return {"value": 1, "units": {"B[SPL]": 1}, "metadata": {"B[SPL]":{"isBase":false,"CODE":"B[SPL]","isMetric":"yes","isSpecial":"yes","class":"levels","names":["bel sound pressure"],"printSymbols":["B(SPL)"],"properties":["pressure level"],"values":[{"printable":"<function name=\"lgTimes2\" value=\"2\" Unit=\"10*-5.Pa\"/>","numeric":null}]}}};},
          "[tb'U]",
          { type: "literal", value: "[tb'U]", description: "\"[tb'U]\"" },
          function(u) {return {"value": 1, "units": {"[tb'U]": 1}, "metadata": {"[tb'U]":{"isBase":false,"CODE":"[TB'U]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["tuberculin unit"],"properties":["biologic activity of tuberculin"],"values":[{"printable":"1","numeric":1}]}}};},
          "[degR]",
          { type: "literal", value: "[degR]", description: "\"[degR]\"" },
          function(u) {return {"value": 1, "units": {"[degR]": 1}, "metadata": {"[degR]":{"isBase":false,"CODE":"[degR]","isMetric":"no","class":"heat","names":["degree Rankine"],"printSymbols":["&#176;R"],"properties":["temperature"],"values":[{"printable":"5","numeric":5}]}}};},
          "[degF]",
          { type: "literal", value: "[degF]", description: "\"[degF]\"" },
          function(u) {return {"value": 1, "units": {"[degF]": 1}, "metadata": {"[degF]":{"isBase":false,"CODE":"[DEGF]","isMetric":"no","isSpecial":"yes","class":"heat","names":["degree Fahrenheit"],"printSymbols":["&#176;F"],"properties":["temperature"],"values":[{"printable":"<function name=\"degF\" value=\"5\" Unit=\"K/9\"/>","numeric":null}]}}};},
          "[pptr]",
          { type: "literal", value: "[pptr]", description: "\"[pptr]\"" },
          function(u) {return {"value": 1, "units": {"[pptr]": 1}, "metadata": {"[pptr]":{"isBase":false,"CODE":"[PPTR]","isMetric":"no","class":"dimless","names":["parts per trillion"],"printSymbols":["pptr"],"properties":["fraction"],"values":[{"printable":"1","numeric":1}]}}};},
          "[ppth]",
          { type: "literal", value: "[ppth]", description: "\"[ppth]\"" },
          function(u) {return {"value": 1, "units": {"[ppth]": 1}, "metadata": {"[ppth]":{"isBase":false,"CODE":"[PPTH]","isMetric":"no","class":"dimless","names":["parts per thousand"],"printSymbols":["ppth"],"properties":["fraction"],"values":[{"printable":"1","numeric":1}]}}};},
          "[oz_m]",
          { type: "literal", value: "[oz_m]", description: "\"[oz_m]\"" },
          function(u) {return {"value": 1, "units": {"[oz_m]": 1}, "metadata": {"[oz_m]":{"isBase":false,"CODE":"[OZ_M]","isMetric":"no","class":"apoth","names":["metric ounce"],"properties":["mass"],"values":[{"printable":"28","numeric":28}]}}};},
          "[pied]",
          { type: "literal", value: "[pied]", description: "\"[pied]\"" },
          function(u) {return {"value": 1, "units": {"[pied]": 1}, "metadata": {"[pied]":{"isBase":false,"CODE":"[PIED]","isMetric":"no","class":"typeset","names":["pied","French foot"],"properties":["length"],"values":[{"printable":"32.48","numeric":32.48}]}}};},
          "[ppm]",
          { type: "literal", value: "[ppm]", description: "\"[ppm]\"" },
          function(u) {return {"value": 1, "units": {"[ppm]": 1}, "metadata": {"[ppm]":{"isBase":false,"CODE":"[PPM]","isMetric":"no","class":"dimless","names":["parts per million"],"printSymbols":["ppm"],"properties":["fraction"],"values":[{"printable":"1","numeric":1}]}}};},
          "[ppb]",
          { type: "literal", value: "[ppb]", description: "\"[ppb]\"" },
          function(u) {return {"value": 1, "units": {"[ppb]": 1}, "metadata": {"[ppb]":{"isBase":false,"CODE":"[PPB]","isMetric":"no","class":"dimless","names":["parts per billion"],"printSymbols":["ppb"],"properties":["fraction"],"values":[{"printable":"1","numeric":1}]}}};},
          "bit_s",
          { type: "literal", value: "bit_s", description: "\"bit_s\"" },
          function(u) {return {"value": 1, "units": {"bit_s": 1}, "metadata": {"bit_s":{"isBase":false,"CODE":"BIT_S","isMetric":"no","isSpecial":"yes","class":"infotech","names":["bit"],"printSymbols":["bit<sub>s</sub>"],"properties":["amount of information"],"values":[{"printable":"<function name=\"ld\" value=\"1\" Unit=\"1\"/>","numeric":null}]}}};},
          "[PNU]",
          { type: "literal", value: "[PNU]", description: "\"[PNU]\"" },
          function(u) {return {"value": 1, "units": {"[PNU]": 1}, "metadata": {"[PNU]":{"isBase":false,"CODE":"[PNU]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["protein nitrogen unit"],"printSymbols":["PNU"],"properties":["procedure defined amount of a protein substance"],"values":[{"printable":"1","numeric":1}]}}};},
          "[psi]",
          { type: "literal", value: "[psi]", description: "\"[psi]\"" },
          function(u) {return {"value": 1, "units": {"[psi]": 1}, "metadata": {"[psi]":{"isBase":false,"CODE":"[PSI]","isMetric":"no","class":"misc","names":["pound per sqare inch"],"printSymbols":["psi"],"properties":["pressure"],"values":[{"printable":"1","numeric":1}]}}};},
          "[BAU]",
          { type: "literal", value: "[BAU]", description: "\"[BAU]\"" },
          function(u) {return {"value": 1, "units": {"[BAU]": 1}, "metadata": {"[BAU]":{"isBase":false,"CODE":"[BAU]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["bioequivalent allergen unit"],"printSymbols":["BAU"],"properties":["amount of an allergen callibrated through in-vivo testing based on the ID50EAL method of (intradermal dilution for 50mm sum of erythema diameters"],"values":[{"printable":"1","numeric":1}]}}};},
          "[Cal]",
          { type: "literal", value: "[Cal]", description: "\"[Cal]\"" },
          function(u) {return {"value": 1, "units": {"[Cal]": 1}, "metadata": {"[Cal]":{"isBase":false,"CODE":"[CAL]","isMetric":"no","class":"heat","names":["nutrition label Calories"],"printSymbols":["Cal"],"properties":["energy"],"values":[{"printable":"1","numeric":1}]}}};},
          "B[mV]",
          { type: "literal", value: "B[mV]", description: "\"B[mV]\"" },
          function(u) {return {"value": 1, "units": {"B[mV]": 1}, "metadata": {"B[mV]":{"isBase":false,"CODE":"B[MV]","isMetric":"yes","isSpecial":"yes","class":"levels","names":["bel millivolt"],"printSymbols":["B(mV)"],"properties":["electric potential level"],"values":[{"printable":"<function name=\"lgTimes2\" value=\"1\" Unit=\"mV\"/>","numeric":null}]}}};},
          "B[uV]",
          { type: "literal", value: "B[uV]", description: "\"B[uV]\"" },
          function(u) {return {"value": 1, "units": {"B[uV]": 1}, "metadata": {"B[uV]":{"isBase":false,"CODE":"B[UV]","isMetric":"yes","isSpecial":"yes","class":"levels","names":["bel microvolt"],"printSymbols":["B(&#956;V)"],"properties":["electric potential level"],"values":[{"printable":"<function name=\"lgTimes2\" value=\"1\" Unit=\"uV\"/>","numeric":null}]}}};},
          "[CFU]",
          { type: "literal", value: "[CFU]", description: "\"[CFU]\"" },
          function(u) {return {"value": 1, "units": {"[CFU]": 1}, "metadata": {"[CFU]":{"isBase":false,"CODE":"[CFU]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["colony forming units"],"printSymbols":["CFU"],"properties":["amount of a proliferating organism"],"values":[{"printable":"1","numeric":1}]}}};},
          "[FFU]",
          { type: "literal", value: "[FFU]", description: "\"[FFU]\"" },
          function(u) {return {"value": 1, "units": {"[FFU]": 1}, "metadata": {"[FFU]":{"isBase":false,"CODE":"[FFU]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["focus forming units"],"printSymbols":["FFU"],"properties":["amount of an infectious agent"],"values":[{"printable":"1","numeric":1}]}}};},
          "B[kW]",
          { type: "literal", value: "B[kW]", description: "\"B[kW]\"" },
          function(u) {return {"value": 1, "units": {"B[kW]": 1}, "metadata": {"B[kW]":{"isBase":false,"CODE":"B[KW]","isMetric":"yes","isSpecial":"yes","class":"levels","names":["bel kilowatt"],"printSymbols":["B(kW)"],"properties":["power level"],"values":[{"printable":"<function name=\"lg\" value=\"1\" Unit=\"kW\"/>","numeric":null}]}}};},
          "[PFU]",
          { type: "literal", value: "[PFU]", description: "\"[PFU]\"" },
          function(u) {return {"value": 1, "units": {"[PFU]": 1}, "metadata": {"[PFU]":{"isBase":false,"CODE":"[PFU]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["plaque forming units"],"printSymbols":["PFU"],"properties":["amount of an infectious agent"],"values":[{"printable":"1","numeric":1}]}}};},
          "cal_m",
          { type: "literal", value: "cal_m", description: "\"cal_m\"" },
          function(u) {return {"value": 1, "units": {"cal_m": 1}, "metadata": {"cal_m":{"isBase":false,"CODE":"CAL_M","isMetric":"yes","class":"heat","names":["mean calorie"],"printSymbols":["cal<sub>m</sub>"],"properties":["energy"],"values":[{"printable":"4.19002","numeric":4.19002}]}}};},
          "[ELU]",
          { type: "literal", value: "[ELU]", description: "\"[ELU]\"" },
          function(u) {return {"value": 1, "units": {"[ELU]": 1}, "metadata": {"[ELU]":{"isBase":false,"CODE":"[ELU]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["ELISA unit"],"printSymbols":[""],"properties":["arbitrary ELISA unit"],"values":[{"printable":"1","numeric":1}]}}};},
          "[FEU]",
          { type: "literal", value: "[FEU]", description: "\"[FEU]\"" },
          function(u) {return {"value": 1, "units": {"[FEU]": 1}, "metadata": {"[FEU]":{"isBase":false,"CODE":"[FEU]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["fibrinogen equivalent unit"],"printSymbols":[""],"properties":["amount of fibrinogen broken down into the measured d-dimers"],"values":[{"printable":"1","numeric":1}]}}};},
          "[PRU]",
          { type: "literal", value: "[PRU]", description: "\"[PRU]\"" },
          function(u) {return {"value": 1, "units": {"[PRU]": 1}, "metadata": {"[PRU]":{"isBase":false,"CODE":"[PRU]","isMetric":"no","class":"clinical","names":["peripheral vascular resistance unit"],"printSymbols":["P.R.U."],"properties":["fluid resistance"],"values":[{"printable":"1","numeric":1}]}}};},
          "[m_e]",
          { type: "literal", value: "[m_e]", description: "\"[m_e]\"" },
          function(u) {return {"value": 1, "units": {"[m_e]": 1}, "metadata": {"[m_e]":{"isBase":false,"CODE":"[M_E]","isMetric":"yes","class":"const","names":["electron mass"],"printSymbols":["<i>m<sub>\n               <r>e</r>\n            </sub>\n         </i>"],"properties":["mass"],"values":[{"printable":"9.1093897 &#215; 10<sup>-28</sup>","numeric":9.1093897e-28}]}}};},
          "[m_p]",
          { type: "literal", value: "[m_p]", description: "\"[m_p]\"" },
          function(u) {return {"value": 1, "units": {"[m_p]": 1}, "metadata": {"[m_p]":{"isBase":false,"CODE":"[M_P]","isMetric":"yes","class":"const","names":["proton mass"],"printSymbols":["<i>m<sub>\n               <r>p</r>\n            </sub>\n         </i>"],"properties":["mass"],"values":[{"printable":"1.6726231 &#215; 10<sup>-24</sup>","numeric":1.6726231e-24}]}}};},
          "m[Hg]",
          { type: "literal", value: "m[Hg]", description: "\"m[Hg]\"" },
          function(u) {return {"value": 1, "units": {"m[Hg]": 1}, "metadata": {"m[Hg]":{"isBase":false,"CODE":"M[HG]","isMetric":"yes","class":"clinical","names":["meter of mercury column"],"printSymbols":["m&#160;Hg"],"properties":["pressure"],"values":[{"printable":"133.3220","numeric":133.322}]}}};},
          "[pca]",
          { type: "literal", value: "[pca]", description: "\"[pca]\"" },
          function(u) {return {"value": 1, "units": {"[pca]": 1}, "metadata": {"[pca]":{"isBase":false,"CODE":"[PCA]","isMetric":"no","class":"typeset","names":["pica"],"properties":["length"],"values":[{"printable":"12","numeric":12}]}}};},
          "[pnt]",
          { type: "literal", value: "[pnt]", description: "\"[pnt]\"" },
          function(u) {return {"value": 1, "units": {"[pnt]": 1}, "metadata": {"[pnt]":{"isBase":false,"CODE":"[PNT]","isMetric":"no","class":"typeset","names":["point"],"properties":["length"],"values":[{"printable":"1","numeric":1}]}}};},
          "[lne]",
          { type: "literal", value: "[lne]", description: "\"[lne]\"" },
          function(u) {return {"value": 1, "units": {"[lne]": 1}, "metadata": {"[lne]":{"isBase":false,"CODE":"[LNE]","isMetric":"no","class":"typeset","names":["line"],"properties":["length"],"values":[{"printable":"1","numeric":1}]}}};},
          "[LPF]",
          { type: "literal", value: "[LPF]", description: "\"[LPF]\"" },
          function(u) {return {"value": 1, "units": {"[LPF]": 1}, "metadata": {"[LPF]":{"isBase":false,"CODE":"[LPF]","isMetric":"no","class":"chemical","names":["low power field"],"printSymbols":["LPF"],"properties":["view area in microscope"],"values":[{"printable":"100","numeric":100}]}}};},
          "[den]",
          { type: "literal", value: "[den]", description: "\"[den]\"" },
          function(u) {return {"value": 1, "units": {"[den]": 1}, "metadata": {"[den]":{"isBase":false,"CODE":"[DEN]","isMetric":"no","class":"heat","names":["Denier"],"printSymbols":["den"],"properties":["linear mass density (of textile thread)"],"values":[{"printable":"1","numeric":1}]}}};},
          "[sct]",
          { type: "literal", value: "[sct]", description: "\"[sct]\"" },
          function(u) {return {"value": 1, "units": {"[sct]": 1}, "metadata": {"[sct]":{"isBase":false,"CODE":"[SCT]","isMetric":"no","class":"us-lengths","names":["section"],"properties":["area"],"values":[{"printable":"1","numeric":1}]}}};},
          "[twp]",
          { type: "literal", value: "[twp]", description: "\"[twp]\"" },
          function(u) {return {"value": 1, "units": {"[twp]": 1}, "metadata": {"[twp]":{"isBase":false,"CODE":"[TWP]","isMetric":"no","class":"us-lengths","names":["township"],"properties":["area"],"values":[{"printable":"36","numeric":36}]}}};},
          "[Btu]",
          { type: "literal", value: "[Btu]", description: "\"[Btu]\"" },
          function(u) {return {"value": 1, "units": {"[Btu]": 1}, "metadata": {"[Btu]":{"isBase":false,"CODE":"[BTU]","isMetric":"no","class":"heat","names":["British thermal unit"],"printSymbols":["btu"],"properties":["energy"],"values":[{"printable":"1","numeric":1}]}}};},
          "[MET]",
          { type: "literal", value: "[MET]", description: "\"[MET]\"" },
          function(u) {return {"value": 1, "units": {"[MET]": 1}, "metadata": {"[MET]":{"isBase":false,"CODE":"[MET]","isMetric":"no","class":"clinical","names":["metabolic equivalent"],"printSymbols":["MET"],"properties":["metabolic cost of physical activity"],"values":[{"printable":"3.5","numeric":3.5}]}}};},
          "[HPF]",
          { type: "literal", value: "[HPF]", description: "\"[HPF]\"" },
          function(u) {return {"value": 1, "units": {"[HPF]": 1}, "metadata": {"[HPF]":{"isBase":false,"CODE":"[HPF]","isMetric":"no","class":"chemical","names":["high power field"],"printSymbols":["HPF"],"properties":["view area in microscope"],"values":[{"printable":"1","numeric":1}]}}};},
          "[drp]",
          { type: "literal", value: "[drp]", description: "\"[drp]\"" },
          function(u) {return {"value": 1, "units": {"[drp]": 1}, "metadata": {"[drp]":{"isBase":false,"CODE":"[DRP]","isMetric":"no","class":"clinical","names":["drop"],"printSymbols":["drp"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "[AU]",
          { type: "literal", value: "[AU]", description: "\"[AU]\"" },
          function(u) {return {"value": 1, "units": {"[AU]": 1}, "metadata": {"[AU]":{"isBase":false,"CODE":"[AU]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["allergen unit"],"printSymbols":["AU"],"properties":["procedure defined amount of an allergen using some reference standard"],"values":[{"printable":"1","numeric":1}]}}};},
          "[IU]",
          { type: "literal", value: "[IU]", description: "\"[IU]\"" },
          function(u) {return {"value": 1, "units": {"[IU]": 1}, "metadata": {"[IU]":{"isBase":false,"CODE":"[IU]","isMetric":"yes","isArbitrary":"yes","class":"chemical","names":["international unit"],"printSymbols":["i.U."],"properties":["arbitrary"],"values":[{"printable":"1","numeric":1}]}}};},
          "mo_s",
          { type: "literal", value: "mo_s", description: "\"mo_s\"" },
          function(u) {return {"value": 1, "units": {"mo_s": 1}, "metadata": {"mo_s":{"isBase":false,"CODE":"MO_S","isMetric":"no","class":"iso1000","names":["synodal month"],"printSymbols":["mo<sub>s</sub>"],"properties":["time"],"values":[{"printable":"29.53059","numeric":29.53059}]}}};},
          "[gr]",
          { type: "literal", value: "[gr]", description: "\"[gr]\"" },
          function(u) {return {"value": 1, "units": {"[gr]": 1}, "metadata": {"[gr]":{"isBase":false,"CODE":"[GR]","isMetric":"no","class":"avoirdupois","names":["grain"],"properties":["mass"],"values":[{"printable":"64.79891","numeric":64.79891}]}}};},
          "circ",
          { type: "literal", value: "circ", description: "\"circ\"" },
          function(u) {return {"value": 1, "units": {"circ": 1}, "metadata": {"circ":{"isBase":false,"CODE":"CIRC","isMetric":"no","class":"misc","names":["circle"],"printSymbols":["circ"],"properties":["plane angle"],"values":[{"printable":"2","numeric":2}]}}};},
          "[pi]",
          { type: "literal", value: "[pi]", description: "\"[pi]\"" },
          function(u) {return {"value": 1, "units": {"[pi]": 1}, "metadata": {"[pi]":{"isBase":false,"CODE":"[PI]","isMetric":"no","class":"dimless","names":["the number pi"],"printSymbols":["&#960;"],"properties":["number"],"values":[{"printable":"&#960;","numeric":3.141592653589793}]}}};},
          "[EU]",
          { type: "literal", value: "[EU]", description: "\"[EU]\"" },
          function(u) {return {"value": 1, "units": {"[EU]": 1}, "metadata": {"[EU]":{"isBase":false,"CODE":"[EU]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["Ehrlich unit"],"printSymbols":[""],"properties":["Ehrlich unit"],"values":[{"printable":"1","numeric":1}]}}};},
          "[Lf]",
          { type: "literal", value: "[Lf]", description: "\"[Lf]\"" },
          function(u) {return {"value": 1, "units": {"[Lf]": 1}, "metadata": {"[Lf]":{"isBase":false,"CODE":"[LF]","isMetric":"no","isArbitrary":"yes","class":"chemical","names":["Limit of flocculation"],"printSymbols":["Lf"],"properties":["procedure defined amount of an antigen substance"],"values":[{"printable":"1","numeric":1}]}}};},
          "mo_j",
          { type: "literal", value: "mo_j", description: "\"mo_j\"" },
          function(u) {return {"value": 1, "units": {"mo_j": 1}, "metadata": {"mo_j":{"isBase":false,"CODE":"MO_J","isMetric":"no","class":"iso1000","names":["mean Julian month"],"printSymbols":["mo<sub>j</sub>"],"properties":["time"],"values":[{"printable":"1","numeric":1}]}}};},
          "B[W]",
          { type: "literal", value: "B[W]", description: "\"B[W]\"" },
          function(u) {return {"value": 1, "units": {"B[W]": 1}, "metadata": {"B[W]":{"isBase":false,"CODE":"B[W]","isMetric":"yes","isSpecial":"yes","class":"levels","names":["bel watt"],"printSymbols":["B(W)"],"properties":["power level"],"values":[{"printable":"<function name=\"lg\" value=\"1\" Unit=\"W\"/>","numeric":null}]}}};},
          "B[V]",
          { type: "literal", value: "B[V]", description: "\"B[V]\"" },
          function(u) {return {"value": 1, "units": {"B[V]": 1}, "metadata": {"B[V]":{"isBase":false,"CODE":"B[V]","isMetric":"yes","isSpecial":"yes","class":"levels","names":["bel volt"],"printSymbols":["B(V)"],"properties":["electric potential level"],"values":[{"printable":"<function name=\"lgTimes2\" value=\"1\" Unit=\"V\"/>","numeric":null}]}}};},
          "mo_g",
          { type: "literal", value: "mo_g", description: "\"mo_g\"" },
          function(u) {return {"value": 1, "units": {"mo_g": 1}, "metadata": {"mo_g":{"isBase":false,"CODE":"MO_G","isMetric":"no","class":"iso1000","names":["mean Gregorian month"],"printSymbols":["mo<sub>g</sub>"],"properties":["time"],"values":[{"printable":"1","numeric":1}]}}};},
          "[iU]",
          { type: "literal", value: "[iU]", description: "\"[iU]\"" },
          function(u) {return {"value": 1, "units": {"[iU]": 1}, "metadata": {"[iU]":{"isBase":false,"CODE":"[IU]","isMetric":"yes","isArbitrary":"yes","class":"chemical","names":["international unit"],"printSymbols":["IU"],"properties":["arbitrary"],"values":[{"printable":"1","numeric":1}]}}};},
          "[HP]",
          { type: "literal", value: "[HP]", description: "\"[HP]\"" },
          function(u) {return {"value": 1, "units": {"[HP]": 1}, "metadata": {"[HP]":{"isBase":false,"CODE":"[HP]","isMetric":"no","class":"heat","names":["horsepower"],"properties":["power"],"values":[{"printable":"550","numeric":550}]}}};},
          "[Ch]",
          { type: "literal", value: "[Ch]", description: "\"[Ch]\"" },
          function(u) {return {"value": 1, "units": {"[Ch]": 1}, "metadata": {"[Ch]":{"isBase":false,"CODE":"[CH]","isMetric":"no","class":"clinical","names":["Charrière","french"],"printSymbols":["Ch"],"properties":["gauge of catheters"],"values":[{"printable":"1","numeric":1}]}}};},
          "[ly]",
          { type: "literal", value: "[ly]", description: "\"[ly]\"" },
          function(u) {return {"value": 1, "units": {"[ly]": 1}, "metadata": {"[ly]":{"isBase":false,"CODE":"[LY]","isMetric":"yes","class":"const","names":["light-year"],"printSymbols":["l.y."],"properties":["length"],"values":[{"printable":"1","numeric":1}]}}};},
          "[pH]",
          { type: "literal", value: "[pH]", description: "\"[pH]\"" },
          function(u) {return {"value": 1, "units": {"[pH]": 1}, "metadata": {"[pH]":{"isBase":false,"CODE":"[PH]","isMetric":"no","isSpecial":"yes","class":"chemical","names":["pH"],"printSymbols":["pH"],"properties":["acidity"],"values":[{"printable":"<function name=\"pH\" value=\"1\" Unit=\"mol/l\"/>","numeric":null}]}}};},
          "a_j",
          { type: "literal", value: "a_j", description: "\"a_j\"" },
          function(u) {return {"value": 1, "units": {"a_j": 1}, "metadata": {"a_j":{"isBase":false,"CODE":"ANN_J","isMetric":"no","class":"iso1000","names":["mean Julian year"],"printSymbols":["a<sub>j</sub>"],"properties":["time"],"values":[{"printable":"365.25","numeric":365.25}]}}};},
          "rad",
          { type: "literal", value: "rad", description: "\"rad\"" },
          function(u) {return {"value": 1, "units": {"rad": 1}, "metadata": {"rad":{"isBase":true,"CODE":"RAD","dim":"A","names":["radian"],"printSymbols":["rad"],"properties":["plane angle"]}}};},
          "a_t",
          { type: "literal", value: "a_t", description: "\"a_t\"" },
          function(u) {return {"value": 1, "units": {"a_t": 1}, "metadata": {"a_t":{"isBase":false,"CODE":"ANN_T","isMetric":"no","class":"iso1000","names":["tropical year"],"printSymbols":["a<sub>t</sub>"],"properties":["time"],"values":[{"printable":"365.24219","numeric":365.24219}]}}};},
          "Ohm",
          { type: "literal", value: "Ohm", description: "\"Ohm\"" },
          function(u) {return {"value": 1, "units": {"Ohm": 1}, "metadata": {"Ohm":{"isBase":false,"CODE":"OHM","isMetric":"yes","class":"si","names":["Ohm"],"printSymbols":["&#937;"],"properties":["electric resistance"],"values":[{"printable":"1","numeric":1}]}}};},
          "sph",
          { type: "literal", value: "sph", description: "\"sph\"" },
          function(u) {return {"value": 1, "units": {"sph": 1}, "metadata": {"sph":{"isBase":false,"CODE":"SPH","isMetric":"no","class":"misc","names":["spere"],"printSymbols":["sph"],"properties":["solid angle"],"values":[{"printable":"4","numeric":4}]}}};},
          "bit",
          { type: "literal", value: "bit", description: "\"bit\"" },
          function(u) {return {"value": 1, "units": {"bit": 1}, "metadata": {"bit":{"isBase":false,"CODE":"BIT","isMetric":"yes","class":"infotech","names":["bit"],"printSymbols":["bit"],"properties":["amount of information"],"values":[{"printable":"1","numeric":1}]}}};},
          "mho",
          { type: "literal", value: "mho", description: "\"mho\"" },
          function(u) {return {"value": 1, "units": {"mho": 1}, "metadata": {"mho":{"isBase":false,"CODE":"MHO","isMetric":"yes","class":"misc","names":["mho"],"printSymbols":["mho"],"properties":["electric conductance"],"values":[{"printable":"1","numeric":1}]}}};},
          "min",
          { type: "literal", value: "min", description: "\"min\"" },
          function(u) {return {"value": 1, "units": {"min": 1}, "metadata": {"min":{"isBase":false,"CODE":"MIN","isMetric":"no","class":"iso1000","names":["minute"],"printSymbols":["min"],"properties":["time"],"values":[{"printable":"60","numeric":60}]}}};},
          "mol",
          { type: "literal", value: "mol", description: "\"mol\"" },
          function(u) {return {"value": 1, "units": {"mol": 1}, "metadata": {"mol":{"isBase":false,"CODE":"MOL","isMetric":"yes","class":"si","names":["mole"],"printSymbols":["mol"],"properties":["amount of substance"],"values":[{"printable":"6.0221367","numeric":6.0221367}]}}};},
          "deg",
          { type: "literal", value: "deg", description: "\"deg\"" },
          function(u) {return {"value": 1, "units": {"deg": 1}, "metadata": {"deg":{"isBase":false,"CODE":"DEG","isMetric":"no","class":"iso1000","names":["degree"],"printSymbols":["&#176;"],"properties":["plane angle"],"values":[{"printable":"2","numeric":2}]}}};},
          "gon",
          { type: "literal", value: "gon", description: "\"gon\"" },
          function(u) {return {"value": 1, "units": {"gon": 1}, "metadata": {"gon":{"isBase":false,"CODE":"GON","isMetric":"no","class":"iso1000","names":["gon","grade"],"printSymbols":["&#9633;<sup>g</sup>"],"properties":["plane angle"],"values":[{"printable":"0.9","numeric":0.9}]}}};},
          "Cel",
          { type: "literal", value: "Cel", description: "\"Cel\"" },
          function(u) {return {"value": 1, "units": {"Cel": 1}, "metadata": {"Cel":{"isBase":false,"CODE":"CEL","isMetric":"yes","isSpecial":"yes","class":"si","names":["degree Celsius"],"printSymbols":["&#176;C"],"properties":["temperature"],"values":[{"printable":"<function name=\"Cel\" value=\"1\" Unit=\"K\"/>","numeric":null}]}}};},
          "kat",
          { type: "literal", value: "kat", description: "\"kat\"" },
          function(u) {return {"value": 1, "units": {"kat": 1}, "metadata": {"kat":{"isBase":false,"CODE":"KAT","isMetric":"yes","class":"chemical","names":["katal"],"printSymbols":["kat"],"properties":["catalytic activity"],"values":[{"printable":"1","numeric":1}]}}};},
          "att",
          { type: "literal", value: "att", description: "\"att\"" },
          function(u) {return {"value": 1, "units": {"att": 1}, "metadata": {"att":{"isBase":false,"CODE":"ATT","isMetric":"no","class":"misc","names":["technical atmosphere"],"printSymbols":["at"],"properties":["pressure"],"values":[{"printable":"1","numeric":1}]}}};},
          "osm",
          { type: "literal", value: "osm", description: "\"osm\"" },
          function(u) {return {"value": 1, "units": {"osm": 1}, "metadata": {"osm":{"isBase":false,"CODE":"OSM","isMetric":"yes","class":"chemical","names":["osmole"],"printSymbols":["osm"],"properties":["amount of substance (dissolved particles)"],"values":[{"printable":"1","numeric":1}]}}};},
          "tex",
          { type: "literal", value: "tex", description: "\"tex\"" },
          function(u) {return {"value": 1, "units": {"tex": 1}, "metadata": {"tex":{"isBase":false,"CODE":"TEX","isMetric":"yes","class":"heat","names":["tex"],"printSymbols":["tex"],"properties":["linear mass density (of textile thread)"],"values":[{"printable":"1","numeric":1}]}}};},
          "cal",
          { type: "literal", value: "cal", description: "\"cal\"" },
          function(u) {return {"value": 1, "units": {"cal": 1}, "metadata": {"cal":{"isBase":false,"CODE":"CAL","isMetric":"yes","class":"heat","names":["calorie"],"printSymbols":["cal"],"properties":["energy"],"values":[{"printable":"1","numeric":1}]}}};},
          "REM",
          { type: "literal", value: "REM", description: "\"REM\"" },
          function(u) {return {"value": 1, "units": {"REM": 1}, "metadata": {"REM":{"isBase":false,"CODE":"[REM]","isMetric":"yes","class":"cgs","names":["radiation equivalent man"],"printSymbols":["REM"],"properties":["dose equivalent"],"values":[{"printable":"1","numeric":1}]}}};},
          "RAD",
          { type: "literal", value: "RAD", description: "\"RAD\"" },
          function(u) {return {"value": 1, "units": {"RAD": 1}, "metadata": {"RAD":{"isBase":false,"CODE":"[RAD]","isMetric":"yes","class":"cgs","names":["radiation absorbed dose"],"printSymbols":["RAD"],"properties":["energy dose"],"values":[{"printable":"100","numeric":100}]}}};},
          "a_g",
          { type: "literal", value: "a_g", description: "\"a_g\"" },
          function(u) {return {"value": 1, "units": {"a_g": 1}, "metadata": {"a_g":{"isBase":false,"CODE":"ANN_G","isMetric":"no","class":"iso1000","names":["mean Gregorian year"],"printSymbols":["a<sub>g</sub>"],"properties":["time"],"values":[{"printable":"365.2425","numeric":365.2425}]}}};},
          "Lmb",
          { type: "literal", value: "Lmb", description: "\"Lmb\"" },
          function(u) {return {"value": 1, "units": {"Lmb": 1}, "metadata": {"Lmb":{"isBase":false,"CODE":"LMB","isMetric":"yes","class":"cgs","names":["Lambert"],"printSymbols":["L"],"properties":["brightness"],"values":[{"printable":"1","numeric":1}]}}};},
          "atm",
          { type: "literal", value: "atm", description: "\"atm\"" },
          function(u) {return {"value": 1, "units": {"atm": 1}, "metadata": {"atm":{"isBase":false,"CODE":"ATM","isMetric":"no","class":"const","names":["standard atmosphere"],"printSymbols":["atm"],"properties":["pressure"],"values":[{"printable":"101325","numeric":101325}]}}};},
          "erg",
          { type: "literal", value: "erg", description: "\"erg\"" },
          function(u) {return {"value": 1, "units": {"erg": 1}, "metadata": {"erg":{"isBase":false,"CODE":"ERG","isMetric":"yes","class":"cgs","names":["erg"],"printSymbols":["erg"],"properties":["energy"],"values":[{"printable":"1","numeric":1}]}}};},
          "dyn",
          { type: "literal", value: "dyn", description: "\"dyn\"" },
          function(u) {return {"value": 1, "units": {"dyn": 1}, "metadata": {"dyn":{"isBase":false,"CODE":"DYN","isMetric":"yes","class":"cgs","names":["dyne"],"printSymbols":["dyn"],"properties":["force"],"values":[{"printable":"1","numeric":1}]}}};},
          "Gal",
          { type: "literal", value: "Gal", description: "\"Gal\"" },
          function(u) {return {"value": 1, "units": {"Gal": 1}, "metadata": {"Gal":{"isBase":false,"CODE":"GL","isMetric":"yes","class":"cgs","names":["Gal"],"printSymbols":["Gal"],"properties":["acceleration"],"values":[{"printable":"1","numeric":1}]}}};},
          "10^",
          { type: "literal", value: "10^", description: "\"10^\"" },
          function(u) {return {"value": 1, "units": {"10^": 1}, "metadata": {"10^":{"isBase":false,"CODE":"10^","isMetric":"no","class":"dimless","names":["the number ten for arbitrary powers"],"printSymbols":["10"],"properties":["number"],"values":[{"printable":"10","numeric":10}]}}};},
          "10*",
          { type: "literal", value: "10*", description: "\"10*\"" },
          function(u) {return {"value": 1, "units": {"10*": 1}, "metadata": {"10*":{"isBase":false,"CODE":"10*","isMetric":"no","class":"dimless","names":["the number ten for arbitrary powers"],"printSymbols":["10"],"properties":["number"],"values":[{"printable":"10","numeric":10}]}}};},
          "[S]",
          { type: "literal", value: "[S]", description: "\"[S]\"" },
          function(u) {return {"value": 1, "units": {"[S]": 1}, "metadata": {"[S]":{"isBase":false,"CODE":"[S]","isMetric":"no","class":"chemical","names":["Svedberg unit"],"printSymbols":["S"],"properties":["sedimentation coefficient"],"values":[{"printable":"1","numeric":1}]}}};},
          "[g]",
          { type: "literal", value: "[g]", description: "\"[g]\"" },
          function(u) {return {"value": 1, "units": {"[g]": 1}, "metadata": {"[g]":{"isBase":false,"CODE":"[G]","isMetric":"yes","class":"const","names":["standard acceleration of free fall"],"printSymbols":["<i>g<sub>n</sub>\n         </i>"],"properties":["acceleration"],"values":[{"printable":"9.80665","numeric":9.80665}]}}};},
          "[G]",
          { type: "literal", value: "[G]", description: "\"[G]\"" },
          function(u) {return {"value": 1, "units": {"[G]": 1}, "metadata": {"[G]":{"isBase":false,"CODE":"[GC]","isMetric":"yes","class":"const","names":["Newtonian constant of gravitation"],"printSymbols":["<i>G</i>"],"properties":["(unclassified)"],"values":[{"printable":"6.67259 &#215; 10<sup>-11</sup>","numeric":6.67259e-11}]}}};},
          "[e]",
          { type: "literal", value: "[e]", description: "\"[e]\"" },
          function(u) {return {"value": 1, "units": {"[e]": 1}, "metadata": {"[e]":{"isBase":false,"CODE":"[E]","isMetric":"yes","class":"const","names":["elementary charge"],"printSymbols":["<i>e</i>"],"properties":["electric charge"],"values":[{"printable":"1.60217733 &#215; 10<sup>-19</sup>","numeric":1.60217733e-19}]}}};},
          "[k]",
          { type: "literal", value: "[k]", description: "\"[k]\"" },
          function(u) {return {"value": 1, "units": {"[k]": 1}, "metadata": {"[k]":{"isBase":false,"CODE":"[K]","isMetric":"yes","class":"const","names":["Boltzmann constant"],"printSymbols":["<i>k</i>"],"properties":["(unclassified)"],"values":[{"printable":"1.380658 &#215; 10<sup>-23</sup>","numeric":1.380658e-23}]}}};},
          "[h]",
          { type: "literal", value: "[h]", description: "\"[h]\"" },
          function(u) {return {"value": 1, "units": {"[h]": 1}, "metadata": {"[h]":{"isBase":false,"CODE":"[H]","isMetric":"yes","class":"const","names":["Planck constant"],"printSymbols":["<i>h</i>"],"properties":["action"],"values":[{"printable":"6.6260755 &#215; 10<sup>-24</sup>","numeric":6.6260755e-24}]}}};},
          "[c]",
          { type: "literal", value: "[c]", description: "\"[c]\"" },
          function(u) {return {"value": 1, "units": {"[c]": 1}, "metadata": {"[c]":{"isBase":false,"CODE":"[C]","isMetric":"yes","class":"const","names":["velocity of light"],"printSymbols":["<i>c</i>"],"properties":["velocity"],"values":[{"printable":"299792458","numeric":299792458}]}}};},
          "bar",
          { type: "literal", value: "bar", description: "\"bar\"" },
          function(u) {return {"value": 1, "units": {"bar": 1}, "metadata": {"bar":{"isBase":false,"CODE":"BAR","isMetric":"yes","class":"iso1000","names":["bar"],"printSymbols":["bar"],"properties":["pressure"],"values":[{"printable":"1 &#215; 10<sup>5</sup>","numeric":100000}]}}};},
          "lm",
          { type: "literal", value: "lm", description: "\"lm\"" },
          function(u) {return {"value": 1, "units": {"lm": 1}, "metadata": {"lm":{"isBase":false,"CODE":"LM","isMetric":"yes","class":"si","names":["lumen"],"printSymbols":["lm"],"properties":["luminous flux"],"values":[{"printable":"1","numeric":1}]}}};},
          "Ci",
          { type: "literal", value: "Ci", description: "\"Ci\"" },
          function(u) {return {"value": 1, "units": {"Ci": 1}, "metadata": {"Ci":{"isBase":false,"CODE":"CI","isMetric":"yes","class":"cgs","names":["Curie"],"printSymbols":["Ci"],"properties":["radioactivity"],"values":[{"printable":"3.7 &#215; 10<sup>10</sup>","numeric":37000000000}]}}};},
          "ph",
          { type: "literal", value: "ph", description: "\"ph\"" },
          function(u) {return {"value": 1, "units": {"ph": 1}, "metadata": {"ph":{"isBase":false,"CODE":"PHT","isMetric":"yes","class":"cgs","names":["phot"],"printSymbols":["ph"],"properties":["illuminance"],"values":[{"printable":"1 &#215; 10<sup>-4</sup>","numeric":0.0001}]}}};},
          "cd",
          { type: "literal", value: "cd", description: "\"cd\"" },
          function(u) {return {"value": 1, "units": {"cd": 1}, "metadata": {"cd":{"isBase":true,"CODE":"CD","dim":"F","names":["candela"],"printSymbols":["cd"],"properties":["luminous intensity"]}}};},
          "Ao",
          { type: "literal", value: "Ao", description: "\"Ao\"" },
          function(u) {return {"value": 1, "units": {"Ao": 1}, "metadata": {"Ao":{"isBase":false,"CODE":"AO","isMetric":"no","class":"misc","names":["Ångström"],"printSymbols":["&#197;"],"properties":["length"],"values":[{"printable":"0.1","numeric":0.1}]}}};},
          "Wb",
          { type: "literal", value: "Wb", description: "\"Wb\"" },
          function(u) {return {"value": 1, "units": {"Wb": 1}, "metadata": {"Wb":{"isBase":false,"CODE":"WB","isMetric":"yes","class":"si","names":["Weber"],"printSymbols":["Wb"],"properties":["magentic flux"],"values":[{"printable":"1","numeric":1}]}}};},
          "Gb",
          { type: "literal", value: "Gb", description: "\"Gb\"" },
          function(u) {return {"value": 1, "units": {"Gb": 1}, "metadata": {"Gb":{"isBase":false,"CODE":"GB","isMetric":"yes","class":"cgs","names":["Gilbert"],"printSymbols":["Gb"],"properties":["magnetic tension"],"values":[{"printable":"1","numeric":1}]}}};},
          "Oe",
          { type: "literal", value: "Oe", description: "\"Oe\"" },
          function(u) {return {"value": 1, "units": {"Oe": 1}, "metadata": {"Oe":{"isBase":false,"CODE":"OE","isMetric":"yes","class":"cgs","names":["Oersted"],"printSymbols":["Oe"],"properties":["magnetic field intensity"],"values":[{"printable":"250","numeric":250}]}}};},
          "lx",
          { type: "literal", value: "lx", description: "\"lx\"" },
          function(u) {return {"value": 1, "units": {"lx": 1}, "metadata": {"lx":{"isBase":false,"CODE":"LX","isMetric":"yes","class":"si","names":["lux"],"printSymbols":["lx"],"properties":["illuminance"],"values":[{"printable":"1","numeric":1}]}}};},
          "Mx",
          { type: "literal", value: "Mx", description: "\"Mx\"" },
          function(u) {return {"value": 1, "units": {"Mx": 1}, "metadata": {"Mx":{"isBase":false,"CODE":"MX","isMetric":"yes","class":"cgs","names":["Maxwell"],"printSymbols":["Mx"],"properties":["flux of magnetic induction"],"values":[{"printable":"1 &#215; 10<sup>-8</sup>","numeric":1e-8}]}}};},
          "St",
          { type: "literal", value: "St", description: "\"St\"" },
          function(u) {return {"value": 1, "units": {"St": 1}, "metadata": {"St":{"isBase":false,"CODE":"ST","isMetric":"yes","class":"cgs","names":["Stokes"],"printSymbols":["St"],"properties":["kinematic viscosity"],"values":[{"printable":"1","numeric":1}]}}};},
          "Bi",
          { type: "literal", value: "Bi", description: "\"Bi\"" },
          function(u) {return {"value": 1, "units": {"Bi": 1}, "metadata": {"Bi":{"isBase":false,"CODE":"BI","isMetric":"yes","class":"cgs","names":["Biot"],"printSymbols":["Bi"],"properties":["electric current"],"values":[{"printable":"10","numeric":10}]}}};},
          "Bq",
          { type: "literal", value: "Bq", description: "\"Bq\"" },
          function(u) {return {"value": 1, "units": {"Bq": 1}, "metadata": {"Bq":{"isBase":false,"CODE":"BQ","isMetric":"yes","class":"si","names":["Becquerel"],"printSymbols":["Bq"],"properties":["radioactivity"],"values":[{"printable":"1","numeric":1}]}}};},
          "Np",
          { type: "literal", value: "Np", description: "\"Np\"" },
          function(u) {return {"value": 1, "units": {"Np": 1}, "metadata": {"Np":{"isBase":false,"CODE":"NEP","isMetric":"yes","isSpecial":"yes","class":"levels","names":["neper"],"printSymbols":["Np"],"properties":["level"],"values":[{"printable":"<function name=\"ln\" value=\"1\" Unit=\"1\"/>","numeric":null}]}}};},
          "AU",
          { type: "literal", value: "AU", description: "\"AU\"" },
          function(u) {return {"value": 1, "units": {"AU": 1}, "metadata": {"AU":{"isBase":false,"CODE":"ASU","isMetric":"no","class":"iso1000","names":["astronomic unit"],"printSymbols":["AU"],"properties":["length"],"values":[{"printable":"149597.870691","numeric":149597.870691}]}}};},
          "mo",
          { type: "literal", value: "mo", description: "\"mo\"" },
          function(u) {return {"value": 1, "units": {"mo": 1}, "metadata": {"mo":{"isBase":false,"CODE":"MO","isMetric":"no","class":"iso1000","names":["month"],"printSymbols":["mo"],"properties":["time"],"values":[{"printable":"1","numeric":1}]}}};},
          "Ky",
          { type: "literal", value: "Ky", description: "\"Ky\"" },
          function(u) {return {"value": 1, "units": {"Ky": 1}, "metadata": {"Ky":{"isBase":false,"CODE":"KY","isMetric":"yes","class":"cgs","names":["Kayser"],"printSymbols":["K"],"properties":["lineic number"],"values":[{"printable":"1","numeric":1}]}}};},
          "gf",
          { type: "literal", value: "gf", description: "\"gf\"" },
          function(u) {return {"value": 1, "units": {"gf": 1}, "metadata": {"gf":{"isBase":false,"CODE":"GF","isMetric":"yes","class":"const","names":["gram-force"],"printSymbols":["gf"],"properties":["force"],"values":[{"printable":"1","numeric":1}]}}};},
          "wk",
          { type: "literal", value: "wk", description: "\"wk\"" },
          function(u) {return {"value": 1, "units": {"wk": 1}, "metadata": {"wk":{"isBase":false,"CODE":"WK","isMetric":"no","class":"iso1000","names":["week"],"printSymbols":["wk"],"properties":["time"],"values":[{"printable":"7","numeric":7}]}}};},
          "Pa",
          { type: "literal", value: "Pa", description: "\"Pa\"" },
          function(u) {return {"value": 1, "units": {"Pa": 1}, "metadata": {"Pa":{"isBase":false,"CODE":"PAL","isMetric":"yes","class":"si","names":["Pascal"],"printSymbols":["Pa"],"properties":["pressure"],"values":[{"printable":"1","numeric":1}]}}};},
          "g%",
          { type: "literal", value: "g%", description: "\"g%\"" },
          function(u) {return {"value": 1, "units": {"g%": 1}, "metadata": {"g%":{"isBase":false,"CODE":"G%","isMetric":"yes","class":"chemical","names":["gram percent"],"printSymbols":["g%"],"properties":["mass concentration"],"values":[{"printable":"1","numeric":1}]}}};},
          "sr",
          { type: "literal", value: "sr", description: "\"sr\"" },
          function(u) {return {"value": 1, "units": {"sr": 1}, "metadata": {"sr":{"isBase":false,"CODE":"SR","isMetric":"yes","class":"si","names":["steradian"],"printSymbols":["sr"],"properties":["solid angle"],"values":[{"printable":"1","numeric":1}]}}};},
          "Bd",
          { type: "literal", value: "Bd", description: "\"Bd\"" },
          function(u) {return {"value": 1, "units": {"Bd": 1}, "metadata": {"Bd":{"isBase":false,"CODE":"BD","isMetric":"yes","class":"infotech","names":["baud"],"printSymbols":["Bd"],"properties":["signal transmission rate"],"values":[{"printable":"1","numeric":1}]}}};},
          "eq",
          { type: "literal", value: "eq", description: "\"eq\"" },
          function(u) {return {"value": 1, "units": {"eq": 1}, "metadata": {"eq":{"isBase":false,"CODE":"EQ","isMetric":"yes","class":"chemical","names":["equivalents"],"printSymbols":["eq"],"properties":["amount of substance"],"values":[{"printable":"1","numeric":1}]}}};},
          "By",
          { type: "literal", value: "By", description: "\"By\"" },
          function(u) {return {"value": 1, "units": {"By": 1}, "metadata": {"By":{"isBase":false,"CODE":"BY","isMetric":"yes","class":"infotech","names":["byte"],"printSymbols":["B"],"properties":["amount of information"],"values":[{"printable":"8","numeric":8}]}}};},
          "Hz",
          { type: "literal", value: "Hz", description: "\"Hz\"" },
          function(u) {return {"value": 1, "units": {"Hz": 1}, "metadata": {"Hz":{"isBase":false,"CODE":"HZ","isMetric":"yes","class":"si","names":["Hertz"],"printSymbols":["Hz"],"properties":["frequency"],"values":[{"printable":"1","numeric":1}]}}};},
          "''",
          { type: "literal", value: "''", description: "\"''\"" },
          function(u) {return {"value": 1, "units": {"''": 1}, "metadata": {"''":{"isBase":false,"CODE":"''","isMetric":"no","class":"iso1000","names":["second"],"printSymbols":["''"],"properties":["plane angle"],"values":[{"printable":"1","numeric":1}]}}};},
          "pc",
          { type: "literal", value: "pc", description: "\"pc\"" },
          function(u) {return {"value": 1, "units": {"pc": 1}, "metadata": {"pc":{"isBase":false,"CODE":"PRS","isMetric":"yes","class":"iso1000","names":["parsec"],"printSymbols":["pc"],"properties":["length"],"values":[{"printable":"3.085678 &#215; 10<sup>16</sup>","numeric":30856780000000000}]}}};},
          "eV",
          { type: "literal", value: "eV", description: "\"eV\"" },
          function(u) {return {"value": 1, "units": {"eV": 1}, "metadata": {"eV":{"isBase":false,"CODE":"EV","isMetric":"yes","class":"iso1000","names":["electronvolt"],"printSymbols":["eV"],"properties":["energy"],"values":[{"printable":"1","numeric":1}]}}};},
          "Gy",
          { type: "literal", value: "Gy", description: "\"Gy\"" },
          function(u) {return {"value": 1, "units": {"Gy": 1}, "metadata": {"Gy":{"isBase":false,"CODE":"GY","isMetric":"yes","class":"si","names":["Gray"],"printSymbols":["Gy"],"properties":["energy dose"],"values":[{"printable":"1","numeric":1}]}}};},
          "st",
          { type: "literal", value: "st", description: "\"st\"" },
          function(u) {return {"value": 1, "units": {"st": 1}, "metadata": {"st":{"isBase":false,"CODE":"STR","isMetric":"yes","class":"misc","names":["stere"],"printSymbols":["st"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "Sv",
          { type: "literal", value: "Sv", description: "\"Sv\"" },
          function(u) {return {"value": 1, "units": {"Sv": 1}, "metadata": {"Sv":{"isBase":false,"CODE":"SV","isMetric":"yes","class":"si","names":["Sievert"],"printSymbols":["Sv"],"properties":["dose equivalent"],"values":[{"printable":"1","numeric":1}]}}};},
          "ar",
          { type: "literal", value: "ar", description: "\"ar\"" },
          function(u) {return {"value": 1, "units": {"ar": 1}, "metadata": {"ar":{"isBase":false,"CODE":"AR","isMetric":"yes","class":"iso1000","names":["are"],"printSymbols":["a"],"properties":["area"],"values":[{"printable":"100","numeric":100}]}}};},
          "sb",
          { type: "literal", value: "sb", description: "\"sb\"" },
          function(u) {return {"value": 1, "units": {"sb": 1}, "metadata": {"sb":{"isBase":false,"CODE":"SB","isMetric":"yes","class":"cgs","names":["stilb"],"printSymbols":["sb"],"properties":["lum. intensity density"],"values":[{"printable":"1","numeric":1}]}}};},
          "L",
          { type: "literal", value: "L", description: "\"L\"" },
          function(u) {return {"value": 1, "units": {"L": 1}, "metadata": {"L":{"isBase":false,"isMetric":"yes","class":"iso1000","names":["liter"],"printSymbols":["L"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "t",
          { type: "literal", value: "t", description: "\"t\"" },
          function(u) {return {"value": 1, "units": {"t": 1}, "metadata": {"t":{"isBase":false,"CODE":"TNE","isMetric":"yes","class":"iso1000","names":["tonne"],"printSymbols":["t"],"properties":["mass"],"values":[{"printable":"1 &#215; 10<sup>3</sup>","numeric":1000}]}}};},
          "u",
          { type: "literal", value: "u", description: "\"u\"" },
          function(u) {return {"value": 1, "units": {"u": 1}, "metadata": {"u":{"isBase":false,"CODE":"AMU","isMetric":"yes","class":"iso1000","names":["unified atomic mass unit"],"printSymbols":["u"],"properties":["mass"],"values":[{"printable":"1.6605402 &#215; 10<sup>-24</sup>","numeric":1.6605402e-24}]}}};},
          "P",
          { type: "literal", value: "P", description: "\"P\"" },
          function(u) {return {"value": 1, "units": {"P": 1}, "metadata": {"P":{"isBase":false,"CODE":"P","isMetric":"yes","class":"cgs","names":["Poise"],"printSymbols":["P"],"properties":["dynamic viscosity"],"values":[{"printable":"1","numeric":1}]}}};},
          "G",
          { type: "literal", value: "G", description: "\"G\"" },
          function(u) {return {"value": 1, "units": {"G": 1}, "metadata": {"G":{"isBase":false,"CODE":"GS","isMetric":"yes","class":"cgs","names":["Gauss"],"printSymbols":["Gs"],"properties":["magnetic flux density"],"values":[{"printable":"1 &#215; 10<sup>-4</sup>","numeric":0.0001}]}}};},
          "R",
          { type: "literal", value: "R", description: "\"R\"" },
          function(u) {return {"value": 1, "units": {"R": 1}, "metadata": {"R":{"isBase":false,"CODE":"ROE","isMetric":"yes","class":"cgs","names":["Roentgen"],"printSymbols":["R"],"properties":["ion dose"],"values":[{"printable":"2.58 &#215; 10<sup>-4</sup>","numeric":0.000258}]}}};},
          "H",
          { type: "literal", value: "H", description: "\"H\"" },
          function(u) {return {"value": 1, "units": {"H": 1}, "metadata": {"H":{"isBase":false,"CODE":"H","isMetric":"yes","class":"si","names":["Henry"],"printSymbols":["H"],"properties":["inductance"],"values":[{"printable":"1","numeric":1}]}}};},
          "T",
          { type: "literal", value: "T", description: "\"T\"" },
          function(u) {return {"value": 1, "units": {"T": 1}, "metadata": {"T":{"isBase":false,"CODE":"T","isMetric":"yes","class":"si","names":["Tesla"],"printSymbols":["T"],"properties":["magnetic flux density"],"values":[{"printable":"1","numeric":1}]}}};},
          "U",
          { type: "literal", value: "U", description: "\"U\"" },
          function(u) {return {"value": 1, "units": {"U": 1}, "metadata": {"U":{"isBase":false,"CODE":"U","isMetric":"yes","class":"chemical","names":["Unit"],"printSymbols":["U"],"properties":["catalytic activity"],"values":[{"printable":"1","numeric":1}]}}};},
          "B",
          { type: "literal", value: "B", description: "\"B\"" },
          function(u) {return {"value": 1, "units": {"B": 1}, "metadata": {"B":{"isBase":false,"CODE":"B","isMetric":"yes","isSpecial":"yes","class":"levels","names":["bel"],"printSymbols":["B"],"properties":["level"],"values":[{"printable":"<function name=\"lg\" value=\"1\" Unit=\"1\"/>","numeric":null}]}}};},
          "S",
          { type: "literal", value: "S", description: "\"S\"" },
          function(u) {return {"value": 1, "units": {"S": 1}, "metadata": {"S":{"isBase":false,"CODE":"SIE","isMetric":"yes","class":"si","names":["Siemens"],"printSymbols":["S"],"properties":["electric conductance"],"values":[{"printable":"1","numeric":1}]}}};},
          "m",
          { type: "literal", value: "m", description: "\"m\"" },
          function(u) {return {"value": 1, "units": {"m": 1}, "metadata": {"m":{"isBase":true,"CODE":"M","dim":"L","names":["meter"],"printSymbols":["m"],"properties":["length"]}}};},
          "s",
          { type: "literal", value: "s", description: "\"s\"" },
          function(u) {return {"value": 1, "units": {"s": 1}, "metadata": {"s":{"isBase":true,"CODE":"S","dim":"T","names":["second"],"printSymbols":["s"],"properties":["time"]}}};},
          "F",
          { type: "literal", value: "F", description: "\"F\"" },
          function(u) {return {"value": 1, "units": {"F": 1}, "metadata": {"F":{"isBase":false,"CODE":"F","isMetric":"yes","class":"si","names":["Farad"],"printSymbols":["F"],"properties":["electric capacitance"],"values":[{"printable":"1","numeric":1}]}}};},
          "l",
          { type: "literal", value: "l", description: "\"l\"" },
          function(u) {return {"value": 1, "units": {"l": 1}, "metadata": {"l":{"isBase":false,"CODE":"L","isMetric":"yes","class":"iso1000","names":["liter"],"printSymbols":["l"],"properties":["volume"],"values":[{"printable":"1","numeric":1}]}}};},
          "V",
          { type: "literal", value: "V", description: "\"V\"" },
          function(u) {return {"value": 1, "units": {"V": 1}, "metadata": {"V":{"isBase":false,"CODE":"V","isMetric":"yes","class":"si","names":["Volt"],"printSymbols":["V"],"properties":["electric potential"],"values":[{"printable":"1","numeric":1}]}}};},
          "A",
          { type: "literal", value: "A", description: "\"A\"" },
          function(u) {return {"value": 1, "units": {"A": 1}, "metadata": {"A":{"isBase":false,"CODE":"A","isMetric":"yes","class":"si","names":["Ampère"],"printSymbols":["A"],"properties":["electric current"],"values":[{"printable":"1","numeric":1}]}}};},
          "W",
          { type: "literal", value: "W", description: "\"W\"" },
          function(u) {return {"value": 1, "units": {"W": 1}, "metadata": {"W":{"isBase":false,"CODE":"W","isMetric":"yes","class":"si","names":["Watt"],"printSymbols":["W"],"properties":["power"],"values":[{"printable":"1","numeric":1}]}}};},
          "K",
          { type: "literal", value: "K", description: "\"K\"" },
          function(u) {return {"value": 1, "units": {"K": 1}, "metadata": {"K":{"isBase":true,"CODE":"K","dim":"C","names":["Kelvin"],"printSymbols":["K"],"properties":["temperature"]}}};},
          "C",
          { type: "literal", value: "C", description: "\"C\"" },
          function(u) {return {"value": 1, "units": {"C": 1}, "metadata": {"C":{"isBase":true,"CODE":"C","dim":"Q","names":["Coulomb"],"printSymbols":["C"],"properties":["electric charge"]}}};},
          "b",
          { type: "literal", value: "b", description: "\"b\"" },
          function(u) {return {"value": 1, "units": {"b": 1}, "metadata": {"b":{"isBase":false,"CODE":"BRN","isMetric":"no","class":"misc","names":["barn"],"printSymbols":["b"],"properties":["action area"],"values":[{"printable":"100","numeric":100}]}}};},
          "%",
          { type: "literal", value: "%", description: "\"%\"" },
          function(u) {return {"value": 1, "units": {"%": 1}, "metadata": {"%":{"isBase":false,"CODE":"%","isMetric":"no","class":"dimless","names":["percent"],"printSymbols":["%"],"properties":["fraction"],"values":[{"printable":"1","numeric":1}]}}};},
          "J",
          { type: "literal", value: "J", description: "\"J\"" },
          function(u) {return {"value": 1, "units": {"J": 1}, "metadata": {"J":{"isBase":false,"CODE":"J","isMetric":"yes","class":"si","names":["Joule"],"printSymbols":["J"],"properties":["energy"],"values":[{"printable":"1","numeric":1}]}}};},
          "'",
          { type: "literal", value: "'", description: "\"'\"" },
          function(u) {return {"value": 1, "units": {"'": 1}, "metadata": {"'":{"isBase":false,"CODE":"'","isMetric":"no","class":"iso1000","names":["minute"],"printSymbols":["'"],"properties":["plane angle"],"values":[{"printable":"1","numeric":1}]}}};},
          "h",
          { type: "literal", value: "h", description: "\"h\"" },
          function(u) {return {"value": 1, "units": {"h": 1}, "metadata": {"h":{"isBase":false,"CODE":"HR","isMetric":"no","class":"iso1000","names":["hour"],"printSymbols":["h"],"properties":["time"],"values":[{"printable":"60","numeric":60}]}}};},
          "d",
          { type: "literal", value: "d", description: "\"d\"" },
          function(u) {return {"value": 1, "units": {"d": 1}, "metadata": {"d":{"isBase":false,"CODE":"D","isMetric":"no","class":"iso1000","names":["day"],"printSymbols":["d"],"properties":["time"],"values":[{"printable":"24","numeric":24}]}}};},
          "N",
          { type: "literal", value: "N", description: "\"N\"" },
          function(u) {return {"value": 1, "units": {"N": 1}, "metadata": {"N":{"isBase":false,"CODE":"N","isMetric":"yes","class":"si","names":["Newton"],"printSymbols":["N"],"properties":["force"],"values":[{"printable":"1","numeric":1}]}}};},
          "a",
          { type: "literal", value: "a", description: "\"a\"" },
          function(u) {return {"value": 1, "units": {"a": 1}, "metadata": {"a":{"isBase":false,"CODE":"ANN","isMetric":"no","class":"iso1000","names":["year"],"printSymbols":["a"],"properties":["time"],"values":[{"printable":"1","numeric":1}]}}};},
          "g",
          { type: "literal", value: "g", description: "\"g\"" },
          function(u) {return {"value": 1, "units": {"g": 1}, "metadata": {"g":{"isBase":true,"CODE":"G","dim":"M","names":["gram"],"printSymbols":["g"],"properties":["mass"]}}};},
          "Y",
          { type: "literal", value: "Y", description: "\"Y\"" },
          "Z",
          { type: "literal", value: "Z", description: "\"Z\"" },
          "E",
          { type: "literal", value: "E", description: "\"E\"" },
          "M",
          { type: "literal", value: "M", description: "\"M\"" },
          "k",
          { type: "literal", value: "k", description: "\"k\"" },
          "da",
          { type: "literal", value: "da", description: "\"da\"" },
          "c",
          { type: "literal", value: "c", description: "\"c\"" },
          "n",
          { type: "literal", value: "n", description: "\"n\"" },
          "p",
          { type: "literal", value: "p", description: "\"p\"" },
          "f",
          { type: "literal", value: "f", description: "\"f\"" },
          "z",
          { type: "literal", value: "z", description: "\"z\"" },
          "y",
          { type: "literal", value: "y", description: "\"y\"" },
          "Ki",
          { type: "literal", value: "Ki", description: "\"Ki\"" },
          "Mi",
          { type: "literal", value: "Mi", description: "\"Mi\"" },
          "Gi",
          { type: "literal", value: "Gi", description: "\"Gi\"" },
          "Ti",
          { type: "literal", value: "Ti", description: "\"Ti\"" }
        ],

        peg$bytecode = [
          peg$decode("!7!+' 4!6 !! %"),
          peg$decode("!.\"\"\"2\"3#+2$7#+(%4\"6$\"! %$\"# !\"# !*# \"7#"),
          peg$decode("!.%\"\"2%3&+-$7$+#%'\"%$\"# !\"# !*> \"!.\"\"\"2\"3#+-$7$+#%'\"%$\"# !\"# !"),
          peg$decode("!7$+;$ '7\",#&7\"\"+)%4\"6(\"\"! %$\"# !\"# !"),
          peg$decode("!7%+c$7&*# \" )+S% '7),#&7)\"+A%56* \"\"!)##\" !\" ++)%4$6,$\"#\"%$$# !$## !$\"# !\"# !*E \"!7(+:$ '7),#&7)\"+(%4\"6-\"!!%$\"# !\"# !"),
          peg$decode("!7'+' 4!6.!! %*Y \"!./\"\"2/30+B$7#+8%.1\"\"2132+(%4#63#!!%$## !$\"# !\"# !*# \"7)"),
          peg$decode("!04\"\"1!35*# \" )+3$7(+)%4\"66\"\"! %$\"# !\"# !"),
          peg$decode("!7+*# \" )+K$7*+A%567 \"! )##\" !\" ++)%4#68#\"\"!%$## !$\"# !\"# !*# \"7*"),
          peg$decode("! '09\"\"1!3:+,$,)&09\"\"1!3:\"\"\" !+i$.;\"\"2;3<*# \" )+S%7&*# \" )+C%56= #\"! )##\" !\" ++*%4$6>$##\"!%$$# !$## !$\"# !\"# !"),
          peg$decode("!.?\"\"2?3@+t$ '0A\"\"1!3B+,$,)&0A\"\"1!3B\"\"\" !+O%.C\"\"2C3D+?%56E !!)##\" !\" ++(%4$6F$!\"%$$# !$## !$\"# !\"# !"),
          peg$decode("!.G\"\"2G3H+' 4!6I!! %*\u1CCD \"!.J\"\"2J3K+' 4!6L!! %*\u1CB5 \"!.M\"\"2M3N+' 4!6O!! %*\u1C9D \"!.P\"\"2P3Q+' 4!6R!! %*\u1C85 \"!.S\"\"2S3T+' 4!6U!! %*\u1C6D \"!.V\"\"2V3W+' 4!6X!! %*\u1C55 \"!.Y\"\"2Y3Z+' 4!6[!! %*\u1C3D \"!.\\\"\"2\\3]+' 4!6^!! %*\u1C25 \"!._\"\"2_3`+' 4!6a!! %*\u1C0D \"!.b\"\"2b3c+' 4!6d!! %*\u1BF5 \"!.e\"\"2e3f+' 4!6g!! %*\u1BDD \"!.h\"\"2h3i+' 4!6j!! %*\u1BC5 \"!.k\"\"2k3l+' 4!6m!! %*\u1BAD \"!.n\"\"2n3o+' 4!6p!! %*\u1B95 \"!.q\"\"2q3r+' 4!6s!! %*\u1B7D \"!.t\"\"2t3u+' 4!6v!! %*\u1B65 \"!.w\"\"2w3x+' 4!6y!! %*\u1B4D \"!.z\"\"2z3{+' 4!6|!! %*\u1B35 \"!.}\"\"2}3~+' 4!6!! %*\u1B1D \"!.\x80\"\"2\x803\x81+' 4!6\x82!! %*\u1B05 \"!.\x83\"\"2\x833\x84+' 4!6\x85!! %*\u1AED \"!.\x86\"\"2\x863\x87+' 4!6\x88!! %*\u1AD5 \"!.\x89\"\"2\x893\x8A+' 4!6\x8B!! %*\u1ABD \"!.\x8C\"\"2\x8C3\x8D+' 4!6\x8E!! %*\u1AA5 \"!.\x8F\"\"2\x8F3\x90+' 4!6\x91!! %*\u1A8D \"!.\x92\"\"2\x923\x93+' 4!6\x94!! %*\u1A75 \"!.\x95\"\"2\x953\x96+' 4!6\x97!! %*\u1A5D \"!.\x98\"\"2\x983\x99+' 4!6\x9A!! %*\u1A45 \"!.\x9B\"\"2\x9B3\x9C+' 4!6\x9D!! %*\u1A2D \"!.\x9E\"\"2\x9E3\x9F+' 4!6\xA0!! %*\u1A15 \"!.\xA1\"\"2\xA13\xA2+' 4!6\xA3!! %*\u19FD \"!.\xA4\"\"2\xA43\xA5+' 4!6\xA6!! %*\u19E5 \"!.\xA7\"\"2\xA73\xA8+' 4!6\xA9!! %*\u19CD \"!.\xAA\"\"2\xAA3\xAB+' 4!6\xAC!! %*\u19B5 \"!.\xAD\"\"2\xAD3\xAE+' 4!6\xAF!! %*\u199D \"!.\xB0\"\"2\xB03\xB1+' 4!6\xB2!! %*\u1985 \"!.\xB3\"\"2\xB33\xB4+' 4!6\xB5!! %*\u196D \"!.\xB6\"\"2\xB63\xB7+' 4!6\xB8!! %*\u1955 \"!.\xB9\"\"2\xB93\xBA+' 4!6\xBB!! %*\u193D \"!.\xBC\"\"2\xBC3\xBD+' 4!6\xBE!! %*\u1925 \"!.\xBF\"\"2\xBF3\xC0+' 4!6\xC1!! %*\u190D \"!.\xC2\"\"2\xC23\xC3+' 4!6\xC4!! %*\u18F5 \"!.\xC5\"\"2\xC53\xC6+' 4!6\xC7!! %*\u18DD \"!.\xC8\"\"2\xC83\xC9+' 4!6\xCA!! %*\u18C5 \"!.\xCB\"\"2\xCB3\xCC+' 4!6\xCD!! %*\u18AD \"!.\xCE\"\"2\xCE3\xCF+' 4!6\xD0!! %*\u1895 \"!.\xD1\"\"2\xD13\xD2+' 4!6\xD3!! %*\u187D \"!.\xD4\"\"2\xD43\xD5+' 4!6\xD6!! %*\u1865 \"!.\xD7\"\"2\xD73\xD8+' 4!6\xD9!! %*\u184D \"!.\xDA\"\"2\xDA3\xDB+' 4!6\xDC!! %*\u1835 \"!.\xDD\"\"2\xDD3\xDE+' 4!6\xDF!! %*\u181D \"!.\xE0\"\"2\xE03\xE1+' 4!6\xE2!! %*\u1805 \"!.\xE3\"\"2\xE33\xE4+' 4!6\xE5!! %*\u17ED \"!.\xE6\"\"2\xE63\xE7+' 4!6\xE8!! %*\u17D5 \"!.\xE9\"\"2\xE93\xEA+' 4!6\xEB!! %*\u17BD \"!.\xEC\"\"2\xEC3\xED+' 4!6\xEE!! %*\u17A5 \"!.\xEF\"\"2\xEF3\xF0+' 4!6\xF1!! %*\u178D \"!.\xF2\"\"2\xF23\xF3+' 4!6\xF4!! %*\u1775 \"!.\xF5\"\"2\xF53\xF6+' 4!6\xF7!! %*\u175D \"!.\xF8\"\"2\xF83\xF9+' 4!6\xFA!! %*\u1745 \"!.\xFB\"\"2\xFB3\xFC+' 4!6\xFD!! %*\u172D \"!.\xFE\"\"2\xFE3\xFF+' 4!6\u0100!! %*\u1715 \"!.\u0101\"\"2\u01013\u0102+' 4!6\u0103!! %*\u16FD \"!.\u0104\"\"2\u01043\u0105+' 4!6\u0106!! %*\u16E5 \"!.\u0107\"\"2\u01073\u0108+' 4!6\u0109!! %*\u16CD \"!.\u010A\"\"2\u010A3\u010B+' 4!6\u010C!! %*\u16B5 \"!.\u010D\"\"2\u010D3\u010E+' 4!6\u010F!! %*\u169D \"!.\u0110\"\"2\u01103\u0111+' 4!6\u0112!! %*\u1685 \"!.\u0113\"\"2\u01133\u0114+' 4!6\u0115!! %*\u166D \"!.\u0116\"\"2\u01163\u0117+' 4!6\u0118!! %*\u1655 \"!.\u0119\"\"2\u01193\u011A+' 4!6\u011B!! %*\u163D \"!.\u011C\"\"2\u011C3\u011D+' 4!6\u011E!! %*\u1625 \"!.\u011F\"\"2\u011F3\u0120+' 4!6\u0121!! %*\u160D \"!.\u0122\"\"2\u01223\u0123+' 4!6\u0124!! %*\u15F5 \"!.\u0125\"\"2\u01253\u0126+' 4!6\u0127!! %*\u15DD \"!.\u0128\"\"2\u01283\u0129+' 4!6\u012A!! %*\u15C5 \"!.\u012B\"\"2\u012B3\u012C+' 4!6\u012D!! %*\u15AD \"!.\u012E\"\"2\u012E3\u012F+' 4!6\u0130!! %*\u1595 \"!.\u0131\"\"2\u01313\u0132+' 4!6\u0133!! %*\u157D \"!.\u0134\"\"2\u01343\u0135+' 4!6\u0136!! %*\u1565 \"!.\u0137\"\"2\u01373\u0138+' 4!6\u0139!! %*\u154D \"!.\u013A\"\"2\u013A3\u013B+' 4!6\u013C!! %*\u1535 \"!.\u013D\"\"2\u013D3\u013E+' 4!6\u013F!! %*\u151D \"!.\u0140\"\"2\u01403\u0141+' 4!6\u0142!! %*\u1505 \"!.\u0143\"\"2\u01433\u0144+' 4!6\u0145!! %*\u14ED \"!.\u0146\"\"2\u01463\u0147+' 4!6\u0148!! %*\u14D5 \"!.\u0149\"\"2\u01493\u014A+' 4!6\u014B!! %*\u14BD \"!.\u014C\"\"2\u014C3\u014D+' 4!6\u014E!! %*\u14A5 \"!.\u014F\"\"2\u014F3\u0150+' 4!6\u0151!! %*\u148D \"!.\u0152\"\"2\u01523\u0153+' 4!6\u0154!! %*\u1475 \"!.\u0155\"\"2\u01553\u0156+' 4!6\u0157!! %*\u145D \"!.\u0158\"\"2\u01583\u0159+' 4!6\u015A!! %*\u1445 \"!.\u015B\"\"2\u015B3\u015C+' 4!6\u015D!! %*\u142D \"!.\u015E\"\"2\u015E3\u015F+' 4!6\u0160!! %*\u1415 \"!.\u0161\"\"2\u01613\u0162+' 4!6\u0163!! %*\u13FD \"!.\u0164\"\"2\u01643\u0165+' 4!6\u0166!! %*\u13E5 \"!.\u0167\"\"2\u01673\u0168+' 4!6\u0169!! %*\u13CD \"!.\u016A\"\"2\u016A3\u016B+' 4!6\u016C!! %*\u13B5 \"!.\u016D\"\"2\u016D3\u016E+' 4!6\u016F!! %*\u139D \"!.\u0170\"\"2\u01703\u0171+' 4!6\u0172!! %*\u1385 \"!.\u0173\"\"2\u01733\u0174+' 4!6\u0175!! %*\u136D \"!.\u0176\"\"2\u01763\u0177+' 4!6\u0178!! %*\u1355 \"!.\u0179\"\"2\u01793\u017A+' 4!6\u017B!! %*\u133D \"!.\u017C\"\"2\u017C3\u017D+' 4!6\u017E!! %*\u1325 \"!.\u017F\"\"2\u017F3\u0180+' 4!6\u0181!! %*\u130D \"!.\u0182\"\"2\u01823\u0183+' 4!6\u0184!! %*\u12F5 \"!.\u0185\"\"2\u01853\u0186+' 4!6\u0187!! %*\u12DD \"!.\u0188\"\"2\u01883\u0189+' 4!6\u018A!! %*\u12C5 \"!.\u018B\"\"2\u018B3\u018C+' 4!6\u018D!! %*\u12AD \"!.\u018E\"\"2\u018E3\u018F+' 4!6\u0190!! %*\u1295 \"!.\u0191\"\"2\u01913\u0192+' 4!6\u0193!! %*\u127D \"!.\u0194\"\"2\u01943\u0195+' 4!6\u0196!! %*\u1265 \"!.\u0197\"\"2\u01973\u0198+' 4!6\u0199!! %*\u124D \"!.\u019A\"\"2\u019A3\u019B+' 4!6\u019C!! %*\u1235 \"!.\u019D\"\"2\u019D3\u019E+' 4!6\u019F!! %*\u121D \"!.\u01A0\"\"2\u01A03\u01A1+' 4!6\u01A2!! %*\u1205 \"!.\u01A3\"\"2\u01A33\u01A4+' 4!6\u01A5!! %*\u11ED \"!.\u01A6\"\"2\u01A63\u01A7+' 4!6\u01A8!! %*\u11D5 \"!.\u01A9\"\"2\u01A93\u01AA+' 4!6\u01AB!! %*\u11BD \"!.\u01AC\"\"2\u01AC3\u01AD+' 4!6\u01AE!! %*\u11A5 \"!.\u01AF\"\"2\u01AF3\u01B0+' 4!6\u01B1!! %*\u118D \"!.\u01B2\"\"2\u01B23\u01B3+' 4!6\u01B4!! %*\u1175 \"!.\u01B5\"\"2\u01B53\u01B6+' 4!6\u01B7!! %*\u115D \"!.\u01B8\"\"2\u01B83\u01B9+' 4!6\u01BA!! %*\u1145 \"!.\u01BB\"\"2\u01BB3\u01BC+' 4!6\u01BD!! %*\u112D \"!.\u01BE\"\"2\u01BE3\u01BF+' 4!6\u01C0!! %*\u1115 \"!.\u01C1\"\"2\u01C13\u01C2+' 4!6\u01C3!! %*\u10FD \"!.\u01C4\"\"2\u01C43\u01C5+' 4!6\u01C6!! %*\u10E5 \"!.\u01C7\"\"2\u01C73\u01C8+' 4!6\u01C9!! %*\u10CD \"!.\u01CA\"\"2\u01CA3\u01CB+' 4!6\u01CC!! %*\u10B5 \"!.\u01CD\"\"2\u01CD3\u01CE+' 4!6\u01CF!! %*\u109D \"!.\u01D0\"\"2\u01D03\u01D1+' 4!6\u01D2!! %*\u1085 \"!.\u01D3\"\"2\u01D33\u01D4+' 4!6\u01D5!! %*\u106D \"!.\u01D6\"\"2\u01D63\u01D7+' 4!6\u01D8!! %*\u1055 \"!.\u01D9\"\"2\u01D93\u01DA+' 4!6\u01DB!! %*\u103D \"!.\u01DC\"\"2\u01DC3\u01DD+' 4!6\u01DE!! %*\u1025 \"!.\u01DF\"\"2\u01DF3\u01E0+' 4!6\u01E1!! %*\u100D \"!.\u01E2\"\"2\u01E23\u01E3+' 4!6\u01E4!! %*\u0FF5 \"!.\u01E5\"\"2\u01E53\u01E6+' 4!6\u01E7!! %*\u0FDD \"!.\u01E8\"\"2\u01E83\u01E9+' 4!6\u01EA!! %*\u0FC5 \"!.\u01EB\"\"2\u01EB3\u01EC+' 4!6\u01ED!! %*\u0FAD \"!.\u01EE\"\"2\u01EE3\u01EF+' 4!6\u01F0!! %*\u0F95 \"!.\u01F1\"\"2\u01F13\u01F2+' 4!6\u01F3!! %*\u0F7D \"!.\u01F4\"\"2\u01F43\u01F5+' 4!6\u01F6!! %*\u0F65 \"!.\u01F7\"\"2\u01F73\u01F8+' 4!6\u01F9!! %*\u0F4D \"!.\u01FA\"\"2\u01FA3\u01FB+' 4!6\u01FC!! %*\u0F35 \"!.\u01FD\"\"2\u01FD3\u01FE+' 4!6\u01FF!! %*\u0F1D \"!.\u0200\"\"2\u02003\u0201+' 4!6\u0202!! %*\u0F05 \"!.\u0203\"\"2\u02033\u0204+' 4!6\u0205!! %*\u0EED \"!.\u0206\"\"2\u02063\u0207+' 4!6\u0208!! %*\u0ED5 \"!.\u0209\"\"2\u02093\u020A+' 4!6\u020B!! %*\u0EBD \"!.\u020C\"\"2\u020C3\u020D+' 4!6\u020E!! %*\u0EA5 \"!.\u020F\"\"2\u020F3\u0210+' 4!6\u0211!! %*\u0E8D \"!.\u0212\"\"2\u02123\u0213+' 4!6\u0214!! %*\u0E75 \"!.\u0215\"\"2\u02153\u0216+' 4!6\u0217!! %*\u0E5D \"!.\u0218\"\"2\u02183\u0219+' 4!6\u021A!! %*\u0E45 \"!.\u021B\"\"2\u021B3\u021C+' 4!6\u021D!! %*\u0E2D \"!.\u021E\"\"2\u021E3\u021F+' 4!6\u0220!! %*\u0E15 \"!.\u0221\"\"2\u02213\u0222+' 4!6\u0223!! %*\u0DFD \"!.\u0224\"\"2\u02243\u0225+' 4!6\u0226!! %*\u0DE5 \"!.\u0227\"\"2\u02273\u0228+' 4!6\u0229!! %*\u0DCD \"!.\u022A\"\"2\u022A3\u022B+' 4!6\u022C!! %*\u0DB5 \"!.\u022D\"\"2\u022D3\u022E+' 4!6\u022F!! %*\u0D9D \"!.\u0230\"\"2\u02303\u0231+' 4!6\u0232!! %*\u0D85 \"!.\u0233\"\"2\u02333\u0234+' 4!6\u0235!! %*\u0D6D \"!.\u0236\"\"2\u02363\u0237+' 4!6\u0238!! %*\u0D55 \"!.\u0239\"\"2\u02393\u023A+' 4!6\u023B!! %*\u0D3D \"!.\u023C\"\"2\u023C3\u023D+' 4!6\u023E!! %*\u0D25 \"!.\u023F\"\"2\u023F3\u0240+' 4!6\u0241!! %*\u0D0D \"!.\u0242\"\"2\u02423\u0243+' 4!6\u0244!! %*\u0CF5 \"!.\u0245\"\"2\u02453\u0246+' 4!6\u0247!! %*\u0CDD \"!.\u0248\"\"2\u02483\u0249+' 4!6\u024A!! %*\u0CC5 \"!.\u024B\"\"2\u024B3\u024C+' 4!6\u024D!! %*\u0CAD \"!.\u024E\"\"2\u024E3\u024F+' 4!6\u0250!! %*\u0C95 \"!.\u0251\"\"2\u02513\u0252+' 4!6\u0253!! %*\u0C7D \"!.\u0254\"\"2\u02543\u0255+' 4!6\u0256!! %*\u0C65 \"!.\u0257\"\"2\u02573\u0258+' 4!6\u0259!! %*\u0C4D \"!.\u025A\"\"2\u025A3\u025B+' 4!6\u025C!! %*\u0C35 \"!.\u025D\"\"2\u025D3\u025E+' 4!6\u025F!! %*\u0C1D \"!.\u0260\"\"2\u02603\u0261+' 4!6\u0262!! %*\u0C05 \"!.\u0263\"\"2\u02633\u0264+' 4!6\u0265!! %*\u0BED \"!.\u0266\"\"2\u02663\u0267+' 4!6\u0268!! %*\u0BD5 \"!.\u0269\"\"2\u02693\u026A+' 4!6\u026B!! %*\u0BBD \"!.\u026C\"\"2\u026C3\u026D+' 4!6\u026E!! %*\u0BA5 \"!.\u026F\"\"2\u026F3\u0270+' 4!6\u0271!! %*\u0B8D \"!.\u0272\"\"2\u02723\u0273+' 4!6\u0274!! %*\u0B75 \"!.\u0275\"\"2\u02753\u0276+' 4!6\u0277!! %*\u0B5D \"!.\u0278\"\"2\u02783\u0279+' 4!6\u027A!! %*\u0B45 \"!.\u027B\"\"2\u027B3\u027C+' 4!6\u027D!! %*\u0B2D \"!.\u027E\"\"2\u027E3\u027F+' 4!6\u0280!! %*\u0B15 \"!.\u0281\"\"2\u02813\u0282+' 4!6\u0283!! %*\u0AFD \"!.\u0284\"\"2\u02843\u0285+' 4!6\u0286!! %*\u0AE5 \"!.\u0287\"\"2\u02873\u0288+' 4!6\u0289!! %*\u0ACD \"!.\u028A\"\"2\u028A3\u028B+' 4!6\u028C!! %*\u0AB5 \"!.\u028D\"\"2\u028D3\u028E+' 4!6\u028F!! %*\u0A9D \"!.\u0290\"\"2\u02903\u0291+' 4!6\u0292!! %*\u0A85 \"!.\u0293\"\"2\u02933\u0294+' 4!6\u0295!! %*\u0A6D \"!.\u0296\"\"2\u02963\u0297+' 4!6\u0298!! %*\u0A55 \"!.\u0299\"\"2\u02993\u029A+' 4!6\u029B!! %*\u0A3D \"!.\u029C\"\"2\u029C3\u029D+' 4!6\u029E!! %*\u0A25 \"!.\u029F\"\"2\u029F3\u02A0+' 4!6\u02A1!! %*\u0A0D \"!.\u02A2\"\"2\u02A23\u02A3+' 4!6\u02A4!! %*\u09F5 \"!.\u02A5\"\"2\u02A53\u02A6+' 4!6\u02A7!! %*\u09DD \"!.\u02A8\"\"2\u02A83\u02A9+' 4!6\u02AA!! %*\u09C5 \"!.\u02AB\"\"2\u02AB3\u02AC+' 4!6\u02AD!! %*\u09AD \"!.\u02AE\"\"2\u02AE3\u02AF+' 4!6\u02B0!! %*\u0995 \"!.\u02B1\"\"2\u02B13\u02B2+' 4!6\u02B3!! %*\u097D \"!.\u02B4\"\"2\u02B43\u02B5+' 4!6\u02B6!! %*\u0965 \"!.\u02B7\"\"2\u02B73\u02B8+' 4!6\u02B9!! %*\u094D \"!.\u02BA\"\"2\u02BA3\u02BB+' 4!6\u02BC!! %*\u0935 \"!.\u02BD\"\"2\u02BD3\u02BE+' 4!6\u02BF!! %*\u091D \"!.\u02C0\"\"2\u02C03\u02C1+' 4!6\u02C2!! %*\u0905 \"!.\u02C3\"\"2\u02C33\u02C4+' 4!6\u02C5!! %*\u08ED \"!.\u02C6\"\"2\u02C63\u02C7+' 4!6\u02C8!! %*\u08D5 \"!.\u02C9\"\"2\u02C93\u02CA+' 4!6\u02CB!! %*\u08BD \"!.\u02CC\"\"2\u02CC3\u02CD+' 4!6\u02CE!! %*\u08A5 \"!.\u02CF\"\"2\u02CF3\u02D0+' 4!6\u02D1!! %*\u088D \"!.\u02D2\"\"2\u02D23\u02D3+' 4!6\u02D4!! %*\u0875 \"!.\u02D5\"\"2\u02D53\u02D6+' 4!6\u02D7!! %*\u085D \"!.\u02D8\"\"2\u02D83\u02D9+' 4!6\u02DA!! %*\u0845 \"!.\u02DB\"\"2\u02DB3\u02DC+' 4!6\u02DD!! %*\u082D \"!.\u02DE\"\"2\u02DE3\u02DF+' 4!6\u02E0!! %*\u0815 \"!.\u02E1\"\"2\u02E13\u02E2+' 4!6\u02E3!! %*\u07FD \"!.\u02E4\"\"2\u02E43\u02E5+' 4!6\u02E6!! %*\u07E5 \"!.\u02E7\"\"2\u02E73\u02E8+' 4!6\u02E9!! %*\u07CD \"!.\u02EA\"\"2\u02EA3\u02EB+' 4!6\u02EC!! %*\u07B5 \"!.\u02ED\"\"2\u02ED3\u02EE+' 4!6\u02EF!! %*\u079D \"!.\u02F0\"\"2\u02F03\u02F1+' 4!6\u02F2!! %*\u0785 \"!.\u02F3\"\"2\u02F33\u02F4+' 4!6\u02F5!! %*\u076D \"!.\u02F6\"\"2\u02F63\u02F7+' 4!6\u02F8!! %*\u0755 \"!.\u02F9\"\"2\u02F93\u02FA+' 4!6\u02FB!! %*\u073D \"!.\u02FC\"\"2\u02FC3\u02FD+' 4!6\u02FE!! %*\u0725 \"!.\u02FF\"\"2\u02FF3\u0300+' 4!6\u0301!! %*\u070D \"!.\u0302\"\"2\u03023\u0303+' 4!6\u0304!! %*\u06F5 \"!.\u0305\"\"2\u03053\u0306+' 4!6\u0307!! %*\u06DD \"!.\u0308\"\"2\u03083\u0309+' 4!6\u030A!! %*\u06C5 \"!.\u030B\"\"2\u030B3\u030C+' 4!6\u030D!! %*\u06AD \"!.\u030E\"\"2\u030E3\u030F+' 4!6\u0310!! %*\u0695 \"!.\u0311\"\"2\u03113\u0312+' 4!6\u0313!! %*\u067D \"!.\u0314\"\"2\u03143\u0315+' 4!6\u0316!! %*\u0665 \"!.\u0317\"\"2\u03173\u0318+' 4!6\u0319!! %*\u064D \"!.\u031A\"\"2\u031A3\u031B+' 4!6\u031C!! %*\u0635 \"!.\u031D\"\"2\u031D3\u031E+' 4!6\u031F!! %*\u061D \"!.\u0320\"\"2\u03203\u0321+' 4!6\u0322!! %*\u0605 \"!.\u0323\"\"2\u03233\u0324+' 4!6\u0325!! %*\u05ED \"!.\u0326\"\"2\u03263\u0327+' 4!6\u0328!! %*\u05D5 \"!.\u0329\"\"2\u03293\u032A+' 4!6\u032B!! %*\u05BD \"!.\u032C\"\"2\u032C3\u032D+' 4!6\u032E!! %*\u05A5 \"!.\u032F\"\"2\u032F3\u0330+' 4!6\u0331!! %*\u058D \"!.\u0332\"\"2\u03323\u0333+' 4!6\u0334!! %*\u0575 \"!.\u0335\"\"2\u03353\u0336+' 4!6\u0337!! %*\u055D \"!.\u0338\"\"2\u03383\u0339+' 4!6\u033A!! %*\u0545 \"!.\u033B\"\"2\u033B3\u033C+' 4!6\u033D!! %*\u052D \"!.\u033E\"\"2\u033E3\u033F+' 4!6\u0340!! %*\u0515 \"!.\u0341\"\"2\u03413\u0342+' 4!6\u0343!! %*\u04FD \"!.\u0344\"\"2\u03443\u0345+' 4!6\u0346!! %*\u04E5 \"!.\u0347\"\"2\u03473\u0348+' 4!6\u0349!! %*\u04CD \"!.\u034A\"\"2\u034A3\u034B+' 4!6\u034C!! %*\u04B5 \"!.\u034D\"\"2\u034D3\u034E+' 4!6\u034F!! %*\u049D \"!.\u0350\"\"2\u03503\u0351+' 4!6\u0352!! %*\u0485 \"!.\u0353\"\"2\u03533\u0354+' 4!6\u0355!! %*\u046D \"!.\u0356\"\"2\u03563\u0357+' 4!6\u0358!! %*\u0455 \"!.\u0359\"\"2\u03593\u035A+' 4!6\u035B!! %*\u043D \"!.\u035C\"\"2\u035C3\u035D+' 4!6\u035E!! %*\u0425 \"!.\u035F\"\"2\u035F3\u0360+' 4!6\u0361!! %*\u040D \"!.\u0362\"\"2\u03623\u0363+' 4!6\u0364!! %*\u03F5 \"!.\u0365\"\"2\u03653\u0366+' 4!6\u0367!! %*\u03DD \"!.\u0368\"\"2\u03683\u0369+' 4!6\u036A!! %*\u03C5 \"!.\u036B\"\"2\u036B3\u036C+' 4!6\u036D!! %*\u03AD \"!.\u036E\"\"2\u036E3\u036F+' 4!6\u0370!! %*\u0395 \"!.\u0371\"\"2\u03713\u0372+' 4!6\u0373!! %*\u037D \"!.\u0374\"\"2\u03743\u0375+' 4!6\u0376!! %*\u0365 \"!.\u0377\"\"2\u03773\u0378+' 4!6\u0379!! %*\u034D \"!.\u037A\"\"2\u037A3\u037B+' 4!6\u037C!! %*\u0335 \"!.\u037D\"\"2\u037D3\u037E+' 4!6\u037F!! %*\u031D \"!.\u0380\"\"2\u03803\u0381+' 4!6\u0382!! %*\u0305 \"!.\u0383\"\"2\u03833\u0384+' 4!6\u0385!! %*\u02ED \"!.\u0386\"\"2\u03863\u0387+' 4!6\u0388!! %*\u02D5 \"!.\u0389\"\"2\u03893\u038A+' 4!6\u038B!! %*\u02BD \"!.\u038C\"\"2\u038C3\u038D+' 4!6\u038E!! %*\u02A5 \"!.\u038F\"\"2\u038F3\u0390+' 4!6\u0391!! %*\u028D \"!.\u0392\"\"2\u03923\u0393+' 4!6\u0394!! %*\u0275 \"!.\u0395\"\"2\u03953\u0396+' 4!6\u0397!! %*\u025D \"!.\u0398\"\"2\u03983\u0399+' 4!6\u039A!! %*\u0245 \"!.\u039B\"\"2\u039B3\u039C+' 4!6\u039D!! %*\u022D \"!.\u039E\"\"2\u039E3\u039F+' 4!6\u03A0!! %*\u0215 \"!.\u03A1\"\"2\u03A13\u03A2+' 4!6\u03A3!! %*\u01FD \"!.\u03A4\"\"2\u03A43\u03A5+' 4!6\u03A6!! %*\u01E5 \"!.\u03A7\"\"2\u03A73\u03A8+' 4!6\u03A9!! %*\u01CD \"!.\u03AA\"\"2\u03AA3\u03AB+' 4!6\u03AC!! %*\u01B5 \"!.\u03AD\"\"2\u03AD3\u03AE+' 4!6\u03AF!! %*\u019D \"!.\u03B0\"\"2\u03B03\u03B1+' 4!6\u03B2!! %*\u0185 \"!.\u03B3\"\"2\u03B33\u03B4+' 4!6\u03B5!! %*\u016D \"!.\u03B6\"\"2\u03B63\u03B7+' 4!6\u03B8!! %*\u0155 \"!.\u03B9\"\"2\u03B93\u03BA+' 4!6\u03BB!! %*\u013D \"!.\u03BC\"\"2\u03BC3\u03BD+' 4!6\u03BE!! %*\u0125 \"!.\u03BF\"\"2\u03BF3\u03C0+' 4!6\u03C1!! %*\u010D \"!.\u03C2\"\"2\u03C23\u03C3+' 4!6\u03C4!! %*\xF5 \"!.\u03C5\"\"2\u03C53\u03C6+' 4!6\u03C7!! %*\xDD \"!.\u03C8\"\"2\u03C83\u03C9+' 4!6\u03CA!! %*\xC5 \"!.\u03CB\"\"2\u03CB3\u03CC+' 4!6\u03CD!! %*\xAD \"!.\u03CE\"\"2\u03CE3\u03CF+' 4!6\u03D0!! %*\x95 \"!.\u03D1\"\"2\u03D13\u03D2+' 4!6\u03D3!! %*} \"!.\u03D4\"\"2\u03D43\u03D5+' 4!6\u03D6!! %*e \"!.\u03D7\"\"2\u03D73\u03D8+' 4!6\u03D9!! %*M \"!.\u03DA\"\"2\u03DA3\u03DB+' 4!6\u03DC!! %*5 \"!.\u03DD\"\"2\u03DD3\u03DE+' 4!6\u03DF!! %"),
          peg$decode(".\u03E0\"\"2\u03E03\u03E1*\u0131 \".\u03E2\"\"2\u03E23\u03E3*\u0125 \".\u03E4\"\"2\u03E43\u03E5*\u0119 \".\u0392\"\"2\u03923\u0393*\u010D \".\u039E\"\"2\u039E3\u039F*\u0101 \".\u0395\"\"2\u03953\u0396*\xF5 \".\u03E6\"\"2\u03E63\u03E7*\xE9 \".\u03E8\"\"2\u03E83\u03E9*\xDD \".\u03D1\"\"2\u03D13\u03D2*\xD1 \".\u03EA\"\"2\u03EA3\u03EB*\xC5 \".\u03D4\"\"2\u03D43\u03D5*\xB9 \".\u03EC\"\"2\u03EC3\u03ED*\xAD \".\u03AA\"\"2\u03AA3\u03AB*\xA1 \".\u038F\"\"2\u038F3\u0390*\x95 \".\u03EE\"\"2\u03EE3\u03EF*\x89 \".\u03F0\"\"2\u03F03\u03F1*} \".\u03F2\"\"2\u03F23\u03F3*q \".\u03DA\"\"2\u03DA3\u03DB*e \".\u03F4\"\"2\u03F43\u03F5*Y \".\u03F6\"\"2\u03F63\u03F7*M \".\u03F8\"\"2\u03F83\u03F9*A \".\u03FA\"\"2\u03FA3\u03FB*5 \".\u03FC\"\"2\u03FC3\u03FD*) \".\u03FE\"\"2\u03FE3\u03FF")
        ],

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleIndices)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleIndex = peg$startRuleIndices[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$decode(s) {
      var bc = new Array(s.length), i;

      for (i = 0; i < s.length; i++) {
        bc[i] = s.charCodeAt(i) - 32;
      }

      return bc;
    }

    function peg$parseRule(index) {
      var bc    = peg$bytecode[index],
          ip    = 0,
          ips   = [],
          end   = bc.length,
          ends  = [],
          stack = [],
          params, i;

      function protect(object) {
        return Object.prototype.toString.apply(object) === "[object Array]" ? [] : object;
      }

      while (true) {
        while (ip < end) {
          switch (bc[ip]) {
            case 0:
              stack.push(protect(peg$consts[bc[ip + 1]]));
              ip += 2;
              break;

            case 1:
              stack.push(peg$currPos);
              ip++;
              break;

            case 2:
              stack.pop();
              ip++;
              break;

            case 3:
              peg$currPos = stack.pop();
              ip++;
              break;

            case 4:
              stack.length -= bc[ip + 1];
              ip += 2;
              break;

            case 5:
              stack.splice(-2, 1);
              ip++;
              break;

            case 6:
              stack[stack.length - 2].push(stack.pop());
              ip++;
              break;

            case 7:
              stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
              ip += 2;
              break;

            case 8:
              stack.pop();
              stack.push(input.substring(stack[stack.length - 1], peg$currPos));
              ip++;
              break;

            case 9:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1]) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 10:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] === peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 11:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] !== peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 12:
              if (stack[stack.length - 1] !== peg$FAILED) {
                ends.push(end);
                ips.push(ip);

                end = ip + 2 + bc[ip + 1];
                ip += 2;
              } else {
                ip += 2 + bc[ip + 1];
              }

              break;

            case 13:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (input.length > peg$currPos) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 14:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 15:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 16:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 17:
              stack.push(input.substr(peg$currPos, bc[ip + 1]));
              peg$currPos += bc[ip + 1];
              ip += 2;
              break;

            case 18:
              stack.push(peg$consts[bc[ip + 1]]);
              peg$currPos += peg$consts[bc[ip + 1]].length;
              ip += 2;
              break;

            case 19:
              stack.push(peg$FAILED);
              if (peg$silentFails === 0) {
                peg$fail(peg$consts[bc[ip + 1]]);
              }
              ip += 2;
              break;

            case 20:
              peg$reportedPos = stack[stack.length - 1 - bc[ip + 1]];
              ip += 2;
              break;

            case 21:
              peg$reportedPos = peg$currPos;
              ip++;
              break;

            case 22:
              params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);
              for (i = 0; i < bc[ip + 3]; i++) {
                params[i] = stack[stack.length - 1 - params[i]];
              }

              stack.splice(
                stack.length - bc[ip + 2],
                bc[ip + 2],
                peg$consts[bc[ip + 1]].apply(null, params)
              );

              ip += 4 + bc[ip + 3];
              break;

            case 23:
              stack.push(peg$parseRule(bc[ip + 1]));
              ip += 2;
              break;

            case 24:
              peg$silentFails++;
              ip++;
              break;

            case 25:
              peg$silentFails--;
              ip++;
              break;

            default:
              throw new Error("Invalid opcode: " + bc[ip] + ".");
          }
        }

        if (ends.length > 0) {
          end = ends.pop();
          ip = ips.pop();
        } else {
          break;
        }
      }

      return stack[0];
    }


      helpers = require('../lib/helpers');
      prefixes = require('./prefixes.json');
      prefixMetadata = require('./prefixMetadata.json');
      unitMetadata = require('./unitMetadata.json');
      metrics = require('./metrics.json');
      multiply = helpers.multiply;
      topower = helpers.topower;
      cleanup = helpers.cleanup;
      ismetric = helpers.ismetric(metrics);


    peg$result = peg$parseRule(peg$startRuleIndex);

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();

},{"../lib/helpers":55,"./metrics.json":50,"./prefixMetadata.json":51,"./prefixes.json":52,"./unitMetadata.json":54}],54:[function(require,module,exports){
module.exports={
  "10*": {
    "isBase": false,
    "CODE": "10*",
    "isMetric": "no",
    "class": "dimless",
    "names": [
      "the number ten for arbitrary powers"
    ],
    "printSymbols": [
      "10"
    ],
    "properties": [
      "number"
    ],
    "values": [
      {
        "printable": "10",
        "numeric": 10
      }
    ]
  },
  "10^": {
    "isBase": false,
    "CODE": "10^",
    "isMetric": "no",
    "class": "dimless",
    "names": [
      "the number ten for arbitrary powers"
    ],
    "printSymbols": [
      "10"
    ],
    "properties": [
      "number"
    ],
    "values": [
      {
        "printable": "10",
        "numeric": 10
      }
    ]
  },
  "[pi]": {
    "isBase": false,
    "CODE": "[PI]",
    "isMetric": "no",
    "class": "dimless",
    "names": [
      "the number pi"
    ],
    "printSymbols": [
      "&#960;"
    ],
    "properties": [
      "number"
    ],
    "values": [
      {
        "printable": "&#960;",
        "numeric": 3.141592653589793
      }
    ]
  },
  "%": {
    "isBase": false,
    "CODE": "%",
    "isMetric": "no",
    "class": "dimless",
    "names": [
      "percent"
    ],
    "printSymbols": [
      "%"
    ],
    "properties": [
      "fraction"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[ppth]": {
    "isBase": false,
    "CODE": "[PPTH]",
    "isMetric": "no",
    "class": "dimless",
    "names": [
      "parts per thousand"
    ],
    "printSymbols": [
      "ppth"
    ],
    "properties": [
      "fraction"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[ppm]": {
    "isBase": false,
    "CODE": "[PPM]",
    "isMetric": "no",
    "class": "dimless",
    "names": [
      "parts per million"
    ],
    "printSymbols": [
      "ppm"
    ],
    "properties": [
      "fraction"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[ppb]": {
    "isBase": false,
    "CODE": "[PPB]",
    "isMetric": "no",
    "class": "dimless",
    "names": [
      "parts per billion"
    ],
    "printSymbols": [
      "ppb"
    ],
    "properties": [
      "fraction"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[pptr]": {
    "isBase": false,
    "CODE": "[PPTR]",
    "isMetric": "no",
    "class": "dimless",
    "names": [
      "parts per trillion"
    ],
    "printSymbols": [
      "pptr"
    ],
    "properties": [
      "fraction"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "mol": {
    "isBase": false,
    "CODE": "MOL",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "mole"
    ],
    "printSymbols": [
      "mol"
    ],
    "properties": [
      "amount of substance"
    ],
    "values": [
      {
        "printable": "6.0221367",
        "numeric": 6.0221367
      }
    ]
  },
  "sr": {
    "isBase": false,
    "CODE": "SR",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "steradian"
    ],
    "printSymbols": [
      "sr"
    ],
    "properties": [
      "solid angle"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Hz": {
    "isBase": false,
    "CODE": "HZ",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Hertz"
    ],
    "printSymbols": [
      "Hz"
    ],
    "properties": [
      "frequency"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "N": {
    "isBase": false,
    "CODE": "N",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Newton"
    ],
    "printSymbols": [
      "N"
    ],
    "properties": [
      "force"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Pa": {
    "isBase": false,
    "CODE": "PAL",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Pascal"
    ],
    "printSymbols": [
      "Pa"
    ],
    "properties": [
      "pressure"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "J": {
    "isBase": false,
    "CODE": "J",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Joule"
    ],
    "printSymbols": [
      "J"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "W": {
    "isBase": false,
    "CODE": "W",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Watt"
    ],
    "printSymbols": [
      "W"
    ],
    "properties": [
      "power"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "A": {
    "isBase": false,
    "CODE": "A",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Ampère"
    ],
    "printSymbols": [
      "A"
    ],
    "properties": [
      "electric current"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "V": {
    "isBase": false,
    "CODE": "V",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Volt"
    ],
    "printSymbols": [
      "V"
    ],
    "properties": [
      "electric potential"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "F": {
    "isBase": false,
    "CODE": "F",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Farad"
    ],
    "printSymbols": [
      "F"
    ],
    "properties": [
      "electric capacitance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Ohm": {
    "isBase": false,
    "CODE": "OHM",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Ohm"
    ],
    "printSymbols": [
      "&#937;"
    ],
    "properties": [
      "electric resistance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "S": {
    "isBase": false,
    "CODE": "SIE",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Siemens"
    ],
    "printSymbols": [
      "S"
    ],
    "properties": [
      "electric conductance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Wb": {
    "isBase": false,
    "CODE": "WB",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Weber"
    ],
    "printSymbols": [
      "Wb"
    ],
    "properties": [
      "magentic flux"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Cel": {
    "isBase": false,
    "CODE": "CEL",
    "isMetric": "yes",
    "isSpecial": "yes",
    "class": "si",
    "names": [
      "degree Celsius"
    ],
    "printSymbols": [
      "&#176;C"
    ],
    "properties": [
      "temperature"
    ],
    "values": [
      {
        "printable": "<function name=\"Cel\" value=\"1\" Unit=\"K\"/>",
        "numeric": null
      }
    ]
  },
  "T": {
    "isBase": false,
    "CODE": "T",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Tesla"
    ],
    "printSymbols": [
      "T"
    ],
    "properties": [
      "magnetic flux density"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "H": {
    "isBase": false,
    "CODE": "H",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Henry"
    ],
    "printSymbols": [
      "H"
    ],
    "properties": [
      "inductance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "lm": {
    "isBase": false,
    "CODE": "LM",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "lumen"
    ],
    "printSymbols": [
      "lm"
    ],
    "properties": [
      "luminous flux"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "lx": {
    "isBase": false,
    "CODE": "LX",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "lux"
    ],
    "printSymbols": [
      "lx"
    ],
    "properties": [
      "illuminance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Bq": {
    "isBase": false,
    "CODE": "BQ",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Becquerel"
    ],
    "printSymbols": [
      "Bq"
    ],
    "properties": [
      "radioactivity"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Gy": {
    "isBase": false,
    "CODE": "GY",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Gray"
    ],
    "printSymbols": [
      "Gy"
    ],
    "properties": [
      "energy dose"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Sv": {
    "isBase": false,
    "CODE": "SV",
    "isMetric": "yes",
    "class": "si",
    "names": [
      "Sievert"
    ],
    "printSymbols": [
      "Sv"
    ],
    "properties": [
      "dose equivalent"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "gon": {
    "isBase": false,
    "CODE": "GON",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "gon",
      "grade"
    ],
    "printSymbols": [
      "&#9633;<sup>g</sup>"
    ],
    "properties": [
      "plane angle"
    ],
    "values": [
      {
        "printable": "0.9",
        "numeric": 0.9
      }
    ]
  },
  "deg": {
    "isBase": false,
    "CODE": "DEG",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "degree"
    ],
    "printSymbols": [
      "&#176;"
    ],
    "properties": [
      "plane angle"
    ],
    "values": [
      {
        "printable": "2",
        "numeric": 2
      }
    ]
  },
  "'": {
    "isBase": false,
    "CODE": "'",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "minute"
    ],
    "printSymbols": [
      "'"
    ],
    "properties": [
      "plane angle"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "''": {
    "isBase": false,
    "CODE": "''",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "second"
    ],
    "printSymbols": [
      "''"
    ],
    "properties": [
      "plane angle"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "l": {
    "isBase": false,
    "CODE": "L",
    "isMetric": "yes",
    "class": "iso1000",
    "names": [
      "liter"
    ],
    "printSymbols": [
      "l"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "L": {
    "isBase": false,
    "isMetric": "yes",
    "class": "iso1000",
    "names": [
      "liter"
    ],
    "printSymbols": [
      "L"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "ar": {
    "isBase": false,
    "CODE": "AR",
    "isMetric": "yes",
    "class": "iso1000",
    "names": [
      "are"
    ],
    "printSymbols": [
      "a"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "100",
        "numeric": 100
      }
    ]
  },
  "min": {
    "isBase": false,
    "CODE": "MIN",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "minute"
    ],
    "printSymbols": [
      "min"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "60",
        "numeric": 60
      }
    ]
  },
  "h": {
    "isBase": false,
    "CODE": "HR",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "hour"
    ],
    "printSymbols": [
      "h"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "60",
        "numeric": 60
      }
    ]
  },
  "d": {
    "isBase": false,
    "CODE": "D",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "day"
    ],
    "printSymbols": [
      "d"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "24",
        "numeric": 24
      }
    ]
  },
  "a_t": {
    "isBase": false,
    "CODE": "ANN_T",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "tropical year"
    ],
    "printSymbols": [
      "a<sub>t</sub>"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "365.24219",
        "numeric": 365.24219
      }
    ]
  },
  "a_j": {
    "isBase": false,
    "CODE": "ANN_J",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "mean Julian year"
    ],
    "printSymbols": [
      "a<sub>j</sub>"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "365.25",
        "numeric": 365.25
      }
    ]
  },
  "a_g": {
    "isBase": false,
    "CODE": "ANN_G",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "mean Gregorian year"
    ],
    "printSymbols": [
      "a<sub>g</sub>"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "365.2425",
        "numeric": 365.2425
      }
    ]
  },
  "a": {
    "isBase": false,
    "CODE": "ANN",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "year"
    ],
    "printSymbols": [
      "a"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "wk": {
    "isBase": false,
    "CODE": "WK",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "week"
    ],
    "printSymbols": [
      "wk"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "7",
        "numeric": 7
      }
    ]
  },
  "mo_s": {
    "isBase": false,
    "CODE": "MO_S",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "synodal month"
    ],
    "printSymbols": [
      "mo<sub>s</sub>"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "29.53059",
        "numeric": 29.53059
      }
    ]
  },
  "mo_j": {
    "isBase": false,
    "CODE": "MO_J",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "mean Julian month"
    ],
    "printSymbols": [
      "mo<sub>j</sub>"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "mo_g": {
    "isBase": false,
    "CODE": "MO_G",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "mean Gregorian month"
    ],
    "printSymbols": [
      "mo<sub>g</sub>"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "mo": {
    "isBase": false,
    "CODE": "MO",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "month"
    ],
    "printSymbols": [
      "mo"
    ],
    "properties": [
      "time"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "t": {
    "isBase": false,
    "CODE": "TNE",
    "isMetric": "yes",
    "class": "iso1000",
    "names": [
      "tonne"
    ],
    "printSymbols": [
      "t"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>3</sup>",
        "numeric": 1000
      }
    ]
  },
  "bar": {
    "isBase": false,
    "CODE": "BAR",
    "isMetric": "yes",
    "class": "iso1000",
    "names": [
      "bar"
    ],
    "printSymbols": [
      "bar"
    ],
    "properties": [
      "pressure"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>5</sup>",
        "numeric": 100000
      }
    ]
  },
  "u": {
    "isBase": false,
    "CODE": "AMU",
    "isMetric": "yes",
    "class": "iso1000",
    "names": [
      "unified atomic mass unit"
    ],
    "printSymbols": [
      "u"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "1.6605402 &#215; 10<sup>-24</sup>",
        "numeric": 1.6605402e-24
      }
    ]
  },
  "eV": {
    "isBase": false,
    "CODE": "EV",
    "isMetric": "yes",
    "class": "iso1000",
    "names": [
      "electronvolt"
    ],
    "printSymbols": [
      "eV"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "AU": {
    "isBase": false,
    "CODE": "ASU",
    "isMetric": "no",
    "class": "iso1000",
    "names": [
      "astronomic unit"
    ],
    "printSymbols": [
      "AU"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "149597.870691",
        "numeric": 149597.870691
      }
    ]
  },
  "pc": {
    "isBase": false,
    "CODE": "PRS",
    "isMetric": "yes",
    "class": "iso1000",
    "names": [
      "parsec"
    ],
    "printSymbols": [
      "pc"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "3.085678 &#215; 10<sup>16</sup>",
        "numeric": 30856780000000000
      }
    ]
  },
  "[c]": {
    "isBase": false,
    "CODE": "[C]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "velocity of light"
    ],
    "printSymbols": [
      "<i>c</i>"
    ],
    "properties": [
      "velocity"
    ],
    "values": [
      {
        "printable": "299792458",
        "numeric": 299792458
      }
    ]
  },
  "[h]": {
    "isBase": false,
    "CODE": "[H]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "Planck constant"
    ],
    "printSymbols": [
      "<i>h</i>"
    ],
    "properties": [
      "action"
    ],
    "values": [
      {
        "printable": "6.6260755 &#215; 10<sup>-24</sup>",
        "numeric": 6.6260755e-24
      }
    ]
  },
  "[k]": {
    "isBase": false,
    "CODE": "[K]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "Boltzmann constant"
    ],
    "printSymbols": [
      "<i>k</i>"
    ],
    "properties": [
      "(unclassified)"
    ],
    "values": [
      {
        "printable": "1.380658 &#215; 10<sup>-23</sup>",
        "numeric": 1.380658e-23
      }
    ]
  },
  "[eps_0]": {
    "isBase": false,
    "CODE": "[EPS_0]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "permittivity of vacuum"
    ],
    "printSymbols": [
      "<i>&#949;<sub>\n               <r>0</r>\n            </sub>\n         </i>"
    ],
    "properties": [
      "electric permittivity"
    ],
    "values": [
      {
        "printable": "8.854187817 &#215; 10<sup>-12</sup>",
        "numeric": 8.854187817e-12
      }
    ]
  },
  "[mu_0]": {
    "isBase": false,
    "CODE": "[MU_0]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "permeability of vacuum"
    ],
    "printSymbols": [
      "<i>&#956;<sub>\n               <r>0</r>\n            </sub>\n         </i>"
    ],
    "properties": [
      "magnetic permeability"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[e]": {
    "isBase": false,
    "CODE": "[E]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "elementary charge"
    ],
    "printSymbols": [
      "<i>e</i>"
    ],
    "properties": [
      "electric charge"
    ],
    "values": [
      {
        "printable": "1.60217733 &#215; 10<sup>-19</sup>",
        "numeric": 1.60217733e-19
      }
    ]
  },
  "[m_e]": {
    "isBase": false,
    "CODE": "[M_E]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "electron mass"
    ],
    "printSymbols": [
      "<i>m<sub>\n               <r>e</r>\n            </sub>\n         </i>"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "9.1093897 &#215; 10<sup>-28</sup>",
        "numeric": 9.1093897e-28
      }
    ]
  },
  "[m_p]": {
    "isBase": false,
    "CODE": "[M_P]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "proton mass"
    ],
    "printSymbols": [
      "<i>m<sub>\n               <r>p</r>\n            </sub>\n         </i>"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "1.6726231 &#215; 10<sup>-24</sup>",
        "numeric": 1.6726231e-24
      }
    ]
  },
  "[G]": {
    "isBase": false,
    "CODE": "[GC]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "Newtonian constant of gravitation"
    ],
    "printSymbols": [
      "<i>G</i>"
    ],
    "properties": [
      "(unclassified)"
    ],
    "values": [
      {
        "printable": "6.67259 &#215; 10<sup>-11</sup>",
        "numeric": 6.67259e-11
      }
    ]
  },
  "[g]": {
    "isBase": false,
    "CODE": "[G]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "standard acceleration of free fall"
    ],
    "printSymbols": [
      "<i>g<sub>n</sub>\n         </i>"
    ],
    "properties": [
      "acceleration"
    ],
    "values": [
      {
        "printable": "9.80665",
        "numeric": 9.80665
      }
    ]
  },
  "atm": {
    "isBase": false,
    "CODE": "ATM",
    "isMetric": "no",
    "class": "const",
    "names": [
      "standard atmosphere"
    ],
    "printSymbols": [
      "atm"
    ],
    "properties": [
      "pressure"
    ],
    "values": [
      {
        "printable": "101325",
        "numeric": 101325
      }
    ]
  },
  "[ly]": {
    "isBase": false,
    "CODE": "[LY]",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "light-year"
    ],
    "printSymbols": [
      "l.y."
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "gf": {
    "isBase": false,
    "CODE": "GF",
    "isMetric": "yes",
    "class": "const",
    "names": [
      "gram-force"
    ],
    "printSymbols": [
      "gf"
    ],
    "properties": [
      "force"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[lbf_av]": {
    "isBase": false,
    "CODE": "[LBF_AV]",
    "isMetric": "no",
    "class": "const",
    "names": [
      "pound force"
    ],
    "printSymbols": [
      "lbf"
    ],
    "properties": [
      "force"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Ky": {
    "isBase": false,
    "CODE": "KY",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Kayser"
    ],
    "printSymbols": [
      "K"
    ],
    "properties": [
      "lineic number"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Gal": {
    "isBase": false,
    "CODE": "GL",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Gal"
    ],
    "printSymbols": [
      "Gal"
    ],
    "properties": [
      "acceleration"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "dyn": {
    "isBase": false,
    "CODE": "DYN",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "dyne"
    ],
    "printSymbols": [
      "dyn"
    ],
    "properties": [
      "force"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "erg": {
    "isBase": false,
    "CODE": "ERG",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "erg"
    ],
    "printSymbols": [
      "erg"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "P": {
    "isBase": false,
    "CODE": "P",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Poise"
    ],
    "printSymbols": [
      "P"
    ],
    "properties": [
      "dynamic viscosity"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Bi": {
    "isBase": false,
    "CODE": "BI",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Biot"
    ],
    "printSymbols": [
      "Bi"
    ],
    "properties": [
      "electric current"
    ],
    "values": [
      {
        "printable": "10",
        "numeric": 10
      }
    ]
  },
  "St": {
    "isBase": false,
    "CODE": "ST",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Stokes"
    ],
    "printSymbols": [
      "St"
    ],
    "properties": [
      "kinematic viscosity"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Mx": {
    "isBase": false,
    "CODE": "MX",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Maxwell"
    ],
    "printSymbols": [
      "Mx"
    ],
    "properties": [
      "flux of magnetic induction"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-8</sup>",
        "numeric": 1e-8
      }
    ]
  },
  "G": {
    "isBase": false,
    "CODE": "GS",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Gauss"
    ],
    "printSymbols": [
      "Gs"
    ],
    "properties": [
      "magnetic flux density"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-4</sup>",
        "numeric": 0.0001
      }
    ]
  },
  "Oe": {
    "isBase": false,
    "CODE": "OE",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Oersted"
    ],
    "printSymbols": [
      "Oe"
    ],
    "properties": [
      "magnetic field intensity"
    ],
    "values": [
      {
        "printable": "250",
        "numeric": 250
      }
    ]
  },
  "Gb": {
    "isBase": false,
    "CODE": "GB",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Gilbert"
    ],
    "printSymbols": [
      "Gb"
    ],
    "properties": [
      "magnetic tension"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "sb": {
    "isBase": false,
    "CODE": "SB",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "stilb"
    ],
    "printSymbols": [
      "sb"
    ],
    "properties": [
      "lum. intensity density"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Lmb": {
    "isBase": false,
    "CODE": "LMB",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Lambert"
    ],
    "printSymbols": [
      "L"
    ],
    "properties": [
      "brightness"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "ph": {
    "isBase": false,
    "CODE": "PHT",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "phot"
    ],
    "printSymbols": [
      "ph"
    ],
    "properties": [
      "illuminance"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-4</sup>",
        "numeric": 0.0001
      }
    ]
  },
  "Ci": {
    "isBase": false,
    "CODE": "CI",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Curie"
    ],
    "printSymbols": [
      "Ci"
    ],
    "properties": [
      "radioactivity"
    ],
    "values": [
      {
        "printable": "3.7 &#215; 10<sup>10</sup>",
        "numeric": 37000000000
      }
    ]
  },
  "R": {
    "isBase": false,
    "CODE": "ROE",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "Roentgen"
    ],
    "printSymbols": [
      "R"
    ],
    "properties": [
      "ion dose"
    ],
    "values": [
      {
        "printable": "2.58 &#215; 10<sup>-4</sup>",
        "numeric": 0.000258
      }
    ]
  },
  "RAD": {
    "isBase": false,
    "CODE": "[RAD]",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "radiation absorbed dose"
    ],
    "printSymbols": [
      "RAD"
    ],
    "properties": [
      "energy dose"
    ],
    "values": [
      {
        "printable": "100",
        "numeric": 100
      }
    ]
  },
  "REM": {
    "isBase": false,
    "CODE": "[REM]",
    "isMetric": "yes",
    "class": "cgs",
    "names": [
      "radiation equivalent man"
    ],
    "printSymbols": [
      "REM"
    ],
    "properties": [
      "dose equivalent"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[in_i]": {
    "isBase": false,
    "CODE": "[IN_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "inch"
    ],
    "printSymbols": [
      "in"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "2.54",
        "numeric": 2.54
      }
    ]
  },
  "[ft_i]": {
    "isBase": false,
    "CODE": "[FT_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "foot"
    ],
    "printSymbols": [
      "ft"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "12",
        "numeric": 12
      }
    ]
  },
  "[yd_i]": {
    "isBase": false,
    "CODE": "[YD_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "yard"
    ],
    "printSymbols": [
      "yd"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "3",
        "numeric": 3
      }
    ]
  },
  "[mi_i]": {
    "isBase": false,
    "CODE": "[MI_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "statute mile"
    ],
    "printSymbols": [
      "mi"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "5280",
        "numeric": 5280
      }
    ]
  },
  "[fth_i]": {
    "isBase": false,
    "CODE": "[FTH_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "fathom"
    ],
    "printSymbols": [
      "fth"
    ],
    "properties": [
      "depth of water"
    ],
    "values": [
      {
        "printable": "6",
        "numeric": 6
      }
    ]
  },
  "[nmi_i]": {
    "isBase": false,
    "CODE": "[NMI_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "nautical mile"
    ],
    "printSymbols": [
      "n.mi"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1852",
        "numeric": 1852
      }
    ]
  },
  "[kn_i]": {
    "isBase": false,
    "CODE": "[KN_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "knot"
    ],
    "printSymbols": [
      "knot"
    ],
    "properties": [
      "velocity"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[sin_i]": {
    "isBase": false,
    "CODE": "[SIN_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "square inch"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[sft_i]": {
    "isBase": false,
    "CODE": "[SFT_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "square foot"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[syd_i]": {
    "isBase": false,
    "CODE": "[SYD_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "square yard"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[cin_i]": {
    "isBase": false,
    "CODE": "[CIN_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "cubic inch"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[cft_i]": {
    "isBase": false,
    "CODE": "[CFT_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "cubic foot"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[cyd_i]": {
    "isBase": false,
    "CODE": "[CYD_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "cubic yard"
    ],
    "printSymbols": [
      "cu.yd"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[bf_i]": {
    "isBase": false,
    "CODE": "[BF_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "board foot"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "144",
        "numeric": 144
      }
    ]
  },
  "[cr_i]": {
    "isBase": false,
    "CODE": "[CR_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "cord"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "128",
        "numeric": 128
      }
    ]
  },
  "[mil_i]": {
    "isBase": false,
    "CODE": "[MIL_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "mil"
    ],
    "printSymbols": [
      "mil"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-3</sup>",
        "numeric": 0.001
      }
    ]
  },
  "[cml_i]": {
    "isBase": false,
    "CODE": "[CML_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "circular mil"
    ],
    "printSymbols": [
      "circ.mil"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[hd_i]": {
    "isBase": false,
    "CODE": "[HD_I]",
    "isMetric": "no",
    "class": "intcust",
    "names": [
      "hand"
    ],
    "printSymbols": [
      "hd"
    ],
    "properties": [
      "height of horses"
    ],
    "values": [
      {
        "printable": "4",
        "numeric": 4
      }
    ]
  },
  "[ft_us]": {
    "isBase": false,
    "CODE": "[FT_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "foot"
    ],
    "printSymbols": [
      "ft<sub>us</sub>"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1200",
        "numeric": 1200
      }
    ]
  },
  "[yd_us]": {
    "isBase": false,
    "CODE": "[YD_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "yard"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "3",
        "numeric": 3
      }
    ]
  },
  "[in_us]": {
    "isBase": false,
    "CODE": "[IN_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "inch"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[rd_us]": {
    "isBase": false,
    "CODE": "[RD_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "rod"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "16.5",
        "numeric": 16.5
      }
    ]
  },
  "[ch_us]": {
    "isBase": false,
    "CODE": "[CH_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "Gunter's chain",
      "Surveyor's chain"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "4",
        "numeric": 4
      }
    ]
  },
  "[lk_us]": {
    "isBase": false,
    "CODE": "[LK_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "link for Gunter's chain"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[rch_us]": {
    "isBase": false,
    "CODE": "[RCH_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "Ramden's chain",
      "Engineer's chain"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "100",
        "numeric": 100
      }
    ]
  },
  "[rlk_us]": {
    "isBase": false,
    "CODE": "[RLK_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "link for Ramden's chain"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[fth_us]": {
    "isBase": false,
    "CODE": "[FTH_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "fathom"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "6",
        "numeric": 6
      }
    ]
  },
  "[fur_us]": {
    "isBase": false,
    "CODE": "[FUR_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "furlong"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "40",
        "numeric": 40
      }
    ]
  },
  "[mi_us]": {
    "isBase": false,
    "CODE": "[MI_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "mile"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "8",
        "numeric": 8
      }
    ]
  },
  "[acr_us]": {
    "isBase": false,
    "CODE": "[ACR_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "acre"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "160",
        "numeric": 160
      }
    ]
  },
  "[srd_us]": {
    "isBase": false,
    "CODE": "[SRD_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "square rod"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[smi_us]": {
    "isBase": false,
    "CODE": "[SMI_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "square mile"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[sct]": {
    "isBase": false,
    "CODE": "[SCT]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "section"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[twp]": {
    "isBase": false,
    "CODE": "[TWP]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "township"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "36",
        "numeric": 36
      }
    ]
  },
  "[mil_us]": {
    "isBase": false,
    "CODE": "[MIL_US]",
    "isMetric": "no",
    "class": "us-lengths",
    "names": [
      "mil"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1 &#215; 10<sup>-3</sup>",
        "numeric": 0.001
      }
    ]
  },
  "[in_br]": {
    "isBase": false,
    "CODE": "[IN_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "inch"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "2.539998",
        "numeric": 2.539998
      }
    ]
  },
  "[ft_br]": {
    "isBase": false,
    "CODE": "[FT_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "foot"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "12",
        "numeric": 12
      }
    ]
  },
  "[rd_br]": {
    "isBase": false,
    "CODE": "[RD_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "rod"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "16.5",
        "numeric": 16.5
      }
    ]
  },
  "[ch_br]": {
    "isBase": false,
    "CODE": "[CH_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "Gunter's chain"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "4",
        "numeric": 4
      }
    ]
  },
  "[lk_br]": {
    "isBase": false,
    "CODE": "[LK_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "link for Gunter's chain"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[fth_br]": {
    "isBase": false,
    "CODE": "[FTH_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "fathom"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "6",
        "numeric": 6
      }
    ]
  },
  "[pc_br]": {
    "isBase": false,
    "CODE": "[PC_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "pace"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "2.5",
        "numeric": 2.5
      }
    ]
  },
  "[yd_br]": {
    "isBase": false,
    "CODE": "[YD_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "yard"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "3",
        "numeric": 3
      }
    ]
  },
  "[mi_br]": {
    "isBase": false,
    "CODE": "[MI_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "mile"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "5280",
        "numeric": 5280
      }
    ]
  },
  "[nmi_br]": {
    "isBase": false,
    "CODE": "[NMI_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "nautical mile"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "6080",
        "numeric": 6080
      }
    ]
  },
  "[kn_br]": {
    "isBase": false,
    "CODE": "[KN_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "knot"
    ],
    "properties": [
      "velocity"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[acr_br]": {
    "isBase": false,
    "CODE": "[ACR_BR]",
    "isMetric": "no",
    "class": "brit-length",
    "names": [
      "acre"
    ],
    "properties": [
      "area"
    ],
    "values": [
      {
        "printable": "4840",
        "numeric": 4840
      }
    ]
  },
  "[gal_us]": {
    "isBase": false,
    "CODE": "[GAL_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "Queen Anne's wine gallon"
    ],
    "properties": [
      "fluid volume"
    ],
    "values": [
      {
        "printable": "231",
        "numeric": 231
      }
    ]
  },
  "[bbl_us]": {
    "isBase": false,
    "CODE": "[BBL_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "barrel"
    ],
    "properties": [
      "fluid volume"
    ],
    "values": [
      {
        "printable": "42",
        "numeric": 42
      }
    ]
  },
  "[qt_us]": {
    "isBase": false,
    "CODE": "[QT_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "quart"
    ],
    "properties": [
      "fluid volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[pt_us]": {
    "isBase": false,
    "CODE": "[PT_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "pint"
    ],
    "properties": [
      "fluid volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[gil_us]": {
    "isBase": false,
    "CODE": "[GIL_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "gill"
    ],
    "properties": [
      "fluid volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[foz_us]": {
    "isBase": false,
    "CODE": "[FOZ_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "fluid ounce"
    ],
    "printSymbols": [
      "oz fl"
    ],
    "properties": [
      "fluid volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[fdr_us]": {
    "isBase": false,
    "CODE": "[FDR_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "fluid dram"
    ],
    "properties": [
      "fluid volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[min_us]": {
    "isBase": false,
    "CODE": "[MIN_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "minim"
    ],
    "properties": [
      "fluid volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[crd_us]": {
    "isBase": false,
    "CODE": "[CRD_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "cord"
    ],
    "properties": [
      "fluid volume"
    ],
    "values": [
      {
        "printable": "128",
        "numeric": 128
      }
    ]
  },
  "[bu_us]": {
    "isBase": false,
    "CODE": "[BU_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "bushel"
    ],
    "properties": [
      "dry volume"
    ],
    "values": [
      {
        "printable": "2150.42",
        "numeric": 2150.42
      }
    ]
  },
  "[gal_wi]": {
    "isBase": false,
    "CODE": "[GAL_WI]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "historical winchester gallon"
    ],
    "properties": [
      "dry volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[pk_us]": {
    "isBase": false,
    "CODE": "[PK_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "peck"
    ],
    "properties": [
      "dry volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[dqt_us]": {
    "isBase": false,
    "CODE": "[DQT_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "dry quart"
    ],
    "properties": [
      "dry volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[dpt_us]": {
    "isBase": false,
    "CODE": "[DPT_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "dry pint"
    ],
    "properties": [
      "dry volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[tbs_us]": {
    "isBase": false,
    "CODE": "[TBS_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "tablespoon"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[tsp_us]": {
    "isBase": false,
    "CODE": "[TSP_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "teaspoon"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[cup_us]": {
    "isBase": false,
    "CODE": "[CUP_US]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "cup"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "16",
        "numeric": 16
      }
    ]
  },
  "[foz_m]": {
    "isBase": false,
    "CODE": "[FOZ_M]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "metric fluid ounce"
    ],
    "printSymbols": [
      "oz fl"
    ],
    "properties": [
      "fluid volume"
    ],
    "values": [
      {
        "printable": "30",
        "numeric": 30
      }
    ]
  },
  "[cup_m]": {
    "isBase": false,
    "CODE": "[CUP_M]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "metric cup"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "240",
        "numeric": 240
      }
    ]
  },
  "[tsp_m]": {
    "isBase": false,
    "CODE": "[TSP_M]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "metric teaspoon"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "5",
        "numeric": 5
      }
    ]
  },
  "[tbs_m]": {
    "isBase": false,
    "CODE": "[TBS_M]",
    "isMetric": "no",
    "class": "us-volumes",
    "names": [
      "metric tablespoon"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "15",
        "numeric": 15
      }
    ]
  },
  "[gal_br]": {
    "isBase": false,
    "CODE": "[GAL_BR]",
    "isMetric": "no",
    "class": "brit-volumes",
    "names": [
      "gallon"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "4.54609",
        "numeric": 4.54609
      }
    ]
  },
  "[pk_br]": {
    "isBase": false,
    "CODE": "[PK_BR]",
    "isMetric": "no",
    "class": "brit-volumes",
    "names": [
      "peck"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "2",
        "numeric": 2
      }
    ]
  },
  "[bu_br]": {
    "isBase": false,
    "CODE": "[BU_BR]",
    "isMetric": "no",
    "class": "brit-volumes",
    "names": [
      "bushel"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "4",
        "numeric": 4
      }
    ]
  },
  "[qt_br]": {
    "isBase": false,
    "CODE": "[QT_BR]",
    "isMetric": "no",
    "class": "brit-volumes",
    "names": [
      "quart"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[pt_br]": {
    "isBase": false,
    "CODE": "[PT_BR]",
    "isMetric": "no",
    "class": "brit-volumes",
    "names": [
      "pint"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[gil_br]": {
    "isBase": false,
    "CODE": "[GIL_BR]",
    "isMetric": "no",
    "class": "brit-volumes",
    "names": [
      "gill"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[foz_br]": {
    "isBase": false,
    "CODE": "[FOZ_BR]",
    "isMetric": "no",
    "class": "brit-volumes",
    "names": [
      "fluid ounce"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[fdr_br]": {
    "isBase": false,
    "CODE": "[FDR_BR]",
    "isMetric": "no",
    "class": "brit-volumes",
    "names": [
      "fluid dram"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[min_br]": {
    "isBase": false,
    "CODE": "[MIN_BR]",
    "isMetric": "no",
    "class": "brit-volumes",
    "names": [
      "minim"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[gr]": {
    "isBase": false,
    "CODE": "[GR]",
    "isMetric": "no",
    "class": "avoirdupois",
    "names": [
      "grain"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "64.79891",
        "numeric": 64.79891
      }
    ]
  },
  "[lb_av]": {
    "isBase": false,
    "CODE": "[LB_AV]",
    "isMetric": "no",
    "class": "avoirdupois",
    "names": [
      "pound"
    ],
    "printSymbols": [
      "lb"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "7000",
        "numeric": 7000
      }
    ]
  },
  "[oz_av]": {
    "isBase": false,
    "CODE": "[OZ_AV]",
    "isMetric": "no",
    "class": "avoirdupois",
    "names": [
      "ounce"
    ],
    "printSymbols": [
      "oz"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[dr_av]": {
    "isBase": false,
    "CODE": "[DR_AV]",
    "isMetric": "no",
    "class": "avoirdupois",
    "names": [
      "dram"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[scwt_av]": {
    "isBase": false,
    "CODE": "[SCWT_AV]",
    "isMetric": "no",
    "class": "avoirdupois",
    "names": [
      "short hundredweight",
      "U.S. hundredweight"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "100",
        "numeric": 100
      }
    ]
  },
  "[lcwt_av]": {
    "isBase": false,
    "CODE": "[LCWT_AV]",
    "isMetric": "no",
    "class": "avoirdupois",
    "names": [
      "long hundredweight",
      "British hundredweight"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "112",
        "numeric": 112
      }
    ]
  },
  "[ston_av]": {
    "isBase": false,
    "CODE": "[STON_AV]",
    "isMetric": "no",
    "class": "avoirdupois",
    "names": [
      "short ton",
      "U.S. ton"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "20",
        "numeric": 20
      }
    ]
  },
  "[lton_av]": {
    "isBase": false,
    "CODE": "[LTON_AV]",
    "isMetric": "no",
    "class": "avoirdupois",
    "names": [
      "long ton",
      "British ton"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "20",
        "numeric": 20
      }
    ]
  },
  "[stone_av]": {
    "isBase": false,
    "CODE": "[STONE_AV]",
    "isMetric": "no",
    "class": "avoirdupois",
    "names": [
      "stone",
      "British stone"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "14",
        "numeric": 14
      }
    ]
  },
  "[pwt_tr]": {
    "isBase": false,
    "CODE": "[PWT_TR]",
    "isMetric": "no",
    "class": "troy",
    "names": [
      "pennyweight"
    ],
    "printSymbols": [
      "dwt"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "24",
        "numeric": 24
      }
    ]
  },
  "[oz_tr]": {
    "isBase": false,
    "CODE": "[OZ_TR]",
    "isMetric": "no",
    "class": "troy",
    "names": [
      "troy ounce"
    ],
    "printSymbols": [
      "oz t"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "20",
        "numeric": 20
      }
    ]
  },
  "[lb_tr]": {
    "isBase": false,
    "CODE": "[LB_TR]",
    "isMetric": "no",
    "class": "troy",
    "names": [
      "troy pound"
    ],
    "printSymbols": [
      "lb t"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "12",
        "numeric": 12
      }
    ]
  },
  "[sc_ap]": {
    "isBase": false,
    "CODE": "[SC_AP]",
    "isMetric": "no",
    "class": "apoth",
    "names": [
      "scruple"
    ],
    "printSymbols": [
      "&#8456;"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "20",
        "numeric": 20
      }
    ]
  },
  "[dr_ap]": {
    "isBase": false,
    "CODE": "[DR_AP]",
    "isMetric": "no",
    "class": "apoth",
    "names": [
      "dram",
      "drachm"
    ],
    "printSymbols": [
      "&#658;"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "3",
        "numeric": 3
      }
    ]
  },
  "[oz_ap]": {
    "isBase": false,
    "CODE": "[OZ_AP]",
    "isMetric": "no",
    "class": "apoth",
    "names": [
      "ounce"
    ],
    "printSymbols": [
      "&#8485;"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "8",
        "numeric": 8
      }
    ]
  },
  "[lb_ap]": {
    "isBase": false,
    "CODE": "[LB_AP]",
    "isMetric": "no",
    "class": "apoth",
    "names": [
      "pound"
    ],
    "printSymbols": [
      "<strike>lb</strike>"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "12",
        "numeric": 12
      }
    ]
  },
  "[oz_m]": {
    "isBase": false,
    "CODE": "[OZ_M]",
    "isMetric": "no",
    "class": "apoth",
    "names": [
      "metric ounce"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "28",
        "numeric": 28
      }
    ]
  },
  "[lne]": {
    "isBase": false,
    "CODE": "[LNE]",
    "isMetric": "no",
    "class": "typeset",
    "names": [
      "line"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[pnt]": {
    "isBase": false,
    "CODE": "[PNT]",
    "isMetric": "no",
    "class": "typeset",
    "names": [
      "point"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[pca]": {
    "isBase": false,
    "CODE": "[PCA]",
    "isMetric": "no",
    "class": "typeset",
    "names": [
      "pica"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "12",
        "numeric": 12
      }
    ]
  },
  "[pnt_pr]": {
    "isBase": false,
    "CODE": "[PNT_PR]",
    "isMetric": "no",
    "class": "typeset",
    "names": [
      "Printer's point"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "0.013837",
        "numeric": 0.013837
      }
    ]
  },
  "[pca_pr]": {
    "isBase": false,
    "CODE": "[PCA_PR]",
    "isMetric": "no",
    "class": "typeset",
    "names": [
      "Printer's pica"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "12",
        "numeric": 12
      }
    ]
  },
  "[pied]": {
    "isBase": false,
    "CODE": "[PIED]",
    "isMetric": "no",
    "class": "typeset",
    "names": [
      "pied",
      "French foot"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "32.48",
        "numeric": 32.48
      }
    ]
  },
  "[pouce]": {
    "isBase": false,
    "CODE": "[POUCE]",
    "isMetric": "no",
    "class": "typeset",
    "names": [
      "pouce",
      "French inch"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[ligne]": {
    "isBase": false,
    "CODE": "[LIGNE]",
    "isMetric": "no",
    "class": "typeset",
    "names": [
      "ligne",
      "French line"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[didot]": {
    "isBase": false,
    "CODE": "[DIDOT]",
    "isMetric": "no",
    "class": "typeset",
    "names": [
      "didot",
      "Didot's point"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[cicero]": {
    "isBase": false,
    "CODE": "[CICERO]",
    "isMetric": "no",
    "class": "typeset",
    "names": [
      "cicero",
      "Didot's pica"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "12",
        "numeric": 12
      }
    ]
  },
  "[degF]": {
    "isBase": false,
    "CODE": "[DEGF]",
    "isMetric": "no",
    "isSpecial": "yes",
    "class": "heat",
    "names": [
      "degree Fahrenheit"
    ],
    "printSymbols": [
      "&#176;F"
    ],
    "properties": [
      "temperature"
    ],
    "values": [
      {
        "printable": "<function name=\"degF\" value=\"5\" Unit=\"K/9\"/>",
        "numeric": null
      }
    ]
  },
  "[degR]": {
    "isBase": false,
    "CODE": "[degR]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "degree Rankine"
    ],
    "printSymbols": [
      "&#176;R"
    ],
    "properties": [
      "temperature"
    ],
    "values": [
      {
        "printable": "5",
        "numeric": 5
      }
    ]
  },
  "cal_[15]": {
    "isBase": false,
    "CODE": "CAL_[15]",
    "isMetric": "yes",
    "class": "heat",
    "names": [
      "calorie at 15 °C"
    ],
    "printSymbols": [
      "cal<sub>15&#176;C</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "4.18580",
        "numeric": 4.1858
      }
    ]
  },
  "cal_[20]": {
    "isBase": false,
    "CODE": "CAL_[20]",
    "isMetric": "yes",
    "class": "heat",
    "names": [
      "calorie at 20 °C"
    ],
    "printSymbols": [
      "cal<sub>20&#176;C</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "4.18190",
        "numeric": 4.1819
      }
    ]
  },
  "cal_m": {
    "isBase": false,
    "CODE": "CAL_M",
    "isMetric": "yes",
    "class": "heat",
    "names": [
      "mean calorie"
    ],
    "printSymbols": [
      "cal<sub>m</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "4.19002",
        "numeric": 4.19002
      }
    ]
  },
  "cal_IT": {
    "isBase": false,
    "CODE": "CAL_IT",
    "isMetric": "yes",
    "class": "heat",
    "names": [
      "international table calorie"
    ],
    "printSymbols": [
      "cal<sub>IT</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "4.1868",
        "numeric": 4.1868
      }
    ]
  },
  "cal_th": {
    "isBase": false,
    "CODE": "CAL_TH",
    "isMetric": "yes",
    "class": "heat",
    "names": [
      "thermochemical calorie"
    ],
    "printSymbols": [
      "cal<sub>th</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "4.184",
        "numeric": 4.184
      }
    ]
  },
  "cal": {
    "isBase": false,
    "CODE": "CAL",
    "isMetric": "yes",
    "class": "heat",
    "names": [
      "calorie"
    ],
    "printSymbols": [
      "cal"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[Cal]": {
    "isBase": false,
    "CODE": "[CAL]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "nutrition label Calories"
    ],
    "printSymbols": [
      "Cal"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[Btu_39]": {
    "isBase": false,
    "CODE": "[BTU_39]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "British thermal unit at 39 °F"
    ],
    "printSymbols": [
      "Btu<sub>39&#176;F</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1.05967",
        "numeric": 1.05967
      }
    ]
  },
  "[Btu_59]": {
    "isBase": false,
    "CODE": "[BTU_59]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "British thermal unit at 59 °F"
    ],
    "printSymbols": [
      "Btu<sub>59&#176;F</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1.05480",
        "numeric": 1.0548
      }
    ]
  },
  "[Btu_60]": {
    "isBase": false,
    "CODE": "[BTU_60]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "British thermal unit at 60 °F"
    ],
    "printSymbols": [
      "Btu<sub>60&#176;F</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1.05468",
        "numeric": 1.05468
      }
    ]
  },
  "[Btu_m]": {
    "isBase": false,
    "CODE": "[BTU_M]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "mean British thermal unit"
    ],
    "printSymbols": [
      "Btu<sub>m</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1.05587",
        "numeric": 1.05587
      }
    ]
  },
  "[Btu_IT]": {
    "isBase": false,
    "CODE": "[BTU_IT]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "international table British thermal unit"
    ],
    "printSymbols": [
      "Btu<sub>IT</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1.05505585262",
        "numeric": 1.05505585262
      }
    ]
  },
  "[Btu_th]": {
    "isBase": false,
    "CODE": "[BTU_TH]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "thermochemical British thermal unit"
    ],
    "printSymbols": [
      "Btu<sub>th</sub>"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1.054350",
        "numeric": 1.05435
      }
    ]
  },
  "[Btu]": {
    "isBase": false,
    "CODE": "[BTU]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "British thermal unit"
    ],
    "printSymbols": [
      "btu"
    ],
    "properties": [
      "energy"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[HP]": {
    "isBase": false,
    "CODE": "[HP]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "horsepower"
    ],
    "properties": [
      "power"
    ],
    "values": [
      {
        "printable": "550",
        "numeric": 550
      }
    ]
  },
  "tex": {
    "isBase": false,
    "CODE": "TEX",
    "isMetric": "yes",
    "class": "heat",
    "names": [
      "tex"
    ],
    "printSymbols": [
      "tex"
    ],
    "properties": [
      "linear mass density (of textile thread)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[den]": {
    "isBase": false,
    "CODE": "[DEN]",
    "isMetric": "no",
    "class": "heat",
    "names": [
      "Denier"
    ],
    "printSymbols": [
      "den"
    ],
    "properties": [
      "linear mass density (of textile thread)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "m[H2O]": {
    "isBase": false,
    "CODE": "M[H2O]",
    "isMetric": "yes",
    "class": "clinical",
    "names": [
      "meter of water column"
    ],
    "printSymbols": [
      "m&#160;H<sub>\n            <r>2</r>\n         </sub>O"
    ],
    "properties": [
      "pressure"
    ],
    "values": [
      {
        "printable": "9.80665",
        "numeric": 9.80665
      }
    ]
  },
  "m[Hg]": {
    "isBase": false,
    "CODE": "M[HG]",
    "isMetric": "yes",
    "class": "clinical",
    "names": [
      "meter of mercury column"
    ],
    "printSymbols": [
      "m&#160;Hg"
    ],
    "properties": [
      "pressure"
    ],
    "values": [
      {
        "printable": "133.3220",
        "numeric": 133.322
      }
    ]
  },
  "[in_i'H2O]": {
    "isBase": false,
    "CODE": "[IN_I'H2O]",
    "isMetric": "no",
    "class": "clinical",
    "names": [
      "inch of water column"
    ],
    "printSymbols": [
      "in&#160;H<sub>\n            <r>2</r>\n         </sub>O"
    ],
    "properties": [
      "pressure"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[in_i'Hg]": {
    "isBase": false,
    "CODE": "[IN_I'HG]",
    "isMetric": "no",
    "class": "clinical",
    "names": [
      "inch of mercury column"
    ],
    "printSymbols": [
      "in&#160;Hg"
    ],
    "properties": [
      "pressure"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[PRU]": {
    "isBase": false,
    "CODE": "[PRU]",
    "isMetric": "no",
    "class": "clinical",
    "names": [
      "peripheral vascular resistance unit"
    ],
    "printSymbols": [
      "P.R.U."
    ],
    "properties": [
      "fluid resistance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[wood'U]": {
    "isBase": false,
    "CODE": "[WOOD'U]",
    "isMetric": "no",
    "class": "clinical",
    "names": [
      "Wood unit"
    ],
    "printSymbols": [
      "Wood U."
    ],
    "properties": [
      "fluid resistance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[diop]": {
    "isBase": false,
    "CODE": "[DIOP]",
    "isMetric": "no",
    "class": "clinical",
    "names": [
      "diopter"
    ],
    "printSymbols": [
      "dpt"
    ],
    "properties": [
      "refraction of a lens"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[p'diop]": {
    "isBase": false,
    "CODE": "[P'DIOP]",
    "isMetric": "no",
    "isSpecial": "yes",
    "class": "clinical",
    "names": [
      "prism diopter"
    ],
    "printSymbols": [
      "PD"
    ],
    "properties": [
      "refraction of a prism"
    ],
    "values": [
      {
        "printable": "<function name=\"tanTimes100\" value=\"1\" Unit=\"deg\"/>",
        "numeric": null
      }
    ]
  },
  "%[slope]": {
    "isBase": false,
    "CODE": "%[SLOPE]",
    "isMetric": "no",
    "isSpecial": "yes",
    "class": "clinical",
    "names": [
      "percent of slope"
    ],
    "printSymbols": [
      "%"
    ],
    "properties": [
      "slope"
    ],
    "values": [
      {
        "printable": "<function name=\"100tan\" value=\"1\" Unit=\"deg\"/>",
        "numeric": null
      }
    ]
  },
  "[mesh_i]": {
    "isBase": false,
    "CODE": "[MESH_I]",
    "isMetric": "no",
    "class": "clinical",
    "names": [
      "mesh"
    ],
    "properties": [
      "lineic number"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[Ch]": {
    "isBase": false,
    "CODE": "[CH]",
    "isMetric": "no",
    "class": "clinical",
    "names": [
      "Charrière",
      "french"
    ],
    "printSymbols": [
      "Ch"
    ],
    "properties": [
      "gauge of catheters"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[drp]": {
    "isBase": false,
    "CODE": "[DRP]",
    "isMetric": "no",
    "class": "clinical",
    "names": [
      "drop"
    ],
    "printSymbols": [
      "drp"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[hnsf'U]": {
    "isBase": false,
    "CODE": "[HNSF'U]",
    "isMetric": "no",
    "class": "clinical",
    "names": [
      "Hounsfield unit"
    ],
    "printSymbols": [
      "HF"
    ],
    "properties": [
      "x-ray attenuation"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[MET]": {
    "isBase": false,
    "CODE": "[MET]",
    "isMetric": "no",
    "class": "clinical",
    "names": [
      "metabolic equivalent"
    ],
    "printSymbols": [
      "MET"
    ],
    "properties": [
      "metabolic cost of physical activity"
    ],
    "values": [
      {
        "printable": "3.5",
        "numeric": 3.5
      }
    ]
  },
  "[hp'_X]": {
    "isBase": false,
    "CODE": "[HP'_X]",
    "isMetric": "no",
    "isSpecial": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of decimal series (retired)"
    ],
    "printSymbols": [
      "X"
    ],
    "properties": [
      "homeopathic potency (retired)"
    ],
    "values": [
      {
        "printable": "<function name=\"hpX\" value=\"1\" Unit=\"1\"/>",
        "numeric": null
      }
    ]
  },
  "[hp'_C]": {
    "isBase": false,
    "CODE": "[HP'_C]",
    "isMetric": "no",
    "isSpecial": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of centesimal series (retired)"
    ],
    "printSymbols": [
      "C"
    ],
    "properties": [
      "homeopathic potency (retired)"
    ],
    "values": [
      {
        "printable": "<function name=\"hpC\" value=\"1\" Unit=\"1\"/>",
        "numeric": null
      }
    ]
  },
  "[hp'_M]": {
    "isBase": false,
    "CODE": "[HP'_M]",
    "isMetric": "no",
    "isSpecial": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of millesimal series (retired)"
    ],
    "printSymbols": [
      "M"
    ],
    "properties": [
      "homeopathic potency (retired)"
    ],
    "values": [
      {
        "printable": "<function name=\"hpM\" value=\"1\" Unit=\"1\"/>",
        "numeric": null
      }
    ]
  },
  "[hp'_Q]": {
    "isBase": false,
    "CODE": "[HP'_Q]",
    "isMetric": "no",
    "isSpecial": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of quintamillesimal series (retired)"
    ],
    "printSymbols": [
      "Q"
    ],
    "properties": [
      "homeopathic potency (retired)"
    ],
    "values": [
      {
        "printable": "<function name=\"hpQ\" value=\"1\" Unit=\"1\"/>",
        "numeric": null
      }
    ]
  },
  "[hp_X]": {
    "isBase": false,
    "CODE": "[HP_X]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of decimal hahnemannian series"
    ],
    "printSymbols": [
      "X"
    ],
    "properties": [
      "homeopathic potency (Hahnemann)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[hp_C]": {
    "isBase": false,
    "CODE": "[HP_C]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of centesimal hahnemannian series"
    ],
    "printSymbols": [
      "C"
    ],
    "properties": [
      "homeopathic potency (Hahnemann)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[hp_M]": {
    "isBase": false,
    "CODE": "[HP_M]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of millesimal hahnemannian series"
    ],
    "printSymbols": [
      "M"
    ],
    "properties": [
      "homeopathic potency (Hahnemann)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[hp_Q]": {
    "isBase": false,
    "CODE": "[HP_Q]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of quintamillesimal hahnemannian series"
    ],
    "printSymbols": [
      "Q"
    ],
    "properties": [
      "homeopathic potency (Hahnemann)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[kp_X]": {
    "isBase": false,
    "CODE": "[KP_X]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of decimal korsakovian series"
    ],
    "printSymbols": [
      "X"
    ],
    "properties": [
      "homeopathic potency (Korsakov)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[kp_C]": {
    "isBase": false,
    "CODE": "[KP_C]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of centesimal korsakovian series"
    ],
    "printSymbols": [
      "C"
    ],
    "properties": [
      "homeopathic potency (Korsakov)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[kp_M]": {
    "isBase": false,
    "CODE": "[KP_M]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of millesimal korsakovian series"
    ],
    "printSymbols": [
      "M"
    ],
    "properties": [
      "homeopathic potency (Korsakov)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[kp_Q]": {
    "isBase": false,
    "CODE": "[KP_Q]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "clinical",
    "names": [
      "homeopathic potency of quintamillesimal korsakovian series"
    ],
    "printSymbols": [
      "Q"
    ],
    "properties": [
      "homeopathic potency (Korsakov)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "eq": {
    "isBase": false,
    "CODE": "EQ",
    "isMetric": "yes",
    "class": "chemical",
    "names": [
      "equivalents"
    ],
    "printSymbols": [
      "eq"
    ],
    "properties": [
      "amount of substance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "osm": {
    "isBase": false,
    "CODE": "OSM",
    "isMetric": "yes",
    "class": "chemical",
    "names": [
      "osmole"
    ],
    "printSymbols": [
      "osm"
    ],
    "properties": [
      "amount of substance (dissolved particles)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[pH]": {
    "isBase": false,
    "CODE": "[PH]",
    "isMetric": "no",
    "isSpecial": "yes",
    "class": "chemical",
    "names": [
      "pH"
    ],
    "printSymbols": [
      "pH"
    ],
    "properties": [
      "acidity"
    ],
    "values": [
      {
        "printable": "<function name=\"pH\" value=\"1\" Unit=\"mol/l\"/>",
        "numeric": null
      }
    ]
  },
  "g%": {
    "isBase": false,
    "CODE": "G%",
    "isMetric": "yes",
    "class": "chemical",
    "names": [
      "gram percent"
    ],
    "printSymbols": [
      "g%"
    ],
    "properties": [
      "mass concentration"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[S]": {
    "isBase": false,
    "CODE": "[S]",
    "isMetric": "no",
    "class": "chemical",
    "names": [
      "Svedberg unit"
    ],
    "printSymbols": [
      "S"
    ],
    "properties": [
      "sedimentation coefficient"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[HPF]": {
    "isBase": false,
    "CODE": "[HPF]",
    "isMetric": "no",
    "class": "chemical",
    "names": [
      "high power field"
    ],
    "printSymbols": [
      "HPF"
    ],
    "properties": [
      "view area in microscope"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[LPF]": {
    "isBase": false,
    "CODE": "[LPF]",
    "isMetric": "no",
    "class": "chemical",
    "names": [
      "low power field"
    ],
    "printSymbols": [
      "LPF"
    ],
    "properties": [
      "view area in microscope"
    ],
    "values": [
      {
        "printable": "100",
        "numeric": 100
      }
    ]
  },
  "kat": {
    "isBase": false,
    "CODE": "KAT",
    "isMetric": "yes",
    "class": "chemical",
    "names": [
      "katal"
    ],
    "printSymbols": [
      "kat"
    ],
    "properties": [
      "catalytic activity"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "U": {
    "isBase": false,
    "CODE": "U",
    "isMetric": "yes",
    "class": "chemical",
    "names": [
      "Unit"
    ],
    "printSymbols": [
      "U"
    ],
    "properties": [
      "catalytic activity"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[iU]": {
    "isBase": false,
    "CODE": "[IU]",
    "isMetric": "yes",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "international unit"
    ],
    "printSymbols": [
      "IU"
    ],
    "properties": [
      "arbitrary"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[IU]": {
    "isBase": false,
    "CODE": "[IU]",
    "isMetric": "yes",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "international unit"
    ],
    "printSymbols": [
      "i.U."
    ],
    "properties": [
      "arbitrary"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[arb'U]": {
    "isBase": false,
    "CODE": "[ARB'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "arbitary unit"
    ],
    "printSymbols": [
      "arb. U"
    ],
    "properties": [
      "arbitrary"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[USP'U]": {
    "isBase": false,
    "CODE": "[USP'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "United States Pharmacopeia unit"
    ],
    "printSymbols": [
      "U.S.P."
    ],
    "properties": [
      "arbitrary"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[GPL'U]": {
    "isBase": false,
    "CODE": "[GPL'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "GPL unit"
    ],
    "properties": [
      "biologic activity of anticardiolipin IgG"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[MPL'U]": {
    "isBase": false,
    "CODE": "[MPL'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "MPL unit"
    ],
    "properties": [
      "biologic activity of anticardiolipin IgM"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[APL'U]": {
    "isBase": false,
    "CODE": "[APL'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "APL unit"
    ],
    "properties": [
      "biologic activity of anticardiolipin IgA"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[beth'U]": {
    "isBase": false,
    "CODE": "[BETH'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "Bethesda unit"
    ],
    "properties": [
      "biologic activity of factor VIII inhibitor"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[anti'Xa'U]": {
    "isBase": false,
    "CODE": "[ANTI'XA'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "anti factor Xa unit"
    ],
    "properties": [
      "biologic activity of factor Xa inhibitor (heparin)"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[todd'U]": {
    "isBase": false,
    "CODE": "[TODD'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "Todd unit"
    ],
    "properties": [
      "biologic activity antistreptolysin O"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[dye'U]": {
    "isBase": false,
    "CODE": "[DYE'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "Dye unit"
    ],
    "properties": [
      "biologic activity of amylase"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[smgy'U]": {
    "isBase": false,
    "CODE": "[SMGY'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "Somogyi unit"
    ],
    "properties": [
      "biologic activity of amylase"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[bdsk'U]": {
    "isBase": false,
    "CODE": "[BDSK'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "Bodansky unit"
    ],
    "properties": [
      "biologic activity of phosphatase"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[ka'U]": {
    "isBase": false,
    "CODE": "[KA'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "King-Armstrong unit"
    ],
    "properties": [
      "biologic activity of phosphatase"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[knk'U]": {
    "isBase": false,
    "CODE": "[KNK'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "Kunkel unit"
    ],
    "properties": [
      "arbitrary biologic activity"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[mclg'U]": {
    "isBase": false,
    "CODE": "[MCLG'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "Mac Lagan unit"
    ],
    "properties": [
      "arbitrary biologic activity"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[tb'U]": {
    "isBase": false,
    "CODE": "[TB'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "tuberculin unit"
    ],
    "properties": [
      "biologic activity of tuberculin"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[CCID_50]": {
    "isBase": false,
    "CODE": "[CCID_50]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "50% cell culture infectious dose"
    ],
    "printSymbols": [
      "CCID<sub>50</sub>"
    ],
    "properties": [
      "biologic activity (infectivity) of an infectious agent preparation"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[TCID_50]": {
    "isBase": false,
    "CODE": "[TCID_50]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "50% tissue culture infectious dose"
    ],
    "printSymbols": [
      "TCID<sub>50</sub>"
    ],
    "properties": [
      "biologic activity (infectivity) of an infectious agent preparation"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[EID_50]": {
    "isBase": false,
    "CODE": "[EID_50]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "50% embryo infectious dose"
    ],
    "printSymbols": [
      "EID<sub>50</sub>"
    ],
    "properties": [
      "biologic activity (infectivity) of an infectious agent preparation"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[PFU]": {
    "isBase": false,
    "CODE": "[PFU]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "plaque forming units"
    ],
    "printSymbols": [
      "PFU"
    ],
    "properties": [
      "amount of an infectious agent"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[FFU]": {
    "isBase": false,
    "CODE": "[FFU]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "focus forming units"
    ],
    "printSymbols": [
      "FFU"
    ],
    "properties": [
      "amount of an infectious agent"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[CFU]": {
    "isBase": false,
    "CODE": "[CFU]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "colony forming units"
    ],
    "printSymbols": [
      "CFU"
    ],
    "properties": [
      "amount of a proliferating organism"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[BAU]": {
    "isBase": false,
    "CODE": "[BAU]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "bioequivalent allergen unit"
    ],
    "printSymbols": [
      "BAU"
    ],
    "properties": [
      "amount of an allergen callibrated through in-vivo testing based on the ID50EAL method of (intradermal dilution for 50mm sum of erythema diameters"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[AU]": {
    "isBase": false,
    "CODE": "[AU]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "allergen unit"
    ],
    "printSymbols": [
      "AU"
    ],
    "properties": [
      "procedure defined amount of an allergen using some reference standard"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[Amb'a'1'U]": {
    "isBase": false,
    "CODE": "[AMB'A'1'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "allergen unit for Ambrosia artemisiifolia"
    ],
    "printSymbols": [
      "Amb a 1 U"
    ],
    "properties": [
      "procedure defined amount of the major allergen of ragweed."
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[PNU]": {
    "isBase": false,
    "CODE": "[PNU]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "protein nitrogen unit"
    ],
    "printSymbols": [
      "PNU"
    ],
    "properties": [
      "procedure defined amount of a protein substance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[Lf]": {
    "isBase": false,
    "CODE": "[LF]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "Limit of flocculation"
    ],
    "printSymbols": [
      "Lf"
    ],
    "properties": [
      "procedure defined amount of an antigen substance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[D'ag'U]": {
    "isBase": false,
    "CODE": "[D'AG'U]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "D-antigen unit"
    ],
    "printSymbols": [
      ""
    ],
    "properties": [
      "procedure defined amount of a poliomyelitis d-antigen substance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[FEU]": {
    "isBase": false,
    "CODE": "[FEU]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "fibrinogen equivalent unit"
    ],
    "printSymbols": [
      ""
    ],
    "properties": [
      "amount of fibrinogen broken down into the measured d-dimers"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[ELU]": {
    "isBase": false,
    "CODE": "[ELU]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "ELISA unit"
    ],
    "printSymbols": [
      ""
    ],
    "properties": [
      "arbitrary ELISA unit"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[EU]": {
    "isBase": false,
    "CODE": "[EU]",
    "isMetric": "no",
    "isArbitrary": "yes",
    "class": "chemical",
    "names": [
      "Ehrlich unit"
    ],
    "printSymbols": [
      ""
    ],
    "properties": [
      "Ehrlich unit"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Np": {
    "isBase": false,
    "CODE": "NEP",
    "isMetric": "yes",
    "isSpecial": "yes",
    "class": "levels",
    "names": [
      "neper"
    ],
    "printSymbols": [
      "Np"
    ],
    "properties": [
      "level"
    ],
    "values": [
      {
        "printable": "<function name=\"ln\" value=\"1\" Unit=\"1\"/>",
        "numeric": null
      }
    ]
  },
  "B": {
    "isBase": false,
    "CODE": "B",
    "isMetric": "yes",
    "isSpecial": "yes",
    "class": "levels",
    "names": [
      "bel"
    ],
    "printSymbols": [
      "B"
    ],
    "properties": [
      "level"
    ],
    "values": [
      {
        "printable": "<function name=\"lg\" value=\"1\" Unit=\"1\"/>",
        "numeric": null
      }
    ]
  },
  "B[SPL]": {
    "isBase": false,
    "CODE": "B[SPL]",
    "isMetric": "yes",
    "isSpecial": "yes",
    "class": "levels",
    "names": [
      "bel sound pressure"
    ],
    "printSymbols": [
      "B(SPL)"
    ],
    "properties": [
      "pressure level"
    ],
    "values": [
      {
        "printable": "<function name=\"lgTimes2\" value=\"2\" Unit=\"10*-5.Pa\"/>",
        "numeric": null
      }
    ]
  },
  "B[V]": {
    "isBase": false,
    "CODE": "B[V]",
    "isMetric": "yes",
    "isSpecial": "yes",
    "class": "levels",
    "names": [
      "bel volt"
    ],
    "printSymbols": [
      "B(V)"
    ],
    "properties": [
      "electric potential level"
    ],
    "values": [
      {
        "printable": "<function name=\"lgTimes2\" value=\"1\" Unit=\"V\"/>",
        "numeric": null
      }
    ]
  },
  "B[mV]": {
    "isBase": false,
    "CODE": "B[MV]",
    "isMetric": "yes",
    "isSpecial": "yes",
    "class": "levels",
    "names": [
      "bel millivolt"
    ],
    "printSymbols": [
      "B(mV)"
    ],
    "properties": [
      "electric potential level"
    ],
    "values": [
      {
        "printable": "<function name=\"lgTimes2\" value=\"1\" Unit=\"mV\"/>",
        "numeric": null
      }
    ]
  },
  "B[uV]": {
    "isBase": false,
    "CODE": "B[UV]",
    "isMetric": "yes",
    "isSpecial": "yes",
    "class": "levels",
    "names": [
      "bel microvolt"
    ],
    "printSymbols": [
      "B(&#956;V)"
    ],
    "properties": [
      "electric potential level"
    ],
    "values": [
      {
        "printable": "<function name=\"lgTimes2\" value=\"1\" Unit=\"uV\"/>",
        "numeric": null
      }
    ]
  },
  "B[10.nV]": {
    "isBase": false,
    "CODE": "B[10.NV]",
    "isMetric": "yes",
    "isSpecial": "yes",
    "class": "levels",
    "names": [
      "bel 10 nanovolt"
    ],
    "printSymbols": [
      "B(10 nV)"
    ],
    "properties": [
      "electric potential level"
    ],
    "values": [
      {
        "printable": "<function name=\"lgTimes2\" value=\"10\" Unit=\"nV\"/>",
        "numeric": null
      }
    ]
  },
  "B[W]": {
    "isBase": false,
    "CODE": "B[W]",
    "isMetric": "yes",
    "isSpecial": "yes",
    "class": "levels",
    "names": [
      "bel watt"
    ],
    "printSymbols": [
      "B(W)"
    ],
    "properties": [
      "power level"
    ],
    "values": [
      {
        "printable": "<function name=\"lg\" value=\"1\" Unit=\"W\"/>",
        "numeric": null
      }
    ]
  },
  "B[kW]": {
    "isBase": false,
    "CODE": "B[KW]",
    "isMetric": "yes",
    "isSpecial": "yes",
    "class": "levels",
    "names": [
      "bel kilowatt"
    ],
    "printSymbols": [
      "B(kW)"
    ],
    "properties": [
      "power level"
    ],
    "values": [
      {
        "printable": "<function name=\"lg\" value=\"1\" Unit=\"kW\"/>",
        "numeric": null
      }
    ]
  },
  "st": {
    "isBase": false,
    "CODE": "STR",
    "isMetric": "yes",
    "class": "misc",
    "names": [
      "stere"
    ],
    "printSymbols": [
      "st"
    ],
    "properties": [
      "volume"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "Ao": {
    "isBase": false,
    "CODE": "AO",
    "isMetric": "no",
    "class": "misc",
    "names": [
      "Ångström"
    ],
    "printSymbols": [
      "&#197;"
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "0.1",
        "numeric": 0.1
      }
    ]
  },
  "b": {
    "isBase": false,
    "CODE": "BRN",
    "isMetric": "no",
    "class": "misc",
    "names": [
      "barn"
    ],
    "printSymbols": [
      "b"
    ],
    "properties": [
      "action area"
    ],
    "values": [
      {
        "printable": "100",
        "numeric": 100
      }
    ]
  },
  "att": {
    "isBase": false,
    "CODE": "ATT",
    "isMetric": "no",
    "class": "misc",
    "names": [
      "technical atmosphere"
    ],
    "printSymbols": [
      "at"
    ],
    "properties": [
      "pressure"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "mho": {
    "isBase": false,
    "CODE": "MHO",
    "isMetric": "yes",
    "class": "misc",
    "names": [
      "mho"
    ],
    "printSymbols": [
      "mho"
    ],
    "properties": [
      "electric conductance"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[psi]": {
    "isBase": false,
    "CODE": "[PSI]",
    "isMetric": "no",
    "class": "misc",
    "names": [
      "pound per sqare inch"
    ],
    "printSymbols": [
      "psi"
    ],
    "properties": [
      "pressure"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "circ": {
    "isBase": false,
    "CODE": "CIRC",
    "isMetric": "no",
    "class": "misc",
    "names": [
      "circle"
    ],
    "printSymbols": [
      "circ"
    ],
    "properties": [
      "plane angle"
    ],
    "values": [
      {
        "printable": "2",
        "numeric": 2
      }
    ]
  },
  "sph": {
    "isBase": false,
    "CODE": "SPH",
    "isMetric": "no",
    "class": "misc",
    "names": [
      "spere"
    ],
    "printSymbols": [
      "sph"
    ],
    "properties": [
      "solid angle"
    ],
    "values": [
      {
        "printable": "4",
        "numeric": 4
      }
    ]
  },
  "[car_m]": {
    "isBase": false,
    "CODE": "[CAR_M]",
    "isMetric": "no",
    "class": "misc",
    "names": [
      "metric carat"
    ],
    "printSymbols": [
      "ct<sub>m</sub>"
    ],
    "properties": [
      "mass"
    ],
    "values": [
      {
        "printable": "0.2",
        "numeric": 0.2
      }
    ]
  },
  "[car_Au]": {
    "isBase": false,
    "CODE": "[CAR_AU]",
    "isMetric": "no",
    "class": "misc",
    "names": [
      "carat of gold alloys"
    ],
    "printSymbols": [
      "ct<sub>\n            <r>Au</r>\n         </sub>"
    ],
    "properties": [
      "mass fraction"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "[smoot]": {
    "isBase": false,
    "CODE": "[SMOOT]",
    "isMetric": "no",
    "class": "misc",
    "names": [
      "Smoot"
    ],
    "printSymbols": [
      ""
    ],
    "properties": [
      "length"
    ],
    "values": [
      {
        "printable": "67",
        "numeric": 67
      }
    ]
  },
  "bit_s": {
    "isBase": false,
    "CODE": "BIT_S",
    "isMetric": "no",
    "isSpecial": "yes",
    "class": "infotech",
    "names": [
      "bit"
    ],
    "printSymbols": [
      "bit<sub>s</sub>"
    ],
    "properties": [
      "amount of information"
    ],
    "values": [
      {
        "printable": "<function name=\"ld\" value=\"1\" Unit=\"1\"/>",
        "numeric": null
      }
    ]
  },
  "bit": {
    "isBase": false,
    "CODE": "BIT",
    "isMetric": "yes",
    "class": "infotech",
    "names": [
      "bit"
    ],
    "printSymbols": [
      "bit"
    ],
    "properties": [
      "amount of information"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "By": {
    "isBase": false,
    "CODE": "BY",
    "isMetric": "yes",
    "class": "infotech",
    "names": [
      "byte"
    ],
    "printSymbols": [
      "B"
    ],
    "properties": [
      "amount of information"
    ],
    "values": [
      {
        "printable": "8",
        "numeric": 8
      }
    ]
  },
  "Bd": {
    "isBase": false,
    "CODE": "BD",
    "isMetric": "yes",
    "class": "infotech",
    "names": [
      "baud"
    ],
    "printSymbols": [
      "Bd"
    ],
    "properties": [
      "signal transmission rate"
    ],
    "values": [
      {
        "printable": "1",
        "numeric": 1
      }
    ]
  },
  "m": {
    "isBase": true,
    "CODE": "M",
    "dim": "L",
    "names": [
      "meter"
    ],
    "printSymbols": [
      "m"
    ],
    "properties": [
      "length"
    ]
  },
  "s": {
    "isBase": true,
    "CODE": "S",
    "dim": "T",
    "names": [
      "second"
    ],
    "printSymbols": [
      "s"
    ],
    "properties": [
      "time"
    ]
  },
  "g": {
    "isBase": true,
    "CODE": "G",
    "dim": "M",
    "names": [
      "gram"
    ],
    "printSymbols": [
      "g"
    ],
    "properties": [
      "mass"
    ]
  },
  "rad": {
    "isBase": true,
    "CODE": "RAD",
    "dim": "A",
    "names": [
      "radian"
    ],
    "printSymbols": [
      "rad"
    ],
    "properties": [
      "plane angle"
    ]
  },
  "K": {
    "isBase": true,
    "CODE": "K",
    "dim": "C",
    "names": [
      "Kelvin"
    ],
    "printSymbols": [
      "K"
    ],
    "properties": [
      "temperature"
    ]
  },
  "C": {
    "isBase": true,
    "CODE": "C",
    "dim": "Q",
    "names": [
      "Coulomb"
    ],
    "printSymbols": [
      "C"
    ],
    "properties": [
      "electric charge"
    ]
  },
  "cd": {
    "isBase": true,
    "CODE": "CD",
    "dim": "F",
    "names": [
      "candela"
    ],
    "printSymbols": [
      "cd"
    ],
    "properties": [
      "luminous intensity"
    ]
  }
}

},{}],55:[function(require,module,exports){
module.exports = {

  multiply: function multiply(t, ms) {
    //console.log("Multiply: ", JSON.stringify(t), JSON.stringify(ms));
    if (ms.length == 0) return t;

    var ret = t;
    ms.forEach(function(mterm){

      var sign = (mterm[0] == "." ? 1 : -1);
      var b = mterm[1];

      ret.value *= Math.pow(b.value, sign);
      //console.log("b = ", JSON.stringify(b));
      //console.log("ret = ", JSON.stringify(ret));
      Object.keys(b.units).forEach(function(u){
        ret.units[u] = ret.units[u] || 0;
        ret.units[u] = ret.units[u] + sign*b.units[u];

        if(!ret.metadata && b.metadata){
          ret.metadata = {};
          ret.metadata[u] = b.metadata[u];
        }
        else if(ret.metadata && b.metadata){
          ret.metadata[u] = b.metadata[u];
        }

        if (ret.units[u] == 0){
          delete ret.units[u];
          if(ret.metadata) {
            delete ret.metadata[u];
          }
        }
      });

    });

    //console.log("Multiply ret: ", ret);
    return ret;
  },

  topower: function topower(e, exp){
    if (!exp) {exp = 1;}
    var ret = e;
    ret.value = Math.pow(ret.value, exp);
    Object.keys(e.units).forEach(function(u){
      ret.units[u] = e.units[u] * exp;
    });

    return ret;
  },

  cleanup: function cleanup(e) {
    ["10^", "10*"].forEach(function(k){
      if (e.units[k]) {
        e.value *= Math.pow(10, e.units[k]);
        delete e.units[k];
      }
    });
    return e;
  },

  ismetric: function(metrics) {
    return function(u) {
      return metrics[Object.keys(u.units)[0]] !== undefined;
    };
  }
}

},{}],56:[function(require,module,exports){
parser = require('./generated/ucum-parser.js');
equivalents = require('./generated/equivalents.json');
helpers = require('./lib/helpers.js');
unitMetadata = require('./generated/unitMetadata.json');

module.exports = {
  parse: parse,
  canonicalize: canonicalize,
  convert: convert,
  format: format,
  unitQuery: unitQuery
};

function parse(value, units){

  if (arguments.length === 1 || units === undefined){
    units = value;
    value = 1
  }

  if (units.match(/^\//)){
    units = '1'+units;
  }

  if (units === '') units = '1';

  var ret = parser.parse(units);
  ret.value *= value;
  return ret;
}

function nonBaseUnit(u){
  return equivalents[u] !== undefined;
}

function remainingNonBaseUnits(value) {
  return Object.keys(value.units).filter(nonBaseUnit)
}

function canonicalize(value, units){

  value = parse(value, units);

  var remaining = remainingNonBaseUnits(value);

  while (remaining.length) {
    if (remaining.length === 0) {
      return false;
    }

    remaining.forEach(function(u){
      var sub = parse(equivalents[u].ucum);
      sub.value *= equivalents[u].value;
      sub = helpers.topower(sub, value.units[u]);
      value = helpers.multiply(value, [['.', sub]]);
      delete value.units[u];
    });

    remaining = remainingNonBaseUnits(value);
  }

  // we should remove any prefix metadata that exists at this point
  // because it represents residual artifacts of the above process
  if(value.metadata){
    Object.keys(value.metadata).forEach(function(u){
      if(value.metadata[u]){
        if(value.metadata[u].prefix) {
          delete value.metadata[u].prefix;
        }

        // if it's not in the final array of units we should delete this metadata as well
        if(Object.keys(value.units).indexOf(u) == -1){
          delete value.metadata[u];
        }
      }
    });
  }

  return value;
}

function conformant(a, b){
  var ret = true;
  Object.keys(a.units)
  .concat(Object.keys(b.units))
  .forEach(function(k){
    if (a.units[k] !== b.units[k]) {
      ret = false;
    }
  });
  
  return ret;
}

function convert(fromValue, fromUnits, toUnits){
 fromc = canonicalize(fromValue, fromUnits);
 toc = canonicalize(toUnits);

 if (!conformant(fromc, toc)){
   throw "Non-conformant units; can't convert from " + fromUnits + " to " + toUnits ;
 }

 return fromc.value / toc.value;

}

// format returns a printable representation of the value
// the resulting units are a single-line html rendering of the resultant units
// can be invoked in the following supported ways, by example:
// 1. ucum.format('[in_i]') -> 'in'
// 2. ucum.format('[in_i]', true) -> '1 in'
// 3. ucum.format(3, '[in_i]', true) -> '3 in'
// 4. var x = ucum.parse(3, '[in_i]'); ucum.format(x) -> 'in'
// 5. var x = ucum.parse(3, '[in_i]'); ucum.format(x, true) -> '3 in'
function format(value, units, includeValue){
  var obj;

  if(typeof value === 'string'){
    includeValue = units;
    units = value;
    value = 1;
  }

  if(typeof value === 'object'){
    // treat it like a UCUM parse output
    obj = value;
    includeValue = units; // you would never provide units in this case, but you might provide includeValue
  }
  else{
    // parse it first
    obj = parse(value, units);
  }

  var units = Object.keys(obj.units);
  var metadata = obj.metadata;
  var numUnits = units.length;
  var numeratorUnits = [];
  var denominatorUnits = [];
  var printableUnits = "";
  
  units.forEach(function(unit, index){
    var exponent = obj.units[unit];
    var absExponent = Math.abs(exponent);
    var printable = metadata[unit].printSymbols ? metadata[unit].printSymbols[0] : metadata[unit].names[0];
    var prefix = metadata[unit].prefix ? metadata[unit].prefix.printSymbols[0] : "";
    pUnit = prefix + printable;
    if(absExponent !== 1){      
      pUnit += "<sup>";
      pUnit += Math.abs(exponent);
      pUnit += "</sup>";
    }
    
    if(exponent > 0){
      numeratorUnits.push(pUnit);
    }
    else{
      denominatorUnits.push(pUnit);
    }
  });


  if(numeratorUnits.length == 0){
    printableUnits = "1";
  }
  else if(numeratorUnits.length > 0){
    printableUnits = numeratorUnits.join("*");
  }
  
  if(denominatorUnits.length > 0){
    printableUnits += "/";
  } 
  
  printableUnits += denominatorUnits.join("/");

  if(includeValue){
    printableUnits = obj.value + " " + printableUnits;
  }

  return printableUnits;
}

// searches the unit metadata for all unit metadata
// criteria is an object like
//   { properties: 'area', isMetric: 'yes' }
// where the key/value pairs form a logical intersection, i.e. all criteria must be met
// resultFields is an array to pre-reduce the result set fields
function unitQuery(criteria, resultFields){
  return Object.keys(unitMetadata).filter((unit) => {
    var keys = Object.keys(criteria);
    for(var ii = 0; ii < keys.length; ii++){
      var key = keys[ii];
      var val = unitMetadata[unit][key];
      var value = criteria[key];
      if(val && (typeof val === 'object')){
        // it's a list of values, it's a match if the target value occurs in the list
        if(val.indexOf(value) === -1){
          return false;
        }
      }
      else{
        // it's a non-object, make a direct comparison
        if(unitMetadata[unit][key] !== value){
          return false;
        }
      }
    }
    return true;
  }).map((key) => {
    var obj = {};
    if(resultFields){
      if(resultFields.length) {
        obj[key] = {};
        resultFields.forEach((field) => {
          if (unitMetadata[key][field] !== undefined) {
            obj[key][field] = JSON.parse(JSON.stringify(unitMetadata[key][field]));
          }
        });
      }
      else{
        // just return the keys if an empty array gets passed for resultSet
        obj = key;
      }
    }
    else{
      obj[key] = JSON.parse(JSON.stringify(unitMetadata[key]));
    }
    return obj;
  });
}
},{"./generated/equivalents.json":49,"./generated/ucum-parser.js":53,"./generated/unitMetadata.json":54,"./lib/helpers.js":55}]},{},[1]);
