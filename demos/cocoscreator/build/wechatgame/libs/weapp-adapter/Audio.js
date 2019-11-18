'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HTMLAudioElement2 = require('./HTMLAudioElement');

var _HTMLAudioElement3 = _interopRequireDefault(_HTMLAudioElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HAVE_NOTHING = 0;
var HAVE_METADATA = 1;
var HAVE_CURRENT_DATA = 2;
var HAVE_FUTURE_DATA = 3;
var HAVE_ENOUGH_DATA = 4;

var SN_SEED = 1;

var _innerAudioContextMap = {};

var Audio = function (_HTMLAudioElement) {
  _inherits(Audio, _HTMLAudioElement);

  function Audio(url) {
    _classCallCheck(this, Audio);

    var _this = _possibleConstructorReturn(this, (Audio.__proto__ || Object.getPrototypeOf(Audio)).call(this));

    _this._$sn = SN_SEED++;

    _this.HAVE_NOTHING = HAVE_NOTHING;
    _this.HAVE_METADATA = HAVE_METADATA;
    _this.HAVE_CURRENT_DATA = HAVE_CURRENT_DATA;
    _this.HAVE_FUTURE_DATA = HAVE_FUTURE_DATA;
    _this.HAVE_ENOUGH_DATA = HAVE_ENOUGH_DATA;

    _this.readyState = HAVE_NOTHING;

    var innerAudioContext = wx.createInnerAudioContext();

    _innerAudioContextMap[_this._$sn] = innerAudioContext;

    _this._canplayEvents = ['load', 'loadend', 'canplay', 'canplaythrough', 'loadedmetadata'];

    innerAudioContext.onCanplay(function () {
      _this._loaded = true;
      _this.readyState = _this.HAVE_CURRENT_DATA;
      _this._canplayEvents.forEach(function (type) {
        _this.dispatchEvent({ type: type });
      });
    });
    innerAudioContext.onPlay(function () {
      _this._paused = _innerAudioContextMap[_this._$sn].paused;
      _this.dispatchEvent({ type: 'play' });
    });
    innerAudioContext.onPause(function () {
      _this._paused = _innerAudioContextMap[_this._$sn].paused;
      _this.dispatchEvent({ type: 'pause' });
    });
    innerAudioContext.onEnded(function () {
      _this._paused = _innerAudioContextMap[_this._$sn].paused;
      if (_innerAudioContextMap[_this._$sn].loop === false) {
        _this.dispatchEvent({ type: 'ended' });
      }
      _this.readyState = HAVE_ENOUGH_DATA;
    });
    innerAudioContext.onError(function () {
      _this._paused = _innerAudioContextMap[_this._$sn].paused;
      _this.dispatchEvent({ type: 'error' });
    });

    if (url) {
      _this.src = url;
    } else {
      _this._src = '';
    }

    _this._loop = innerAudioContext.loop;
    _this._autoplay = innerAudioContext.autoplay;
    _this._paused = innerAudioContext.paused;
    _this._volume = innerAudioContext.volume;
    _this._muted = false;
    return _this;
  }

  _createClass(Audio, [{
    key: 'addEventListener',
    value: function addEventListener(type, listener) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _get(Audio.prototype.__proto__ || Object.getPrototypeOf(Audio.prototype), 'addEventListener', this).call(this, type, listener, options);

      type = String(type).toLowerCase();

      if (this._loaded && this._canplayEvents.indexOf(type) !== -1) {
        this.dispatchEvent({ type: type });
      }
    }
  }, {
    key: 'load',
    value: function load() {
      // console.warn('HTMLAudioElement.load() is not implemented.')
      // weixin doesn't need call load() manually
    }
  }, {
    key: 'play',
    value: function play() {
      _innerAudioContextMap[this._$sn].play();
    }
  }, {
    key: 'resume',
    value: function resume() {
      _innerAudioContextMap[this._$sn].resume();
    }
  }, {
    key: 'pause',
    value: function pause() {
      _innerAudioContextMap[this._$sn].pause();
    }
  }, {
    key: 'stop',
    value: function stop() {
      _innerAudioContextMap[this._$sn].stop();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      _innerAudioContextMap[this._$sn].destroy();
    }
  }, {
    key: 'canPlayType',
    value: function canPlayType() {
      var mediaType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (typeof mediaType !== 'string') {
        return '';
      }

      if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
        return 'probably';
      }
      return '';
    }
  }, {
    key: 'cloneNode',
    value: function cloneNode() {
      var newAudio = new Audio();
      newAudio.loop = this.loop;
      newAudio.autoplay = this.autoplay;
      newAudio.src = this.src;
      return newAudio;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return _innerAudioContextMap[this._$sn].currentTime;
    },
    set: function set(value) {
      _innerAudioContextMap[this._$sn].seek(value);
    }
  }, {
    key: 'duration',
    get: function get() {
      return _innerAudioContextMap[this._$sn].duration;
    }
  }, {
    key: 'src',
    get: function get() {
      return this._src;
    },
    set: function set(value) {
      this._src = value;
      this._loaded = false;
      this.readyState = this.HAVE_NOTHING;

      var innerAudioContext = _innerAudioContextMap[this._$sn];

      innerAudioContext.src = value;
    }
  }, {
    key: 'loop',
    get: function get() {
      return this._loop;
    },
    set: function set(value) {
      this._loop = value;
      _innerAudioContextMap[this._$sn].loop = value;
    }
  }, {
    key: 'autoplay',
    get: function get() {
      return this.autoplay;
    },
    set: function set(value) {
      this._autoplay = value;
      _innerAudioContextMap[this._$sn].autoplay = value;
    }
  }, {
    key: 'paused',
    get: function get() {
      return this._paused;
    }
  }, {
    key: 'volume',
    get: function get() {
      return this._volume;
    },
    set: function set(value) {
      this._volume = value;
      if (!this._muted) {
        _innerAudioContextMap[this._$sn].volume = value;
      }
    }
  }, {
    key: 'muted',
    get: function get() {
      return this._muted;
    },
    set: function set(value) {
      this._muted = value;
      if (value) {
        _innerAudioContextMap[this._$sn].volume = 0;
      } else {
        _innerAudioContextMap[this._$sn].volume = this._volume;
      }
    }
  }]);

  return Audio;
}(_HTMLAudioElement3.default);

exports.default = Audio;
module.exports = exports['default'];