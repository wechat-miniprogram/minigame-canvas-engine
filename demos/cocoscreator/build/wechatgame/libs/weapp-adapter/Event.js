'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = function Event(type) {
  _classCallCheck(this, Event);

  this.cancelBubble = false;
  this.cancelable = false;
  this.target = null;
  this.timestampe = Date.now();
  this.preventDefault = _util.noop;
  this.stopPropagation = _util.noop;

  this.type = type;
};

exports.default = Event;
module.exports = exports['default'];