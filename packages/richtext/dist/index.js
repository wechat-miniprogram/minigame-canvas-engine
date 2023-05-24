/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),
/* 2 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);


function _toPropertyKey(arg) {
  var key = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arg, "string");
  return (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key) === "symbol" ? key : String(key);
}

/***/ }),
/* 4 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ }),
/* 5 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

function _toPrimitive(input, hint) {
  if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

/***/ }),
/* 6 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inherits)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),
/* 7 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ }),
/* 8 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _possibleConstructorReturn)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);


function _possibleConstructorReturn(self, call) {
  if (call && ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),
/* 9 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

/***/ }),
/* 10 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Element),
/* harmony export */   getElementById: () => (/* binding */ _getElementById),
/* harmony export */   getElementsByClassName: () => (/* binding */ _getElementsByClassName),
/* harmony export */   getElementsById: () => (/* binding */ _getElementsById)
/* harmony export */ });
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _common_rect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);
/* harmony import */ var _common_imageManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(14);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* eslint-disable no-param-reassign */



function _getElementsById(tree) {
  var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var id = arguments.length > 2 ? arguments[2] : undefined;
  tree.children.forEach(function (child) {
    if (child.idName === id) {
      list.push(child);
    }
    if (child.children.length) {
      _getElementsById(child, list, id);
    }
  });
  return list;
}

function _getElementById(tree, id) {
  var list = _getElementsById(tree, [], id);
  return (list === null || list === void 0 ? void 0 : list[0]) || null;
}

function _getElementsByClassName(tree) {
  var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var className = arguments.length > 2 ? arguments[2] : undefined;
  tree.children.forEach(function (child) {
    if ((child.classNameList || child.className.split(/\s+/)).indexOf(className) > -1) {
      list.push(child);
    }
    if (child.children.length) {
      _getElementsByClassName(child, list, className);
    }
  });
  return list;
}

var Emitter = __webpack_require__(17);

// 全局事件管道
var EE = new Emitter();
var uuid = 0;
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
  if (opacity === undefined) {
    opacity = 1;
  }
  if (!rgbObj) {
    return null;
  }
  return "rgba(".concat(rgbObj.r, ", ").concat(rgbObj.g, ", ").concat(rgbObj.b, ", ").concat(opacity, ")");
}
var toEventName = function toEventName(event, id) {
  var elementEvent = ['click', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];
  if (elementEvent.indexOf(event) !== -1) {
    return "element-".concat(id, "-").concat(event);
  }
  return "element-".concat(id, "-").concat(event);
};
var isValidUrlPropReg = /\s*url\((.*?)\)\s*/;
var Element = /*#__PURE__*/function () {
  function Element(_ref) {
    var _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style,
      _ref$idName = _ref.idName,
      idName = _ref$idName === void 0 ? '' : _ref$idName,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? uuid += 1 : _ref$id,
      _ref$dataset = _ref.dataset,
      dataset = _ref$dataset === void 0 ? {} : _ref$dataset;
    _classCallCheck(this, Element);
    _defineProperty(this, "children", []);
    _defineProperty(this, "parent", null);
    _defineProperty(this, "parentId", 0);
    _defineProperty(this, "isDestroyed", false);
    _defineProperty(this, "ctx", null);
    _defineProperty(this, "isDirty", false);
    this.id = id;
    this.idName = idName;
    this.className = className;
    // this.style = style;
    this.EE = EE;
    this.root = null;
    this.layoutBox = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      absoluteX: 0,
      absoluteY: 0,
      originalAbsoluteX: 0,
      originalAbsoluteY: 0
    };
    this.dataset = dataset;
    if (style.opacity !== undefined && style.color && style.color.indexOf('#') > -1) {
      // 颜色解析失败，降级为 hex
      style.color = getRgba(style.color, style.opacity) || style.color;
    }
    if (style.opacity !== undefined && style.backgroundColor && style.backgroundColor.indexOf('#') > -1) {
      // 颜色解析失败，降级为 hex
      style.backgroundColor = getRgba(style.backgroundColor, style.opacity) || style.backgroundColor;
    }
    if (typeof style.backgroundImage === 'string') {
      this.backgroundImageSetHandler(style.backgroundImage);
    }
    this.originStyle = style;
    this.style = style;
    this.rect = null;
    this.classNameList = null;
  }
  _createClass(Element, [{
    key: "backgroundImageSetHandler",
    value: function backgroundImageSetHandler(backgroundImage) {
      var _this = this;
      if (typeof backgroundImage === 'string') {
        var list = backgroundImage.match(isValidUrlPropReg);
        if (list) {
          var url = list[1].replace(/('|")/g, '');
          _common_imageManager__WEBPACK_IMPORTED_MODULE_2__["default"].loadImage(url, function (img) {
            if (!_this.isDestroyed) {
              _this.backgroundImage = img;
              // 当图片加载完成，实例可能已经被销毁了
              _this.root && _this.root.emit('repaint');
            }
          });
        } else {
          console.error("[Layout]: ".concat(backgroundImage, " is not a valid backgroundImage"));
        }
      }
    }

    /**
     * 监听属性的变化判断是否需要执行 reflow、repaint 操作
     * 经过测试，Object.defineProperty 是一个比较慢的方法， 特别是属性比较多的时候
     * 因此会先判断是否支持 Proxy，iMac (Retina 5K, 27-inch, 2017)测试结果
     * 总共 312 个节点，observeStyleAndEvent总耗时为：
     * Proxy: 3ms
     * Object.defineProperty: 20ms
     */
  }, {
    key: "observeStyleAndEvent",
    value: function observeStyleAndEvent() {
      var _this2 = this;
      if (typeof Proxy === 'function') {
        var ele = this;
        this.style = new Proxy(this.originStyle, {
          get: function get(target, prop, receiver) {
            return Reflect.get(target, prop, receiver);
          },
          set: function set(target, prop, val, receiver) {
            if (typeof prop === 'string') {
              if (_style__WEBPACK_IMPORTED_MODULE_0__.reflowAffectedStyles.indexOf(prop) > -1) {
                ele.isDirty = true;
                var parent = ele.parent;
                while (parent) {
                  parent.isDirty = true;
                  parent = parent.parent;
                }
              } else if (_style__WEBPACK_IMPORTED_MODULE_0__.repaintAffectedStyles.indexOf(prop) > -1) {
                var _ele$root;
                (_ele$root = ele.root) === null || _ele$root === void 0 ? void 0 : _ele$root.emit('repaint');
              } else if (prop === 'backgroundImage') {
                ele.backgroundImageSetHandler(val);
              }
            }
            return Reflect.set(target, prop, val, receiver);
          }
        });
      } else {
        var innerStyle = Object.assign({}, this.style);
        _style__WEBPACK_IMPORTED_MODULE_0__.allStyles.forEach(function (key) {
          Object.defineProperty(_this2.style, key, {
            configurable: true,
            enumerable: true,
            get: function get() {
              return innerStyle[key];
            },
            set: function set(value) {
              innerStyle[key] = value;
              if (_style__WEBPACK_IMPORTED_MODULE_0__.reflowAffectedStyles.indexOf(key) > -1) {
                _this2.isDirty = true;
                var parent = _this2.parent;
                while (parent) {
                  parent.isDirty = true;
                  parent = parent.parent;
                }
              } else if (_style__WEBPACK_IMPORTED_MODULE_0__.repaintAffectedStyles.indexOf(key) > -1) {
                var _this2$root;
                (_this2$root = _this2.root) === null || _this2$root === void 0 ? void 0 : _this2$root.emit('repaint');
              } else if (key === 'backgroundImage') {
                _this2.backgroundImageSetHandler(value);
              }
            }
          });
        });
      }

      // 事件冒泡逻辑
      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click'].forEach(function (eventName) {
        _this2.on(eventName, function (e, touchMsg) {
          _this2.parent && _this2.parent.emit(eventName, e, touchMsg);
        });
      });
      this.classNameList = this.className.split(/\s+/);
    }

    // 子类填充实现
  }, {
    key: "repaint",
    value: function repaint() {}

    // 子类填充实现
  }, {
    key: "render",
    value: function render() {}

    /**
     * 参照 Web 规范：https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
     */
  }, {
    key: "getBoundingClientRect",
    value: function getBoundingClientRect() {
      if (!this.rect) {
        this.rect = new _common_rect__WEBPACK_IMPORTED_MODULE_1__["default"](this.layoutBox.absoluteX, this.layoutBox.absoluteY, this.layoutBox.width, this.layoutBox.height);
      }
      this.rect.set(this.layoutBox.absoluteX, this.layoutBox.absoluteY, this.layoutBox.width, this.layoutBox.height);
      return this.rect;
    }
  }, {
    key: "getElementById",
    value: function getElementById(id) {
      return _getElementById(this, id);
    }
  }, {
    key: "getElementsById",
    value: function getElementsById(id) {
      return _getElementsById(this, [], id);
    }
  }, {
    key: "getElementsByClassName",
    value: function getElementsByClassName(className) {
      return _getElementsByClassName(this, [], className);
    }
  }, {
    key: "insert",
    value: function insert(ctx, needRender) {
      this.ctx = ctx;
      if (needRender) {
        this.render();
      }
    }
  }, {
    key: "unBindEvent",
    value: function unBindEvent() {
      var _this3 = this;
      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint'].forEach(function (eventName) {
        _this3.off(eventName);
      });
    }
  }, {
    key: "setDirty",
    value: function setDirty() {
      this.isDirty = true;
      var parent = this.parent;
      while (parent) {
        parent.isDirty = true;
        parent = parent.parent;
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      var parent = this.parent;
      if (!parent) {
        return;
      }
      var index = parent.children.indexOf(this);
      if (index !== -1) {
        parent.children.splice(index, 1);
        this.unBindEvent();
        this.setDirty();
        this.parent = null;
        this.ctx = null;
      } else {
        console.warn('[Layout] this element has been removed');
      }
    }

    // 子类填充实现
  }, {
    key: "destroy",
    value: function destroy() {
      this.unBindEvent();
      this.isDestroyed = true;
      this.EE = null;
      this.parent = null;
      this.ctx = null;

      // element 在画布中的位置和尺寸信息
      // this.layoutBox = null;
      // this.style = null;
      this.className = '';
      this.classNameList = null;
    }
  }, {
    key: "add",
    value: function add(element) {
      element.parent = this;
      element.parentId = this.id;
      this.children.push(element);
    }
  }, {
    key: "appendChild",
    value: function appendChild(element) {
      this.add(element);
      this.setDirty();
    }
  }, {
    key: "removeChild",
    value: function removeChild(element) {
      var index = this.children.indexOf(element);
      if (index !== -1) {
        element.remove();
        this.setDirty();
      } else {
        console.warn('[Layout] the element to be removed is not a child of this element');
      }
    }
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, theArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        theArgs[_key - 1] = arguments[_key];
      }
      EE.emit.apply(EE, [toEventName(event, this.id)].concat(theArgs));
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      EE.on(toEventName(event, this.id), callback);
    }
  }, {
    key: "once",
    value: function once(event, callback) {
      EE.once(toEventName(event, this.id), callback);
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      EE.off(toEventName(event, this.id), callback);
    }
  }, {
    key: "renderBorder",
    value: function renderBorder(ctx) {
      var style = this.style || {};
      var radius = style.borderRadius || 0;
      var _style$borderWidth = style.borderWidth,
        borderWidth = _style$borderWidth === void 0 ? 0 : _style$borderWidth;
      var borderTopLeftRadius = style.borderTopLeftRadius || radius;
      var borderTopRightRadius = style.borderTopRightRadius || radius;
      var borderBottomLeftRadius = style.borderBottomLeftRadius || radius;
      var borderBottomRightRadius = style.borderBottomRightRadius || radius;
      var box = this.layoutBox;
      var _style$borderColor = style.borderColor,
        borderColor = _style$borderColor === void 0 ? '' : _style$borderColor;
      var x = box.absoluteX;
      var y = box.absoluteY;
      var width = box.width,
        height = box.height;
      var hasRadius = radius || borderTopLeftRadius || borderTopRightRadius || borderBottomLeftRadius || borderBottomRightRadius;

      // borderWidth 和 radius 都没有，不需要执行后续逻辑，提升性能
      if (!borderWidth && !hasRadius) {
        return {
          needClip: false,
          needStroke: false
        };
      }

      // 左上角的点
      ctx.beginPath();
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = borderColor;
      ctx.moveTo(x + borderTopLeftRadius, y);
      ctx.lineTo(x + width - borderTopRightRadius, y);

      // 右上角的圆角
      ctx.arcTo(x + width, y, x + width, y + borderTopRightRadius, borderTopRightRadius);

      // 右下角的点
      ctx.lineTo(x + width, y + height - borderBottomRightRadius);

      // 右下角的圆角
      ctx.arcTo(x + width, y + height, x + width - borderBottomRightRadius, y + height, borderBottomRightRadius);

      // 左下角的点
      ctx.lineTo(x + borderBottomLeftRadius, y + height);

      // 左下角的圆角
      ctx.arcTo(x, y + height, x, y + height - borderBottomLeftRadius, borderBottomLeftRadius);

      // 左上角的点
      ctx.lineTo(x, y + borderTopLeftRadius);

      // 左上角的圆角
      ctx.arcTo(x, y, x + borderTopLeftRadius, y, borderTopLeftRadius);
      return {
        needClip: !!hasRadius,
        needStroke: !!borderWidth
      };
    }
  }]);
  return Element;
}();


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allStyles: () => (/* binding */ allStyles),
/* harmony export */   reflowAffectedStyles: () => (/* binding */ reflowAffectedStyles),
/* harmony export */   repaintAffectedStyles: () => (/* binding */ repaintAffectedStyles)
/* harmony export */ });
var reflowAffectedStyles = ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'left', 'right', 'top', 'bottom', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'borderWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth', 'flexDirection', 'flexShrink', 'flexGrow', 'justifyContent', 'alignItems', 'alignSelf', 'flex', 'flexWrap', 'position'];
var repaintAffectedStyles = ['fontSize', 'lineHeight', 'textAlign', 'verticalAlign', 'color', 'backgroundColor', 'textOverflow', 'letterSpacing', 'borderRadius', 'borderColor'];
var allStyles = reflowAffectedStyles.concat(repaintAffectedStyles);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Rect)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Rect = /*#__PURE__*/function () {
  function Rect() {
    var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    _classCallCheck(this, Rect);
    _defineProperty(this, "width", 0);
    _defineProperty(this, "height", 0);
    _defineProperty(this, "left", 0);
    _defineProperty(this, "right", 0);
    _defineProperty(this, "top", 0);
    _defineProperty(this, "bottom", 0);
    this.set(left, top, width, height);
  }
  _createClass(Rect, [{
    key: "set",
    value: function set() {
      var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      this.left = left;
      this.top = top;
      this.width = width;
      this.height = height;
      this.right = this.left + this.width;
      this.bottom = this.top + this.height;
    }

    /**
     * 判断两个矩形是否相交
     * 原理可见: https://zhuanlan.zhihu.com/p/29704064
     */
  }, {
    key: "intersects",
    value: function intersects(rect) {
      return !(this.right < rect.left || rect.right < this.left || this.bottom < rect.top || rect.bottom < this.top);
    }
  }]);
  return Rect;
}();


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var ImageManager = /*#__PURE__*/function () {
  function ImageManager() {
    _classCallCheck(this, ImageManager);
    _defineProperty(this, "imgPool", new _pool__WEBPACK_IMPORTED_MODULE_0__["default"]('imgPool'));
  }
  _createClass(ImageManager, [{
    key: "getRes",
    value: function getRes(src) {
      return this.imgPool.get(src);
    }
  }, {
    key: "loadImagePromise",
    value: function loadImagePromise(src) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        _this.loadImage(src, resolve, reject);
      });
    }
  }, {
    key: "loadImage",
    value: function loadImage(src) {
      var success = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _util__WEBPACK_IMPORTED_MODULE_1__.none;
      var fail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _util__WEBPACK_IMPORTED_MODULE_1__.none;
      if (!src) {
        return null;
      }
      var img;
      var cache = this.getRes(src);

      // 图片已经被加载过，直接返回图片并且执行回调
      if (cache && cache.loadDone) {
        img = cache.img;
        success(img, true);
      } else if (cache && !cache.loadDone) {
        // 图片正在加载过程中，返回图片并且等待图片加载完成执行回调
        img = cache.img;
        cache.onloadcbks.push(success);
        cache.onerrorcbks.push(fail);
      } else {
        // 创建图片，将回调函数推入回调函数栈
        img = (0,_util__WEBPACK_IMPORTED_MODULE_1__.createImage)();
        var newCache = {
          img: img,
          loadDone: false,
          onloadcbks: [success],
          onerrorcbks: [fail]
        };
        this.imgPool.set(src, newCache);
        img.onload = function () {
          newCache.loadDone = true;
          newCache.onloadcbks.forEach(function (fn) {
            return fn(img, false);
          });
          newCache.onloadcbks = [];
          newCache.onerrorcbks = [];
        };
        img.onerror = function () {
          newCache.onerrorcbks.forEach(function (fn) {
            return fn(img, false);
          });
          newCache.onerrorcbks = [];
          newCache.onloadcbks = [];
        };
        img.src = src;
      }
      return img;
    }
  }]);
  return ImageManager;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new ImageManager());

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Pool)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var pools = [];
var Pool = /*#__PURE__*/function () {
  function Pool() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'pool';
    _classCallCheck(this, Pool);
    _defineProperty(this, "name", 'pool');
    _defineProperty(this, "pool", {});
    var curr = pools.find(function (item) {
      return item.name === name;
    });
    if (curr) {
      return curr;
    }
    this.name = name;
    this.pool = {};
    pools.push(this);
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
  }, {
    key: "getList",
    value: function getList() {
      return Object.values(this.pool);
    }
  }]);
  return Pool;
}();


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STATE: () => (/* binding */ STATE),
/* harmony export */   clearCanvas: () => (/* binding */ clearCanvas),
/* harmony export */   copyTouchArray: () => (/* binding */ copyTouchArray),
/* harmony export */   createCanvas: () => (/* binding */ createCanvas),
/* harmony export */   createImage: () => (/* binding */ createImage),
/* harmony export */   getDpr: () => (/* binding */ getDpr),
/* harmony export */   isClick: () => (/* binding */ isClick),
/* harmony export */   none: () => (/* binding */ none)
/* harmony export */ });
/* istanbul ignore next */
function none() {}
/**
 * 根据触摸时长和触摸位置变化来判断是否属于点击事件
 */
function isClick(touchMsg) {
  var start = touchMsg.touchstart;
  var end = touchMsg.touchend;
  if (!start || !end || !start.timeStamp || !end.timeStamp || start.pageX === undefined || start.pageY === undefined || end.pageX === undefined || end.pageY === undefined) {
    return false;
  }
  var startPosX = start.pageX;
  var startPosY = start.pageY;
  var endPosX = end.pageX;
  var endPosY = end.pageY;
  var touchTimes = end.timeStamp - start.timeStamp;
  return !!(Math.abs(endPosY - startPosY) < 30 && Math.abs(endPosX - startPosX) < 30 && touchTimes < 300);
}
function createCanvas() {
  /* istanbul ignore if*/
  // @ts-ignore
  if (typeof __env !== 'undefined') {
    // @ts-ignore
    return __env.createCanvas();
  }
  return document.createElement('canvas');
}
function createImage() {
  /* istanbul ignore if*/
  // @ts-ignore
  if (typeof __env !== 'undefined') {
    // @ts-ignore
    return __env.createImage();
  }
  return document.createElement('img');
}
var _dpr;
// only Baidu platform need to recieve system info from main context
if (typeof swan !== 'undefined') {
  __env.onMessage(function (res) {
    if (res && res.type === 'engine') {
      if (res.event === 'systemInfo') {
        _dpr = res.systemInfo.devicePixelRatio;
      }
    }
  });
}
function getDpr() {
  // return 3;
  if (typeof _dpr !== 'undefined') {
    return _dpr;
  }
  if (typeof __env !== 'undefined' && __env.getSystemInfoSync) {
    _dpr = __env.getSystemInfoSync().devicePixelRatio;
  } else if (window.devicePixelRatio) {
    _dpr = window.devicePixelRatio;
  } else {
    console.warn('[Layout] failed to access device pixel ratio, fallback to 1');
    _dpr = 1;
  }
  return _dpr;
}
var STATE = {
  UNINIT: 'UNINIT',
  INITED: 'INITED',
  RENDERED: 'RENDERED',
  CLEAR: 'CLEAR'
};
function clearCanvas(ctx) {
  ctx && ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
function copyTouchArray(touches) {
  return touches.map(function (touch) {
    return {
      identifier: touch.identifier,
      pageX: touch.pageX,
      pageY: touch.pageY,
      clientX: touch.clientX,
      clientY: touch.clientY
    };
  });
}

/***/ }),
/* 17 */
/***/ ((module) => {

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
/* 18 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable */

var __placeImgeUrlHttps = 'https';
var __emojisReg = '';
var __emojisBaseSrc = '';
var __emojis = {};
var HTMLParser = __webpack_require__(19);
// Block Elements - HTML 5
var block = makeMap('br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
var inline = makeMap('abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');
function makeMap(str) {
  var obj = {};
  var items = str.split(',');
  for (var i = 0; i < items.length; i++) obj[items[i]] = true;
  return obj;
}
function q(v) {
  return "\"".concat(v, "\"");
}
function removeDOCTYPE(html) {
  return html.replace(/<\?xml.*\?>\n/, '').replace(/<.*!doctype.*\>\n/, '').replace(/<.*!DOCTYPE.*\>\n/, '');
}
function trimHtml(html) {
  return html.replace(/\r?\n+/g, '').replace(/<!--.*?-->/ig, '').replace(/\/\*.*?\*\//ig, '').replace(/[ ]+</ig, '<');
}
function html2json(html) {
  // 处理字符串
  html = removeDOCTYPE(html);
  html = trimHtml(html);
  html = strDiscode(html);
  // 生成node节点
  var bufArray = [];
  var results = {
    node: '',
    nodes: [],
    images: [],
    imageUrls: []
  };
  var index = 0;
  HTMLParser(html, {
    start: function start(tag, attrs, unary) {
      // debug(tag, attrs, unary);
      // node for this element
      var node = {
        node: 'element',
        tag: tag
      };
      if (bufArray.length === 0) {
        node.index = index.toString();
        index += 1;
      } else {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
        node.index = "".concat(parent.index, ".").concat(parent.nodes.length);
      }
      if (block[tag]) {
        node.tagType = 'block';
      } else if (inline[tag]) {
        node.tagType = 'inline';
      } else if (closeSelf[tag]) {
        node.tagType = 'closeSelf';
      }
      if (attrs.length !== 0) {
        node.attr = attrs.reduce(function (pre, attr) {
          var name = attr.name;
          var value = attr.value;
          if (name == 'class') {
            // console.dir(value);
            //  value = value.join("")
            node.classStr = value;
          }
          // has multi attibutes
          // make it array of attribute
          if (name == 'style') {
            // console.dir(value);
            //  value = value.join("")
            node.styleStr = value;
          }
          if (value.match(/ /)) {
            value = value.split(' ');
          }

          // if attr already exists
          // merge it
          if (pre[name]) {
            if (Array.isArray(pre[name])) {
              // already array, push to last
              pre[name].push(value);
            } else {
              // single value, make it array
              pre[name] = [pre[name], value];
            }
          } else {
            // not exist, put it
            pre[name] = value;
          }
          return pre;
        }, {});
      }
      if (unary) {
        // if this tag doesn't have end tag
        // like <img src="hoge.png"/>
        // add to parents
        var parent = bufArray[0] || results;
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function end(tag) {
      // debug(tag);
      // merge into parent tag
      var node = bufArray.shift();
      if (node.tag !== tag) console.error('invalid state: mismatch end tag');

      // 当有缓存source资源时于于video补上src资源
      if (node.tag === 'video' && results.source) {
        node.attr.src = results.source;
        delete results.source;
      }
      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    },
    chars: function chars(text) {
      // debug(text);
      var node = {
        node: 'text',
        text: text
        // textArray: transEmojiStr(text),
      };

      if (bufArray.length === 0) {
        node.index = index.toString();
        index += 1;
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
        node.index = "".concat(parent.index, ".").concat(parent.nodes.length);
        parent.nodes.push(node);
      }
    },
    comment: function comment(text) {}
  });
  return results;
}
function strcharacterDiscode(str) {
  str = str.replace(/&nbsp;/g, ' ');
  str = str.replace(/&quot;/g, "'");
  str = str.replace(/&amp;/g, '&');
  str = str.replace(/&lt;/g, '<');
  str = str.replace(/&gt;/g, '>');
  str = str.replace(/&#8226;/g, '•');
  return str;
}
function strMoreDiscode(str) {
  str = str.replace(/\r\n/g, '');
  str = str.replace(/\n/g, '');
  str = str.replace(/code/g, 'wxxxcode-style');
  return str;
}
function strDiscode(str) {
  str = strcharacterDiscode(str);
  str = strMoreDiscode(str);
  return str;
}
function transEmojiStr(str) {
  var emojiObjs = [];
  // 如果正则表达式为空
  if (__emojisReg.length == 0 || !__emojis) {
    var emojiObj = {};
    emojiObj.node = 'text';
    emojiObj.text = str;
    array = [emojiObj];
    return array;
  }
  // 这个地方需要调整
  str = str.replace(/\[([^\[\]]+)\]/g, ':$1:');
  var eReg = new RegExp('[:]');
  var array = str.split(eReg);
  for (var i = 0; i < array.length; i++) {
    var ele = array[i];
    var emojiObj = {};
    if (__emojis[ele]) {
      emojiObj.node = 'element';
      emojiObj.tag = 'emoji';
      emojiObj.text = __emojis[ele];
      emojiObj.baseSrc = __emojisBaseSrc;
    } else {
      emojiObj.node = 'text';
      emojiObj.text = ele;
    }
    emojiObjs.push(emojiObj);
  }
  return emojiObjs;
}
module.exports = {
  html2json: html2json
};

/***/ }),
/* 19 */
/***/ ((module) => {

/* eslint-disable */

// Regular Expressions for parsing tags and attributes
var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
var endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
var attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// Empty Elements - HTML 5
var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');

// Block Elements - HTML 5
var block = makeMap('a,address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
var inline = makeMap('abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

// Special Elements (can contain anything)
var special = makeMap('wxxxcode-style,script,style,view,scroll-view,block');
function HTMLParser(html, handler) {
  var index;
  var chars;
  var match;
  var stack = [];
  var last = html;
  stack.last = function () {
    return this[this.length - 1];
  };
  while (html) {
    chars = true;

    // Make sure we're not in a script or style element
    if (!stack.last() || !special[stack.last()]) {
      // Comment
      if (html.indexOf('<!--') == 0) {
        index = html.indexOf('-->');
        if (index >= 0) {
          if (handler.comment) {
            handler.comment(html.substring(4, index));
          }
          html = html.substring(index + 3);
          chars = false;
        }

        // end tag
      } else if (html.indexOf('</') == 0) {
        match = html.match(endTag);
        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(endTag, parseEndTag);
          chars = false;
        }

        // start tag
      } else if (html.indexOf('<') == 0) {
        match = html.match(startTag);
        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(startTag, parseStartTag);
          chars = false;
        }
      }
      if (chars) {
        index = html.indexOf('<');
        var text = '';
        while (index === 0) {
          text += '<';
          html = html.substring(1);
          index = html.indexOf('<');
        }
        text += index < 0 ? html : html.substring(0, index);
        html = index < 0 ? '' : html.substring(index);
        if (handler.chars) {
          handler.chars(text);
        }
      }
    } else {
      html = html.replace(new RegExp("([\\s\\S]*?)</".concat(stack.last(), "[^>]*>")), function (all, text) {
        text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, '$1$2');
        if (handler.chars) {
          handler.chars(text);
        }
        return '';
      });
      parseEndTag('', stack.last());
    }
    if (html == last) {
      throw "Parse Error: ".concat(html);
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();
  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();
    if (block[tagName]) {
      while (stack.last() && inline[stack.last()]) {
        parseEndTag('', stack.last());
      }
    }
    if (closeSelf[tagName] && stack.last() == tagName) {
      parseEndTag('', tagName);
    }
    unary = empty[tagName] || !!unary;
    if (!unary) {
      stack.push(tagName);
    }
    if (handler.start) {
      var attrs = [];
      rest.replace(attr, function (match, name) {
        var value = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[name] ? name : '';
        attrs.push({
          name: name,
          value: value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') // "
        });
      });

      if (handler.start) {
        handler.start(tagName, attrs, unary);
      }
    }
  }
  function parseEndTag(tag, tagName) {
    // If no tag name is provided, clean shop
    if (!tagName) {
      var pos = 0;
    }

    // Find the closest opened tag of the same type
    else {
      tagName = tagName.toLowerCase();
      for (var pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos] == tagName) {
          break;
        }
      }
    }
    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (handler.end) {
          handler.end(stack[i]);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
}
function makeMap(str) {
  var obj = {};
  var items = str.split(',');
  for (var i = 0; i < items.length; i++) {
    obj[items[i]] = true;
  }
  return obj;
}
module.exports = HTMLParser;

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RichText),
/* harmony export */   getCharWidth: () => (/* binding */ getCharWidth)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _src_components_elements__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);





function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var parser = __webpack_require__(18);
var DEFAULT_FONT_FAMILY = 'sans-serif';
function createCanvas() {
  /* istanbul ignore if*/
  if (typeof __env !== 'undefined') {
    return __env.createCanvas();
  }
  return document.createElement('canvas');
}
var ctx;

/**
 * @description 获取字符宽度
 * @param char
 * @param fontSize
 */
var getCharWidth = function getCharWidth(_char, fontSize) {
  if (!ctx) {
    var canvas = createCanvas();
    ctx = canvas.getContext('2d');
  }
  var _ctx$measureText = ctx.measureText(_char),
    width = _ctx$measureText.width;
  return width * fontSize / 10;
};
function iterateTree(element, callback) {
  if (callback) {
    callback(element);
  }
  if (element.nodes) {
    element.nodes.forEach(function (child) {
      child.parent = element;
      iterateTree(child, callback);
    });
  }
}
var RichText = /*#__PURE__*/function (_Element) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__["default"])(RichText, _Element);
  var _super = _createSuper(RichText);
  function RichText(opts) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, RichText);
    var _opts$style = opts.style,
      style = _opts$style === void 0 ? {} : _opts$style,
      _opts$idName = opts.idName,
      idName = _opts$idName === void 0 ? '' : _opts$idName,
      _opts$className = opts.className,
      className = _opts$className === void 0 ? '' : _opts$className,
      dataset = opts.dataset;
    _this = _super.call(this, {
      idName: idName,
      className: className,
      dataset: dataset,
      style: style
    });
    _this.innerText = '';
    _this.jsonData = null;
    return _this;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(RichText, [{
    key: "text",
    get: function get() {
      return this.innerText;
    },
    set: function set(value) {
      if (value === this.innerText) {
        return;
      }
      this.innerText = value;
      var jsonData = parser.html2json(this.innerText);
      this.jsonData = jsonData;
      this.root.emit('repaint');
      this.buildDrawCallFromJsonData(jsonData);
    }
  }, {
    key: "setStyleForDc",
    value: function setStyleForDc(currDc, styleObj) {
      if (styleObj['font-weight']) {
        currDc.fontWeight = styleObj['font-weight'];
      }
      if (styleObj['font-style']) {
        currDc.fontStyle = styleObj['font-style'];
      }
      if (styleObj.color) {
        currDc.filleStyle = styleObj.color;
      }
      if (styleObj['font-size']) {
        currDc.fontSize = styleObj['font-size'].replace('px', '');
      }
    }
  }, {
    key: "buildDrawCallFromJsonData",
    value: function buildDrawCallFromJsonData(jsonData) {
      var _this2 = this;
      var _this$style = this.style,
        width = _this$style.width,
        _this$style$lineHeigh = _this$style.lineHeight,
        lineHeight = _this$style$lineHeigh === void 0 ? 16 : _this$style$lineHeigh,
        _this$style$fontSize = _this$style.fontSize,
        fontSize = _this$style$fontSize === void 0 ? 12 : _this$style$fontSize;

      // 针对整个节点树进行解析，算出最后需要独立调用 canvas API 绘制的列表
      var dcs = [];
      // 换行标记
      var lines = -1;
      // 当前行宽度标记
      var lineWidth = 0;
      var currDc;
      function createDc() {
        var dc = {
          filleStyle: null,
          fontStyle: null,
          fontSize: null,
          textAlign: null,
          text: '',
          x: 0,
          y: 0
        };
        dcs.push(dc);
        currDc = dc;
        currDc.x = lineWidth;
        currDc.y = lineHeight * lines;
        return dc;
      }
      iterateTree(jsonData, function (node) {
        // tagType： block、inline
        var tagType = node.tagType,
          tag = node.tag,
          styleStr = node.styleStr;
        // block类型新起一行
        if (tagType === 'block') {
          lines += 1;
          lineWidth = 0;
          createDc();
        }

        // 加粗
        if (tag === 'strong') {
          // 当前dc并不是加粗文本且并不为空，需要创建新的 dc
          if (currDc.fontWeight !== 'bold' && currDc.text) {
            createDc();
            currDc.fontWeight = 'bold';
          }

          // 本身刚刚新起一行，不再需要创建新的，直接用即可
          if (currDc.text === '') {
            currDc.fontWeight = 'bold';
          }
          if (!node.styleObj) {
            node.styleObj = {};
          }
          node.styleObj['font-weight'] = 'bold';
        }
        var styleObj = {};
        /**
         * 当前标签有样式的情况
         * 1. 处理样式，目前支持颜色、加粗、字体大小
         * 2. 目前暴力处理，不管当前dc什么状态，只要是有 style 就创建新的dc
         */
        if (styleStr) {
          styleObj = styleStr.split(';').reduce(function (res, curr) {
            var temp = curr.split(':');
            res[temp[0]] = temp[1].trim();
            return res;
          }, {});
          if (styleObj) {
            createDc();

            // 继承父节点的样式
            var parent = node.parent;
            while (parent) {
              if (parent.styleObj) {
                styleObj = Object.assign({}, parent.styleObj, styleObj);
              }
              parent = parent.parent;
            }
            _this2.setStyleForDc(currDc, styleObj);
            node.styleObj = styleObj;
          }
        } else {
          var _node$parent, _node$parent2, _node$parent3;
          // 继承父节点的样式
          var _parent = node.parent;
          while (_parent) {
            if (_parent.styleObj) {
              styleObj = Object.assign({}, _parent.styleObj, styleObj);
            }
            _parent = _parent.parent;
          }
          var nodeIndex = (_node$parent = node.parent) === null || _node$parent === void 0 ? void 0 : _node$parent.nodes.indexOf(node);
          // 前一个节点同样存在样式，新建dc
          if (nodeIndex > 0 && ((_node$parent2 = node.parent) !== null && _node$parent2 !== void 0 && _node$parent2.nodes[nodeIndex - 1].styleStr || ((_node$parent3 = node.parent) === null || _node$parent3 === void 0 ? void 0 : _node$parent3.nodes[nodeIndex - 1].tag) === 'strong')) {
            createDc();
          }
          _this2.setStyleForDc(currDc, styleObj);
        }
        var localFontSize = styleObj['font-size'] ? Number(styleObj['font-size'].replace('px', '')) : fontSize;
        // 文本类型
        if (node.text) {
          if (!currDc) {
            createDc();
          }
          for (var i = 0; i < node.text.length; i++) {
            var _char2 = node.text[i];
            var charWidth = getCharWidth(_char2, currDc && currDc.fontSize || fontSize);

            // 触发了换行逻辑
            if (lineWidth + charWidth > width) {
              lines += 1;
              lineWidth = 0;
              var lastDc = currDc;
              createDc();
              // 因为字符太长触发的换行样式继承到下一个dc
              Object.assign(currDc, lastDc);
              currDc.text = '';
              currDc.y = lineHeight * lines;
              currDc.x = 0;
            }
            lineWidth += charWidth;
            currDc.text += _char2;
          }
        }
      });
      this.dcs = dcs;
      this.style.height = lines * lineHeight;
    }
  }, {
    key: "repaint",
    value: function repaint() {
      this.render();
    }
  }, {
    key: "destroySelf",
    value: function destroySelf() {
      this.root = null;
    }
  }, {
    key: "insert",
    value: function insert(ctx, needRender) {
      this.ctx = ctx;
      this.toCanvasData();
      if (needRender) {
        this.render();
      }
    }
  }, {
    key: "toCanvasData",
    value: function toCanvasData() {
      var style = this.style || {};
      this.fontSize = style.fontSize || 12;
      this.textBaseline = 'top';
      this.font = "".concat(style.fontWeight || '', " ").concat(style.fontSize || 12, "px ").concat(DEFAULT_FONT_FAMILY);
      this.textAlign = style.textAlign || 'left';
      this.fillStyle = style.color || '#000';
    }
  }, {
    key: "render",
    value: function render() {
      var ctx = this.ctx;
      // this.toCanvasData();
      ctx.save();
      var box = this.layoutBox;
      var style = this.style;
      ctx.textBaseline = this.textBaseline;
      ctx.font = this.font;
      ctx.textAlign = this.textAlign;
      var drawX = box.absoluteX;
      var drawY = box.absoluteY;
      var _this$renderBorder = this.renderBorder(ctx),
        needClip = _this$renderBorder.needClip,
        needStroke = _this$renderBorder.needStroke;
      if (needClip) {
        ctx.clip();
      }
      if (style.backgroundColor) {
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(drawX, drawY, box.width, box.height);
      }
      if (style.backgroundImage && this.backgroundImage) {
        ctx.drawImage(this.backgroundImage, drawX, drawY, box.width, box.height);
      }
      if (needStroke) {
        ctx.stroke();
      }
      if (this.dcs && this.dcs.length) {
        var _this$style2 = this.style,
          width = _this$style2.width,
          _this$style2$lineHeig = _this$style2.lineHeight,
          lineHeight = _this$style2$lineHeig === void 0 ? 12 : _this$style2$lineHeig,
          _this$style2$fontSize = _this$style2.fontSize,
          fontSize = _this$style2$fontSize === void 0 ? 12 : _this$style2$fontSize;
        this.dcs.forEach(function (dc) {
          if (dc.text) {
            if (dc.fontWeight || dc.fontSize || dc.filleStyle || dc.fontStyle) {
              ctx.save();
              if (dc.filleStyle) {
                ctx.fillStyle = dc.filleStyle;
              }
              ctx.font = "".concat(dc.fontStyle || '', " ").concat(dc.fontWeight || '', " ").concat(dc.fontSize || fontSize, "px ").concat(DEFAULT_FONT_FAMILY);
              ctx.fillText(dc.text, drawX + dc.x, drawY + dc.y);
              ctx.restore();
            } else {
              ctx.fillText(dc.text, drawX + dc.x, drawY + dc.y);
            }
          }
        });
      }
      ctx.restore();
    }
  }]);
  return RichText;
}(_src_components_elements__WEBPACK_IMPORTED_MODULE_5__["default"]);

})();

module.exports = __webpack_exports__;
/******/ })()
;