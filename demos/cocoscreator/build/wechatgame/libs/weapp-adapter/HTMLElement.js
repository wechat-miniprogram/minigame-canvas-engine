'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Element2 = require('./Element');

var _Element3 = _interopRequireDefault(_Element2);

var _index = require('./util/index.js');

var _WindowProperties = require('./WindowProperties');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLElement = function (_Element) {
  _inherits(HTMLElement, _Element);

  function HTMLElement() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, HTMLElement);

    var _this = _possibleConstructorReturn(this, (HTMLElement.__proto__ || Object.getPrototypeOf(HTMLElement)).call(this));

    _this.className = '';
    _this.childern = [];
    _this.style = {
      width: _WindowProperties.innerWidth + 'px',
      height: _WindowProperties.innerHeight + 'px'
    };
    _this.insertBefore = _index.noop;
    _this.innerHTML = '';

    _this.tagName = tagName.toUpperCase();
    return _this;
  }

  _createClass(HTMLElement, [{
    key: 'setAttribute',
    value: function setAttribute(name, value) {
      this[name] = value;
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(name) {
      return this[name];
    }
  }, {
    key: 'getBoundingClientRect',
    value: function getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: _WindowProperties.innerWidth,
        height: _WindowProperties.innerHeight
      };
    }
  }, {
    key: 'focus',
    value: function focus() {}
  }, {
    key: 'clientWidth',
    get: function get() {
      var ret = parseInt(this.style.fontSize, 10) * this.innerHTML.length;

      return Number.isNaN(ret) ? 0 : ret;
    }
  }, {
    key: 'clientHeight',
    get: function get() {
      var ret = parseInt(this.style.fontSize, 10);

      return Number.isNaN(ret) ? 0 : ret;
    }
  }]);

  return HTMLElement;
}(_Element3.default);

exports.default = HTMLElement;
module.exports = exports['default'];