"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Client: true,
  Migi: true
};
Object.defineProperty(exports, "Client", {
  enumerable: true,
  get: function get() {
    return _Migi.default;
  }
});
Object.defineProperty(exports, "Migi", {
  enumerable: true,
  get: function get() {
    return _Migi.default;
  }
});
exports.default = void 0;

var _discord = require("discord.js");

Object.keys(_discord).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _discord[key];
    }
  });
});

var _Migi = _interopRequireDefault(require("./Migi"));

Object.keys(_Migi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Migi[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _Migi.default;
exports.default = _default;