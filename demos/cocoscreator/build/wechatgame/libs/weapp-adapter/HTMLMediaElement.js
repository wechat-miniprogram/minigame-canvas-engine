'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTMLElement2 = require('./HTMLElement');

var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLMediaElement = function (_HTMLElement) {
  _inherits(HTMLMediaElement, _HTMLElement);

  function HTMLMediaElement(type) {
    _classCallCheck(this, HTMLMediaElement);

    return _possibleConstructorReturn(this, (HTMLMediaElement.__proto__ || Object.getPrototypeOf(HTMLMediaElement)).call(this, type));
  }

  _createClass(HTMLMediaElement, [{
    key: 'addTextTrack',
    value: function addTextTrack() {}
  }, {
    key: 'captureStream',
    value: function captureStream() {}
  }, {
    key: 'fastSeek',
    value: function fastSeek() {}
  }, {
    key: 'load',
    value: function load() {}
  }, {
    key: 'pause',
    value: function pause() {}
  }, {
    key: 'play',
    value: function play() {}
  }]);

  return HTMLMediaElement;
}(_HTMLElement3.default);

exports.default = HTMLMediaElement;
module.exports = exports['default'];