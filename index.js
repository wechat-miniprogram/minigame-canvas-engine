module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _common_pool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tiny_emitter__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony import */ var _libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_pseudoClassManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);
/* harmony import */ var _common_textManager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(12);
/* harmony import */ var _renderer_renderContextManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(13);
/* harmony import */ var _common_vd__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(26);
/* harmony import */ var _common_cssLayoutAdapter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(37);
/* harmony import */ var css_layout__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(38);
/* harmony import */ var css_layout__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(css_layout__WEBPACK_IMPORTED_MODULE_10__);
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





 // import { adaptor, updateLayout, initYoga } from './common/adaptor';








var wx = pluginEnv.customEnv.wx; // 默认的字体管理器getFontManager

function getFontManager() {
  var measureCanvas = wx.createCanvas();
  measureCanvas.width = 1;
  measureCanvas.height = 1;
  var fontManager = {
    measureText: function measureText(str, fontStyle, fontWeight, fontSize, fontFamily) {
      var canvas = measureCanvas;
      var ctx = canvas.getContext('2d');
      ctx.font = "".concat(fontStyle || 'normal', " ").concat(fontWeight || 'normal', " ").concat(fontSize || 12, "px ").concat(fontFamily);
      return ctx.measureText(str).width;
    }
  };
  return fontManager;
}

var _Layout = /*#__PURE__*/function (_Element) {
  _inherits(_Layout, _Element);

  var _super = _createSuper(_Layout);

  function _Layout() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        style = _ref.style,
        name = _ref.name,
        isDarkMode = _ref.isDarkMode,
        getWidth = _ref.getWidth,
        getSize = _ref.getSize,
        getFontSize = _ref.getFontSize,
        getFps = _ref.getFps,
        canvasId = _ref.canvasId,
        canvasContext = _ref.canvasContext,
        fontManager = _ref.fontManager,
        _ref$scale = _ref.scale,
        scale = _ref$scale === void 0 ? 1 : _ref$scale;

    _classCallCheck(this, _Layout);

    _this = _super.call(this, {
      style: style,
      id: 0,
      name: name
    });
    _this._methods = {};
    _this.canvasId = canvasId;
    _this.hasEventHandler = false;
    _this.elementTree = null;
    _this.renderContext = null;
    _this.scale = scale;

    if (canvasContext) {
      _this.setCanvasContext(canvasContext, scale);
    }

    _this.fontManager = fontManager || getFontManager();
    _this.debugInfo = {};
    _this.renderport = {}; // 包含像素比例的宽高

    _this.touchStart = _this.eventHandler('touchstart').bind(_assertThisInitialized(_this));
    _this.touchMove = _this.eventHandler('touchmove').bind(_assertThisInitialized(_this));
    _this.touchEnd = _this.eventHandler('touchend').bind(_assertThisInitialized(_this));
    _this.touchCancel = _this.eventHandler('touchcancel').bind(_assertThisInitialized(_this));
    _this.version = '0.0.1';
    _this.touchMsg = {};
    _this.hasViewPortSet = false;
    _this.realLayoutBox = {
      realX: 0,
      realY: 0
    };
    _this.pseudoClassManager = new _common_pseudoClassManager_js__WEBPACK_IMPORTED_MODULE_5__["default"](_assertThisInitialized(_this));
    _this.textManager = new _common_textManager_js__WEBPACK_IMPORTED_MODULE_6__["default"](_assertThisInitialized(_this));

    _this.isDarkMode = isDarkMode || function () {
      return false;
    }; // 是否darkmode


    _this.getWidth = getWidth || function () {
      return 0;
    };

    _this.getSize = getSize || function () {
      return {
        width: 0,
        height: 0
      };
    };

    _this.getFontSize = getFontSize || function () {
      return 1;
    };

    _this.getFps = getFps || function () {
      return 0;
    };

    _this.state = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].UNINIT;
    _this.imgPool = new _common_pool_js__WEBPACK_IMPORTED_MODULE_1__["default"]('imgPool');
    _this._emitter = new tiny_emitter__WEBPACK_IMPORTED_MODULE_2___default.a();
    _this._EE = new tiny_emitter__WEBPACK_IMPORTED_MODULE_2___default.a(); // this.viewport = {
    //   width: getWidth(),
    // }; // 不包含像素的宽高

    _this.viewport = getSize();
    _this._videos = [];
    _this._firstComputeLayout = true; // 是否首次计算布局

    _this._useLayoutData = false; // 是否使用了序列化的布局数据

    return _this;
  }

  _createClass(_Layout, [{
    key: "methods",
    value: function methods(config) {
      this._methods = config;
    }
  }, {
    key: "setCanvasContext",
    value: function setCanvasContext(ctx, scale) {
      this.canvasContext = ctx;
      this.renderContext = new _renderer_renderContextManager__WEBPACK_IMPORTED_MODULE_7__["default"](ctx, scale);
      this.renderContext.layout = this;
    }
  }, {
    key: "initRepaint",
    value: function initRepaint() {}
  }, {
    key: "deactive",
    value: function deactive() {
      console.log('deactive call');
      this._oldState = this.state;
      this.state = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].DEACTIVE;

      this._deactiveTree(this);
    }
  }, {
    key: "active",
    value: function active() {
      console.log('active call');
      this.state = this._oldState || _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].RENDERED;

      this._activeTree(this);
    }
  }, {
    key: "init",
    value: function init(template, style) {
      var _arguments = arguments,
          _this2 = this;

      var styleDark = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var attrValueProcessor = arguments.length > 3 ? arguments[3] : undefined;
      return new Promise(function (resolve, reject) {
        var start = new Date();

        if (typeof styleDark === "function" && _arguments.length === 3) {
          attrValueProcessor = styleDark;
          styleDark = {};
        }

        _this2.cssRules = {}; // 保存下css规则

        _this2.cssDarkRules = {}; // 保存下css darkmode的规则
        // 处理所有class里面的尺寸

        for (var k in style) {
          _this2.cssRules[k] = {};

          for (var key in style[k]) {
            _this2.cssRules[k][key] = style[k][key];
          }
        }

        for (var _k in styleDark) {
          _this2.cssDarkRules[_k] = {};

          for (var _key in styleDark[_k]) {
            _this2.cssDarkRules[_k][_key] = styleDark[_k][_key];
          }
        }

        var parseConfig = {
          attributeNamePrefix: "",
          attrNodeName: "attr",
          //default is 'false'
          textNodeName: "#text",
          ignoreAttributes: false,
          ignoreNameSpace: true,
          allowBooleanAttributes: true,
          parseNodeValue: false,
          parseAttributeValue: false,
          trimValues: true,
          parseTrueNumberOnly: false
        };

        if (attrValueProcessor) {
          parseConfig.attrValueProcessor = attrValueProcessor;
        }
        /*if( parser.validate(template) === true) { //optional (it'll return an object in case it's not valid)*/


        var jsonObj = _libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_4___default.a.parse(template, parseConfig, true);
        /*}*/

        var xmlTree = jsonObj.children[0];
        _this2.debugInfo.xmlTree = new Date() - start;
        Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])("init getXmlTree time ".concat(new Date() - start)); // XML树生成渲染树

        _this2.layoutTree = _common_vd__WEBPACK_IMPORTED_MODULE_8__["create"].call(_this2, xmlTree, style, styleDark, _this2.isDarkMode(), _this2.getFontSize());
        Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])("create time ".concat(new Date() - start));
        _this2.debugInfo.layoutTree = new Date() - start;

        _this2.add(_this2.layoutTree);

        console.log(_this2.layoutTree);
        _this2.debugInfo.renderTree = new Date() - start;
        _this2.state = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].INITED;
        _this2.reflowRequest = 0;
        _this2.repaintRequest = 0; // 收到reflow事件后，知道下一个loop没有reflow才执行computeLayout

        _this2.on('reflow', function () {
          _this2.reflowRequest++;
          Promise.resolve(_this2.reflowRequest).then(function (val) {
            if (_this2.reflowRequest === val) {
              Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])('layout reflow');
              _this2.reflowRequest = 0;
              _this2.textManager.hasUpdate = false;

              _this2.computeLayout(); // @hardcode


              _this2.scrollview && _this2.scrollview.traverseToChangeGlRect(_this2.scrollview, _this2.scrollview.scrollLeft, _this2.scrollview.scrollTop);

              _this2.drawLayout();
            }
          });
        });

        Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])("init time ".concat(new Date() - start));

        _this2.computeLayout();

        resolve();
      });
    }
  }, {
    key: "forceUpdate",
    value: function forceUpdate() {
      var _this3 = this;

      // log('forceUpdate--------');
      if (this.flushing) {
        return;
      }

      this.flushing = true;
      Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["nextTick"])(function () {
        // log('nextTick forceUpdate--------');
        _this3.repaint();

        _this3.flushing = false;
      });
    }
  }, {
    key: "beforeReflow",
    value: function beforeReflow(children) {
      children = children || this.children;

      for (var i = 0, len = children.length; i < len; i++) {
        if (children[i].beforeReflow) {
          children[i].beforeReflow();
        }

        this.beforeReflow(children[i].children);
      }
    } // 把数据丢给渲染线程

  }, {
    key: "repaint",
    value: function repaint() {
      var needInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      // log('repaint call');
      var renderer = this.renderContext; // log(renderer.glRects.length);

      renderer.draw(needInit);
    }
  }, {
    key: "getLayoutData",
    value: function getLayoutData() {
      // 缓存layout相关的数据，方便冷启动时恢复
      var data = {
        charWidthMap: _common_util_js__WEBPACK_IMPORTED_MODULE_3__["charWidthMap"],
        // 存下之前计算过的文本的宽度，避免重复计算
        layoutBoxTree: {
          layoutBox: this.layoutBox,
          children: getNodeData(this.children)
        }
      }; // log(data);

      return data;
    }
  }, {
    key: "setLayoutData",
    value: function setLayoutData(data) {
      Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])('set layoutData', data.charWidthMap);
      this.layoutData = data;

      if (data.charWidthMap) {
        Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["setCharMap"])(data.charWidthMap);
      }
    } // 计算布局树

  }, {
    key: "computeLayout",
    value: function computeLayout() {
      // log('start computeLayout');
      var start = new Date();
      this.renderport.height = 0;
      this.viewport = this.getSize();
      var isDarkMode = this.isDarkMode();
      var fontSize = this.getFontSize(); // 第一层根节点，宽度如果是设置了百分比，把宽度改成屏幕的宽度

      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        var style = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["getElementStyle"].call(child, isDarkMode);
        var computedStyle = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["getElementStyle"].call(child, isDarkMode);

        if (style.width && style.width.indexOf && style.width.indexOf('%') > -1) {
          var w = Number.parseInt(style.width) / 100 * this.viewport.width;
          child.computedStyle.width = w;
          this.renderport.width = w;
        } else if (style.width && typeof style.width === 'number') {
          this.renderport.width = computedStyle.width;
        }
      }

      if (this.layoutData && this.layoutData.layoutBoxTree && this.layoutData.layoutBoxTree.children && this.layoutData.layoutBoxTree.children.length) {
        // 有layout数据，不用再用yoga跑一遍
        var layoutBoxTree = this.layoutData.layoutBoxTree;
        this.layoutBox = layoutBoxTree.layoutBox;

        if (Object(_common_vd__WEBPACK_IMPORTED_MODULE_8__["restoreLayoutTree"])(this.children, layoutBoxTree.children)) {
          Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])('restoreLayoutTree success');
          this.layoutData = null;
          this.textManager.hasUpdate = true;
          this._useLayoutData = true;
        } else {
          Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])('restoreLayoutTree fail');
          this.layoutData = null;
          Object(_common_cssLayoutAdapter__WEBPACK_IMPORTED_MODULE_9__["adaptor"])(this);
        }
      } else {
        Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])('without layoutData');
        Object(_common_cssLayoutAdapter__WEBPACK_IMPORTED_MODULE_9__["adaptor"])(this);
        this._useLayoutData = false;
      }

      var computedStart = Date.now();

      css_layout__WEBPACK_IMPORTED_MODULE_10___default()(this);

      console.log('computeLayout cost', Date.now() - computedStart);
      this.debugInfo.yogaLayout = new Date() - start; // 这里更新下文本节点的宽高

      if (!this.textManager.hasUpdate) {
        this.textManager.hasUpdate = true;
        this.textManager.updateTextNodeLayoutBox();
        Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])('updateTextNodeLayoutBox'); // calculateDirtyNode(this);
        // updateLayout(this);
      }

      Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])('before renderContext clear');
      this.renderContext.clear();
      _common_vd__WEBPACK_IMPORTED_MODULE_8__["layoutChildren"].call(this, this.children, isDarkMode, fontSize);

      for (var _i = 0; _i < this.children.length; _i++) {
        this.renderport.height += this.children[_i].layoutBox.height;
      }

      this.viewport.height = this.renderport.height;
      /*console.log('viewport.height', this.viewport.height);*/

      this.renderContext.width = this.viewport.width * this.scale;
      this.renderContext.height = this.viewport.height * this.scale;
      this.debugInfo.layoutChildren = new Date() - start;
      Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["log"])("computeLayout time ".concat(this.debugInfo.computeLayout));

      if (this._firstComputeLayout && !this._useLayoutData) {
        // 这里统计首次计算布局并且没有序列化数据的耗时
        this._firstComputeLayout = false;
      } else if (!this._useLayoutData) {} else if (this._useLayoutData) {}
    }
    /**
     * 更新被绘制canvas的窗口信息，本渲染引擎并不关心是否会和其他游戏引擎共同使用
     * 而本身又需要支持事件处理，因此，如果被渲染内容是绘制到离屏canvas，需要将最终绘制在屏幕上
     * 的绝对尺寸和位置信息更新到本渲染引擎。
     * 其中，width为物理像素宽度，height为物理像素高度，x为距离屏幕左上角的物理像素x坐标，y为距离屏幕左上角的物理像素
     * y坐标
     */

  }, {
    key: "updateViewPort",
    value: function updateViewPort(box) {
      this.viewport.width = box.width || 0;
      this.viewport.height = box.height || 0;
      this.viewport.x = box.x || 0;
      this.viewport.y = box.y || 0;
      this.realLayoutBox = {
        realX: this.viewport.x,
        realY: this.viewport.y
      };
      this.hasViewPortSet = true; // 计算真实的物理像素位置，用于事件处理

      _common_vd__WEBPACK_IMPORTED_MODULE_8__["updateRealLayout"].call(this, this.children, this.viewport.width / (this.renderContext.width / this.scale));
    }
  }, {
    key: "restore",
    value: function restore(elementTree, layoutBox) {
      this.elementTree = elementTree;
      this.updateViewPort(layoutBox);
    } // 渲染布局树

  }, {
    key: "drawLayout",
    value: function drawLayout() {
      if (!this.canvasContext) {
        return;
      }

      this.bindEvents();
      this.state = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].RENDERED;
      this.forceUpdate();
    } // 根据x和y找到相应的子节点

  }, {
    key: "getChildByPos",
    value: function getChildByPos(tree, x, y) {
      var list = Object(_common_vd__WEBPACK_IMPORTED_MODULE_8__["_getChildsByPos"])(tree, x, y, []);

      var length = list.length;
      return list[length - 1];
    }
  }, {
    key: "eventHandler",
    value: function eventHandler(eventName) {
      return function touchEventHandler(e) {
        if (this.state === _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].DEACTIVE) {
          return;
        }

        var touch = e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;

        if (!touch.timeStamp) {
          touch.timeStamp = e.timeStamp || Date.now();
        }

        var offsetTop = 0;
        var offsetLeft = 0;

        if (e.target && typeof e.target.getBoundingClientRect === 'function') {
          var _e$target$getBounding = e.target.getBoundingClientRect(),
              top = _e$target$getBounding.top,
              left = _e$target$getBounding.left;

          offsetTop = top;
          offsetLeft = left;
        }

        var event = {};

        for (var k in e) {
          event[k] = e[k];
        }

        var item = touch && this.getChildByPos(this, touch.clientX - offsetLeft, touch.clientY - offsetTop); // log(eventName, 'item', item.className);

        event.item = item;
        event.target = item;
        item && item.emit(eventName, event);

        if (eventName === 'touchstart' || eventName === 'touchend') {
          this.touchMsg[eventName] = touch;
        }

        if (eventName === 'touchend' && Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["isClick"])(this.touchMsg)) {
          // log('emit click event!')
          item && item.emit('click', event);
        }

        if (eventName === 'touchstart') {
          this.startPos = [touch.clientX - offsetLeft, touch.clientY - offsetTop];
          this.pseudoClassManager.addActiveState(item);
        }

        if (eventName === 'touchmove') {
          if (!Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["pointInRect"])([touch.clientX - offsetLeft, touch.clientY - offsetTop], [].concat(_toConsumableArray(item.pos), _toConsumableArray(item.size)))) {
            return;
          }

          var offsetX = touch.clientX - this.startPos[0] - offsetLeft;
          var offsetY = touch.clientY - this.startPos[1] - offsetTop;
          var offsetLength = Math.hypot(offsetX, offsetY);

          if (offsetLength > 5) {}
        }
      };
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this4 = this;

      // log('bindEvents call');
      if (this.hasEventHandler) {
        return;
      } // log('bindEvents call');


      this.hasEventHandler = true;

      this._touchStartHandler = function (e) {
        // log('touch start');
        _this4.touchStart(e);
      };

      this._touchMoveHandler = function (e) {
        _this4.touchMove(e);
      };

      this._touchEndHandler = function (e) {
        // log('touch end');
        _this4.touchEnd(e); // log('before pseudoClassManager clearActiveState');


        _this4.pseudoClassManager.clearActiveState(); // 清除所有:active的状态

      };

      this._touchCancelHandler = function (e) {
        _this4.touchCancel(e);

        _this4.pseudoClassManager.clearActiveState(); // 清除所有:active的状态

      }; // this.canvasContext.addEventListener('mousedown', this._touchStartHandler);
      // this.canvasContext.addEventListener('mouseup', this._touchEndHandler);


      if (typeof wx !== 'undefined') {
        wx.onTouchStart(this.touchStart);
        wx.onTouchMove(this.touchMove);
        wx.onTouchEnd(this.touchEnd);
        wx.onTouchCancel(this.touchCancel);
      } else {
        this.canvasContext.addEventListener('touchstart', this._touchStartHandler);
        this.canvasContext.addEventListener('touchmove', this._touchMoveHandler);
        this.canvasContext.addEventListener('touchend', this._touchEndHandler);
        this.canvasContext.addEventListener('touchcancel', this._touchCancelHandler);
      }
    }
  }, {
    key: "unbindEvents",
    value: function unbindEvents() {
      if (this.hasEventHandler) {
        if (typeof wx !== 'undefined') {
          wx.offTouchStart(this.touchStart);
          wx.offTouchMove(this.touchMove);
          wx.offTouchEnd(this.touchEnd);
          wx.offTouchCancel(this.touchCancel);
        } else {
          this.canvasContext.removeEventListener('touchstart', this._touchStartHandler);
          this.canvasContext.removeEventListener('touchmove', this._touchMoveHandler);
          this.canvasContext.removeEventListener('touchend', this._touchEndHandler);
          this.canvasContext.removeEventListener('touchcancel', this._touchCancelHandler);
        }

        this.hasEventHandler = false;
      }
    }
  }, {
    key: "emit",
    value: function emit(event, data) {
      if (data) {
        data.currentTarget = this;
      }

      this._emitter.emit(event, data);
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      this._emitter.on(event, callback);
    }
  }, {
    key: "once",
    value: function once(event, callback) {
      this._emitter.once(event, callback);
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      this._emitter.off(event, callback);
    }
  }, {
    key: "getElementsByClassName",
    value: function getElementsByClassName(className) {
      return Object(_common_vd__WEBPACK_IMPORTED_MODULE_8__["_getElementsByClassName"])(this, [], className);
    }
  }, {
    key: "getElementById",
    value: function getElementById(id) {
      return Object(_common_vd__WEBPACK_IMPORTED_MODULE_8__["_getElementById"])(this, id);
    }
  }, {
    key: "destroyAll",
    value: function destroyAll(tree) {
      if (!tree) {
        tree = this;
        this.renderContext.release();
      }

      for (var i = 0; i < tree.children.length; i++) {
        var child = tree.children[i];
        child.destroy();
        this.destroyAll(child);
        child.destroySelf && child.destroySelf();
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this5 = this;

      this.unbindEvents();
      this.destroyAll();
      this.textManager.clear();
      this._methods = null;
      this._videos = [];
      this.elementTree = null;
      this.children = [];
      this.layoutTree = {};
      this.state = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].CLEAR;
      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint'].forEach(function (eventName) {
        _this5.off(eventName);
      });
      this.off('reflow');
      this.scrollview = null;
      console.log('layout clear call', this._EE, this._emitter);
    }
  }, {
    key: "clearPool",
    value: function clearPool() {
      this.imgPool.clear(); // this.canvasPool.clear();
    }
  }, {
    key: "clearAll",
    value: function clearAll() {
      this.clear();
      this.clearPool();
    }
  }, {
    key: "loadImgs",
    value: function loadImgs(arr) {
      var _this6 = this;

      arr.forEach(function (src) {
        var img = _this6.canvasContext.createImage ? _this6.canvasContext.createImage() : Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["createImage"])();

        _this6.imgPool.set(src, img);

        img.onload = function () {
          img.loadDone = true;
        };

        img.onloadcbks = [];

        if (img.setSrc) {
          img.setSrc(src);
        } else {
          img.src = src;
        }
      });
    }
    /**
     * 用于jscore里面的context和canvas解绑的时候释放资源
     * 包括canvas/context/image/video等和客户端相关的资源
     */

  }, {
    key: "releaseSource",
    value: function releaseSource() {
      this.unbindEvents();

      this._videos.forEach(function (v) {
        if (v.decoder) {
          v.releaseDecoder();
        }
      }); // this.canvasContext && this.canvasContext.release();


      this.canvasContext = null;
      this.renderContext = null;
      this.imgPool.clear();
    }
    /**
     * 设置和layout相关的上下文，包括canvas，事件绑定，视频离屏canvas，图片
     */

  }, {
    key: "setLayoutContext",
    value: function setLayoutContext(ctx) {
      this.layoutCtx = ctx;
    }
  }, {
    key: "_parseText",
    value: function _parseText(style, value, width, fontSizeRate) {
      value = String(value);
      var maxWidth = width;

      var wordWidth = this._getTextWidth(style, value, fontSizeRate); // 对文字溢出的处理，默认用...


      var textOverflow = style.textOverflow || 'ellipsis'; // 文字最大长度不超限制

      if (wordWidth <= maxWidth) {
        return value;
      } // 对于用点点点处理的情况，先将最大宽度减去...的宽度


      if (textOverflow === 'ellipsis') {
        maxWidth -= this._getTextWidthWithoutSetFont('...', fontSizeRate);
      }

      var length = value.length - 1;
      var str = value.substring(0, length);

      while (this._getTextWidthWithoutSetFont(str, fontSizeRate) > maxWidth && length > 0) {
        length--;
        str = value.substring(0, length);
      }

      return length && textOverflow === 'ellipsis' ? "".concat(str, "...") : str;
    }
  }, {
    key: "_getTextWidthWithoutSetFont",
    value: function _getTextWidthWithoutSetFont(value, fontSizeRate) {
      return this._measureText({}, fontSizeRate)(value).width;
    }
  }, {
    key: "_getTextWidth",
    value: function _getTextWidth(style, value, fontSizeRate) {
      return this._measureText({
        fontWeight: style.fontWeight,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily
      }, fontSizeRate)(value).width;
    }
  }, {
    key: "_measureText",
    value: function _measureText(_ref2) {
      var _this7 = this;

      var fontStyle = _ref2.fontStyle,
          fontWeight = _ref2.fontWeight,
          fontSize = _ref2.fontSize,
          fontFamily = _ref2.fontFamily;
      var fontSizeRate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return function (str) {
        var width = 0;
        var key = "".concat(fontWeight || 'normal', "_").concat((fontSize || 12) * fontSizeRate, "_").concat(fontFamily || _common_util_js__WEBPACK_IMPORTED_MODULE_3__["DEFAULT_FONT_FAMILY"], "_").concat(str);

        if (_common_util_js__WEBPACK_IMPORTED_MODULE_3__["charWidthMap"][key]) {
          width = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["charWidthMap"][key];
        } else {
          // log('new text', key);
          width = _this7.fontManager.measureText(str, fontWeight || 'normal', fontStyle || 'normal', (fontSize || 12) * fontSizeRate, fontFamily || _common_util_js__WEBPACK_IMPORTED_MODULE_3__["DEFAULT_FONT_FAMILY"]) || 0;
          _common_util_js__WEBPACK_IMPORTED_MODULE_3__["charWidthMap"][key] = width;
        }

        return {
          width: width
        };
      };
    }
  }]);

  return _Layout;
}(_components_elements_js__WEBPACK_IMPORTED_MODULE_0__["default"]);

var newInstance = function newInstance(opt) {
  return new _Layout({
    style: {
      width: '100%',
      height: '100%'
    },
    name: 'layout',
    isDarkMode: opt.isDarkMode || function () {
      return false;
    },
    getWidth: opt.getWidth || function () {
      return 0;
    },
    getFontSize: opt.getFontSize || function () {
      return 1;
    },
    getFps: opt.getFps || function () {
      return 0;
    },
    canvasId: opt.canvasId,
    canvasContext: opt.canvasContext,
    fontManager: opt.fontManager,
    getSize: opt.getSize,
    scale: opt.scale
  });
};

/* harmony default export */ __webpack_exports__["default"] = ({
  newInstance: newInstance
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Element; });
/* harmony import */ var _style_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var uuid = 0;

var toEventName = function toEventName(event, id) {
  var elementEvent = ['click', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'scroll'];

  if (elementEvent.indexOf(event) !== -1) {
    return "element-".concat(id, "-").concat(event);
  }

  return "element-".concat(id, "-").concat(event);
};
/* eslint no-param-reassign: ["error", { "props": false }] */

/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */


var Element = /*#__PURE__*/function () {
  function Element(_ref) {
    var _this = this;

    var _ref$styleInit = _ref.styleInit,
        styleInit = _ref$styleInit === void 0 ? {} : _ref$styleInit,
        _ref$styleActive = _ref.styleActive,
        styleActive = _ref$styleActive === void 0 ? {} : _ref$styleActive,
        _ref$styleDarkInit = _ref.styleDarkInit,
        styleDarkInit = _ref$styleDarkInit === void 0 ? {} : _ref$styleDarkInit,
        _ref$styleDarkActive = _ref.styleDarkActive,
        styleDarkActive = _ref$styleDarkActive === void 0 ? {} : _ref$styleDarkActive,
        _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props,
        _ref$dataset = _ref.dataset,
        dataset = _ref$dataset === void 0 ? {} : _ref$dataset,
        _ref$idName = _ref.idName,
        idName = _ref$idName === void 0 ? '' : _ref$idName,
        _ref$className = _ref.className,
        className = _ref$className === void 0 ? '' : _ref$className,
        _ref$id = _ref.id,
        id = _ref$id === void 0 ? uuid += 1 : _ref$id;

    _classCallCheck(this, Element);

    this.children = [];
    this.parent = null;
    this.parentId = 0;
    this.id = id;
    this.props = props;
    this.idName = idName;
    this.className = className;
    this.styleInit = styleInit;
    this.styleActive = styleActive;
    this.styleDarkInit = styleDarkInit;
    this.styleDarkActive = styleDarkActive;
    this.dataset = dataset;
    this.root = null;
    this.isDestroyed = false;
    this.layoutBox = {};
    this.permanentListeners = {}; // 常驻监听

    this.onceListeners = {}; // 单次监听
    // 保存用户写在属性上的style，同时也保存用户通过xxxx.style.xxxx设置的style

    this.styleProp = {}; // 为了让用户修改style的时候，可以触发reflow，这里需要监听style属性的变化，只给用户修改样式的时候使用

    this.styleOrigin = new Proxy({}, {
      set: function set(obj, key, value) {
        if (value !== _this.styleProp[key]) {
          _this.styleProp[key] = value;

          if (_style_js__WEBPACK_IMPORTED_MODULE_0__["reflowStyles"].indexOf(key) > -1) {
            _this.root.emit('reflow');
          } else {
            _this.forceUpdate();
          }
        }

        return true;
      },
      get: function get(obj, key) {
        var isDarkMode = false;

        if (_this.root) {
          isDarkMode = _this.root.isDarkMode();
        } else {
          isDarkMode = _this.isDarkMode();
        }

        if (isDarkMode) {
          return _this.styleProp[key] || _this.styleDarkInit[key] || _this.styleInit[key];
        }

        var res = _this.styleProp[key] || _this.styleInit[key];
        return res;
      }
    });
    this._innerStyle = {};
    this.computedStyle = new Proxy(this._innerStyle, {
      set: function set(obj, key, value) {
        obj[key] = value;
        _this._innerStyle[key] = value;
        return true;
      },
      get: function get(obj, key) {
        var isDarkMode = false;

        if (_this.root) {
          isDarkMode = _this.root.isDarkMode();
        } else {
          isDarkMode = _this.isDarkMode();
        }

        if (isDarkMode) {
          return obj[key] || _this.styleProp[key] || _this.styleDarkInit[key] || _this.styleInit[key];
        }

        return obj[key] || _this.styleProp[key] || _this.styleInit[key];
      }
    });
    Object(_common_util_js__WEBPACK_IMPORTED_MODULE_1__["nextTick"])(function () {
      // 事件冒泡逻辑
      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'scroll'].forEach(function (eventName) {
        _this.EE.on(toEventName(eventName, _this.id), function (e, touchMsg) {
          if (!_this.permanentListeners[eventName]) {
            // 本身没有事件处理器，直接抛给父节点
            _this.parent && _this.parent.emit(eventName, e, touchMsg);
          } else {
            // 有事件处理器，看看有没有阻止冒泡
            var canBubble = true;
            var listeners = _this.permanentListeners[eventName];
            e.currentTarget = _this;

            e.stopPropagation = function () {
              canBubble = false;
            };

            Object.keys(listeners).forEach(function (key) {
              listeners[key](e, touchMsg);
            });

            if (canBubble && _this.parent) {
              _this.parent.emit(eventName, e, touchMsg);
            }
          }
        });
      });

      _this.initRepaint();
    });
  }

  _createClass(Element, [{
    key: "initRepaint",
    value: function initRepaint() {
      var _this2 = this;

      this.on('repaint', function (e) {
        _this2.parent && _this2.parent.emit('repaint', e);
      });
    }
  }, {
    key: "forceUpdate",
    value: function forceUpdate() {
      if (this.parent) {
        var _this$parent;

        (_this$parent = this.parent).forceUpdate.apply(_this$parent, arguments);
      }
    }
  }, {
    key: "repaint",
    value: function repaint() {
      if (this.parent) {
        var _this$parent2;

        (_this$parent2 = this.parent).repaint.apply(_this$parent2, arguments);
      }
    }
  }, {
    key: "_activeTree",
    value: function _activeTree(node) {
      var _this3 = this;

      node._active();

      node.children.forEach(function (child) {
        _this3._activeTree(child);
      });
    }
  }, {
    key: "_deactiveTree",
    value: function _deactiveTree(node) {
      var _this4 = this;

      node._deactive();

      node.children.forEach(function (child) {
        _this4._deactiveTree(child);
      });
    } // 子类填充实现

  }, {
    key: "_active",
    value: function _active() {} // 子类填充实现

  }, {
    key: "_deactive",
    value: function _deactive() {} // 子类填充实现

  }, {
    key: "insert",
    value: function insert() {}
  }, {
    key: "checkNeedRender",
    value: function checkNeedRender() {
      return true;
    } // 子类填充实现

  }, {
    key: "destroy",
    value: function destroy() {
      var _this5 = this;

      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint', 'scroll'].forEach(function (eventName) {
        _this5.off(eventName);
      });
      this.isDestroyed = true;
      this.EE = null;
      this.root = null;
      this.parent = null;
      this.realLayoutBox = null;
      this.layoutBox = null;
      this.props = null;
      this.style = null;

      if (this.renderBoxes) {
        this.renderBoxes = null;
      }
    }
  }, {
    key: "add",
    value: function add(element) {
      element.parent = this;
      element.parentId = this.id;
      this.children.push(element);
    }
  }, {
    key: "remove",
    value: function remove(element) {
      if (!element) {
        return false;
      }

      element.parent = null;
      element.parentId = null;
      var index = this.children.indexOf(element);

      if (index === -1) {
        return false;
      }

      this.children.splice(index, 1);
      return true;
    }
  }, {
    key: "emit",
    value: function emit(event) {
      var _this$EE;

      for (var _len = arguments.length, theArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        theArgs[_key - 1] = arguments[_key];
      }

      this.EE && (_this$EE = this.EE).emit.apply(_this$EE, [toEventName(event, this.id)].concat(theArgs));
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      if (!this.permanentListeners[event]) {
        this.permanentListeners[event] = {};
      }

      this.permanentListeners[event][toEventName(event, this.id)] = callback;
    }
  }, {
    key: "once",
    value: function once(event, callback) {
      this.EE && this.EE.once(toEventName(event, this.id), callback);
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      this.EE && this.EE.off(toEventName(event, this.id), callback);
    }
  }, {
    key: "clip",
    value: function clip(dimension) {
      var _ref2 = dimension || this.getDimension(),
          _ref3 = _slicedToArray(_ref2, 4),
          baseX = _ref3[0],
          baseY = _ref3[1],
          boxWidth = _ref3[2],
          boxHeight = _ref3[3]; // eslint-disable-line


      this.getRoundRectMask(boxWidth, boxHeight);
      this.root.maskCtx.globalCompositeOperation = 'source-out';
      return this.root.maskCtx;
    }
  }, {
    key: "getDimension",
    value: function getDimension() {
      var box = this.layoutBox;
      return [box.absoluteX, box.absoluteY, box.width, box.height];
    }
  }, {
    key: "getRoundRectMask",
    value: function getRoundRectMask(width, height) {
      var canvas = this.root.maskCanvas;
      var ctx = this.root.maskCtx;
      var isDarkMode = this.root.isDarkMode();
      var style = _common_util_js__WEBPACK_IMPORTED_MODULE_1__["getElementStyle"].call(this, isDarkMode);
      var borderRadius = style.borderRadius;
      var borderLeftTopRadius = style.borderLeftTopRadius,
          borderRightTopRadius = style.borderRightTopRadius,
          borderLeftBottomRadius = style.borderLeftBottomRadius,
          borderRightBottomRadius = style.borderRightBottomRadius;

      if (width === 0 || height === 0) {
        return;
      }

      if (this.maskData && width === this.maskData.width && height === this.maskData.height) {
        if (canvas.width !== this.maskData.width) {
          canvas.width = this.maskData.width;
        }

        if (canvas.height !== this.maskData.height) {
          canvas.height = this.maskData.height;
        }

        ctx.putImageData(this.maskData, 0, 0);
        return;
      }

      if (canvas.width !== width) {
        canvas.width = width;
      }

      if (canvas.height !== height) {
        canvas.height = height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      borderLeftTopRadius = borderLeftTopRadius || borderRadius || 0;
      borderRightTopRadius = borderRightTopRadius || borderRadius || 0;
      borderLeftBottomRadius = borderLeftBottomRadius || borderRadius || 0;
      borderRightBottomRadius = borderRightBottomRadius || borderRadius || 0;
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(0, borderLeftTopRadius);
      ctx.arcTo(0, 0, width - borderRightTopRadius, 0, borderLeftTopRadius);
      ctx.arcTo(width, 0, width, height - borderRightBottomRadius, borderRightTopRadius);
      ctx.arcTo(width, height, width - borderLeftBottomRadius, height, borderRightBottomRadius);
      ctx.arcTo(0, height, 0, borderLeftTopRadius, borderLeftBottomRadius);
      ctx.lineTo(0, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, 0);
      ctx.lineTo(0, 0);
      ctx.fill();
      console.log('compute round rect mask!');
      this.maskData = ctx.getImageData(0, 0, width, height);
    }
  }, {
    key: "getBoundingClientRect",
    value: function getBoundingClientRect() {
      // 得到元素的box
      return {
        top: this.layoutBox.absoluteY,
        left: this.layoutBox.absoluteX,
        width: this.layoutBox.width,
        height: this.layoutBox.height
      };
    }
  }, {
    key: "_refreshStyleAfterClassSet",
    value: function _refreshStyleAfterClassSet(className) {
      var _this6 = this;

      var root = this.root;
      this.className = className.join(' ');
      this.styleInit = {};
      this.styleActive = {};
      this.styleDarkInit = {};
      this.styleDarkActive = {};
      className.reduce(function (res, oneClass) {
        return Object.assign(res, root.cssRules[oneClass]);
      }, this.styleInit || {});
      className.reduce(function (res, oneClass) {
        if (root.cssRules["".concat(oneClass, ":active")]) {
          return Object.assign(res, root.cssRules["".concat(oneClass, ":active")]);
        }

        return res;
      }, this.styleActive || {});
      className.reduce(function (res, oneClass) {
        return Object.assign(res, root.cssDarkRules[oneClass]);
      }, this.styleDarkInit || {});
      className.reduce(function (res, oneClass) {
        if (root.cssDarkRules["".concat(oneClass, ":active")]) {
          return Object.assign(res, root.cssDarkRules["".concat(oneClass, ":active")]);
        }

        return res;
      }, this.styleDarkActive || {});
      Object.keys(this.styleProp).forEach(function (prop) {
        _this6.styleInit[prop] = _this6.styleProp[prop];
        _this6.styleDarkInit[prop] = _this6.styleProp[prop];
      });
      this.root.beforeReflow();
      this.root.emit('reflow');
    }
  }, {
    key: "removeClass",
    value: function removeClass(name) {
      // 去除节点的一个class，会导致整个布局重绘
      // console.log('removeClass', this);
      var className = this.className.split(' ');
      var classNameIdx = className.indexOf(name);

      if (classNameIdx > -1) {
        var root = this.root;
        className.splice(classNameIdx, 1);

        this._refreshStyleAfterClassSet(className);
      }
    }
  }, {
    key: "addClass",
    value: function addClass(name) {
      // 给节点加一个class，会导致整个布局重绘
      var className = this.className.split(' ');

      if (className.indexOf(name) === -1) {
        // 是一个新的class
        var root = this.root;
        className.push(name);
        this.className = className.join(' '); // 更新下className

        this._refreshStyleAfterClassSet(className);
      }
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(attr) {
      return this[attr] || null;
    }
  }, {
    key: "EE",
    get: function get() {
      if (this.root) {
        return this.root._EE; // eslint-disable-line
      }

      return this._EE;
    },
    set: function set(val) {// do not remove
    }
  }, {
    key: "renderer",
    get: function get() {
      if (this.root) {
        return this.root.renderContext;
      }

      return this.renderContext;
    }
  }, {
    key: "hasBorderRadius",
    get: function get() {
      var isDarkMode = this.root.isDarkMode();
      var style = _common_util_js__WEBPACK_IMPORTED_MODULE_1__["getElementStyle"].call(this, isDarkMode);
      return style.borderRadius || style.borderLeftBottomRadius || style.borderLeftTopRadius || style.borderRightBottomRadius || style.borderRightTopRadius;
    }
  }, {
    key: "ctx",
    get: function get() {
      if (this.root) {
        return this.root.canvasContext && this.root.canvasContext.ctx;
      }

      return this.canvasContext && this.canvasContext.ctx;
    }
  }, {
    key: "width",
    get: function get() {
      return this.layoutBox.width || 0;
    }
  }, {
    key: "height",
    get: function get() {
      return this.layoutBox.height || 0;
    }
  }, {
    key: "size",
    get: function get() {
      return [this.width, this.height];
    }
  }, {
    key: "x",
    get: function get() {
      return this.layoutBox.absoluteX;
    }
  }, {
    key: "y",
    get: function get() {
      return this.layoutBox.absoluteY;
    }
  }, {
    key: "pos",
    get: function get() {
      return [this.x, this.y];
    }
  }, {
    key: "opacity",
    get: function get() {
      var opacity = 1;

      if (this.style.opacity !== undefined) {
        opacity = this.style.opacity;
      }

      var parent = this.parent;

      while (parent) {
        opacity *= parent.style.opacity !== undefined ? parent.style.opacity : 1;
        parent = parent.parent;
      }

      return opacity;
    }
  }]);

  return Element;
}();



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scalableStyles", function() { return scalableStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "textStyles", function() { return textStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "layoutAffectedStyles", function() { return layoutAffectedStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reflowStyles", function() { return reflowStyles; });
var textStyles = ['color', 'fontSize', 'textAlign', 'fontWeight', 'lineHeight', 'lineBreak'];
var scalableStyles = ['left', 'top', 'right', 'bottom', 'width', 'height', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'fontSize', 'lineHeight', 'borderRadius', 'borderLeftTopRadius', 'borderRightTopRadius', 'borderLeftBottomRadius', 'borderRightBottomRadius', 'borderWidth', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'];
var layoutAffectedStyles = ['margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'width', 'height'];
var reflowStyles = ['display', 'fontSize', 'lineHeight', 'lineBreak', 'left', 'top', 'right', 'bottom', 'width', 'height', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'];


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return throttle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "none", function() { return none; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isClick", function() { return isClick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCanvas", function() { return createCanvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STATE", function() { return STATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_FONT_FAMILY", function() { return DEFAULT_FONT_FAMILY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getContext", function() { return getContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "charWidthMap", function() { return charWidthMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCharMap", function() { return setCharMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dash2camel", function() { return dash2camel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "camel2dash", function() { return camel2dash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nextTick", function() { return nextTick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkIntersect", function() { return checkIntersect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pointInRect", function() { return pointInRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hexToRgb", function() { return hexToRgb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRgba", function() { return getRgba; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getElementStyle", function() { return getElementStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "log", function() { return log; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createImage", function() { return createImage; });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var wx = pluginEnv.customEnv.wx;
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last;
  var deferTimer;
  return function () {
    var context = scope || this;
    var now = +new Date();
    var args = arguments;

    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
/* istanbul ignore next */

function none() {}
/**
 * 根据触摸时长和触摸位置变化来判断是否属于点击事件
 */

function isClick(touchMsg) {
  var start = touchMsg.touchstart;
  var end = touchMsg.touchend;

  if (!start || !end || !start.timeStamp || !end.timeStamp || start.clientX === undefined || start.clientY === undefined || end.clientX === undefined || end.clientY === undefined) {
    return false;
  }

  var startPosX = start.clientX;
  var startPosY = start.clientY;
  var endPosX = end.clientX;
  var endPosY = end.clientY;
  var touchTimes = end.timeStamp - start.timeStamp;
  return !!(Math.abs(endPosY - startPosY) < 30 && Math.abs(endPosX - startPosX) < 30 && touchTimes < 300);
}
function createCanvas() {
  /* istanbul ignore if*/
  if (typeof wx !== "undefined") {
    // 小程序环境
    return wx.createCanvas();
  } else if (typeof document !== 'undefined') {
    // web环境
    return document.createElement('canvas');
  } else {// jscore环境
    // return new NativeGlobal.OffscreenCanvas();
  }
}
var STATE = {
  UNINIT: 0,
  INITED: 1,
  RENDERED: 2,
  CLEAR: 3,
  DEACTIVE: 4
};
var DEFAULT_FONT_FAMILY = 'sans-serif';
var context = null;
var getContext = function getContext() {
  if (context) {
    return context;
  }

  var canvas = createCanvas(); // eslint-disable-line

  if (canvas) {
    canvas.width = 1;
    canvas.height = 1;
    context = canvas.getContext('2d', {
      alpha: true
    });
  }

  return context;
};
var charWidthMap = {}; // 搞一个字符长度map表，用来存下不同字段的长度

function setCharMap(map) {
  charWidthMap = Object.assign(charWidthMap, map);
}
function dash2camel(input) {
  return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
    return group1.toUpperCase();
  });
}
function camel2dash(input) {
  return input.replace(/[A-Z]/g, function (m) {
    return "-".concat(m.toLowerCase());
  });
}
function nextTick(cb) {
  return Promise.resolve().then(cb);
}
function checkIntersect(RectA, RectB) {
  return !(RectB.right <= RectA.left || RectB.left >= RectA.right || RectB.bottom <= RectA.top || RectB.top >= RectA.bottom);
}
function pointInRect(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 2),
      x = _ref3[0],
      y = _ref3[1];

  var _ref4 = _slicedToArray(_ref2, 4),
      rX = _ref4[0],
      rY = _ref4[1],
      w = _ref4[2],
      h = _ref4[3];

  return rX <= x && x <= rX + w && rY <= y && y <= rY + h;
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function getRgba(hex, opacity) {
  var rgbObj = hexToRgb(hex);
  var o = opacity;

  if (opacity === undefined) {
    o = 1;
  }

  return "rgba(".concat(rgbObj.r, ", ").concat(rgbObj.g, ", ").concat(rgbObj.b, ", ").concat(o, ")");
}
function getElementStyle(isDarkMode) {
  var needInnerStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var style = isDarkMode ? Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp) : Object.assign({}, this.styleInit, this.styleProp);

  if (needInnerStyle) {
    Object.assign(style, this._innerStyle);
  }

  return style;
}
function log() {
  console.log.apply(null, arguments);
}
function createImage() {
  /* istanbul ignore if*/
  if (typeof wx !== "undefined") {
    return wx.createImage();
  } else {
    return document.createElement('img');
  }
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Pool; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pool = /*#__PURE__*/function () {
  function Pool() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'pool';

    _classCallCheck(this, Pool);

    this.name = name;
    this.pool = {};
  }

  _createClass(Pool, [{
    key: "get",
    value: function get(key) {
      return this.pool[key];
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this.pool[key] = value;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.pool = {};
    }
  }]);

  return Pool;
}();



/***/ }),
/* 5 */
/***/ (function(module, exports) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;
module.exports.TinyEmitter = E;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nodeToJson = __webpack_require__(7);

var xmlToNodeobj = __webpack_require__(9);

var x2xmlnode = __webpack_require__(9);

var buildOptions = __webpack_require__(8).buildOptions; // const validator = require('./validator');


exports.parse = function (xmlData, options, validationOption) {
  if (validationOption) {
    if (validationOption === true) validationOption = {}; //  const result = validator.validate(xmlData, validationOption);
    //  if (result !== true) {
    //    throw Error( result.err.msg)
    //  }
  }

  options = buildOptions(options, x2xmlnode.defaultOptions, x2xmlnode.props);
  return nodeToJson.convertToJson(xmlToNodeobj.getTraversalObj(xmlData, options), options);
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(8);

var convertToJson = function convertToJson(node, options) {
  var jObj = {
    name: node.tagname
  }; //when no child node or attr is present

  if ((!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
    return util.isExist(node.val) && !!node.val ? node.val : jObj;
  } else {
    //otherwise create a textnode if node has some text
    if (util.isExist(node.val)) {
      if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
        if (options.arrayMode === "strict") {
          jObj[options.textNodeName] = [node.val];
        } else {
          jObj[options.textNodeName] = node.val;
        }
      }
    }
  }

  util.merge(jObj, node.attrsMap, options.arrayMode);
  jObj.children = [];
  node.children.forEach(function (child) {
    jObj.children.push(convertToJson(child, options));
  }); // const keys = Object.keys(node.child);
  // for (let index = 0; index < keys.length; index++) {
  //   var tagname = keys[index];
  //   if (node.child[tagname] && node.child[tagname].length > 1) {
  //     jObj[tagname] = [];
  //     for (var tag in node.child[tagname]) {
  //       jObj[tagname].push(convertToJson(node.child[tagname][tag], options));
  //     }
  //   } else {
  //     if(options.arrayMode === true){
  //       const result = convertToJson(node.child[tagname][0], options)
  //       if(typeof result === 'object')
  //         jObj[tagname] = [ result ];
  //       else
  //         jObj[tagname] = result;
  //     }else if(options.arrayMode === "strict"){
  //       jObj[tagname] = [convertToJson(node.child[tagname][0], options) ];
  //     }else{
  //       jObj[tagname] = convertToJson(node.child[tagname][0], options);
  //     }
  //   }
  // }
  //add value

  return jObj;
};

exports.convertToJson = convertToJson;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getAllMatches = function getAllMatches(string, regex) {
  var matches = [];
  var match = regex.exec(string);

  while (match) {
    var allmatches = [];
    var len = match.length;

    for (var index = 0; index < len; index++) {
      allmatches.push(match[index]);
    }

    matches.push(allmatches);
    match = regex.exec(string);
  }

  return matches;
};

var doesMatch = function doesMatch(string, regex) {
  var match = regex.exec(string);
  return !(match === null || typeof match === 'undefined');
};

var doesNotMatch = function doesNotMatch(string, regex) {
  return !doesMatch(string, regex);
};

exports.isExist = function (v) {
  return typeof v !== 'undefined';
};

exports.isEmptyObject = function (obj) {
  return Object.keys(obj).length === 0;
};
/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} a
 */


exports.merge = function (target, a, arrayMode) {
  if (a) {
    var keys = Object.keys(a); // will return an array of own properties

    var len = keys.length; // don't make it inline

    for (var i = 0; i < len; i++) {
      if (arrayMode === 'strict') {
        target[keys[i]] = [a[keys[i]]];
      } else {
        target[keys[i]] = a[keys[i]];
      }
    }
  }
};
/* exports.merge =function (b,a){
  return Object.assign(b,a);
} */


exports.getValue = function (v) {
  if (exports.isExist(v)) {
    return v;
  }

  return '';
}; // const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};


exports.buildOptions = function (options, defaultOptions, props) {
  var newOptions = {};

  if (!options) {
    return defaultOptions; // if there are not options
  }

  for (var i = 0; i < props.length; i++) {
    if (options[props[i]] !== undefined) {
      newOptions[props[i]] = options[props[i]];
    } else {
      newOptions[props[i]] = defaultOptions[props[i]];
    }
  }

  return newOptions;
};

exports.doesMatch = doesMatch;
exports.doesNotMatch = doesNotMatch;
exports.getAllMatches = getAllMatches;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(8);

var _require = __webpack_require__(8),
    buildOptions = _require.buildOptions;

var XmlNode = __webpack_require__(10);

var TagType = {
  OPENING: 1,
  CLOSING: 2,
  SELF: 3,
  CDATA: 4
};
var regx = '<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|(([\\w:\\-._]*:)?([\\w:\\-._]+))([^>]*)>|((\\/)(([\\w:\\-._]*:)?([\\w:\\-._]+))\\s*>))([^<]*)'; // const tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
// const tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");
// polyfill

if (!Number.parseInt && window.parseInt) {
  Number.parseInt = window.parseInt;
}

if (!Number.parseFloat && window.parseFloat) {
  Number.parseFloat = window.parseFloat;
}

var defaultOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: false,
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  // a tag can have attributes without any value
  // ignoreRootElement : false,
  parseNodeValue: true,
  parseAttributeValue: false,
  arrayMode: false,
  trimValues: true,
  // Trim string values of tag and attributes
  cdataTagName: false,
  cdataPositionChar: '\\c',
  localeRange: '',
  tagValueProcessor: function tagValueProcessor(a) {
    return a;
  },
  attrValueProcessor: function attrValueProcessor(a) {
    return a;
  },
  stopNodes: [] // decodeStrict: false,

};
exports.defaultOptions = defaultOptions;
var props = ['attributeNamePrefix', 'attrNodeName', 'textNodeName', 'ignoreAttributes', 'ignoreNameSpace', 'allowBooleanAttributes', 'parseNodeValue', 'parseAttributeValue', 'arrayMode', 'trimValues', 'cdataTagName', 'cdataPositionChar', 'localeRange', 'tagValueProcessor', 'attrValueProcessor', 'parseTrueNumberOnly', 'stopNodes'];
exports.props = props;

var getTraversalObj = function getTraversalObj(xmlData, options) {
  options = buildOptions(options, defaultOptions, props); // xmlData = xmlData.replace(/\r?\n/g, " ");//make it single line

  xmlData = xmlData.replace(/<!--[\s\S]*?-->/g, ''); // Remove  comments

  var xmlObj = new XmlNode('!xml');
  var currentNode = xmlObj;
  regx = regx.replace(/\[\\w/g, "[".concat(options.localeRange, "\\w"));
  var tagsRegx = new RegExp(regx, 'g');
  var tag = tagsRegx.exec(xmlData);
  var nextTag = tagsRegx.exec(xmlData);

  while (tag) {
    var tagType = checkForTagType(tag);

    if (tagType === TagType.CLOSING) {
      // add parsed data to parent node
      if (currentNode.parent && tag[14]) {
        currentNode.parent.val = "".concat(util.getValue(currentNode.parent.val)).concat(processTagValue(tag, options, currentNode.parent.tagname));
      }

      if (options.stopNodes.length && options.stopNodes.includes(currentNode.tagname)) {
        currentNode.child = [];

        if (currentNode.attrsMap == undefined) {
          currentNode.attrsMap = {};
        }

        currentNode.val = xmlData.substr(currentNode.startIndex + 1, tag.index - currentNode.startIndex - 1);
      }

      currentNode = currentNode.parent;
    } else if (tagType === TagType.CDATA) {
      if (options.cdataTagName) {
        // add cdata node
        var childNode = new XmlNode(options.cdataTagName, currentNode, tag[3]);
        childNode.attrsMap = buildAttributesMap(tag[8], options);
        currentNode.addChild(childNode); // for backtracking

        currentNode.val = util.getValue(currentNode.val) + options.cdataPositionChar; // add rest value to parent node

        if (tag[14]) {
          currentNode.val += processTagValue(tag, options);
        }
      } else {
        currentNode.val = (currentNode.val || '') + (tag[3] || '') + processTagValue(tag, options);
      }
    } else if (tagType === TagType.SELF) {
      if (currentNode && tag[14]) {
        currentNode.val = "".concat(util.getValue(currentNode.val)).concat(processTagValue(tag, options));
      }

      var _childNode = new XmlNode(options.ignoreNameSpace ? tag[7] : tag[5], currentNode, '');

      if (tag[8] && tag[8].length > 0) {
        tag[8] = tag[8].substr(0, tag[8].length - 1);
      }

      _childNode.attrsMap = buildAttributesMap(tag[8], options);
      currentNode.addChild(_childNode);
    } else {
      // TagType.OPENING
      var _childNode2 = new XmlNode(options.ignoreNameSpace ? tag[7] : tag[5], currentNode, processTagValue(tag, options));

      if (options.stopNodes.length && options.stopNodes.includes(_childNode2.tagname)) {
        _childNode2.startIndex = tag.index + tag[1].length;
      }

      _childNode2.attrsMap = buildAttributesMap(tag[8], options);
      currentNode.addChild(_childNode2);
      currentNode = _childNode2;
    }

    tag = nextTag;
    nextTag = tagsRegx.exec(xmlData);
  }

  return xmlObj;
};

function processTagValue(parsedTags, options, parentTagName) {
  var tagName = parsedTags[7] || parentTagName;
  var val = parsedTags[14];

  if (val) {
    if (options.trimValues) {
      val = val.trim();
    }

    val = options.tagValueProcessor(val, tagName);
    val = parseValue(val, options.parseNodeValue, options.parseTrueNumberOnly);
  }

  return val;
}

function checkForTagType(match) {
  if (match[4] === ']]>') {
    return TagType.CDATA;
  }

  if (match[10] === '/') {
    return TagType.CLOSING;
  }

  if (typeof match[8] !== 'undefined' && match[8].substr(match[8].length - 1) === '/') {
    return TagType.SELF;
  }

  return TagType.OPENING;
}

function resolveNameSpace(tagname, options) {
  if (options.ignoreNameSpace) {
    var tags = tagname.split(':');
    var prefix = tagname.charAt(0) === '/' ? '/' : '';

    if (tags[0] === 'xmlns') {
      return '';
    }

    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }

  return tagname;
}

function parseValue(val, shouldParse, parseTrueNumberOnly) {
  if (shouldParse && typeof val === 'string') {
    var parsed;

    if (val.trim() === '' || isNaN(val)) {
      parsed = val === 'true' ? true : val === 'false' ? false : val;
    } else {
      if (val.indexOf('0x') !== -1) {
        // support hexa decimal
        parsed = Number.parseInt(val, 16);
      } else if (val.indexOf('.') !== -1) {
        parsed = Number.parseFloat(val);
      } else {
        parsed = Number.parseInt(val, 10);
      }

      if (parseTrueNumberOnly) {
        parsed = String(parsed) === val ? parsed : val;
      }
    }

    return parsed;
  }

  if (util.isExist(val)) {
    return val;
  }

  return '';
} // TODO: change regex to capture NS
// const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");


var attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?', 'g');

function buildAttributesMap(attrStr, options) {
  if (!options.ignoreAttributes && typeof attrStr === 'string') {
    attrStr = attrStr.replace(/\r?\n/g, ' '); // attrStr = attrStr || attrStr.trim();

    var matches = util.getAllMatches(attrStr, attrsRegx);
    var len = matches.length; // don't make it inline

    var attrs = {};

    for (var i = 0; i < len; i++) {
      var attrName = resolveNameSpace(matches[i][1], options);

      if (attrName.length) {
        if (matches[i][4] !== undefined) {
          if (options.trimValues) {
            matches[i][4] = matches[i][4].trim();
          }

          matches[i][4] = options.attrValueProcessor(matches[i][4], attrName);
          attrs[options.attributeNamePrefix + attrName] = parseValue(matches[i][4], options.parseAttributeValue, options.parseTrueNumberOnly);
        } else if (options.allowBooleanAttributes) {
          attrs[options.attributeNamePrefix + attrName] = true;
        }
      }
    }

    if (!Object.keys(attrs).length) {
      return;
    }

    if (options.attrNodeName) {
      var attrCollection = {};
      attrCollection[options.attrNodeName] = attrs;
      return attrCollection;
    }

    return attrs;
  }
}

exports.getTraversalObj = getTraversalObj;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (tagname, parent, val) {
  this.tagname = tagname;
  this.parent = parent;
  this.child = {}; //child tags

  this.attrsMap = {}; //attributes map

  this.children = [];
  this.val = val; //text only

  this.addChild = function (child) {
    this.children.push(child);

    if (Array.isArray(this.child[child.tagname])) {
      //already presents
      this.child[child.tagname].push(child);
    } else {
      this.child[child.tagname] = [child];
    }
  };
};

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 伪类处理器
 */
var activeNodeMap = {};
var innerStyleMap = {};

function getAlpha(rgba) {
  var rgb = rgba.match(/(\d(\.\d+)?)+/g);

  if (!rgb[3]) {
    // 如果省略alpha参数，默认为1
    rgb[3] === 1;
  } else if (rgba[3].indexOf('.') === 0) {
    // 如果省略0，要补一个
    rgb[3] = "0".concat(rgb[3]);
  }

  return rgb[3] * 1;
}

function changeStateTrans(item, activeStyle) {
  console.log('changeStateTrans', item); // 先保存_innerStyle中的状态，方便clear的时候恢复

  innerStyleMap[item.id] = Object.assign({}, item._innerStyle);

  if (activeStyle.backgroundColor) {
    item.computedStyle.backgroundColor = activeStyle.backgroundColor; // 改了backgroundColor后，需要更新下glRect的内容

    item.glRect.setBackgroundColor(activeStyle.backgroundColor);
  }

  if (activeStyle.color) {
    item.computedStyle.color = activeStyle.backgroundColor;
  }

  item.root.forceUpdate();

  if (activeStyle.backgroundColor && !(activeStyle.backgroundColor.indexOf('rgba') > -1 && getAlpha(activeStyle.backgroundColor) !== 1)) {
    if (item.children) {
      for (var i = 0; i < item.children.length; i++) {
        item.children[i].repaint();
      }
    }
  }
}

function clearActiveStateTrans(item, isDarkMode) {
  var innerStyle = innerStyleMap[item.id] || {};
  item._innerStyle = Object.assign({}, innerStyle);
  var computedStyle = isDarkMode ? Object.assign({}, item.styleInit, item.styleDarkInit, item.styleProp, item._innerStyle) : Object.assign({}, item.styleInit, item.styleProp, item._innerStyle);
  item.updateRenderData && item.updateRenderData(computedStyle);
}

function getNodeAll(node) {
  var ret = [node];

  if (node.children) {
    for (var key in node.children) {
      ret = ret.concat(getNodeAll(node.children[key]));
    }
  }

  return ret;
}
/**
 * 伪类的处理不应该直接操作computedStyle，需要节点映射前后的样式
 */


var PseudoClassManager = /*#__PURE__*/function () {
  function PseudoClassManager(layout) {
    _classCallCheck(this, PseudoClassManager);

    this.activeNode = []; // 定义了active伪类的节点

    this.layout = layout;
  }

  _createClass(PseudoClassManager, [{
    key: "addActiveState",
    value: function addActiveState(node) {
      if (node === null) {
        return;
      }

      if (this.layout.isDarkMode()) {
        // darkmode的时候
        if (node.hasActiveStyle || node.hasDarkActiveStyle) {
          var styleActive = node.styleActive || {};

          if (node.hasDarkActiveStyle) {
            styleActive = Object.assign({}, styleActive, node.styleDarkActive);
          }

          node.isActive = true;
          changeStateTrans(node, styleActive);
        }
      } else {
        // 非darkmode的时候，直接拿active的样式出来处理
        if (node.hasActiveStyle) {
          node.isActive = true;
          changeStateTrans(node, node.styleActive);
        }
      }

      this.addActiveState(node.parent);
    }
  }, {
    key: "clearActiveState",
    value: function clearActiveState(node) {
      // 清除active状态，还原成init的时候的style
      console.log('clearActiveState call');
      var isDarkMode = this.layout.isDarkMode();

      if (node) {
        clearActiveStateTrans(node, isDarkMode);
        node.isActive = false;
        return;
      }

      var nodes = this.activeNode;
      var needForceUpdate = false;

      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].isActive) {
          console.log('node is active', nodes[i].className);
          clearActiveStateTrans(nodes[i], isDarkMode);
          nodes[i].isActive = false;
          needForceUpdate = true;
        }
      }

      if (needForceUpdate) {
        // 有节点从active发生了改变，才执行重新渲染
        this.layout.forceUpdate();
      }
    }
  }, {
    key: "addActiveNode",
    value: function addActiveNode(node) {
      this.activeNode.push(node);
      activeNodeMap[node.id] = getNodeAll(node);
    }
  }]);

  return PseudoClassManager;
}();

/* harmony default export */ __webpack_exports__["default"] = (PseudoClassManager);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var finder = function finder(t, w, arr, measure) {
  var start = 0;
  var end = t.length - 1;
  var mid = Math.floor((start + end + 1) / 2);

  if (measure(t).width < w) {
    arr.push(t);
    return -1;
  }

  if (measure(t[0]).width > w) {
    return -1;
  }

  while (start < end) {
    var str = t.substring(0, mid);

    if (measure(str).width < w) {
      start = mid;
    } else {
      end = mid - 1;
    }

    mid = Math.floor((start + end + 1) / 2);
  }

  arr.push(t.substring(0, mid));
  return mid;
};

var TextManager = /*#__PURE__*/function () {
  function TextManager(layout) {
    _classCallCheck(this, TextManager);

    this.layout = layout;
    this.textNodes = [];
    this.hasUpdate = false;
  }
  /**
   * 搜集文本节点
   * @param {Object} node
   */


  _createClass(TextManager, [{
    key: "addTextNode",
    value: function addTextNode(node) {
      this.textNodes.push(node);
    }
    /**
     * 更新下文本节点的布局box
     */

  }, {
    key: "updateTextNodeLayoutBox",
    value: function updateTextNodeLayoutBox() {
      var isDarkMode = this.layout.isDarkMode();

      for (var i = 0; i < this.textNodes.length; i++) {
        var node = this.textNodes[i];
        var style = _util__WEBPACK_IMPORTED_MODULE_0__["getElementStyle"].call(node, isDarkMode, false);
        node.valueBreak = [];

        var measure = this.layout._measureText({
          fontWeight: style.fontWeight || null,
          fontSize: style.fontSize || null,
          fontFamily: style.fontFamily || null
        }, node.root.getFontSize());

        var maxWidth = style.width || node.parent.layoutBox.width; // if (node.noWrapWidth > node.parent.layoutBox.width) { // 文本的宽度大于父节点的宽度，需要给文本换行

        if (measure(node.valueInit).width > maxWidth) {
          // 文本的宽度大于父节点的宽度，需要给文本换行
          var dotWidth = measure('...').width;
          var nodeTextArray = this.getSubText(node.valueInit, maxWidth, {
            fontWeight: style.fontWeight || null,
            fontSize: style.fontSize || null,
            fontFamily: style.fontFamily || null
          }, node.root.getFontSize()); // console.log(nodeTextArray)

          if (style.textOverflow === 'ellipsis' && style.whiteSpace === 'nowrap') {
            // 单行溢出...
            var t = nodeTextArray[0] || ''; // 取截断后的第一个文本片段

            var length = t.length;
            var str = t.substring(0, length);

            while (measure(str).width > maxWidth - dotWidth && length > 0) {
              length -= 1;
              str = t.substring(0, length);
            }

            node.valueBreak = ["".concat(str, "...")];
          } else if (style.textOverflow === 'ellipsis' && style.lineClamp * 1 > 0) {
            // 多行溢出...
            if (nodeTextArray.length > style.lineClamp) {
              // 行数超过了
              node.valueBreak = nodeTextArray.slice(0, style.lineClamp); // 最后一行变成...

              var _t = node.valueBreak[node.valueBreak.length - 1];
              var _length = _t.length;

              var _str = _t.substring(0, _length);

              while (measure(_str).width > maxWidth - dotWidth && _length > 0) {
                _length -= 1;
                _str = _t.substring(0, _length);
              }

              node.valueBreak[node.valueBreak.length - 1] = "".concat(_str, "...");
            } else {
              // 行数没超过
              node.valueBreak = nodeTextArray;
            }
          } else {
            // 默认不做处理，默认显示多行
            node.valueBreak = nodeTextArray;
          }

          node.computedStyle.width = maxWidth;
          node.yogaNode.setWidth(maxWidth);

          if (style.whiteSpace !== 'nowrap') {
            node.computedStyle.height = (style.lineHeight || style.fontSize) * node.valueBreak.length;
            node.yogaNode.setHeight((style.lineHeight || style.fontSize) * node.valueBreak.length);
          }
        }
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.textNodes = [];
      this.hasUpdate = false;
    }
  }, {
    key: "getSubText",
    value: function getSubText(text, width, _ref, fontSizeRate) {
      var fontWeight = _ref.fontWeight,
          fontSize = _ref.fontSize,
          fontFamily = _ref.fontFamily;

      var measure = this.layout._measureText({
        fontWeight: fontWeight,
        fontSize: fontSize,
        fontFamily: fontFamily
      }, fontSizeRate);

      var textArray = [];
      var m = 0;
      var _text = text;

      while ((m = finder(_text, width, textArray, measure)) > -1) {
        _text = _text.substring(m, _text.length);
      } // console.log(textArray)


      return textArray;
    }
  }]);

  return TextManager;
}();

/* harmony default export */ __webpack_exports__["default"] = (TextManager);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RenderContextManager; });
/* harmony import */ var _renderer_gl_rect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _renderer_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18);
/* harmony import */ var _common_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _renderContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var wx = pluginEnv.customEnv.wx;
/**
 * @description 逻辑线程渲染管理器，用于搜集每个节点需要的渲染数据
 */



function createCanvas() {
  return wx.createCanvas();
}

var canvasPool = [];
var renderer;

var RenderContextManager = /*#__PURE__*/function () {
  function RenderContextManager(canvasContext) {
    var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    _classCallCheck(this, RenderContextManager);

    this.canvasContext = canvasContext;
    this.glRects = [];
    this.scale = scale;
    this.width = 0;
    this.height = 0;
    renderer = Object(_renderer_util_js__WEBPACK_IMPORTED_MODULE_1__["createRender"])({
      dpr: scale,
      createImage: _common_util__WEBPACK_IMPORTED_MODULE_2__["createImage"],
      createCanvas: createCanvas
    });
    this.layout = null;
    this.scrollRenderer = Object(_renderer_util_js__WEBPACK_IMPORTED_MODULE_1__["createRender"])({
      dpr: scale,
      createCanvas: createCanvas,
      createImage: _common_util__WEBPACK_IMPORTED_MODULE_2__["createImage"]
    });
    var canvas = canvasPool.pop() || createCanvas();
    this.scrollCanvas = canvas;
    console.log('scrollcanvas', canvas);
    this.hasSetup = false;
    this.gl = null;
    this.scrollGl = null;
    this.hasScroll = false;
  }

  _createClass(RenderContextManager, [{
    key: "setupScrollGl",
    value: function setupScrollGl() {
      if (!this.scrollCanvas) {
        this.scrollCanvas = canvasPool.pop() || createCanvas();
      }

      var gl = Object(_renderer_gl_rect_js__WEBPACK_IMPORTED_MODULE_0__["setupGl"])(this.scrollCanvas, false);
      gl.canvas.height = this.height;
      gl.canvas.width = this.width;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
      this.scrollGl = gl;
      this.layout.scrollview.glRect.glTexture = this.scrollCanvas;
    }
  }, {
    key: "createRoundRect",
    value: function createRoundRect(id, type) {
      var glRect = new _renderContext__WEBPACK_IMPORTED_MODULE_3__["default"](id, type);
      this.glRects.push(glRect);
      return glRect;
    }
    /**
     * @description 清空数据
     */

  }, {
    key: "clear",
    value: function clear() {
      // console.log('clear call');
      this.glRects = this.glRects.slice(0, 0);
    }
  }, {
    key: "release",
    value: function release() {
      canvasPool.push(this.scrollCanvas);
      this.scrollCanvas = null;
      console.log('renderContext release call');
    }
  }, {
    key: "getChildrenGlRects",
    value: function getChildrenGlRects(node) {
      var _this = this;

      var res = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (node !== this.layout.scrollview && node.glRect) {
        var index = this.glRects.indexOf(node.glRect);
        this.glRects.splice(index, 1);
        res.push(node.glRect);
      }

      node.children.forEach(function (child) {
        _this.getChildrenGlRects(child, res);
      });
      return res;
    }
    /**
     * @description 传递数据给渲染线程
     */

  }, {
    key: "draw",
    value: function draw() {
      var needInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!this.hasSetup || needInit) {
        this.hasSetup = true;
        var gl = Object(_renderer_gl_rect_js__WEBPACK_IMPORTED_MODULE_0__["setupGl"])(this.canvasContext.canvas, false);
        gl.canvas.height = this.height;
        gl.canvas.width = this.width;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        this.gl = gl;
        console.log(this.glRects.filter(function (item) {
          return item.type === 'Text' || item.type === 'Image';
        }));

        if (this.layout.scrollview) {
          this.hasScroll = true;
          this.scrollGlrects = [];
          this.getChildrenGlRects(this.layout.scrollview, this.scrollGlrects);
        }
      }

      renderer.repaint(this.gl, this.glRects, this.scrollGlrects);
    }
  }]);

  return RenderContextManager;
}();



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoundRect", function() { return RoundRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setupGl", function() { return setupGl; });
/* harmony import */ var _m4_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _roundedRect_vert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16);
/* harmony import */ var _roundedRect_frag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(17);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



 // 创建纹理

function createTexture(gl) {
  var texId = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texId); // 设置参数，让我们可以绘制任何尺寸的图像

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  return texId;
}

var positions = new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]);
var textureMap = new WeakMap();

function createProgram(gl) {
  var program;
  var bufferId;
  var uResolution;
  var uRadius;
  var uBorderWidth;
  var uBorderColor;
  var uColor;
  var uMatrix;
  var uRect;
  var uTexRect;
  var uBitset;
  var uTex;
  var vPosition;
  var textureMatrixLocation;
  var uOpacity;
  {
    gl.enable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendEquation(gl.FUNC_ADD);
    // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE); // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  }
  {
    // program
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, _roundedRect_vert__WEBPACK_IMPORTED_MODULE_1__["default"]);
    gl.compileShader(vertexShader);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, _roundedRect_frag__WEBPACK_IMPORTED_MODULE_2__["default"]);
    gl.compileShader(fragmentShader);
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
  }
  {
    // 变量
    uRadius = gl.getUniformLocation(program, 'u_radius');
    uBorderWidth = gl.getUniformLocation(program, 'u_border_width');
    uBorderColor = gl.getUniformLocation(program, 'u_border_color');
    uOpacity = gl.getUniformLocation(program, 'u_opacity');
    uColor = gl.getUniformLocation(program, 'u_color');
    uMatrix = gl.getUniformLocation(program, 'u_matrix');
    uRect = gl.getUniformLocation(program, 'u_rect');
    uTexRect = gl.getUniformLocation(program, 'u_tex_rect');
    uBitset = gl.getUniformLocation(program, 'u_bitset');
    uResolution = gl.getUniformLocation(program, 'u_resolution');
    uTex = gl.getUniformLocation(program, 'u_texture');
    textureMatrixLocation = gl.getUniformLocation(program, 'u_textureMatrix');
    vPosition = gl.getAttribLocation(program, 'a_position');
  }
  {
    // VBO
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW); // vertexAttribPointer几个参数解释：
    // 每次迭代运行提取两个单位数据
    // 每个单位的数据类型是32位浮点型
    // 不需要归一化数据
    // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    // 每次迭代运行运动多少内存到下一个数据开始点
    // 从缓冲起始位置开始读取

    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
  }
  gl.useProgram(program);
  return {
    program: program,
    bufferId: bufferId,
    uResolution: uResolution,
    uRadius: uRadius,
    uBorderWidth: uBorderWidth,
    uBorderColor: uBorderColor,
    uColor: uColor,
    uMatrix: uMatrix,
    uRect: uRect,
    uTexRect: uTexRect,
    uBitset: uBitset,
    uTex: uTex,
    vPosition: vPosition,
    textureMatrixLocation: textureMatrixLocation,
    textureMap: textureMap,
    positions: positions,
    uOpacity: uOpacity
  };
}

var RoundRect = /*#__PURE__*/function () {
  function RoundRect(gl) {
    _classCallCheck(this, RoundRect);

    this.gl = gl;
    this.reset();
  }

  _createClass(RoundRect, [{
    key: "reset",
    value: function reset() {
      this.x = 0;
      this.y = 0;
      this.width = 1;
      this.height = 1;
      this.radius = [0, 0, 0, 0];
      this.backgroundColor = [0, 0, 0, 0];
      this.backgroundImage = undefined;
      this.backgroundImageData = undefined;
      this.imageRect = [];
      this.imageSrcRect = [];
      this.borderWidth = 0;
      this.borderColor = [0, 0, 0, 0];
      this.imageWidth = 1;
      this.imageHeight = 1;
      this.texMatrix = Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["translation"])(0, 0, 0);
      this.canvasWidth = 0;
      this.canvasHeight = 0;
      this.matrix = Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["identity"])();
      this.texMatrix = Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["translation"])(0, 0, 0);
    }
  }, {
    key: "updateContours",
    value: function updateContours(dimension) {
      this.x = dimension[0];
      this.y = dimension[1];
      this.width = dimension[2];
      this.height = dimension[3];
    }
  }, {
    key: "updateViewPort",
    value: function updateViewPort() {
      var gl = this.gl;
      var canvasWidth = this.canvasWidth;
      var canvasHeight = this.canvasHeight;

      if (canvasWidth !== gl.canvas.width || canvasHeight !== gl.canvas.height) {
        canvasWidth !== gl.canvas.width && (canvasWidth = gl.canvas.width);
        canvasHeight !== gl.canvas.height && (canvasHeight = gl.canvas.height);
        Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["orthographic"])(0, gl.canvas.width, gl.canvas.height, 0, -1, 1, this.matrix);
        Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["translate"])(this.matrix, this.x, this.y, 0, this.matrix);
        Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["scale"])(this.matrix, this.width, this.height, 1, this.matrix);
        /*this.canvasWidth = gl.canvas.width;
        this.canvasHeight = gl.canvas.height;*/
      }
    }
  }, {
    key: "setRadius",
    value: function setRadius(r) {
      if (typeof r === 'number') {
        this.radius = [r, r, r, r];
      } else {
        this.radius = r;
      }
    }
  }, {
    key: "setBorder",
    value: function setBorder(width, color) {
      this.borderWidth = width;
      this.borderColor = color;
    }
  }, {
    key: "setBackgroundColor",
    value: function setBackgroundColor(color) {
      this.backgroundColor = color;
    }
  }, {
    key: "setOpacity",
    value: function setOpacity() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.opacity = value;
    }
  }, {
    key: "setTexture",
    value: function setTexture() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          image = _ref.image,
          rect = _ref.rect,
          srcRect = _ref.srcRect;

      if (!rect) {
        rect = [0, 0, this.width, this.height];
      }

      this.backgroundImage = image;
      this.imageWidth = image.width;
      this.imageHeight = image.height;
      this.imageRect = rect;
      this.imageSrcRect = srcRect || [0, 0, image.width, image.height];
      this.setTexMatrix();
    }
  }, {
    key: "setTextureData",
    value: function setTextureData() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          imageData = _ref2.imageData,
          tWidth = _ref2.width,
          tHeight = _ref2.height,
          rect = _ref2.rect,
          srcRect = _ref2.srcRect;

      if (!rect) {
        rect = [0, 0, this.width, this.height];
      }

      this.backgroundImageData = imageData;
      this.imageWidth = tWidth;
      this.imageHeight = tHeight;
      this.imageRect = rect;
      this.imageSrcRect = srcRect || [0, 0, tWidth, tHeight];
      this.setTexMatrix();
    }
  }, {
    key: "setTexMatrix",
    value: function setTexMatrix() {
      var srcX = this.imageSrcRect[0] || 0;
      var srcY = this.imageSrcRect[1] || 0;
      var srcWidth = this.imageSrcRect[2] || this.imageWidth;
      var srcHeight = this.imageSrcRect[3] || this.imageHeight;
      Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["translation"])(srcX / this.imageWidth, srcY / this.imageHeight, this.texMatrix);
      Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["scale"])(this.texMatrix, srcWidth / this.imageWidth, srcHeight / this.imageHeight, 1, this.texMatrix);
    }
  }, {
    key: "draw",
    value: function draw() {
      var gl = this.gl;
      var dstX = (this.imageRect[0] || 0) + this.x + this.borderWidth;
      var dstY = (this.imageRect[1] || 0) + this.y + this.borderWidth;
      var dstWidth = this.imageRect[2] || this.width;
      var dstHeight = this.imageRect[3] || this.height;
      var hasTexture = false;

      if (typeof this.backgroundImage !== 'undefined') {
        var texId = textureMap.get(this.backgroundImage);

        if (!texId) {
          texId = createTexture(gl); // 将图像上传到纹理

          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.backgroundImage);
          textureMap.set(this.backgroundImage, texId);
        }

        gl.bindTexture(gl.TEXTURE_2D, texId);
        hasTexture = true;
      } else if (typeof this.backgroundImageData !== 'undefined') {
        var _texId = textureMap.get(this.backgroundImageData);

        if (!_texId) {
          _texId = createTexture(gl);
          textureMap.set(backgroundImageData, _texId);
        }

        gl.bindTexture(gl.TEXTURE_2D, _texId);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.imageWidth, this.imageHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.backgroundImageData);
        hasTexture = true;
      } // 所有绘制共用一个就行


      gl.uniform2f(gl.program.uResolution, gl.canvas.width, gl.canvas.height);
      gl.uniformMatrix4fv(gl.program.uMatrix, false, this.matrix); // 设置矩形除去border左下角和右上角位置

      gl.uniform4f(gl.program.uTexRect, dstX, dstY + dstHeight, dstX + dstWidth, dstY); // 设置完整矩形的位置

      gl.uniform4f(gl.program.uRect, this.x, this.y + this.height, this.x + this.width, this.y); // 纹理设置

      gl.uniform4f(gl.program.uBitset, hasTexture ? 1 : 0, 0, 0, 0);
      gl.uniformMatrix4fv(gl.program.textureMatrixLocation, false, this.texMatrix);
      gl.uniform1i(gl.program.uTex, 0);
      gl.uniform4f(gl.program.uColor, this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], this.backgroundColor[3]);
      gl.uniform4f(gl.program.uRadius, this.radius[0], this.radius[1], this.radius[2], this.radius[3]);
      gl.uniform4f(gl.program.uBorderColor, this.borderColor[0], this.borderColor[1], this.borderColor[2], this.borderColor[3]);
      gl.uniform1f(gl.program.uOpacity, this.opacity);
      gl.uniform1f(gl.program.uBorderWidth, this.borderWidth); // 因为count = 6，所以顶点着色器将运行6次

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }]);

  return RoundRect;
}();
function setupGl(canvas) {
  if (!canvas.webgl) {
    var _gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true,
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      depth: false,
      stencil: true
    });

    _gl.program = createProgram(_gl);
    canvas.webgl = _gl; // eslint-disable-line
  }

  var gl = canvas.webgl;
  return gl;
}

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "copy", function() { return copy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lookAt", function() { return lookAt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addVectors", function() { return addVectors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subtractVectors", function() { return subtractVectors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scaleVector", function() { return scaleVector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distance", function() { return distance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distanceSq", function() { return distanceSq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalize", function() { return normalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return compose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cross", function() { return cross; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decompose", function() { return decompose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dot", function() { return dot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "identity", function() { return identity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transpose", function() { return transpose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "length", function() { return length; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lengthSq", function() { return lengthSq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "orthographic", function() { return orthographic; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "frustum", function() { return frustum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "perspective", function() { return perspective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "translation", function() { return translation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "translate", function() { return translate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xRotation", function() { return xRotation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "yRotation", function() { return yRotation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zRotation", function() { return zRotation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xRotate", function() { return xRotate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "yRotate", function() { return yRotate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zRotate", function() { return zRotate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "axisRotation", function() { return axisRotation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "axisRotate", function() { return axisRotate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scaling", function() { return scaling; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scale", function() { return scale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiply", function() { return multiply; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformVector", function() { return transformVector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformPoint", function() { return transformPoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformDirection", function() { return transformDirection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformNormal", function() { return transformNormal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setDefaultType", function() { return setDefaultType; });
/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Various 3d math functions.
 *
 * @module webgl-3d-math
 */

/**
 * An array or typed array with 3 values.
 * @typedef {number[]|TypedArray} Vector3
 * @memberOf module:webgl-3d-math
 */

/**
 * An array or typed array with 4 values.
 * @typedef {number[]|TypedArray} Vector4
 * @memberOf module:webgl-3d-math
 */

/**
 * An array or typed array with 16 values.
 * @typedef {number[]|TypedArray} Matrix4
 * @memberOf module:webgl-3d-math
 */
var MatType = Float32Array;
/**
 * Sets the type this library creates for a Mat4
 * @param {constructor} Ctor the constructor for the type. Either `Float32Array` or `Array`
 * @return {constructor} previous constructor for Mat4
 */

function setDefaultType(Ctor) {
  var OldType = MatType;
  MatType = Ctor;
  return OldType;
}
/**
 * Takes two 4-by-4 matrices, a and b, and computes the product in the order
 * that pre-composes b with a.  In other words, the matrix returned will
 * transform by b first and then a.  Note this is subtly different from just
 * multiplying the matrices together.  For given a and b, this function returns
 * the same object in both row-major and column-major mode.
 * @param {Matrix4} a A matrix.
 * @param {Matrix4} b A matrix.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 */


function multiply(a, b, dst) {
  dst = dst || new MatType(16);
  var b00 = b[0 * 4 + 0];
  var b01 = b[0 * 4 + 1];
  var b02 = b[0 * 4 + 2];
  var b03 = b[0 * 4 + 3];
  var b10 = b[1 * 4 + 0];
  var b11 = b[1 * 4 + 1];
  var b12 = b[1 * 4 + 2];
  var b13 = b[1 * 4 + 3];
  var b20 = b[2 * 4 + 0];
  var b21 = b[2 * 4 + 1];
  var b22 = b[2 * 4 + 2];
  var b23 = b[2 * 4 + 3];
  var b30 = b[3 * 4 + 0];
  var b31 = b[3 * 4 + 1];
  var b32 = b[3 * 4 + 2];
  var b33 = b[3 * 4 + 3];
  var a00 = a[0 * 4 + 0];
  var a01 = a[0 * 4 + 1];
  var a02 = a[0 * 4 + 2];
  var a03 = a[0 * 4 + 3];
  var a10 = a[1 * 4 + 0];
  var a11 = a[1 * 4 + 1];
  var a12 = a[1 * 4 + 2];
  var a13 = a[1 * 4 + 3];
  var a20 = a[2 * 4 + 0];
  var a21 = a[2 * 4 + 1];
  var a22 = a[2 * 4 + 2];
  var a23 = a[2 * 4 + 3];
  var a30 = a[3 * 4 + 0];
  var a31 = a[3 * 4 + 1];
  var a32 = a[3 * 4 + 2];
  var a33 = a[3 * 4 + 3];
  /* eslint no-param-reassign: off */

  dst[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
  dst[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
  dst[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
  dst[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
  dst[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
  dst[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
  dst[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
  dst[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
  dst[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
  dst[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
  dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
  dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
  dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
  dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
  dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
  dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
  return dst;
}
/**
 * adds 2 vectors3s
 * @param {Vector3} a a
 * @param {Vector3} b b
 * @param {Vector3} dst optional vector3 to store result
 * @return {Vector3} dst or new Vector3 if not provided
 * @memberOf module:webgl-3d-math
 */


function addVectors(a, b, dst) {
  dst = dst || new MatType(3);
  dst[0] = a[0] + b[0];
  dst[1] = a[1] + b[1];
  dst[2] = a[2] + b[2];
  return dst;
}
/**
 * subtracts 2 vectors3s
 * @param {Vector3} a a
 * @param {Vector3} b b
 * @param {Vector3} dst optional vector3 to store result
 * @return {Vector3} dst or new Vector3 if not provided
 * @memberOf module:webgl-3d-math
 */


function subtractVectors(a, b, dst) {
  dst = dst || new MatType(3);
  dst[0] = a[0] - b[0];
  dst[1] = a[1] - b[1];
  dst[2] = a[2] - b[2];
  return dst;
}
/**
 * scale vectors3
 * @param {Vector3} v vector
 * @param {Number} s scale
 * @param {Vector3} dst optional vector3 to store result
 * @return {Vector3} dst or new Vector3 if not provided
 * @memberOf module:webgl-3d-math
 */


function scaleVector(v, s, dst) {
  dst = dst || new MatType(3);
  dst[0] = v[0] * s;
  dst[1] = v[1] * s;
  dst[2] = v[2] * s;
  return dst;
}
/**
 * normalizes a vector.
 * @param {Vector3} v vector to normalize
 * @param {Vector3} dst optional vector3 to store result
 * @return {Vector3} dst or new Vector3 if not provided
 * @memberOf module:webgl-3d-math
 */


function normalize(v, dst) {
  dst = dst || new MatType(3);
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]); // make sure we don't divide by 0.

  if (length > 0.00001) {
    dst[0] = v[0] / length;
    dst[1] = v[1] / length;
    dst[2] = v[2] / length;
  }

  return dst;
}
/**
 * Computes the length of a vector
 * @param {Vector3} v vector to take length of
 * @return {number} length of vector
 */


function length(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}
/**
 * Computes the length squared of a vector
 * @param {Vector3} v vector to take length of
 * @return {number} length sqaured of vector
 */


function lengthSq(v) {
  return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
}
/**
 * Computes the cross product of 2 vectors3s
 * @param {Vector3} a a
 * @param {Vector3} b b
 * @param {Vector3} dst optional vector3 to store result
 * @return {Vector3} dst or new Vector3 if not provided
 * @memberOf module:webgl-3d-math
 */


function cross(a, b, dst) {
  dst = dst || new MatType(3);
  dst[0] = a[1] * b[2] - a[2] * b[1];
  dst[1] = a[2] * b[0] - a[0] * b[2];
  dst[2] = a[0] * b[1] - a[1] * b[0];
  return dst;
}
/**
 * Computes the dot product of two vectors; assumes both vectors have
 * three entries.
 * @param {Vector3} a Operand vector.
 * @param {Vector3} b Operand vector.
 * @return {number} dot product
 * @memberOf module:webgl-3d-math
 */


function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the distance squared between 2 points
 * @param {Vector3} a
 * @param {Vector3} b
 * @return {number} distance squared between a and b
 */


function distanceSq(a, b) {
  var dx = a[0] - b[0];
  var dy = a[1] - b[1];
  var dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}
/**
 * Computes the distance between 2 points
 * @param {Vector3} a
 * @param {Vector3} b
 * @return {number} distance between a and b
 */


function distance(a, b) {
  return Math.sqrt(distanceSq(a, b));
}
/**
 * Makes an identity matrix.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function identity(dst) {
  dst = dst || new MatType(16);
  dst[0] = 1;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 1;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = 1;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Transposes a matrix.
 * @param {Matrix4} m matrix to transpose.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function transpose(m, dst) {
  dst = dst || new MatType(16);
  /* eslint prefer-destructuring: off */

  dst[0] = m[0];
  dst[1] = m[4];
  dst[2] = m[8];
  dst[3] = m[12];
  dst[4] = m[1];
  dst[5] = m[5];
  dst[6] = m[9];
  dst[7] = m[13];
  dst[8] = m[2];
  dst[9] = m[6];
  dst[10] = m[10];
  dst[11] = m[14];
  dst[12] = m[3];
  dst[13] = m[7];
  dst[14] = m[11];
  dst[15] = m[15];
  return dst;
}
/**
 * Creates a lookAt matrix.
 * This is a world matrix for a camera. In other words it will transform
 * from the origin to a place and orientation in the world. For a view
 * matrix take the inverse of this.
 * @param {Vector3} cameraPosition position of the camera
 * @param {Vector3} target position of the target
 * @param {Vector3} up direction
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function lookAt(cameraPosition, target, up, dst) {
  dst = dst || new MatType(16);
  var zAxis = normalize(subtractVectors(cameraPosition, target));
  var xAxis = normalize(cross(up, zAxis));
  var yAxis = normalize(cross(zAxis, xAxis));
  dst[0] = xAxis[0];
  dst[1] = xAxis[1];
  dst[2] = xAxis[2];
  dst[3] = 0;
  dst[4] = yAxis[0];
  dst[5] = yAxis[1];
  dst[6] = yAxis[2];
  dst[7] = 0;
  dst[8] = zAxis[0];
  dst[9] = zAxis[1];
  dst[10] = zAxis[2];
  dst[11] = 0;
  dst[12] = cameraPosition[0];
  dst[13] = cameraPosition[1];
  dst[14] = cameraPosition[2];
  dst[15] = 1;
  return dst;
}
/**
 * Computes a 4-by-4 perspective transformation matrix given the angular height
 * of the frustum, the aspect ratio, and the near and far clipping planes.  The
 * arguments define a frustum extending in the negative z direction.  The given
 * angle is the vertical angle of the frustum, and the horizontal angle is
 * determined to produce the given aspect ratio.  The arguments near and far are
 * the distances to the near and far clipping planes.  Note that near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  The matrix generated sends the viewing frustum to the unit box.
 * We assume a unit box extending from -1 to 1 in the x and y dimensions and
 * from -1 to 1 in the z dimension.
 * @param {number} fieldOfViewInRadians field of view in y axis.
 * @param {number} aspect aspect of viewport (width / height)
 * @param {number} near near Z clipping plane
 * @param {number} far far Z clipping plane
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function perspective(fieldOfViewInRadians, aspect, near, far, dst) {
  dst = dst || new MatType(16);
  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  var rangeInv = 1.0 / (near - far);
  dst[0] = f / aspect;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = f;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = (near + far) * rangeInv;
  dst[11] = -1;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = near * far * rangeInv * 2;
  dst[15] = 0;
  return dst;
}
/**
 * Computes a 4-by-4 orthographic projection matrix given the coordinates of the
 * planes defining the axis-aligned, box-shaped viewing volume.  The matrix
 * generated sends that box to the unit box.  Note that although left and right
 * are x coordinates and bottom and top are y coordinates, near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  We assume a unit box extending from -1 to 1 in the x and y
 * dimensions and from -1 to 1 in the z dimension.
 * @param {number} left The x coordinate of the left plane of the box.
 * @param {number} right The x coordinate of the right plane of the box.
 * @param {number} bottom The y coordinate of the bottom plane of the box.
 * @param {number} top The y coordinate of the right plane of the box.
 * @param {number} near The negative z coordinate of the near plane of the box.
 * @param {number} far The negative z coordinate of the far plane of the box.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function orthographic(left, right, bottom, top, near, far, dst) {
  dst = dst || new MatType(16);
  dst[0] = 2 / (right - left);
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 2 / (top - bottom);
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = 2 / (near - far);
  dst[11] = 0;
  dst[12] = (left + right) / (left - right);
  dst[13] = (bottom + top) / (bottom - top);
  dst[14] = (near + far) / (near - far);
  dst[15] = 1;
  return dst;
}
/**
 * Computes a 4-by-4 perspective transformation matrix given the left, right,
 * top, bottom, near and far clipping planes. The arguments define a frustum
 * extending in the negative z direction. The arguments near and far are the
 * distances to the near and far clipping planes. Note that near and far are not
 * z coordinates, but rather they are distances along the negative z-axis. The
 * matrix generated sends the viewing frustum to the unit box. We assume a unit
 * box extending from -1 to 1 in the x and y dimensions and from -1 to 1 in the z
 * dimension.
 * @param {number} left The x coordinate of the left plane of the box.
 * @param {number} right The x coordinate of the right plane of the box.
 * @param {number} bottom The y coordinate of the bottom plane of the box.
 * @param {number} top The y coordinate of the right plane of the box.
 * @param {number} near The negative z coordinate of the near plane of the box.
 * @param {number} far The negative z coordinate of the far plane of the box.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function frustum(left, right, bottom, top, near, far, dst) {
  dst = dst || new MatType(16);
  var dx = right - left;
  var dy = top - bottom;
  var dz = far - near;
  dst[0] = 2 * near / dx;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 2 * near / dy;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = (left + right) / dx;
  dst[9] = (top + bottom) / dy;
  dst[10] = -(far + near) / dz;
  dst[11] = -1;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = -2 * near * far / dz;
  dst[15] = 0;
  return dst;
}
/**
 * Makes a translation matrix
 * @param {number} tx x translation.
 * @param {number} ty y translation.
 * @param {number} tz z translation.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function translation(tx, ty, tz, dst) {
  dst = dst || new MatType(16);
  dst[0] = 1;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 1;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = 1;
  dst[11] = 0;
  dst[12] = tx;
  dst[13] = ty;
  dst[14] = tz;
  dst[15] = 1;
  return dst;
}
/**
 * Multiply by translation matrix.
 * @param {Matrix4} m matrix to multiply
 * @param {number} tx x translation.
 * @param {number} ty y translation.
 * @param {number} tz z translation.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function translate(m, tx, ty, tz, dst) {
  // This is the optimized version of
  // return multiply(m, translation(tx, ty, tz), dst);
  dst = dst || new MatType(16);
  var m00 = m[0];
  var m01 = m[1];
  var m02 = m[2];
  var m03 = m[3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];

  if (m !== dst) {
    dst[0] = m00;
    dst[1] = m01;
    dst[2] = m02;
    dst[3] = m03;
    dst[4] = m10;
    dst[5] = m11;
    dst[6] = m12;
    dst[7] = m13;
    dst[8] = m20;
    dst[9] = m21;
    dst[10] = m22;
    dst[11] = m23;
  }

  dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
  dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
  dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
  dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;
  return dst;
}
/**
 * Makes an x rotation matrix
 * @param {number} angleInRadians amount to rotate
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function xRotation(angleInRadians, dst) {
  dst = dst || new MatType(16);
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  dst[0] = 1;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = c;
  dst[6] = s;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = -s;
  dst[10] = c;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Multiply by an x rotation matrix
 * @param {Matrix4} m matrix to multiply
 * @param {number} angleInRadians amount to rotate
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function xRotate(m, angleInRadians, dst) {
  // this is the optimized version of
  // return multiply(m, xRotation(angleInRadians), dst);
  dst = dst || new MatType(16);
  var m10 = m[4];
  var m11 = m[5];
  var m12 = m[6];
  var m13 = m[7];
  var m20 = m[8];
  var m21 = m[9];
  var m22 = m[10];
  var m23 = m[11];
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  dst[4] = c * m10 + s * m20;
  dst[5] = c * m11 + s * m21;
  dst[6] = c * m12 + s * m22;
  dst[7] = c * m13 + s * m23;
  dst[8] = c * m20 - s * m10;
  dst[9] = c * m21 - s * m11;
  dst[10] = c * m22 - s * m12;
  dst[11] = c * m23 - s * m13;

  if (m !== dst) {
    dst[0] = m[0];
    dst[1] = m[1];
    dst[2] = m[2];
    dst[3] = m[3];
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  return dst;
}
/**
 * Makes an y rotation matrix
 * @param {number} angleInRadians amount to rotate
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function yRotation(angleInRadians, dst) {
  dst = dst || new MatType(16);
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  dst[0] = c;
  dst[1] = 0;
  dst[2] = -s;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 1;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = s;
  dst[9] = 0;
  dst[10] = c;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Multiply by an y rotation matrix
 * @param {Matrix4} m matrix to multiply
 * @param {number} angleInRadians amount to rotate
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function yRotate(m, angleInRadians, dst) {
  // this is the optimized version of
  // return multiply(m, yRotation(angleInRadians), dst);
  dst = dst || new MatType(16);
  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  dst[0] = c * m00 - s * m20;
  dst[1] = c * m01 - s * m21;
  dst[2] = c * m02 - s * m22;
  dst[3] = c * m03 - s * m23;
  dst[8] = c * m20 + s * m00;
  dst[9] = c * m21 + s * m01;
  dst[10] = c * m22 + s * m02;
  dst[11] = c * m23 + s * m03;

  if (m !== dst) {
    dst[4] = m[4];
    dst[5] = m[5];
    dst[6] = m[6];
    dst[7] = m[7];
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  return dst;
}
/**
 * Makes an z rotation matrix
 * @param {number} angleInRadians amount to rotate
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function zRotation(angleInRadians, dst) {
  dst = dst || new MatType(16);
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  dst[0] = c;
  dst[1] = s;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = -s;
  dst[5] = c;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = 1;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Multiply by an z rotation matrix
 * @param {Matrix4} m matrix to multiply
 * @param {number} angleInRadians amount to rotate
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function zRotate(m, angleInRadians, dst) {
  // This is the optimized version of
  // return multiply(m, zRotation(angleInRadians), dst);
  dst = dst || new MatType(16);
  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  dst[0] = c * m00 + s * m10;
  dst[1] = c * m01 + s * m11;
  dst[2] = c * m02 + s * m12;
  dst[3] = c * m03 + s * m13;
  dst[4] = c * m10 - s * m00;
  dst[5] = c * m11 - s * m01;
  dst[6] = c * m12 - s * m02;
  dst[7] = c * m13 - s * m03;

  if (m !== dst) {
    dst[8] = m[8];
    dst[9] = m[9];
    dst[10] = m[10];
    dst[11] = m[11];
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  return dst;
}
/**
 * Makes an rotation matrix around an arbitrary axis
 * @param {Vector3} axis axis to rotate around
 * @param {number} angleInRadians amount to rotate
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function axisRotation(axis, angleInRadians, dst) {
  dst = dst || new MatType(16);
  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  var oneMinusCosine = 1 - c;
  dst[0] = xx + (1 - xx) * c;
  dst[1] = x * y * oneMinusCosine + z * s;
  dst[2] = x * z * oneMinusCosine - y * s;
  dst[3] = 0;
  dst[4] = x * y * oneMinusCosine - z * s;
  dst[5] = yy + (1 - yy) * c;
  dst[6] = y * z * oneMinusCosine + x * s;
  dst[7] = 0;
  dst[8] = x * z * oneMinusCosine + y * s;
  dst[9] = y * z * oneMinusCosine - x * s;
  dst[10] = zz + (1 - zz) * c;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Multiply by an axis rotation matrix
 * @param {Matrix4} m matrix to multiply
 * @param {Vector3} axis axis to rotate around
 * @param {number} angleInRadians amount to rotate
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function axisRotate(m, axis, angleInRadians, dst) {
  // This is the optimized version of
  // return multiply(m, axisRotation(axis, angleInRadians), dst);
  dst = dst || new MatType(16);
  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  var oneMinusCosine = 1 - c;
  var r00 = xx + (1 - xx) * c;
  var r01 = x * y * oneMinusCosine + z * s;
  var r02 = x * z * oneMinusCosine - y * s;
  var r10 = x * y * oneMinusCosine - z * s;
  var r11 = yy + (1 - yy) * c;
  var r12 = y * z * oneMinusCosine + x * s;
  var r20 = x * z * oneMinusCosine + y * s;
  var r21 = y * z * oneMinusCosine - x * s;
  var r22 = zz + (1 - zz) * c;
  var m00 = m[0];
  var m01 = m[1];
  var m02 = m[2];
  var m03 = m[3];
  var m10 = m[4];
  var m11 = m[5];
  var m12 = m[6];
  var m13 = m[7];
  var m20 = m[8];
  var m21 = m[9];
  var m22 = m[10];
  var m23 = m[11];
  dst[0] = r00 * m00 + r01 * m10 + r02 * m20;
  dst[1] = r00 * m01 + r01 * m11 + r02 * m21;
  dst[2] = r00 * m02 + r01 * m12 + r02 * m22;
  dst[3] = r00 * m03 + r01 * m13 + r02 * m23;
  dst[4] = r10 * m00 + r11 * m10 + r12 * m20;
  dst[5] = r10 * m01 + r11 * m11 + r12 * m21;
  dst[6] = r10 * m02 + r11 * m12 + r12 * m22;
  dst[7] = r10 * m03 + r11 * m13 + r12 * m23;
  dst[8] = r20 * m00 + r21 * m10 + r22 * m20;
  dst[9] = r20 * m01 + r21 * m11 + r22 * m21;
  dst[10] = r20 * m02 + r21 * m12 + r22 * m22;
  dst[11] = r20 * m03 + r21 * m13 + r22 * m23;

  if (m !== dst) {
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  return dst;
}
/**
 * Makes a scale matrix
 * @param {number} sx x scale.
 * @param {number} sy y scale.
 * @param {number} sz z scale.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function scaling(sx, sy, sz, dst) {
  dst = dst || new MatType(16);
  dst[0] = sx;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = sy;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = sz;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Multiply by a scaling matrix
 * @param {Matrix4} m matrix to multiply
 * @param {number} sx x scale.
 * @param {number} sy y scale.
 * @param {number} sz z scale.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function scale(m, sx, sy, sz, dst) {
  // This is the optimized version of
  // return multiply(m, scaling(sx, sy, sz), dst);
  dst = dst || new MatType(16);
  dst[0] = sx * m[0 * 4 + 0];
  dst[1] = sx * m[0 * 4 + 1];
  dst[2] = sx * m[0 * 4 + 2];
  dst[3] = sx * m[0 * 4 + 3];
  dst[4] = sy * m[1 * 4 + 0];
  dst[5] = sy * m[1 * 4 + 1];
  dst[6] = sy * m[1 * 4 + 2];
  dst[7] = sy * m[1 * 4 + 3];
  dst[8] = sz * m[2 * 4 + 0];
  dst[9] = sz * m[2 * 4 + 1];
  dst[10] = sz * m[2 * 4 + 2];
  dst[11] = sz * m[2 * 4 + 3];

  if (m !== dst) {
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  return dst;
}
/**
 * creates a matrix from translation, quaternion, scale
 * @param {Number[]} translation [x, y, z] translation
 * @param {Number[]} quaternion [x, y, z, z] quaternion rotation
 * @param {Number[]} scale [x, y, z] scale
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 */


function compose(translation, quaternion, scale, dst) {
  dst = dst || new MatType(16);
  var x = quaternion[0];
  var y = quaternion[1];
  var z = quaternion[2];
  var w = quaternion[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = scale[0];
  var sy = scale[1];
  var sz = scale[2];
  dst[0] = (1 - (yy + zz)) * sx;
  dst[1] = (xy + wz) * sx;
  dst[2] = (xz - wy) * sx;
  dst[3] = 0;
  dst[4] = (xy - wz) * sy;
  dst[5] = (1 - (xx + zz)) * sy;
  dst[6] = (yz + wx) * sy;
  dst[7] = 0;
  dst[8] = (xz + wy) * sz;
  dst[9] = (yz - wx) * sz;
  dst[10] = (1 - (xx + yy)) * sz;
  dst[11] = 0;
  dst[12] = translation[0];
  dst[13] = translation[1];
  dst[14] = translation[2];
  dst[15] = 1;
  return dst;
}

function quatFromRotationMatrix(m, dst) {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
  var m11 = m[0];
  var m12 = m[4];
  var m13 = m[8];
  var m21 = m[1];
  var m22 = m[5];
  var m23 = m[9];
  var m31 = m[2];
  var m32 = m[6];
  var m33 = m[10];
  var trace = m11 + m22 + m33;

  if (trace > 0) {
    var s = 0.5 / Math.sqrt(trace + 1);
    dst[3] = 0.25 / s;
    dst[0] = (m32 - m23) * s;
    dst[1] = (m13 - m31) * s;
    dst[2] = (m21 - m12) * s;
  } else if (m11 > m22 && m11 > m33) {
    var _s = 2 * Math.sqrt(1 + m11 - m22 - m33);

    dst[3] = (m32 - m23) / _s;
    dst[0] = 0.25 * _s;
    dst[1] = (m12 + m21) / _s;
    dst[2] = (m13 + m31) / _s;
  } else if (m22 > m33) {
    var _s2 = 2 * Math.sqrt(1 + m22 - m11 - m33);

    dst[3] = (m13 - m31) / _s2;
    dst[0] = (m12 + m21) / _s2;
    dst[1] = 0.25 * _s2;
    dst[2] = (m23 + m32) / _s2;
  } else {
    var _s3 = 2 * Math.sqrt(1 + m33 - m11 - m22);

    dst[3] = (m21 - m12) / _s3;
    dst[0] = (m13 + m31) / _s3;
    dst[1] = (m23 + m32) / _s3;
    dst[2] = 0.25 * _s3;
  }
}

function decompose(mat, translation, quaternion, scale) {
  var sx = length(mat.slice(0, 3));
  var sy = length(mat.slice(4, 7));
  var sz = length(mat.slice(8, 11)); // if determinate is negative, we need to invert one scale

  var det = determinate(mat);

  if (det < 0) {
    sx = -sx;
  }

  translation[0] = mat[12];
  translation[1] = mat[13];
  translation[2] = mat[14]; // scale the rotation part

  var matrix = copy(mat);
  var invSX = 1 / sx;
  var invSY = 1 / sy;
  var invSZ = 1 / sz;
  matrix[0] *= invSX;
  matrix[1] *= invSX;
  matrix[2] *= invSX;
  matrix[4] *= invSY;
  matrix[5] *= invSY;
  matrix[6] *= invSY;
  matrix[8] *= invSZ;
  matrix[9] *= invSZ;
  matrix[10] *= invSZ;
  quatFromRotationMatrix(matrix, quaternion);
  scale[0] = sx;
  scale[1] = sy;
  scale[2] = sz;
}

function determinate(m) {
  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];
  var tmp_0 = m22 * m33;
  var tmp_1 = m32 * m23;
  var tmp_2 = m12 * m33;
  var tmp_3 = m32 * m13;
  var tmp_4 = m12 * m23;
  var tmp_5 = m22 * m13;
  var tmp_6 = m02 * m33;
  var tmp_7 = m32 * m03;
  var tmp_8 = m02 * m23;
  var tmp_9 = m22 * m03;
  var tmp_10 = m02 * m13;
  var tmp_11 = m12 * m03;
  var t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  var t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  var t2 = tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  var t3 = tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  return 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
}
/**
 * Computes the inverse of a matrix.
 * @param {Matrix4} m matrix to compute inverse of
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */


function inverse(m, dst) {
  dst = dst || new MatType(16);
  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];
  /* eslint camelcase: ["error", {allow: ["^tmp_"]}] */

  var tmp_0 = m22 * m33;
  var tmp_1 = m32 * m23;
  var tmp_2 = m12 * m33;
  var tmp_3 = m32 * m13;
  var tmp_4 = m12 * m23;
  var tmp_5 = m22 * m13;
  var tmp_6 = m02 * m33;
  var tmp_7 = m32 * m03;
  var tmp_8 = m02 * m23;
  var tmp_9 = m22 * m03;
  var tmp_10 = m02 * m13;
  var tmp_11 = m12 * m03;
  var tmp_12 = m20 * m31;
  var tmp_13 = m30 * m21;
  var tmp_14 = m10 * m31;
  var tmp_15 = m30 * m11;
  var tmp_16 = m10 * m21;
  var tmp_17 = m20 * m11;
  var tmp_18 = m00 * m31;
  var tmp_19 = m30 * m01;
  var tmp_20 = m00 * m21;
  var tmp_21 = m20 * m01;
  var tmp_22 = m00 * m11;
  var tmp_23 = m10 * m01;
  var t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  var t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  var t2 = tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  var t3 = tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  dst[0] = d * t0;
  dst[1] = d * t1;
  dst[2] = d * t2;
  dst[3] = d * t3;
  dst[4] = d * (tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30 - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
  dst[5] = d * (tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30 - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
  dst[6] = d * (tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30 - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
  dst[7] = d * (tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20 - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
  dst[8] = d * (tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33 - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
  dst[9] = d * (tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33 - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
  dst[10] = d * (tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33 - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
  dst[11] = d * (tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23 - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
  dst[12] = d * (tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12 - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
  dst[13] = d * (tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22 - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
  dst[14] = d * (tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02 - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
  dst[15] = d * (tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12 - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
  return dst;
}
/**
 * Takes a  matrix and a vector with 4 entries, transforms that vector by
 * the matrix, and returns the result as a vector with 4 entries.
 * @param {Matrix4} m The matrix.
 * @param {Vector4} v The point in homogenous coordinates.
 * @param {Vector4} dst optional vector4 to store result
 * @return {Vector4} dst or new Vector4 if not provided
 * @memberOf module:webgl-3d-math
 */


function transformVector(m, v, dst) {
  dst = dst || new MatType(4);

  for (var i = 0; i < 4; ++i) {
    dst[i] = 0.0;

    for (var j = 0; j < 4; ++j) {
      dst[i] += v[j] * m[j * 4 + i];
    }
  }

  return dst;
}
/**
 * Takes a 4-by-4 matrix and a vector with 3 entries,
 * interprets the vector as a point, transforms that point by the matrix, and
 * returns the result as a vector with 3 entries.
 * @param {Matrix4} m The matrix.
 * @param {Vector3} v The point.
 * @param {Vector4} dst optional vector4 to store result
 * @return {Vector4} dst or new Vector4 if not provided
 * @memberOf module:webgl-3d-math
 */


function transformPoint(m, v, dst) {
  dst = dst || new MatType(3);
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];
  dst[0] = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d;
  dst[1] = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d;
  dst[2] = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d;
  return dst;
}
/**
 * Takes a 4-by-4 matrix and a vector with 3 entries, interprets the vector as a
 * direction, transforms that direction by the matrix, and returns the result;
 * assumes the transformation of 3-dimensional space represented by the matrix
 * is parallel-preserving, i.e. any combination of rotation, scaling and
 * translation, but not a perspective distortion. Returns a vector with 3
 * entries.
 * @param {Matrix4} m The matrix.
 * @param {Vector3} v The direction.
 * @param {Vector4} dst optional vector4 to store result
 * @return {Vector4} dst or new Vector4 if not provided
 * @memberOf module:webgl-3d-math
 */


function transformDirection(m, v, dst) {
  dst = dst || new MatType(3);
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  dst[0] = v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0];
  dst[1] = v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1];
  dst[2] = v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2];
  return dst;
}
/**
 * Takes a 4-by-4 matrix m and a vector v with 3 entries, interprets the vector
 * as a normal to a surface, and computes a vector which is normal upon
 * transforming that surface by the matrix. The effect of this function is the
 * same as transforming v (as a direction) by the inverse-transpose of m.  This
 * function assumes the transformation of 3-dimensional space represented by the
 * matrix is parallel-preserving, i.e. any combination of rotation, scaling and
 * translation, but not a perspective distortion.  Returns a vector with 3
 * entries.
 * @param {Matrix4} m The matrix.
 * @param {Vector3} v The normal.
 * @param {Vector3} [dst] The direction.
 * @return {Vector3} The transformed direction.
 * @memberOf module:webgl-3d-math
 */


function transformNormal(m, v, dst) {
  dst = dst || new MatType(3);
  var mi = inverse(m);
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
  dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
  dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];
  return dst;
}

function copy(src, dst) {
  dst = dst || new MatType(16);
  dst[0] = src[0];
  dst[1] = src[1];
  dst[2] = src[2];
  dst[3] = src[3];
  dst[4] = src[4];
  dst[5] = src[5];
  dst[6] = src[6];
  dst[7] = src[7];
  dst[8] = src[8];
  dst[9] = src[9];
  dst[10] = src[10];
  dst[11] = src[11];
  dst[12] = src[12];
  dst[13] = src[13];
  dst[14] = src[14];
  dst[15] = src[15];
  return dst;
}



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("attribute vec4 a_position;\nuniform vec2 u_resolution;\nuniform mat4 u_matrix;\nuniform mat4 u_textureMatrix;\nuniform vec4 u_tex_rect;\nvarying vec2 v_resolution;\nvarying vec2 v_texcoord;\nvarying vec4 v_tex_rect;\n\n/**\n * 屏幕像素坐标转换成裁剪空间坐标并且将坐标系的原点定位左上角\n */\nvec2 pixel2coord(vec2 a, vec2 resolution) {\n    // 从像素坐标转换到 0.0 到 1.0\n    vec2 zeroToOne = a / resolution;\n\n     // 再把 0->1 转换 0->2\n    vec2 zeroTwo = zeroToOne * 2.0;\n\n    // 把 0->2 转换到 -1->+1 (裁剪空间)\n    vec2 clipSpace = zeroTwo - 1.0;\n\n    // WebGL认为左下角是 0，0 。 想要像传统二维API那样起点在左上角，我们只需翻转y轴即可。\n    return clipSpace * vec2(1, -1);\n}\n\nvoid main() {\n    gl_Position = u_matrix * a_position;\n\n    // 矩形左下角位置\n    vec2 texRectBl = pixel2coord(u_tex_rect.xy, u_resolution);\n    // 矩形右上角位置\n    vec2 texRectTr = pixel2coord(u_tex_rect.zw, u_resolution);\n\n    // 计算矩形的宽度\n    float texRectWidth = texRectTr.x - texRectBl.x;\n    // 计算矩形的高度\n    float texRectHeight = texRectTr.y - texRectBl.y;\n\n    vec4 tex_position = vec4(vec2((gl_Position.x - texRectBl.x) / texRectWidth, (texRectTr.y - gl_Position.y) / texRectHeight), 0, 1);\n\n    v_resolution = u_resolution;\n    v_texcoord = (u_textureMatrix * tex_position).xy;\n    v_tex_rect = u_tex_rect;\n}");

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("precision mediump float;\nuniform sampler2D u_texture;\nuniform vec4 u_rect;\nuniform vec4 u_color;\nuniform vec4 u_radius;\nuniform vec4 u_border_color;\nuniform float u_border_width;\nuniform float u_opacity;\nuniform vec4 u_bitset; //texture[, context, border, radius]\nvarying vec2 v_resolution;\nvarying vec2 v_texcoord;\nvarying vec4 v_tex_rect;\n\n\n// float sdfBox(vec2 coord, vec2 center, vec2 rect) {\n//   vec2 d = abs(coord - center) - rect;\n//   return min(max(d.x,d.y),0.0) + length(max(d,0.0));\n// }\n// float sdfCircle(vec2 coord, vec2 center, float radius) {\n//   return length(coord - center) - radius;\n// }\n// vec3 createCorner(vec2 dir, float raidus, float sign, float stroke) {\n//   return vec3(dir + sign * raidus, raidus - stroke);\n// }\n// float getCorner(vec2 p, vec3 corner) {\n//   return sdfCircle(p, corner.xy, corner.z);\n// }\n// float getCenter(vec2 p, vec3 from, vec3 to, vec2 r) {\n//   return sdfBox(p, (from + to).xy / 2., r - abs(from + to).z/2.);\n// }\n// float getHEdge(vec2 p, vec3 from, vec3 to) {\n//   return sdfBox(p,\n//   vec2((from.x + to.x)/2., sign(from.y) * min(abs(from.y), abs(to.y))),\n//   vec2(abs(from.x - to.x)/2., max(from.z, to.z)));\n// }\n// float getVEdge(vec2 p, vec3 from, vec3 to) {\n//   return sdfBox(p,\n//   vec2(sign(from.x) * min(abs(from.x), abs(to.x)), (from.y + to.y)/2.),\n//   vec2(max(from.z, to.z), abs(from.y - to.y)/2.));\n// }\n// float drawRect(vec2 p, vec2 lt, vec2 rt, vec2 rb, vec2 lb, vec4 corners, float stroke) {\n//   vec3 cLt = vec3(vec2(lt.x + corners.x, lt.y - corners.x), corners.x - stroke);\n//   vec3 cRt = vec3(vec2(rt.x - corners.y, rt.y - corners.y), corners.y - stroke);\n//   vec3 cRb = vec3(vec2(rb.x - corners.z, rb.y + corners.z), corners.z - stroke);\n//   vec3 cLb = vec3(vec2(lb.x + corners.w, lb.y + corners.w), corners.w - stroke);\n\n//   float circle = getCorner(p, cLt);\n//   circle = min(circle, getCorner(p, cRt));\n//   circle = min(circle, getCorner(p, cRb));\n//   circle = min(circle, getCorner(p, cLb));\n\n//   float box = getHEdge(p, cLt, cRt);\n//   box = min(box, getHEdge(p, cLb, cRb));\n//   box = min(box, getVEdge(p, cLt, cLb));\n//   box = min(box, getVEdge(p, cRt, cRb));\n//   float center = sdfBox(p, (cRt + cLb).xy / 2., vec2((cRt.x - cLb.x) / 2., (cRt.y - cLb.y) / 2.));\n//   center = max(center, sdfBox(p, (cRb + cLt).xy / 2., vec2((cRb.x - cLt.x) / 2., (cLt.y - cRb.y) / 2.)));\n//   box = min(box, center);\n\n//   return min(circle, box);\n// }\n\n// https://www.shadertoy.com/view/4llXD7\n/**\n * function length — calculate the length of a vector\n * function normalize — calculates the unit vector in the same direction as the original vector\n */\nfloat sdfRoundedRect(vec2 uv, vec2 center, vec2 size, vec4 r) {\n  vec2 p = uv - center;\n  // r.xy = (p.x > 0.0) ? r.xy : r.zw;\n  r.xy = mix(r.xy, r.zw, step(p.x, 0.0));\n  // r.x  = (p.y > 0.0) ? r.x  : r.y;\n  r.x  = mix(r.x, r.y, step(p.y, 0.0));\n\n  vec2 d = abs(p) - size + r.x;\n  // return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r.x;\n  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r.x;\n}\n\n/**\n * 屏幕像素坐标转换成裁剪空间坐标\n */\nvec2 pixel2coord (vec2 p) {\n  return (2.0 * vec2(p.x, v_resolution.y - p.y) - v_resolution) / v_resolution.y;\n}\n\nvec4 blend(vec4 cb, vec4 ca) {\n  float alpha = ca.a + cb.a * (1.0 - ca.a);\n  return mix(vec4((ca.rgb * ca.a + cb.rgb * cb.a * (1.0 - ca.a)) / alpha, alpha), vec4(0.0), step(abs(alpha), 0.0));\n  // return alpha == 0.0 ? vec4(0.0) : vec4((ca.rgb * ca.a + cb.rgb * cb.a * (1.0 - ca.a)) / alpha, alpha);\n}\n\nvoid main() {\n    float anti = 0.003;\n    // 归一化坐标\n    vec2 p = (2.0 * gl_FragCoord.xy - v_resolution) / v_resolution.y;\n    vec4 radius = u_radius * 2.0 / v_resolution.y;\n    float borderWidth = u_border_width * 2.0 / v_resolution.y;\n\n    // 矩形左上角\n    vec2 lt = pixel2coord(u_rect.xw);\n    // 矩形右下角\n    vec2 rb = pixel2coord(u_rect.zy);\n    // 矩形中心\n    vec2 center = (rb + lt) / 2.;\n    // 矩形尺寸\n    vec2 size = abs(rb - lt) / 2.;\n    // 矩形的radius\n    vec4 corners = vec4(radius.y, radius.z, radius.x, radius.w);\n\n    float border = sdfRoundedRect(p, center, size, corners);\n\n    float content = sdfRoundedRect(p, center, size - borderWidth, corners - borderWidth);\n\n    // 纹理左上角\n    vec2 texLt = pixel2coord(v_tex_rect.xw);\n    // 纹理右下角\n    vec2 texRb = pixel2coord(v_tex_rect.zy);\n    // 纹理中心\n    vec2 texCenter = (texRb + texLt) / 2.;\n    // 纹理尺寸\n    vec2 texSize = abs(texRb - texLt) / 2.;\n\n    float texContent = sdfRoundedRect(p, texCenter, texSize, vec4(0.));\n\n    vec4 borderColor = u_border_color;\n    borderColor.a *= smoothstep(-anti, anti, -max(border, -content));\n    vec4 contentColor = u_color;\n    contentColor.a *= smoothstep(-anti, anti, -content);\n    vec4 textureColor = mix(texture2D(u_texture, v_texcoord), vec4(0.0), step(abs(u_bitset.x), 0.0));\n    textureColor.rgb /= mix(textureColor.a, 1.0, step(textureColor.a, 0.0));\n    textureColor.a *= sign(-texContent) * smoothstep(-anti, anti, -content);\n\n    vec4 temp = blend(blend(contentColor, textureColor), borderColor);\n    temp.a *= u_opacity;\n\n    gl_FragColor = temp;\n}\n");

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createImageLoader", function() { return createImageLoader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTextTexture", function() { return createTextTexture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VIDEOS", function() { return VIDEOS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRender", function() { return createRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderDetection", function() { return renderDetection; });
/* harmony import */ var _const_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);
/* harmony import */ var _gl_rect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




function none() {}

function uid() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

var IMAGE_POOL = Object.create(null);
function createImageLoader(createImage) {
  return function (src) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    if (IMAGE_POOL[src]) {
      if (IMAGE_POOL[src].loaded) {
        cb(IMAGE_POOL[src].image);
      } else {
        IMAGE_POOL[src].onloads.push(cb);
      }
    } else {
      var img = createImage();
      IMAGE_POOL[src] = {
        image: img,
        loaded: false,
        onloads: [cb]
      };

      img.onload = function () {
        IMAGE_POOL[src].loaded = true;
        IMAGE_POOL[src].onloads.pop()(IMAGE_POOL[src].image, true);
        IMAGE_POOL[src].onloads = [];
      };

      img.onerror = function () {};

      img.src = src;
    }
  };
}
var BGIMAGE_RECT_CACHE = Object.create(null);

function getBgImageRect(_ref, size, position, borderWidth, _ref2) {
  var src = _ref.src,
      width = _ref.width,
      height = _ref.height;

  var _ref3 = _slicedToArray(_ref2, 4),
      baseX = _ref3[0],
      baseY = _ref3[1],
      boxWidth = _ref3[2],
      boxHeight = _ref3[3];

  var dpr = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 2;
  var key = "".concat(src, "_").concat(size, "_").concat(position, "_").concat(borderWidth, "_").concat(baseX, "_").concat(baseY, "_").concat(boxWidth, "_").concat(boxHeight);

  if (BGIMAGE_RECT_CACHE[key]) {
    return BGIMAGE_RECT_CACHE[key];
  }

  var finalX = baseX - borderWidth;
  var finalY = baseY - borderWidth;

  if (size) {
    var splitVal = size.split(' ');

    if (splitVal.length === 2) {
      var setWidth = splitVal[0];
      var setHeight = splitVal[1];
      width = setWidth[setWidth.length - 1] === '%' ? boxWidth * parseFloat(setWidth.slice(0, -1)) / 100 : parseFloat(setWidth) * dpr;
      height = setHeight[setHeight.length - 1] === '%' ? boxHeight * parseFloat(setHeight.slice(0, -1)) / 100 : parseFloat(setHeight) * dpr;
    } else if (splitVal.length === 1) {
      var imgRatio = width / height;
      var boxRatio = boxWidth / boxHeight;

      switch (splitVal[0]) {
        case 'contain':
          if (imgRatio < boxRatio) {
            height = boxHeight;
            width = height * imgRatio;

            if (!position) {
              finalY = baseY;
              finalX = baseX + (boxWidth - width) / 2;
            }
          } else {
            width = boxWidth;
            height = width / imgRatio;

            if (!position) {
              finalX = baseX;
              finalY = baseY + (boxHeight - height) / 2;
            }
          }

          break;

        case 'cover':
          if (imgRatio < boxRatio) {
            width = boxWidth;
            height = width / imgRatio;

            if (!position) {
              finalX = baseX;
              finalY = baseY - (height - boxHeight) / 2;
            }
          } else {
            height = boxHeight;
            width = height * imgRatio;

            if (!position) {
              finalY = baseY;
              finalX = baseX - (width - boxWidth) / 2;
            }
          }

          break;
      }
    }

    if (position) {
      var _position$split = position.split(' '),
          _position$split2 = _slicedToArray(_position$split, 2),
          x = _position$split2[0],
          y = _position$split2[1];

      switch (x) {
        case 'left':
          x = '0%';
          break;

        case 'center':
          x = '50%';
          break;

        case 'right':
          x = '100%';
      }

      switch (y) {
        case 'top':
          y = '0%';
          break;

        case 'center':
          y = '50%';
          break;

        case 'bottom':
          y = '100%';
      }

      x = x[x.length - 1] === '%' ? (boxWidth - width) * parseFloat(x.slice(0, -1)) / 100 : parseFloat(x) * dpr;
      y = y[y.length - 1] === '%' ? (boxHeight - height) * parseFloat(y.slice(0, -1)) / 100 : parseFloat(y) * dpr;
      finalX += x;
      finalY += y;
    }
  }

  BGIMAGE_RECT_CACHE[key] = [finalX - baseX, finalY - baseY, width, height];
  return BGIMAGE_RECT_CACHE[key];
}

var TEXT_TEXTURE = Object.create(null);
function createTextTexture(createCanvas) {
  return function (_ref4, _ref5, style) {
    var _ref6 = _slicedToArray(_ref4, 4),
        x = _ref6[0],
        y = _ref6[1],
        width = _ref6[2],
        height = _ref6[3];

    var valueShow = _ref5.valueShow,
        valueBreak = _ref5.valueBreak;
    var dpr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
    style.font = "".concat(style.fontWeight || '', " ").concat(style.fontSize * dpr, "px ").concat(style.fontFamily); // const key = `${x}_${y}_${width}_${height}_${valueShow}_${style.font}_${style.lineHeight}_${style.textAlign}_${style.textShadow}_${style.whiteSpace}_${style.textOverflow}_${style.color}`;

    var key = "".concat(width, "_").concat(height, "_").concat(valueShow, "_").concat(style.font || '_', "_").concat(style.lineHeight, "_").concat(style.textAlign, "_").concat(style.textShadow, "_").concat(style.whiteSpace, "_").concat(style.textOverflow, "_").concat(style.color);

    if (TEXT_TEXTURE[key]) {
      return TEXT_TEXTURE[key];
    }

    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    canvas.width = Math.ceil(width);
    canvas.height = Math.ceil(height);
    ctx.save(); // ctx.fillStyle = 'red';
    // ctx.fillRect(0, 0, width, height);

    ctx.textBaseline = 'top';
    ctx.font = style.font;
    ctx.textAlign = style.textAlign;
    ctx.fillStyle = style.color;

    if (style.textShadow) {
      var _style$textShadow$spl = style.textShadow.split(' '),
          _style$textShadow$spl2 = _slicedToArray(_style$textShadow$spl, 4),
          offsetX = _style$textShadow$spl2[0],
          offsetY = _style$textShadow$spl2[1],
          shadowBlur = _style$textShadow$spl2[2],
          shadowColor = _style$textShadow$spl2[3];

      ctx.shadowOffsetX = +offsetX * dpr;
      ctx.shadowOffsetY = +offsetY * dpr;
      ctx.shadowBlur = +shadowBlur * dpr;
      ctx.shadowColor = shadowColor;
    }

    var drawX = 0;
    var drawY = style.drawY * dpr - y;

    if (style.textAlign === 'center') {
      drawX += width / 2;
    } else if (style.textAlign === 'right') {
      drawX += width;
    }

    if (style.lineHeight) {
      ctx.textBaseline = 'middle';
      drawY += style.lineHeight * dpr / 2;
    }

    if (style.whiteSpace === 'nowrap' && style.textOverflow !== 'ellipsis') {
      // 不换行的时候，直接溢出处理
      ctx.fillText(valueShow, drawX, drawY);
    } else {
      if (valueBreak && valueBreak.length) {
        for (var i = 0; i < valueBreak.length; i++) {
          var str = valueBreak[i];
          ctx.fillText(str, drawX, drawY);
          drawY += (style.lineHeight || style.fontSize) * dpr;
        }
      } else {
        ctx.fillText(valueShow, drawX, drawY);
      }
    }

    ctx.restore(); // console.log(key, drawX, drawY, canvas.toDataURL('image/png'))

    TEXT_TEXTURE[key] = canvas;
    return TEXT_TEXTURE[key];
  };
}
/**
 * 处理渲染相关数据的分辨率
 * @param {Object} data [render数据]
 * @param {Number} dpr [分辨率]
 */

function scaleData(data, dpr) {
  var newData = Object.assign({}, data);
  _const_js__WEBPACK_IMPORTED_MODULE_0__["SCALE_KEY"].forEach(function (key) {
    if (typeof newData[key] === 'number') {
      newData[key] *= dpr;
    } else if (Array.isArray(newData[key])) {
      newData[key] = newData[key].map(function (v) {
        return v * dpr;
      });
    }
  });
  return newData;
}

var VIDEOS = Object.create(null);
var glPool = Object.create(null);
/**
 *
 * @param {CanvasContext} gl
 */

function resetGl(gl) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  {
    gl.enable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendEquation(gl.FUNC_ADD);
    // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE); // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  }
  {
    // VBO
    // bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.program.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, gl.program.positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(gl.program.vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.program.vPosition);
  } // gl.useProgram(gl.program.program);
}

function createRender(_ref7) {
  var dpr = _ref7.dpr,
      createImage = _ref7.createImage,
      createCanvas = _ref7.createCanvas;
  var loadImage = createImageLoader(createImage);
  var getTextTexture = createTextTexture(createCanvas);

  function drawOneGlRect(gl, rect) {
    var repaintCbk = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : none;
    var glRectData = rect.glRectData || scaleData(rect, dpr);
    glRectData.x = rect.x * dpr;
    glRectData.y = rect.y * dpr;

    if (!rect.glRectData) {
      rect.glRectData = glRectData;
    }

    if (!rect.uid) {
      rect.uid = uid();
    }

    var dimension = [glRectData.x, glRectData.y, glRectData.width, glRectData.height];
    var glRect = glPool[rect.uid];

    if (!glRect) {
      glRect = new _gl_rect_js__WEBPACK_IMPORTED_MODULE_1__["RoundRect"](gl);
      glPool[rect.uid] = glRect;
    } else {
      glRect.reset();
    }

    glRectData.radius && glRect.setRadius(glRectData.radius);
    glRectData.backgroundColor && glRect.setBackgroundColor(glRectData.backgroundColor);
    glRectData.borderWidth && glRect.setBorder(glRectData.borderWidth, glRectData.borderColor);
    glRectData.opacity && glRect.setOpacity(glRectData.opacity);
    glRect.updateContours(dimension);

    if (glRectData.image) {
      var src = glRectData.image.src;
      loadImage(src, function (image, lazy) {
        glRect.setTexture({
          image: image
        });

        if (lazy) {
          repaintCbk();
        }
      });
    }

    if (glRectData.backgroundImage) {
      var _glRectData$backgroun = glRectData.backgroundImage,
          _src = _glRectData$backgroun.src,
          size = _glRectData$backgroun.size,
          position = _glRectData$backgroun.position;
      loadImage(_src, function (image, lazy) {
        var rect = getBgImageRect(image, size, position, glRectData.borderWidth || 0, dimension, dpr);
        glRect.setTexture({
          image: image,
          rect: rect
        });

        if (lazy) {
          repaintCbk();
        }
      });
    }

    if (glRectData.text) {
      glRect.setTexture({
        image: getTextTexture(dimension, glRectData.text.value, glRectData.text.style, dpr)
      });
    } // if (glRectData.type === 'ScrollView' && glRectData.glTexture) {
    //   // console.log(glRectData.glTexture.toDataURL('image/png'))
    //   glRect.setTexture({ image: glRectData.glTexture, srcRect: [glRectData.x, glRectData.y, glRectData.width, glRectData.height]});
    // }


    if (glRectData.type === 'Video') {
      var video = VIDEOS["".concat(gl.canvas.id, "-").concat(glRectData.id)];

      if (video) {
        video.repaint = function () {
          return repaintCbk();
        };

        if (video.iData) {
          glRect.setTextureData({
            imageData: video.iData,
            width: video.vWidth,
            height: video.vHeight
          });
        }
      }
    }

    glRect.updateViewPort(); // const needUpdateTexture = !!(glRectData.type === 'ScrollView');

    glRect.draw();
  }

  return {
    loadImage: loadImage,
    resetGl: resetGl,
    repaint: function drawRects(gl, glRects, scrollGlrects) {
      resetGl(gl);
      glRects.forEach(function (item, idx) {
        // scrollview开启模板测试
        if (item.type === 'ScrollView') {
          // 清除模板缓存
          gl.clear(gl.STENCIL_BUFFER_BIT); // 开启模板测试

          gl.enable(gl.STENCIL_TEST); // 设置模板测试参数

          gl.stencilFunc(gl.ALWAYS, 1, 1); // 设置模板值操作

          gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE); // 绘制scrollview

          drawOneGlRect(gl, item); // 设置模板测试参数，只有滚动窗口内的才进行绘制

          gl.stencilFunc(gl.EQUAL, 1, 1); //设置模板测试后的操作

          gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
          scrollGlrects.forEach(function (scrollItem) {
            // if (scrollItem.y + scrollItem.height >= item.y && scrollItem.y <= item.y + item.height) {
            drawOneGlRect(gl, scrollItem, function () {
              drawRects(gl, glRects, scrollGlrects);
            }); // }
          }); // 关闭模板测试

          gl.disable(gl.STENCIL_TEST);
        } else {
          drawOneGlRect(gl, item, function () {
            drawRects(gl, glRects, scrollGlrects);
          });
        }
      });
    }
  };
}
/**
 * 像素点采样检测渲染异常，随机采样count个像素点，如果像素点中超过90%是相同的，则认为是有异常的
 * @param {Object} gl
 * @param {Number} count [采样点的数量]
 */

function renderDetection(gl, count) {
  var width = gl.canvas.width;
  var height = gl.canvas.height;
  var pixels = new Uint8Array(width * height * 3);
  gl.readPixels(0, 0, width, height, gl.RGB, gl.UNSIGNED_BYTE, pixels); // const result = [];

  var map = {};
  var maxKey = '';

  for (var i = 0; i < count; i++) {
    var row = Math.random() * width; // 取一行

    var column = Math.random() * height; // 取一列

    var p = 3 * row * width + 3 * column;
    var key = "".concat(pixels[p], "_").concat(pixels[p + 1], "_").concat(pixels[p + 2]);

    if (map[key]) {
      map[key] += 1;

      if (map[key] > map[maxKey]) {
        maxKey = key;
      }
    } else {
      map[key] = 1;
    }
  }

  pixels = null;

  if (map[maxKey] / count > 0.9) {
    return false;
  }

  return true;
}

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SCALE_KEY", function() { return SCALE_KEY; });
var SCALE_KEY = ['width', 'height', 'x', 'y', 'radius', 'borderWidth'];


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RenderContext; });
/* harmony import */ var color_rgba__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);
/* harmony import */ var color_rgba__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(color_rgba__WEBPACK_IMPORTED_MODULE_0__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
} // 格式化颜色数据


var normalizeColor = cached(function (color) {
  return color_rgba__WEBPACK_IMPORTED_MODULE_0___default()(color).map(function (c, i) {
    if (i === 3) {
      return c;
    }

    return c / 255;
  });
});
/**
 * @description 每个组件对应的渲染数据
 */

var RenderContext = /*#__PURE__*/function () {
  function RenderContext(id, type) {
    _classCallCheck(this, RenderContext);

    this.id = id;
    this.type = type;
    this.opacity = 1;
  }

  _createClass(RenderContext, [{
    key: "updateContours",
    value: function updateContours(_ref) {
      var _ref2 = _slicedToArray(_ref, 4),
          x = _ref2[0],
          y = _ref2[1],
          width = _ref2[2],
          height = _ref2[3];

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.originX = x;
      this.originY = y;
    }
  }, {
    key: "setOpacity",
    value: function setOpacity(v) {
      this.opacity = v;
    }
  }, {
    key: "setRadius",
    value: function setRadius(r) {
      if (typeof r === 'number') {
        this.radius = [r, r, r, r];
      } else {
        this.radius = r;
      }
    }
  }, {
    key: "setBorder",
    value: function setBorder(width, color) {
      this.borderWidth = width;
      this.borderColor = normalizeColor(color);
    }
  }, {
    key: "setBackgroundColor",
    value: function setBackgroundColor(color) {
      this.backgroundColor = normalizeColor(color);
    }
  }, {
    key: "setTexture",
    value: function setTexture(texture) {
      this.texture = texture;
      console.log(texture, texture.type);
    }
  }, {
    key: "setImage",
    value: function setImage(src, rect, srcRect) {
      this.image = {
        src: src,
        rect: rect,
        srcRect: srcRect
      };
    }
  }, {
    key: "setBackgroundImage",
    value: function setBackgroundImage(src, size, position) {
      this.backgroundImage = {
        src: src,
        size: size,
        position: position
      };
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this.text = text;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
      this.radius = [0, 0, 0, 0];
      this.borderWidth = 0;
      this.borderColor = [0, 0, 0, 0];
      this.backgroundColor = [0, 0, 0, 0];
      this.texture = null;
      this.image = null;
      this.backgroundImage = null;
      this.text = null;
    }
  }]);

  return RenderContext;
}();



/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @module  color-rgba */



var parse = __webpack_require__(22)
var hsl = __webpack_require__(24)

module.exports = function rgba (color) {
	// template literals
	if (Array.isArray(color) && color.raw) color = String.raw.apply(null, arguments)

	var values, i, l

	//attempt to parse non-array arguments
	var parsed = parse(color)

	if (!parsed.space) return []

	values = Array(3)
	values[0] = Math.min(Math.max(parsed.values[0], 0), 255)
	values[1] = Math.min(Math.max(parsed.values[1], 0), 255)
	values[2] = Math.min(Math.max(parsed.values[2], 0), 255)

	if (parsed.space[0] === 'h') {
		values = hsl.rgb(values)
	}

	values.push(Math.min(Math.max(parsed.alpha, 0), 1))

	return values
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module color-parse
 */



var names = __webpack_require__(23)

module.exports = parse

/**
 * Base hues
 * http://dev.w3.org/csswg/css-color/#typedef-named-hue
 */
//FIXME: use external hue detector
var baseHues = {
	red: 0,
	orange: 60,
	yellow: 120,
	green: 180,
	blue: 240,
	purple: 300
}

/**
 * Parse color from the string passed
 *
 * @return {Object} A space indicator `space`, an array `values` and `alpha`
 */
function parse (cstr) {
	var m, parts = [], alpha = 1, space

	if (typeof cstr === 'string') {
		//keyword
		if (names[cstr]) {
			parts = names[cstr].slice()
			space = 'rgb'
		}

		//reserved words
		else if (cstr === 'transparent') {
			alpha = 0
			space = 'rgb'
			parts = [0,0,0]
		}

		//hex
		else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
			var base = cstr.slice(1)
			var size = base.length
			var isShort = size <= 4
			alpha = 1

			if (isShort) {
				parts = [
					parseInt(base[0] + base[0], 16),
					parseInt(base[1] + base[1], 16),
					parseInt(base[2] + base[2], 16)
				]
				if (size === 4) {
					alpha = parseInt(base[3] + base[3], 16) / 255
				}
			}
			else {
				parts = [
					parseInt(base[0] + base[1], 16),
					parseInt(base[2] + base[3], 16),
					parseInt(base[4] + base[5], 16)
				]
				if (size === 8) {
					alpha = parseInt(base[6] + base[7], 16) / 255
				}
			}

			if (!parts[0]) parts[0] = 0
			if (!parts[1]) parts[1] = 0
			if (!parts[2]) parts[2] = 0

			space = 'rgb'
		}

		//color space
		else if (m = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
			var name = m[1]
			var isRGB = name === 'rgb'
			var base = name.replace(/a$/, '')
			space = base
			var size = base === 'cmyk' ? 4 : base === 'gray' ? 1 : 3
			parts = m[2].trim()
				.split(/\s*[,\/]\s*|\s+/)
				.map(function (x, i) {
					//<percentage>
					if (/%$/.test(x)) {
						//alpha
						if (i === size)	return parseFloat(x) / 100
						//rgb
						if (base === 'rgb') return parseFloat(x) * 255 / 100
						return parseFloat(x)
					}
					//hue
					else if (base[i] === 'h') {
						//<deg>
						if (/deg$/.test(x)) {
							return parseFloat(x)
						}
						//<base-hue>
						else if (baseHues[x] !== undefined) {
							return baseHues[x]
						}
					}
					return parseFloat(x)
				})

			if (name === base) parts.push(1)
			alpha = (isRGB) ? 1 : (parts[size] === undefined) ? 1 : parts[size]
			parts = parts.slice(0, size)
		}

		//named channels case
		else if (cstr.length > 10 && /[0-9](?:\s|\/)/.test(cstr)) {
			parts = cstr.match(/([0-9]+)/g).map(function (value) {
				return parseFloat(value)
			})

			space = cstr.match(/([a-z])/ig).join('').toLowerCase()
		}
	}

	//numeric case
	else if (!isNaN(cstr)) {
		space = 'rgb'
		parts = [cstr >>> 16, (cstr & 0x00ff00) >>> 8, cstr & 0x0000ff]
	}

	//array-like
	else if (Array.isArray(cstr) || cstr.length) {
		parts = [cstr[0], cstr[1], cstr[2]]
		space = 'rgb'
		alpha = cstr.length === 4 ? cstr[3] : 1
	}

	//object case - detects css cases of rgb and hsl
	else if (cstr instanceof Object) {
		if (cstr.r != null || cstr.red != null || cstr.R != null) {
			space = 'rgb'
			parts = [
				cstr.r || cstr.red || cstr.R || 0,
				cstr.g || cstr.green || cstr.G || 0,
				cstr.b || cstr.blue || cstr.B || 0
			]
		}
		else {
			space = 'hsl'
			parts = [
				cstr.h || cstr.hue || cstr.H || 0,
				cstr.s || cstr.saturation || cstr.S || 0,
				cstr.l || cstr.lightness || cstr.L || cstr.b || cstr.brightness
			]
		}

		alpha = cstr.a || cstr.alpha || cstr.opacity || 1

		if (cstr.opacity != null) alpha /= 100
	}

	return {
		space: space,
		values: parts,
		alpha: alpha
	}
}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module color-space/hsl
 */


var rgb = __webpack_require__(25);

module.exports = {
	name: 'hsl',
	min: [0,0,0],
	max: [360,100,100],
	channel: ['hue', 'saturation', 'lightness'],
	alias: ['HSL'],

	rgb: function(hsl) {
		var h = hsl[0] / 360,
				s = hsl[1] / 100,
				l = hsl[2] / 100,
				t1, t2, t3, rgb, val;

		if (s === 0) {
			val = l * 255;
			return [val, val, val];
		}

		if (l < 0.5) {
			t2 = l * (1 + s);
		}
		else {
			t2 = l + s - l * s;
		}
		t1 = 2 * l - t2;

		rgb = [0, 0, 0];
		for (var i = 0; i < 3; i++) {
			t3 = h + 1 / 3 * - (i - 1);
			if (t3 < 0) {
				t3++;
			}
			else if (t3 > 1) {
				t3--;
			}

			if (6 * t3 < 1) {
				val = t1 + (t2 - t1) * 6 * t3;
			}
			else if (2 * t3 < 1) {
				val = t2;
			}
			else if (3 * t3 < 2) {
				val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
			}
			else {
				val = t1;
			}

			rgb[i] = val * 255;
		}

		return rgb;
	}
};


//extend rgb
rgb.hsl = function(rgb) {
	var r = rgb[0]/255,
			g = rgb[1]/255,
			b = rgb[2]/255,
			min = Math.min(r, g, b),
			max = Math.max(r, g, b),
			delta = max - min,
			h, s, l;

	if (max === min) {
		h = 0;
	}
	else if (r === max) {
		h = (g - b) / delta;
	}
	else if (g === max) {
		h = 2 + (b - r) / delta;
	}
	else if (b === max) {
		h = 4 + (r - g)/ delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	}
	else if (l <= 0.5) {
		s = delta / (max + min);
	}
	else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * RGB space.
 *
 * @module  color-space/rgb
 */


module.exports = {
	name: 'rgb',
	min: [0,0,0],
	max: [255,255,255],
	channel: ['red', 'green', 'blue'],
	alias: ['RGB']
};


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "layoutChildren", function() { return layoutChildren; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateRealLayout", function() { return updateRealLayout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "restoreLayoutTree", function() { return restoreLayoutTree; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_getElementById", function() { return _getElementById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_getElementsByClassName", function() { return _getElementsByClassName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_getChildsByPos", function() { return _getChildsByPos; });
/* harmony import */ var _components_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// components



var constructorMap = {
  view: _components_index_js__WEBPACK_IMPORTED_MODULE_0__["View"],
  text: _components_index_js__WEBPACK_IMPORTED_MODULE_0__["Text"],
  image: _components_index_js__WEBPACK_IMPORTED_MODULE_0__["Image"],
  scrollview: _components_index_js__WEBPACK_IMPORTED_MODULE_0__["ScrollView"] // video: Video

};
/**
 * 节点初始化
 * @param {*} node 节点
 * @param {*} style 节点lightmode样式
 * @param {*} styleDark 节点darkmode样式
 * @param {*} isDarkMode 是否darkmode
 * @param {*} fontSize 字体大小
 */

function create(node, style) {
  var _this = this;

  var styleDark = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var isDarkMode = arguments.length > 3 ? arguments[3] : undefined;
  var fontSize = arguments.length > 4 ? arguments[4] : undefined;
  var _constructor = constructorMap[node.name];
  var children = node.children || [];
  var attr = node.attr || {};
  var id = attr.id || '';
  var args = Object.keys(attr).reduce(function (obj, key) {
    var value = attr[key];
    var attribute = key;

    if (key === 'id') {
      // 有id的话，记录下这个id对应的style和:active伪类的style
      obj.styleInit = Object.assign(obj.styleInit || {}, style[id] || {});

      if (style["".concat(id, ":active")]) {
        // 支持下active伪类
        obj.styleActive = Object.assign(obj.styleActive || {}, style["".concat(id, ":active")] || {});
      }

      if (styleDark[id]) {
        // 支持下darkmode
        obj.styleDarkInit = Object.assign(obj.styleDarkInit || {}, styleDark[id] || {});
      }

      if (styleDark["".concat(id, ":active")]) {
        // 支持下darkmode的active伪类
        obj.styleDarkActive = Object.assign(obj.styleDarkActive || {}, styleDark["".concat(id, ":active")] || {});
      }

      return obj;
    }

    if (key === 'class') {
      // 有class的话，记录下这个class对应的style和:active伪类的style
      value.split(/\s+/).forEach(function (oneClass) {
        obj.styleInit = Object.assign(obj.styleInit || {}, style[oneClass]);

        if (style["".concat(oneClass, ":active")]) {
          obj.styleActive = Object.assign(obj.styleActive || {}, style["".concat(oneClass, ":active")]);
        }

        if (styleDark[oneClass]) {
          obj.styleDarkInit = Object.assign(obj.styleDarkInit || {}, styleDark[oneClass]);
        }

        if (styleDark["".concat(oneClass, ":active")]) {
          obj.styleDarkActive = Object.assign(obj.styleDarkActive || {}, styleDark["".concat(oneClass, ":active")]);
        }
      });
      return obj;
    }

    if (key === 'style') {
      return obj;
    }

    if (/^data-/.test(key)) {
      var datakey = Object(_util__WEBPACK_IMPORTED_MODULE_1__["dash2camel"])(key.substring(5));
      !obj.dataset ? obj.dataset = _defineProperty({}, datakey, value) : obj.dataset[datakey] = value;
    }

    if (value === 'true') {
      obj[attribute] = true;
    } else if (value === 'false') {
      obj[attribute] = false;
    } else {
      obj[attribute] = value;
    }

    return obj;
  }, {}); // 用于后续元素查询

  args.idName = id;
  args.className = attr["class"] || '';
  var element = new _constructor(args);
  ['onclick', 'ontouchstart', 'ontouchmove', 'ontouchend', 'ontouchcancel'].forEach(function (evtName) {
    if (attr[evtName]) {
      var invokeMatches = args[evtName].match(/([a-zA-Z0-9]+)\((.+)\)/);
      var funcName = invokeMatches ? invokeMatches[1] : args[evtName];
      var funcParams = invokeMatches ? invokeMatches[2].split(',') : [];

      if (typeof _this._methods[funcName] === 'function') {
        var func = _this._methods[funcName];
        element.on(evtName.substring(2), function (e) {
          funcParams = funcParams.map(function (p) {
            if (p === '$event') {
              return e;
            }

            return eval(p);
          });
          func.apply(_this, !funcParams.length ? [e] : funcParams);
        });
      } else {
        console.warn("".concat(args[evtName], " is not a function"));
      }
    }
  });
  element.root = this;
  var s = _util__WEBPACK_IMPORTED_MODULE_1__["getElementStyle"].call(element, isDarkMode, false);

  if (element.type === 'Text') {
    if (typeof s.height === 'undefined') {
      element.computedStyle.height = s.lineHeight || s.fontSize;
      element.noWrapHeight = s.lineHeight || s.fontSize;
    } else {
      element.computedStyle.height = s.height;
      element.noWrapHeight = s.height;
    }

    if (typeof s.width === 'undefined') {
      element.computedStyle.width = this._getTextWidth(s, element.valueInit, fontSize);
    }

    var computedStyle = _util__WEBPACK_IMPORTED_MODULE_1__["getElementStyle"].call(element, isDarkMode);
    element.noWrapWidth = computedStyle.width;
  }

  children.forEach(function (childNode) {
    var childElement = create.call(_this, childNode, style, styleDark, isDarkMode, fontSize);
    element.add(childElement);
  }); // 创建新节点的时候，搜集下文本节点

  if (element.type === 'Text') {
    this.textManager.addTextNode(element);
  } // if (element.type === 'Video') {
  //   this._videos.push(element);
  //   if (attr.poster) {
  //     const poster = create.call(this, {
  //       name: 'image',
  //       attr: {
  //         src: attr.poster,
  //         styleInit: element.styleInit
  //       }
  //     }, {}, {}, isDarkMode, fontSize);
  //     element.add(poster);
  //     element._poster_ = poster;
  //   }
  //   const play = create.call(this, {
  //     name: 'view',
  //     attr: {
  //       styleInit: {
  //         position: 'absolute',
  //         top: 0,
  //         left: 0,
  //         right: 0,
  //         bottom: 0,
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         backgroundColor: 'rgba(0,0,0,0)'
  //       }
  //     }
  //   })
  //   const icon = create.call(this, {
  //     name: 'image',
  //     attr: {
  //       src: 'common/assets/play.png',
  //       styleInit: {
  //         width: 38,
  //         height: 38,
  //       },
  //       styleActive: {
  //         width: 38,
  //         height: 38,
  //       }
  //     }
  //   })
  //   icon.on('touchstart', () => { });
  //   icon.on('click', () => { });
  //   icon.on('touchend', function (e) {
  //     element.play();
  //     e.stopPropagation();
  //   });
  //   play.add(icon);
  //   element.add(play);
  //   element._play_ = play;
  // }


  var keys = [];
  var keysDark = [];

  for (var key in args.styleActive) {
    keys.push(key);
  }

  for (var _key in args.styleDarkActive) {
    keysDark.push(_key);
  }

  if (keys.length > 0 || keysDark.length > 0) {
    if (keys.length > 0) {
      element.hasActiveStyle = true; // 节点是否有active的style
    }

    if (keysDark.length > 0) {
      element.hasDarkActiveStyle = true; // 节点是否有darkmode下active的style
    }

    element.isActive = false; // 节点是否active了

    this.pseudoClassManager.addActiveNode(element);
  }

  return element;
}
/**
 * 格式化渲染相关的数据
 * @param {Array} children 子节点
 * @param {Boolean} isDarkMode 是否暗黑模式
 * @param {Number} fontSize 字体大小
 */

function layoutChildren(children, isDarkMode, fontSize) {
  var _this2 = this;

  var _loop = function _loop(i) {
    var child = children[i];
    var style = _util__WEBPACK_IMPORTED_MODULE_1__["getElementStyle"].call(child, isDarkMode);
    var computedStyle = _util__WEBPACK_IMPORTED_MODULE_1__["getElementStyle"].call(child, isDarkMode);
    child.layoutBox = child.layoutBox || {};
    ['left', 'top', 'width', 'height'].forEach(function (prop) {
      child.layoutBox[prop] = child.layout[prop];
    });
    child.realLayoutBox = child.realLayoutBox || {};
    ['left', 'top', 'width', 'height'].forEach(function (prop) {
      child.realLayoutBox[prop] = child.layoutBox[prop];
    });

    if (child.parent) {
      child.layoutBox.absoluteX = (child.parent.layoutBox.absoluteX || 0) + child.layoutBox.left;
      child.layoutBox.absoluteY = (child.parent.layoutBox.absoluteY || 0) + child.layoutBox.top; // child.realLayoutBox.realX = (child.parent.realLayoutBox.realX || 0) + child.realLayoutBox.left;
      // child.realLayoutBox.realY = (child.parent.realLayoutBox.realY || 0) + child.realLayoutBox.top;
    } else {
      child.layoutBox.absoluteX = child.layoutBox.left;
      child.layoutBox.absoluteY = child.layoutBox.top; // child.realLayoutBox.realX = child.realLayoutBox.left;
      // child.realLayoutBox.realY = child.realLayoutBox.top;
    }

    child.layoutBox.originalAbsoluteY = child.layoutBox.absoluteY;

    if (child.type === 'ScrollView') {
      // 滚动列表的画板尺寸和主画板保持一致
      Object(_util__WEBPACK_IMPORTED_MODULE_1__["nextTick"])(function () {
        child.updateRenderPort(_this2.renderport);
      });
    } else if (child.type === 'Text') {
      // 文本节点处理下ellipsis
      var width = child.layoutBox.width > child.parent.layoutBox.width ? child.parent.layoutBox.width : child.layoutBox.width;

      var textWidth = _this2._getTextWidth(style, child.valueInit);

      if (style.textOverflow === 'ellipsis' && style.whiteSpace === 'nowrap' && width + 0.5 < textWidth // todo hardcode处理，由于yoga会取整，这里我再加0.5的宽度
      ) {
          child.valueShow = _this2._parseText(style, child.valueInit, width, fontSize);
        } else if (style.textOverflow === 'ellipsis' && style.whiteSpace === 'nowrap' && width + 0.5 >= textWidth && child.valueShow !== child.valueInit) {
        child.valueShow = child.valueInit;
      }
    }

    if (child.glRect) {
      child.glRect = null;
    }

    if (computedStyle.display === 'none') {
      return "continue";
    } // 子节点的updateRenderData会收集渲染相关的数据


    child.updateRenderData && child.updateRenderData(computedStyle);
    layoutChildren.call(_this2, child.children, isDarkMode, fontSize);
  };

  for (var i = 0; i < children.length; i++) {
    var _ret = _loop(i);

    if (_ret === "continue") continue;
  }
}
function updateRealLayout(children, scale) {
  children.forEach(function (child) {
    child.realLayoutBox = child.realLayoutBox || {};
    ['left', 'top', 'width', 'height'].forEach(function (prop) {
      // child.realLayoutBox[prop] = data.layout[prop] * scale;
      child.realLayoutBox[prop] = child.layoutBox[prop] * scale;
    });

    if (child.parent) {
      // child.realLayoutBox.realX = (child.parent.realLayoutBox.realX || 0) + child.realLayoutBox.left;
      Object.defineProperty(child.realLayoutBox, 'realX', {
        configurable: true,
        enumerable: true,
        get: function get() {
          var res = (child.parent.realLayoutBox.realX || 0) + child.realLayoutBox.left;
          /**
           * 滚动列表事件处理
           */

          if (child.parent && child.parent.type === 'ScrollView') {
            res -= child.parent.scrollLeft * scale;
          }

          return res;
        }
      });
      Object.defineProperty(child.realLayoutBox, 'realY', {
        configurable: true,
        enumerable: true,
        get: function get() {
          var res = (child.parent.realLayoutBox.realY || 0) + child.realLayoutBox.top;
          /**
           * 滚动列表事件处理
           */

          if (child.parent && child.parent.type === 'ScrollView') {
            res -= child.parent.scrollTop * scale;
          }

          return res;
        }
      });
    } else {
      child.realLayoutBox.realX = child.realLayoutBox.left;
      child.realLayoutBox.realY = child.realLayoutBox.top;
    }

    updateRealLayout(child.children, scale);
  });
}
/**
 * 获取节点需要缓存的数据
 * @param {Array} children
 */

function getNodeData(children) {
  var layoutData = [];

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    layoutData[i] = {
      layoutBox: child.layoutBox,
      // 布局信息
      type: child.type,
      // 节点信息
      id: child.id,
      // 每个节点都有个id
      styleInit: child.styleInit,
      styleProp: child.styleProp,
      styleDarkInit: child.styleDarkInit,
      computedStyle: JSON.parse(JSON.stringify(child.computedStyle))
    };

    if (child.type === 'Text') {
      // 文本节点还要存下文本内容信息
      layoutData[i]['value'] = child.value;
      layoutData[i]['valueBreak'] = child.valueBreak;
    }

    if (child.children && child.children.length) {
      layoutData[i].children = getNodeData(child.children);
    } else {
      layoutData[i].children = [];
    }
  }

  return layoutData;
} // 恢复布局数据，需要保证节点树、节点样式完全一致


function restoreLayoutTree(children, layoutNodes) {
  var ret = true;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var node = layoutNodes[i];

    if (child.type === node.type && JSON.stringify(child.styleInit) === JSON.stringify(node.styleInit) && JSON.stringify(child.styleProp) === JSON.stringify(node.styleProp) && JSON.stringify(child.styleDarkInit) === JSON.stringify(node.styleDarkInit)) {
      child.layoutBox = node.layoutBox;

      if (child.type === 'text') {
        child.valueBreak = node.valueBreak;
      }

      if (child.children.length !== node.children.length) {
        ret = false;
      } else {
        ret = restoreLayoutTree(child.children, node.children);
      }

      if (!ret) break;
    } else {
      ret = false;
      break;
    }
  }

  return ret;
}
function _getElementById(tree, id) {
  var result = null;

  for (var i = 0; i < tree.children.length; i++) {
    var child = tree.children[i];

    if (child.idName === id) {
      result = child;
      break;
    } else if (child.children.length) {
      result = _getElementById(child, id);
      if (result) break;
    }
  }

  return result;
}
function _getElementsByClassName(tree) {
  var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var className = arguments.length > 2 ? arguments[2] : undefined;

  for (var i = 0; i < tree.children.length; i++) {
    var child = tree.children[i];

    if (child.className.split(/\s+/).indexOf(className) > -1) {
      list.push(child);
    }

    if (child.children.length) {
      _getElementsByClassName(child, list, className);
    }
  }

  return list;
}
function _getChildsByPos(tree, x, y) {
  var list = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var ret = [];

  for (var i = 0; i < tree.children.length; i++) {
    var child = tree.children[i];
    var box = child.realLayoutBox;

    if (box.realX <= x && x <= box.realX + box.width && box.realY <= y && y <= box.realY + box.height && child.computedStyle.display !== 'none') {
      if (child.children.length) {
        ret = _getChildsByPos(child, x, y, list);
      } else {
        list.push(child);
        ret.push(child);
      }
    }
  }

  if (ret.length === 0 && tree.computedStyle.display !== 'none') {
    // 子节点都没有，就是点击了tree
    list.push(tree);
    ret.push(tree);
  }

  return list;
}

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "View", function() { return _view_js__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _image_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Image", function() { return _image_js__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(31);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return _text_js__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _scrollview_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(32);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScrollView", function() { return _scrollview_js__WEBPACK_IMPORTED_MODULE_3__["default"]; });



 // import Video from './video.js';




/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return View; });
/* harmony import */ var _block_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(29);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
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




var View = /*#__PURE__*/function (_Block) {
  _inherits(View, _Block);

  var _super = _createSuper(View);

  function View(_ref) {
    var _this;

    var _ref$styleInit = _ref.styleInit,
        styleInit = _ref$styleInit === void 0 ? {} : _ref$styleInit,
        _ref$styleActive = _ref.styleActive,
        styleActive = _ref$styleActive === void 0 ? {} : _ref$styleActive,
        _ref$styleDarkInit = _ref.styleDarkInit,
        styleDarkInit = _ref$styleDarkInit === void 0 ? {} : _ref$styleDarkInit,
        _ref$styleDarkActive = _ref.styleDarkActive,
        styleDarkActive = _ref$styleDarkActive === void 0 ? {} : _ref$styleDarkActive,
        _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props,
        _ref$dataset = _ref.dataset,
        dataset = _ref$dataset === void 0 ? {} : _ref$dataset,
        _ref$idName = _ref.idName,
        idName = _ref$idName === void 0 ? '' : _ref$idName,
        _ref$className = _ref.className,
        className = _ref$className === void 0 ? '' : _ref$className;

    _classCallCheck(this, View);

    _this = _super.call(this, {
      props: props,
      dataset: dataset,
      idName: idName,
      className: className,
      styleInit: styleInit,
      styleActive: styleActive,
      styleDarkInit: styleDarkInit,
      styleDarkActive: styleDarkActive
    });
    _this.type = 'View';
    Object(_common_util_js__WEBPACK_IMPORTED_MODULE_1__["nextTick"])(function () {
      var style = _this.root.isDarkMode() ? _this.styleInit : _this.styleDarkInit;

      if (style.backgroundImage && _this.root && _this.root.canvasContext) {
        _this.root.canvasContext.postMessage && _this.root.canvasContext.postMessage({
          type: 'preload-image',
          data: {
            src: style.backgroundImage
          }
        });
      }
    });
    return _this;
  }

  _createClass(View, [{
    key: "destroySelf",
    value: function destroySelf() {
      this.isDestroyed = true;
      this.children = null;
    } // 有些节点仅仅作为容器，实际上不需要任何渲染逻辑，这里加个判断可以提高性能

  }, {
    key: "checkNeedRender",
    value: function checkNeedRender() {
      return true;
    } // 废弃

  }, {
    key: "render",
    value: function render(img) {} // 废弃

  }, {
    key: "loadImg",
    value: function loadImg(src) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _common_util_js__WEBPACK_IMPORTED_MODULE_1__["none"];
    } // 废弃

  }, {
    key: "insert",
    value: function insert(isDarkMode) {}
  }, {
    key: "updateRenderData",
    value: function updateRenderData(computedStyle) {
      if (!this.layoutBox) {
        return;
      }

      var renderer = this.root ? this.root.renderContext : this.renderContext;

      if (!this.glRect) {
        this.glRect = renderer.createRoundRect(this.id, this.type);
      }

      this.glRect.reset();
      var _this$layoutBox = this.layoutBox,
          width = _this$layoutBox.width,
          height = _this$layoutBox.height,
          absoluteX = _this$layoutBox.absoluteX,
          absoluteY = _this$layoutBox.absoluteY; // 设置渲染区域数据

      this.glRect.updateContours([absoluteX, absoluteY, width, height]); // 设置背景色数据

      if (computedStyle.backgroundColor) {
        this.glRect.setBackgroundColor(computedStyle.backgroundColor);
      } // 设置边框数据


      if (computedStyle.borderWidth) {
        this.glRect.setBorder(computedStyle.borderWidth, computedStyle.borderColor);
      } // 设置圆角数据


      var radius = this.getRadius(computedStyle);
      this.glRect.setRadius(radius);
      this.glRect.setOpacity(this.opacity);

      if (computedStyle.backgroundImage) {
        // 设置背景图片
        this.glRect.setBackgroundImage(computedStyle.backgroundImage, computedStyle.backgroundSize, computedStyle.backgroundPosition);
      }
    }
  }]);

  return View;
}(_block_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Block; });
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _common_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
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




var Block = /*#__PURE__*/function (_Element) {
  _inherits(Block, _Element);

  var _super = _createSuper(Block);

  function Block() {
    _classCallCheck(this, Block);

    return _super.apply(this, arguments);
  }

  _createClass(Block, [{
    key: "getRadius",
    value: function getRadius(computedStyle) {
      var borderRadius = computedStyle.borderRadius || 0;
      var borderLeftTopRadius = computedStyle.borderLeftTopRadius || 0;
      var borderRightTopRadius = computedStyle.borderRightTopRadius || 0;
      var borderLeftBottomRadius = computedStyle.borderLeftBottomRadius || 0;
      var borderRightBottomRadius = computedStyle.borderRightBottomRadius || 0;
      var tl = borderLeftTopRadius || borderRadius;
      var tr = borderRightTopRadius || borderRadius;
      var bl = borderLeftBottomRadius || borderRadius;
      var br = borderRightBottomRadius || borderRadius;
      return [tl, tr, br, bl];
    }
  }, {
    key: "updateContours",
    value: function updateContours() {
      var renderer = this.root.renderContext;
      var _this$layoutBox = this.layoutBox,
          width = _this$layoutBox.width,
          height = _this$layoutBox.height,
          absoluteX = _this$layoutBox.absoluteX,
          absoluteY = _this$layoutBox.absoluteY;

      if (!this.glRect) {
        this.glRect = renderer.createRoundRect(this.id);
      }

      this.glRect.updateContours([absoluteX, absoluteY, width, height]);
    }
  }, {
    key: "updateRenderData",
    value: function updateRenderData() {// 子组件自己实现
    }
  }, {
    key: "insert",
    value: function insert(isDarkMode) {
      var rect = this.glRect;
      var style = _common_util__WEBPACK_IMPORTED_MODULE_1__["getElementStyle"].call(this, isDarkMode);

      if (style.backgroundColor) {
        rect.setBackgroundColor(style.backgroundColor);
      }

      var radius = this.getRadius(isDarkMode);
      rect.setRadius(radius);

      if (style.borderWidth) {
        rect.setBorder(style.borderWidth, style.borderColor);
      }
    }
  }, {
    key: "radius",
    get: function get() {
      var _this$computedStyle = this.computedStyle,
          _this$computedStyle$b = _this$computedStyle.borderRadius,
          borderRadius = _this$computedStyle$b === void 0 ? 0 : _this$computedStyle$b,
          _this$computedStyle$b2 = _this$computedStyle.borderLeftTopRadius,
          borderLeftTopRadius = _this$computedStyle$b2 === void 0 ? 0 : _this$computedStyle$b2,
          _this$computedStyle$b3 = _this$computedStyle.borderRightTopRadius,
          borderRightTopRadius = _this$computedStyle$b3 === void 0 ? 0 : _this$computedStyle$b3,
          _this$computedStyle$b4 = _this$computedStyle.borderLeftBottomRadius,
          borderLeftBottomRadius = _this$computedStyle$b4 === void 0 ? 0 : _this$computedStyle$b4,
          _this$computedStyle$b5 = _this$computedStyle.borderRightBottomRadius,
          borderRightBottomRadius = _this$computedStyle$b5 === void 0 ? 0 : _this$computedStyle$b5;
      var tl = borderLeftTopRadius || borderRadius;
      var tr = borderRightTopRadius || borderRadius;
      var bl = borderLeftBottomRadius || borderRadius;
      var br = borderRightBottomRadius || borderRadius;
      return [tl, tr, br, bl];
    }
  }]);

  return Block;
}(_elements_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Image; });
/* harmony import */ var _block_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(29);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var Image = /*#__PURE__*/function (_Block) {
  _inherits(Image, _Block);

  var _super = _createSuper(Image);

  function Image(opts) {
    var _this;

    _classCallCheck(this, Image);

    var _opts$styleInit = opts.styleInit,
        styleInit = _opts$styleInit === void 0 ? {} : _opts$styleInit,
        _opts$styleActive = opts.styleActive,
        styleActive = _opts$styleActive === void 0 ? {} : _opts$styleActive,
        _opts$styleDarkInit = opts.styleDarkInit,
        styleDarkInit = _opts$styleDarkInit === void 0 ? {} : _opts$styleDarkInit,
        _opts$styleDarkActive = opts.styleDarkActive,
        styleDarkActive = _opts$styleDarkActive === void 0 ? {} : _opts$styleDarkActive,
        _opts$props = opts.props,
        props = _opts$props === void 0 ? {} : _opts$props,
        _opts$dataset = opts.dataset,
        dataset = _opts$dataset === void 0 ? {} : _opts$dataset,
        _opts$idName = opts.idName,
        idName = _opts$idName === void 0 ? '' : _opts$idName,
        _opts$className = opts.className,
        className = _opts$className === void 0 ? '' : _opts$className,
        _opts$src = opts.src,
        src = _opts$src === void 0 ? '' : _opts$src;
    _this = _super.call(this, {
      props: props,
      dataset: dataset,
      idName: idName,
      className: className,
      styleInit: styleInit,
      styleActive: styleActive,
      styleDarkInit: styleDarkInit,
      styleDarkActive: styleDarkActive
    });
    _this.imgsrc = src;
    Object.defineProperty(_assertThisInitialized(_this), "src", {
      get: function get() {
        return this.imgsrc;
      },
      set: function set(newValue) {
        if (newValue !== this.imgsrc) {
          this.imgsrc = newValue;
          this.glRect.setImage(newValue);
        }
      },
      enumerable: true,
      configurable: true
    });
    _this.type = 'Image';
    _this.renderBoxes = [];
    Object(_common_util_js__WEBPACK_IMPORTED_MODULE_1__["nextTick"])(function () {
      if (_this.root && _this.root.canvasContext) {
        _this.root.canvasContext.postMessage && _this.root.canvasContext.postMessage({
          type: 'preload-image',
          data: {
            src: _this.src
          }
        });
      }
    });
    return _this;
  } // 子类填充实现


  _createClass(Image, [{
    key: "destroySelf",
    value: function destroySelf() {
      this.isDestroyed = true;

      if (this.img) {
        this.img.onloadcbks = [];
        this.img.onload = null;
        this.img.onerror = null;
      }

      this.img = null;
      delete this.src;
    } // 废弃

  }, {
    key: "initImg",
    value: function initImg() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _common_util_js__WEBPACK_IMPORTED_MODULE_1__["none"];
    }
  }, {
    key: "render",
    value: function render() {
      var needEmitEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (!this.img) {
        return;
      }
    }
  }, {
    key: "insert",
    value: function insert(isDarkMode) {
      var _this2 = this;

      _get(_getPrototypeOf(Image.prototype), "insert", this).call(this, isDarkMode);

      this.glRect.setTexture({
        type: 'image',
        src: this.src
      });
      this.initImg(function () {
        _this2.render();
      });
    }
  }, {
    key: "updateRenderData",
    value: function updateRenderData(computedStyle) {
      if (!this.layoutBox) {
        return;
      }

      var renderer = this.root ? this.root.renderContext : this.renderContext;

      if (!this.glRect) {
        this.glRect = renderer.createRoundRect(this.id, this.type);
      }

      this.glRect.reset();
      var _this$layoutBox = this.layoutBox,
          width = _this$layoutBox.width,
          height = _this$layoutBox.height,
          absoluteX = _this$layoutBox.absoluteX,
          absoluteY = _this$layoutBox.absoluteY; // 设置渲染区域数据

      this.glRect.updateContours([absoluteX, absoluteY, width, height]); // 设置背景色数据

      if (computedStyle.backgroundColor) {
        this.glRect.setBackgroundColor(computedStyle.backgroundColor);
      } // 设置边框数据


      if (computedStyle.borderWidth) {
        this.glRect.setBorder(computedStyle.borderWidth, computedStyle.borderColor);
      }

      this.glRect.setOpacity(this.opacity); // 设置圆角数据

      var radius = this.getRadius(computedStyle);
      this.glRect.setRadius(radius); // 设置图片

      this.glRect.setImage(this.src);
    }
  }]);

  return Image;
}(_block_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Text; });
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
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




var Text = /*#__PURE__*/function (_Element) {
  _inherits(Text, _Element);

  var _super = _createSuper(Text);

  function Text(_ref) {
    var _this;

    var _ref$styleInit = _ref.styleInit,
        styleInit = _ref$styleInit === void 0 ? {} : _ref$styleInit,
        _ref$styleActive = _ref.styleActive,
        styleActive = _ref$styleActive === void 0 ? {} : _ref$styleActive,
        _ref$styleDarkInit = _ref.styleDarkInit,
        styleDarkInit = _ref$styleDarkInit === void 0 ? {} : _ref$styleDarkInit,
        _ref$styleDarkActive = _ref.styleDarkActive,
        styleDarkActive = _ref$styleDarkActive === void 0 ? {} : _ref$styleDarkActive,
        _ref$dataset = _ref.dataset,
        dataset = _ref$dataset === void 0 ? {} : _ref$dataset,
        _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props,
        _ref$idName = _ref.idName,
        idName = _ref$idName === void 0 ? '' : _ref$idName,
        _ref$className = _ref.className,
        className = _ref$className === void 0 ? '' : _ref$className,
        _ref$value = _ref.value,
        value = _ref$value === void 0 ? '' : _ref$value;

    _classCallCheck(this, Text);

    var valueInit = value; // 先存下初始化时的value

    _this = _super.call(this, {
      props: props,
      idName: idName,
      className: className,
      styleInit: styleInit,
      styleActive: styleActive,
      styleDarkInit: styleDarkInit,
      styleDarkActive: styleDarkActive,
      dataset: dataset
    });
    _this.type = 'Text';
    _this.valueShow = value; // 显示的时候的value

    _this.valueInit = valueInit;
    _this.renderBoxes = [];
    Object.defineProperty(_assertThisInitialized(_this), 'value', {
      get: function get() {
        return this.valueInit; // 初始化是的value
      },
      set: function set(newValue) {
        // console.log('set text value 1 ', newValue, this.valueInit);
        if (newValue !== this.valueInit) {
          // console.log('set text value 2 ', newValue, this.valueInit);
          this.valueInit = newValue;
          this.valueShow = newValue;
          this.computedStyle.width = this.root._getTextWidth(this.style, newValue, this.root.getFontSize());
          this.noWrapWidth = this.computedStyle.width;

          if (this.layoutBox.width > 0 && this.layoutBox.height > 0) {
            // 不显示的节点，改了wording也不reflow
            this.root.emit('reflow');
          }
        }
      },
      enumerable: true,
      configurable: true
    });
    return _this;
  }

  _createClass(Text, [{
    key: "beforeReflow",
    value: function beforeReflow() {
      this.computedStyle.width = this.noWrapWidth;
      this.computedStyle.height = this.noWrapHeight;
    }
  }, {
    key: "insert",
    value: function insert() {// this.render(isDarkMode)
    }
  }, {
    key: "updateContours",
    value: function updateContours() {
      if (!this.layoutBox) {
        return;
      }

      var box = this.layoutBox;
      var isDarkMode = this.root.isDarkMode();
      var style = _common_util_js__WEBPACK_IMPORTED_MODULE_1__["getElementStyle"].call(this, isDarkMode);

      if (box.width * 1 === 0 || box.height * 1 === 0) {
        // 宽度或者高度等于0，直接不画
        return;
      }

      var parent = this.parent;

      while (parent && parent.parent) {
        if (parent.styleInit.display === 'none') {
          return;
        }

        parent = parent.parent;
      }

      var boxWidth = box.width;
      var boxHeight = box.height;
      var styleNoWrap = style.whiteSpace === 'nowrap' && style.textOverflow !== 'ellipsis';

      if (!styleNoWrap && this.valueBreak && this.valueBreak.length) {
        boxWidth = this.parent.layoutBox.width - (this.parent.style.paddingLeft || 0) - (this.parent.style.paddingRight || 0);
        boxHeight = box.height;
      }

      var renderer = this.root.renderContext;
      this.glRect = renderer.createRoundRect(this.id, this.renderer, [box.absoluteX, box.absoluteY, boxWidth, boxHeight]);
      this.glRect.setTexture({
        type: 'text',
        value: this.valueShow,
        fontSize: style.fontSize || 12,
        textBaseline: 'top',
        font: "".concat(style.fontWeight || '', " ").concat((style.fontSize || 12) * this.root.getFontSize(), "px ").concat(style.fontFamily || _common_util_js__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_FONT_FAMILY"]),
        textAlign: style.textAlign || 'left',
        fillStyle: style.color || '#000'
      });
    }
  }, {
    key: "render",
    value: function render(isDarkMode) {}
  }, {
    key: "updateRenderData",
    value: function updateRenderData(computedStyle) {
      var box = this.layoutBox;

      if (box.width * 1 === 0 || box.height * 1 === 0) {
        // 宽度或者高度等于0，直接不画
        return;
      }

      var parent = this.parent;

      while (parent && parent.parent) {
        if (parent.styleInit.display === 'none') {
          return;
        }

        parent = parent.parent;
      }

      var boxWidth = box.width;
      var boxHeight = box.height;
      var styleNoWrap = computedStyle.whiteSpace === 'nowrap' && computedStyle.textOverflow !== 'ellipsis';

      if (!styleNoWrap && this.valueBreak && this.valueBreak.length) {
        boxWidth = this.parent.layoutBox.width - (this.parent.style.paddingLeft || 0) - (this.parent.style.paddingRight || 0);
        boxHeight = box.height;
      }

      var renderer = this.root.renderContext;

      if (!this.glRect) {
        this.glRect = renderer.createRoundRect(this.id, this.type);
      }

      this.glRect.reset();
      this.glRect.updateContours([box.absoluteX, box.absoluteY - 4, boxWidth, boxHeight + 8]);
      this.glRect.setText({
        value: {
          valueShow: this.valueShow,
          valueBreak: this.valueBreak
        },
        style: {
          drawX: box.absoluteX,
          drawY: box.absoluteY,
          fontSize: (computedStyle.fontSize || 12) * this.root.getFontSize(),
          fontWeight: computedStyle.fontWeight || '',
          fontFamily: computedStyle.fontFamily || _common_util_js__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_FONT_FAMILY"],
          lineHeight: computedStyle.lineHeight || computedStyle.fontSize || 12,
          textAlign: computedStyle.textAlign || 'left',
          textShadow: computedStyle.textShadow,
          whiteSpace: computedStyle.whiteSpace,
          textOverflow: computedStyle.textOverflow,
          color: computedStyle.color || '#000'
        }
      });
      this.glRect.setOpacity(this.opacity);
    }
  }]);

  return Text;
}(_elements_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ScrollView; });
/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var scroller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34);
/* harmony import */ var scroller__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(scroller__WEBPACK_IMPORTED_MODULE_2__);
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





var ScrollView = /*#__PURE__*/function (_View) {
  _inherits(ScrollView, _View);

  var _super = _createSuper(ScrollView);

  function ScrollView(_ref) {
    var _this;

    var _ref$styleInit = _ref.styleInit,
        styleInit = _ref$styleInit === void 0 ? {} : _ref$styleInit,
        _ref$styleActive = _ref.styleActive,
        styleActive = _ref$styleActive === void 0 ? {} : _ref$styleActive,
        _ref$styleDarkInit = _ref.styleDarkInit,
        styleDarkInit = _ref$styleDarkInit === void 0 ? {} : _ref$styleDarkInit,
        _ref$styleDarkActive = _ref.styleDarkActive,
        styleDarkActive = _ref$styleDarkActive === void 0 ? {} : _ref$styleDarkActive,
        _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props,
        _ref$dataset = _ref.dataset,
        dataset = _ref$dataset === void 0 ? {} : _ref$dataset,
        _ref$idName = _ref.idName,
        idName = _ref$idName === void 0 ? '' : _ref$idName,
        _ref$className = _ref.className,
        className = _ref$className === void 0 ? '' : _ref$className;

    _classCallCheck(this, ScrollView);

    _this = _super.call(this, {
      props: props,
      dataset: dataset,
      idName: idName,
      className: className,
      styleInit: styleInit,
      styleActive: styleActive,
      styleDarkInit: styleDarkInit,
      styleDarkActive: styleDarkActive
    });
    _this.type = 'ScrollView'; // 当前列表滚动的值

    _this.scrollTop = 0;
    _this.scrollLeft = 0; // 滚动处理器

    /*this.touch           = new Touch();*/

    _this.hasEventBind = false;
    _this.currentEvent = null;
    return _this;
  }

  _createClass(ScrollView, [{
    key: "_active",
    value: function _active() {
      if (this.scrollerObj) {
        this.scrollActive = true;
      }
    }
  }, {
    key: "_deactive",
    value: function _deactive() {
      if (this.scrollerObj) {
        this.scrollActive = false;
      }
    }
  }, {
    key: "destroySelf",
    value: function destroySelf() {
      this.isDestroyed = true;
      this.children = null;
      this.currentEvent = null;
      this.off('touchstart');
      this.off('touchmove');
      this.root && this.root.off('touchend');
      this.scrollerObj = null;
    }
    /**
     * 获取滚动列表内所有元素的高度和
     * 这里不能简单将所有子元素的高度累加，因为每个元素之间可能是有空隙的
     */

  }, {
    key: "updateRenderPort",
    value: function updateRenderPort(renderport) {
      var _this2 = this;

      if (this.hasEventBind) {
        return;
      }

      this.hasEventBind = true;
      this.root.scrollview = this;
      this.scrollerObj = new scroller__WEBPACK_IMPORTED_MODULE_2__["Scroller"](function (left, top, zoom) {
        // 可能被销毁了或者节点树还没准备好
        if (_this2.scrollActive && !_this2.isDestroyed) {
          _this2.traverseToChangeGlRect(_this2, left, top);

          _this2.root.repaint(false);

          _this2.currentEvent.type = 'scroll';
          _this2.currentEvent.currentTarget = _this2;

          _this2.emit('scroll', _this2.currentEvent);
        }
      }, {
        scrollingY: !!(this.scrollHeight > this.layoutBox.height),
        scrollingX: !!(this.scrollWidth > this.layoutBox.width)
      });
      this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);
      this.scrollActive = false;
      this.on('touchstart', function (e) {
        _this2.scrollActive = true;

        _this2.scrollerObj.doTouchStart(e.touches, e.timeStamp);

        _this2.currentEvent = e;
      });
      this.on('touchmove', function (e) {
        _this2.scrollerObj.doTouchMove(e.touches, e.timeStamp);

        _this2.currentEvent = e;
      }); // 这里不应该是监听scrollview的touchend事件而是屏幕的touchend事件

      this.root.on('touchend', function (e) {
        _this2.scrollerObj.doTouchEnd(e.timeStamp);

        _this2.currentEvent = e;
      });
    }
    /**
     *
     * @param {*} node
     * @param {*} x
     * @param {*} y
     */

  }, {
    key: "traverseToChangeGlRect",
    value: function traverseToChangeGlRect(node) {
      var _this3 = this;

      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var glRect = node.glRect;

      if (node.type !== "ScrollView" && glRect) {
        glRect.x = glRect.originX - x;
        glRect.y = glRect.originY - y;

        if (node.type === 'Text') {
          glRect.text.style.drawX -= x;
          glRect.text.style.drawY -= y;
        }
      } else {
        this.scrollTop = y;
        this.scrollLeft = x;
      } // @TODO: 多个scrollview嵌套的情况


      node.children.forEach(function (child) {
        _this3.traverseToChangeGlRect(child, x, y);
      });
    }
  }, {
    key: "scrollHeight",
    get: function get() {
      // scrollview为空的情况
      if (!this.children.length) {
        return 0;
      }

      var last = this.children[this.children.length - 1];
      return last.layoutBox.top + last.layoutBox.height;
    }
  }, {
    key: "scrollWidth",
    get: function get() {
      // scrollview为空的情况
      if (!this.children.length) {
        return 0;
      }

      var last = this.children[this.children.length - 1];
      return last.layoutBox.left + last.layoutBox.width;
    }
  }]);

  return ScrollView;
}(_view_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 33 */,
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    if (true) {
        // AMD
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(35), __webpack_require__(36)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function (exports, animate, Scroller) {
    exports.animate = animate;
    exports.Scroller = Scroller;
}));


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

/**
 * Generic animation class with support for dropped frames both optional easing and duration.
 *
 * Optional duration is useful when the lifetime is defined by another condition than time
 * e.g. speed of an animating object, etc.
 *
 * Dropped frame logic allows to keep using the same updater logic independent from the actual
 * rendering. This eases a lot of cases where it might be pretty complex to break down a state
 * based on the pure time difference.
 */
(function (root, factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function (exports) {
    var global = typeof window === 'undefined' ? this : window
    var time = Date.now || function () {
        return +new Date();
    };
    var desiredFrames = 60;
    var millisecondsPerSecond = 1000;
    var running = {};
    var counter = 1;

    /**
     * A requestAnimationFrame wrapper / polyfill.
     *
     * @param callback {Function} The callback to be invoked before the next repaint.
     * @param root {HTMLElement} The root element for the repaint
     */
    exports.requestAnimationFrame = (function () {
        // Check for request animation Frame support
        var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
        var isNative = !!requestFrame;

        if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
            isNative = false;
        }

        if (isNative) {
            return function (callback, root) {
                requestFrame(callback, root);
            };
        }

        var TARGET_FPS = 60;
        var requests = {};
        var requestCount = 0;
        var rafHandle = 1;
        var intervalHandle = null;
        var lastActive = +new Date();

        return function (callback, root) {
            var callbackHandle = rafHandle++;

            // Store callback
            requests[callbackHandle] = callback;
            requestCount++;

            // Create timeout at first request
            if (intervalHandle === null) {

                intervalHandle = setInterval(function () {

                    var time = +new Date();
                    var currentRequests = requests;

                    // Reset data structure before executing callbacks
                    requests = {};
                    requestCount = 0;

                    for(var key in currentRequests) {
                        if (currentRequests.hasOwnProperty(key)) {
                            currentRequests[key](time);
                            lastActive = time;
                        }
                    }

                    // Disable the timeout when nothing happens for a certain
                    // period of time
                    if (time - lastActive > 2500) {
                        clearInterval(intervalHandle);
                        intervalHandle = null;
                    }

                }, 1000 / TARGET_FPS);
            }

            return callbackHandle;
        };

    })();

    /**
     * Stops the given animation.
     *
     * @param id {Integer} Unique animation ID
     * @return {Boolean} Whether the animation was stopped (aka, was running before)
     */
    exports.stop = function (id) {
        var cleared = (running[id] !== null);
        if (cleared) {
            running[id] = null;
        }

        return cleared;
    };


    /**
     * Whether the given animation is still running.
     *
     * @param id {Integer} Unique animation ID
     * @return {Boolean} Whether the animation is still running
     */
    exports.isRunning = function (id) {
        return running[id] !== null;
    };


    /**
     * Start the animation.
     *
     * @param stepCallback {Function} Pointer to function which is executed on every step.
     *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
     * @param verifyCallback {Function} Executed before every animation step.
     *   Signature of the method should be `function() { return continueWithAnimation; }`
     * @param completedCallback {Function}
     *   Signature of the method should be `function(droppedFrames, finishedAnimation, optional wasFinished) {}`
     * @param duration {Integer} Milliseconds to run the animation
     * @param easingMethod {Function} Pointer to easing function
     *   Signature of the method should be `function(percent) { return modifiedValue; }`
     * @param root {Element} Render root. Used for internal usage of requestAnimationFrame.
     * @return {Integer} Identifier of animation. Can be used to stop it any time.
     */
    exports.start = function (stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
        var start = time();
        var lastFrame = start;
        var percent = 0;
        var dropCounter = 0;
        var id = counter++;

        // Compacting running db automatically every few new animations
        if (id % 20 === 0) {
            var newRunning = {};
            for (var usedId in running) {
                newRunning[usedId] = true;
            }
            running = newRunning;
        }

        // This is the internal step method which is called every few milliseconds
        var step = function (virtual) {

            // Normalize virtual value
            var render = virtual !== true;

            // Get current time
            var now = time();

            // Verification is executed before next animation step
            if (!running[id] || (verifyCallback && !verifyCallback(id))) {

                running[id] = null;
                completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
                return;

            }

            // For the current rendering to apply let's update omitted steps in memory.
            // This is important to bring internal state variables up-to-date with progress in time.
            if (render) {

                var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
                for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
                    step(true);
                    dropCounter++;
                }

            }

            // Compute percent value
            if (duration) {
                percent = (now - start) / duration;
                if (percent > 1) {
                    percent = 1;
                }
            }

            // Execute step callback, then...
            var value = easingMethod ? easingMethod(percent) : percent;
            if ((stepCallback(value, now, render) === false || percent === 1) && render) {
                running[id] = null;
                completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration === undefined);
            } else if (render) {
                lastFrame = now;
                exports.requestAnimationFrame(step, root);
            }
        };

        // Mark as running
        running[id] = true;

        // Init first step
        exports.requestAnimationFrame(step, root);

        // Return unique animation ID
        return id;
    };
}));


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

(function (root, factory) {
    if (true) {
        // AMD
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(35)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function (animate) {
    var NOOP = function () {};

    /**
     * A pure logic 'component' for 'virtual' scrolling/zooming.
     */
    var Scroller = function (callback, options) {
        this.__callback = callback;

        this.options = {
            /** Enable scrolling on x-axis */
            scrollingX: true,

            /** Enable scrolling on y-axis */
            scrollingY: true,

            /** Enable animations for deceleration, snap back, zooming and scrolling */
            animating: true,

            /** duration for animations triggered by scrollTo/zoomTo */
            animationDuration: 250,

            /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
            bouncing: true,

            /** Enable locking to the main axis if user moves only slightly on one of them at start */
            locking: true,

            /** Enable pagination mode (switching between full page content panes) */
            paging: false,

            /** Enable snapping of content to a configured pixel grid */
            snapping: false,

            /** Enable zooming of content via API, fingers and mouse wheel */
            zooming: false,

            /** Minimum zoom level */
            minZoom: 0.5,

            /** Maximum zoom level */
            maxZoom: 3,

            /** Multiply or decrease scrolling speed **/
            speedMultiplier: 1,

            /** Callback that is fired on the later of touch end or deceleration end,
                provided that another scrolling action has not begun. Used to know
                when to fade out a scrollbar. */
            scrollingComplete: NOOP,

            /** This configures the amount of change applied to deceleration when reaching boundaries  **/
            penetrationDeceleration : 0.03,

            /** This configures the amount of change applied to acceleration when reaching boundaries  **/
            penetrationAcceleration : 0.08
        };

        for (var key in options) {
            this.options[key] = options[key];
        }
    };


    // Easing Equations (c) 2003 Robert Penner, all rights reserved.
    // Open source under the BSD License.

    /**
     * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
     **/
    var easeOutCubic = function (pos) {
        return (Math.pow((pos - 1), 3) + 1);
    };

    /**
     * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
     **/
    var easeInOutCubic = function (pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 3);
        }

        return 0.5 * (Math.pow((pos - 2), 3) + 2);
    };


    Scroller.prototype = {

        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS :: STATUS
          ---------------------------------------------------------------------------
        */

        /** {Boolean} Whether only a single finger is used in touch handling */
        __isSingleTouch: false,

        /** {Boolean} Whether a touch event sequence is in progress */
        __isTracking: false,

        /** {Boolean} Whether a deceleration animation went to completion. */
        __didDecelerationComplete: false,

        /**
         * {Boolean} Whether a gesture zoom/rotate event is in progress. Activates when
         * a gesturestart event happens. This has higher priority than dragging.
         */
        __isGesturing: false,

        /**
         * {Boolean} Whether the user has moved by such a distance that we have enabled
         * dragging mode. Hint: It's only enabled after some pixels of movement to
         * not interrupt with clicks etc.
         */
        __isDragging: false,

        /**
         * {Boolean} Not touching and dragging anymore, and smoothly animating the
         * touch sequence using deceleration.
         */
        __isDecelerating: false,

        /**
         * {Boolean} Smoothly animating the currently configured change
         */
        __isAnimating: false,



        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS :: DIMENSIONS
          ---------------------------------------------------------------------------
        */

        /** {Integer} Viewport left boundary */
        __clientLeft: 0,

        /** {Integer} Viewport right boundary */
        __clientTop: 0,

        /** {Integer} Viewport width */
        __clientWidth: 0,

        /** {Integer} Viewport height */
        __clientHeight: 0,

        /** {Integer} Full content's width */
        __contentWidth: 0,

        /** {Integer} Full content's height */
        __contentHeight: 0,

        /** {Integer} Snapping width for content */
        __snapWidth: 100,

        /** {Integer} Snapping height for content */
        __snapHeight: 100,

        /** {Number} Zoom level */
        __zoomLevel: 1,

        /** {Number} Scroll position on x-axis */
        __scrollLeft: 0,

        /** {Number} Scroll position on y-axis */
        __scrollTop: 0,

        /** {Integer} Maximum allowed scroll position on x-axis */
        __maxScrollLeft: 0,

        /** {Integer} Maximum allowed scroll position on y-axis */
        __maxScrollTop: 0,

        /* {Number} Scheduled left position (final position when animating) */
        __scheduledLeft: 0,

        /* {Number} Scheduled top position (final position when animating) */
        __scheduledTop: 0,

        /* {Number} Scheduled zoom level (final scale when animating) */
        __scheduledZoom: 0,



        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS :: LAST POSITIONS
          ---------------------------------------------------------------------------
        */

        /** {Number} Left position of finger at start */
        __lastTouchLeft: null,

        /** {Number} Top position of finger at start */
        __lastTouchTop: null,

        /** {Date} Timestamp of last move of finger. Used to limit tracking range for deceleration speed. */
        __lastTouchMove: null,

        /** {Array} List of positions, uses three indexes for each state: left, top, timestamp */
        __positions: null,



        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS :: DECELERATION SUPPORT
          ---------------------------------------------------------------------------
        */

        /** {Integer} Minimum left scroll position during deceleration */
        __minDecelerationScrollLeft: null,

        /** {Integer} Minimum top scroll position during deceleration */
        __minDecelerationScrollTop: null,

        /** {Integer} Maximum left scroll position during deceleration */
        __maxDecelerationScrollLeft: null,

        /** {Integer} Maximum top scroll position during deceleration */
        __maxDecelerationScrollTop: null,

        /** {Number} Current factor to modify horizontal scroll position with on every step */
        __decelerationVelocityX: null,

        /** {Number} Current factor to modify vertical scroll position with on every step */
        __decelerationVelocityY: null,



        /*
          ---------------------------------------------------------------------------
          PUBLIC API
          ---------------------------------------------------------------------------
        */

        /**
         * Configures the dimensions of the client (outer) and content (inner) elements.
         * Requires the available space for the outer element and the outer size of the inner element.
         * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
         *
         * @param clientWidth {Integer ? null} Inner width of outer element
         * @param clientHeight {Integer ? null} Inner height of outer element
         * @param contentWidth {Integer ? null} Outer width of inner element
         * @param contentHeight {Integer ? null} Outer height of inner element
         */
        setDimensions : function (clientWidth, clientHeight, contentWidth, contentHeight) {
            // Only update values which are defined
            if (clientWidth !== null) {
                this.__clientWidth = clientWidth;
            }

            if (clientHeight !== null) {
                this.__clientHeight = clientHeight;
            }

            if (contentWidth !== null) {
                this.__contentWidth = contentWidth;
            }

            if (contentHeight !== null) {
                this.__contentHeight = contentHeight;
            }

            // Refresh maximums
            this.__computeScrollMax();

            // Refresh scroll position
            this.scrollTo(this.__scrollLeft, this.__scrollTop, true);
        },


        /**
         * Sets the client coordinates in relation to the document.
         *
         * @param left {Integer ? 0} Left position of outer element
         * @param top {Integer ? 0} Top position of outer element
         */
        setPosition : function (left, top) {
            this.__clientLeft = left || 0;
            this.__clientTop = top || 0;
        },


        /**
         * Configures the snapping (when snapping is active)
         *
         * @param width {Integer} Snapping width
         * @param height {Integer} Snapping height
         */
        setSnapSize : function (width, height) {
            this.__snapWidth = width;
            this.__snapHeight = height;
        },


        /**
         * Returns the scroll position and zooming values
         *
         * @return {Map} `left` and `top` scroll position and `zoom` level
         */
        getValues : function () {
            return {
                left: this.__scrollLeft,
                top: this.__scrollTop,
                right: this.__scrollLeft + this.__clientWidth/this.__zoomLevel,
                bottom: this.__scrollTop + this.__clientHeight/this.__zoomLevel,
                zoom: this.__zoomLevel
            };
        },


        /**
         * Get point in in content space from scroll coordinates.
         */
        getPoint : function (scrollLeft, scrollTop) {
            var values = this.getValues();

            return {
                left : scrollLeft / values.zoom,
                top : scrollTop / values.zoom
            };
        },


        /**
         * Returns the maximum scroll values
         *
         * @return {Map} `left` and `top` maximum scroll values
         */
        getScrollMax : function () {
            return {
                left: this.__maxScrollLeft,
                top: this.__maxScrollTop
            };
        },


        /**
         * Zooms to the given level. Supports optional animation. Zooms
         * the center when no coordinates are given.
         *
         * @param level {Number} Level to zoom to
         * @param isAnimated {Boolean ? false} Whether to use animation
         * @param fixedLeft {Number ? undefined} Stationary point's left coordinate (vector in client space)
         * @param fixedTop {Number ? undefined} Stationary point's top coordinate (vector in client space)
         * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
         */
        zoomTo : function (level, isAnimated, fixedLeft, fixedTop, callback) {
            if (!this.options.zooming) {
                throw new Error("Zooming is not enabled!");
            }

            // Add callback if exists
            if(callback) {
                this.__zoomComplete = callback;
            }

            // Stop deceleration
            if (this.__isDecelerating) {
                animate.stop(this.__isDecelerating);
                this.__isDecelerating = false;
            }

            var oldLevel = this.__zoomLevel;

            // Normalize fixed point to center of viewport if not defined
            if (fixedLeft === undefined) {
                fixedLeft = this.__clientWidth / 2;
            }

            if (fixedTop === undefined) {
                fixedTop = this.__clientHeight / 2;
            }

            // Limit level according to configuration
            level = Math.max(Math.min(level, this.options.maxZoom), this.options.minZoom);

            // Recompute maximum values while temporary tweaking maximum scroll ranges
            this.__computeScrollMax(level);

            // Recompute left and top scroll positions based on new zoom level.
            // Choosing the new viewport so that the origin's position remains
            // fixed, we have central dilation about the origin.
            // * Fixed point, $F$, remains stationary in content space and in the
            // viewport.
            // * Initial scroll position, $S_i$, in content space.
            // * Final scroll position, $S_f$, in content space.
            // * Initial scaling factor, $k_i$.
            // * Final scaling factor, $k_f$.
            //
            // * $S_i \mapsto S_f$.
            // * $(S_i - F) k_i = (S_f - F) k_f$.
            // * $(S_i - F) k_i/k_f = (S_f - F)$.
            // * $S_f = F + (S_i - F) k_i/k_f$.
            //
            // Fixed point location, $\vector{f} = (F - S_i) k_i$.
            // * $F = S_i + \vector{f}/k_i$.
            // * $S_f = S_i + \vector{f}/k_i + (S_i - S_i - \vector{f}/k_i) k_i/k_f$.
            // * $S_f = S_i + \vector{f}/k_i - \vector{f}/k_f$.
            // * $S_f k_f = S_i k_f + (k_f/k_i - 1)\vector{f}$.
            // * $S_f k_f = (k_f/k_i)(S_i k_i) + (k_f/k_i - 1) \vector{f}$.
            var k = level / oldLevel;
            var left = k*(this.__scrollLeft + fixedLeft) - fixedLeft;
            var top = k*(this.__scrollTop + fixedTop) - fixedTop;

            // Limit x-axis
            if (left > this.__maxScrollLeft) {
                left = this.__maxScrollLeft;
            } else if (left < 0) {
                left = 0;
            }

            // Limit y-axis
            if (top > this.__maxScrollTop) {
                top = this.__maxScrollTop;
            } else if (top < 0) {
                top = 0;
            }

            // Push values out
            this.__publish(left, top, level, isAnimated);
        },


        /**
         * Zooms the content by the given factor.
         *
         * @param factor {Number} Zoom by given factor
         * @param isAnimated {Boolean ? false} Whether to use animation
         * @param originLeft {Number ? 0} Zoom in at given left coordinate
         * @param originTop {Number ? 0} Zoom in at given top coordinate
         * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
         */
        zoomBy : function (factor, isAnimated, originLeft, originTop, callback) {
            this.zoomTo(this.__zoomLevel * factor, isAnimated, originLeft, originTop, callback);
        },


        /**
         * Scrolls to the given position. Respect limitations and snapping automatically.
         *
         * @param left {Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
         * @param top {Number?null} Vertical scroll position, keeps current if value is <code>null</code>
         * @param isAnimated {Boolean?false} Whether the scrolling should happen using an animation
         * @param zoom {Number} [1.0] Zoom level to go to
         */
        scrollTo : function (left, top, isAnimated, zoom) {
            // Stop deceleration
            if (this.__isDecelerating) {
                animate.stop(this.__isDecelerating);
                this.__isDecelerating = false;
            }

            // Correct coordinates based on new zoom level
            if (zoom !== undefined && zoom !== this.__zoomLevel) {
                if (!this.options.zooming) {
                    throw new Error("Zooming is not enabled!");
                }

                left *= zoom;
                top *= zoom;

                // Recompute maximum values while temporary tweaking maximum scroll ranges
                this.__computeScrollMax(zoom);
            } else {
                // Keep zoom when not defined
                zoom = this.__zoomLevel;
            }

            if (!this.options.scrollingX) {
                left = this.__scrollLeft;
            } else {
                if (this.options.paging) {
                    left = Math.round(left / this.__clientWidth) * this.__clientWidth;
                } else if (this.options.snapping) {
                    left = Math.round(left / this.__snapWidth) * this.__snapWidth;
                }
            }

            if (!this.options.scrollingY) {
                top = this.__scrollTop;
            } else {
                if (this.options.paging) {
                    top = Math.round(top / this.__clientHeight) * this.__clientHeight;
                } else if (this.options.snapping) {
                    top = Math.round(top / this.__snapHeight) * this.__snapHeight;
                }
            }

            // Limit for allowed ranges
            left = Math.max(Math.min(this.__maxScrollLeft, left), 0);
            top = Math.max(Math.min(this.__maxScrollTop, top), 0);

            // Don't animate when no change detected, still call publish to make sure
            // that rendered position is really in-sync with internal data
            if (left === this.__scrollLeft && top === this.__scrollTop) {
                isAnimated = false;
            }

            // Publish new values
            this.__publish(left, top, zoom, isAnimated);
        },


        /**
         * Scroll by the given offset
         *
         * @param left {Number ? 0} Scroll x-axis by given offset
         * @param top {Number ? 0} Scroll x-axis by given offset
         * @param isAnimated {Boolean ? false} Whether to animate the given change
         */
        scrollBy : function (left, top, isAnimated) {
            var startLeft = this.__isAnimating ? this.__scheduledLeft : this.__scrollLeft;
            var startTop = this.__isAnimating ? this.__scheduledTop : this.__scrollTop;

            this.scrollTo(startLeft + (left || 0), startTop + (top || 0), isAnimated);
        },


        /*
          ---------------------------------------------------------------------------
          EVENT CALLBACKS
          ---------------------------------------------------------------------------
        */

        /**
         * Mouse wheel handler for zooming support
         */
        doMouseZoom : function (wheelDelta, timeStamp, pageX, pageY) {
            var change = wheelDelta > 0 ? 0.97 : 1.03;

            return this.zoomTo(this.__zoomLevel * change, false, pageX - this.__clientLeft, pageY - this.__clientTop);
        },


        /**
         * Touch start handler for scrolling support
         */
        doTouchStart : function (touches, timeStamp) {
            // Array-like check is enough here
            if (touches.length === undefined) {
                throw new Error("Invalid touch list: " + touches);
            }

            if (timeStamp instanceof Date) {
                timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
                throw new Error("Invalid timestamp value: " + timeStamp);
            }

            // Reset interruptedAnimation flag
            this.__interruptedAnimation = true;

            // Stop deceleration
            if (this.__isDecelerating) {
                animate.stop(this.__isDecelerating);
                this.__isDecelerating = false;
                this.__interruptedAnimation = true;
            }

            // Stop animation
            if (this.__isAnimating) {
                animate.stop(this.__isAnimating);
                this.__isAnimating = false;
                this.__interruptedAnimation = true;
            }

            // Use center point when dealing with two fingers
            var currentTouchLeft, currentTouchTop;
            var isSingleTouch = touches.length === 1;
            if (isSingleTouch) {
                currentTouchLeft = touches[0].pageX;
                currentTouchTop = touches[0].pageY;
            } else {
                currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
                currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
            }

            // Store initial positions
            this.__initialTouchLeft = currentTouchLeft;
            this.__initialTouchTop = currentTouchTop;

            // Store current zoom level
            this.__zoomLevelStart = this.__zoomLevel;

            // Store initial touch positions
            this.__lastTouchLeft = currentTouchLeft;
            this.__lastTouchTop = currentTouchTop;

            // Store initial move time stamp
            this.__lastTouchMove = timeStamp;

            // Reset initial scale
            this.__lastScale = 1;

            // Reset locking flags
            this.__enableScrollX = !isSingleTouch && this.options.scrollingX;
            this.__enableScrollY = !isSingleTouch && this.options.scrollingY;

            // Reset tracking flag
            this.__isTracking = true;

            // Reset deceleration complete flag
            this.__didDecelerationComplete = false;

            // Dragging starts directly with two fingers, otherwise lazy with an offset
            this.__isDragging = !isSingleTouch;

            // Some features are disabled in multi touch scenarios
            this.__isSingleTouch = isSingleTouch;

            // Clearing data structure
            this.__positions = [];
        },


        /**
         * Touch move handler for scrolling support
         * @param {Number} [1.0] scale - ....
         */
        doTouchMove : function (touches, timeStamp, scale) {
            // Array-like check is enough here
            if (touches.length === undefined) {
                throw new Error("Invalid touch list: " + touches);
            }

            if (timeStamp instanceof Date) {
                timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
                throw new Error("Invalid timestamp value: " + timeStamp);
            }

            // Ignore event when tracking is not enabled (event might be outside of element)
            if (!this.__isTracking) {
                return;
            }

            var currentTouchLeft, currentTouchTop;

            // Compute move based around of center of fingers
            if (touches.length === 2) {
                currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
                currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
            } else {
                currentTouchLeft = touches[0].pageX;
                currentTouchTop = touches[0].pageY;
            }

            var positions = this.__positions;

            // Are we already is dragging mode?
            if (this.__isDragging) {
                // Compute move distance
                var moveX = currentTouchLeft - this.__lastTouchLeft;
                var moveY = currentTouchTop - this.__lastTouchTop;

                // Read previous scroll position and zooming
                var scrollLeft = this.__scrollLeft;
                var scrollTop = this.__scrollTop;
                var level = this.__zoomLevel;

                // Work with scaling
                if (scale !== undefined && this.options.zooming) {
                    var oldLevel = level;

                    // Recompute level based on previous scale and new scale
                    level = level / this.__lastScale * scale;

                    // Limit level according to configuration
                    level = Math.max(Math.min(level, this.options.maxZoom), this.options.minZoom);

                    // Only do further compution when change happened
                    if (oldLevel !== level) {
                        // Compute relative event position to container
                        var currentTouchLeftRel = currentTouchLeft - this.__clientLeft;
                        var currentTouchTopRel = currentTouchTop - this.__clientTop;

                        // Recompute left and top coordinates based on new zoom level
                        scrollLeft = ((currentTouchLeftRel + scrollLeft) * level / oldLevel) - currentTouchLeftRel;
                        scrollTop = ((currentTouchTopRel + scrollTop) * level / oldLevel) - currentTouchTopRel;

                        // Recompute max scroll values
                        this.__computeScrollMax(level);
                    }
                }

                if (this.__enableScrollX) {
                    scrollLeft -= moveX * this.options.speedMultiplier;
                    var maxScrollLeft = this.__maxScrollLeft;

                    if (scrollLeft > maxScrollLeft || scrollLeft < 0) {
                        // Slow down on the edges
                        if (this.options.bouncing) {
                            scrollLeft += (moveX / 2  * this.options.speedMultiplier);
                        } else if (scrollLeft > maxScrollLeft) {
                            scrollLeft = maxScrollLeft;
                        } else {
                            scrollLeft = 0;
                        }
                    }
                }

                // Compute new vertical scroll position
                if (this.__enableScrollY) {
                    scrollTop -= moveY * this.options.speedMultiplier;
                    var maxScrollTop = this.__maxScrollTop;

                    if (scrollTop > maxScrollTop || scrollTop < 0) {
                        // Slow down on the edges
                        if (this.options.bouncing) {
                            scrollTop += (moveY / 2 * this.options.speedMultiplier);
                        } else if (scrollTop > maxScrollTop) {
                            scrollTop = maxScrollTop;
                        } else {
                            scrollTop = 0;
                        }
                    }
                }

                // Keep list from growing infinitely (holding min 10, max 20 measure points)
                if (positions.length > 60) {
                    positions.splice(0, 30);
                }

                // Track scroll movement for decleration
                positions.push(scrollLeft, scrollTop, timeStamp);

                // Sync scroll position
                this.__publish(scrollLeft, scrollTop, level);

                // Otherwise figure out whether we are switching into dragging mode now.
            } else {
                var minimumTrackingForScroll = this.options.locking ? 3 : 0;
                var minimumTrackingForDrag = 5;

                var distanceX = Math.abs(currentTouchLeft - this.__initialTouchLeft);
                var distanceY = Math.abs(currentTouchTop - this.__initialTouchTop);

                this.__enableScrollX = this.options.scrollingX && distanceX >= minimumTrackingForScroll;
                this.__enableScrollY = this.options.scrollingY && distanceY >= minimumTrackingForScroll;

                positions.push(this.__scrollLeft, this.__scrollTop, timeStamp);

                this.__isDragging = (this.__enableScrollX || this.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);
                if (this.__isDragging) {
                    this.__interruptedAnimation = false;
                }
            }

            // Update last touch positions and time stamp for next event
            this.__lastTouchLeft = currentTouchLeft;
            this.__lastTouchTop = currentTouchTop;
            this.__lastTouchMove = timeStamp;
            this.__lastScale = scale;
        },


        /**
         * Touch end handler for scrolling support
         */
        doTouchEnd : function (timeStamp) {
            if (timeStamp instanceof Date) {
                timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
                throw new Error("Invalid timestamp value: " + timeStamp);
            }

            // Ignore event when tracking is not enabled (no touchstart event on element)
            // This is required as this listener ('touchmove') sits on the document and not on the element itself.
            if (!this.__isTracking) {
                return;
            }

            // Not touching anymore (when two finger hit the screen there are two touch end events)
            this.__isTracking = false;

            // Be sure to reset the dragging flag now. Here we also detect whether
            // the finger has moved fast enough to switch into a deceleration animation.
            if (this.__isDragging) {
                // Reset dragging flag
                this.__isDragging = false;

                // Start deceleration
                // Verify that the last move detected was in some relevant time frame
                if (this.__isSingleTouch && this.options.animating && (timeStamp - this.__lastTouchMove) <= 100) {
                    // Then figure out what the scroll position was about 100ms ago
                    var positions = this.__positions;
                    var endPos = positions.length - 1;
                    var startPos = endPos;

                    // Move pointer to position measured 100ms ago
                    for (var i = endPos; i > 0 && positions[i] > (this.__lastTouchMove - 100); i -= 3) {
                        startPos = i;
                    }

                    // If start and stop position is identical in a 100ms timeframe,
                    // we cannot compute any useful deceleration.
                    if (startPos !== endPos) {
                        // Compute relative movement between these two points
                        var timeOffset = positions[endPos] - positions[startPos];
                        var movedLeft = this.__scrollLeft - positions[startPos - 2];
                        var movedTop = this.__scrollTop - positions[startPos - 1];

                        // Based on 50ms compute the movement to apply for each render step
                        this.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
                        this.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);

                        // How much velocity is required to start the deceleration
                        var minVelocityToStartDeceleration = this.options.paging || this.options.snapping ? 4 : 1;

                        // Verify that we have enough velocity to start deceleration
                        if (Math.abs(this.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(this.__decelerationVelocityY) > minVelocityToStartDeceleration) {
                            this.__startDeceleration(timeStamp);
                        }
                    } else {
                        this.options.scrollingComplete();
                    }
                } else if ((timeStamp - this.__lastTouchMove) > 100) {
                    this.options.scrollingComplete();
                }
            }

            // If this was a slower move it is per default non decelerated, but this
            // still means that we want snap back to the bounds which is done here.
            // This is placed outside the condition above to improve edge case stability
            // e.g. touchend fired without enabled dragging. This should normally do not
            // have modified the scroll positions or even showed the scrollbars though.
            if (!this.__isDecelerating) {
                if (this.__interruptedAnimation || this.__isDragging) {
                    this.options.scrollingComplete();
                }
                this.scrollTo(this.__scrollLeft, this.__scrollTop, true, this.__zoomLevel);
            }

            // Fully cleanup list
            this.__positions.length = 0;
        },



        /*
          ---------------------------------------------------------------------------
          PRIVATE API
          ---------------------------------------------------------------------------
        */

        /**
         * Applies the scroll position to the content element
         *
         * @param left {Number} Left scroll position
         * @param top {Number} Top scroll position
         * @param isAnimated {Boolean?false} Whether animation should be used to move to the new coordinates
         */
        __publish : function (left, top, zoom, isAnimated) {
            // Remember whether we had an animation, then we try to continue
            // based on the current "drive" of the animation.
            var wasAnimating = this.__isAnimating;
            if (wasAnimating) {
                animate.stop(wasAnimating);
                this.__isAnimating = false;
            }

            if (isAnimated && this.options.animating) {
                // Keep scheduled positions for scrollBy/zoomBy functionality.
                this.__scheduledLeft = left;
                this.__scheduledTop = top;
                this.__scheduledZoom = zoom;

                var oldLeft = this.__scrollLeft;
                var oldTop = this.__scrollTop;
                var oldZoom = this.__zoomLevel;

                var diffLeft = left - oldLeft;
                var diffTop = top - oldTop;
                var diffZoom = zoom - oldZoom;

                var step = function (percent, now, render) {
                    if (render) {
                        this.__scrollLeft = oldLeft + (diffLeft * percent);
                        this.__scrollTop = oldTop + (diffTop * percent);
                        this.__zoomLevel = oldZoom + (diffZoom * percent);

                        // Push values out
                        if (this.__callback) {
                            this.__callback(this.__scrollLeft, this.__scrollTop, this.__zoomLevel);
                        }
                    }
                }.bind(this);

                var verify = function (id) {
                    return this.__isAnimating === id;
                }.bind(this);

                var completed = function (renderedFramesPerSecond, animationId, wasFinished) {
                    if (animationId === this.__isAnimating) {
                        this.__isAnimating = false;
                    }
                    if (this.__didDecelerationComplete || wasFinished) {
                        this.options.scrollingComplete();
                    }

                    if (this.options.zooming) {
                        this.__computeScrollMax();
                        if (this.__zoomComplete) {
                            this.__zoomComplete();
                            this.__zoomComplete = null;
                        }
                    }
                }.bind(this);

                // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
                this.__isAnimating = animate.start(step, verify, completed, this.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);

            } else {
                this.__scheduledLeft = this.__scrollLeft = left;
                this.__scheduledTop = this.__scrollTop = top;
                this.__scheduledZoom = this.__zoomLevel = zoom;

                // Push values out
                if (this.__callback) {
                    this.__callback(left, top, zoom);
                }

                // Fix max scroll ranges
                if (this.options.zooming) {
                    this.__computeScrollMax();
                    if (this.__zoomComplete) {
                        this.__zoomComplete();
                        this.__zoomComplete = null;
                    }
                }
            }
        },


        /**
         * Recomputes scroll minimum values based on client dimensions and content dimensions.
         */
        __computeScrollMax : function (zoomLevel) {
            if (zoomLevel === undefined) {
                zoomLevel = this.__zoomLevel;
            }

            this.__maxScrollLeft = Math.max(this.__contentWidth*zoomLevel - this.__clientWidth, 0);
            this.__maxScrollTop = Math.max(this.__contentHeight*zoomLevel - this.__clientHeight, 0);
        },



        /*
          ---------------------------------------------------------------------------
          ANIMATION (DECELERATION) SUPPORT
          ---------------------------------------------------------------------------
        */

        /**
         * Called when a touch sequence end and the speed of the finger was high enough
         * to switch into deceleration mode.
         */
        __startDeceleration : function (timeStamp) {
            if (this.options.paging) {
                var scrollLeft = Math.max(Math.min(this.__scrollLeft, this.__maxScrollLeft), 0);
                var scrollTop = Math.max(Math.min(this.__scrollTop, this.__maxScrollTop), 0);
                var clientWidth = this.__clientWidth;
                var clientHeight = this.__clientHeight;

                // We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
                // Each page should have exactly the size of the client area.
                this.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
                this.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
                this.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
                this.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;
            } else {
                this.__minDecelerationScrollLeft = 0;
                this.__minDecelerationScrollTop = 0;
                this.__maxDecelerationScrollLeft = this.__maxScrollLeft;
                this.__maxDecelerationScrollTop = this.__maxScrollTop;
            }

            // Wrap class method
            var step = function (percent, now, render) {
                this.__stepThroughDeceleration(render);
            }.bind(this);

            // How much velocity is required to keep the deceleration running
            var minVelocityToKeepDecelerating = this.options.snapping ? 4 : 0.1;

            // Detect whether it's still worth to continue animating steps
            // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
            var verify = function () {
                var shouldContinue = Math.abs(this.__decelerationVelocityX) >= minVelocityToKeepDecelerating || Math.abs(this.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
                if (!shouldContinue) {
                    this.__didDecelerationComplete = true;
                }
                return shouldContinue;
            }.bind(this);

            var completed = function (renderedFramesPerSecond, animationId, wasFinished) {
                this.__isDecelerating = false;
                if (this.__didDecelerationComplete) {
                    this.options.scrollingComplete();
                }

                // Animate to grid when snapping is active, otherwise just fix out-of-boundary positions
                this.scrollTo(this.__scrollLeft, this.__scrollTop, this.options.snapping);
            }.bind(this);

            // Start animation and switch on flag
            this.__isDecelerating = animate.start(step, verify, completed);
        },


        /**
         * Called on every step of the animation
         *
         * @param inMemory {Boolean?false} Whether to not render the current step, but keep it in memory only. Used internally only!
         */
        __stepThroughDeceleration : function (render) {

            //
            // COMPUTE NEXT SCROLL POSITION
            //

            // Add deceleration to scroll position
            var scrollLeft = this.__scrollLeft + this.__decelerationVelocityX;
            var scrollTop = this.__scrollTop + this.__decelerationVelocityY;


            //
            // HARD LIMIT SCROLL POSITION FOR NON BOUNCING MODE
            //

            if (!this.options.bouncing) {
                var scrollLeftFixed = Math.max(Math.min(this.__maxDecelerationScrollLeft, scrollLeft), this.__minDecelerationScrollLeft);
                if (scrollLeftFixed !== scrollLeft) {
                    scrollLeft = scrollLeftFixed;
                    this.__decelerationVelocityX = 0;
                }

                var scrollTopFixed = Math.max(Math.min(this.__maxDecelerationScrollTop, scrollTop), this.__minDecelerationScrollTop);
                if (scrollTopFixed !== scrollTop) {
                    scrollTop = scrollTopFixed;
                    this.__decelerationVelocityY = 0;
                }
            }


            //
            // UPDATE SCROLL POSITION
            //

            if (render) {
                this.__publish(scrollLeft, scrollTop, this.__zoomLevel);
            } else {
                this.__scrollLeft = scrollLeft;
                this.__scrollTop = scrollTop;
            }


            //
            // SLOW DOWN
            //

            // Slow down velocity on every iteration
            if (!this.options.paging) {
                // This is the factor applied to every iteration of the animation
                // to slow down the process. This should emulate natural behavior where
                // objects slow down when the initiator of the movement is removed
                var frictionFactor = 0.95;

                this.__decelerationVelocityX *= frictionFactor;
                this.__decelerationVelocityY *= frictionFactor;
            }


            //
            // BOUNCING SUPPORT
            //

            if (this.options.bouncing) {
                var scrollOutsideX = 0;
                var scrollOutsideY = 0;

                // This configures the amount of change applied to deceleration/acceleration when reaching boundaries
                var penetrationDeceleration = this.options.penetrationDeceleration;
                var penetrationAcceleration = this.options.penetrationAcceleration;

                // Check limits
                if (scrollLeft < this.__minDecelerationScrollLeft) {
                    scrollOutsideX = this.__minDecelerationScrollLeft - scrollLeft;
                } else if (scrollLeft > this.__maxDecelerationScrollLeft) {
                    scrollOutsideX = this.__maxDecelerationScrollLeft - scrollLeft;
                }

                if (scrollTop < this.__minDecelerationScrollTop) {
                    scrollOutsideY = this.__minDecelerationScrollTop - scrollTop;
                } else if (scrollTop > this.__maxDecelerationScrollTop) {
                    scrollOutsideY = this.__maxDecelerationScrollTop - scrollTop;
                }

                // Slow down until slow enough, then flip back to snap position
                if (scrollOutsideX !== 0) {
                    if (scrollOutsideX * this.__decelerationVelocityX <= 0) {
                        this.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
                    } else {
                        this.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
                    }
                }

                if (scrollOutsideY !== 0) {
                    if (scrollOutsideY * this.__decelerationVelocityY <= 0) {
                        this.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
                    } else {
                        this.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
                    }
                }
            }
        }
    };

    return Scroller;
}));


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "adaptor", function() { return adaptor; });
function adaptor(node) {
  var isDarkMode = false;

  if (node.root) {
    isDarkMode = node.root.isDarkMode();
  } else {
    isDarkMode = node.isDarkMode();
  }

  var style = {};

  if (isDarkMode) {
    style = Object.assign({}, node.styleInit, node.styleDarkInit, node.styleProp, node._innerStyle);
  } else {
    style = Object.assign({}, node.styleInit, node.styleProp, node._innerStyle);
  } // 处理宽度
  // if (style.width === 'auto') {
  // 	yogaNode.setWidthAuto();
  // } else if (typeof style.width === 'string' && style.width.endsWith('%')) {
  // 	yogaNode.setWidthPercent(parseFloat(style.width));
  // } else if (typeof style.width !== 'undefined') {
  // 	yogaNode.setWidth(style.width);
  // } else {
  // 	yogaNode.setWidthAuto();
  // }
  // TODO 百分比的情况和auto情况处理


  if (typeof style.minWidth === 'string' && style.minWidth.endsWith('%')) {
    style.minWidth = node.parent.style.width * parseFloat(style.minWidth);
  } // 处理最大高度


  if (typeof style.maxHeight === 'string' && style.maxHeight.endsWith('%')) {
    style.minHeight = node.parent.style.height * parseFloat(style.minHeight);
  } // 处理高度


  if (style.height === 'auto') {// 处理高度为auto的情况
  } else if (typeof style.height === 'string' && style.height.endsWith('%')) {
    style.height = node.parent.style.height * parseFloat(style.height);
  } // 处理padding/margin/border


  for (var _i = 0, _arr = ['padding', 'margin', 'borderWidth']; _i < _arr.length; _i++) {
    var styleName = _arr[_i];

    if (typeof style[styleName] === 'number') {
      style[styleName + "Top"] = style[styleName];
      style[styleName + "Bottom"] = style[styleName];
      style[styleName + "Left"] = style[styleName];
      style[styleName + "Right"] = style[styleName];
    } else if (typeof style[styleName] === 'string') {
      var s = style[styleName].split(' '); // 根据空格分割出padding的不同参数

      if (s.length === 1) {
        style[styleName + "Top"] = style[styleName];
        style[styleName + "Bottom"] = style[styleName];
        style[styleName + "Left"] = style[styleName];
        style[styleName + "Right"] = style[styleName];
      } else if (s.length === 2) {
        style[styleName + "Top"] = s[0];
        style[styleName + "Bottom"] = s[0];
        style[styleName + "Left"] = s[1];
        style[styleName + "Right"] = s[1];
      } else if (s.length === 3) {
        style[styleName + "Top"] = s[0];
        style[styleName + "Bottom"] = s[1];
        style[styleName + "Left"] = s[1];
        style[styleName + "Right"] = s[2];
      } else if (s.length === 4) {
        style[styleName + "Top"] = s[0];
        style[styleName + "Bottom"] = s[1];
        style[styleName + "Left"] = s[2];
        style[styleName + "Right"] = s[3];
      }
    }
  }

  node.style = style;
  node.children.forEach(function (child) {
    adaptor(child);
  });
  return node;
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// UMD (Universal Module Definition)
// See https://github.com/umdjs/umd for reference
//
// This file uses the following specific UMD implementation:
// https://github.com/umdjs/umd/blob/master/returnExports.js
(function(root, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function() {
  /**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var computeLayout = (function() {

  var CSS_UNDEFINED;

  var CSS_DIRECTION_INHERIT = 'inherit';
  var CSS_DIRECTION_LTR = 'ltr';
  var CSS_DIRECTION_RTL = 'rtl';

  var CSS_FLEX_DIRECTION_ROW = 'row';
  var CSS_FLEX_DIRECTION_ROW_REVERSE = 'row-reverse';
  var CSS_FLEX_DIRECTION_COLUMN = 'column';
  var CSS_FLEX_DIRECTION_COLUMN_REVERSE = 'column-reverse';

  var CSS_JUSTIFY_FLEX_START = 'flex-start';
  var CSS_JUSTIFY_CENTER = 'center';
  var CSS_JUSTIFY_FLEX_END = 'flex-end';
  var CSS_JUSTIFY_SPACE_BETWEEN = 'space-between';
  var CSS_JUSTIFY_SPACE_AROUND = 'space-around';

  var CSS_ALIGN_FLEX_START = 'flex-start';
  var CSS_ALIGN_CENTER = 'center';
  var CSS_ALIGN_FLEX_END = 'flex-end';
  var CSS_ALIGN_STRETCH = 'stretch';

  var CSS_POSITION_RELATIVE = 'relative';
  var CSS_POSITION_ABSOLUTE = 'absolute';

  var leading = {
    'row': 'left',
    'row-reverse': 'right',
    'column': 'top',
    'column-reverse': 'bottom'
  };
  var trailing = {
    'row': 'right',
    'row-reverse': 'left',
    'column': 'bottom',
    'column-reverse': 'top'
  };
  var pos = {
    'row': 'left',
    'row-reverse': 'right',
    'column': 'top',
    'column-reverse': 'bottom'
  };
  var dim = {
    'row': 'width',
    'row-reverse': 'width',
    'column': 'height',
    'column-reverse': 'height'
  };

  // When transpiled to Java / C the node type has layout, children and style
  // properties. For the JavaScript version this function adds these properties
  // if they don't already exist.
  function fillNodes(node) {
    if (!node.layout || node.isDirty) {
      node.layout = {
        width: undefined,
        height: undefined,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      };
    }

    if (!node.style) {
      node.style = {};
    }

    if (!node.children) {
      node.children = [];
    }
    node.children.forEach(fillNodes);
    return node;
  }

  function isUndefined(value) {
    return value === undefined;
  }

  function isRowDirection(flexDirection) {
    return flexDirection === CSS_FLEX_DIRECTION_ROW ||
           flexDirection === CSS_FLEX_DIRECTION_ROW_REVERSE;
  }

  function isColumnDirection(flexDirection) {
    return flexDirection === CSS_FLEX_DIRECTION_COLUMN ||
           flexDirection === CSS_FLEX_DIRECTION_COLUMN_REVERSE;
  }

  function getLeadingMargin(node, axis) {
    if (node.style.marginStart !== undefined && isRowDirection(axis)) {
      return node.style.marginStart;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.marginLeft;   break;
      case 'row-reverse':    value = node.style.marginRight;  break;
      case 'column':         value = node.style.marginTop;    break;
      case 'column-reverse': value = node.style.marginBottom; break;
    }

    if (value !== undefined) {
      return value;
    }

    if (node.style.margin !== undefined) {
      return node.style.margin;
    }

    return 0;
  }

  function getTrailingMargin(node, axis) {
    if (node.style.marginEnd !== undefined && isRowDirection(axis)) {
      return node.style.marginEnd;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.marginRight;  break;
      case 'row-reverse':    value = node.style.marginLeft;   break;
      case 'column':         value = node.style.marginBottom; break;
      case 'column-reverse': value = node.style.marginTop;    break;
    }

    if (value != null) {
      return value;
    }

    if (node.style.margin !== undefined) {
      return node.style.margin;
    }

    return 0;
  }

  function getLeadingPadding(node, axis) {
    if (node.style.paddingStart !== undefined && node.style.paddingStart >= 0
        && isRowDirection(axis)) {
      return node.style.paddingStart;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.paddingLeft;   break;
      case 'row-reverse':    value = node.style.paddingRight;  break;
      case 'column':         value = node.style.paddingTop;    break;
      case 'column-reverse': value = node.style.paddingBottom; break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.padding !== undefined && node.style.padding >= 0) {
      return node.style.padding;
    }

    return 0;
  }

  function getTrailingPadding(node, axis) {
    if (node.style.paddingEnd !== undefined && node.style.paddingEnd >= 0
        && isRowDirection(axis)) {
      return node.style.paddingEnd;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.paddingRight;  break;
      case 'row-reverse':    value = node.style.paddingLeft;   break;
      case 'column':         value = node.style.paddingBottom; break;
      case 'column-reverse': value = node.style.paddingTop;    break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.padding !== undefined && node.style.padding >= 0) {
      return node.style.padding;
    }

    return 0;
  }

  function getLeadingBorder(node, axis) {
    if (node.style.borderStartWidth !== undefined && node.style.borderStartWidth >= 0
        && isRowDirection(axis)) {
      return node.style.borderStartWidth;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.borderLeftWidth;   break;
      case 'row-reverse':    value = node.style.borderRightWidth;  break;
      case 'column':         value = node.style.borderTopWidth;    break;
      case 'column-reverse': value = node.style.borderBottomWidth; break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.borderWidth !== undefined && node.style.borderWidth >= 0) {
      return node.style.borderWidth;
    }

    return 0;
  }

  function getTrailingBorder(node, axis) {
    if (node.style.borderEndWidth !== undefined && node.style.borderEndWidth >= 0
        && isRowDirection(axis)) {
      return node.style.borderEndWidth;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.borderRightWidth;  break;
      case 'row-reverse':    value = node.style.borderLeftWidth;   break;
      case 'column':         value = node.style.borderBottomWidth; break;
      case 'column-reverse': value = node.style.borderTopWidth;    break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.borderWidth !== undefined && node.style.borderWidth >= 0) {
      return node.style.borderWidth;
    }

    return 0;
  }

  function getLeadingPaddingAndBorder(node, axis) {
    return getLeadingPadding(node, axis) + getLeadingBorder(node, axis);
  }

  function getTrailingPaddingAndBorder(node, axis) {
    return getTrailingPadding(node, axis) + getTrailingBorder(node, axis);
  }

  function getBorderAxis(node, axis) {
    return getLeadingBorder(node, axis) + getTrailingBorder(node, axis);
  }

  function getMarginAxis(node, axis) {
    return getLeadingMargin(node, axis) + getTrailingMargin(node, axis);
  }

  function getPaddingAndBorderAxis(node, axis) {
    return getLeadingPaddingAndBorder(node, axis) +
        getTrailingPaddingAndBorder(node, axis);
  }

  function getJustifyContent(node) {
    if (node.style.justifyContent) {
      return node.style.justifyContent;
    }
    return 'flex-start';
  }

  function getAlignContent(node) {
    if (node.style.alignContent) {
      return node.style.alignContent;
    }
    return 'flex-start';
  }

  function getAlignItem(node, child) {
    if (child.style.alignSelf) {
      return child.style.alignSelf;
    }
    if (node.style.alignItems) {
      return node.style.alignItems;
    }
    return 'stretch';
  }

  function resolveAxis(axis, direction) {
    if (direction === CSS_DIRECTION_RTL) {
      if (axis === CSS_FLEX_DIRECTION_ROW) {
        return CSS_FLEX_DIRECTION_ROW_REVERSE;
      } else if (axis === CSS_FLEX_DIRECTION_ROW_REVERSE) {
        return CSS_FLEX_DIRECTION_ROW;
      }
    }

    return axis;
  }

  function resolveDirection(node, parentDirection) {
    var direction;
    if (node.style.direction) {
      direction = node.style.direction;
    } else {
      direction = CSS_DIRECTION_INHERIT;
    }

    if (direction === CSS_DIRECTION_INHERIT) {
      direction = (parentDirection === undefined ? CSS_DIRECTION_LTR : parentDirection);
    }

    return direction;
  }

  function getFlexDirection(node) {
    if (node.style.flexDirection) {
      return node.style.flexDirection;
    }
    return CSS_FLEX_DIRECTION_COLUMN;
  }

  function getCrossFlexDirection(flexDirection, direction) {
    if (isColumnDirection(flexDirection)) {
      return resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);
    } else {
      return CSS_FLEX_DIRECTION_COLUMN;
    }
  }

  function getPositionType(node) {
    if (node.style.position) {
      return node.style.position;
    }
    return 'relative';
  }

  function isFlex(node) {
    return (
      getPositionType(node) === CSS_POSITION_RELATIVE &&
      node.style.flex > 0
    );
  }

  function isFlexWrap(node) {
    return node.style.flexWrap === 'wrap';
  }

  function getDimWithMargin(node, axis) {
    return node.layout[dim[axis]] + getMarginAxis(node, axis);
  }

  function isDimDefined(node, axis) {
    return node.style[dim[axis]] !== undefined && node.style[dim[axis]] >= 0;
  }

  function isPosDefined(node, pos) {
    return node.style[pos] !== undefined;
  }

  function isMeasureDefined(node) {
    return node.style.measure !== undefined;
  }

  function getPosition(node, pos) {
    if (node.style[pos] !== undefined) {
      return node.style[pos];
    }
    return 0;
  }

  function boundAxis(node, axis, value) {
    var min = {
      'row': node.style.minWidth,
      'row-reverse': node.style.minWidth,
      'column': node.style.minHeight,
      'column-reverse': node.style.minHeight
    }[axis];

    var max = {
      'row': node.style.maxWidth,
      'row-reverse': node.style.maxWidth,
      'column': node.style.maxHeight,
      'column-reverse': node.style.maxHeight
    }[axis];

    var boundValue = value;
    if (max !== undefined && max >= 0 && boundValue > max) {
      boundValue = max;
    }
    if (min !== undefined && min >= 0 && boundValue < min) {
      boundValue = min;
    }
    return boundValue;
  }

  function fmaxf(a, b) {
    if (a > b) {
      return a;
    }
    return b;
  }

  // When the user specifically sets a value for width or height
  function setDimensionFromStyle(node, axis) {
    // The parent already computed us a width or height. We just skip it
    if (node.layout[dim[axis]] !== undefined) {
      return;
    }
    // We only run if there's a width or height defined
    if (!isDimDefined(node, axis)) {
      return;
    }

    // The dimensions can never be smaller than the padding and border
    node.layout[dim[axis]] = fmaxf(
      boundAxis(node, axis, node.style[dim[axis]]),
      getPaddingAndBorderAxis(node, axis)
    );
  }

  function setTrailingPosition(node, child, axis) {
    child.layout[trailing[axis]] = node.layout[dim[axis]] -
        child.layout[dim[axis]] - child.layout[pos[axis]];
  }

  // If both left and right are defined, then use left. Otherwise return
  // +left or -right depending on which is defined.
  function getRelativePosition(node, axis) {
    if (node.style[leading[axis]] !== undefined) {
      return getPosition(node, leading[axis]);
    }
    return -getPosition(node, trailing[axis]);
  }

  function layoutNodeImpl(node, parentMaxWidth, /*css_direction_t*/parentDirection) {
    var/*css_direction_t*/ direction = resolveDirection(node, parentDirection);
    var/*(c)!css_flex_direction_t*//*(java)!int*/ mainAxis = resolveAxis(getFlexDirection(node), direction);
    var/*(c)!css_flex_direction_t*//*(java)!int*/ crossAxis = getCrossFlexDirection(mainAxis, direction);
    var/*(c)!css_flex_direction_t*//*(java)!int*/ resolvedRowAxis = resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);

    // Handle width and height style attributes
    setDimensionFromStyle(node, mainAxis);
    setDimensionFromStyle(node, crossAxis);

    // Set the resolved resolution in the node's layout
    node.layout.direction = direction;

    // The position is set by the parent, but we need to complete it with a
    // delta composed of the margin and left/top/right/bottom
    node.layout[leading[mainAxis]] += getLeadingMargin(node, mainAxis) +
      getRelativePosition(node, mainAxis);
    node.layout[trailing[mainAxis]] += getTrailingMargin(node, mainAxis) +
      getRelativePosition(node, mainAxis);
    node.layout[leading[crossAxis]] += getLeadingMargin(node, crossAxis) +
      getRelativePosition(node, crossAxis);
    node.layout[trailing[crossAxis]] += getTrailingMargin(node, crossAxis) +
      getRelativePosition(node, crossAxis);

    // Inline immutable values from the target node to avoid excessive method
    // invocations during the layout calculation.
    var/*int*/ childCount = node.children.length;
    var/*float*/ paddingAndBorderAxisResolvedRow = getPaddingAndBorderAxis(node, resolvedRowAxis);

    if (isMeasureDefined(node)) {
      var/*bool*/ isResolvedRowDimDefined = !isUndefined(node.layout[dim[resolvedRowAxis]]);

      var/*float*/ width = CSS_UNDEFINED;
      if (isDimDefined(node, resolvedRowAxis)) {
        width = node.style.width;
      } else if (isResolvedRowDimDefined) {
        width = node.layout[dim[resolvedRowAxis]];
      } else {
        width = parentMaxWidth -
          getMarginAxis(node, resolvedRowAxis);
      }
      width -= paddingAndBorderAxisResolvedRow;

      // We only need to give a dimension for the text if we haven't got any
      // for it computed yet. It can either be from the style attribute or because
      // the element is flexible.
      var/*bool*/ isRowUndefined = !isDimDefined(node, resolvedRowAxis) && !isResolvedRowDimDefined;
      var/*bool*/ isColumnUndefined = !isDimDefined(node, CSS_FLEX_DIRECTION_COLUMN) &&
        isUndefined(node.layout[dim[CSS_FLEX_DIRECTION_COLUMN]]);

      // Let's not measure the text if we already know both dimensions
      if (isRowUndefined || isColumnUndefined) {
        var/*css_dim_t*/ measureDim = node.style.measure(
          /*(c)!node->context,*/
          /*(java)!layoutContext.measureOutput,*/
          width
        );
        if (isRowUndefined) {
          node.layout.width = measureDim.width +
            paddingAndBorderAxisResolvedRow;
        }
        if (isColumnUndefined) {
          node.layout.height = measureDim.height +
            getPaddingAndBorderAxis(node, CSS_FLEX_DIRECTION_COLUMN);
        }
      }
      if (childCount === 0) {
        return;
      }
    }

    var/*bool*/ isNodeFlexWrap = isFlexWrap(node);

    var/*css_justify_t*/ justifyContent = getJustifyContent(node);

    var/*float*/ leadingPaddingAndBorderMain = getLeadingPaddingAndBorder(node, mainAxis);
    var/*float*/ leadingPaddingAndBorderCross = getLeadingPaddingAndBorder(node, crossAxis);
    var/*float*/ paddingAndBorderAxisMain = getPaddingAndBorderAxis(node, mainAxis);
    var/*float*/ paddingAndBorderAxisCross = getPaddingAndBorderAxis(node, crossAxis);

    var/*bool*/ isMainDimDefined = !isUndefined(node.layout[dim[mainAxis]]);
    var/*bool*/ isCrossDimDefined = !isUndefined(node.layout[dim[crossAxis]]);
    var/*bool*/ isMainRowDirection = isRowDirection(mainAxis);

    var/*int*/ i;
    var/*int*/ ii;
    var/*css_node_t**/ child;
    var/*(c)!css_flex_direction_t*//*(java)!int*/ axis;

    var/*css_node_t**/ firstAbsoluteChild = null;
    var/*css_node_t**/ currentAbsoluteChild = null;

    var/*float*/ definedMainDim = CSS_UNDEFINED;
    if (isMainDimDefined) {
      definedMainDim = node.layout[dim[mainAxis]] - paddingAndBorderAxisMain;
    }

    // We want to execute the next two loops one per line with flex-wrap
    var/*int*/ startLine = 0;
    var/*int*/ endLine = 0;
    // var/*int*/ nextOffset = 0;
    var/*int*/ alreadyComputedNextLayout = 0;
    // We aggregate the total dimensions of the container in those two variables
    var/*float*/ linesCrossDim = 0;
    var/*float*/ linesMainDim = 0;
    var/*int*/ linesCount = 0;
    while (endLine < childCount) {
      // <Loop A> Layout non flexible children and count children by type

      // mainContentDim is accumulation of the dimensions and margin of all the
      // non flexible children. This will be used in order to either set the
      // dimensions of the node if none already exist, or to compute the
      // remaining space left for the flexible children.
      var/*float*/ mainContentDim = 0;

      // There are three kind of children, non flexible, flexible and absolute.
      // We need to know how many there are in order to distribute the space.
      var/*int*/ flexibleChildrenCount = 0;
      var/*float*/ totalFlexible = 0;
      var/*int*/ nonFlexibleChildrenCount = 0;

      // Use the line loop to position children in the main axis for as long
      // as they are using a simple stacking behaviour. Children that are
      // immediately stacked in the initial loop will not be touched again
      // in <Loop C>.
      var/*bool*/ isSimpleStackMain =
          (isMainDimDefined && justifyContent === CSS_JUSTIFY_FLEX_START) ||
          (!isMainDimDefined && justifyContent !== CSS_JUSTIFY_CENTER);
      var/*int*/ firstComplexMain = (isSimpleStackMain ? childCount : startLine);

      // Use the initial line loop to position children in the cross axis for
      // as long as they are relatively positioned with alignment STRETCH or
      // FLEX_START. Children that are immediately stacked in the initial loop
      // will not be touched again in <Loop D>.
      var/*bool*/ isSimpleStackCross = true;
      var/*int*/ firstComplexCross = childCount;

      var/*css_node_t**/ firstFlexChild = null;
      var/*css_node_t**/ currentFlexChild = null;

      var/*float*/ mainDim = leadingPaddingAndBorderMain;
      var/*float*/ crossDim = 0;

      var/*float*/ maxWidth;
      for (i = startLine; i < childCount; ++i) {
        child = node.children[i];
        child.lineIndex = linesCount;

        child.nextAbsoluteChild = null;
        child.nextFlexChild = null;

        var/*css_align_t*/ alignItem = getAlignItem(node, child);

        // Pre-fill cross axis dimensions when the child is using stretch before
        // we call the recursive layout pass
        if (alignItem === CSS_ALIGN_STRETCH &&
            getPositionType(child) === CSS_POSITION_RELATIVE &&
            isCrossDimDefined &&
            !isDimDefined(child, crossAxis)) {
          child.layout[dim[crossAxis]] = fmaxf(
            boundAxis(child, crossAxis, node.layout[dim[crossAxis]] -
              paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
            // You never want to go smaller than padding
            getPaddingAndBorderAxis(child, crossAxis)
          );
        } else if (getPositionType(child) === CSS_POSITION_ABSOLUTE) {
          // Store a private linked list of absolutely positioned children
          // so that we can efficiently traverse them later.
          if (firstAbsoluteChild === null) {
            firstAbsoluteChild = child;
          }
          if (currentAbsoluteChild !== null) {
            currentAbsoluteChild.nextAbsoluteChild = child;
          }
          currentAbsoluteChild = child;

          // Pre-fill dimensions when using absolute position and both offsets for the axis are defined (either both
          // left and right or top and bottom).
          for (ii = 0; ii < 2; ii++) {
            axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;
            if (!isUndefined(node.layout[dim[axis]]) &&
                !isDimDefined(child, axis) &&
                isPosDefined(child, leading[axis]) &&
                isPosDefined(child, trailing[axis])) {
              child.layout[dim[axis]] = fmaxf(
                boundAxis(child, axis, node.layout[dim[axis]] -
                  getPaddingAndBorderAxis(node, axis) -
                  getMarginAxis(child, axis) -
                  getPosition(child, leading[axis]) -
                  getPosition(child, trailing[axis])),
                // You never want to go smaller than padding
                getPaddingAndBorderAxis(child, axis)
              );
            }
          }
        }

        var/*float*/ nextContentDim = 0;

        // It only makes sense to consider a child flexible if we have a computed
        // dimension for the node.
        if (isMainDimDefined && isFlex(child)) {
          flexibleChildrenCount++;
          totalFlexible += child.style.flex;

          // Store a private linked list of flexible children so that we can
          // efficiently traverse them later.
          if (firstFlexChild === null) {
            firstFlexChild = child;
          }
          if (currentFlexChild !== null) {
            currentFlexChild.nextFlexChild = child;
          }
          currentFlexChild = child;

          // Even if we don't know its exact size yet, we already know the padding,
          // border and margin. We'll use this partial information, which represents
          // the smallest possible size for the child, to compute the remaining
          // available space.
          nextContentDim = getPaddingAndBorderAxis(child, mainAxis) +
            getMarginAxis(child, mainAxis);

        } else {
          maxWidth = CSS_UNDEFINED;
          if (!isMainRowDirection) {
            if (isDimDefined(node, resolvedRowAxis)) {
              maxWidth = node.layout[dim[resolvedRowAxis]] -
                paddingAndBorderAxisResolvedRow;
            } else {
              maxWidth = parentMaxWidth -
                getMarginAxis(node, resolvedRowAxis) -
                paddingAndBorderAxisResolvedRow;
            }
          }

          // This is the main recursive call. We layout non flexible children.
          if (alreadyComputedNextLayout === 0) {
            layoutNode(/*(java)!layoutContext, */child, maxWidth, direction);
          }

          // Absolute positioned elements do not take part of the layout, so we
          // don't use them to compute mainContentDim
          if (getPositionType(child) === CSS_POSITION_RELATIVE) {
            nonFlexibleChildrenCount++;
            // At this point we know the final size and margin of the element.
            nextContentDim = getDimWithMargin(child, mainAxis);
          }
        }

        // The element we are about to add would make us go to the next line
        if (isNodeFlexWrap &&
            isMainDimDefined &&
            mainContentDim + nextContentDim > definedMainDim &&
            // If there's only one element, then it's bigger than the content
            // and needs its own line
            i !== startLine) {
          nonFlexibleChildrenCount--;
          alreadyComputedNextLayout = 1;
          break;
        }

        // Disable simple stacking in the main axis for the current line as
        // we found a non-trivial child. The remaining children will be laid out
        // in <Loop C>.
        if (isSimpleStackMain &&
            (getPositionType(child) !== CSS_POSITION_RELATIVE || isFlex(child))) {
          isSimpleStackMain = false;
          firstComplexMain = i;
        }

        // Disable simple stacking in the cross axis for the current line as
        // we found a non-trivial child. The remaining children will be laid out
        // in <Loop D>.
        if (isSimpleStackCross &&
            (getPositionType(child) !== CSS_POSITION_RELATIVE ||
                (alignItem !== CSS_ALIGN_STRETCH && alignItem !== CSS_ALIGN_FLEX_START) ||
                isUndefined(child.layout[dim[crossAxis]]))) {
          isSimpleStackCross = false;
          firstComplexCross = i;
        }

        if (isSimpleStackMain) {
          child.layout[pos[mainAxis]] += mainDim;
          if (isMainDimDefined) {
            setTrailingPosition(node, child, mainAxis);
          }

          mainDim += getDimWithMargin(child, mainAxis);
          crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
        }

        if (isSimpleStackCross) {
          child.layout[pos[crossAxis]] += linesCrossDim + leadingPaddingAndBorderCross;
          if (isCrossDimDefined) {
            setTrailingPosition(node, child, crossAxis);
          }
        }

        alreadyComputedNextLayout = 0;
        mainContentDim += nextContentDim;
        endLine = i + 1;
      }

      // <Loop B> Layout flexible children and allocate empty space

      // In order to position the elements in the main axis, we have two
      // controls. The space between the beginning and the first element
      // and the space between each two elements.
      var/*float*/ leadingMainDim = 0;
      var/*float*/ betweenMainDim = 0;

      // The remaining available space that needs to be allocated
      var/*float*/ remainingMainDim = 0;
      if (isMainDimDefined) {
        remainingMainDim = definedMainDim - mainContentDim;
      } else {
        remainingMainDim = fmaxf(mainContentDim, 0) - mainContentDim;
      }

      // If there are flexible children in the mix, they are going to fill the
      // remaining space
      if (flexibleChildrenCount !== 0) {
        var/*float*/ flexibleMainDim = remainingMainDim / totalFlexible;
        var/*float*/ baseMainDim;
        var/*float*/ boundMainDim;

        // If the flex share of remaining space doesn't meet min/max bounds,
        // remove this child from flex calculations.
        currentFlexChild = firstFlexChild;
        while (currentFlexChild !== null) {
          baseMainDim = flexibleMainDim * currentFlexChild.style.flex +
              getPaddingAndBorderAxis(currentFlexChild, mainAxis);
          boundMainDim = boundAxis(currentFlexChild, mainAxis, baseMainDim);

          if (baseMainDim !== boundMainDim) {
            remainingMainDim -= boundMainDim;
            totalFlexible -= currentFlexChild.style.flex;
          }

          currentFlexChild = currentFlexChild.nextFlexChild;
        }
        flexibleMainDim = remainingMainDim / totalFlexible;

        // The non flexible children can overflow the container, in this case
        // we should just assume that there is no space available.
        if (flexibleMainDim < 0) {
          flexibleMainDim = 0;
        }

        currentFlexChild = firstFlexChild;
        while (currentFlexChild !== null) {
          // At this point we know the final size of the element in the main
          // dimension
          currentFlexChild.layout[dim[mainAxis]] = boundAxis(currentFlexChild, mainAxis,
            flexibleMainDim * currentFlexChild.style.flex +
                getPaddingAndBorderAxis(currentFlexChild, mainAxis)
          );

          maxWidth = CSS_UNDEFINED;
          if (isDimDefined(node, resolvedRowAxis)) {
            maxWidth = node.layout[dim[resolvedRowAxis]] -
              paddingAndBorderAxisResolvedRow;
          } else if (!isMainRowDirection) {
            maxWidth = parentMaxWidth -
              getMarginAxis(node, resolvedRowAxis) -
              paddingAndBorderAxisResolvedRow;
          }

          // And we recursively call the layout algorithm for this child
          layoutNode(/*(java)!layoutContext, */currentFlexChild, maxWidth, direction);

          child = currentFlexChild;
          currentFlexChild = currentFlexChild.nextFlexChild;
          child.nextFlexChild = null;
        }

      // We use justifyContent to figure out how to allocate the remaining
      // space available
      } else if (justifyContent !== CSS_JUSTIFY_FLEX_START) {
        if (justifyContent === CSS_JUSTIFY_CENTER) {
          leadingMainDim = remainingMainDim / 2;
        } else if (justifyContent === CSS_JUSTIFY_FLEX_END) {
          leadingMainDim = remainingMainDim;
        } else if (justifyContent === CSS_JUSTIFY_SPACE_BETWEEN) {
          remainingMainDim = fmaxf(remainingMainDim, 0);
          if (flexibleChildrenCount + nonFlexibleChildrenCount - 1 !== 0) {
            betweenMainDim = remainingMainDim /
              (flexibleChildrenCount + nonFlexibleChildrenCount - 1);
          } else {
            betweenMainDim = 0;
          }
        } else if (justifyContent === CSS_JUSTIFY_SPACE_AROUND) {
          // Space on the edges is half of the space between elements
          betweenMainDim = remainingMainDim /
            (flexibleChildrenCount + nonFlexibleChildrenCount);
          leadingMainDim = betweenMainDim / 2;
        }
      }

      // <Loop C> Position elements in the main axis and compute dimensions

      // At this point, all the children have their dimensions set. We need to
      // find their position. In order to do that, we accumulate data in
      // variables that are also useful to compute the total dimensions of the
      // container!
      mainDim += leadingMainDim;

      for (i = firstComplexMain; i < endLine; ++i) {
        child = node.children[i];

        if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
            isPosDefined(child, leading[mainAxis])) {
          // In case the child is position absolute and has left/top being
          // defined, we override the position to whatever the user said
          // (and margin/border).
          child.layout[pos[mainAxis]] = getPosition(child, leading[mainAxis]) +
            getLeadingBorder(node, mainAxis) +
            getLeadingMargin(child, mainAxis);
        } else {
          // If the child is position absolute (without top/left) or relative,
          // we put it at the current accumulated offset.
          child.layout[pos[mainAxis]] += mainDim;

          // Define the trailing position accordingly.
          if (isMainDimDefined) {
            setTrailingPosition(node, child, mainAxis);
          }

          // Now that we placed the element, we need to update the variables
          // We only need to do that for relative elements. Absolute elements
          // do not take part in that phase.
          if (getPositionType(child) === CSS_POSITION_RELATIVE) {
            // The main dimension is the sum of all the elements dimension plus
            // the spacing.
            mainDim += betweenMainDim + getDimWithMargin(child, mainAxis);
            // The cross dimension is the max of the elements dimension since there
            // can only be one element in that cross dimension.
            crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
          }
        }
      }

      var/*float*/ containerCrossAxis = node.layout[dim[crossAxis]];
      if (!isCrossDimDefined) {
        containerCrossAxis = fmaxf(
          // For the cross dim, we add both sides at the end because the value
          // is aggregate via a max function. Intermediate negative values
          // can mess this computation otherwise
          boundAxis(node, crossAxis, crossDim + paddingAndBorderAxisCross),
          paddingAndBorderAxisCross
        );
      }

      // <Loop D> Position elements in the cross axis
      for (i = firstComplexCross; i < endLine; ++i) {
        child = node.children[i];

        if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
            isPosDefined(child, leading[crossAxis])) {
          // In case the child is absolutely positionned and has a
          // top/left/bottom/right being set, we override all the previously
          // computed positions to set it correctly.
          child.layout[pos[crossAxis]] = getPosition(child, leading[crossAxis]) +
            getLeadingBorder(node, crossAxis) +
            getLeadingMargin(child, crossAxis);

        } else {
          var/*float*/ leadingCrossDim = leadingPaddingAndBorderCross;

          // For a relative children, we're either using alignItems (parent) or
          // alignSelf (child) in order to determine the position in the cross axis
          if (getPositionType(child) === CSS_POSITION_RELATIVE) {
            /*eslint-disable */
            // This variable is intentionally re-defined as the code is transpiled to a block scope language
            var/*css_align_t*/ alignItem = getAlignItem(node, child);
            /*eslint-enable */
            if (alignItem === CSS_ALIGN_STRETCH) {
              // You can only stretch if the dimension has not already been set
              // previously.
              if (isUndefined(child.layout[dim[crossAxis]])) {
                child.layout[dim[crossAxis]] = fmaxf(
                  boundAxis(child, crossAxis, containerCrossAxis -
                    paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
                  // You never want to go smaller than padding
                  getPaddingAndBorderAxis(child, crossAxis)
                );
              }
            } else if (alignItem !== CSS_ALIGN_FLEX_START) {
              // The remaining space between the parent dimensions+padding and child
              // dimensions+margin.
              var/*float*/ remainingCrossDim = containerCrossAxis -
                paddingAndBorderAxisCross - getDimWithMargin(child, crossAxis);

              if (alignItem === CSS_ALIGN_CENTER) {
                leadingCrossDim += remainingCrossDim / 2;
              } else { // CSS_ALIGN_FLEX_END
                leadingCrossDim += remainingCrossDim;
              }
            }
          }

          // And we apply the position
          child.layout[pos[crossAxis]] += linesCrossDim + leadingCrossDim;

          // Define the trailing position accordingly.
          if (isCrossDimDefined) {
            setTrailingPosition(node, child, crossAxis);
          }
        }
      }

      linesCrossDim += crossDim;
      linesMainDim = fmaxf(linesMainDim, mainDim);
      linesCount += 1;
      startLine = endLine;
    }

    // <Loop E>
    //
    // Note(prenaux): More than one line, we need to layout the crossAxis
    // according to alignContent.
    //
    // Note that we could probably remove <Loop D> and handle the one line case
    // here too, but for the moment this is safer since it won't interfere with
    // previously working code.
    //
    // See specs:
    // http://www.w3.org/TR/2012/CR-css3-flexbox-20120918/#layout-algorithm
    // section 9.4
    //
    if (linesCount > 1 && isCrossDimDefined) {
      var/*float*/ nodeCrossAxisInnerSize = node.layout[dim[crossAxis]] -
          paddingAndBorderAxisCross;
      var/*float*/ remainingAlignContentDim = nodeCrossAxisInnerSize - linesCrossDim;

      var/*float*/ crossDimLead = 0;
      var/*float*/ currentLead = leadingPaddingAndBorderCross;

      var/*css_align_t*/ alignContent = getAlignContent(node);
      if (alignContent === CSS_ALIGN_FLEX_END) {
        currentLead += remainingAlignContentDim;
      } else if (alignContent === CSS_ALIGN_CENTER) {
        currentLead += remainingAlignContentDim / 2;
      } else if (alignContent === CSS_ALIGN_STRETCH) {
        if (nodeCrossAxisInnerSize > linesCrossDim) {
          crossDimLead = (remainingAlignContentDim / linesCount);
        }
      }

      var/*int*/ endIndex = 0;
      for (i = 0; i < linesCount; ++i) {
        var/*int*/ startIndex = endIndex;

        // compute the line's height and find the endIndex
        var/*float*/ lineHeight = 0;
        for (ii = startIndex; ii < childCount; ++ii) {
          child = node.children[ii];
          if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
            continue;
          }
          if (child.lineIndex !== i) {
            break;
          }
          if (!isUndefined(child.layout[dim[crossAxis]])) {
            lineHeight = fmaxf(
              lineHeight,
              child.layout[dim[crossAxis]] + getMarginAxis(child, crossAxis)
            );
          }
        }
        endIndex = ii;
        lineHeight += crossDimLead;

        for (ii = startIndex; ii < endIndex; ++ii) {
          child = node.children[ii];
          if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
            continue;
          }

          var/*css_align_t*/ alignContentAlignItem = getAlignItem(node, child);
          if (alignContentAlignItem === CSS_ALIGN_FLEX_START) {
            child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
          } else if (alignContentAlignItem === CSS_ALIGN_FLEX_END) {
            child.layout[pos[crossAxis]] = currentLead + lineHeight - getTrailingMargin(child, crossAxis) - child.layout[dim[crossAxis]];
          } else if (alignContentAlignItem === CSS_ALIGN_CENTER) {
            var/*float*/ childHeight = child.layout[dim[crossAxis]];
            child.layout[pos[crossAxis]] = currentLead + (lineHeight - childHeight) / 2;
          } else if (alignContentAlignItem === CSS_ALIGN_STRETCH) {
            child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
            // TODO(prenaux): Correctly set the height of items with undefined
            //                (auto) crossAxis dimension.
          }
        }

        currentLead += lineHeight;
      }
    }

    var/*bool*/ needsMainTrailingPos = false;
    var/*bool*/ needsCrossTrailingPos = false;

    // If the user didn't specify a width or height, and it has not been set
    // by the container, then we set it via the children.
    if (!isMainDimDefined) {
      node.layout[dim[mainAxis]] = fmaxf(
        // We're missing the last padding at this point to get the final
        // dimension
        boundAxis(node, mainAxis, linesMainDim + getTrailingPaddingAndBorder(node, mainAxis)),
        // We can never assign a width smaller than the padding and borders
        paddingAndBorderAxisMain
      );

      if (mainAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
          mainAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
        needsMainTrailingPos = true;
      }
    }

    if (!isCrossDimDefined) {
      node.layout[dim[crossAxis]] = fmaxf(
        // For the cross dim, we add both sides at the end because the value
        // is aggregate via a max function. Intermediate negative values
        // can mess this computation otherwise
        boundAxis(node, crossAxis, linesCrossDim + paddingAndBorderAxisCross),
        paddingAndBorderAxisCross
      );

      if (crossAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
          crossAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
        needsCrossTrailingPos = true;
      }
    }

    // <Loop F> Set trailing position if necessary
    if (needsMainTrailingPos || needsCrossTrailingPos) {
      for (i = 0; i < childCount; ++i) {
        child = node.children[i];

        if (needsMainTrailingPos) {
          setTrailingPosition(node, child, mainAxis);
        }

        if (needsCrossTrailingPos) {
          setTrailingPosition(node, child, crossAxis);
        }
      }
    }

    // <Loop G> Calculate dimensions for absolutely positioned elements
    currentAbsoluteChild = firstAbsoluteChild;
    while (currentAbsoluteChild !== null) {
      // Pre-fill dimensions when using absolute position and both offsets for
      // the axis are defined (either both left and right or top and bottom).
      for (ii = 0; ii < 2; ii++) {
        axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;

        if (!isUndefined(node.layout[dim[axis]]) &&
            !isDimDefined(currentAbsoluteChild, axis) &&
            isPosDefined(currentAbsoluteChild, leading[axis]) &&
            isPosDefined(currentAbsoluteChild, trailing[axis])) {
          currentAbsoluteChild.layout[dim[axis]] = fmaxf(
            boundAxis(currentAbsoluteChild, axis, node.layout[dim[axis]] -
              getBorderAxis(node, axis) -
              getMarginAxis(currentAbsoluteChild, axis) -
              getPosition(currentAbsoluteChild, leading[axis]) -
              getPosition(currentAbsoluteChild, trailing[axis])
            ),
            // You never want to go smaller than padding
            getPaddingAndBorderAxis(currentAbsoluteChild, axis)
          );
        }

        if (isPosDefined(currentAbsoluteChild, trailing[axis]) &&
            !isPosDefined(currentAbsoluteChild, leading[axis])) {
          currentAbsoluteChild.layout[leading[axis]] =
            node.layout[dim[axis]] -
            currentAbsoluteChild.layout[dim[axis]] -
            getPosition(currentAbsoluteChild, trailing[axis]);
        }
      }

      child = currentAbsoluteChild;
      currentAbsoluteChild = currentAbsoluteChild.nextAbsoluteChild;
      child.nextAbsoluteChild = null;
    }
  }

  function layoutNode(node, parentMaxWidth, parentDirection) {
    node.shouldUpdate = true;

    var direction = node.style.direction || CSS_DIRECTION_LTR;
    var skipLayout =
      !node.isDirty &&
      node.lastLayout &&
      node.lastLayout.requestedHeight === node.layout.height &&
      node.lastLayout.requestedWidth === node.layout.width &&
      node.lastLayout.parentMaxWidth === parentMaxWidth &&
      node.lastLayout.direction === direction;

    if (skipLayout) {
      node.layout.width = node.lastLayout.width;
      node.layout.height = node.lastLayout.height;
      node.layout.top = node.lastLayout.top;
      node.layout.left = node.lastLayout.left;
    } else {
      if (!node.lastLayout) {
        node.lastLayout = {};
      }

      node.lastLayout.requestedWidth = node.layout.width;
      node.lastLayout.requestedHeight = node.layout.height;
      node.lastLayout.parentMaxWidth = parentMaxWidth;
      node.lastLayout.direction = direction;

      // Reset child layouts
      node.children.forEach(function(child) {
        child.layout.width = undefined;
        child.layout.height = undefined;
        child.layout.top = 0;
        child.layout.left = 0;
      });

      layoutNodeImpl(node, parentMaxWidth, parentDirection);

      node.lastLayout.width = node.layout.width;
      node.lastLayout.height = node.layout.height;
      node.lastLayout.top = node.layout.top;
      node.lastLayout.left = node.layout.left;
    }
  }

  return {
    layoutNodeImpl: layoutNodeImpl,
    computeLayout: layoutNode,
    fillNodes: fillNodes
  };
})();

// This module export is only used for the purposes of unit testing this file. When
// the library is packaged this file is included within css-layout.js which forms
// the public API.
if (true) {
  module.exports = computeLayout;
}


  return function(node) {
    /*eslint-disable */
    // disabling ESLint because this code relies on the above include
    computeLayout.fillNodes(node);
    computeLayout.computeLayout(node);
    /*eslint-enable */
  };
}));


/***/ })
/******/ ]);