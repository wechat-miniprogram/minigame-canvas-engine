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
/* harmony import */ var _common_adaptor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);
/* harmony import */ var _common_pseudoClassManager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(14);
/* harmony import */ var _common_textManager_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(15);
/* harmony import */ var _renderer_renderContextManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(16);
/* harmony import */ var _components_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(29);
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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











 // components


var constructorMap = {
  view: _components_index_js__WEBPACK_IMPORTED_MODULE_9__["View"],
  text: _components_index_js__WEBPACK_IMPORTED_MODULE_9__["Text"],
  image: _components_index_js__WEBPACK_IMPORTED_MODULE_9__["Image"] // video: Video

};
/**
 * 节点初始化
 * @param {*} node 节点
 * @param {*} style 节点lightmode样式
 * @param {*} styleDark 节点darkmode样式
 * @param {*} isDarkMode 是否darkmode
 * @param {*} fontSize 字体大小
 */

var create = function create(node, style) {
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
      var datakey = Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["dash2camel"])(key.substring(5));
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
  var s = isDarkMode ? Object.assign({}, element.styleInit, element.styleDarkInit, element.styleProp) : Object.assign({}, element.styleInit, element.styleProp);

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

    var computedStyle = isDarkMode ? Object.assign({}, element.styleInit, element.styleDarkInit, element.styleProp, element._innerStyle) : Object.assign({}, element.styleInit, element.styleProp, element._innerStyle);
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
};
/**
 * 格式化渲染相关的数据
 * @param {Array} children 子节点
 * @param {Boolean} isDarkMode 是否暗黑模式
 * @param {Number} fontSize 字体大小
 * @param {Array} webGLRenderData
 */


function layoutChildren(children, isDarkMode, fontSize, webGLRenderData) {
  var _this2 = this;

  var _loop = function _loop(i) {
    var child = children[i];
    var style = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["getElementStyle"].call(child, isDarkMode);
    var computedStyle = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["getElementStyle"].call(child, isDarkMode);
    child.realLayoutBox = child.realLayoutBox || {};
    ['left', 'top', 'width', 'height'].forEach(function (prop) {
      child.realLayoutBox[prop] = child.layoutBox[prop];
    });

    if (child.parent) {
      child.layoutBox.absoluteX = (child.parent.layoutBox.absoluteX || 0) + child.layoutBox.left;
      child.layoutBox.absoluteY = (child.parent.layoutBox.absoluteY || 0) + child.layoutBox.top;
      child.realLayoutBox.realX = (child.parent.realLayoutBox.realX || 0) + child.realLayoutBox.left;
      child.realLayoutBox.realY = (child.parent.realLayoutBox.realY || 0) + child.realLayoutBox.top;
    } else {
      child.layoutBox.absoluteX = child.layoutBox.left;
      child.layoutBox.absoluteY = child.layoutBox.top;
      child.realLayoutBox.realX = child.realLayoutBox.left;
      child.realLayoutBox.realY = child.realLayoutBox.top;
    } // child.layoutBox.borderRadius = style.borderRadius || 0; // layoutBox要保存下圆角的信息，用于其子节点的绘制


    child.layoutBox.originalAbsoluteY = child.layoutBox.absoluteY;

    if (child.type === 'ScrollView') {
      // 滚动列表的画板尺寸和主画板保持一致
      child.updateRenderPort(_this2.renderport);
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
    layoutChildren.call(_this2, child.childNodes, isDarkMode, fontSize, webGLRenderData);
  };

  for (var i = 0; i < children.length; i++) {
    var _ret = _loop(i);

    if (_ret === "continue") continue;
  }
}
/**
 * 获取节点需要缓存的数据
 * @param {Array} childNodes
 */


function getNodeData(childNodes) {
  var layoutData = [];

  for (var i = 0; i < childNodes.length; i++) {
    var child = childNodes[i];
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

    if (child.childNodes && child.childNodes.length) {
      layoutData[i].childNodes = getNodeData(child.childNodes);
    } else {
      layoutData[i].childNodes = [];
    }
  }

  return layoutData;
} // 恢复布局数据，需要保证节点树、节点样式完全一致


function restoreLayoutTree(childNodes, layoutNodes) {
  var ret = true;

  for (var i = 0; i < childNodes.length; i++) {
    var child = childNodes[i];
    var node = layoutNodes[i];

    if (child.type === node.type && JSON.stringify(child.styleInit) === JSON.stringify(node.styleInit) && JSON.stringify(child.styleProp) === JSON.stringify(node.styleProp) && JSON.stringify(child.styleDarkInit) === JSON.stringify(node.styleDarkInit)) {
      child.layoutBox = node.layoutBox;

      if (child.type === 'text') {
        child.valueBreak = node.valueBreak;
      }

      if (child.childNodes.length !== node.childNodes.length) {
        ret = false;
      } else {
        ret = restoreLayoutTree(child.childNodes, node.childNodes);
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

  for (var i = 0; i < tree.childNodes.length; i++) {
    var child = tree.childNodes[i];

    if (child.idName === id) {
      result = child;
      break;
    } else if (child.childNodes.length) {
      result = _getElementById(child, id);
      if (result) break;
    }
  }

  return result;
}

function _getElementsByClassName(tree) {
  var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var className = arguments.length > 2 ? arguments[2] : undefined;

  for (var i = 0; i < tree.childNodes.length; i++) {
    var child = tree.childNodes[i];

    if (child.className.split(/\s+/).indexOf(className) > -1) {
      list.push(child);
    }

    if (child.childNodes.length) {
      _getElementsByClassName(child, list, className);
    }
  }

  return list;
}

function _getChildsByPos(tree, x, y) {
  var list = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var ret = [];

  for (var i = 0; i < tree.childNodes.length; i++) {
    var child = tree.childNodes[i];
    var box = child.realLayoutBox;

    if (box.realX <= x && x <= box.realX + box.width && box.realY <= y && y <= box.realY + box.height && child.computedStyle.display !== 'none') {
      if (child.childNodes.length) {
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

var _Layout = /*#__PURE__*/function (_Element) {
  _inherits(_Layout, _Element);

  var _super = _createSuper(_Layout);

  function _Layout() {
    var _this3;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        style = _ref.style,
        name = _ref.name,
        isDarkMode = _ref.isDarkMode,
        getWidth = _ref.getWidth,
        getFontSize = _ref.getFontSize,
        getFps = _ref.getFps,
        canvasId = _ref.canvasId,
        canvasContext = _ref.canvasContext,
        fontManager = _ref.fontManager;

    _classCallCheck(this, _Layout);

    _this3 = _super.call(this, {
      style: style,
      id: 0,
      name: name
    });
    _this3._methods = {};
    _this3.canvasId = canvasId;
    _this3.hasEventHandler = false;
    _this3.elementTree = null;
    _this3.renderContext = null;

    if (canvasContext) {
      _this3.setCanvasContext(canvasContext);
    }

    _this3.fontManager = fontManager;
    _this3.debugInfo = {};
    _this3.renderport = {}; // 包含像素比例的宽高

    _this3.touchStart = _this3.eventHandler('touchstart').bind(_assertThisInitialized(_this3));
    _this3.touchMove = _this3.eventHandler('touchmove').bind(_assertThisInitialized(_this3));
    _this3.touchEnd = _this3.eventHandler('touchend').bind(_assertThisInitialized(_this3));
    _this3.touchCancel = _this3.eventHandler('touchcancel').bind(_assertThisInitialized(_this3));
    _this3.version = '0.0.1';
    _this3.touchMsg = {};
    _this3.hasViewPortSet = false;
    _this3.realLayoutBox = {
      realX: 0,
      realY: 0
    };
    _this3.pseudoClassManager = new _common_pseudoClassManager_js__WEBPACK_IMPORTED_MODULE_6__["default"](_assertThisInitialized(_this3));
    _this3.textManager = new _common_textManager_js__WEBPACK_IMPORTED_MODULE_7__["default"](_assertThisInitialized(_this3));

    _this3.isDarkMode = isDarkMode || function () {
      return false;
    }; // 是否darkmode


    _this3.getWidth = getWidth || function () {
      return 0;
    };

    _this3.getFontSize = getFontSize || function () {
      return 1;
    };

    _this3.getFps = getFps || function () {
      return 0;
    };

    _this3.state = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].UNINIT;
    _this3.imgPool = new _common_pool_js__WEBPACK_IMPORTED_MODULE_1__["default"]('imgPool');
    _this3._emitter = new tiny_emitter__WEBPACK_IMPORTED_MODULE_2___default.a();
    _this3._EE = new tiny_emitter__WEBPACK_IMPORTED_MODULE_2___default.a();
    _this3.viewport = {
      width: getWidth()
    }; // 不包含像素的宽高

    _this3._videos = [];
    _this3._firstComputeLayout = true; // 是否首次计算布局

    _this3._useLayoutData = false; // 是否使用了序列化的布局数据

    return _this3;
  }

  _createClass(_Layout, [{
    key: "methods",
    value: function methods(config) {
      this._methods = config;
    }
  }, {
    key: "setCanvasContext",
    value: function setCanvasContext(ctx) {
      this.canvasContext = ctx; // this.renderContext = setupGl(ctx.canvas);

      this.renderContext = new _renderer_renderContextManager__WEBPACK_IMPORTED_MODULE_8__["default"](ctx);
    }
  }, {
    key: "initRepaint",
    value: function initRepaint() {}
  }, {
    key: "init",
    value: function init(template, style) {
      var _this4 = this;

      var styleDark = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Object(_common_adaptor__WEBPACK_IMPORTED_MODULE_5__["initYoga"])().then(function () {
        var start = new Date();
        _this4.cssRules = {}; // 保存下css规则

        _this4.cssDarkRules = {}; // 保存下css darkmode的规则
        // 处理所有class里面的尺寸

        for (var k in style) {
          _this4.cssRules[k] = {};

          for (var key in style[k]) {
            _this4.cssRules[k][key] = style[k][key];
          }
        }

        for (var _k in styleDark) {
          _this4.cssDarkRules[_k] = {};

          for (var _key2 in styleDark[_k]) {
            _this4.cssDarkRules[_k][_key2] = styleDark[_k][_key2];
          }
        }
        /*if( parser.validate(template) === true) { //optional (it'll return an object in case it's not valid)*/


        var jsonObj = _libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_4___default.a.parse(template, {
          // todo 需要一个预解析操作
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
        }, true);
        /*}*/

        var xmlTree = jsonObj.children[0];
        _this4.debugInfo.xmlTree = new Date() - start;
        console.log("init getXmlTree time ".concat(new Date() - start)); // XML树生成渲染树

        _this4.layoutTree = create.call(_this4, xmlTree, style, styleDark, _this4.isDarkMode(), _this4.getFontSize());
        console.log("create time ".concat(new Date() - start));
        _this4.debugInfo.layoutTree = new Date() - start;

        _this4.add(_this4.layoutTree);

        _this4.debugInfo.renderTree = new Date() - start;
        _this4.state = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].INITED;
        _this4.reflowRequest = 0;
        _this4.repaintRequest = 0; // 收到reflow事件后，知道下一个loop没有reflow才执行computeLayout

        _this4.on('reflow', function () {
          _this4.reflowRequest++;
          Promise.resolve(_this4.reflowRequest).then(function (val) {
            if (_this4.reflowRequest === val) {
              console.log('layout reflow');
              _this4.reflowRequest = 0;
              _this4.textManager.hasUpdate = false;

              _this4.computeLayout();

              _this4.drawLayout();
            }
          });
        });

        console.log("init time ".concat(new Date() - start));

        _this4.computeLayout();
      });
    }
  }, {
    key: "forceUpdate",
    value: function forceUpdate() {
      var _this5 = this;

      console.log('forceUpdate--------');

      if (this.flushing) {
        return;
      }

      this.flushing = true;
      Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["nextTick"])(function () {
        console.log('nextTick forceUpdate--------');

        _this5.repaint();

        _this5.flushing = false;
      });
    }
  }, {
    key: "beforeReflow",
    value: function beforeReflow(childNodes) {
      childNodes = childNodes || this.childNodes;

      for (var i = 0, len = childNodes.length; i < len; i++) {
        if (childNodes[i].beforeReflow) {
          childNodes[i].beforeReflow();
        }

        this.beforeReflow(childNodes[i].childNodes);
      }
    } // 把数据丢给渲染线程

  }, {
    key: "repaint",
    value: function repaint() {
      console.log('repaint call');
      var renderer = this.renderContext;
      console.log(renderer.glRects.length);
      renderer.draw();
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
          childNodes: getNodeData(this.childNodes)
        }
      }; // console.log(data);

      return data;
    }
  }, {
    key: "setLayoutData",
    value: function setLayoutData(data) {
      console.log('set layoutData', data.charWidthMap);
      this.layoutData = data;

      if (data.charWidthMap) {
        Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["setCharMap"])(data.charWidthMap);
      }
    } // 计算布局树

  }, {
    key: "computeLayout",
    value: function computeLayout() {
      console.log('start computeLayout');
      var start = new Date();
      this.renderport.height = 0;
      this.viewport.width = this.getWidth();
      var isDarkMode = this.isDarkMode();
      var fontSize = this.getFontSize(); // 第一层根节点，宽度如果是设置了百分比，把宽度改成屏幕的宽度

      for (var i = 0; i < this.childNodes.length; i++) {
        var child = this.childNodes[i];
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

      if (this.layoutData && this.layoutData.layoutBoxTree && this.layoutData.layoutBoxTree.childNodes && this.layoutData.layoutBoxTree.childNodes.length) {
        // 有layout数据，不用再用yoga跑一遍
        var layoutBoxTree = this.layoutData.layoutBoxTree;
        this.layoutBox = layoutBoxTree.layoutBox;

        if (restoreLayoutTree(this.childNodes, layoutBoxTree.childNodes)) {
          console.log('restoreLayoutTree success');
          this.layoutData = null;
          this.textManager.hasUpdate = true;
          this._useLayoutData = true;
        } else {
          console.log('restoreLayoutTree fail');
          this.layoutData = null;
          Object(_common_adaptor__WEBPACK_IMPORTED_MODULE_5__["adaptor"])(this);
        }
      } else {
        console.log('without layoutData');
        Object(_common_adaptor__WEBPACK_IMPORTED_MODULE_5__["adaptor"])(this);
        this._useLayoutData = false;
      }

      this.debugInfo.yogaLayout = new Date() - start;
      console.log("yoga-layout time ".concat(this.debugInfo.yogaLayout));
      this.debugInfo.computeLayout = new Date() - start; // 这里更新下文本节点的宽高

      if (!this.textManager.hasUpdate) {
        this.textManager.hasUpdate = true;
        this.textManager.updateTextNodeLayoutBox();
        console.log('updateTextNodeLayoutBox');
        Object(_common_adaptor__WEBPACK_IMPORTED_MODULE_5__["calculateDirtyNode"])(this);
        Object(_common_adaptor__WEBPACK_IMPORTED_MODULE_5__["updateLayout"])(this);
      }

      var webGLRenderData = [];
      console.log('before renderContext clear');
      this.renderContext.clear();
      layoutChildren.call(this, this.childNodes, isDarkMode, fontSize, webGLRenderData);

      for (var _i = 0; _i < this.childNodes.length; _i++) {
        this.renderport.height += this.childNodes[_i].layoutBox.height;
      }

      this.viewport.height = this.renderport.height;
      console.log('viewport.height', this.viewport.height);
      this.renderContext.width = this.viewport.width;
      this.renderContext.height = this.viewport.height;
      this.debugInfo.layoutChildren = new Date() - start;
      console.log("computeLayout time ".concat(this.debugInfo.computeLayout));

      if (this._firstComputeLayout && !this._useLayoutData) {
        // 这里统计首次计算布局并且没有序列化数据的耗时
        this._firstComputeLayout = false;
      } else if (!this._useLayoutData) {} else if (this._useLayoutData) {}
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
      var start = new Date();

      if (!this.canvasContext) {
        return;
      }

      console.log('drawLayout');
      this.debugInfo.renderChildren = new Date() - start;
      this.bindEvents();
      this.state = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].RENDERED;
      this.forceUpdate();
    } // 根据x和y找到相应的子节点

  }, {
    key: "getChildByPos",
    value: function getChildByPos(tree, x, y) {
      var list = _getChildsByPos(tree, x, y, []);

      var length = list.length;
      return list[length - 1];
    }
  }, {
    key: "eventHandler",
    value: function eventHandler(eventName) {
      return function touchEventHandler(e) {
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

        var item = touch && this.getChildByPos(this, touch.clientX - offsetLeft, touch.clientY - offsetTop);
        console.log(eventName, 'item', item.className);
        event.item = item;
        event.target = item;
        item && item.emit(eventName, event);

        if (eventName === 'touchstart' || eventName === 'touchend') {
          this.touchMsg[eventName] = touch;
        }

        if (eventName === 'touchend' && Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["isClick"])(this.touchMsg)) {
          console.log('emit click event!');
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
      var _this6 = this;

      // console.log('bindEvents call');
      if (this.hasEventHandler) {
        return;
      }

      console.log('bindEvents call');
      this.hasEventHandler = true;

      this._touchStartHandler = function (e) {
        console.log('touch start');

        _this6.touchStart(e);
      };

      this._touchMoveHandler = function (e) {
        _this6.touchMove(e);
      };

      this._touchEndHandler = function (e) {
        console.log('touch end');

        _this6.touchEnd(e); // console.log('before pseudoClassManager clearActiveState');


        _this6.pseudoClassManager.clearActiveState(); // 清除所有:active的状态

      };

      this._touchCancelHandler = function (e) {
        _this6.touchCancel(e);

        _this6.pseudoClassManager.clearActiveState(); // 清除所有:active的状态

      }; // this.canvasContext.addEventListener('mousedown', this._touchStartHandler);


      console.log('canvasContext addEventListener ', this.canvasContext);
      this.canvasContext.addEventListener('touchstart', this._touchStartHandler);
      this.canvasContext.addEventListener('touchmove', this._touchMoveHandler);
      this.canvasContext.addEventListener('touchend', this._touchEndHandler); // this.canvasContext.addEventListener('mouseup', this._touchEndHandler);

      this.canvasContext.addEventListener('touchcancel', this._touchCancelHandler);
    }
  }, {
    key: "unbindEvents",
    value: function unbindEvents() {
      if (this.hasEventHandler) {
        console.log('removeEventListener when clear');
        this.canvasContext.removeEventListener('touchstart', this._touchStartHandler);
        this.canvasContext.removeEventListener('touchmove', this._touchMoveHandler);
        this.canvasContext.removeEventListener('touchend', this._touchEndHandler);
        this.canvasContext.removeEventListener('touchcancel', this._touchCancelHandler);
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
      return _getElementsByClassName(this, [], className);
    }
  }, {
    key: "getElementById",
    value: function getElementById(id) {
      return _getElementById(this, id);
    }
  }, {
    key: "destroyAll",
    value: function destroyAll(tree) {
      if (!tree) {
        tree = this;
      }

      for (var i = 0; i < tree.childNodes.length; i++) {
        var child = tree.childNodes[i];
        child.destroy();
        this.destroyAll(child);
        child.destroySelf && child.destroySelf();
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this7 = this;

      this.unbindEvents();
      this.destroyAll();
      this.textManager.clear();
      this._methods = null;
      this._videos = [];
      this.elementTree = null;
      this.childNodes = [];
      this.children = {};
      this.layoutTree = {};
      this.state = _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].CLEAR;
      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint'].forEach(function (eventName) {
        _this7.off(eventName);
      });
      this.EE.off('image__render__done');
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
      var _this8 = this;

      arr.forEach(function (src) {
        var img = _this8.canvasContext.createImage();

        _this8.imgPool.set(src, img);

        img.onload = function () {
          img.loadDone = true;
        };

        img.onloadcbks = [];
        img.setSrc(src);
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
      var _this9 = this;

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
          // console.log('new text', key);
          width = _this9.fontManager.measureText(str, fontWeight || 'normal', fontStyle || 'normal', (fontSize || 12) * fontSizeRate, fontFamily || _common_util_js__WEBPACK_IMPORTED_MODULE_3__["DEFAULT_FONT_FAMILY"]) || 0;
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
      width: 'auto',
      height: 'auto'
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
    fontManager: opt.fontManager
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
  var elementEvent = ['click', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];

  if (elementEvent.indexOf(event) !== -1) {
    return "element-".concat(id, "-").concat(event);
  }

  return "element-".concat(id, "-").concat(event);
};
/**
 * 格式化样式
 * @param {Object} style
 */


var formatStyle = function formatStyle(style) {
  if (style.opacity !== undefined && style.color && style.color.indexOf('#') > -1) {
    style.color = Object(_common_util_js__WEBPACK_IMPORTED_MODULE_1__["getRgba"])(style.color, style.opacity);
  }

  if (style.opacity !== undefined && style.backgroundColor && style.backgroundColor.indexOf('#') > -1) {
    style.backgroundColor = Object(_common_util_js__WEBPACK_IMPORTED_MODULE_1__["getRgba"])(style.backgroundColor, style.opacity);
  }

  Object.keys(style).forEach(function (key) {
    if (_style_js__WEBPACK_IMPORTED_MODULE_0__["scalableStyles"].indexOf(key) > -1 && typeof style[key] === 'number') {
      style[key] *= 1;
    }
  });
  return style;
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

    this.childNodes = [];
    this.parent = null;
    this.parentId = 0;
    this.id = id;
    this.props = props;
    this.idName = idName;
    this.className = className;
    this.styleInit = formatStyle(styleInit);
    this.styleActive = formatStyle(styleActive);
    this.styleDarkInit = formatStyle(styleDarkInit);
    this.styleDarkActive = formatStyle(styleDarkActive);
    this.dataset = dataset;
    this.root = null;
    this.isDestroyed = false;
    this.layoutBox = {};
    this.permanentListeners = {}; // 常驻监听

    this.onceListeners = {}; // 单次监听
    // 保存用户写在属性上的style，同时也保存用户通过xxxx.style.xxxx设置的style

    this.styleProp = {}; // 为了让用户修改style的时候，可以触发reflow，这里需要监听style属性的变化，只给用户修改样式的时候使用

    this.style = new Proxy({}, {
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

        return _this.styleProp[key] || _this.styleInit[key];
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
      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click'].forEach(function (eventName) {
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
    } // 子类填充实现

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
      var _this3 = this;

      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint'].forEach(function (eventName) {
        _this3.off(eventName);
      });
      this.EE.off('image__render__done');
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
      this.childNodes.push(element);
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
    key: "getOffscreenCanvas",
    value: function getOffscreenCanvas(key) {
      return this.root.canvasContext.getOffscreenCanvas(key);
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
      var _this4 = this;

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
        _this4.styleInit[prop] = _this4.styleProp[prop];
        _this4.styleDarkInit[prop] = _this4.styleProp[prop];
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
        var _root = this.root;
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
        var _root2 = this.root;
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
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  CLEAR: 3
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initYoga", function() { return initYoga; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "adaptor", function() { return adaptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateLayout", function() { return updateLayout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateDirtyNode", function() { return calculateDirtyNode; });
/* harmony import */ var _yoga_wasm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);

var yoga;
var Node;
var defaultNode;
/**
 * 小游戏wasm初始化只能是异步的，这里暴露wasm初始化函数给外部
 */

function initYoga() {
  return _yoga_wasm_js__WEBPACK_IMPORTED_MODULE_0__["Yoga"].init({
    sync: true
  }).then(function (res) {
    yoga = res;
    Node = yoga.Node;
    defaultNode = new Node();
  });
}
yoga = _yoga_wasm_js__WEBPACK_IMPORTED_MODULE_0__["Yoga"].init({
  sync: true
});
function adaptor(tree) {
  console.log('adaptor call');
  var s = Date.now();
  var yogaTree = getYogaTree(tree); // 获得一棵yoga虚拟树
  // yogaTree.getChild(0).calculateLayout();

  console.log("calculateLayout ".concat(Date.now() - s));
  updateLayout(tree);
}

function getYogaTree(node) {
  var yogaNode = null;

  if (node.yogaNode) {
    yogaNode = node.yogaNode;
    yogaNode.copyStyle(defaultNode);
  } else {
    yogaNode = Node.create();
    node.yogaNode = yogaNode;
  }

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


  if (style.width === 'auto') {
    yogaNode.setWidthAuto();
  } else if (typeof style.width === 'string' && style.width.endsWith('%')) {
    yogaNode.setWidthPercent(parseFloat(style.width));
  } else if (typeof style.width !== 'undefined') {
    yogaNode.setWidth(style.width);
  } else {
    yogaNode.setWidthAuto();
  } // 处理最大宽度


  if (typeof style.maxWidth === 'string' && style.maxWidth.endsWith('%')) {
    yogaNode.setMaxWidthPercent(parseFloat(style.maxWidth));
  } else if (typeof style.maxWidth !== 'undefined') {
    yogaNode.setMaxWidth(style.maxWidth);
  } // 处理最小宽度


  if (typeof style.minWidth === 'string' && style.minWidth.endsWith('%')) {
    yogaNode.setMinWidthPercent(parseFloat(style.minWidth));
  } else if (typeof style.minWidth !== 'undefined') {
    yogaNode.setMinWidth(style.minWidth);
  } // 处理高度


  if (style.height === 'auto') {
    yogaNode.setHeightAuto();
  } else if (typeof style.height === 'string' && style.height.endsWith('%')) {
    yogaNode.setHeightPercent(parseFloat(style.height));
  } else if (typeof style.height !== 'undefined') {
    yogaNode.setHeight(style.height);
  } else {
    yogaNode.setHeightAuto();
  } // 处理最大高度


  if (typeof style.maxHeight === 'string' && style.maxHeight.endsWith('%')) {
    yogaNode.setMaxHeightPercent(parseFloat(style.maxHeight));
  } else if (typeof style.maxHeight !== 'undefined') {
    yogaNode.setMaxHeight(style.maxHeight);
  } // 处理最小高度


  if (typeof style.minHeight === 'string' && style.minHeight.endsWith('%')) {
    yogaNode.setMinHeightPercent(parseFloat(style.minHeight));
  } else if (typeof style.minHeight !== 'undefined') {
    yogaNode.setMinHeight(style.minHeight);
  } // 处理padding/margin/border


  for (var _i = 0, _arr = ['padding', 'margin', 'borderWidth']; _i < _arr.length; _i++) {
    var styleName = _arr[_i];
    var fnName = "set".concat(styleName.charAt(0).toUpperCase()).concat(styleName.slice(1)).replace('Width', '');

    if (typeof style[styleName] === 'number') {
      yogaNode[fnName](yoga.EDGE_TOP, style[styleName]);
      yogaNode[fnName](yoga.EDGE_BOTTOM, style[styleName]);
      yogaNode[fnName](yoga.EDGE_LEFT, style[styleName]);
      yogaNode[fnName](yoga.EDGE_RIGHT, style[styleName]);
    } else if (typeof style[styleName] === 'string') {
      var s = style[styleName].split(' '); // 根据空格分割出padding的不同参数

      if (s.length === 1) {
        yogaNode[fnName](yoga.EDGE_TOP, style[styleName]);
        yogaNode[fnName](yoga.EDGE_BOTTOM, style[styleName]);
        yogaNode[fnName](yoga.EDGE_LEFT, style[styleName]);
        yogaNode[fnName](yoga.EDGE_RIGHT, style[styleName]);
      } else if (s.length === 2) {
        yogaNode[fnName](yoga.EDGE_TOP, s[0]);
        yogaNode[fnName](yoga.EDGE_BOTTOM, s[0]);
        yogaNode[fnName](yoga.EDGE_LEFT, s[1]);
        yogaNode[fnName](yoga.EDGE_RIGHT, s[1]);
      } else if (s.length === 3) {
        yogaNode[fnName](yoga.EDGE_TOP, s[0]);
        yogaNode[fnName](yoga.EDGE_LEFT, s[1]);
        yogaNode[fnName](yoga.EDGE_RIGHT, s[1]);
        yogaNode[fnName](yoga.EDGE_BOTTOM, s[2]);
      } else if (s.length === 4) {
        yogaNode[fnName](yoga.EDGE_TOP, s[0]);
        yogaNode[fnName](yoga.EDGE_RIGHT, s[1]);
        yogaNode[fnName](yoga.EDGE_BOTTOM, s[2]);
        yogaNode[fnName](yoga.EDGE_LEFT, s[3]);
      }
    }

    for (var _i2 = 0, _arr2 = ['Top', 'Bottom', 'Left', 'Right']; _i2 < _arr2.length; _i2++) {
      var direction = _arr2[_i2];
      var name = "".concat(styleName).concat(direction);

      if (typeof style[name] !== 'undefined') {
        yogaNode[fnName](yoga["EDGE_".concat(direction.toUpperCase())], style[name]);
      }
    }
  }

  for (var _i3 = 0, _arr3 = ['overflow', 'display']; _i3 < _arr3.length; _i3++) {
    var _styleName = _arr3[_i3];
    var _s = style[_styleName];

    var _fnName = "set".concat(_styleName.charAt(0).toUpperCase()).concat(_styleName.slice(1));

    if (typeof _s !== 'undefined') {
      yogaNode[_fnName](yoga["".concat(_styleName.toUpperCase(), "_").concat(_s.toUpperCase())]);
    }
  }

  for (var _i4 = 0, _arr4 = ['flexBasis']; _i4 < _arr4.length; _i4++) {
    var _styleName2 = _arr4[_i4];
    var _s2 = style[_styleName2];

    var _fnName2 = "set".concat(_styleName2.charAt(0).toUpperCase()).concat(_styleName2.slice(1));

    if (typeof _s2 === 'number') {
      yogaNode[_fnName2](_s2);
    } else if (_s2 === 'auto') {
      yogaNode[_fnName2](yoga.UNIT_AUTO);
    }
  }

  for (var _i5 = 0, _arr5 = ['flexGrow', 'flexShrink']; _i5 < _arr5.length; _i5++) {
    var _styleName3 = _arr5[_i5];
    var _s3 = style[_styleName3];

    var _fnName3 = "set".concat(_styleName3.charAt(0).toUpperCase()).concat(_styleName3.slice(1));

    if (typeof _s3 === 'number') {
      yogaNode[_fnName3](_s3);
    }
  }

  for (var _i6 = 0, _arr6 = ['alignContent', 'alignItems', 'alignSelf']; _i6 < _arr6.length; _i6++) {
    var _styleName4 = _arr6[_i6];
    var _s4 = style[_styleName4];

    var _fnName4 = "set".concat(_styleName4.charAt(0).toUpperCase()).concat(_styleName4.slice(1));

    if (typeof _s4 !== 'undefined') {
      yogaNode[_fnName4](yoga["ALIGN_".concat(_s4.toUpperCase().replace('-', '_'))]);
    }
  }

  for (var _i7 = 0, _arr7 = ['top', 'bottom', 'right', 'left']; _i7 < _arr7.length; _i7++) {
    var _styleName5 = _arr7[_i7];
    var _s5 = style[_styleName5];

    if (typeof _s5 !== 'undefined') {
      yogaNode.setPosition(yoga["EDGE_".concat(_styleName5.toUpperCase())], _s5);
    }
  }

  if (typeof style.position !== 'undefined') {
    yogaNode.setPositionType(yoga["POSITION_TYPE_".concat(style.position.toUpperCase())]);
  }

  if (typeof style.flex === 'number') {
    yogaNode.setFlex(style.flex);
  } else if (typeof style.flex !== 'undefined') {
    var f = style.flex.split(' ');

    if (f.length === 1) {
      if (f[0] === 'auto') {
        yogaNode.setFlexGrow(1);
        yogaNode.setFlexShrink(1);
        yogaNode.setFlexBasis(yoga.UNIT_AUTO);
      } else if (f[0] === 'none') {
        yogaNode.setFlexGrow(0);
        yogaNode.setFlexShrink(0);
        yogaNode.setFlexBasis(yoga.UNIT_AUTO);
      } else if (f[0] === 'initial') {
        yogaNode.setFlexGrow(0);
        yogaNode.setFlexShrink(1);
        yogaNode.setFlexBasis(yoga.UNIT_AUTO);
      }
    } else {
      yogaNode.setFlexGrow(f[0] * 1);
      yogaNode.setFlexShrink(f[1] * 1);

      if (f[2] === 'auto') {
        yogaNode.setFlexBasis(yoga.UNIT_AUTO);
      }
    }
  }

  if (typeof style.flexDirection !== 'undefined') {
    yogaNode.setFlexDirection(yoga["FLEX_DIRECTION_".concat(style.flexDirection.toUpperCase().replace('-', '_'))]);
  }

  if (typeof style.flexWrap !== 'undefined') {
    yogaNode.setFlexWrap(yoga["WRAP_".concat(style.flexWrap.toUpperCase().replace('-', '_'))]);
  }

  if (typeof style.justifyContent !== 'undefined') {
    yogaNode.setJustifyContent(yoga["JUSTIFY_".concat(style.justifyContent.toUpperCase().replace('-', '_'))]);
  }

  var childCount = yogaNode.getChildCount();

  for (var i = 0; i < node.childNodes.length; i++) {
    var childYogaNode = getYogaTree(node.childNodes[i]);

    if (childCount * 1 === 0) {
      yogaNode.insertChild(childYogaNode, i);
    }
  }

  yogaNode.calculateLayout();
  return yogaNode;
}

function updateLayout(node) {
  // const yogaNode = node.yogaNode;
  if (node.type === 'Text' && isNaN(node.yogaNode.getComputedWidth())) {
    // todo 临时fix文本节点
    node.yogaNode.calculateLayout();
  }

  var layout = node.yogaNode.getComputedLayout();
  node.layoutBox = {
    width: layout.width,
    height: layout.height,
    top: layout.top,
    left: layout.left,
    right: layout.right,
    bottom: layout.bottom
  };

  for (var i = 0; i < node.childNodes.length; i++) {
    updateLayout(node.childNodes[i]);
  }
}
function calculateDirtyNode(node) {
  for (var i = 0; i < node.childNodes.length; i++) {
    calculateDirtyNode(node.childNodes[i]);
  }

  if (node.yogaNode.isDirty()) {
    node.yogaNode.calculateLayout();
  }
}

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Yoga", function() { return Yoga; });
var __code = 'AGFzbQEAAAAB3QVUYAF/AX9gAn9/AGABfwBgAn9/AX9gA39/fwBgA39/fwF/YAR/f39/AGAAAGACf30AYAJ/fABgA39/fQBgBn9/f39/fwBgBX9/f39/AGADf398AGADf399AX1gAX8BfWABfwF8YAABf2ACf38BfWACf38BfGAFf39/f38Bf2AGf399f31/AGADf31/AGACfX0Bf2ACfX0BfWADf399AX9gBH9/f38Bf2AEf39/fABgBX9/fHx/AGAEf3x8fwBgBn98f39/fwF/YAN/fn8BfmACf30BfWADf39/AXxgB39/f39/f38AYAd/f31/fX9/AGAFf399fX0AYAR/fn5/AGAGf39/f39/AX9gBn9/fX99fwF/YAJ+fwF/YAF9AX9gBX9/fX19AX1gBH99fX8BfWAIf39/f39/f38AYAp/f39/f39/f39/AGANf39/f39/f39/f39/fwBgDn9/f39/f399fX19fX9/AGARf39/f319fX19f39/f39/f38AYAV/f39/fABgBH9/f30AYAd/f399f31/AGAIf39/fX19f38AYAZ/f398fH8AYAt/f31/fX9/f39/fwBgDn9/fX99fX1/f39/f39/AGAGf399fX9/AGAEf319fwBgD399fX9/f319f39/f39/fwBgB399fX9/fX0AYAp/fX1/f319f39/AGAEf3x8fABgB39/f31/fX8Bf2AHf398f39/fwF/YAJ/fQF/YAR/fX99AX9gDX99f31/fX99fX19fX8Bf2AFf31/fX0Bf2ADf319AX9gD399fX9/f319f39/f39/fwF/YAd/fX1/f319AX9gA35/fwF/YAJ8fAF/YAN/f38BfWARf39/f319fX19f39/f39/f38BfWAEf399fQF9YAN/fX0BfWANf319f39/f39/f39/fwF9YAR8fH9/AX1gBH9/f38BfGAFf39/f38BfGACfn4BfGABfAF8YAJ8fwF8At4BIgFhAWEALAFhAWIABAFhAWMADAFhAWQAIgFhAWUALgFhAWYALQFhAWcAAgFhAWgACwFhAWkABAFhAWoAAAFhAWsACwFhAWwABwFhAW0AGgFhAW4ABAFhAW8AAQFhAXAAAwFhAXEABQFhAXIABAFhAXMAAAFhAXQAFAFhAXUAAgFhAXYABQFhAXcAAAFhAXgAAAFhAXkAAQFh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AiABLQAAOgAAIAFBAWohASACQQFqIgIgA0cNAAsLIAAL8wICAn8BfgJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa0iBUIghiAFhCEFIAMgBGohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkFgaiICQR9LDQALCyAAC20BAX8jAEGAAmsiBSQAIARBgMAEcSACIANMckUEQCAFIAFB/wFxIAIgA2siAkGAAiACQYACSSIBGxA+GiABRQRAA0AgACAFQYACEDUgAkGAfmoiAkH/AUsNAAsLIAAgBSACEDULIAVBgAJqJAALCgAgACgCABCsAQsSACAAKAIAKAIAIAAoAgQQngELOwEBfyMAQSBrIgIkACACIAE4AgggAiAAOAIQIAJBGGogAioCECACKgIIkhApKgIAIQAgAkEgaiQAIAALLAACQCAAECINACABECINACAAIAGTi0MXt9E4XQ8LIAAQIgR/IAEQIgVBAAsLBwAgAEEUagsKACAAIAFBGGxqCxcAIAEoAgAhASAAIAI2AgQgACABNgIACw8AIAAgACgCAEEEajYCAAsKACAAKAIEEKwBC6UBACABIAIQJBAxRQRAIAAgASACECQoAgA2AgAPCwJAIAJBfXFBAUcNACABQQcQJBAxDQAgACABQQcQJCgCADYCAA8LAkBBASACdEE1cUUgAkEFS3INACABQQYQJBAxDQAgACABQQYQJCgCADYCAA8LIAFBCBAkEDFFBEAgACABQQgQJCgCADYCAA8LIAJBfnFBBEYEQCAAEFAPCyAAIAMoAgA2AgALEQAgAEH4A2ogAhAgIAE4AgALpgEBAn8jAEEwayIDJAACfQJAIAEQMkUNACAAQRhqIgQQREEEECQQMQ0AIAMgBBBEQQQQJCgCACIANgIUIAMgADYCKCADQRRqIAIQpwEMAQsgAEEYahBEIQBBvAwgARAgKAIAIQEgA0EYahCGASADIAMoAhg2AhAgA0EgaiAAIAEgA0EQahBJIAMgAygCIDYCDCADQQxqIAIQpwELIQIgA0EwaiQAIAILCgAgACABdkEBcQsxAQF/IwBBEGsiAyQAIAFFBEAgAyACNgIAIABBBUHIDiADEHAgAhDwAgsgA0EQaiQACwsAIAAgATYCACAAC6ICAQR/IwBBQGoiAiQAIAAoAgAiA0F8aigCACEEIANBeGooAgAhBSACQQA2AhQgAkGEPzYCECACIAA2AgwgAiABNgIIQQAhAyACQRhqQQBBJxA+GiAAIAVqIQACQCAEIAFBABAwBEAgAkEBNgI4IAQgAkEIaiAAIABBAUEAIAQoAgAoAhQRCwAgAEEAIAIoAiBBAUYbIQMMAQsgBCACQQhqIABBAUEAIAQoAgAoAhgRDAACQAJAIAIoAiwOAgABAgsgAigCHEEAIAIoAihBAUYbQQAgAigCJEEBRhtBACACKAIwQQFGGyEDDAELIAIoAiBBAUcEQCACKAIwDQEgAigCJEEBRw0BIAIoAihBAUcNAQsgAigCGCEDCyACQUBrJAAgAwsIACAAENIBGgs2AQF/IwBBEGsiAyQAIAMgACABIAIQ8gEgACABIAIQ7wIQQjgCCCADKgIIIQIgA0EQaiQAIAILEAAgAEEQNgIEIAAgATYCAAuZAQECfyMAQTBrIgIkAAJ/IAEQMgRAIABBGGoQVSEDIAJBIGoQUCACIAIoAiA2AgwgAkEoaiADQQQgAkEMahBJQQEgAkEoahAxRQ0BGgsgAEEYahBVIQBBvAwgARAgKAIAIQEgAkEQahBQIAIgAigCEDYCCCACQRhqIAAgASACQQhqEEkgAkEYahAxQQFzCyEDIAJBMGokACADC2wBAX8jAEEQayICJAACQAJAAkACQCAAKAIEQX9qDgIAAQILIAJBCGogACoCABApGgwCCyACQQhqIAAqAgAgAZRDCtcjPJQQKRoMAQsgAkEANgIIIAJBCGoQaRoLIAIqAgghASACQRBqJAAgAQsHACAAQThqCxQAIAAgAUGwBGogAhB2KQIANwIAC4YCAQN/IwBBMGsiAyQAIANBKGogAEG4DiABECAoAgAQViADKgIoECIhBSADQShqIABBuA4gARAgKAIAEFYCQAJAIAMoAixBA0YNACADQSBqIABBuA4gARAgKAIAEFYgAygCJEUNACADQRhqIABBuA4gARAgKAIAEFZBASEEIAUgAygCHEEBR3JFBEAgA0EQaiAAQbgOIAEQICgCABBWIAMqAhBDAAAAAF0NAQsgA0EIaiAAQbgOIAEQICgCABBWIAUgAygCDEECR3INASADIABBuA4gARAgKAIAEFZBACEEIAMqAgBDAAAAAF0NASACECJBAXMhBAwBC0EAIQQLIANBMGokACAECyEAAkAgARAiRQRAIAEQsQJFDQELIAAQUA8LIAAgARDoAgsIACAAQaAEagtMAQF/IwBBIGsiAiQAIAIgACgCACIANgIYIAIgASgCACIBNgIQIAIgADYCDCACIAE2AgggAigCDCACKAIIRiEAIAJBIGokACAAQQFzCwwAIAAtAEhBABCeAQsSACAAECooAgAgACgCAGtBAnULCAAgAEGsAWoLCAAgAEG0AWoLOQEBfyMAQRBrIgIkACACIAEpAgA3AwhBuCggAEEDQZApQawoQawBIAJBCGoQKEEAEAAgAkEQaiQACxQBAX9BBBA5IgEgACgCADYCACABCzwAAn8CfyABECEQogFFBEAgABAhELgBDAELIAEQIRCiAQsiAUEFRgRAQQEgABAhELkBELsBDQEaCyABCwv6AQIBfQF8AkAgACABoiIAEMcBIgVEAAAAAAAA8D+gIAUgBUQAAAAAAAAAAGMbIgVEAAAAAAAAAAAQdwRAIAAgBaEhAAwBCyAAIAWhIQAgBUQAAAAAAADwPxB3BEAgAEQAAAAAAADwP6AhAAwBCyACBEAgAEQAAAAAAADwP6AhAAwBCyADDQAgAAJ8RAAAAAAAAAAAIAW2ECINABpEAAAAAAAA8D8gBUQAAAAAAADgP2QNABpEAAAAAAAA8D9EAAAAAAAAAAAgBUQAAAAAAADgPxB3GwugIQALQwAAwH8hBAJAIAC2ECINACABthAiDQAgACABo7YhBAsgBAshAAJAIAEQIkUEQCABELECRQ0BCyAAEFAPCyAAIAEQ5wILNQEBfyMAQRBrIgIkACACIAAoAgA2AgwgACABKAIANgIAIAEgAkEMaigCADYCACACQRBqJAALpgEBAn8jAEEwayIDJAACfQJAIAEQMkUNACAAQRhqIgQQREEFECQQMQ0AIAMgBBBEQQUQJCgCACIANgIUIAMgADYCKCADQRRqIAIQpwEMAQsgAEEYahBEIQBBzAwgARAgKAIAIQEgA0EYahCGASADIAMoAhg2AhAgA0EgaiAAIAEgA0EQahBJIAMgAygCIDYCDCADQQxqIAIQpwELIQIgA0EwaiQAIAILOQEBfyMAQRBrIgIkACACIAEpAgA3AwhBuCggAEECQeApQbIfQbIBIAJBCGoQKEEAEAAgAkEQaiQACzkBAX8jAEEQayICJAAgAiABKQIANwMIQbgoIABBAkHEKUHUI0GvASACQQhqEChBABAAIAJBEGokAAsfACAAIAAtAAAiAEEBIAF0ciAAQX4gAXdxIAIbOgAACw4AIABDAADAfzgCACAACwoAIAAgATYCnAQLEAAgAEETNgIEIAAgATYCAAsIACAAEFkQJwsIACAAQYABagulAQICfwF9IwBBIGsiAiQAAkACQCABEDJFDQAgAEEYaiIDEG1BBBAkEDENACACQRhqIAMQbUEEECQQLiACKgIYIgRDAAAAAGANAQsgAEEYahBtIQBBvAwgARAgKAIAIQEgAkEIahCGASACIAIoAgg2AgQgAkEQaiAAIAEgAkEEahBJIAJBGGogAkEQahAuIAIqAhhDAAAAABAzIQQLIAJBIGokACAECxAAIABBAjYCBCAAIAE2AgALNwEBfyMAQRBrIgQkACAEIAM2AgwgAAR/IAAoAqwEBUEACyAAIAEgAiAEKAIMELACIARBEGokAAvGCwIIfwJ9IwBBsAFrIg8kACAAECMhEAJ/AkAgABDYAgRAIBAoAlQgDkcNAQtBACAQKAJYIANGDQEaCyAQQoCAgPyLgIDAv383AqgCIBBBADYCXCAQQoCAgPyLgIDAv383ArgCIBBCADcCsAJBAQshEyANQQFqIRICQAJAAkACQAJAAkACQAJAIAAQoAEEQCAPIABBAiAGECY4AqgBIA8qAqgBIRcgDyAAQQAgBhAmOAKoASAEIAEgBSACIBAoArACIBAqAqgCIBAoArQCIBAqAqwCIBAqArgCIBAqArwCIBcgDyoCqAEiGCAKEMQCBEAgEEGoAmohDQwDCyAQKAJcRQ0BIBBB4ABqIRFBACENA0AgBCABIAUgAiARIA0QRSgCCCARIA0QRSoCACARIA0QRSgCDCARIA0QRSoCBCARIA0QRSoCECARIA0QRSoCFCAXIBggChDEAgRAIBEgDRBFIQ0MBAsgDUEBaiINIBAoAlxJDQALDAELIAhFBEAgECgCXEUNASAQQeAAaiERQQAhDQNAAkAgESANEEUqAgAgARBDRQ0AIBEgDRBFKgIEIAIQQ0UNACARIA0QRSgCCCAERw0AIBEgDRBFKAIMIAVHDQAgESANEEUhDQwECyANQQFqIg0gECgCXEkNAAsMAQsgECoCqAIgARBDRQ0AIBAqAqwCIAIQQ0UNACAQKAKwAiAERw0AIBBBqAJqQQAgECgCtAIgBUYbIQ0MAQsgE0EBcyERQQAhDQwBCyANQQBHIRUgDUUgE0EBcyIRRXINACANKAIQIQMgEEGgAmoiCkEAECAgAzYCACANKAIUIQNBASEVIApBARAgIAM2AgAgC0EMQRAgCBtqIgMgAygCAEEBajYCAEHwyQAtAAANAQwEC0HwyQAtAAAEQCAPQacNQakNIBMbNgKYASAPIBI2ApQBIA8gEhDfATYCkAEgAEEEQZ4NIA9BkAFqEHAgACAMENgBIAQgCBCRASEUIAUgCBCRASEWIA8gCRAJNgKIASAPIAK7OQOAASAPIAG7OQN4IA8gFjYCdCAPIBQ2AnAgAEEEQaoNIA9B8ABqEHALIAAgASACIAMgBCAFIAYgByAIIAogCyAMIBIgDiAJELoFQfDJAC0AAARAIA9Bpw1BqQ0gExs2AmggDyASNgJkIA8gEhDfATYCYCAAQQRBzA0gD0HgAGoQcCAAIAwQ2AEgBCAIEJEBIQogBSAIEJEBIRIgEEGgAmoiFEEAECAqAgAhBiAUQQEQICoCACEHIA8gCRAJNgJYIA8gB7s5A1AgDyAGuzkDSCAPIBI2AkQgDyAKNgJAIABBBEHVDSAPQUBrEHALIBAgAzYCWCANDQQgECgCXCINQQFqIgMgCygCCEsEQCALIAM2AggLIA1BCEYEQEEAIQ1B8MkALQAABEAgAEEEQfUNQQAQcAsgEEEANgJcCyAIRQ0BIBBBqAJqIQMMAgtB8ckALQAARQ0CIA8gEjYCNCAPIBIQ3wE2AjAgAEEEQdwMIA9BMGoQcCAAIAwQ2AEgBCAIEJEBIQMgBSAIEJEBIQQgDSoCECEGIA0qAhQhByAPIAkQCTYCKCAPIAe7OQMgIA8gBrs5AxggDyACuzkDECAPIAG7OQMIIA8gBDYCBCAPIAM2AgAgAEEEQe0MIA8QcAwCCyAQQeAAaiANEEUhAyAQIBAoAlxBAWo2AlwLIAMgBTYCDCADIAQ2AgggAyACOAIEIAMgATgCAEEAIQ0gAyAQQaACaiIEQQAQICgCADYCECADIARBARAgKAIANgIUDAELQQEhEQsCfyAIBEAgACAAECNBoAJqQQAQICoCAEEAEJUBIAAgABAjQaACakEBECAqAgBBARCVASAAEOUBIABBABD7ASANIBBBqAJqRkEBdEEAIBEbDAELQQNBASAVGwshACAQIA42AlQgDyAMNgKsASAPIAA2AqgBIA9BsAFqJAAgEyANRXILKQACQAJAIAFBAkcNAEEDIQECQCAAQX5qDgICAAELQQIPCyAAIQELIAELIgAgAEGgBGoQJyABTQRAEAsACyAAKAKgBCABQQJ0aigCAAsHACAAQQxqCwgAIABB3ABqCwoAIAAgAUEDdGoLNwEBfQJAIAC2IgIQIg0AIAG2ECINACAAIAGhmUQAAADg4jYaP2MPCyACECIEfyABthAiBUEACwtVAQJ/QfDWACgCACIBIABBA2pBfHEiAmohAAJAIAJBAU5BACAAIAFNGw0AIAA/AEEQdEsEQCAAEBZFDQELQfDWACAANgIAIAEPC0GUygBBMDYCAEF/CzkBAX8jAEEQayICJAAgAiABKQIANwMIQbgoIABBAkHYKUHUI0GxASACQQhqEChBABAAIAJBEGokAAs5AQF/IwBBEGsiAiQAIAIgASkCADcDCEG4KCAAQQRBoClBsClBrQEgAkEIahAoQQAQACACQRBqJAALIAEBfyAAKAIAIQIgACABNgIAIAIEQCACBEAgAhA4CwsLEAAgAEEVNgIEIAAgATYCAAsZAQF/IAAQWRAnIAFLBH8gACABEHMFIAILCwYAIAAQOAulAQICfwF9IwBBIGsiAiQAAkACQCABEDJFDQAgAEEYaiIDEG1BBRAkEDENACACQRhqIAMQbUEFECQQLiACKgIYIgRDAAAAAGANAQsgAEEYahBtIQBBzAwgARAgKAIAIQEgAkEIahCGASACIAIoAgg2AgQgAkEQaiAAIAEgAkEEahBJIAJBGGogAkEQahAuIAIqAhhDAAAAABAzIQQLIAJBIGokACAEC48BAgF/AX0jAEEQayIBJAACQCAAKAKcBEUNACABIABBGGoiACoCCDgCCCABQQhqECVFBEAgASAAKgIIOAIIIAEqAgghAgwBCyABIAAqAgQ4AgggAUEIahAlDQAgASAAKgIEOAIAIAEqAgBDAAAAAF5BAXMNACABIAAqAgQ4AgggASoCCCECCyABQRBqJAAgAgtKAQJ/IwBBEGsiAiQAIAIgATgCACACIAA4AggCf0EBIAIqAgggAioCAFsNABpBACACQQhqECVFDQAaIAIQJQshAyACQRBqJAAgAwtBACAAAn8CQCACEDJFDQAgAUEYaiIAEERBBRAkEDENACAAEERBBRAkDAELIAFBGGoQREHMDCACECAoAgAQJAsQLgtBACAAAn8CQCACEDJFDQAgAUEYaiIAEERBBBAkEDENACAAEERBBBAkDAELIAFBGGoQREG8DCACECAoAgAQJAsQLgsSACAAKAIAKAIAIAAoAgQQ+gILDAAgACABKAIANgIACzMBAX8jAEEQayIBJAAgASABQQhqQY+evPwHEE4oAgA2AgQgACABQQRqEIUBIAFBEGokAAuDAQIDfwF+AkAgAEKAgICAEFQEQCAAIQUMAQsDQCABQX9qIgEgACAAQgqAIgVCCn59p0EwcjoAACAAQv////+fAVYhAiAFIQAgAg0ACwsgBaciAgRAA0AgAUF/aiIBIAIgAkEKbiIDQQpsa0EwcjoAACACQQlLIQQgAyECIAQNAAsLIAELNwEBfyAAKAIEIgNBAXUgAWohASAAKAIAIQAgASACIANBAXEEfyABKAIAIABqKAIABSAACxEBAAvqAQECfyMAQUBqIgMkAAJAIAMCfQJAIAEQMkUNACAAQRhqEFUhBCADQShqEFAgAyADKAIoNgIMIANBMGogBEEEIANBDGoQSSADQTBqEDENACADIAMoAjAiADYCICADIAA2AgggA0EIaiACECwMAQsgAEEYahBVIQBBvAwgARAgKAIAIQEgA0EYahBQIAMgAygCGDYCBCADQTBqIAAgASADQQRqEEkgA0EwahAxBEAgA0E4akMAAAAAECkqAgAhAgwCCyADIAMoAjAiADYCECADIAA2AgAgAyACECwLIgI4AjgLIANBQGskACACCzkB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IARBGGogBEEIahDGBSAEQTBqJAALEAAgAEEENgIEIAAgATYCAAsQAEEHEDYgARA3IABxIAF1C6kBAQR/IwBBIGsiAiQAIAIgAEEAECAoAgA2AhggAiABQQAQICgCACIENgIQIAIgAigCGDYCDCACIAQ2AgggAkEMaiACQQhqEFpFBEADQCADIgRBAWoiA0EJRwRAIAIgACADECAoAgA2AhggAiABIAMQICgCACIFNgIQIAIgAigCGDYCBCACIAU2AgAgAkEEaiACEFpFDQELCyAEQQdLIQMLIAJBIGokACADCwwAIAAoAgBBFRC+AQsMACAAKAIAQQoQtQELDAAgACgCAEECEPoCCzQBA38DQCAAIAIQICoCACABIAIQICoCABBDIgMEQCACQQNJIQQgAkEBaiECIAQNAQsLIAMLBwAgAEECSQsjAQJ/QQgQEiIBIgIgABCHAiACQZw+NgIAIAFBvD5BARARAAsdAQF/IABBJGohAQNAIAAQ0gFBBGoiACABRw0ACwsQAEEBEDYgARA3IABxIAF1CwwAIAAgASgCEDYCAAsRACAAQZACaiACECAgATgCAAscAQF/QQEhAiAAIAEQ+AEEfyACBSAAIAEQgQELCxEAIABBgAJqIAIQICABOAIACxEAIABB8AFqIAIQICABOAIACxoAIAEgAGsiAQRAIAIgACABEIECCyABIAJqC1oBAn8jAEEQayICJAAgAiABNgIMIAAQ5AIiAyABTwRAIAAQXCIAIANBAXZJBEAgAiAAQQF0NgIIIAJBCGogAkEMahDeAigCACEDCyACQRBqJAAgAw8LEIYCAAsQACAAKAIAIAEoAgBrQQJ1C5cDAgJ/A34CQCAAvSIFQjSIp0H/D3EiAUH/D0cNACAAIACjDwsgBUIBhiIDQoCAgICAgIDw/wBWBEACfiABRQRAQQAhASAFQgyGIgNCAFkEQANAIAFBf2ohASADQgGGIgNCf1UNAAsLIAVBASABa62GDAELIAVC/////////weDQoCAgICAgIAIhAshAyABQf8HSgRAA0ACQCADQoCAgICAgIAIfSIEQgBTDQAgBCIDQgBSDQAgAEQAAAAAAAAAAKIPCyADQgGGIQMgAUF/aiIBQf8HSg0AC0H/ByEBCwJAIANCgICAgICAgAh9IgRCAFMNACAEIgNCAFINACAARAAAAAAA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AwtRAQJ/IwBBEGsiAiQAIAAoAgAhAyACIAAoAgQiAEEBdSABaiIBIABBAXEEfyABKAIAIANqKAIABSADCxEAADYCDCACKAIMIQAgAkEQaiQAIAALMwEBfyAAKAIAIQIgACgCBCIAQQF1IAFqIgEgAEEBcQR/IAEoAgAgAmooAgAFIAILEQIACxYAAn8gABCXAgRAIAAoAgAMAQsgAAsLCgAgACwAC0EASAsZACAAKAIAIAE2AgAgACAAKAIAQQhqNgIACxkAIAAoAgAgATgCACAAIAAoAgBBCGo2AgALEwAgACABKAIANgIAIAFBADYCAAsJACAAQQA6AAALCQAgACABENcBCwwAIAEgACgCABECAAsJACAAQQE6AAQLNwEBfyAAKAIEIgNBAXUgAWohASAAKAIAIQAgASACIANBAXEEfyABKAIAIABqKAIABSAACxEDAAs5AQF/IAAoAgQiBEEBdSABaiEBIAAoAgAhACABIAIgAyAEQQFxBH8gASgCACAAaigCAAUgAAsRBAALDwAgASAAKAIAaiACOAIACw0AIAEgACgCAGoqAgALEQEBf0EIEDkiAEIANwMAIAALEQAgACgCACAAKAIEIAEQhAYLCQAgASAAEQIACwkAIAEgABEAAAtGAQF/IwBBEGsiAyQAIAMgAjYCDEHAICABQfTCAEGEKEGiASADQQxqEGBB9MIAQYQfQaMBIANBDGoQYBAFIANBEGokACAACzQBAX8jAEEQayICJAAgAkEIaiABEJwCIAJBCGogABEAACEAIAJBCGoQmgEgAkEQaiQAIAALQAAgACABQaAEED0iAEGgBGogAUGgBGoQlgQgACABKAK8BDYCvAQgACABKQK0BDcCtAQgACABKQKsBDcCrAQgAAsrACAAQoCAgPyLgIDAv383AhAgAEIANwIIIABCgICA/IuAgMC/fzcCACAACwgAIAAQ6QIaCwgAIABBABB7CygBAX8jAEEQayIBJAAgAUEANgIMIAAgAUEMaigCADYCACABQRBqJAALJgAgAARAAn8gACgCABDUAiAAQQhqEKwCIABBBGoQrAIgAAsQOAsLOwAgAAJ/IAEEQCABKAIAENcCDAELENYCENcCCzYCACAAQQRqEK0CIABBCGoQrQIgACgCACAANgIAIAALHwACfyAARQRAENYCIQALIAALIAAgASACIAMgBBCLBgsTACAAvEH/////B3FBgICA/AdGCw8AIABBFGogARC0Ai0AAAtVAQF/IwBBwAJrIgIkACACQQBBwAIQPiICEOABGiAAECMgAkHAAhA9GiAAQwAAAABBABCVASAAQwAAAABBARCVASAAEOUBIAAgARCoBSACQcACaiQACwcAIAAgAWoLIQAgACgCBCAAECooAgBHBEAgACABEP0BDwsgACABEKcFC0ABAn8jAEEgayICJAAgABBcIAFJBEAgABAqIQMgACACQQhqIAEgABAnIAMQlwEiABD1ASAAEKUBCyACQSBqJAALEwBB7MkAQezJACgCAEEBajYCAAuCAQECfyMAQRBrIgEkAAJAIAAoAqwERQ0AQeDJAEHgyQAoAgBBf2o2AgAgACgCrAQiAkUNACACEDgLIAEgABBZIgAQQDYCCCABIAAQSDYCACABQQhqIAEQKwRAA0AgASgCCCgCABC4AiABQQhqEEcgAUEIaiABECsNAAsLIAFBEGokAAthAQF/IwBBEGsiASQAIAAoAqwEQQA6AAsgASAAEFkiABBANgIIIAEgABBINgIAIAFBCGogARArBEADQCABKAIIKAIAELkCIAFBCGoQRyABQQhqIAEQKw0ACwsgAUEQaiQAC+sBAQR/IwBBIGsiASQAAn8gACgCrAQQrgUhAkHABBA5IAAQqQIiAyACNgKsBCACLQAKBEAgAxDbAQsgAwtBABBqIAEgAygCrAQ2AhAgAUEQahCxASICIAAQWRAnELYCIAFBADYCDCABIAAQWSIAEEA2AgggASAAEEg2AgAgAUEIaiABECsEQANAIAEgASgCCCgCABC6AiIANgIMIAAgAxBqIAIgAUEMahC1AiABQQhqEEcgAUEIaiABECsNAAsLIANBoARqIgQgAiIARwRAIAQgACgCACAAKAIEEK0FCyACEPEBIAFBIGokACADC1kBAX0gARAjQaACakG4DiACECAoAgAQICoCACEDIAEgABAjQaACakG4DiACECAoAgAQICoCACADkyABECNBiBEgAhAgKAIAECAqAgCTQcwMIAIQICgCABAtC6YBAQR/IwBBEGsiASQAIAFBCGogABAhEG8Cf0EAIAFBCGoQhAEQuwENABogAUEIaiAAECEQ3AFBASABQQhqEJ0BQQVGDQAaQQAgABBsIgNFDQAaA0Ag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CyAAQRBqIgQgACoCEBAiDQEaQQAhAyACRQ0DIAEqAhAhBgwCC0EAIQIgACoCEBAiRQRAQQAhAwwDCyAAQRBqCyEEIAIgASoCECIGECIiBXEhAyAFIAJFcg0BCyAEKgIAIAZbIQMLAkACQCAAKgIUECIEQCADIAEqAhQiBhAiIgFxIQIgAQ0CIANBAXNFDQEMAgtBACECIANFDQEgASoCFCEGCyAAKgIUIAZbIQILIAILbwEDfyMAQRBrIgIkACAAKAKcBCIBBEAgASAAEP4CGiAAQQAQagsgABBsIgMEQEEAIQEDQCAAIAEQfUEAEGogAUEBaiIBIANHDQALCyAAEPcCIAIgACgCrAQ2AgggAARAIAAQ6gIQOAsgAkEQaiQACyABAX9BHBA5EJAGIQBB4MkAQeDJACgCAEEBajYCACAACzMAAkBB6MkALQAAQQFxDQBB6MkAEM8BRQ0AQeTJABDVAjYCAEHoyQAQzgELQeTJACgCAAszAQJ/IwBBEGsiASQAQcAEEDkgABDrAiECIABBAUGQChDkASABIAA2AgggAUEQaiQAIAILCwAgAC0ABEECEEwLCQAgACABNgIUCwkAIAAgARCFAwsQAEEFEDYgARA3IABxIAF1CwwAIAAoAgBBABCeAQsnACADIAMoAgAgAiABayIAayICNgIAIABBAU4EQCACIAEgABA9GgsLCQAgACABEIIGCzYBAX8gACgCAARAIAAQ9gIgABAqGiAAKAIAIQEgABBcGiABEDggABAqQQA2AgAgAEIANwIACwssAQF/IAEgACgCBCICRwRAA0AgABAqGiACQXxqIgIgAUcNAAsLIAAgATYCBAsNACAAKAIAIAEoAgBJCxwAQf////8DIABJBEBBtAkQvAEACyAAQQJ0EDkLKAAgAiABayIAQQFOBEAgAygCACABIAAQPRogAyADKAIAIABqNgIACwtDAQF/IwBBEGsiASQAIAAQKhogAUH/////AzYCDCABQf////8HNgIIIAFBDGogAUEIahCGBigCACEAIAFBEGokACAAC0MBAX8CQCAAKAIAIgUEQAJ/IAAtAAgEQCABIAIgAyAEIAURGgAMAQsgASACIAMgBREFAAsiAA0BCyABEPoFIQALIAALQQEBfyAAEOQCIAFJBEAQhgIACyAAECoaIAAgARDiAiICNgIAIAAgAjYCBCAAECogAiABQQJ0ajYCACAAQQAQ7wELtgECAn8BfSMAQSBrIgIkAAJAIAFDAAAAAFxBACABQwAAACBdQQFzIAFDAAAAoF5BAXNyG0UEQCACIAJBGGpB8OGD/AcQTigCADYCACAAIAIQhQEMAQsgAkEQakP//39fIAGYIgQgBCABIAFD//9/310bIAFD//9/X14bECkiAyADKAIAQYCAgIB+akGAgICABHIiAzYCACACIAM2AgQgAiADNgIIIAAgAkEEahCFAQsgAkEgaiQAC68BAgJ/AX0jAEEgayICJAACQCABQwAAAABcQQAgAUMAAAAgXUEBcyABQwAAAKBeQQFzchtFBEAgAiACQRhqQY+evPwHEE4oAgA2AgAgACACEIUBDAELIAJBEGpD////XyABmCIEIAQgASABQ////99dGyABQ////19eGxApIgMgAygCAEGAgICAfmoiAzYCACACIAM2AgQgAiADNgIIIAAgAkEEahCFAQsgAkEgaiQACyMBAn8gAEEIaiECIAAhAQNAIAEQ0gFBBGoiASACRw0ACyAACw0AIABBoARqEPEBIAALeAEBfiAAQgA3AgggAEEBOwEEIABBADYCACAAQgA3AhAgAEEYahDIBSAAQdgBakEAQcACED4Q4AEaIABCADcCmAQgAEGgBGoQsQEaIAAgATYCrAQgAEGACikCACICNwK4BCAAIAI3ArAEIAEtAAoEQCAAENsBCyAACw0AIAAoAgAgAUECdGoLkQEBBH8jAEHAAmsiBCQAAkAgAEGgBGoiAhAnIAFBoARqIgUQJ0cNACAAQdgBaiAEIAFB2AFqQcACED0QjgYNAEEBIQMgAhAnRQ0AIAIQJ0UNAEEAIQADQCAFIAAQ7AIoAgAhASACIAAQ7AIoAgAgARDtAiIDRQ0BIABBAWoiACACECdJDQALCyAEQcACaiQAIAMLCwAgAC0ASEECEEwLMwEBfyMAQRBrIgMkACAAIAEgAhDzASADQQhqIAAgARB/ECkqAgAQQiECIANBEGokACACCxkBAX9BCBASIgEgABCHAiABQYg+QQEQEQALUQEBfyMAQRBrIgEkACABQQhqIABBGGoQUgJ/QQAgAUEIahA8QQFGDQAaQQEgABCAAUMAAAAAXA0AGiAAEJQBQwAAAABcCyEAIAFBEGokACAACx4AIABBBGpBAkEBEGggAEGgBGoiABBAIAAQSBCRBgsDAAELKgAgACgCABogACgCACAAEFxBAnRqGiAAKAIAGiAAKAIAIAAQJ0ECdGoaCwwAIAAgACgCABDgAgsWAQF/IAAQJyEBIAAQ9QIgACABEPQCCxIAIABBoARqIgAQ9gIgABCTBgsQACAAQQA2AgQgACABNgIACzEBAX8jAEEQayICJAAgAkEIaiAAEC4gAiABEC4gAkEIaiACELYDIQAgAkEQaiQAIAALEABBAxA2IAEQNyAAcSABdQtlAQF/IwBBEGsiAyQAAn0gACABEFMEQCAAIAEgAhCJAQwBCyADIAAgASACEJgBOAIIIANBCGoQJQRAIAMqAggMAQsgAyADIAMqAgiMECkoAgAiADYCCCAAvgshAiADQRBqJAAgAgsKACAAIAE2AqQCCxgBAX8gABAnIQIgACABEOACIAAgAhD0AgtnAQF/IwBBIGsiAiQAIAIgATYCHCACIABBoARqIgAQQCAAEEggAkEcahCXBjYCGCACIAAQSDYCECACQRhqIAJBEGoQKyIBBEAgACACQQhqIAJBGGoQ/gEoAgAQlgYLIAJBIGokACABC2gBAn8gABDrASABKAIEIQMgABAqIAAoAgAgAiABQQRqIgQQ3QIgABAqIAIgACgCBCABQQhqIgIQ4wIgACAEEGQgAEEEaiACEGQgABAqIAEQdBBkIAEgASgCBDYCACAAIAAQJxDvASADC6oCAQZ/IwBBMGsiAyQAAkAgACgCCCAAEHQoAgBHDQAgAEEIaiEEIABBBGohBSAAKAIEIgIgACgCACIGSwRAIAQgAiAEKAIAIAIgAiAGa0ECdUEBakF+bUECdCIEahDEATYCACAFIAUoAgAgBGo2AgAMAQsgAyAAEHQoAgAgACgCAGtBAXU2AhggA0EBNgIsIANBGGogA0EYaiADQSxqEN4CKAIAIgIgAkECdiAAKAIQEJcBIQIgA0EQaiAAKAIEEE4hBiADQQhqIAAoAggQTiEHIAIgBigCACAHKAIAEIMGIAAgAhBkIAUgAkEEahBkIAQgAkEIahBkIAAQdCACEHQQZCACEKUBCyAAKAIQIAAoAgggARCjASAAIAAoAghBBGo2AgggA0EwaiQAC4MBAQR/IwBBEGsiBiQAIAYgACACIAEgACgCBCIHIANraiIDa0ECdRDuASEEIAIgA0sEQCADIQUDQCAAECogBCgCBCAFEKMBIAQgBCgCBEEEajYCBCAFQQRqIgUgAkkNAAsLIAQQ7QEgAyABayIABEAgByAAayABIAAQgQILIAZBEGokAAvaAQECfyMAQSBrIgMkACADIAE2AhggACgCACEBIAMgABBANgIAIAEgA0EYaiADEMYBQQJ0aiEBAkAgACgCBCAAECooAgBJBEAgACgCBCIEIAFGBEAgACACEP0BDAILIAAgASAEIAFBBGoQgQMgASABIAJNBH8gAkEEaiACIAIgACgCBEkbBSACCygCADYCAAwBCyAAECohBCADIAAgABAnQQFqEMUBIAEgACgCAGtBAnUgBBCXASIEIAIQgAMgACAEIAEQ/wIhASAEEKUBCyABEKwBGiADQSBqJAALNwEBfyMAQRBrIgIkACACIAAoAgA2AgggAiACKAIIIAFBAnRqNgIIIAIoAgghACACQRBqJAAgAAtTAQF/IwBBIGsiAyQAIAMgATYCHCADIABBoARqIgAQQDYCCCADIANBCGogAhCDAzYCECAAIANBGGogA0EQahD+ASgCACADQRxqEIIDIANBIGokAAs3AQF/IwBBEGsiAiQAIABBBGpBBEEAEGggAiABNgIEIAIgATYCCCAAIAJBBGoQhwMgAkEQaiQACzEBAn8gAC0AACECQQEQNkEDEDchAyAAQQEQNkEDEDcgAUEDdHEgAiADQX9zcXI6AAALMwAgAEEEagJ/QQAgASgCACIBRQ0AGiAAIABBoARqECdFQYAIEE1BAQsQhgMgACABNgIICy0AIAAtAARBBRBMBEAgACABIAIgAyAAKAIMESsADwsgACABIAIgACgCDBFMAAs5ACABLQAEQQQQTARAIAAgASACIAMgBCAFIAYgASgCCBEjAA8LIAAgASACIAMgBCAFIAEoAggRFQALIgEBfiABIAKtIAOtQiCGhCAEIAARHwAiBUIgiKcQFCAFpwsRACABIAIgAyAEIAUgABEMAAsTACABIAIgAyAEIAUgBiAAEQsACxMAIAEgAiADIAQgBSAGIAARHgALBwAgABEHAAsRACABIAIgAyAEIAUgABEcAAsNACABIAIgAyAAESEACw8AIAEgAiADIAQgABEbAAsLACABIAIgABESAAsTACABIAIgAyAEIAUgBiAAEScACw8AIAEgAiADIAQgABEdAAsJACABIAAREAALCwAgASACIAARCQALDQAgASACIAMgABENAAsLACABIAIgABETAAsNACABIAIgAyAAEQUACw0AIAEgAiADIAARCgALDwAgASACIAMgBCAAEQYACwsAIAEgAiAAEQMACwsAIAEgAiAAEQgACw0AIAEgAiADIAARBAALEwAgASACIAMgBCAFIAYgABEVAAsLACABIAIgABEBAAsRACABIAIgAyAEIAUgABEUAAupAQEDfwJAIAIoAhAiBAR/IAQFIAIQowMNASACKAIQCyACKAIUIgVrIAFJBEAgAiAAIAEgAigCJBEFABoPCwJAIAIsAEtBAEgNACABIQQDQCAEIgNFDQEgACADQX9qIgRqLQAAQQpHDQALIAIgACADIAIoAiQRBQAgA0kNASAAIANqIQAgASADayEBIAIoAhQhBQsgBSAAIAEQPRogAiACKAIUIAFqNgIUCwtZAQF/IAAgAC0ASiIBQX9qIAFyOgBKIAAoAgAiAUEIcQRAIAAgAUEgcjYCAEF/DwsgAEIANwIEIAAgACgCLCIBNgIcIAAgATYCFCAAIAEgACgCMGo2AhBBAAsyACAAvEH/////B3FBgICA/AdNBEAgACAAIAGXIAG8Qf////8HcUGAgID8B0sbDwsgAQsyACAAvEH/////B3FBgICA/AdNBEAgACAAIAGWIAG8Qf////8HcUGAgID8B0sbDwsgAQsbACAAIAEoAgggBRAwBEAgASACIAMgBBDLAQsLOAAgACABKAIIIAUQMARAIAEgAiADIAQQywEPCyAAKAIIIgAgASACIAMgBCAFIAAoAgAoAhQRCwALlgIBBn8gACABKAIIIAUQMARAIAEgAiADIAQQywEPCyABLQA1IQcgACgCDCEGIAFBADoANSABLQA0IQggAUEAOgA0IABBEGoiCSABIAIgAyAEIAUQyQEgByABLQA1IgpyIQcgCCABLQA0IgtyIQgCQCAGQQJIDQAgCSAGQQN0aiEJIABBGGohBgNAIAEtADYNAQJAIAsEQCABKAIYQQFGDQMgAC0ACEECcQ0BDAMLIApFDQAgAC0ACEEBcUUNAgsgAUEAOwE0IAYgASACIAMgBCAFEMkBIAEtADUiCiAHciEHIAEtADQiCyAIciEIIAZBCGoiBiAJSQ0ACwsgASAHQf8BcUEARzoANSAB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fFQEQCABQgSGIABCPIiEIQQgAEL//////////w+DIgBCgYCAgICAgIAIWgRAIARCgYCAgICAgIDAAHwhBAwCCyAEQoCAgICAgICAQH0hBCAAQoCAgICAgICACIVCAFINASAEQgGDIAR8IQQMAQsgAFAgBUKAgICAgIDA//8AVCAFQoCAgICAgMD//wBRG0UEQCABQgSGIABCPIiEQv////////8Dg0KAgICAgICA/P8AhCEEDAELQoCAgICAgID4/wAhBCAFQv///////7//wwBWDQBCACEEIAVCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDCAyACIAAgBEGB+AAgA2sQwQMgAikDCEIEhiACKQMAIgBCPIiEIQQgAikDECACKQMYhEIAUq0gAEL//////////w+DhCIAQoGAgICAgICACFoEQCAEQgF8IQQMAQsgAEKAgICAgICAgAiFQgBSDQAgBEIBgyAEfCEECyACQSBqJAAgBCABQoCAgICAgICAgH+DhL8LUAEBfgJAIANBwABxBEAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLUAEBfgJAIANBwABxBEAgASADQUBqrYYhAkIAIQEMAQsgA0UNACACIAOtIgSGIAFBwAAgA2utiIQhAiABIASGIQELIAAgATcDACAAIAI3AwgLIgECfyAAEIACQQFqIgEQyAEiAkUEQEEADwsgAiAAIAEQPQu4AQEBfyABQQBHIQICQAJAAkAgAUUgAEEDcUVyDQADQCAALQAARQ0CIABBAWohACABQX9qIgFBAEchAiABRQ0BIABBA3ENAAsLIAJFDQELAkAgAC0AAEUgAUEESXINAANAIAAoAgAiAkF/cyACQf/9+3dqcUGAgYKEeHENASAAQQRqIQAgAUF8aiIBQQNLDQALCyABRQ0AA0AgAC0AAEUEQCAADwsgAEEBaiEAIAFBf2oiAQ0ACwtBAAsEAEIACwQAQQALKQAgASABKAIAQQ9qQXBxIgFBEGo2AgAgACABKQMAIAEpAwgQwAM5AwAL8xYDEn8CfgF8IwBBsARrIgkkACAJQQA2AiwCfyABvSIYQn9XBEBBASESIAGaIgG9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IAFEAAAAAAAAAABiDQALIABBICACIA8gECAJQRBqayAMayAHaiADIBBqIAxrQQJqIANFIAcgCWtBbmogA05yGyIDaiINIAQQPyAAIAogDxA1IABBMCACIA0gBEGAgARzED8gACAJQRBqIAcgCUEQamsiBRA1IABBMCADIAUgECAMayIDamtBAEEAED8gACAMIAMQNQsgAEEgIAIgDSAEQYDAAHMQPyAJQbAEaiQAIAIgDSANIAJIGwstACAAUEUEQANAIAFBf2oiASAAp0EHcUEwcjoAACAAQgOIIgBCAFINAAsLIAELNAAgAFBFBEADQCABQX9qIgEgAKdBD3FBwDtqLQAAIAJyOgAAIABCBIgiAEIAUg0ACwsgAQvvAgEDfyMAQdABayIDJAAgAyACNgLMAUEAIQIgA0GgAWpBAEEoED4aIAMgAygCzAE2AsgBAkBBACABIANByAFqIANB0ABqIANBoAFqENEBQQBIBEBBfyEBDAELIAAoAkxBAE4EQEEBIQILIAAoAgAhBCAALABKQQBMBEAgACAEQV9xNgIACyAEQSBxIQUCfyAAKAIwBEAgACABIANByAFqIANB0ABqIANBoAFqENEBDAELIABB0AA2AjAgACADQdAAajYCECAAIAM2AhwgACADNgIUIAAoAiwhBCAAIAM2AiwgACABIANByAFqIANB0ABqIANBoAFqENEBIgEgBEUNABogAEEAQQAgACgCJBEFABogAEEANgIwIAAgBDYCLCAAQQA2AhwgAEEANgIQIAAoAhQhBCAAQQA2AhQgAUF/IAQbCyEBIAAgACgCACIAIAVyNgIAQX8gASAAQSBxGyEBIAJFDQALIANB0AFqJAAgAQuLAgACQCAABH8gAUH/AE0NAQJAQZDIACgCACgCAEUEQCABQYB/cUGAvwNGDQMMAQsgAUH/D00EQCAAIAFBP3FBgAFyOgABIAAgAUEGdkHAAXI6AABBAg8LIAFBgLADT0EAIAFBgEBxQYDAA0cbRQRAIAAgAUE/cUGAAXI6AAIgACABQQx2QeABcjoAACAAIAFBBnZBP3FBgAFyOgABQQMPCyABQYCAfGpB//8/TQRAIAAgAUE/cUGAAXI6AAMgACABQRJ2QfABcjoAACAAIAFBBnZBP3FBgAFyOgACIAAgAUEMdkE/cUGAAXI6AAFBBA8LC0GUygBBGTYCAEF/BUEBCw8LIAAgAToAAEEBC00BAX8jAEEQayIDJAACfiAAKAI8IAGnIAFCIIinIAJB/wFxIANBCGoQExDQAUUEQCADKQMIDAELIANCfzcDCEJ/CyEBIANBEGokACABC9sCAQd/IwBBIGsiAyQAIAMgACgCHCIENgIQIAAoAhQhBSADIAI2AhwgAyABNgIYIAMgBSAEayIBNgIUIAEgAmohBEECIQcgA0EQaiEBAn8CQAJAIAAoAjwgA0EQakECIANBDGoQDBDQAUUEQANAIAQgAygCDCIFRg0CIAVBf0wNAyABIAUgASgCBCIISyIGQQN0aiIJIAUgCEEAIAYbayIIIAkoAgBqNgIAIAFBDEEEIAYbaiIJIAkoAgAgCGs2AgAgBCAFayEEIAAoAjwgAUEIaiABIAYbIgEgByAGayIHIANBDGoQDBDQAUUNAAsLIANBfzYCDCAEQX9HDQELIAAgACgCLCIBNgIcIAAgATYCFCAAIAEgACgCMGo2AhAgAgwBCyAAQQA2AhwgAEIANwMQIAAgACgCAEEgcjYCAEEAIAdBAkYNABogAiABKAIEawshBCADQSBqJAAgBAsJACAAKAI8EBcLJwEBfyMAQRBrIgEkACABIAA2AgwgASgCDCEAEJMCIAFBEGokACAACygBAX8jAEEQayIAJAAgAEGKMTYCDEHEN0EHIAAoAgwQASAAQRBqJAALKAEBfyMAQRBrIgAkACAAQeswNgIMQZw3QQYgACgCDBABIABBEGokAAsoAQF/IwBBEGsiACQAIABB/S42AgxB9DZBBSAAKAIMEAEgAEEQaiQACygBAX8jAEEQayIAJAAgAEHfLjYCDEHMNkEEIAAoAgwQASAAQRBqJAALKAEBfyMAQRBrIgAkACAAQessNgIMQbQ0QQAgACgCDBABIABBEGokAAspAQF/IwBBEGsiACQAIABB/Cs2AgxBgMMAIAAoAgxBCBANIABBEGokAAspAQF/IwBBEGsiACQAIABB9is2AgxB9MIAIAAoAgxBBBANIABBEGokAAstAQF/IwBBEGsiACQAIABB6Cs2AgxB6MIAIAAoAgxBBEEAQX8QAiAAQRBqJAALNQEBfyMAQRBrIgAkACAAQeMrNgIMQdzCACAAKAIMQQRBgICAgHhB/////wcQAiAAQRBqJAALLQEBfyMAQRBrIgAkACAAQdYrNgIMQdDCACAAKAIMQQRBAEF/EAIgAEEQaiQACzUBAX8jAEEQayIAJAAgAEHSKzYCDEHEwgAgACgCDEEEQYCAgIB4Qf////8HEAIgAEEQaiQACy8BAX8jAEEQayIAJAAgAEHDKzYCDEG4wgAgACgCDEECQQBB//8DEAIgAEEQaiQACzEBAX8jAEEQayIAJAAgAEG9KzYCDEGswgAgACgCDEECQYCAfkH//wEQAiAAQRBqJAALLgEBfyMAQRBrIgAkACAAQa8rNgIMQZTCACAAKAIMQQFBAEH/ARACIABBEGokAAsvAQF/IwBBEGsiACQAIABBoys2AgxBoMIAIAAoAgxBAUGAf0H/ABACIABBEGokAAsvAQF/IwBBEGsiACQAIABBnis2AgxBiMIAIAAoAgxBAUGAf0H/ABACIABBEGokAAsqAQF/IwBBEGsiASQAIAEgADYCDCABKAIMENMBEMMDIQAgAUEQaiQAIAALUwECfyMAQTBrIgIkACAAKAIAIQMgAiAAKAIEIgBBAXUgAWoiASAAQQFxBH8gASgCACADaigCAAUgAwsRAQBBMBA5IAJBMBA9IQAgAkEwaiQAIAALOwEBfyAAKAIEIgVBAXUgAWohASAAKAIAIQAgASACIAMgBCAFQQFxBH8gASgCACAAaigCAAUgAAsRHQALVwICfwF8IwBBEGsiAyQAIAAoAgQiBEEBdSABaiEBIAAoAgAhACADIAEgAiAEQQFxBH8gASgCACAAaigCAAUgAAsREwA5AwggAysDCCEFIANBEGokACAFC1MCAn8BfCMAQRBrIgIkACAAKAIAIQMgAiAAKAIEIgBBAXUgAWoiASAAQQFxBH8gASgCACADaigCAAUgAwsREAA5AwggAisDCCEEIAJBEGokACAEC1MBAn8jAEEQayICJAAgACgCACEDIAJBCGogACgCBCIAQQF1IAFqIgEgAEEBcQR/IAEoAgAgA2ooAgAFIAMLEQEAIAJBCGoQKCEAIAJBEGokACAAC1cBAn8jAEEQayIDJAAgACgCBCIEQQF1IAFqIQEgACgCACEAIANBCGogASACIARBAXEEfyABKAIAIABqKAIABSAACxEEACADQQhqECghACADQRBqJAAgAAs3AQF/IAAoAgQiA0EBdSABaiEBIAAoAgAhACABIAIgA0EBcQR/IAEo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AswFIABB0gA2AsgFIAAgACkDyAU3A6AEQbIWIABBoARqEDogAEEANgLMBSAAQdMANgLIBSAAIAApA8gFNwOYBEHGFiAAQZgEahA6IABBADYCzAUgAEHUADYCyAUgACAAKQPIBTcDkARB0hYgAEGQBGoQOiAAQQA2AswFIABB1QA2AsgFIAAgACkDyAU3A4gEQeAWIABBiARqEDogAEEANgLMBSAAQdYANgLIBSAAIAApA8gFNwOABEHpFiAAQYAEahA6IABBADYCzAUgAEHXADYCyAUgACAAKQPIBTcD+ANB+RYgAEH4A2oQigEgAEEANgLMBSAAQdgANgLIBSAAIAApA8gFNwPwA0GGFyAAQfADahA6IABBADYCzAUgAEHZADYCyAUgACAAKQPIBTcD6ANBkBcgAEHoA2oQOiAAQQA2AswFIABB2gA2AsgFIAAgACkDyAU3A+ADQaEXIABB4ANqEIoBIABBADYCzAUgAEHbADYCyAUgACAAKQPIBTcD2ANBrxcgAEHYA2oQOiAAQQA2AswFIABB3AA2AsgFIAAgACkDyAU3A9ADQbsXIABB0ANqEDogAEEANgLMBSAAQd0ANgLIBSAAIAApA8gFNwPIA0HOFyAAQcgDahA6IABBADYCzAUgAEHeADYCyAUgACAAKQPIBTcDwANB2xcgAEHAA2oQOiAAQQA2AswFIABB3wA2AsgFIAAgACkDyAU3A7gDQe8XIABBuANqEDogAEEANgLMBSAAQeAANgLIBSAAIAApA8gFNwOwA0H7FyAAQbADahA6IABBADYCzAUgAEHhADYCyAUgACAAKQPIBTcDqANBjhggAEGoA2oQOiAAQQA2AswFIABB4gA2AsgFIAAgACkDyAU3A6ADQZsYIABBoANqEDogAEEANgLMBSAAQeMANgLIBSAAIAApA8gFNwOYA0GvGCAAQZgDahA6IABBADYCzAUgAEHkADYCyAUgACAAKQPIBTcDkANBvhggAEGQA2oQeiAAQQA2AswFIABB5QA2AsgFIAAgACkDyAU3A4gDQcgYIABBiANqEHogAEEANgLMBSAAQeYANgLIBSAAIAApA8gFNwOAA0HTGCAAQYADahB6IABBADYCzAUgAEHnADYCyAUgACAAKQPIBTcD+AJB5RggAEH4AmoQZyAAQQA2AswFIABB6AA2AsgFIAAgACkD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EMMFCw0AIAAoAgAgAbYQxAULDQAgACgCACABthDFBQsNACAAKAIAIAG2EMcFCwoAIAAoAgAQyQULDQAgACgCACABthDKBQsNACAAKAIAIAG2EMsFCwoAIAAoAgAQzAULDQAgACgCACABthDNBQsNACAAKAIAIAG2EM8FCw0AIAAoAgAgAbYQ5gULDQAgACgCACABthDoBQsNACAAKAIAIAG2EOEFCw0AIAAoAgAgAbYQ4wULDQAgACgCACABthDqBQsMACAAKAIAIAEQ6wULDAAgACgCACABEOwFCwwAIAAoAgAgARDaBQsPACAAKAIAIAEgArYQ2wULDwAgACgCACABIAK2EN0FCwwAIAAoAgAgARDzBQsMACAAKAIAIAEQ7QULDAAgACgCACABEPUFCwwAIAAoAgAgARDvBQsMACAAKAIAIAEQ8AULDAAgACgCACABEPEFCw8AIAAoAgAgASACthDeBQsPACAAKAIAIAEgArYQ4AULDAAgACgCACABEO4FCw8AIAAoAgAgASgCABD4BQscACAAQQRqQQAQeyAAQQhqQQAQeyAAKAIAEI0GCwsAQQwQOSAAEK8CCwsAQQwQOUEAEK8CCwwAIAAoAgAgARCyAgssACAAKAIAIgAgAUMAAAAAYEGMDhDkASAAQwAAAAAgASABQwAAAABbGzgCEAsUACAAKAIAQRRqIAEQtAIgAjoAAAsSAQF/QQQQOSIAENUCNgIAIAALKAEBfyMAQRBrIgIkACAAEOkCQQIgAkEIaiABEIoGEIgGIAJBEGokAAspAQF/IwBBEGsiAiQAIAIgATYCDCAAQQBBBUHIDiABELACIAJBEGokAAuFAQECfyMAQSBrIgMkACADIAIoAgA2AhggACgCBCECIAMgASAAKAIIIgRBAXVqIgEgBEEBcQR/IAEoAgAgAmooAgAFIAILEQAANgIIIANBEGogA0EIaiAAKAIAEEYgAyADKAIYNgIEIAMoAhBBtAFqIAMoAhQQJCADKAIENgIAIANBIGokAAueAQEDfyMAQTBrIgMkACAAKAIEIQQgAyABIAAoAggiBUEBdWoiASAFQQFxBH8gASgCACAEaigCAAUgBAsRAAA2AhggA0EgaiADQRhqIAAoAgAQRiADIAMoAiBBtAFqIAMoAiQQJCgCADYCKCADIAIoAgAiADYCECADIAMoAig2AgwgAyAANgIIIANBDGogA0EIahBaIQAgA0EwaiQAIAALhQEBAn8jAEEgayIDJAAgAyACKAIANgIYIAAoAgQhAiADIAEgACgCCCIEQQF1aiIBIARBAXEEfyABKAIAIAJqKAIABSACCxEAADYCCCADQRBqIANBCGogACgCABBGIAMgAygCGDYCBCADKAIQQawBaiADKAIUECQgAygCBDYCACADQSBqJAALngEBA38jAEEwayIDJAAgACgCBCEEIAMgASAAKAIIIgVBAXVqIgEgBUEBcQR/IAEoAgAgBGooAgAFIAQLEQAANgIYIANBIGogA0EYaiAAKAIAEEYgAyADKAIgQawBaiADKAIkECQoAgA2AiggAyACKAIAIgA2AhAgAyADKAIoNgIMIAMgADYCCCADQQxqIANBCGoQWiEAIANBMGokACAAC4UBAQJ/IwBBIGsiAyQAIAMgAigCADYCGCAAKAIEIQIgAyABIAAoAggiBEEBdWoiASAEQQFxBH8gASgCACACaigCAAUgAgsRAAA2AgggA0EQaiADQQhqIAAoAgAQRiADIAMoAhg2AgQgAygCEEGkAWogAygCFBAkIAMoAgQ2AgAgA0EgaiQAC54BAQN/IwBBMGsiAyQAIAAoAgQhBCADIAEgACgCCCIFQQF1aiIBIAVBAXEEfyABKAIAIARqKAIABSAECxEAADYCGCADQSBqIANBGGogACgCABBGIAMgAygCIEGkAWogAygCJBAkKAIANgIoIAMgAigCACIANgIQIAMgAygCKDYCDCADIAA2AgggA0EMaiADQQhqEFohACADQTBqJAAgAAtTAQJ/IwBBEGsiAyQAIAAoAgAhBCADIAEgACgCBCIAQQF1aiIBIABBAXEEfyABKAIAIARqKAIABSAECxEAADYCCCADKAIIIAI4ArwBIANBEGokAAtaAQJ/IwBBEGsiAyQAIAAoAgAhBCADIAEgACgCBCIAQQF1aiIBIABBAXEEfyABKAIAIARqKAIABSAECxEAADYCCCADKAIIKgK8ASACEK4BIQAgA0EQaiQAIAALhQEBAn8jAEEgayIDJAAgAyACKAIANgIYIAAoAgQhAiADIAEgACgCCCIEQQF1aiIBIARBAXEEfyABKAIAIAJqKAIABSACCxEAADYCCCADQRBqIANBCGogACgCABBGIAMgAygCGDYCBCADKAIQQYABaiADKAIUECQgAygCBDYCACADQSBqJAALngEBA38jAEEwayIDJAAgACgCBCEEIAMgASAAKAIIIgVBAXVqIgEgBUEBcQR/IAEoAgAgBGooAgAFIAQLEQAANgIYIANBIGogA0EYaiAAKAIAEEYgAyADKAIgQYABaiADKAIkECQoAgA2AiggAyACKAIAIgA2AhAgAyADKAIoNgIMIAMgADYCCCADQQxqIANBCGoQWiEAIANBMGokACAAC4UBAQJ/IwBBIGsiAyQAIAMgAigCADYCGCAAKAIEIQIgAyABIAAoAggiBEEBdWoiASAEQQFxBH8gASgCACACaigCAAUgAgsRAAA2AgggA0EQaiADQQhqIAAoAgAQRiADIAMoAhg2AgQgAygCEEHcAGogAygCFBAkIAMoAgQ2AgAgA0EgaiQAC54BAQN/IwBBMGsiAyQAIAAoAgQhBCADIAEgACgCCCIFQQF1aiIBIAVBAXEEfyABKAIAIARqKAIABSAECxEAADYCGCADQSBqIANBGGogACgCABBGIAMgAygCIEHcAGogAygCJBAkKAIANgIoIAMgAigCACIANgIQIAMgAygCKDYCDCADIAA2AgggA0EMaiADQQhqEFohACADQTBqJAAgAAuEAQECfyMAQSBrIgMkACADIAIoAgA2AhggACgCBCECIAMgASAAKAIIIgRBAXVqIgEgBEEBcQR/IAEoAgAgAmooAgAFIAILEQAANgIIIANBEGogA0EIaiAAKAIAEEYgAyADKAIYNgIEIAMoAhBBFGogAygCFBAkIAMoAgQ2AgAgA0EgaiQAC50BAQN/IwBBMGsiAyQAIAAoAgQhBCADIAEgACgCCCIFQQF1aiIBIAVBAXEEfyABKAIAIARqKAIABSAECxEAADYCGCADQSBqIANBGGogACgCABBGIAMgAygCIEEUaiADKAIkECQoAgA2AiggAyACKAIAIgA2AhAgAyADKAIoNgIMIAMgADYCCCADQQxqIANBCGoQWiEAIANBMGokACAAC4QBAQJ/IwBBIGsiAyQAIAMgAigCADYCGCAAKAIEIQIgAyABIAAoAggiBEEBdWoiASAEQQFxBH8gASgCACACaigCAAUgAgsRAAA2AgggA0EQaiADQQhqIAAoAgAQRiADIAMoAhg2AgQgAygCEEE4aiADKAIUECQgAygCBDYCACADQSBqJAALnQEBA38jAEEwayIDJAAgACgCBCEEIAMgASAAKAIIIgVBAXVqIgEgBUEBcQR/IAEoAgAgBGooAgAFIAQLEQAANgIYIANBIGogA0EYaiAAKAIAEEYgAyADKAIgQThqIAMoAiQQJCgCADYCKCADIAIoAgAiADYCECADIAMoAig2AgwgAyAANgIIIANBDGogA0EIahBaIQAgA0EwaiQAIAALaQEBfyMAQSBrIgMkACADIAIoAgA2AhggACgCACECIAMgASAAKAIEIgBBAXVqIgEgAEEBcQR/IAEoAgAgAmooAgAFIAILEQAANgIQIAMgAygCGDYCDCADKAIQIAMoAgw2AhAgA0EgaiQAC38BAn8jAEEgayIDJAAgACgCACEEIAMgASAAKAIEIgBBAXVqIgEgAEEBcQR/IAEoAgAgBGooAgAFIAQLEQAANgIQIAMgAygCECgCEDYCGCADIAIoAgAiADYCCCADIAMoAhg2AgQgAyAANgIAIANBBGogAxBaIQAgA0EgaiQAIAALUgECfyMAQRBrIgMkACAAKAIAIQQgAyABIAAoAgQiAEEBdWoiASAAQQFxBH8gASgCACAEaigCAAUgBAsRAAA2AgggAygCCCACOAIMIANBEGokAAtZAQJ/IwBBEGsiAyQAIAAoAgAhBCADIAEgACgCBCIAQQF1aiIBIABBAXEEfyABKAIAIARqKAIABSAECxEAADYCCCADKAIIKgIMIAIQrgEhACADQRBqJAAgAAtSAQJ/IwBBEGsiAyQAIAAoAgAhBCADIAEgACgCBCIAQQF1aiIBIABBAXEEfyABKAIAIARqKAIABSAECxEAADYCCCADKAIIIAI4AgggA0EQaiQAC1kBAn8jAEEQayIDJAAgACgCACEEIAMgASAAKAIEIgBBAXVqIgEgAEEBcQR/IAEoAgAgBGooAgAFIAQLEQAANgIIIAMoAggqAgggAhCuASEAIANBEGokACAAC1IBAn8jAEEQayIDJAAgACgCACEEIAMgASAAKAIEIgBBAXVqIgEgAEEBcQR/IAEoAgAgBGooAgAFIAQLEQAANgIIIAMoAgggAjgCBCADQRBqJAALWQECfyMAQRBrIgMkACAAKAIAIQQgAyABIAAoAgQiAEEBdWoiASAAQQFxBH8gASgCACAEaigCAAUgBAsRAAA2AgggAygCCCoCBCACEK4BIQAgA0EQaiQAIAALMQECfyAAKAIAIQNBAhA2IAEQNyEEIABBAhA2IAEQNyACIAF0cSADIARBf3NxcjYCAAtXAQJ/IwBBEGsiAyQAIAAoAgAhBCADQQhqIAEgACgCBCIAQQF1aiIBIABBAXEEfyABKAIAIARqKAIABSAECxEBACADKAIIIAMoAgwgAhCaBSADQRBqJAALWAECfyMAQRBrIgMkACABIAAoAgQiBEEBdWohASAAKAIAIQAgA0EIaiABIARBAXEEfyABKAIAIABqKAIABSAACxEBACADQQhqEEEhACADQRBqJAAgACACRwsxAQJ/IAAoAgAhA0EBEDYgARA3IQQgAEEBEDYgARA3IAIgAXRxIAMgBEF/c3FyNgIAC1cBAn8jAEEQayIDJAAgACgCACEEIANBCGogASAAKAIEIgBBAXVqIgEgAEEBcQR/IAEoAgAgBGooAgAFIAQLEQEAIAMoAgggAygCDCACEJ0FIANBEGokAAtYAQJ/IwBBEGsiAyQAIAEgACgCBCIEQQF1aiEBIAAoAgAhACADQQhqIAEgBEEBcQR/IAEoAgAgAGooAgAFIAALEQEAIANBCGoQPCEAIANBEGokACAAIAJHC1QBAn8jAEEQayIDJAAgASAAKAIEIgRBAXVqIQEgACgCACEAIANBCGogASAEQQFxBH8gASgCACAAaigCAAUgAAsRAQAgA0EIaiACEK0BIANBEGokAAtZAQJ/IwBBEGsiAyQAIAEgACgCBCIEQQF1aiEBIAAoAgAhACADQQhqIAEgBEEBcQR/IAEoAgAgAGooAgAFIAALEQEAIANBCGoQnQEhACADQRBqJAAgACACRwsxAQJ/IAAoAgAhA0EFEDYgARA3IQQgAEEFEDYgARA3IAIgAXRxIAMgBEF/c3FyNgIAC1cBAn8jAEEQayIDJAAgACgCACEEIANBCGogASAAKAIEIgBBAXVqIgEgAEEBcQR/IAEoAgAgBGooAgAFIAQLEQEAIAMoAgggAygCDCACEKIFIANBEGokAAtZAQJ/IwBBEGsiAyQAIAEgACgCBCIEQQF1aiEBIAAoAgAhACADQQhqIAEgBEEBcQR/IAEoAgAgAGooAgAFIAALEQEAIANBCGoQrwEhACADQRBqJAAgACACRwtUAQJ/IwBBEGsiAyQAIAEgACgCBCIEQQF1aiEBIAAoAgAhACADQQhqIAEgBEEBcQR/IAEoAgAgAGooAgAFIAALEQEAIANBCGogAhCkAiADQRBqJAALWQECfyMAQRBrIgMkACABIAAoAgQiBEEBdWohASAAKAIAIQAgA0EIaiABIARBAXEEfyABKAIAIABqKAIABSAACxEBACADQQhqEIQBIQAgA0EQaiQAIAAgAkcLVwECfyMAQSBrIgMkACAAECoiAiADQQhqIAAgABAnQQFqEMUBIAAQJyACEJcBIgIoAgggARCjASACIAIoAghBBGo2AgggACACEPUBIAIQpQEgA0EgaiQAC5kBAQR/IwBBEGsiAiQAIAIgAEGgBGoiAxBANgIIIAIgAxBINgIAIAJBCGogAhArBEBBACEDA0AgACACKAIIIgQoAgAoApwERwRAIAQgACgCrAQgBCgCACAAIAMgARDlAiIFNgIAIAUgABBqCyAEKAIAIAFBGBEBACADQQFqIQMgAkEIahBHIAJBCGogAhArDQALCyACQRBqJAALNQEBfyMAQRBrIgIkACACIAE4AgAgAiAAOAIIIAIqAgghACACKgIAIQEgAkEQaiQAIAAgAV0L8gcCBn8GfSMAQUBqIhEkACACEDIhEyARQThqIAEQIRCTASARQThqEEEhEiARIABBFGoiFBBANgIwIBEgFBBINgIoIBFBMGogEUEoahArBEAgEkUgCUEBc3IhFgNAIBEgESgCMCgCACIJIAIgCRAjKgJQIAQQjgE4AjggESoCOCEXAn0gACoCIBAiIAAqAiAiGEMAAAAAXUEBc3JFBEAgFyAXIAkQlAGMlCIYQwAAAABbDQEaIAAqAgwQIiESIAkgAiAXQQAgACoCDCIZQwAAAABbIBIbBH0gGAUgGCAAKgIgIBmVlAuSIAUgBxA0DAELIBgQIiESIBcgACoCIEMAAAAAXkEBcw0AGiAXIBINABogCRCAASIYECIhEiAXIBhDAAAAAFsNABogFyASDQAaIAkgAiAXIBggACoCICAAKgIIlZSSIAUgBxA0CyEYIBEgCSACIAcQJjgCOCARKgI4IRkgESAJIAMgBxAmOAI4IBEqAjghGyARIBggGZIiGjgCICARQQE2AhggESAJECEiEioCvAE4AjgCQCARQThqECVFBEAgGiAZkyEZIBIqArwBIRoCfSATBEAgESAa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IAEQI0GgAmpBuA4gDBAgKAIAECAqAgCTQbwMIAwQICgCABAtCwJAAkAgASANEKkBRQ0AIAEgDRBTDQAgABAjQaACakG4DiANECAoAgAQICoCACESIAEQI0GgAmpBuA4gDRAgKAIAECAqAgAhEyAAIA0QfyEUIAsgASANIAIQZTgCICALKgIgIRUgCyABIA0gBCACIA8bEJgBOAI4IAEgEiATkyAUkyAVkyALKgI4k0G8DCANECAoAgAQLQwBCwJAIAEgDRBTDQAgACABEGFBAkcNACABIAAQI0GgAmpBuA4gDRAgKAIAECAqAgAgARAjQaACakG4DiANECAoAgAQICoCAJNDAAAAP5RBvAwgDRAgKAIAEC0MAQsgASANEFMNACAAIAEQYSEDIAtBIGogABAhEJMBIANBA0YgC0EgahBBQQJGRg0AIAEgABAjQaACakG4DiANECAoAgAQICoCACABECNBoAJqQbgOIA0QICgCABAgKgIAk0G8DCANECAoAgAQLQsgC0FAayQACysBAX0gABAjQaACakG4DiABECAoAgAQICoCACICQwAAAABgIAIQIkEBc3ELpAkCBH8IfSMAQfACayIOJAAgABAhIRAgDiAAIAMgCBDyATgCICAOKgIgIRIgDiAAIAMgCBDvAjgCICAOKgIgIRQCQCAFQQJHDQAgASoCIEMAAAAAXkEBcw0AAkAgEBBdQbgOIAMQICgCABAkEDENACAOIBAQXUG4DiADECAoAgAQJCgCACIFNgIMIA4gBTYC6AIgDiAOQQxqIAcQLDgCICAOQSBqECUNACAOIBAQXUG4DiADECAoAgAQJCgCACIFNgIIIA4gBTYC4AIgDiAOQQhqIAcQLDgCICABQwAAAAAgDioCICASkyAUkyAJIAEqAiCTkxAzOAIgDAELIAFBADYCIAsgASgCECACSwRAIAIhBQNAIA5BIGogACAFEHMiERAhEFIgDkEgahA8QQFHBEAgDkEgaiARIAMQgwEgDigCJCEQIA5BIGogESADEIIBIA8gEEEDRmogDigCJEEDRmohDwsgBUEBaiIFIAEoAhBJDQALCyAOQSBqIAAQIRC0ASAOQSBqEK8BIQVDAAAAACEIQwAAAAAhBwJAIA8NAAJAAkACQAJAAkAgBUF/ag4FAAECBAMFCyABKgIgQwAAAD+UIQcMBAsgASoCICEHDAMLIAEoAgBBAkkNAiABKgIgQwAAAAAQMyABKAIAQX9qs5UhCAwCCyABKgIgIAEoAgBBAWqzlSIIIQcMAQsgASoCICABKAIAs5UiCEMAAAA/lCEHCyABQQA2AiggASASIAeSOAIkIAAQvAIhECABKAIQIAJLBEAgDEEBcyAGQQFGcSEGIA5B8ABqIQUgD7IhFQNAIAAgAhBzIg8QISERIA5BIGogDxAjQcACED0aAkAgERC3AUEBRg0AAkAgERChAUEBRw0AIA8gAxBTRQ0AIAxFDQEgDiAPIAMgCRCJATgCECAOKgIQIRMgACADEG4hEiAOIA8gAyALEEs4AhggDyATIBKSIA4qAhiSQYgRIAMQICgCABAtDAELIBEQoQFBAUcEQCAOQRBqIA8gAxCDASAOKAIUQQNGBEAgASABKgIkIAEqAiAgFZWSOAIkCyAMBEAgDyAOQSBqQYgRIAMQICgCABAgKgIAIAEqAiSSQYgRIAMQICgCABAtCyAOQRBqIA8gAxCCASAOKAIUQQNGBEAgASABKgIkIAEqAiAgFZWSOAIkCyAGBEAgDiAPIAMgCxAmOAIQIAEgASoCJCAFKgIAIAggDioCEJKSkjgCJCABIAo4AigMAgsgDyADIAsQ3gEhEiABIAEqAiQgCCASkpI4AiQgEARAIA8gDRCwASEYIA4gD0EAIAsQSzgCECAOKgIQIRIgDxAjQaACakEBECAqAgAhGSAOIA9BACALECY4AhAgDioCECETIBYgGCASkiISEDMhFiAXIBkgE5IgEpMQMyEXDAILIAEgASoCKCAPIAQgCxDeARAzOAIoDAELIAxFDQAgDyAHIA5BIGpBiBEgAxAgKAIAECAqAgAgACADEG6SkkGIESADECAoAgAQLQsgAkEBaiICIAEoAhBJDQALCyABIBQgASoCJJI4AiQgEARAIAEgFyAWkjgCKAsgDkHwAmokAAtFAQF9IAEqAiAhESABIAIgBCAFIAcQqwUgASARIAEgACACIAMgBCAFIAYgByAIIAkgCiALIAwgDSAOIA8gEBCqBZM4AiALQQAgACABKQIANwIAIAAgASgCEDYCECAAIAEpAgg3AgggAEEUaiABQRRqEMACIAAgASgCKDYCKCAAIAEpAiA3AiALpAQCBH8EfSMAQSBrIggkACAAQgA3AgAgAEEANgIQIABCADcCCCAAQRRqELEBIQogAEEANgIoIABCADcCICAKIAEoAgAQWRAnELYCIAhBGGogASgCABAhEG8gCEEYahCEASABKAIAIAIQ9gEQciECIAhBGGogASgCABAhEJMBIAhBGGoQQSELAkAgASgCABBZECcgBk0NAANAIAggASgCACAGEHMiCTYCFCAIQRhqIAkQIRB8AkAgCEEYahA8QQFGDQAgCEEIaiAIKAIUECEQUiAIQQhqEDxBAUYNACAIKAIUIAc2ApgEIAggCCgCFCACIAQQJjgCGCAIKgIYIQwgCCAIKAIUIgkgAiAJECMqAlAgAxCOATgCGCAAKAIAIglFIAtFckVBACAMIA4gCCoCGCINkpIgBV4bDQIgACAJQQFqNgIAIAAgDCANkiIMIAAqAgSSOAIEIAgoAhQQ8QIEQCAAIAgoAhQQgAEgACoCCJI4AgggCCgCFBCUASENIAgoAhQQIyoCUCEPIAAgACoCDCANIA+UkzgCDAsgDiAMkiEOIAogCEEUahC1AgsgBkEBaiIGIAEoAgAQWRAnSQ0ACwsgACoCCCIDQwAAAABeQQFzIANDAACAP11BAXNyRQRAIABBgICA/AM2AggLIAAqAgwiA0MAAAAAXkEBcyADQwAAgD9dQQFzckUEQCAAQYCAgPwDNgIMCyAAIAY2AhAgCEEgaiQAC7wDAgR/AX0jAEEgayINJAAgABBZIRACQCADIAQgBhAyG0EBRw0AIA0gEBBANgIIIA0gEBBINgIYAkAgDUEIaiANQRhqECtFDQADQCANKAIIKAIAIg4Q8QIEQCAPDQIgDhCAAUMAAAAAEEMNAiAOIg8QlAFDAAAAABBDDQILIA1BCGoQRyANQQhqIA1BGGoQKw0ACwwBC0EAIQ8LIA0gEBBANgIYIA0gEBBINgIQIA1BGGogDUEQahArBEADQCANKAIYKAIAIg4Q9wEgDUEIaiAOECEQfAJAIA1BCGoQPEEBRgRAIA4gChCzAiAOEOUBIA5BABD7AQwBCyAIBEAgDiAOIAUQ9gEgASACIAYQMhsgAiABIAYQMhsgARD5AQsgDUEIaiAOECEQUiANQQhqEDxBAUYNAAJAIA4gD0YEQCAPIAwQ/AIgDUMAAAAAECkaIA8gDSoCABCWAQwBCyAAIA4gASADIAIgASACIAQgBSAHIAkgCiALIAwQrAULIA0gDhAjKgJQIA4gBiABECYQQjgCCCARIA0qAgiSIRELIA1BGGoQRyANQRhqIA1BEGoQKw0ACwsgDUEgaiQAIBEL+gECAn8CfSMAQRBrIgckAAJAAkBBACABQwAAAABfQQFzIANBAkdyRSABECIbDQBBACACQwAAAABfQQFzIARBAkdyRSACECIbDQAgA0EBRyAEQQFHcg0BCyAHIABBACAFECY4AgggByoCCCEJIAcgAEECIAUQJjgCACAAIABBAkMAAAAAQwAAAAAgASAHKgIAkyABECIbIgogA0ECRhsgCiABQwAAAABdGyAFIAUQNEEAEEpBASEIIAAgAEEAIAIQIgR9QwAAAAAFQwAAAAAgAiAJkyIBIARBAkYbIAEgAkMAAAAAXRsLIAYgBRA0QQEQSgsgB0EQaiQAIAgLjAECAX8EfSMAQRBrIgckACAAQQIgBRBRIQggAEEAIAUQUSEJIAcgAEECIAUQJjgCCCAHKgIIIQogByAAQQAgBRAmOAIAIAcqAgAhCyAAIABBAiABIAqTIAggA0F9cRsgBSAFEDRBABBKIAAgAEEAIAIgC5MgCSAEQX1xGyAGIAUQNEEBEEogB0EQaiQAC5sDAgF/Bn0jAEEwayIKJAAgACAAEKABQZgREE0gAEECIAUQUSEPIABBACAFEFEhECAKIABBAiAFECY4AgggCioCCCENIAogAEEAIAUQJjgCCCAKKgIIIQ4gAUMAAMB/IAMbIgEhCyABECJFBEBDAAAAACABIA2TIA+TEDMhCwsgAkMAAMB/IAQbIgIhDCACECJFBEBDAAAAACACIA6TIBCTEDMhDAsCQCADQQFHIARBAUdyRQRAIAAgAEECIAEgDZMgBSAFEDRBABBKIAAgAEEAIAIgDpMgBiAFEDRBARBKDAELIApBKGogACALIAMgDCAEIAgQiQMgByAHKAIUQQFqNgIUIAdBGGogCRAgIgcgBygCAEEBajYCACAKIAQ2AhggCiAMOAIUIAogAzYCECAKIAs4AgwgCiAINgIIIAogCTYCJCAKIAopAyg3AhwgACAAQQIgASANkyAPIAoqAiiSIANBfXEbIAUgBRA0QQAQSiAAIABBACACIA6TIBAgCioCLJIgBEF9cRsgBiAFEDRBARBKCyAKQTBqJAALoCUCEn8VfSMAQdABayIPJAAgDyAANgLMASAAIARFIAEQIkEBc3JB5A8QTSAAIAVFIAIQIkEBc3JBtBAQTSAKQQBBBCAIG2oiEiASKAIAQQFqNgIAIABBoAJqIAAgAxD2ASIVEJUGQQIgFRByIRJBACAVEHIhESAPIAAgEiAGEEs4AnAgACAPKgJwIBVBAUdBAXQiABDDASAPIA8oAswBIhYgEiAGEGU4AnAgFiAPKgJwIBVBAUZBAXQiFhDDASAPIA8oAswBIhAgESAGEEs4AnAgECAPKgJwQQEQwwEgDyAPKALMASIQIBEgBhBlOAJwIBAgDyoCcEEDEMMBIA8oAswBIhAgECASEG4gABDCASAPKALMASIQIBAgEhB/IBYQwgEgDygCzAEiECAQIBEQbkEBEMIBIA8oAswBIhAgECAREH9BAxDCASAPIA8oAswBIhAgEiAGEPQBOAJwIBAgDyoCcCAAEMABIA8gDygCzAEiACASIAYQ8wE4AnAgACAPKgJwIBYQwAEgDyAPKALMASIAIBEgBhD0ATgCcCAAIA8qAnBBARDAASAPIA8oAswBIgAgESAGEPMBOAJwIAAgDyoCcEEDEMABIA8oAswBEKABIRIgDygCzAEhAAJAIBIEQCAAIAEgAiAEIAUgBiAHIAogCyAOELkFDAELIAAQbCIXRQRAIA8oAswBIAEgAiAEIAUgBiAHELgFDAELIAhFBEAgDygCzAEgASACIAQgBSAGIAcQtwUNAQsgDygCzAEgCxCSBiAPKALMAUEAEPoBIA9B8ABqIA8oAswBECEQbyAPQfAAahCEASAVEHIiEyAVEPwBIRAgExAyIRQgD0HwAGogDygCzAEQIRCTASAPQfAAahBBIQ4gDyAPKALMASAQIAYQ8gE4AnAgDyoCcCEjIA8oAswBIBMgBhBRIS8gDygCzAEgECAGEFEhKiAPIA8oAswBQQIgBhAmOAJwIA8qAnAhMiAPIA8oAswBQQAgBhAmOAJwIA8qAnAhMyAPIA8oAswBECE2AsgBIA8gDygCzAEQITYCwAEgD0G4AWogD0HIAWpBABC/AiAPIA8oArgBNgIMIA8gD0EMaiAGECw4AnAgDyoCcCEhIA9BsAFqIA9BwAFqQQAQkAEgDyAPKAKwATYCCCAPIA9BCGogBhAsOAJwIA8qAnAhJyAPQagBaiAPQcgBakEBEL8CIA8gDygCqAE2AgQgDyAPQQRqIAcQLDgCcCAPKgJwISUgD0GgAWogD0HAAWpBARCQASAPIA8oAqABNgIAIA8gDyAHECw4AnAgDyoCcCEoIA8oAswBQQIgASAGIAYQvgIhIiAPKALMAUEAIAIgByAGEL4CISxBASAEIAUgFBsiACAPKALMASAiICwgBCAFIBUgEyAJIAggCiALIAwgDRC2BSAiICwgFBsiKV4iEhsgACAAQQJGGyAAIA4bIRkgAEEARyAScSEbICwgIiAUGyEmIAUgBCAUGyIaQQFGIgAgCEEBc3EhHCAhICUgFBsgL5MhJSAnICggFBsgL5MhKCAHIAYgFBshMCAGIAcgFBshLiAUQQFzIR0gGkF9cSEeIAAgDkVxIR8gD0HwAGoiEUEUahCxARpBACEFQQAhAANAIA9BQGsgD0HMAWogAyAuICIgKSAFIhIgACIWELUFIBEgD0FAaxC0BSAPQUBrEL0CIBEoAhAhBQJ9IBECfQJAAkAgGUEBRgRAICkhIQwBCyAlECIhACARKgIEICVdQQFzRQRAICUhISAARQ0BCyAoECIhACARKgIEICheQQFzRQRAICghISAARQ0BCwJ9AkAgDygCzAEoAqwELQALDQACQCARKgIIECIEQCARKgIIQwAAAABbDQELIA8oAswBEIABECJFDQEgKSAPKALMARCAAUMAAAAAXA0CGgsgESoCBAwBCyApCyEhIA8oAswBKAKsBC0ACwRAIA8oAswBQaACakECQQEQaAsgDygCzAEoAqwELQALRQ0BCyAhECINACAhIBEqAgSTDAELICEgESoCBCInQwAAAABdQQFzDQEaICeMCzgCICAhCyEpIBxFBEAgDygCzAEgESATIBAgLiApICYgIiAsIBsgGiAIIAkgCiALIAwgDRCzBQsgDygCzAEiACAAECMQnwEgESoCIEMAAAAAXXIQ+gEgDygCzAEgESASIBMgECAZIBogLiAGICkgJiAiIAggCxCyBSAmIScgHkUEQCAPKALMASAQICogESoCKJIgMCAGEDQgKpMhJwsCfSAfRQRAIBEqAigMAQsgESAmOAIoICYLISEgESAPKALMASAQICogIZIgMCAGEDQgKpMiITgCKCAIRSASIAVPckUEQANAIA9BQGsgDygCzAEgEhBzIgAQIRB8AkAgD0FAaxA8QQFGDQAgD0FAayAAECEQUiAPQUBrEDxBAUYE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IAFBEGokAAtPAQF/IwBBIGsiASQAIAFBGGoQjAEgAUEANgIUIAFBFTYCECABIAEoAhg2AgQgASABKQMQNwMIIAAgAUEIakEBIAFBBGoQkgEgAUEgaiQAC1kBAn8jAEEwayICJAAgAkEoaiABEGMgAkEANgIcIAJBFTYCGCACIAIoAigiAzYCICACIAM2AgwgAiACKQMYNwMQIAAgAkEQakEBIAJBDGoQkgEgAkEwaiQAC1kBAn8jAEEwayICJAAgAkEoaiABEFggAkEANgIcIAJBFTYCGCACIAIoAigiAzYCICACIAM2AgwgAiACKQMYNwMQIAAgAkEQakEBIAJBDGoQkgEgAkEwaiQAC08BAX8jAEEgayIBJAAgAUEYahCMASABQQA2AhQgAUEVNgIQIAEgASgCGDYCBCABIAEpAxA3AwggACABQQhqQQAgAUEEahCSASABQSBqJAALWQECfyMAQTBrIgIkACACQShqIAEQYyACQQA2AhwgAkEVNgIYIAIgAigCKCIDNgIgIAIgAzYCDCACIAIpAxg3AxAgACACQRBqQQAgAkEMahCSASACQTBqJAALYAECfyMAQSBrIgQkACAAECEhBSAEIAEoAgAiATYCDCAEIAE2AhggAiAFIARBDGoQhwUEQCAAECEhAiAEIAE2AgggBCABNgIQIAMgAiAEQQhqEIYFIAAQLwsgBEEgaiQAC1kBAn8jAEEwayICJAAgAkEoaiABEFggAkEANgIcIAJBFTYCGCACIAIoAigiAzYCICACIAM2AgwgAiACKQMYNwMQIAAgAkEQakEAIAJBDGoQkgEgAkEwaiQAC2ABAn8jAEEQayIDJAAgASgCACEEIAMgASgCBCIBNgIMIAMgBDYCCCADIAE2AgQgAyAENgIAIAMhASADQQhqIAAQISACEIkFBEAgASAAECEgAhCIBSAAEC8LIANBEGokAAtKAQJ/IwBBIGsiAiQAIAJBGGogARApIQMgAkEANgIUIAJBFDYCECADKgIAIQEgAiACKQMQNwMIIAAgAkEIaiABENAFIAJBIGokAAs+AgF/AX0jAEEQayIBJAAgASAAECEqArwBOAIIQwAAwH8hAiABQQhqECVFBEAgASoCCCECCyABQRBqJAAgAgtXAgF/AX0jAEEQayICJAAgAiAAECEQbSABECQoAgA2AghDAADAfyEDAkAgAkEIahAxDQAgAkEIahD/AQ0AIAIgAkEIahAuIAIqAgAhAwsgAkEQaiQAIAMLYAECfyMAQSBrIgQkACAAECEhBSAEIAEoAgAiATYCDCAEIAE2AhggAiAFIARBDGoQiwUEQCAAECEhAiAEIAE2AgggBCABNgIQIAMgAiAEQQhqEIoFIAAQLwsgBEEgaiQAC3MBAn8jAEEwayIEJAAgASgCACEFIAEoAgQhASAEIAMoAgAiAzYCKCAEIAE2AiAgBCAFNgIcIAQgAjYCGCAEIAE2AhAgBCADNgIEIAQgBTYCDCAEIAI2AgggACAEQQRqIARBGGogBEEIahDUBSAEQTBqJAALWQECfyMAQTBrIgMkACADQShqIAIQWCADQQA2AhwgA0ETNgIYIAMgAygCKCIENgIgIAMgBDYCDCADIAMpAxg3AxAgACADQRBqIAEgA0EMahDVBSADQTBqJAALWQECfyMAQTBrIgMkACADQShqIAIQYyADQQA2AhwgA0ESNgIYIAMgAygCKCIENgIgIAMgBDYCDCADIAMpAxg3AxAgACADQRBqIAEgA0EMahDLAiADQTBqJAALYAECfyMAQSBrIgQkACAAECEhBSAEIAEoAgAiATYCDCAEIAE2AhggAiAFIARBDGoQjQUEQCAAECEhAiAEIAE2AgggBCABNgIQIAMgAiAEQQhqEIwFIAAQLwsgBEEgaiQAC1kBAn8jAEEwayIDJAAgA0EoaiACEFggA0EANgIcIANBEjYCGCADIAMoAigiBDYCICADIAQ2AgwgAyADKQMYNwMQIAAgA0EQaiABIANBDGoQywIgA0EwaiQAC08BAX8jAEEgayICJAAgAkEYahCMASACQQA2AhQgAkERNgIQIAIgAigCGDYCBCACIAIpAxA3AwggACACQQhqIAEgAkEEahDhASACQSBqJAALWQECfyMAQTBrIgMkACADQShqIAIQYyADQQA2AhwgA0ERNgIYIAMgAygCKCIENgIgIAMgBDYCDCADIAMpAxg3AxAgACADQRBqIAEgA0EMahDhASADQTBqJAALYAECfyMAQSBrIgQkACAAECEhBSAEIAEoAgAiATYCDCAEIAE2AhggAiAFIARBDGoQjwUEQCAAECEhAiAEIAE2AgggBCABNgIQIAMgAiAEQQhqEI4FIAAQLwsgBEEgaiQAC1kBAn8jAEEwayIDJAAgA0EoaiACEFggA0EANgIcIANBETYCGCADIAMoAigiBDYCICADIAQ2AgwgAyADKQMYNwMQIAAgA0EQaiABIANBDGoQ4QEgA0EwaiQAC1kBAn8jAEEwayIDJAAgA0EoaiACEGMgA0EANgIcIANBEDYCGCADIAMoAigiBDYCICADIAQ2AgwgAyADKQMYNwMQIAAgA0EQaiABIANBDGoQzAIgA0EwaiQAC2ABAn8jAEEgayIEJAAgABAhIQUgBCABKAIAIgE2AgwgBCABNgIYIAIgBSAEQQxqEJEFBEAgABAhIQIgBCABNgIIIAQgATYCECADIAIgBEEIahCQBSAAEC8LIARBIGokAAtZAQJ/IwBBMGsiAyQAIANBKGogAhBYIANBADYCHCADQRA2AhggAyADKAIoIgQ2AiAgAyAENgIMIAMgAykDGDcDECAAIANBEGogASADQQxqEMwCIANBMGokAAtXAQJ/IwBBMGsiAiQAIAJBKGogARBjIAJBADYCHCACQQ82AhggAiACKAIoIgM2AiAgAiADNgIMIAIgAikDGDcDECAAIAJBEGogAkEMahDNAiACQTBqJAALYAECfyMAQSBrIgQkACAAECEhBSAEIAEoAgAiATYCDCAEIAE2AhggAiAFIARBDGoQkwUEQCAAECEhAiAEIAE2AgggBCABNgIQIAMgAiAEQQhqEJIFIAAQLwsgBEEgaiQAC1cBAn8jAEEwayICJAAgAkEoaiABEFggAkEANgIcIAJBDzYCGCACIAIoAigiAzYCICACIAM2AgwgAiACKQMYNwMQIAAgAkEQaiACQQxqEM0CIAJBMGokAAtGAQF/IwBBEGsiAiQAIAJBCGogARAhEL8BIAAgAkEIahAuAkACQCAAKAIEDgQAAQEAAQsgAEGAgID+BzYCAAsgAkEQaiQAC2ABAn8jAEEQayIDJAAgASgCACEEIAMgASgCBCIBNgIMIAMgBDYCCCADIAE2AgQgAyAENgIAIAMhASADQQhqIAAQISACEJUFBEAgASAAECEgAhCUBSAAEC8LIANBEGokAAtKAQJ/IwBBIGsiAiQAIAJBGGogARApIQMgAkEANgIUIAJBDjYCECADKgIAIQEgAiACKQMQNwMIIAAgAkEIaiABEOUFIAJBIGokAAtgAQJ/IwBBEGsiAyQAIAEoAgAhBCADIAEoAgQiATYCDCADIAQ2AgggAyABNgIEIAMgBDYCACADIQEgA0EIaiAAECEgAhCXBQRAIAEgABAhIAIQlgUgABAvCyADQRBqJAALSgECfyMAQSBrIgIkACACQRhqIAEQKSEDIAJBADYCFCACQQ02AhAgAyoCACEBIAIgAikDEDcDCCAAIAJBCGogARDnBSACQSBqJAALYAECfyMAQRBrIgMkACABKAIAIQQgAyABKAIEIgE2AgwgAyAENgIIIAMgATYCBCADIAQ2AgAgAyEBIANBCGogABAhIAIQmQUEQCABIAAQISACEJgFIAAQLwsgA0EQaiQAC0oBAn8jAEEgayICJAAgAkEYaiABECkhAyACQQA2AhQgAkEMNgIQIAMqAgAhASACIAIpAxA3AwggACACQQhqIAEQ6QUgAkEgaiQACzUBAX8jAEEQayICJAAgAkEANgIMIAJBCzYCCCACIAIpAwg3AwAgACACIAEQzwIgAkEQaiQACzUBAX8jAEEQayICJAAgAkEANgIMIAJBCjYCCCACIAIpAwg3AwAgACACIAEQzgIgAkEQaiQACzUBAX8jAEEQayICJAAgAkEANgIMIAJBCTYCCCACIAIpAwg3AwAgACACIAEQzgIgAkEQaiQACzUBAX8jAEEQayICJAAgAkEANgIMIAJBCDYCCCACIAIpAwg3AwAgACACIAEQzwIgAkEQaiQACzUBAX8jAEEQayICJAAgAkEANgIMIAJBBzYCCCACIAIpAwg3AwAgACACIAEQ4gEgAkEQaiQACzUBAX8jAEEQayICJAAgAkEANgIMIAJBBjYCCCACIAIpAwg3AwAgACACIAEQ4gEgAkEQaiQACzUBAX8jAEEQayICJAAgAkEANgIMIAJBBTYCCCACIAIpAwg3AwAgACACIAEQ4gEgAkEQaiQAC2ABAn8jAEEQayIDJAAgASgCACEEIAMgASgCBCIBNgIMIAMgBDYCCCADIAE2AgQgAyAENgIAIAMhASADQQhqIAAQISACEKQFBEAgASAAECEgAhCjBSAAEC8LIANBEGokAAs1AQF/IwBBEGsiAiQAIAJBADYCDCACQQQ2AgggAiACKQMINwMAIAAgAiABEPIFIAJBEGokAAtgAQJ/IwBBEGsiAyQAIAEoAgAhBCADIAEoAgQiATYCDCADIAQ2AgggAyABNgIEIAMgBDYCACADIQEgA0EIaiAAECEgAhCmBQRAIAEgABAhIAIQpQUgABAvCyADQRBqJAALNQEBfyMAQRBrIgIkACACQQA2AgwgAkEDNgIIIAIgAikDCDcDACAAIAIgARD0BSACQRBqJAALWgIBfwF9IwBBEGsiASQAIAEgABAhKgIMOAIIAn0gAUEIahAlBEBDAACAP0MAAAAAIAAoAqwELQAKGwwBCyABIAAQISoCDDgCACABKgIACyECIAFBEGokACACC0ICAX8BfSMAQRBrIgEkACABIAAQISoCCDgCCCABQQhqECVFBEAgASAAECEqAgg4AgAgASoCACECCyABQRBqJAAgAgskACAAECEgARAhEP0FRQRAIABBGGogARAhQcABED0aIAAQLwsLMgAgACABKAKcBEVBswoQTSAAIAAQoAFBAXNB6AoQTSAAIAEgAhCEAyABIAAQaiAAEC8LQQECfyMAQRBrIgIkAEHABBA5IAAQqQIhASAAKAKsBEEBQZAKEOQBIAIgASgCrAQ2AgggAUEAEGogAkEQaiQAIAELKwAgAkEFR0EAIAIbRQRAQcw3KAIAIAMgBBCIAg8LQfg7KAIAIAMgBBCIAgs2AQR/QQEhAwNAIAAgAhAgKgIAIAEgAhAgKgIAEEMiBARAIAMhBUEAIQNBASECIAUNAQsLIAQLpwUBBH8jAEEwayICJAACfwJAAn8CQAJAIAAQ3AIgARDcAkcNACAAELkBIAEQuQFHDQAgABDqASABEOoBRw0AIAAQ6QEgARDpAUcNACAAELgBIAEQuAFHDQAgABCiASABEKIBRw0AIAAQoQEgARChAUcNACAAEOgBIAEQ6AFHDQAgABDnASABEOcBRw0AIAAQtwEgARC3AUcNACACQShqIAAQvwEgAkEgaiABEL8BIAIgAigCKDYCDCACIAIoAiA2AgggAkEMaiACQQhqEPkCRQ0AIAAQRCABEEQQtgFFDQAgABBVIAEQVRC2AUUNACAAEHUgARB1ELYBRQ0AIAAQbSABEG0QtgFFDQAgABCkASABEKQBEOYBRQ0AIAAQXSABEF0Q5gENAQtBAAwBC0EAIAAQXiABEF4Q5gFFDQAaIAIgACoCBDgCGCACQRhqECUhAyACIAEqAgQ4AhAgAkEQahAlIANzQQFzC0UNACACIAAqAgQ4AhgCQCACQRhqECUNACACIAEqAgQ4AhAgAkEQahAlDQAgACoCBCABKgIEEIEBRQ0BCyACIAAqAgg4AhggAkEYahAlIQMgAiABKgIIOAIQIAJBEGoQJSADRw0AIAIgACoCCDgCGCACQRhqECVFBEAgACoCCCABKgIIEIEBRQ0BCyACIAAqAgw4AhggAkEYahAlIQMgAiABKgIMOAIQIAJBEGoQJSADRw0AIAIgASoCDDgCGEEBIAJBGGoQJQ0BGiAAKgIMIAEqAgwQgQEMAQtBAAshAyACIAAqArwBOAIYAkACQCACQRhqECUEQCACIAEqArwBOAIQIAMgAkEQahAlIgVxIQQgBQ0CIANBAXNFDQEMAgsgA0UNAQsgACoCvAEgASoCvAEQgQEhBAsgAkEwaiQAIAQLLQAgASAAKAIIRwRAA0AgACgCEBogACAAKAIIQXxqNgIIIAAoAgggAUcNAAsLCzABAX8jAEEQayICJAAgAiABNgIAIAIgADYCCCACIAJBCGoQxgEhACACQRBqJAAgAAsrAQF/IAAgASgCADYCACABKAIAIQMgACABNgIIIAAgAyACQQJ0ajYCBCAACwcAIAAoAgQLJAECfyMAQRBrIgIkACAAIAEQ4QIhAyACQRBqJAAgASAAIAMbC4ABAQF/IwBBIGsiAyQAIAMgATYCGCADQQhqIABBCGogASACEP8FEIAGIgEoAgAgASgCBEcEQANAIAAoAhAgASgCACADKAIYEKMBIAEgASgCAEEEajYCACADQRhqEEcgASgCACABKAIERw0ACwsgASgCCCABKAIANgIAIANBIGokAAsxAQJ/IAAoAgAhA0EDEDYgARA3IQQgAEEDEDYgARA3IAIgAXRxIAMgBEF/c3FyNgIAC+4DAQZ/IwBBMGsiBCQAAkAgACABELoBRQ0AIABBEGogAUEQahD8BUUNACAAQRhqIAFBGGoQugFFDQAgAEEoaiABQShqELoBRQ0AIABBOGogAUE4ahC6AUUNACAAEFsgARBbRw0AIAAQnwEgARCfAUcNACAAKAJYIAEoAlhHDQAgACgCXCABKAJcRw0AIAQgASkCuAI3AyggBCABKQKwAjcDICAEIAEpAqgCNwMYIABBqAJqIARBGGoQ0wJFDQAgACoCUCABKgJQEIEBRQ0AIAFB4ABqIQUgAEHgAGohBwNAIAcgAhBFIQYgBCAFIAIQRSIDKQIQNwMQIAQgAykCCDcDCCAEIAMpAgA3AwAgBiAEENMCIgNFDQEgAkEHSSEGIAJBAWohAiAGDQALCwJAAkAgAEGgAmoiAEEAECAqAgAQIgRAIAMgAUGgAmpBABAgKgIAECIiBXEhAiAFDQIgA0EBc0UNAQwCC0EAIQIgA0UNAQsgAEEAECAqAgAgAUGgAmpBABAgKgIAWyECCwJAAkAgAEEBECAqAgAQIgRAIAIgAUGgAmpBARAgKgIAECIiBXEhAyAFDQIgAkEBc0UNAQwCC0EAIQMgAkUNAQsgAEEBECAqAgAgAUGgAmpBARAgKgIAWyEDCyAEQTBqJAAgAwskAQJ/IwBBEGsiAiQAIAEgABDhAiEDIAJBEGokACABIAAgAxsLLQAjAEEQayIBJAAgAEIANwIAIAFBADYCDCAAQQhqIAFBDGoQ7AEgAUEQaiQACyQAIAEEQANAIAAgAigCADYCACAAQQRqIQAgAUF/aiIBDQALCwsxAQJ/IAAoAgAhA0EHEDYgARA3IQQgAEEHEDYgARA3IAIgAXRxIAMgBEF/c3FyNgIAC48BAQF/IwBBEGsiAiQAIABBABBOGgJAAkACQAJAAkAgASgCBA4EAAIDAQQLIAJBCGoQUCAAIAIoAgg2AgAMAwsgAkEIahCMASAAIAIoAgg2AgAMAgsgAkEIaiABKgIAEOgCIAAgAigCCDYCAAwBCyACQQhqIAEqAgAQ5wIgACACKAIINgIACyACQRBqJAAgAAszACAALQAJBEAgASACIANBACAEIAUgACgCBBEmABoPCyABIAIgAyAEIAUgACgCBBEUABoLdQAgACABKQIANwIAIAAgASkCEDcCECAAIAEpAgg3AgggAEEYaiABQRhqQcABED0aIABB2AFqIAFB2AFqQcgCED0aIABBoARqIAFBoARqEMACIAAgASgCvAQ2ArwEIAAgASkCtAQ3ArQEIAAgASkCrAQ3AqwEC2YBA38jAEHABGsiASQAIAAgAEGgBGoQJ0VB0AgQTSAAIAAoApwERUGGCRBNIAAQ9wIgAC0ABEEHEEwhAiAAIAEgACgCrAQQ6wIiAxCMBiADEOoCGiACBEAgABDbAQsgAUHABGokAAstAQF/IwBBwAJrIgIkACAAIAIgAUHAAhA9IgAQhQYhASAAQcACaiQAIAFBAXMLeAECfyMAQRBrIgEkAEEBIQICQCAAQdgBahDuAg0AIAEgAEGgBGoiABBANgIIIAEgABBINgIAQQAhAiABQQhqIAEQK0UNAANAIAEoAggoAgBB2AFqEO4CIgINASABQQhqEEcgAUEIaiABECsNAAsLIAFBEGokACACCzkAIABBADYCGCAAQQA6ABQgAEGAgID8AzYCECAAQQA2AQogAEEANgIAIABBADoACSAAQQI2AgQgAAtOAQF/IwBBEGsiAiQAIAIgATYCACACIAA2AgggAkEIaiACECsEQANAIAIoAggoAgAQ8gIgAkEIahBHIAJBCGogAhArDQALCyACQRBqJAALjQEBA38jAEEQayICJAAgAiAAQaAEaiIDEEA2AgggAiADEEg2AgAgAkEIaiACECsEQEEAIQMDQCAAIAIoAggiBCgCACgCnARHBEAgBCAAKAKsBCAEKAIAIAAgAyABEOUCIgQ2AgAgBCAAEGoLIANBAWohAyACQQhqEEcgAkEIaiACECsNAAsLIAJBEGokAAtEAQJ/IwBBIGsiASQAIAAQXCAAECdLBEAgABAqIQIgACABQQhqIAAQJyAAECcgAhCXASIAEPUBIAAQpQELIAFBIGokAAulAQECfyMAQSBrIgIkACACQRBqIAFBGGoiAxC/ASACQRhqIAJBEGoQLgJAAkACQCACKAIcDgQBAAABAAsgACACKQMYNwIADAELIAIgAyoCBDgCEAJAIAJBEGoQJQ0AIAIgAyoCBDgCCCACKgIIQwAAAABeQQFzDQAgAEGICkH4CSABLQAEQQcQTBspAgA3AgAMAQsgAEGICikCADcCAAsgAkEgaiQACy4BAn8gAC0AACECQQIQNkEAEDchAyAAQQIQNkEAEDcgAXEgAiADQX9zcXI6AAALVQEBfyMAQRBrIgIkACACIAE2AgggAiAAEEA2AgAgAkEIaiACEMYBIQEgACAAKAIAIAFBAnRqIgFBBGogACgCBCABEMQBEP0CIAEQrAEaIAJBEGokAAtfAQF/IwBBEGsiAyQAIAMgATYCACADIAA2AggCQCADQQhqIAMQK0UNAANAIAMoAggoAgAgAigCAEYNASADQQhqEEcgA0EIaiADECsNAAsLIAMoAgghACADQRBqJAAgAAsWABCfBBCYBBCTBEGIygBBwwERAAAaCwuXPRwAQYAIC70GQ2Fubm90IHNldCBtZWFzdXJlIGZ1bmN0aW9uOiBOb2RlcyB3aXRoIG1lYXN1cmUgZnVuY3Rpb25zIGNhbm5vdCBoYXZlIGNoaWxkcmVuLgBDYW5ub3QgcmVzZXQgYSBub2RlIHdoaWNoIHN0aWxsIGhhcyBjaGlsZHJlbiBhdHRhY2hlZABDYW5ub3QgcmVzZXQgYSBub2RlIHN0aWxsIGF0dGFjaGVkIHRvIGEgb3duZXIAYWxsb2NhdG9yPFQ+OjphbGxvY2F0ZShzaXplX3QgbikgJ24nIGV4Y2VlZHMgbWF4aW11bSBzdXBwb3J0ZWQgc2l6ZQAAAAAAAQAAAAAAwH8AAAAAAADAfwMAAABDb3VsZCBub3QgYWxsb2NhdGUgbWVtb3J5IGZvciBub2RlAENoaWxkIGFscmVhZHkgaGFzIGEgb3duZXIsIGl0IG11c3QgYmUgcmVtb3ZlZCBmaXJzdC4AQ2Fubm90IGFkZCBjaGlsZDogTm9kZXMgd2l0aCBtZWFzdXJlIGZ1bmN0aW9ucyBjYW5ub3QgaGF2ZSBjaGlsZHJlbi4AT25seSBsZWFmIG5vZGVzIHdpdGggY3VzdG9tIG1lYXN1cmUgZnVuY3Rpb25zc2hvdWxkIG1hbnVhbGx5IG1hcmsgdGhlbXNlbHZlcyBhcyBkaXJ0eQBDYW5ub3QgZ2V0IGxheW91dCBwcm9wZXJ0aWVzIG9mIG11bHRpLWVkZ2Ugc2hvcnRoYW5kcwAAAAABAAAAAwAAAAAAAAACAAAAAwAAAAEAAAACAAAAAAAAACVzJWQue1tza2lwcGVkXSAAd206ICVzLCBobTogJXMsIGF3OiAlZiBhaDogJWYgPT4gZDogKCVmLCAlZikgJXMKACVzJWQueyVzACoAAHdtOiAlcywgaG06ICVzLCBhdzogJWYgYWg6ICVmICVzCgAlcyVkLn0lcwB3bTogJXMsIGhtOiAlcywgZDogKCVmLCAlZikgJXMKAE91dCBvZiBjYWNoZSBlbnRyaWVzIQoAU2NhbGUgZmFjdG9yIHNob3VsZCBub3QgYmUgbGVzcyB0aGFuIHplcm8AAAABAAAAAQBByA4LihAlcwoAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAFVOREVGSU5FRABFWEFDVExZAEFUX01PU1QAAIkHAACTBwAAmwcAAExBWV9VTkRFRklORUQATEFZX0VYQUNUTFkATEFZX0FUX01PU1QAAACwBwAAvgcAAMoHAABhdmFpbGFibGVXaWR0aCBpcyBpbmRlZmluaXRlIHNvIHdpZHRoTWVhc3VyZU1vZGUgbXVzdCBiZSBZR01lYXN1cmVNb2RlVW5kZWZpbmVkAGF2YWlsYWJsZUhlaWdodCBpcyBpbmRlZmluaXRlIHNvIGhlaWdodE1lYXN1cmVNb2RlIG11c3QgYmUgWUdNZWFzdXJlTW9kZVVuZGVmaW5lZAAAAAEAAAADAAAAAAAAAAIAAABFeHBlY3RlZCBub2RlIHRvIGhhdmUgY3VzdG9tIG1lYXN1cmUgZnVuY3Rpb24ARXhwZWN0IGN1c3RvbSBiYXNlbGluZSBmdW5jdGlvbiB0byBub3QgcmV0dXJuIE5hTgBDb3VsZCBub3QgYWxsb2NhdGUgbWVtb3J5IGZvciBjb25maWcAQ29uZmlnAGNyZWF0ZQBzZXRFeHBlcmltZW50YWxGZWF0dXJlRW5hYmxlZABzZXRQb2ludFNjYWxlRmFjdG9yAGlzRXhwZXJpbWVudGFsRmVhdHVyZUVuYWJsZWQATGF5b3V0AGxlZnQAcmlnaHQAdG9wAGJvdHRvbQB3aWR0aABoZWlnaHQATWVhc3VyZUNhbGxiYWNrAG1lYXN1cmUATWVhc3VyZUNhbGxiYWNrV3JhcHBlcgBEaXJ0aWVkQ2FsbGJhY2sAZGlydGllZABEaXJ0aWVkQ2FsbGJhY2tXcmFwcGVyAFNpemUAVmFsdWUAdmFsdWUAdW5pdABOb2RlAGNyZWF0ZURlZmF1bHQAY3JlYXRlV2l0aENvbmZpZwBkZXN0cm95AHJlc2V0AGNvcHlTdHlsZQBzZXRQb3NpdGlvblR5cGUAc2V0UG9zaXRpb24Ac2V0UG9zaXRpb25QZXJjZW50AHNldEFsaWduQ29udGVudABzZXRBbGlnbkl0ZW1zAHNldEFsaWduU2VsZgBzZXRGbGV4RGlyZWN0aW9uAHNldEZsZXhXcmFwAHNldEp1c3RpZnlDb250ZW50AHNldE1hcmdpbgBzZXRNYXJnaW5QZXJjZW50AHNldE1hcmdpbkF1dG8Ac2V0T3ZlcmZsb3cAc2V0RGlzcGxheQBzZXRGbGV4AHNldEZsZXhCYXNpcwBzZXRGbGV4QmFzaXNQZXJjZW50AHNldEZsZXhHcm93AHNldEZsZXhTaHJpbmsAc2V0V2lkdGgAc2V0V2lkdGhQZXJjZW50AHNldFdpZHRoQXV0bwBzZXRIZWlnaHQAc2V0SGVpZ2h0UGVyY2VudABzZXRIZWlnaHRBdXRvAHNldE1pbldpZHRoAHNldE1pbldpZHRoUGVyY2VudABzZXRNaW5IZWlnaHQAc2V0TWluSGVpZ2h0UGVyY2VudABzZXRNYXhXaWR0aABzZXRNYXhXaWR0aFBlcmNlbnQAc2V0TWF4SGVpZ2h0AHNldE1heEhlaWdodFBlcmNlbnQAc2V0QXNwZWN0UmF0aW8Ac2V0Qm9yZGVyAHNldFBhZGRpbmcAc2V0UGFkZGluZ1BlcmNlbnQAZ2V0UG9zaXRpb25UeXBlAGdldFBvc2l0aW9uAGdldEFsaWduQ29udGVudABnZXRBbGlnbkl0ZW1zAGdldEFsaWduU2VsZgBnZXRGbGV4RGlyZWN0aW9uAGdldEZsZXhXcmFwAGdldEp1c3RpZnlDb250ZW50AGdldE1hcmdpbgBnZXRGbGV4QmFzaXMAZ2V0RmxleEdyb3cAZ2V0RmxleFNocmluawBnZXRXaWR0aABnZXRIZWlnaHQAZ2V0TWluV2lkdGgAZ2V0TWluSGVpZ2h0AGdldE1heFdpZHRoAGdldE1heEhlaWdodABnZXRBc3BlY3RSYXRpbwBnZXRCb3JkZXIAZ2V0T3ZlcmZsb3cAZ2V0RGlzcGxheQBnZXRQYWRkaW5nAGluc2VydENoaWxkAHJlbW92ZUNoaWxkAGdldENoaWxkQ291bnQAZ2V0UGFyZW50AGdldENoaWxkAGlzUmVmZXJlbmNlQmFzZWxpbmUAc2V0SXNSZWZlcmVuY2VCYXNlbGluZQBzZXRNZWFzdXJlRnVuYwB1bnNldE1lYXN1cmVGdW5jAHNldERpcnRpZWRGdW5jAHVuc2V0RGlydGllZEZ1bmMAbWFya0RpcnR5AGlzRGlydHkAY2FsY3VsYXRlTGF5b3V0AGdldENvbXB1dGVkTGVmdABnZXRDb21wdXRlZFJpZ2h0AGdldENvbXB1dGVkVG9wAGdldENvbXB1dGVkQm90dG9tAGdldENvbXB1dGVkV2lkdGgAZ2V0Q29tcHV0ZWRIZWlnaHQAZ2V0Q29tcHV0ZWRMYXlvdXQAZ2V0Q29tcHV0ZWRNYXJnaW4AZ2V0Q29tcHV0ZWRCb3JkZXIAZ2V0Q29tcHV0ZWRQYWRkaW5nADZDb25maWcA3CEAAAAPAABQNkNvbmZpZwAAAAC8IgAAEA8AAAAAAAAIDwAAUEs2Q29uZmlnAAAAvCIAACwPAAABAAAACA8AAGlpAHYAdmkAHA8AQeAeC6wC5CAAABwPAABEIQAA/CAAAHZpaWlpAAAA5CAAABwPAAB0IQAAdmlpZgAAAAD8IAAAOA8AAEQhAABpaWlpADZMYXlvdXQAAAAA3CEAAJ0PAABpAGRpaQB2aWlkADE1TWVhc3VyZUNhbGxiYWNrAAAAANwhAAC7DwAAUDE1TWVhc3VyZUNhbGxiYWNrAAC8IgAA2A8AAAAAAADQDwAAUEsxNU1lYXN1cmVDYWxsYmFjawC8IgAA/A8AAAEAAADQDwAAQBAAAOwPAAB0IQAAWBAAAHQhAABYEAAANllHU2l6ZQDcIQAAOBAAADEzWUdNZWFzdXJlTW9kZQCQIQAASBAAAGlpaWZpZmkAbm90aWZ5T25EZXN0cnVjdGlvbgBpbXBsZW1lbnQAZXh0ZW5kAEGVIQvLFhEAAMAAAABfX2Rlc3RydWN0AE4xMGVtc2NyaXB0ZW43d3JhcHBlckkxNU1lYXN1cmVDYWxsYmFja0VFAE4xMGVtc2NyaXB0ZW44aW50ZXJuYWwxMVdyYXBwZXJCYXNlRQAAANwhAADREAAAYCIAAKcQAAAAAAAAAgAAANAPAAACAAAA+BAAAAIEAADkIAAAMjJNZWFzdXJlQ2FsbGJhY2tXcmFwcGVyAAAAAAQiAAAkEQAAABEAAFAyMk1lYXN1cmVDYWxsYmFja1dyYXBwZXIAAAC8IgAATBEAAAAAAABAEQAAUEsyMk1lYXN1cmVDYWxsYmFja1dyYXBwZXIAALwiAAB4EQAAAQAAAEARAADkIAAAQBEAAHZpaQBoEQAAzBEAAE4xMGVtc2NyaXB0ZW4zdmFsRQAA3CEAALgRAABpaWkAAAAAAEARAADBAAAAAAAAANAPAADAAAAAQBAAAHQhAABYEAAAdCEAAFgQAADMEQAAgBIAAMwRAABOU3QzX18yMTJiYXNpY19zdHJpbmdJY05TXzExY2hhcl90cmFpdHNJY0VFTlNfOWFsbG9jYXRvckljRUVFRQBOU3QzX18yMjFfX2Jhc2ljX3N0cmluZ19jb21tb25JTGIxRUVFAAAAANwhAABPEgAAYCIAABASAAAAAAAAAQAAAHgSAAAAAAAAMTVEaXJ0aWVkQ2FsbGJhY2sAAADcIQAAmBIAAFAxNURpcnRpZWRDYWxsYmFjawAAvCIAALQSAAAAAAAArBIAAFBLMTVEaXJ0aWVkQ2FsbGJhY2sAvCIAANgSAAABAAAArBIAAOQgAADIEgAAAAAAADwTAADAAAAATjEwZW1zY3JpcHRlbjd3cmFwcGVySTE1RGlydGllZENhbGxiYWNrRUUAAABgIgAAEBMAAAAAAAACAAAArBIAAAIAAAD4EAAAAgQAADIyRGlydGllZENhbGxiYWNrV3JhcHBlcgAAAAAEIgAAXBMAADwTAABQMjJEaXJ0aWVkQ2FsbGJhY2tXcmFwcGVyAAAAvCIAAIQTAAAAAAAAeBMAAFBLMjJEaXJ0aWVkQ2FsbGJhY2tXcmFwcGVyAAC8IgAAsBMAAAEAAAB4EwAA5CAAAHgTAACgEwAAzBEAAAAAAAB4EwAAwgAAAAAAAACsEgAAwAAAAGZpaQA3WUdWYWx1ZQAAAADcIQAACBQAADZZR1VuaXQAkCEAABwUAAB2aWlpADROb2RlAADcIQAAMRQAAFA0Tm9kZQAAvCIAAEAUAAAAAAAAOBQAAFBLNE5vZGUAvCIAAFgUAAABAAAAOBQAAEgUAABIFAAAHA8AAOQgAABIFAAA5CAAAEgUAAA4FAAA5CAAAEgUAABEIQAAAAAAAOQgAABIFAAARCEAAIAhAAB2aWlpZAAAAOQgAABIFAAAgCEAAEQhAABgFAAAFBQAAGAUAABEIQAAFBQAAGAUAACAIQAAYBQAAIAhAABgFAAARCEAAGRpaWkAAAAAAAAAAOQgAABIFAAASBQAAFAhAADkIAAASBQAAEgUAABQIQAAYBQAAEgUAABIFAAASBQAAEgUAABQIQAA/CAAAEgUAADkIAAASBQAAPwgAADkIAAASBQAAOwPAADkIAAASBQAAMgSAAD8IAAAYBQAAAAAAADkIAAASBQAAIAhAACAIQAARCEAAHZpaWRkaQAAqA8AAGAUAAB2b2lkAGJvb2wAY2hhcgBzaWduZWQgY2hhcgB1bnNpZ25lZCBjaGFyAHNob3J0AHVuc2lnbmVkIHNob3J0AGludAB1bnNpZ25lZCBpbnQAbG9uZwB1bnNpZ25lZCBsb25nAGZsb2F0AGRvdWJsZQBzdGQ6OnN0cmluZwBzdGQ6OmJhc2ljX3N0cmluZzx1bnNpZ25lZCBjaGFyPgBzdGQ6OndzdHJpbmcAc3RkOjp1MTZzdHJpbmcAc3RkOjp1MzJzdHJpbmcAZW1zY3JpcHRlbjo6dmFsAGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgc2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgaW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZmxvYXQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGRvdWJsZT4ATlN0M19fMjEyYmFzaWNfc3RyaW5nSWhOU18xMWNoYXJfdHJhaXRzSWhFRU5TXzlhbGxvY2F0b3JJaEVFRUUAAAAAYCIAAKoYAAAAAAAAAQAAAHgSAAAAAAAATlN0M19fMjEyYmFzaWNfc3RyaW5nSXdOU18xMWNoYXJfdHJhaXRzSXdFRU5TXzlhbGxvY2F0b3JJd0VFRUUAAGAiAAAEGQAAAAAAAAEAAAB4EgAAAAAAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0lEc05TXzExY2hhcl90cmFpdHNJRHNFRU5TXzlhbGxvY2F0b3JJRHNFRUVFAAAAYCIAAFwZAAAAAAAAAQAAAHgSAAAAAAAATlN0M19fMjEyYmFzaWNfc3RyaW5nSURpTlNfMTFjaGFyX3RyYWl0c0lEaUVFTlNfOWFsbG9jYXRvcklEaUVFRUUAAABgIgAAuBkAAAAAAAABAAAAeBIAAAAAAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0ljRUUAANwhAAAUGgAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJYUVFAADcIQAAPBoAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWhFRQAA3CEAAGQaAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lzRUUAANwhAACMGgAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJdEVFAADcIQAAtBoAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWlFRQAA3CEAANwaAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lqRUUAANwhAAAEGwAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJbEVFAADcIQAALBsAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SW1FRQAA3CEAAFQbAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lmRUUAANwhAAB8GwAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJZEVFAADcIQAApBsAANAiAAAtKyAgIDBYMHgAKG51bGwpAEHwNwtBEQAKABEREQAAAAAFAAAAAAAACQAAAAALAAAAAAAAAAARAA8KERERAwoHAAEACQsLAAAJBgsAAAsABhEAAAAREREAQcE4CyELAAAAAAAAAAARAAoKERERAAoAAAIACQsAAAAJAAsAAAsAQfs4CwEMAEGHOQsVDAAAAAAMAAAAAAkMAAAAAAAMAAAMAEG1OQsBDgBBwTkLFQ0AAAAEDQAAAAAJDgAAAAAADgAADgBB7zkLARAAQfs5Cx4PAAAAAA8AAAAACRAAAAAAABAAABAAABIAAAASEhIAQbI6Cw4SAAAAEhISAAAAAAAACQBB4zoLAQsAQe86CxUKAAAAAAoAAAAACQsAAAAAAAsAAAsAQZ07CwEMAEGpOwukCgwAAAAADAAAAAAJDAAAAAAADAAADAAAMDEyMzQ1Njc4OUFCQ0RFRi0wWCswWCAwWC0weCsweCAweABpbmYASU5GAG5hbgBOQU4ALgAAAABIJAAAYmFzaWNfc3RyaW5nAGFsbG9jYXRvcjxUPjo6YWxsb2NhdGUoc2l6ZV90IG4pICduJyBleGNlZWRzIG1heGltdW0gc3VwcG9ydGVkIHNpemUAdmVjdG9yAF9fY3hhX2d1YXJkX2FjcXVpcmUgZGV0ZWN0ZWQgcmVjdXJzaXZlIGluaXRpYWxpemF0aW9uAFB1cmUgdmlydHVhbCBmdW5jdGlvbiBjYWxsZWQhAHN0ZDo6ZXhjZXB0aW9uAAAAAAAA3B4AAMsAAADMAAAAzQAAAFN0OWV4Y2VwdGlvbgAAAADcIQAAzB4AAAAAAAAIHwAAAQAAAM4AAADPAAAAU3QxMWxvZ2ljX2Vycm9yAAQiAAD4HgAA3B4AAAAAAAA8HwAAAQAAANAAAADPAAAAU3QxMmxlbmd0aF9lcnJvcgAAAAAEIgAAKB8AAAgfAABTdDl0eXBlX2luZm8AAAAA3CEAAEgfAABOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQAAAAAEIgAAYB8AAFgfAABOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAAAAEIgAAkB8AAIQfAABOMTBfX2N4eGFiaXYxMTdfX3BiYXNlX3R5cGVfaW5mb0UAAAAEIgAAwB8AAIQfAABOMTBfX2N4eGFiaXYxMTlfX3BvaW50ZXJfdHlwZV9pbmZvRQAEIgAA8B8AAOQfAABOMTBfX2N4eGFiaXYxMjBfX2Z1bmN0aW9uX3R5cGVfaW5mb0UAAAAABCIAACAgAACEHwAATjEwX19jeHhhYml2MTI5X19wb2ludGVyX3RvX21lbWJlcl90eXBlX2luZm9FAAAABCIAAFQgAADkHwAAAAAAANQgAADRAAAA0gAAANMAAADUAAAA1QAAAE4xMF9fY3h4YWJpdjEyM19fZnVuZGFtZW50YWxfdHlwZV9pbmZvRQAEIgAArCAAAIQfAAB2AAAAmCAAAOAgAABEbgAAmCAAAOwgAABiAAAAmCAAAPggAABjAAAAmCAAAAQhAABoAAAAmCAAABAhAABhAAAAmCAAABwhAABzAAAAmCAAACghAAB0AAAAmCAAADQhAABpAAAAmCAAAEAhAABqAAAAmCAAAEwhAABsAAAAmCAAAFghAABtAAAAmCAAAGQhAABmAAAAmCAAAHAhAABkAAAAmCAAAHwhAAAAAAAAyCEAANEAAADWAAAA0wAAANQAAADXAAAATjEwX19jeHhhYml2MTE2X19lbnVtX3R5cGVfaW5mb0UAAAAABCIAAKQhAACEHwAAAAAAALQfAADRAAAA2AAAANMAAADUAAAA2QAAANoAAADbAAAA3AAAAAAAAABMIgAA0QAAAN0AAADTAAAA1AAAANkAAADeAAAA3wAAAOAAAABOMTBfX2N4eGFiaXYxMjBfX3NpX2NsYXNzX3R5cGVfaW5mb0UAAAAABCIAACQiAAC0HwAAAAAAAKgiAADRAAAA4QAAANMAAADUAAAA2QAAAOIAAADjAAAA5AAAAE4xMF9fY3h4YWJpdjEyMV9fdm1pX2NsYXNzX3R5cGVfaW5mb0UAAAAEIgAAgCIAALQfAAAAAAAAFCAAANEAAADlAAAA0wAAANQAAADmAEHQxQALAQUAQdzFAAsBxABB9MUACwrFAAAAxgAAABElAEGMxgALAQIAQZvGAAsF//////8AQZDIAAsCQCUAQcjIAAsBBQBB1MgACwHJAEHsyAALDsUAAADKAAAAaCUAAAAEAEGEyQALAQEAQZPJAAsFCv////8=';
var _pluginEnv$customEnv = pluginEnv.customEnv,
    WXWebAssembly = _pluginEnv$customEnv.WXWebAssembly,
    wx = _pluginEnv$customEnv.wx;
var Function = WXWebAssembly.Function;
var WebAssembly = WXWebAssembly;

var Yoga = function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }
  /**
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   * @format
   */


  var CONSTANTS = {
    ALIGN_COUNT: 8,
    ALIGN_AUTO: 0,
    ALIGN_FLEX_START: 1,
    ALIGN_CENTER: 2,
    ALIGN_FLEX_END: 3,
    ALIGN_STRETCH: 4,
    ALIGN_BASELINE: 5,
    ALIGN_SPACE_BETWEEN: 6,
    ALIGN_SPACE_AROUND: 7,
    DIMENSION_COUNT: 2,
    DIMENSION_WIDTH: 0,
    DIMENSION_HEIGHT: 1,
    DIRECTION_COUNT: 3,
    DIRECTION_INHERIT: 0,
    DIRECTION_LTR: 1,
    DIRECTION_RTL: 2,
    DISPLAY_COUNT: 2,
    DISPLAY_FLEX: 0,
    DISPLAY_NONE: 1,
    EDGE_COUNT: 9,
    EDGE_LEFT: 0,
    EDGE_TOP: 1,
    EDGE_RIGHT: 2,
    EDGE_BOTTOM: 3,
    EDGE_START: 4,
    EDGE_END: 5,
    EDGE_HORIZONTAL: 6,
    EDGE_VERTICAL: 7,
    EDGE_ALL: 8,
    EXPERIMENTAL_FEATURE_COUNT: 1,
    EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS: 0,
    FLEX_DIRECTION_COUNT: 4,
    FLEX_DIRECTION_COLUMN: 0,
    FLEX_DIRECTION_COLUMN_REVERSE: 1,
    FLEX_DIRECTION_ROW: 2,
    FLEX_DIRECTION_ROW_REVERSE: 3,
    JUSTIFY_COUNT: 6,
    JUSTIFY_FLEX_START: 0,
    JUSTIFY_CENTER: 1,
    JUSTIFY_FLEX_END: 2,
    JUSTIFY_SPACE_BETWEEN: 3,
    JUSTIFY_SPACE_AROUND: 4,
    JUSTIFY_SPACE_EVENLY: 5,
    LOG_LEVEL_COUNT: 6,
    LOG_LEVEL_ERROR: 0,
    LOG_LEVEL_WARN: 1,
    LOG_LEVEL_INFO: 2,
    LOG_LEVEL_DEBUG: 3,
    LOG_LEVEL_VERBOSE: 4,
    LOG_LEVEL_FATAL: 5,
    MEASURE_MODE_COUNT: 3,
    MEASURE_MODE_UNDEFINED: 0,
    MEASURE_MODE_EXACTLY: 1,
    MEASURE_MODE_AT_MOST: 2,
    NODE_TYPE_COUNT: 2,
    NODE_TYPE_DEFAULT: 0,
    NODE_TYPE_TEXT: 1,
    OVERFLOW_COUNT: 3,
    OVERFLOW_VISIBLE: 0,
    OVERFLOW_HIDDEN: 1,
    OVERFLOW_SCROLL: 2,
    POSITION_TYPE_COUNT: 2,
    POSITION_TYPE_RELATIVE: 0,
    POSITION_TYPE_ABSOLUTE: 1,
    PRINT_OPTIONS_COUNT: 3,
    PRINT_OPTIONS_LAYOUT: 1,
    PRINT_OPTIONS_STYLE: 2,
    PRINT_OPTIONS_CHILDREN: 4,
    UNIT_COUNT: 4,
    UNIT_UNDEFINED: 0,
    UNIT_POINT: 1,
    UNIT_PERCENT: 2,
    UNIT_AUTO: 3,
    WRAP_COUNT: 3,
    WRAP_NO_WRAP: 0,
    WRAP_WRAP: 1,
    WRAP_WRAP_REVERSE: 2
  };
  var YGEnums = CONSTANTS;
  /**
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   * @format
   */

  var Layout = /*#__PURE__*/function () {
    function Layout(left, right, top, bottom, width, height) {
      _classCallCheck(this, Layout);

      this.left = left;
      this.right = right;
      this.top = top;
      this.bottom = bottom;
      this.width = width;
      this.height = height;
    }

    _createClass(Layout, [{
      key: "fromJS",
      value: function fromJS(expose) {
        expose(this.left, this.right, this.top, this.bottom, this.width, this.height);
      }
    }, {
      key: "toString",
      value: function toString() {
        return "<Layout#".concat(this.left, ":").concat(this.right, ";").concat(this.top, ":").concat(this.bottom, ";").concat(this.width, ":").concat(this.height, ">");
      }
    }]);

    return Layout;
  }();

  var Size = /*#__PURE__*/function () {
    _createClass(Size, null, [{
      key: "fromJS",
      value: function fromJS(_ref) {
        var width = _ref.width,
            height = _ref.height;
        return new Size(width, height);
      }
    }]);

    function Size(width, height) {
      _classCallCheck(this, Size);

      this.width = width;
      this.height = height;
    }

    _createClass(Size, [{
      key: "fromJS",
      value: function fromJS(expose) {
        expose(this.width, this.height);
      }
    }, {
      key: "toString",
      value: function toString() {
        return "<Size#".concat(this.width, "x").concat(this.height, ">");
      }
    }]);

    return Size;
  }();

  var Value = /*#__PURE__*/function () {
    function Value(unit, value) {
      _classCallCheck(this, Value);

      this.unit = unit;
      this.value = value;
    }

    _createClass(Value, [{
      key: "fromJS",
      value: function fromJS(expose) {
        expose(this.unit, this.value);
      }
    }, {
      key: "toString",
      value: function toString() {
        switch (this.unit) {
          case YGEnums.UNIT_POINT:
            return String(this.value);

          case YGEnums.UNIT_PERCENT:
            return "".concat(this.value, "%");

          case YGEnums.UNIT_AUTO:
            return 'auto';

          default:
            {
              return "".concat(this.value, "?");
            }
        }
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        return this.value;
      }
    }]);

    return Value;
  }();

  var entryCommon = function entryCommon(bind, lib) {
    function patch(prototype, name, fn) {
      var original = prototype[name];

      prototype[name] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return fn.call.apply(fn, [this, original].concat(args));
      };
    }

    var _loop = function _loop() {
      var _methods;

      var fnName = _arr[_i];
      var methods = (_methods = {}, _defineProperty(_methods, YGEnums.UNIT_POINT, lib.Node.prototype[fnName]), _defineProperty(_methods, YGEnums.UNIT_PERCENT, lib.Node.prototype["".concat(fnName, "Percent")]), _defineProperty(_methods, YGEnums.UNIT_AUTO, lib.Node.prototype["".concat(fnName, "Auto")]), _methods);
      patch(lib.Node.prototype, fnName, function (original) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        } // We patch all these functions to add support for the following calls:
        // .setWidth(100) / .setWidth("100%") / .setWidth(.getWidth()) / .setWidth("auto")


        var value = args.pop();
        var unit, asNumber;

        if (value === 'auto') {
          unit = YGEnums.UNIT_AUTO;
          asNumber = undefined;
        } else if (value instanceof Value) {
          unit = value.unit;
          asNumber = value.valueOf();
        } else {
          unit = typeof value === 'string' && value.endsWith('%') ? YGEnums.UNIT_PERCENT : YGEnums.UNIT_POINT;
          asNumber = parseFloat(value);

          if (!Number.isNaN(value) && Number.isNaN(asNumber)) {
            throw new Error("Invalid value ".concat(value, " for ").concat(fnName));
          }
        }

        if (!methods[unit]) throw new Error("Failed to execute \"".concat(fnName, "\": Unsupported unit '").concat(value, "'"));

        if (asNumber !== undefined) {
          var _methods$unit;

          return (_methods$unit = methods[unit]).call.apply(_methods$unit, [this].concat(args, [asNumber]));
        } else {
          var _methods$unit2;

          return (_methods$unit2 = methods[unit]).call.apply(_methods$unit2, [this].concat(args));
        }
      });
    };

    for (var _i = 0, _arr = ['setPosition', 'setMargin', 'setFlexBasis', 'setWidth', 'setHeight', 'setMinWidth', 'setMinHeight', 'setMaxWidth', 'setMaxHeight', 'setPadding']; _i < _arr.length; _i++) {
      _loop();
    }

    patch(lib.Config.prototype, 'free', function () {
      // Since we handle the memory allocation ourselves (via lib.Config.create),
      // we also need to handle the deallocation
      lib.Config.destroy(this);
    });
    patch(lib.Node, 'create', function (_, config) {
      // We decide the constructor we want to call depending on the parameters
      return config ? lib.Node.createWithConfig(config) : lib.Node.createDefault();
    });
    patch(lib.Node.prototype, 'free', function () {
      // Since we handle the memory allocation ourselves (via lib.Node.create),
      // we also need to handle the deallocation
      lib.Node.destroy(this);
    });
    patch(lib.Node.prototype, 'freeRecursive', function () {
      for (var t = 0, T = this.getChildCount(); t < T; ++t) {
        this.getChild(0).freeRecursive();
      }

      this.free();
    });
    patch(lib.Node.prototype, 'setMeasureFunc', function (original, measureFunc) {
      // This patch is just a convenience patch, since it helps write more
      // idiomatic source code (such as .setMeasureFunc(null))
      // We also automatically convert the return value of the measureFunc
      // to a Size object, so that we can return anything that has .width and
      // .height properties
      if (measureFunc) {
        return original.call(this, function () {
          return Size.fromJS(measureFunc.apply(void 0, arguments));
        });
      } else {
        return this.unsetMeasureFunc();
      }
    });
    patch(lib.Node.prototype, 'calculateLayout', function (original) {
      var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NaN;
      var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NaN;
      var direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : YGEnums.DIRECTION_LTR; // Just a small patch to add support for the function default parameters

      return original.call(this, width, height, direction);
    });
    return _objectSpread2({
      Config: lib.Config,
      Node: lib.Node,
      Layout: bind('Layout', Layout),
      Size: bind('Size', Size),
      Value: bind('Value', Value)
    }, YGEnums);
  };

  var Module = function () {
    // var _scriptDir = (document.currentScript && document.currentScript.src || new URL('index.umd.js', document.baseURI).href);
    var _scriptDir = '';
    return function (Module) {
      Module = Module || {};
      var Module = typeof Module !== "undefined" ? Module : {};
      var readyPromiseResolve, readyPromiseReject;
      Module["ready"] = new Promise(function (resolve, reject) {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject;
      });
      var moduleOverrides = {};
      var key;

      for (key in Module) {
        if (Module.hasOwnProperty(key)) {
          moduleOverrides[key] = Module[key];
        }
      }

      var arguments_ = [];
      var thisProgram = "./this.program";

      var quit_ = function quit_(status, toThrow) {
        throw toThrow;
      };

      var ENVIRONMENT_IS_WEB = false;
      var ENVIRONMENT_IS_WORKER = false;
      var ENVIRONMENT_IS_NODE = false;
      var ENVIRONMENT_IS_SHELL = false;
      ENVIRONMENT_IS_WEB = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object";
      ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
      ENVIRONMENT_IS_NODE = (typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && _typeof(process.versions) === "object" && typeof process.versions.node === "string";
      ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
      var scriptDirectory = "";

      function locateFile(path) {
        if (Module["locateFile"]) {
          return Module["locateFile"](path, scriptDirectory);
        }

        return scriptDirectory + path;
      }

      var read_, readBinary;
      var nodeFS;
      var nodePath;

      if (ENVIRONMENT_IS_NODE) {// if (ENVIRONMENT_IS_WORKER) {
        //   scriptDirectory = require("path").dirname(scriptDirectory) + "/";
        // } else {
        //   scriptDirectory = __dirname + "/";
        // }
        // read_ = function shell_read(filename, binary) {
        //   if (!nodeFS) nodeFS = require("fs");
        //   if (!nodePath) nodePath = require("path");
        //   filename = nodePath["normalize"](filename);
        //   return nodeFS["readFileSync"](filename, binary ? null : "utf8");
        // };
        // readBinary = function readBinary(filename) {
        //   var ret = read_(filename, true);
        //   if (!ret.buffer) {
        //     ret = new Uint8Array(ret);
        //   }
        //   assert(ret.buffer);
        //   return ret;
        // };
        // if (process["argv"].length > 1) {
        //   thisProgram = process["argv"][1].replace(/\\/g, "/");
        // }
        // arguments_ = process["argv"].slice(2);
        // process["on"]("uncaughtException", function (ex) {
        //   if (!(ex instanceof ExitStatus)) {
        //     throw ex;
        //   }
        // });
        // process["on"]("unhandledRejection", abort);
        // quit_ = function quit_(status) {
        //   process["exit"](status);
        // };
        // Module["inspect"] = function () {
        //   return "[Emscripten Module object]";
        // };
      } else if (ENVIRONMENT_IS_SHELL) {// if (typeof read != "undefined") {
        //   read_ = function shell_read(f) {
        //     return read(f);
        //   };
        // }
        // readBinary = function readBinary(f) {
        //   var data;
        //   if (typeof readbuffer === "function") {
        //     return new Uint8Array(readbuffer(f));
        //   }
        //   data = read(f, "binary");
        //   assert(_typeof(data) === "object");
        //   return data;
        // };
        // if (typeof scriptArgs != "undefined") {
        //   arguments_ = scriptArgs;
        // } else if (typeof arguments != "undefined") {
        //   arguments_ = arguments;
        // }
        // if (typeof quit === "function") {
        //   quit_ = function quit_(status) {
        //     quit(status);
        //   };
        // }
        // if (typeof print !== "undefined") {
        //   if (typeof console === "undefined") console = {};
        //   console.log = print;
        //   console.warn = console.error = typeof printErr !== "undefined" ? printErr : print;
        // }
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = self.location.href;
        } else if (document.currentScript) {
          scriptDirectory = document.currentScript.src;
        }

        if (_scriptDir) {
          scriptDirectory = _scriptDir;
        }

        if (scriptDirectory.indexOf("blob:") !== 0) {
          scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
        } else {
          scriptDirectory = "";
        }

        {
          read_ = function shell_read(url) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText;
          };

          if (ENVIRONMENT_IS_WORKER) {
            readBinary = function readBinary(url) {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.responseType = "arraybuffer";
              xhr.send(null);
              return new Uint8Array(xhr.response);
            };
          }
        }
      }

      var out = Module["print"] || console.log;
      var err = Module["printErr"] || console.warn;

      for (key in moduleOverrides) {
        if (moduleOverrides.hasOwnProperty(key)) {
          Module[key] = moduleOverrides[key];
        }
      }

      moduleOverrides = null;
      if (Module["arguments"]) arguments_ = Module["arguments"];
      if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
      if (Module["quit"]) quit_ = Module["quit"];
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

      function atob(input) {
        var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=

        if (str.length % 4 === 1) {
          throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }

        for ( // initialize result and counters
        var bc = 0, bs, buffer, idx = 0, output = ''; // get next character
        buffer = str.charAt(idx++); // eslint-disable-line no-cond-assign
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
          // try to find character in table (0-63, not found => -1)
          buffer = chars.indexOf(buffer);
        }

        return output;
      }

      function base64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        var rawData = atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
      }

      var wasmBinary = base64ToUint8Array(__code);
      if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
      var noExitRuntime;
      if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];

      if ((typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) !== "object") {
        abort("no native wasm support detected");
      }

      var wasmMemory;
      var wasmTable = new WebAssembly.Table({
        "initial": 231,
        "maximum": 231 + 0,
        "element": "anyfunc"
      });
      var ABORT = false;

      function assert(condition, text) {
        if (!condition) {
          abort("Assertion failed: " + text);
        }
      }

      var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

      function UTF8ArrayToString(heap, idx, maxBytesToRead) {
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;

        while (heap[endPtr] && !(endPtr >= endIdx)) {
          ++endPtr;
        }

        if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
          return UTF8Decoder.decode(heap.subarray(idx, endPtr));
        } else {
          var str = "";

          while (idx < endPtr) {
            var u0 = heap[idx++];

            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }

            var u1 = heap[idx++] & 63;

            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }

            var u2 = heap[idx++] & 63;

            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            } else {
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63;
            }

            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
        }

        return str;
      }

      function UTF8ToString(ptr, maxBytesToRead) {
        return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
      }

      function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
        if (!(maxBytesToWrite > 0)) return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;

        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);

          if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023;
          }

          if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u;
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63;
          } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
          } else {
            if (outIdx + 3 >= endIdx) break;
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
          }
        }

        heap[outIdx] = 0;
        return outIdx - startIdx;
      }

      function stringToUTF8(str, outPtr, maxBytesToWrite) {
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
      }

      function lengthBytesUTF8(str) {
        var len = 0;

        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
          if (u <= 127) ++len;else if (u <= 2047) len += 2;else if (u <= 65535) len += 3;else len += 4;
        }

        return len;
      }

      var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

      function UTF16ToString(ptr, maxBytesToRead) {
        var endPtr = ptr;
        var idx = endPtr >> 1;
        var maxIdx = idx + maxBytesToRead / 2;

        while (!(idx >= maxIdx) && HEAPU16[idx]) {
          ++idx;
        }

        endPtr = idx << 1;

        if (endPtr - ptr > 32 && UTF16Decoder) {
          return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
        } else {
          var i = 0;
          var str = "";

          while (1) {
            var codeUnit = HEAP16[ptr + i * 2 >> 1];
            if (codeUnit == 0 || i == maxBytesToRead / 2) return str;
            ++i;
            str += String.fromCharCode(codeUnit);
          }
        }
      }

      function stringToUTF16(str, outPtr, maxBytesToWrite) {
        if (maxBytesToWrite === undefined) {
          maxBytesToWrite = 2147483647;
        }

        if (maxBytesToWrite < 2) return 0;
        maxBytesToWrite -= 2;
        var startPtr = outPtr;
        var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;

        for (var i = 0; i < numCharsToWrite; ++i) {
          var codeUnit = str.charCodeAt(i);
          HEAP16[outPtr >> 1] = codeUnit;
          outPtr += 2;
        }

        HEAP16[outPtr >> 1] = 0;
        return outPtr - startPtr;
      }

      function lengthBytesUTF16(str) {
        return str.length * 2;
      }

      function UTF32ToString(ptr, maxBytesToRead) {
        var i = 0;
        var str = "";

        while (!(i >= maxBytesToRead / 4)) {
          var utf32 = HEAP32[ptr + i * 4 >> 2];
          if (utf32 == 0) break;
          ++i;

          if (utf32 >= 65536) {
            var ch = utf32 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          } else {
            str += String.fromCharCode(utf32);
          }
        }

        return str;
      }

      function stringToUTF32(str, outPtr, maxBytesToWrite) {
        if (maxBytesToWrite === undefined) {
          maxBytesToWrite = 2147483647;
        }

        if (maxBytesToWrite < 4) return 0;
        var startPtr = outPtr;
        var endPtr = startPtr + maxBytesToWrite - 4;

        for (var i = 0; i < str.length; ++i) {
          var codeUnit = str.charCodeAt(i);

          if (codeUnit >= 55296 && codeUnit <= 57343) {
            var trailSurrogate = str.charCodeAt(++i);
            codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
          }

          HEAP32[outPtr >> 2] = codeUnit;
          outPtr += 4;
          if (outPtr + 4 > endPtr) break;
        }

        HEAP32[outPtr >> 2] = 0;
        return outPtr - startPtr;
      }

      function lengthBytesUTF32(str) {
        var len = 0;

        for (var i = 0; i < str.length; ++i) {
          var codeUnit = str.charCodeAt(i);
          if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
          len += 4;
        }

        return len;
      }

      var WASM_PAGE_SIZE = 65536;

      function alignUp(x, multiple) {
        if (x % multiple > 0) {
          x += multiple - x % multiple;
        }

        return x;
      }

      var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

      function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        Module["HEAP8"] = HEAP8 = new Int8Array(buf);
        Module["HEAP16"] = HEAP16 = new Int16Array(buf);
        Module["HEAP32"] = HEAP32 = new Int32Array(buf);
        Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
        Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
        Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
        Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
        Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
      }

      var DYNAMIC_BASE = 5254160,
          DYNAMICTOP_PTR = 11120;
      var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;

      if (Module["wasmMemory"]) {
        wasmMemory = Module["wasmMemory"];
      } else {
        wasmMemory = new WebAssembly.Memory({
          "initial": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
          "maximum": 2147483648 / WASM_PAGE_SIZE
        });
      }

      if (wasmMemory) {
        buffer = wasmMemory.buffer;
      }

      INITIAL_INITIAL_MEMORY = buffer.byteLength;
      updateGlobalBufferAndViews(buffer);
      HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;

      function callRuntimeCallbacks(callbacks) {
        while (callbacks.length > 0) {
          var callback = callbacks.shift();

          if (typeof callback == "function") {
            callback(Module);
            continue;
          }

          var func = callback.func;

          if (typeof func === "number") {
            if (callback.arg === undefined) {
              Module["dynCall_v"](func);
            } else {
              Module["dynCall_vi"](func, callback.arg);
            }
          } else {
            func(callback.arg === undefined ? null : callback.arg);
          }
        }
      }

      var __ATPRERUN__ = [];
      var __ATINIT__ = [];
      var __ATMAIN__ = [];
      var __ATPOSTRUN__ = [];

      function preRun() {
        if (Module["preRun"]) {
          if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];

          while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift());
          }
        }

        callRuntimeCallbacks(__ATPRERUN__);
      }

      function initRuntime() {
        callRuntimeCallbacks(__ATINIT__);
      }

      function preMain() {
        callRuntimeCallbacks(__ATMAIN__);
      }

      function postRun() {
        if (Module["postRun"]) {
          if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];

          while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift());
          }
        }

        callRuntimeCallbacks(__ATPOSTRUN__);
      }

      function addOnPreRun(cb) {
        __ATPRERUN__.unshift(cb);
      }

      function addOnPostRun(cb) {
        __ATPOSTRUN__.unshift(cb);
      }

      var runDependencies = 0;
      var dependenciesFulfilled = null;

      function addRunDependency(id) {
        runDependencies++;

        if (Module["monitorRunDependencies"]) {
          Module["monitorRunDependencies"](runDependencies);
        }
      }

      function removeRunDependency(id) {
        runDependencies--;

        if (Module["monitorRunDependencies"]) {
          Module["monitorRunDependencies"](runDependencies);
        }

        if (runDependencies == 0) {
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback();
          }
        }
      }

      Module["preloadedImages"] = {};
      Module["preloadedAudios"] = {};

      function abort(what) {
        if (Module["onAbort"]) {
          Module["onAbort"](what);
        }

        what += "";
        err(what);
        ABORT = true;
        what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
        var e = new WebAssembly.RuntimeError(what);
        readyPromiseReject(e);
        throw e;
      }

      function hasPrefix(str, prefix) {
        return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0;
      }

      var dataURIPrefix = "data:application/octet-stream;base64,";

      function isDataURI(filename) {
        return hasPrefix(filename, dataURIPrefix);
      }

      var fileURIPrefix = "file://";

      function isFileURI(filename) {
        return hasPrefix(filename, fileURIPrefix);
      }

      var wasmBinaryFile = "yoga.wasm";

      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile);
      }

      function getBinary() {
        try {
          if (wasmBinary) {
            return new Uint8Array(wasmBinary);
          }

          if (readBinary) {
            return readBinary(wasmBinaryFile);
          } else {
            throw "both async and sync fetching of the wasm failed";
          }
        } catch (err) {
          abort(err);
        }
      }

      function getBinaryPromise() {
        if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
          return fetch(wasmBinaryFile, {
            credentials: "same-origin"
          }).then(function (response) {
            if (!response["ok"]) {
              throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
            }

            return response["arrayBuffer"]();
          })["catch"](function () {
            return getBinary();
          });
        }

        return new Promise(function (resolve, reject) {
          resolve(getBinary());
        });
      }

      function createWasm() {
        var info = {
          "a": asmLibraryArg
        };

        function receiveInstance(instance, module) {
          var exports = instance.exports;
          Module["asm"] = exports;
          removeRunDependency();
        }

        addRunDependency();

        function receiveInstantiatedSource(output) {
          receiveInstance(output["instance"]);
        } // function instantiateArrayBuffer(receiver) {
        //   return getBinaryPromise().then(function (binary) {
        //     return WebAssembly.instantiate(binary, info);
        //   }).then(receiver, function (reason) {
        //     err("failed to asynchronously prepare wasm: " + reason);
        //     abort(reason);
        //   });
        // }


        function instantiateArrayBuffer(receiver) {
          return WebAssembly.instantiate(wasmBinary, info).then(receiver);
        }

        function instantiateAsync() {
          if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
            fetch(wasmBinaryFile, {
              credentials: "same-origin"
            }).then(function (response) {
              var result = WebAssembly.instantiateStreaming(response, info);
              return result.then(receiveInstantiatedSource, function (reason) {
                err("wasm streaming compile failed: " + reason);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(receiveInstantiatedSource);
              });
            });
          } else {
            return instantiateArrayBuffer(receiveInstantiatedSource);
          }
        }

        if (Module["instantiateWasm"]) {
          try {
            var exports = Module["instantiateWasm"](info, receiveInstance);
            return exports;
          } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false;
          }
        }

        instantiateAsync();
        return {};
      }

      function createWasmSync() {
        var info = {
          "a": asmLibraryArg
        };

        function receiveInstance(instance, module) {
          var exports = instance.exports;
          Module["asm"] = exports;
          removeRunDependency();
        }

        addRunDependency();

        function receiveInstantiatedSource(output) {
          receiveInstance(output);
        }

        function instantiateArrayBuffer() {
          return receiveInstantiatedSource(new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array(wasmBinary)), info));
        }

        function instantiateSync() {
          return instantiateArrayBuffer(receiveInstantiatedSource);
        }

        if (Module["instantiateWasm"]) {
          try {
            var exports = Module["instantiateWasm"](info, receiveInstance);
            return exports;
          } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false;
          }
        }

        return instantiateSync();
      }

      __ATINIT__.push({
        func: function func() {
          ___wasm_call_ctors();
        }
      });

      function __ZN8facebook4yoga24LayoutPassReasonToStringENS0_16LayoutPassReasonE() {
        err("missing function: _ZN8facebook4yoga24LayoutPassReasonToStringENS0_16LayoutPassReasonE");
        abort(-1);
      }

      function ___cxa_allocate_exception(size) {
        return _malloc(size);
      }

      function ___cxa_throw(ptr, type, destructor) {
        throw ptr;
      }

      var char_0 = 48;
      var char_9 = 57;

      function makeLegalFunctionName(name) {
        if (undefined === name) {
          return "_unknown";
        }

        name = name.replace(/[^a-zA-Z0-9_]/g, "$");
        var f = name.charCodeAt(0);

        if (f >= char_0 && f <= char_9) {
          return "_" + name;
        } else {
          return name;
        }
      }

      function createNamedFunction(name, body) {
        name = makeLegalFunctionName(name);
        return new Function("body", "return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body);
      }

      var emval_free_list = [];
      var emval_handle_array = [{}, {
        value: undefined
      }, {
        value: null
      }, {
        value: true
      }, {
        value: false
      }];

      function count_emval_handles() {
        var count = 0;

        for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== undefined) {
            ++count;
          }
        }

        return count;
      }

      function get_first_emval() {
        for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== undefined) {
            return emval_handle_array[i];
          }
        }

        return null;
      }

      function init_emval() {
        Module["count_emval_handles"] = count_emval_handles;
        Module["get_first_emval"] = get_first_emval;
      }

      function __emval_register(value) {
        switch (value) {
          case undefined:
            {
              return 1;
            }

          case null:
            {
              return 2;
            }

          case true:
            {
              return 3;
            }

          case false:
            {
              return 4;
            }

          default:
            {
              var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
              emval_handle_array[handle] = {
                refcount: 1,
                value: value
              };
              return handle;
            }
        }
      }

      function extendError(baseErrorType, errorName) {
        var errorClass = createNamedFunction(errorName, function (message) {
          this.name = errorName;
          this.message = message;
          var stack = new Error(message).stack;

          if (stack !== undefined) {
            this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
          }
        });
        errorClass.prototype = Object.create(baseErrorType.prototype);
        errorClass.prototype.constructor = errorClass;

        errorClass.prototype.toString = function () {
          if (this.message === undefined) {
            return this.name;
          } else {
            return this.name + ": " + this.message;
          }
        };

        return errorClass;
      }

      var PureVirtualError = undefined;

      function embind_init_charCodes() {
        var codes = new Array(256);

        for (var i = 0; i < 256; ++i) {
          codes[i] = String.fromCharCode(i);
        }

        embind_charCodes = codes;
      }

      var embind_charCodes = undefined;

      function readLatin1String(ptr) {
        var ret = "";
        var c = ptr;

        while (HEAPU8[c]) {
          ret += embind_charCodes[HEAPU8[c++]];
        }

        return ret;
      }

      function getInheritedInstanceCount() {
        return Object.keys(registeredInstances).length;
      }

      function getLiveInheritedInstances() {
        var rv = [];

        for (var k in registeredInstances) {
          if (registeredInstances.hasOwnProperty(k)) {
            rv.push(registeredInstances[k]);
          }
        }

        return rv;
      }

      var deletionQueue = [];

      function flushPendingDeletes() {
        while (deletionQueue.length) {
          var obj = deletionQueue.pop();
          obj.$$.deleteScheduled = false;
          obj["delete"]();
        }
      }

      var delayFunction = undefined;

      function setDelayFunction(fn) {
        delayFunction = fn;

        if (deletionQueue.length && delayFunction) {
          delayFunction(flushPendingDeletes);
        }
      }

      function init_embind() {
        Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
        Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
        Module["flushPendingDeletes"] = flushPendingDeletes;
        Module["setDelayFunction"] = setDelayFunction;
      }

      var registeredInstances = {};
      var BindingError = undefined;

      function throwBindingError(message) {
        throw new BindingError(message);
      }

      function getBasestPointer(class_, ptr) {
        if (ptr === undefined) {
          throwBindingError("ptr should not be undefined");
        }

        while (class_.baseClass) {
          ptr = class_.upcast(ptr);
          class_ = class_.baseClass;
        }

        return ptr;
      }

      function registerInheritedInstance(class_, ptr, instance) {
        ptr = getBasestPointer(class_, ptr);

        if (registeredInstances.hasOwnProperty(ptr)) {
          throwBindingError("Tried to register registered instance: " + ptr);
        } else {
          registeredInstances[ptr] = instance;
        }
      }

      function requireHandle(handle) {
        if (!handle) {
          throwBindingError("Cannot use deleted val. handle = " + handle);
        }

        return emval_handle_array[handle].value;
      }

      var registeredTypes = {};

      function getTypeName(type) {
        var ptr = ___getTypeName(type);

        var rv = readLatin1String(ptr);

        _free(ptr);

        return rv;
      }

      function requireRegisteredType(rawType, humanName) {
        var impl = registeredTypes[rawType];

        if (undefined === impl) {
          throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
        }

        return impl;
      }

      function unregisterInheritedInstance(class_, ptr) {
        ptr = getBasestPointer(class_, ptr);

        if (registeredInstances.hasOwnProperty(ptr)) {
          delete registeredInstances[ptr];
        } else {
          throwBindingError("Tried to unregister unregistered instance: " + ptr);
        }
      }

      function detachFinalizer(handle) {}

      var finalizationGroup = false;

      function runDestructor($$) {
        if ($$.smartPtr) {
          $$.smartPtrType.rawDestructor($$.smartPtr);
        } else {
          $$.ptrType.registeredClass.rawDestructor($$.ptr);
        }
      }

      function releaseClassHandle($$) {
        $$.count.value -= 1;
        var toDelete = 0 === $$.count.value;

        if (toDelete) {
          runDestructor($$);
        }
      }

      function attachFinalizer(handle) {
        if ("undefined" === typeof FinalizationGroup) {
          attachFinalizer = function attachFinalizer(handle) {
            return handle;
          };

          return handle;
        }

        finalizationGroup = new FinalizationGroup(function (iter) {
          for (var result = iter.next(); !result.done; result = iter.next()) {
            var $$ = result.value;

            if (!$$.ptr) {
              console.warn("object already deleted: " + $$.ptr);
            } else {
              releaseClassHandle($$);
            }
          }
        });

        attachFinalizer = function attachFinalizer(handle) {
          finalizationGroup.register(handle, handle.$$, handle.$$);
          return handle;
        };

        detachFinalizer = function detachFinalizer(handle) {
          finalizationGroup.unregister(handle.$$);
        };

        return attachFinalizer(handle);
      }

      function __embind_create_inheriting_constructor(constructorName, wrapperType, properties) {
        constructorName = readLatin1String(constructorName);
        wrapperType = requireRegisteredType(wrapperType, "wrapper");
        properties = requireHandle(properties);
        var arraySlice = [].slice;
        var registeredClass = wrapperType.registeredClass;
        var wrapperPrototype = registeredClass.instancePrototype;
        var baseClass = registeredClass.baseClass;
        var baseClassPrototype = baseClass.instancePrototype;
        var baseConstructor = registeredClass.baseClass.constructor;
        var ctor = createNamedFunction(constructorName, function () {
          registeredClass.baseClass.pureVirtualFunctions.forEach(function (name) {
            if (this[name] === baseClassPrototype[name]) {
              throw new PureVirtualError("Pure virtual function " + name + " must be implemented in JavaScript");
            }
          }.bind(this));
          Object.defineProperty(this, "__parent", {
            value: wrapperPrototype
          });
          this["__construct"].apply(this, arraySlice.call(arguments));
        });

        wrapperPrototype["__construct"] = function __construct() {
          if (this === wrapperPrototype) {
            throwBindingError("Pass correct 'this' to __construct");
          }

          var inner = baseConstructor["implement"].apply(undefined, [this].concat(arraySlice.call(arguments)));
          detachFinalizer(inner);
          var $$ = inner.$$;
          inner["notifyOnDestruction"]();
          $$.preservePointerOnDelete = true;
          Object.defineProperties(this, {
            $$: {
              value: $$
            }
          });
          attachFinalizer(this);
          registerInheritedInstance(registeredClass, $$.ptr, this);
        };

        wrapperPrototype["__destruct"] = function __destruct() {
          if (this === wrapperPrototype) {
            throwBindingError("Pass correct 'this' to __destruct");
          }

          detachFinalizer(this);
          unregisterInheritedInstance(registeredClass, this.$$.ptr);
        };

        ctor.prototype = Object.create(wrapperPrototype);

        for (var p in properties) {
          ctor.prototype[p] = properties[p];
        }

        return __emval_register(ctor);
      }

      var structRegistrations = {};

      function runDestructors(destructors) {
        while (destructors.length) {
          var ptr = destructors.pop();
          var del = destructors.pop();
          del(ptr);
        }
      }

      function simpleReadValueFromPointer(pointer) {
        return this["fromWireType"](HEAPU32[pointer >> 2]);
      }

      var awaitingDependencies = {};
      var typeDependencies = {};
      var InternalError = undefined;

      function throwInternalError(message) {
        throw new InternalError(message);
      }

      function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
        myTypes.forEach(function (type) {
          typeDependencies[type] = dependentTypes;
        });

        function onComplete(typeConverters) {
          var myTypeConverters = getTypeConverters(typeConverters);

          if (myTypeConverters.length !== myTypes.length) {
            throwInternalError("Mismatched type converter count");
          }

          for (var i = 0; i < myTypes.length; ++i) {
            registerType(myTypes[i], myTypeConverters[i]);
          }
        }

        var typeConverters = new Array(dependentTypes.length);
        var unregisteredTypes = [];
        var registered = 0;
        dependentTypes.forEach(function (dt, i) {
          if (registeredTypes.hasOwnProperty(dt)) {
            typeConverters[i] = registeredTypes[dt];
          } else {
            unregisteredTypes.push(dt);

            if (!awaitingDependencies.hasOwnProperty(dt)) {
              awaitingDependencies[dt] = [];
            }

            awaitingDependencies[dt].push(function () {
              typeConverters[i] = registeredTypes[dt];
              ++registered;

              if (registered === unregisteredTypes.length) {
                onComplete(typeConverters);
              }
            });
          }
        });

        if (0 === unregisteredTypes.length) {
          onComplete(typeConverters);
        }
      }

      function __embind_finalize_value_object(structType) {
        var reg = structRegistrations[structType];
        delete structRegistrations[structType];
        var rawConstructor = reg.rawConstructor;
        var rawDestructor = reg.rawDestructor;
        var fieldRecords = reg.fields;
        var fieldTypes = fieldRecords.map(function (field) {
          return field.getterReturnType;
        }).concat(fieldRecords.map(function (field) {
          return field.setterArgumentType;
        }));
        whenDependentTypesAreResolved([structType], fieldTypes, function (fieldTypes) {
          var fields = {};
          fieldRecords.forEach(function (field, i) {
            var fieldName = field.fieldName;
            var getterReturnType = fieldTypes[i];
            var getter = field.getter;
            var getterContext = field.getterContext;
            var setterArgumentType = fieldTypes[i + fieldRecords.length];
            var setter = field.setter;
            var setterContext = field.setterContext;
            fields[fieldName] = {
              read: function read(ptr) {
                return getterReturnType["fromWireType"](getter(getterContext, ptr));
              },
              write: function write(ptr, o) {
                var destructors = [];
                setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
                runDestructors(destructors);
              }
            };
          });
          return [{
            name: reg.name,
            "fromWireType": function fromWireType(ptr) {
              var rv = {};

              for (var i in fields) {
                rv[i] = fields[i].read(ptr);
              }

              rawDestructor(ptr);
              return rv;
            },
            "toWireType": function toWireType(destructors, o) {
              for (var fieldName in fields) {
                if (!(fieldName in o)) {
                  throw new TypeError('Missing field:  "' + fieldName + '"');
                }
              }

              var ptr = rawConstructor();

              for (fieldName in fields) {
                fields[fieldName].write(ptr, o[fieldName]);
              }

              if (destructors !== null) {
                destructors.push(rawDestructor, ptr);
              }

              return ptr;
            },
            "argPackAdvance": 8,
            "readValueFromPointer": simpleReadValueFromPointer,
            destructorFunction: rawDestructor
          }];
        });
      }

      function getShiftFromSize(size) {
        switch (size) {
          case 1:
            return 0;

          case 2:
            return 1;

          case 4:
            return 2;

          case 8:
            return 3;

          default:
            throw new TypeError("Unknown type size: " + size);
        }
      }

      function registerType(rawType, registeredInstance, options) {
        options = options || {};

        if (!("argPackAdvance" in registeredInstance)) {
          throw new TypeError("registerType registeredInstance requires argPackAdvance");
        }

        var name = registeredInstance.name;

        if (!rawType) {
          throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
        }

        if (registeredTypes.hasOwnProperty(rawType)) {
          if (options.ignoreDuplicateRegistrations) {
            return;
          } else {
            throwBindingError("Cannot register type '" + name + "' twice");
          }
        }

        registeredTypes[rawType] = registeredInstance;
        delete typeDependencies[rawType];

        if (awaitingDependencies.hasOwnProperty(rawType)) {
          var callbacks = awaitingDependencies[rawType];
          delete awaitingDependencies[rawType];
          callbacks.forEach(function (cb) {
            cb();
          });
        }
      }

      function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
        var shift = getShiftFromSize(size);
        name = readLatin1String(name);
        registerType(rawType, {
          name: name,
          "fromWireType": function fromWireType(wt) {
            return !!wt;
          },
          "toWireType": function toWireType(destructors, o) {
            return o ? trueValue : falseValue;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": function readValueFromPointer(pointer) {
            var heap;

            if (size === 1) {
              heap = HEAP8;
            } else if (size === 2) {
              heap = HEAP16;
            } else if (size === 4) {
              heap = HEAP32;
            } else {
              throw new TypeError("Unknown boolean type size: " + name);
            }

            return this["fromWireType"](heap[pointer >> shift]);
          },
          destructorFunction: null
        });
      }

      function ClassHandle_isAliasOf(other) {
        if (!(this instanceof ClassHandle)) {
          return false;
        }

        if (!(other instanceof ClassHandle)) {
          return false;
        }

        var leftClass = this.$$.ptrType.registeredClass;
        var left = this.$$.ptr;
        var rightClass = other.$$.ptrType.registeredClass;
        var right = other.$$.ptr;

        while (leftClass.baseClass) {
          left = leftClass.upcast(left);
          leftClass = leftClass.baseClass;
        }

        while (rightClass.baseClass) {
          right = rightClass.upcast(right);
          rightClass = rightClass.baseClass;
        }

        return leftClass === rightClass && left === right;
      }

      function shallowCopyInternalPointer(o) {
        return {
          count: o.count,
          deleteScheduled: o.deleteScheduled,
          preservePointerOnDelete: o.preservePointerOnDelete,
          ptr: o.ptr,
          ptrType: o.ptrType,
          smartPtr: o.smartPtr,
          smartPtrType: o.smartPtrType
        };
      }

      function throwInstanceAlreadyDeleted(obj) {
        function getInstanceTypeName(handle) {
          return handle.$$.ptrType.registeredClass.name;
        }

        throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
      }

      function ClassHandle_clone() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }

        if (this.$$.preservePointerOnDelete) {
          this.$$.count.value += 1;
          return this;
        } else {
          var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
            $$: {
              value: shallowCopyInternalPointer(this.$$)
            }
          }));
          clone.$$.count.value += 1;
          clone.$$.deleteScheduled = false;
          return clone;
        }
      }

      function ClassHandle_delete() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }

        if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError("Object already scheduled for deletion");
        }

        detachFinalizer(this);
        releaseClassHandle(this.$$);

        if (!this.$$.preservePointerOnDelete) {
          this.$$.smartPtr = undefined;
          this.$$.ptr = undefined;
        }
      }

      function ClassHandle_isDeleted() {
        return !this.$$.ptr;
      }

      function ClassHandle_deleteLater() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }

        if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError("Object already scheduled for deletion");
        }

        deletionQueue.push(this);

        if (deletionQueue.length === 1 && delayFunction) {
          delayFunction(flushPendingDeletes);
        }

        this.$$.deleteScheduled = true;
        return this;
      }

      function init_ClassHandle() {
        ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
        ClassHandle.prototype["clone"] = ClassHandle_clone;
        ClassHandle.prototype["delete"] = ClassHandle_delete;
        ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
        ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
      }

      function ClassHandle() {}

      var registeredPointers = {};

      function ensureOverloadTable(proto, methodName, humanName) {
        if (undefined === proto[methodName].overloadTable) {
          var prevFunc = proto[methodName];

          proto[methodName] = function () {
            if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
              throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
            }

            return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
          };

          proto[methodName].overloadTable = [];
          proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
        }
      }

      function exposePublicSymbol(name, value, numArguments) {
        if (Module.hasOwnProperty(name)) {
          if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) {
            throwBindingError("Cannot register public name '" + name + "' twice");
          }

          ensureOverloadTable(Module, name, name);

          if (Module.hasOwnProperty(numArguments)) {
            throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
          }

          Module[name].overloadTable[numArguments] = value;
        } else {
          Module[name] = value;

          if (undefined !== numArguments) {
            Module[name].numArguments = numArguments;
          }
        }
      }

      function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
        this.name = name;
        this.constructor = constructor;
        this.instancePrototype = instancePrototype;
        this.rawDestructor = rawDestructor;
        this.baseClass = baseClass;
        this.getActualType = getActualType;
        this.upcast = upcast;
        this.downcast = downcast;
        this.pureVirtualFunctions = [];
      }

      function upcastPointer(ptr, ptrClass, desiredClass) {
        while (ptrClass !== desiredClass) {
          if (!ptrClass.upcast) {
            throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
          }

          ptr = ptrClass.upcast(ptr);
          ptrClass = ptrClass.baseClass;
        }

        return ptr;
      }

      function constNoSmartPtrRawPointerToWireType(destructors, handle) {
        if (handle === null) {
          if (this.isReference) {
            throwBindingError("null is not a valid " + this.name);
          }

          return 0;
        }

        if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
        }

        if (!handle.$$.ptr) {
          throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
        }

        var handleClass = handle.$$.ptrType.registeredClass;
        var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        return ptr;
      }

      function genericPointerToWireType(destructors, handle) {
        var ptr;

        if (handle === null) {
          if (this.isReference) {
            throwBindingError("null is not a valid " + this.name);
          }

          if (this.isSmartPointer) {
            ptr = this.rawConstructor();

            if (destructors !== null) {
              destructors.push(this.rawDestructor, ptr);
            }

            return ptr;
          } else {
            return 0;
          }
        }

        if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
        }

        if (!handle.$$.ptr) {
          throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
        }

        if (!this.isConst && handle.$$.ptrType.isConst) {
          throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
        }

        var handleClass = handle.$$.ptrType.registeredClass;
        ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);

        if (this.isSmartPointer) {
          if (undefined === handle.$$.smartPtr) {
            throwBindingError("Passing raw pointer to smart pointer is illegal");
          }

          switch (this.sharingPolicy) {
            case 0:
              if (handle.$$.smartPtrType === this) {
                ptr = handle.$$.smartPtr;
              } else {
                throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
              }

              break;

            case 1:
              ptr = handle.$$.smartPtr;
              break;

            case 2:
              if (handle.$$.smartPtrType === this) {
                ptr = handle.$$.smartPtr;
              } else {
                var clonedHandle = handle["clone"]();
                ptr = this.rawShare(ptr, __emval_register(function () {
                  clonedHandle["delete"]();
                }));

                if (destructors !== null) {
                  destructors.push(this.rawDestructor, ptr);
                }
              }

              break;

            default:
              throwBindingError("Unsupporting sharing policy");
          }
        }

        return ptr;
      }

      function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
        if (handle === null) {
          if (this.isReference) {
            throwBindingError("null is not a valid " + this.name);
          }

          return 0;
        }

        if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
        }

        if (!handle.$$.ptr) {
          throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
        }

        if (handle.$$.ptrType.isConst) {
          throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name);
        }

        var handleClass = handle.$$.ptrType.registeredClass;
        var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        return ptr;
      }

      function RegisteredPointer_getPointee(ptr) {
        if (this.rawGetPointee) {
          ptr = this.rawGetPointee(ptr);
        }

        return ptr;
      }

      function RegisteredPointer_destructor(ptr) {
        if (this.rawDestructor) {
          this.rawDestructor(ptr);
        }
      }

      function RegisteredPointer_deleteObject(handle) {
        if (handle !== null) {
          handle["delete"]();
        }
      }

      function downcastPointer(ptr, ptrClass, desiredClass) {
        if (ptrClass === desiredClass) {
          return ptr;
        }

        if (undefined === desiredClass.baseClass) {
          return null;
        }

        var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);

        if (rv === null) {
          return null;
        }

        return desiredClass.downcast(rv);
      }

      function getInheritedInstance(class_, ptr) {
        ptr = getBasestPointer(class_, ptr);
        return registeredInstances[ptr];
      }

      function makeClassHandle(prototype, record) {
        if (!record.ptrType || !record.ptr) {
          throwInternalError("makeClassHandle requires ptr and ptrType");
        }

        var hasSmartPtrType = !!record.smartPtrType;
        var hasSmartPtr = !!record.smartPtr;

        if (hasSmartPtrType !== hasSmartPtr) {
          throwInternalError("Both smartPtrType and smartPtr must be specified");
        }

        record.count = {
          value: 1
        };
        return attachFinalizer(Object.create(prototype, {
          $$: {
            value: record
          }
        }));
      }

      function RegisteredPointer_fromWireType(ptr) {
        var rawPointer = this.getPointee(ptr);

        if (!rawPointer) {
          this.destructor(ptr);
          return null;
        }

        var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);

        if (undefined !== registeredInstance) {
          if (0 === registeredInstance.$$.count.value) {
            registeredInstance.$$.ptr = rawPointer;
            registeredInstance.$$.smartPtr = ptr;
            return registeredInstance["clone"]();
          } else {
            var rv = registeredInstance["clone"]();
            this.destructor(ptr);
            return rv;
          }
        }

        function makeDefaultHandle() {
          if (this.isSmartPointer) {
            return makeClassHandle(this.registeredClass.instancePrototype, {
              ptrType: this.pointeeType,
              ptr: rawPointer,
              smartPtrType: this,
              smartPtr: ptr
            });
          } else {
            return makeClassHandle(this.registeredClass.instancePrototype, {
              ptrType: this,
              ptr: ptr
            });
          }
        }

        var actualType = this.registeredClass.getActualType(rawPointer);
        var registeredPointerRecord = registeredPointers[actualType];

        if (!registeredPointerRecord) {
          return makeDefaultHandle.call(this);
        }

        var toType;

        if (this.isConst) {
          toType = registeredPointerRecord.constPointerType;
        } else {
          toType = registeredPointerRecord.pointerType;
        }

        var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);

        if (dp === null) {
          return makeDefaultHandle.call(this);
        }

        if (this.isSmartPointer) {
          return makeClassHandle(toType.registeredClass.instancePrototype, {
            ptrType: toType,
            ptr: dp,
            smartPtrType: this,
            smartPtr: ptr
          });
        } else {
          return makeClassHandle(toType.registeredClass.instancePrototype, {
            ptrType: toType,
            ptr: dp
          });
        }
      }

      function init_RegisteredPointer() {
        RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
        RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
        RegisteredPointer.prototype["argPackAdvance"] = 8;
        RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
        RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
        RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType;
      }

      function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
        this.name = name;
        this.registeredClass = registeredClass;
        this.isReference = isReference;
        this.isConst = isConst;
        this.isSmartPointer = isSmartPointer;
        this.pointeeType = pointeeType;
        this.sharingPolicy = sharingPolicy;
        this.rawGetPointee = rawGetPointee;
        this.rawConstructor = rawConstructor;
        this.rawShare = rawShare;
        this.rawDestructor = rawDestructor;

        if (!isSmartPointer && registeredClass.baseClass === undefined) {
          if (isConst) {
            this["toWireType"] = constNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null;
          } else {
            this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null;
          }
        } else {
          this["toWireType"] = genericPointerToWireType;
        }
      }

      function replacePublicSymbol(name, value, numArguments) {
        if (!Module.hasOwnProperty(name)) {
          throwInternalError("Replacing nonexistant public symbol");
        }

        if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
          Module[name].overloadTable[numArguments] = value;
        } else {
          Module[name] = value;
          Module[name].argCount = numArguments;
        }
      }

      function embind__requireFunction(signature, rawFunction) {
        signature = readLatin1String(signature);

        function makeDynCaller(dynCall) {
          var args = [];

          for (var i = 1; i < signature.length; ++i) {
            args.push("a" + i);
          }

          var name = "dynCall_" + signature + "_" + rawFunction;
          var body = "return function " + name + "(" + args.join(", ") + ") {\n";
          body += "    return dynCall(rawFunction" + (args.length ? ", " : "") + args.join(", ") + ");\n";
          body += "};\n";
          return new Function("dynCall", "rawFunction", body)(dynCall, rawFunction);
        }

        var dc = Module["dynCall_" + signature];
        var fp = makeDynCaller(dc);

        if (typeof fp !== "function") {
          throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
        }

        return fp;
      }

      var UnboundTypeError = undefined;

      function throwUnboundTypeError(message, types) {
        var unboundTypes = [];
        var seen = {};

        function visit(type) {
          if (seen[type]) {
            return;
          }

          if (registeredTypes[type]) {
            return;
          }

          if (typeDependencies[type]) {
            typeDependencies[type].forEach(visit);
            return;
          }

          unboundTypes.push(type);
          seen[type] = true;
        }

        types.forEach(visit);
        throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
      }

      function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
        name = readLatin1String(name);
        getActualType = embind__requireFunction(getActualTypeSignature, getActualType);

        if (upcast) {
          upcast = embind__requireFunction(upcastSignature, upcast);
        }

        if (downcast) {
          downcast = embind__requireFunction(downcastSignature, downcast);
        }

        rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
        var legalFunctionName = makeLegalFunctionName(name);
        exposePublicSymbol(legalFunctionName, function () {
          throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]);
        });
        whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function (base) {
          base = base[0];
          var baseClass;
          var basePrototype;

          if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype;
          } else {
            basePrototype = ClassHandle.prototype;
          }

          var constructor = createNamedFunction(legalFunctionName, function () {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
              throw new BindingError("Use 'new' to construct " + name);
            }

            if (undefined === registeredClass.constructor_body) {
              throw new BindingError(name + " has no accessible constructor");
            }

            var body = registeredClass.constructor_body[arguments.length];

            if (undefined === body) {
              throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
            }

            return body.apply(this, arguments);
          });
          var instancePrototype = Object.create(basePrototype, {
            constructor: {
              value: constructor
            }
          });
          constructor.prototype = instancePrototype;
          var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
          var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
          var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
          var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
          registeredPointers[rawType] = {
            pointerType: pointerConverter,
            constPointerType: constPointerConverter
          };
          replacePublicSymbol(legalFunctionName, constructor);
          return [referenceConverter, pointerConverter, constPointerConverter];
        });
      }

      function new_(constructor, argumentList) {
        if (!(constructor instanceof Function)) {
          throw new TypeError("new_ called with constructor type " + _typeof(constructor) + " which is not a function");
        }

        var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function () {});
        dummy.prototype = constructor.prototype;
        var obj = new dummy();
        var r = constructor.apply(obj, argumentList); // return r instanceof Object ? r : obj;

        return Object.prototype.toString.call(r).slice(8, -1) === "Function" ? r : obj;
      }

      function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
        var argCount = argTypes.length;

        if (argCount < 2) {
          throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
        }

        var isClassMethodFunc = argTypes[1] !== null && classType !== null;
        var needsDestructorStack = false;

        for (var i = 1; i < argTypes.length; ++i) {
          if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
            needsDestructorStack = true;
            break;
          }
        }

        var returns = argTypes[0].name !== "void";
        var argsList = "";
        var argsListWired = "";

        for (var i = 0; i < argCount - 2; ++i) {
          argsList += (i !== 0 ? ", " : "") + "arg" + i;
          argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
        }

        var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\n" + "if (arguments.length !== " + (argCount - 2) + ") {\n" + "throwBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n" + "}\n";

        if (needsDestructorStack) {
          invokerFnBody += "var destructors = [];\n";
        }

        var dtorStack = needsDestructorStack ? "destructors" : "null";
        var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
        var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];

        if (isClassMethodFunc) {
          invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
        }

        for (var i = 0; i < argCount - 2; ++i) {
          invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
          args1.push("argType" + i);
          args2.push(argTypes[i + 2]);
        }

        if (isClassMethodFunc) {
          argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
        }

        invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";

        if (needsDestructorStack) {
          invokerFnBody += "runDestructors(destructors);\n";
        } else {
          for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
            var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";

            if (argTypes[i].destructorFunction !== null) {
              invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
              args1.push(paramName + "_dtor");
              args2.push(argTypes[i].destructorFunction);
            }
          }
        }

        if (returns) {
          invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n";
        }

        invokerFnBody += "}\n";
        args1.push(invokerFnBody);
        var invokerFunction = new_(Function, args1).apply(window, args2);
        return invokerFunction;
      }

      function heap32VectorToArray(count, firstElement) {
        var array = [];

        for (var i = 0; i < count; i++) {
          array.push(HEAP32[(firstElement >> 2) + i]);
        }

        return array;
      }

      function __embind_register_class_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, fn) {
        var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        methodName = readLatin1String(methodName);
        rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
        whenDependentTypesAreResolved([], [rawClassType], function (classType) {
          classType = classType[0];
          var humanName = classType.name + "." + methodName;

          function unboundTypesHandler() {
            throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
          }

          var proto = classType.registeredClass.constructor;

          if (undefined === proto[methodName]) {
            unboundTypesHandler.argCount = argCount - 1;
            proto[methodName] = unboundTypesHandler;
          } else {
            ensureOverloadTable(proto, methodName, humanName);
            proto[methodName].overloadTable[argCount - 1] = unboundTypesHandler;
          }

          whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
            var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
            var func = craftInvokerFunction(humanName, invokerArgsArray, null, rawInvoker, fn);

            if (undefined === proto[methodName].overloadTable) {
              func.argCount = argCount - 1;
              proto[methodName] = func;
            } else {
              proto[methodName].overloadTable[argCount - 1] = func;
            }

            return [];
          });
          return [];
        });
      }

      function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
        assert(argCount > 0);
        var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        invoker = embind__requireFunction(invokerSignature, invoker);
        var args = [rawConstructor];
        var destructors = [];
        whenDependentTypesAreResolved([], [rawClassType], function (classType) {
          classType = classType[0];
          var humanName = "constructor " + classType.name;

          if (undefined === classType.registeredClass.constructor_body) {
            classType.registeredClass.constructor_body = [];
          }

          if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
            throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
          }

          classType.registeredClass.constructor_body[argCount - 1] = function unboundTypeHandler() {
            throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes);
          };

          whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
            classType.registeredClass.constructor_body[argCount - 1] = function constructor_body() {
              if (arguments.length !== argCount - 1) {
                throwBindingError(humanName + " called with " + arguments.length + " arguments, expected " + (argCount - 1));
              }

              destructors.length = 0;
              args.length = argCount;

              for (var i = 1; i < argCount; ++i) {
                args[i] = argTypes[i]["toWireType"](destructors, arguments[i - 1]);
              }

              var ptr = invoker.apply(null, args);
              runDestructors(destructors);
              return argTypes[0]["fromWireType"](ptr);
            };

            return [];
          });
          return [];
        });
      }

      function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
        var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        methodName = readLatin1String(methodName);
        rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
        whenDependentTypesAreResolved([], [rawClassType], function (classType) {
          classType = classType[0];
          var humanName = classType.name + "." + methodName;

          if (isPureVirtual) {
            classType.registeredClass.pureVirtualFunctions.push(methodName);
          }

          function unboundTypesHandler() {
            throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
          }

          var proto = classType.registeredClass.instancePrototype;
          var method = proto[methodName];

          if (undefined === method || undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
            unboundTypesHandler.argCount = argCount - 2;
            unboundTypesHandler.className = classType.name;
            proto[methodName] = unboundTypesHandler;
          } else {
            ensureOverloadTable(proto, methodName, humanName);
            proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
          }

          whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
            var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);

            if (undefined === proto[methodName].overloadTable) {
              memberFunction.argCount = argCount - 2;
              proto[methodName] = memberFunction;
            } else {
              proto[methodName].overloadTable[argCount - 2] = memberFunction;
            }

            return [];
          });
          return [];
        });
      }

      function __emval_decref(handle) {
        if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
          emval_handle_array[handle] = undefined;
          emval_free_list.push(handle);
        }
      }

      function __embind_register_emval(rawType, name) {
        name = readLatin1String(name);
        registerType(rawType, {
          name: name,
          "fromWireType": function fromWireType(handle) {
            var rv = emval_handle_array[handle].value;

            __emval_decref(handle);

            return rv;
          },
          "toWireType": function toWireType(destructors, value) {
            return __emval_register(value);
          },
          "argPackAdvance": 8,
          "readValueFromPointer": simpleReadValueFromPointer,
          destructorFunction: null
        });
      }

      function _embind_repr(v) {
        if (v === null) {
          return "null";
        }

        var t = _typeof(v);

        if (t === "object" || t === "array" || t === "function") {
          return v.toString();
        } else {
          return "" + v;
        }
      }

      function floatReadValueFromPointer(name, shift) {
        switch (shift) {
          case 2:
            return function (pointer) {
              return this["fromWireType"](HEAPF32[pointer >> 2]);
            };

          case 3:
            return function (pointer) {
              return this["fromWireType"](HEAPF64[pointer >> 3]);
            };

          default:
            throw new TypeError("Unknown float type: " + name);
        }
      }

      function __embind_register_float(rawType, name, size) {
        var shift = getShiftFromSize(size);
        name = readLatin1String(name);
        registerType(rawType, {
          name: name,
          "fromWireType": function fromWireType(value) {
            return value;
          },
          "toWireType": function toWireType(destructors, value) {
            if (typeof value !== "number" && typeof value !== "boolean") {
              throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
            }

            return value;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": floatReadValueFromPointer(name, shift),
          destructorFunction: null
        });
      }

      function integerReadValueFromPointer(name, shift, signed) {
        switch (shift) {
          case 0:
            return signed ? function readS8FromPointer(pointer) {
              return HEAP8[pointer];
            } : function readU8FromPointer(pointer) {
              return HEAPU8[pointer];
            };

          case 1:
            return signed ? function readS16FromPointer(pointer) {
              return HEAP16[pointer >> 1];
            } : function readU16FromPointer(pointer) {
              return HEAPU16[pointer >> 1];
            };

          case 2:
            return signed ? function readS32FromPointer(pointer) {
              return HEAP32[pointer >> 2];
            } : function readU32FromPointer(pointer) {
              return HEAPU32[pointer >> 2];
            };

          default:
            throw new TypeError("Unknown integer type: " + name);
        }
      }

      function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
        name = readLatin1String(name);

        if (maxRange === -1) {
          maxRange = 4294967295;
        }

        var shift = getShiftFromSize(size);

        var fromWireType = function fromWireType(value) {
          return value;
        };

        if (minRange === 0) {
          var bitshift = 32 - 8 * size;

          fromWireType = function fromWireType(value) {
            return value << bitshift >>> bitshift;
          };
        }

        var isUnsignedType = name.indexOf("unsigned") != -1;
        registerType(primitiveType, {
          name: name,
          "fromWireType": fromWireType,
          "toWireType": function toWireType(destructors, value) {
            if (typeof value !== "number" && typeof value !== "boolean") {
              throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
            }

            if (value < minRange || value > maxRange) {
              throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!");
            }

            return isUnsignedType ? value >>> 0 : value | 0;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
          destructorFunction: null
        });
      }

      function __embind_register_memory_view(rawType, dataTypeIndex, name) {
        var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
        var TA = typeMapping[dataTypeIndex];

        function decodeMemoryView(handle) {
          handle = handle >> 2;
          var heap = HEAPU32;
          var size = heap[handle];
          var data = heap[handle + 1];
          return new TA(buffer, data, size);
        }

        name = readLatin1String(name);
        registerType(rawType, {
          name: name,
          "fromWireType": decodeMemoryView,
          "argPackAdvance": 8,
          "readValueFromPointer": decodeMemoryView
        }, {
          ignoreDuplicateRegistrations: true
        });
      }

      function __embind_register_std_string(rawType, name) {
        name = readLatin1String(name);
        var stdStringIsUTF8 = name === "std::string";
        registerType(rawType, {
          name: name,
          "fromWireType": function fromWireType(value) {
            var length = HEAPU32[value >> 2];
            var str;

            if (stdStringIsUTF8) {
              var decodeStartPtr = value + 4;

              for (var i = 0; i <= length; ++i) {
                var currentBytePtr = value + 4 + i;

                if (i == length || HEAPU8[currentBytePtr] == 0) {
                  var maxRead = currentBytePtr - decodeStartPtr;
                  var stringSegment = UTF8ToString(decodeStartPtr, maxRead);

                  if (str === undefined) {
                    str = stringSegment;
                  } else {
                    str += String.fromCharCode(0);
                    str += stringSegment;
                  }

                  decodeStartPtr = currentBytePtr + 1;
                }
              }
            } else {
              var a = new Array(length);

              for (var i = 0; i < length; ++i) {
                a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
              }

              str = a.join("");
            }

            _free(value);

            return str;
          },
          "toWireType": function toWireType(destructors, value) {
            if (value instanceof ArrayBuffer) {
              value = new Uint8Array(value);
            }

            var getLength;
            var valueIsOfTypeString = typeof value === "string";

            if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
              throwBindingError("Cannot pass non-string to std::string");
            }

            if (stdStringIsUTF8 && valueIsOfTypeString) {
              getLength = function getLength() {
                return lengthBytesUTF8(value);
              };
            } else {
              getLength = function getLength() {
                return value.length;
              };
            }

            var length = getLength();

            var ptr = _malloc(4 + length + 1);

            HEAPU32[ptr >> 2] = length;

            if (stdStringIsUTF8 && valueIsOfTypeString) {
              stringToUTF8(value, ptr + 4, length + 1);
            } else {
              if (valueIsOfTypeString) {
                for (var i = 0; i < length; ++i) {
                  var charCode = value.charCodeAt(i);

                  if (charCode > 255) {
                    _free(ptr);

                    throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                  }

                  HEAPU8[ptr + 4 + i] = charCode;
                }
              } else {
                for (var i = 0; i < length; ++i) {
                  HEAPU8[ptr + 4 + i] = value[i];
                }
              }
            }

            if (destructors !== null) {
              destructors.push(_free, ptr);
            }

            return ptr;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": simpleReadValueFromPointer,
          destructorFunction: function destructorFunction(ptr) {
            _free(ptr);
          }
        });
      }

      function __embind_register_std_wstring(rawType, charSize, name) {
        name = readLatin1String(name);
        var decodeString, encodeString, getHeap, lengthBytesUTF, shift;

        if (charSize === 2) {
          decodeString = UTF16ToString;
          encodeString = stringToUTF16;
          lengthBytesUTF = lengthBytesUTF16;

          getHeap = function getHeap() {
            return HEAPU16;
          };

          shift = 1;
        } else if (charSize === 4) {
          decodeString = UTF32ToString;
          encodeString = stringToUTF32;
          lengthBytesUTF = lengthBytesUTF32;

          getHeap = function getHeap() {
            return HEAPU32;
          };

          shift = 2;
        }

        registerType(rawType, {
          name: name,
          "fromWireType": function fromWireType(value) {
            var length = HEAPU32[value >> 2];
            var HEAP = getHeap();
            var str;
            var decodeStartPtr = value + 4;

            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = value + 4 + i * charSize;

              if (i == length || HEAP[currentBytePtr >> shift] == 0) {
                var maxReadBytes = currentBytePtr - decodeStartPtr;
                var stringSegment = decodeString(decodeStartPtr, maxReadBytes);

                if (str === undefined) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }

                decodeStartPtr = currentBytePtr + charSize;
              }
            }

            _free(value);

            return str;
          },
          "toWireType": function toWireType(destructors, value) {
            if (!(typeof value === "string")) {
              throwBindingError("Cannot pass non-string to C++ string type " + name);
            }

            var length = lengthBytesUTF(value);

            var ptr = _malloc(4 + length + charSize);

            HEAPU32[ptr >> 2] = length >> shift;
            encodeString(value, ptr + 4, length + charSize);

            if (destructors !== null) {
              destructors.push(_free, ptr);
            }

            return ptr;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": simpleReadValueFromPointer,
          destructorFunction: function destructorFunction(ptr) {
            _free(ptr);
          }
        });
      }

      function __embind_register_value_object(rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) {
        structRegistrations[rawType] = {
          name: readLatin1String(name),
          rawConstructor: embind__requireFunction(constructorSignature, rawConstructor),
          rawDestructor: embind__requireFunction(destructorSignature, rawDestructor),
          fields: []
        };
      }

      function __embind_register_value_object_field(structType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
        structRegistrations[structType].fields.push({
          fieldName: readLatin1String(fieldName),
          getterReturnType: getterReturnType,
          getter: embind__requireFunction(getterSignature, getter),
          getterContext: getterContext,
          setterArgumentType: setterArgumentType,
          setter: embind__requireFunction(setterSignature, setter),
          setterContext: setterContext
        });
      }

      function __embind_register_void(rawType, name) {
        name = readLatin1String(name);
        registerType(rawType, {
          isVoid: true,
          name: name,
          "argPackAdvance": 0,
          "fromWireType": function fromWireType() {
            return undefined;
          },
          "toWireType": function toWireType(destructors, o) {
            return undefined;
          }
        });
      }

      function __emval_allocateDestructors(destructorsRef) {
        var destructors = [];
        HEAP32[destructorsRef >> 2] = __emval_register(destructors);
        return destructors;
      }

      var emval_symbols = {};

      function getStringOrSymbol(address) {
        var symbol = emval_symbols[address];

        if (symbol === undefined) {
          return readLatin1String(address);
        } else {
          return symbol;
        }
      }

      var emval_methodCallers = [];

      function __emval_call_method(caller, handle, methodName, destructorsRef, args) {
        caller = emval_methodCallers[caller];
        handle = requireHandle(handle);
        methodName = getStringOrSymbol(methodName);
        return caller(handle, methodName, __emval_allocateDestructors(destructorsRef), args);
      }

      function __emval_call_void_method(caller, handle, methodName, args) {
        caller = emval_methodCallers[caller];
        handle = requireHandle(handle);
        methodName = getStringOrSymbol(methodName);
        caller(handle, methodName, null, args);
      }

      function __emval_addMethodCaller(caller) {
        var id = emval_methodCallers.length;
        emval_methodCallers.push(caller);
        return id;
      }

      function __emval_lookupTypes(argCount, argTypes) {
        var a = new Array(argCount);

        for (var i = 0; i < argCount; ++i) {
          a[i] = requireRegisteredType(HEAP32[(argTypes >> 2) + i], "parameter " + i);
        }

        return a;
      }

      function __emval_get_method_caller(argCount, argTypes) {
        var types = __emval_lookupTypes(argCount, argTypes);

        var retType = types[0];
        var signatureName = retType.name + "_$" + types.slice(1).map(function (t) {
          return t.name;
        }).join("_") + "$";
        var params = ["retType"];
        var args = [retType];
        var argsList = "";

        for (var i = 0; i < argCount - 1; ++i) {
          argsList += (i !== 0 ? ", " : "") + "arg" + i;
          params.push("argType" + i);
          args.push(types[1 + i]);
        }

        var functionName = makeLegalFunctionName("methodCaller_" + signatureName);
        var functionBody = "return function " + functionName + "(handle, name, destructors, args) {\n";
        var offset = 0;

        for (var i = 0; i < argCount - 1; ++i) {
          functionBody += "    var arg" + i + " = argType" + i + ".readValueFromPointer(args" + (offset ? "+" + offset : "") + ");\n";
          offset += types[i + 1]["argPackAdvance"];
        }

        functionBody += "    var rv = handle[name](" + argsList + ");\n";

        for (var i = 0; i < argCount - 1; ++i) {
          if (types[i + 1]["deleteObject"]) {
            functionBody += "    argType" + i + ".deleteObject(arg" + i + ");\n";
          }
        }

        if (!retType.isVoid) {
          functionBody += "    return retType.toWireType(destructors, rv);\n";
        }

        functionBody += "};\n";
        params.push(functionBody);
        var invokerFunction = new_(Function, params).apply(null, args);
        return __emval_addMethodCaller(invokerFunction);
      }

      function __emval_incref(handle) {
        if (handle > 4) {
          emval_handle_array[handle].refcount += 1;
        }
      }

      function __emval_run_destructors(handle) {
        var destructors = emval_handle_array[handle].value;
        runDestructors(destructors);

        __emval_decref(handle);
      }

      function _abort() {
        abort();
      }

      function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8.copyWithin(dest, src, src + num);
      }

      function _emscripten_get_heap_size() {
        return HEAPU8.length;
      }

      function emscripten_realloc_buffer(size) {
        try {
          wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
          updateGlobalBufferAndViews(wasmMemory.buffer);
          return 1;
        } catch (e) {}
      }

      function _emscripten_resize_heap(requestedSize) {
        requestedSize = requestedSize >>> 0;

        var oldSize = _emscripten_get_heap_size();

        var PAGE_MULTIPLE = 65536;
        var maxHeapSize = 2147483648;

        if (requestedSize > maxHeapSize) {
          return false;
        }

        var minHeapSize = 16777216;

        for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
          var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
          overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
          var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), PAGE_MULTIPLE));
          var replacement = emscripten_realloc_buffer(newSize);

          if (replacement) {
            return true;
          }
        }

        return false;
      }

      var SYSCALLS = {
        mappings: {},
        buffers: [null, [], []],
        printChar: function printChar(stream, curr) {
          var buffer = SYSCALLS.buffers[stream];

          if (curr === 0 || curr === 10) {
            (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
            buffer.length = 0;
          } else {
            buffer.push(curr);
          }
        },
        varargs: undefined,
        get: function get() {
          SYSCALLS.varargs += 4;
          var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
          return ret;
        },
        getStr: function getStr(ptr) {
          var ret = UTF8ToString(ptr);
          return ret;
        },
        get64: function get64(low, high) {
          return low;
        }
      };

      function _fd_close(fd) {
        return 0;
      }

      function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {}

      function _fd_write(fd, iov, iovcnt, pnum) {
        var num = 0;

        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[iov + i * 8 >> 2];
          var len = HEAP32[iov + (i * 8 + 4) >> 2];

          for (var j = 0; j < len; j++) {
            SYSCALLS.printChar(fd, HEAPU8[ptr + j]);
          }

          num += len;
        }

        HEAP32[pnum >> 2] = num;
        return 0;
      }

      function _setTempRet0($i) {}

      init_emval();
      PureVirtualError = Module["PureVirtualError"] = extendError(Error, "PureVirtualError");
      embind_init_charCodes();
      init_embind();
      BindingError = Module["BindingError"] = extendError(Error, "BindingError");
      InternalError = Module["InternalError"] = extendError(Error, "InternalError");
      init_ClassHandle();
      init_RegisteredPointer();
      UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
      var asmLibraryArg = {
        "j": __ZN8facebook4yoga24LayoutPassReasonToStringENS0_16LayoutPassReasonE,
        "s": ___cxa_allocate_exception,
        "r": ___cxa_throw,
        "q": __embind_create_inheriting_constructor,
        "g": __embind_finalize_value_object,
        "z": __embind_register_bool,
        "e": __embind_register_class,
        "d": __embind_register_class_class_function,
        "k": __embind_register_class_constructor,
        "a": __embind_register_class_function,
        "y": __embind_register_emval,
        "n": __embind_register_float,
        "c": __embind_register_integer,
        "b": __embind_register_memory_view,
        "o": __embind_register_std_string,
        "i": __embind_register_std_wstring,
        "h": __embind_register_value_object,
        "f": __embind_register_value_object_field,
        "A": __embind_register_void,
        "D": __emval_call_method,
        "E": __emval_call_void_method,
        "F": __emval_decref,
        "p": __emval_get_method_caller,
        "B": __emval_incref,
        "C": __emval_run_destructors,
        "l": _abort,
        "v": _emscripten_memcpy_big,
        "w": _emscripten_resize_heap,
        "x": _fd_close,
        "t": _fd_seek,
        "m": _fd_write,
        "memory": wasmMemory,
        "u": _setTempRet0,
        "table": wasmTable
      };
      Module.sync = false;

      if (!Module.sync) {
        var asm = createWasm();
      } else {
        var asm = createWasmSync();
      }

      var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function () {
        return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["G"]).apply(null, arguments);
      };

      var ___getTypeName = Module["___getTypeName"] = function () {
        return (___getTypeName = Module["___getTypeName"] = Module["asm"]["H"]).apply(null, arguments);
      };

      var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function () {
        return (___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = Module["asm"]["I"]).apply(null, arguments);
      };

      var _malloc = Module["_malloc"] = function () {
        return (_malloc = Module["_malloc"] = Module["asm"]["J"]).apply(null, arguments);
      };

      var _free = Module["_free"] = function () {
        return (_free = Module["_free"] = Module["asm"]["K"]).apply(null, arguments);
      };

      var dynCall_ii = Module["dynCall_ii"] = function () {
        return (dynCall_ii = Module["dynCall_ii"] = Module["asm"]["L"]).apply(null, arguments);
      };

      var dynCall_iiiiii = Module["dynCall_iiiiii"] = function () {
        return (dynCall_iiiiii = Module["dynCall_iiiiii"] = Module["asm"]["M"]).apply(null, arguments);
      };

      var dynCall_vii = Module["dynCall_vii"] = function () {
        return (dynCall_vii = Module["dynCall_vii"] = Module["asm"]["N"]).apply(null, arguments);
      };

      var dynCall_viififi = Module["dynCall_viififi"] = function () {
        return (dynCall_viififi = Module["dynCall_viififi"] = Module["asm"]["O"]).apply(null, arguments);
      };

      var dynCall_vi = Module["dynCall_vi"] = function () {
        return (dynCall_vi = Module["dynCall_vi"] = Module["asm"]["P"]).apply(null, arguments);
      };

      var dynCall_i = Module["dynCall_i"] = function () {
        return (dynCall_i = Module["dynCall_i"] = Module["asm"]["Q"]).apply(null, arguments);
      };

      var dynCall_viii = Module["dynCall_viii"] = function () {
        return (dynCall_viii = Module["dynCall_viii"] = Module["asm"]["R"]).apply(null, arguments);
      };

      var dynCall_vif = Module["dynCall_vif"] = function () {
        return (dynCall_vif = Module["dynCall_vif"] = Module["asm"]["S"]).apply(null, arguments);
      };

      var dynCall_iii = Module["dynCall_iii"] = function () {
        return (dynCall_iii = Module["dynCall_iii"] = Module["asm"]["T"]).apply(null, arguments);
      };

      var dynCall_viiii = Module["dynCall_viiii"] = function () {
        return (dynCall_viiii = Module["dynCall_viiii"] = Module["asm"]["U"]).apply(null, arguments);
      };

      var dynCall_viif = Module["dynCall_viif"] = function () {
        return (dynCall_viif = Module["dynCall_viif"] = Module["asm"]["V"]).apply(null, arguments);
      };

      var dynCall_iiii = Module["dynCall_iiii"] = function () {
        return (dynCall_iiii = Module["dynCall_iiii"] = Module["asm"]["W"]).apply(null, arguments);
      };

      var dynCall_dii = Module["dynCall_dii"] = function () {
        return (dynCall_dii = Module["dynCall_dii"] = Module["asm"]["X"]).apply(null, arguments);
      };

      var dynCall_viid = Module["dynCall_viid"] = function () {
        return (dynCall_viid = Module["dynCall_viid"] = Module["asm"]["Y"]).apply(null, arguments);
      };

      var dynCall_vid = Module["dynCall_vid"] = function () {
        return (dynCall_vid = Module["dynCall_vid"] = Module["asm"]["Z"]).apply(null, arguments);
      };

      var dynCall_di = Module["dynCall_di"] = function () {
        return (dynCall_di = Module["dynCall_di"] = Module["asm"]["_"]).apply(null, arguments);
      };

      var dynCall_viddi = Module["dynCall_viddi"] = function () {
        return (dynCall_viddi = Module["dynCall_viddi"] = Module["asm"]["$"]).apply(null, arguments);
      };

      var dynCall_iiififi = Module["dynCall_iiififi"] = function () {
        return (dynCall_iiififi = Module["dynCall_iiififi"] = Module["asm"]["aa"]).apply(null, arguments);
      };

      var dynCall_fii = Module["dynCall_fii"] = function () {
        return (dynCall_fii = Module["dynCall_fii"] = Module["asm"]["ba"]).apply(null, arguments);
      };

      var dynCall_viiid = Module["dynCall_viiid"] = function () {
        return (dynCall_viiid = Module["dynCall_viiid"] = Module["asm"]["ca"]).apply(null, arguments);
      };

      var dynCall_diii = Module["dynCall_diii"] = function () {
        return (dynCall_diii = Module["dynCall_diii"] = Module["asm"]["da"]).apply(null, arguments);
      };

      var dynCall_viiddi = Module["dynCall_viiddi"] = function () {
        return (dynCall_viiddi = Module["dynCall_viiddi"] = Module["asm"]["ea"]).apply(null, arguments);
      };

      var dynCall_v = Module["dynCall_v"] = function () {
        return (dynCall_v = Module["dynCall_v"] = Module["asm"]["fa"]).apply(null, arguments);
      };

      var dynCall_jiji = Module["dynCall_jiji"] = function () {
        return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["ga"]).apply(null, arguments);
      };

      var dynCall_iidiiii = Module["dynCall_iidiiii"] = function () {
        return (dynCall_iidiiii = Module["dynCall_iidiiii"] = Module["asm"]["ha"]).apply(null, arguments);
      };

      var dynCall_viiiiii = Module["dynCall_viiiiii"] = function () {
        return (dynCall_viiiiii = Module["dynCall_viiiiii"] = Module["asm"]["ia"]).apply(null, arguments);
      };

      var dynCall_viiiii = Module["dynCall_viiiii"] = function () {
        return (dynCall_viiiii = Module["dynCall_viiiii"] = Module["asm"]["ja"]).apply(null, arguments);
      };

      var calledRun;

      function ExitStatus(status) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + status + ")";
        this.status = status;
      }

      dependenciesFulfilled = function runCaller() {
        if (!calledRun) run();
        if (!calledRun) dependenciesFulfilled = runCaller;
      };

      function run(args) {
        if (runDependencies > 0) {
          return;
        }

        preRun();
        if (runDependencies > 0) return;

        function doRun() {
          if (calledRun) return;
          calledRun = true;
          Module["calledRun"] = true;
          if (ABORT) return;
          initRuntime();
          preMain();
          readyPromiseResolve(Module);
          if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
          postRun();
        }

        if (Module["setStatus"]) {
          Module["setStatus"]("Running...");
          setTimeout(function () {
            setTimeout(function () {
              Module["setStatus"]("");
            }, 1);
            doRun();
          }, 1);
        } else {
          doRun();
        }
      }

      Module["run"] = run;

      if (Module["preInit"]) {
        if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];

        while (Module["preInit"].length > 0) {
          Module["preInit"].pop()();
        }
      }

      noExitRuntime = true;
      run();

      if (!Module.sync) {
        return Module.ready;
      } else {
        return Module;
      }
    };
  }();

  function bind(name, proto) {
    return proto;
  }

  function initConfig(filepath) {
    return filepath ? function locateFile() {
      return filepath;
    } : void 0;
  }

  function init(opt) {
    // var task = Module({
    //   locateFile: initConfig(opt.filepath)
    // }).then(function (raw) {
    //   console.log('raw', raw);
    //   return Object.assign(mod, entryCommon(bind, raw));
    // });
    if (opt.sync) {
      var syncMod = Module({
        sync: true
      });
      return syncMod.then(function (res) {
        return Object.assign(mod, entryCommon(bind, res));
      });
    } else {
      return task;
    }
  }

  var mod = {
    init: init
  };
  return mod;
}();


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 14 */
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
    if (item.childNodes) {
      for (var i = 0; i < item.childNodes.length; i++) {
        item.childNodes[i].repaint();
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
/* 15 */
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
          }, node.root.getFontSize());

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
      }

      return textArray;
    }
  }]);

  return TextManager;
}();

/* harmony default export */ __webpack_exports__["default"] = (TextManager);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RenderContextManager; });
/* harmony import */ var _renderer_gl_rect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _renderer_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21);
/* harmony import */ var _renderContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(23);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var _pluginEnv$customEnv = pluginEnv.customEnv,
    WXWebAssembly = _pluginEnv$customEnv.WXWebAssembly,
    wx = _pluginEnv$customEnv.wx;
/**
 * @description 逻辑线程渲染管理器，用于搜集每个节点需要的渲染数据
 */



function createImage() {
  /* istanbul ignore if*/
  if (typeof wx !== "undefined") {
    return wx.createImage();
  } else {
    return document.createElement('img');
  }
}

function createCanvas() {
  return wx.createCanvas();
}

var info = wx.getSystemInfoSync();
var dpr = info.devicePixelRatio;
var renderer = Object(_renderer_util_js__WEBPACK_IMPORTED_MODULE_1__["createRender"])({
  dpr: dpr,
  createImage: createImage,
  createCanvas: createCanvas
});

var RenderContextManager = /*#__PURE__*/function () {
  function RenderContextManager(canvasContext) {
    _classCallCheck(this, RenderContextManager);

    this.canvasContext = canvasContext;
    this.glRects = [];
  }

  _createClass(RenderContextManager, [{
    key: "createRoundRect",
    value: function createRoundRect(id, type) {
      var glRect = new _renderContext__WEBPACK_IMPORTED_MODULE_2__["default"](id, type);
      this.glRects.push(glRect);
      return glRect;
    }
    /**
     * @description 清空数据
     */

  }, {
    key: "clear",
    value: function clear() {
      console.log('clear call');
      this.glRects = this.glRects.slice(0, 0);
    }
    /**
     * @description 传递数据给渲染线程
     */

  }, {
    key: "draw",
    value: function draw() {
      this.testRun({
        noRepaint: !!this.noRepaint,
        width: this.width,
        height: this.height,
        glRects: this.glRects
      }, this.canvasContext.canvas);
    }
  }, {
    key: "testRun",
    value: function testRun(data, canvas) {
      console.log('data', data);
      var gl = Object(_renderer_gl_rect_js__WEBPACK_IMPORTED_MODULE_0__["setupGl"])(canvas);
      gl.canvas.height = data.height * dpr;
      gl.canvas.width = data.width * dpr;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
      renderer.repaint(gl, data.glRects);
      var result = Object(_renderer_util_js__WEBPACK_IMPORTED_MODULE_1__["renderDetection"])(gl, 30);
      console.log("render detection ".concat(result));
    }
  }]);

  return RenderContextManager;
}();



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setupGl", function() { return setupGl; });
/* harmony import */ var _m4_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _roundedRect_vert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _roundedRect_frag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(20);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// import rgba from 'color-rgba';


 // function cached(fn) {
//   const cache = Object.create(null);
//   return (function cachedFn(str) {
//     const hit = cache[str];
//     return hit || (cache[str] = fn(str));
//   });
// }
// const normalizeColor = cached(color => rgba(color).map((c, i) => {
//   if (i === 3) {
//     return c;
//   }
//   return c / 255;
// }));

var positions = new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]);
console.log('gl_rect init');

function createProgram(gl) {
  var textureMap = new WeakMap();
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
  var uBitset; // let blankTexId

  var uTex;
  var vPosition;
  var textureMatrixLocation;
  {
    gl.enable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
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
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
  } // { //空白纹理
  //   blankTexId = gl.createTexture();
  //   gl.bindTexture(gl.TEXTURE_2D, blankTexId);
  //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  //   // gl.bindTexture(gl.TEXTURE_2D, null);
  // }

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
    // blankTexId,
    uTex: uTex,
    vPosition: vPosition,
    textureMatrixLocation: textureMatrixLocation,
    textureMap: textureMap
  };
}

function useProgram(gl) {
  console.log('useProgram');

  if (!gl.program) {
    gl.program = createProgram(gl); // eslint-disable-line
  }

  var _gl$program = gl.program,
      uResolution = _gl$program.uResolution,
      uRadius = _gl$program.uRadius,
      uBorderWidth = _gl$program.uBorderWidth,
      uBorderColor = _gl$program.uBorderColor,
      uColor = _gl$program.uColor,
      uMatrix = _gl$program.uMatrix,
      uRect = _gl$program.uRect,
      uTexRect = _gl$program.uTexRect,
      uBitset = _gl$program.uBitset,
      uTex = _gl$program.uTex,
      textureMatrixLocation = _gl$program.textureMatrixLocation,
      textureMap = _gl$program.textureMap;
  return function createRoundRect() {
    var x = 0;
    var y = 0;
    var width = 1;
    var height = 1;
    var radius = [0, 0, 0, 0];
    var backgroundColor = [0, 0, 0, 0];
    var backgroundImage;
    var backgroundImageData;
    var imageRect = [];
    var imageSrcRect = [];
    var borderWidth = 0;
    var borderColor = [0, 0, 0, 0];
    var imageWidth = 1;
    var imageHeight = 1;
    var canvasWidth;
    var canvasHeight;
    var matrix;
    var texMatrix = Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["translation"])(0, 0, 0);
    var result = {
      updateContours: function updateContours(dimension) {
        var _dimension = _slicedToArray(dimension, 4);

        x = _dimension[0];
        y = _dimension[1];
        width = _dimension[2];
        height = _dimension[3];
      },
      updateViewPort: function updateViewPort() {
        if (canvasWidth !== gl.canvas.width || canvasHeight !== gl.canvas.height) {
          canvasWidth !== gl.canvas.width && (canvasWidth = gl.canvas.width);
          canvasHeight !== gl.canvas.height && (canvasHeight = gl.canvas.height);
          matrix = Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["orthographic"])(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
          matrix = Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["translate"])(matrix, x, y, 0);
          matrix = Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["scale"])(matrix, width, height, 1);
        }
      },
      setRadius: function setRadius(r) {
        if (typeof r === 'number') {
          radius = [r, r, r, r];
        } else {
          radius = r;
        }
      },
      setBorder: function setBorder(width, color) {
        borderWidth = width; // borderColor = normalizeColor(color);

        borderColor = color;
      },
      setBackgroundColor: function setBackgroundColor(color) {
        backgroundColor = color;
      },
      setTexture: function setTexture() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            image = _ref.image,
            _ref$rect = _ref.rect,
            rect = _ref$rect === void 0 ? [0, 0, width, height] : _ref$rect,
            srcRect = _ref.srcRect;

        backgroundImage = image;
        imageWidth = image.width;
        imageHeight = image.height;
        imageRect = rect;
        imageSrcRect = srcRect || [0, 0, image.width, image.height];
        result.setTexMatrix();
      },
      setTextureData: function setTextureData() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            imageData = _ref2.imageData,
            tWidth = _ref2.width,
            tHeight = _ref2.height,
            _ref2$rect = _ref2.rect,
            rect = _ref2$rect === void 0 ? [0, 0, width, height] : _ref2$rect,
            srcRect = _ref2.srcRect;

        backgroundImageData = imageData;
        imageWidth = tWidth;
        imageHeight = tHeight;
        imageRect = rect;
        imageSrcRect = srcRect || [0, 0, tWidth, tHeight];
        result.setTexMatrix();
      },
      setTexMatrix: function setTexMatrix() {
        var srcX = imageSrcRect[0] || 0;
        var srcY = imageSrcRect[1] || 0;
        var srcWidth = imageSrcRect[2] || imageWidth;
        var srcHeight = imageSrcRect[3] || imageHeight;
        texMatrix = Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["translation"])(srcX / imageWidth, srcY / imageHeight, 0);
        texMatrix = Object(_m4_js__WEBPACK_IMPORTED_MODULE_0__["scale"])(texMatrix, srcWidth / imageWidth, srcHeight / imageHeight, 1);
      },
      draw: function draw() {
        var dstX = (imageRect[0] || 0) + x + borderWidth;
        var dstY = (imageRect[1] || 0) + y + borderWidth;
        var dstWidth = imageRect[2] || width;
        var dstHeight = imageRect[3] || height;

        function createTexture() {
          var texId = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texId);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          return texId;
        }

        var hasTexture = false;

        if (typeof backgroundImage !== 'undefined') {
          var texId = textureMap.get(backgroundImage);

          if (!texId) {
            texId = createTexture(); // 首屏只绘制一次

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, backgroundImage);
            textureMap.set(backgroundImage, texId);
          }

          gl.bindTexture(gl.TEXTURE_2D, texId);
          hasTexture = true;
        } else if (typeof backgroundImageData !== 'undefined') {
          var _texId = textureMap.get(ArrayBuffer);

          if (!_texId) {
            _texId = createTexture();
            textureMap.set(ArrayBuffer, _texId);
          }

          gl.bindTexture(gl.TEXTURE_2D, _texId);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, imageWidth, imageHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, backgroundImageData);
          hasTexture = true;
        } else {// gl.bindTexture(gl.TEXTURE_2D, blankTexId);
        }

        gl.uniformMatrix4fv(uMatrix, false, matrix);
        gl.uniform4f(uTexRect, dstX, dstY + dstHeight, dstX + dstWidth, dstY);
        gl.uniform4f(uRect, x, y + height, x + width, y);
        gl.uniform4f(uBitset, hasTexture ? 1 : 0, 0, 0, 0);
        gl.uniformMatrix4fv(textureMatrixLocation, false, texMatrix);
        gl.uniform1i(uTex, 0);
        gl.uniform4f.apply(gl, [uColor].concat(_toConsumableArray(backgroundColor)));
        gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);
        gl.uniform4f.apply(gl, [uRadius].concat(_toConsumableArray(radius)));
        gl.uniform4f.apply(gl, [uBorderColor].concat(_toConsumableArray(borderColor)));
        gl.uniform1f(uBorderWidth, borderWidth);
        gl.drawArrays(gl.TRIANGLES, 0, 6); // 非常耗时
        // const err = gl.getError();
        // if (err) {
        //   console.error('gl draw err', err);
        // }
      }
    };
    return result;
  };
}

function setupGl(canvas) {
  if (!canvas.webgl) {
    var _gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true,
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      depth: false,
      stencil: false
    });

    _gl.createRoundRect = useProgram(_gl);
    canvas.webgl = _gl; // eslint-disable-line
  }

  var gl = canvas.webgl;
  return gl;
}

/***/ }),
/* 18 */
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
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("attribute vec4 a_position;\nuniform vec2 u_resolution;\nuniform mat4 u_matrix;\nuniform mat4 u_textureMatrix;\nuniform vec4 u_tex_rect;\nvarying vec2 v_resolution;\nvarying vec2 v_texcoord;\nvarying vec4 v_tex_rect;\n\nvec2 pixel2coord(vec2 a, vec2 resolution) {\n    vec2 zeroToOne = a / resolution;\n    vec2 zeroTwo = zeroToOne * 2.0;\n    vec2 clipSpace = zeroTwo - 1.0;\n    return clipSpace * vec2(1, -1);\n}\n\nvoid main() {\n    gl_Position = u_matrix * a_position;\n\n    vec2 texRectBl = pixel2coord(u_tex_rect.xy, u_resolution);\n    vec2 texRectTr = pixel2coord(u_tex_rect.zw, u_resolution);\n    float texRectWidth = texRectTr.x - texRectBl.x;\n    float texRectHeight = texRectTr.y - texRectBl.y;\n\n    vec4 tex_position = vec4(vec2((gl_Position.x - texRectBl.x) / texRectWidth, (texRectTr.y - gl_Position.y) / texRectHeight), 0, 1);\n\n    v_resolution = u_resolution;\n    v_texcoord = (u_textureMatrix * tex_position).xy;\n    v_tex_rect = u_tex_rect;\n}");

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("precision mediump float;\nuniform sampler2D u_texture;\nuniform vec4 u_rect;\nuniform vec4 u_color;\nuniform vec4 u_radius;\nuniform vec4 u_border_color;\nuniform float u_border_width;\nuniform vec4 u_bitset; //texture[, context, border, radius]\nvarying vec2 v_resolution;\nvarying vec2 v_texcoord;\nvarying vec4 v_tex_rect;\n\n// float sdfBox(vec2 coord, vec2 center, vec2 rect) {\n//   vec2 d = abs(coord - center) - rect;\n//   return min(max(d.x,d.y),0.0) + length(max(d,0.0));\n// }\n// float sdfCircle(vec2 coord, vec2 center, float radius) {\n//   return length(coord - center) - radius;\n// }\n// vec3 createCorner(vec2 dir, float raidus, float sign, float stroke) {\n//   return vec3(dir + sign * raidus, raidus - stroke);\n// }\n// float getCorner(vec2 p, vec3 corner) {\n//   return sdfCircle(p, corner.xy, corner.z);\n// }\n// float getCenter(vec2 p, vec3 from, vec3 to, vec2 r) {\n//   return sdfBox(p, (from + to).xy / 2., r - abs(from + to).z/2.);\n// }\n// float getHEdge(vec2 p, vec3 from, vec3 to) {\n//   return sdfBox(p,\n//   vec2((from.x + to.x)/2., sign(from.y) * min(abs(from.y), abs(to.y))),\n//   vec2(abs(from.x - to.x)/2., max(from.z, to.z)));\n// }\n// float getVEdge(vec2 p, vec3 from, vec3 to) {\n//   return sdfBox(p,\n//   vec2(sign(from.x) * min(abs(from.x), abs(to.x)), (from.y + to.y)/2.),\n//   vec2(max(from.z, to.z), abs(from.y - to.y)/2.));\n// }\n// float drawRect(vec2 p, vec2 lt, vec2 rt, vec2 rb, vec2 lb, vec4 corners, float stroke) {\n//   vec3 cLt = vec3(vec2(lt.x + corners.x, lt.y - corners.x), corners.x - stroke);\n//   vec3 cRt = vec3(vec2(rt.x - corners.y, rt.y - corners.y), corners.y - stroke);\n//   vec3 cRb = vec3(vec2(rb.x - corners.z, rb.y + corners.z), corners.z - stroke);\n//   vec3 cLb = vec3(vec2(lb.x + corners.w, lb.y + corners.w), corners.w - stroke);\n\n//   float circle = getCorner(p, cLt);\n//   circle = min(circle, getCorner(p, cRt));\n//   circle = min(circle, getCorner(p, cRb));\n//   circle = min(circle, getCorner(p, cLb));\n\n//   float box = getHEdge(p, cLt, cRt);\n//   box = min(box, getHEdge(p, cLb, cRb));\n//   box = min(box, getVEdge(p, cLt, cLb));\n//   box = min(box, getVEdge(p, cRt, cRb));\n//   float center = sdfBox(p, (cRt + cLb).xy / 2., vec2((cRt.x - cLb.x) / 2., (cRt.y - cLb.y) / 2.));\n//   center = max(center, sdfBox(p, (cRb + cLt).xy / 2., vec2((cRb.x - cLt.x) / 2., (cLt.y - cRb.y) / 2.)));\n//   box = min(box, center);\n\n//   return min(circle, box);\n// }\n\n// https://www.shadertoy.com/view/4llXD7\nfloat sdfRoundedRect(vec2 uv, vec2 center, vec2 size, vec4 r) {\n  vec2 p = uv - center;\n  // r.xy = (p.x > 0.0) ? r.xy : r.zw;\n  r.xy = mix(r.xy, r.zw, step(p.x, 0.0));\n  // r.x  = (p.y > 0.0) ? r.x  : r.y;\n  r.x  = mix(r.x, r.y, step(p.y, 0.0));\n\n  vec2 d = abs(p) - size + r.x;\n  // return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r.x;\n  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r.x;\n}\n\nvec2 pixel2coord (vec2 p) {\n  return (2.0 * vec2(p.x, v_resolution.y - p.y) - v_resolution) / v_resolution.y;\n}\n\nvec4 blend(vec4 cb, vec4 ca) {\n  float alpha = ca.a + cb.a * (1.0 - ca.a);\n  return mix(vec4((ca.rgb * ca.a + cb.rgb * cb.a * (1.0 - ca.a)) / alpha, alpha), vec4(0.0), step(abs(alpha), 0.0));\n  // return alpha == 0.0 ? vec4(0.0) : vec4((ca.rgb * ca.a + cb.rgb * cb.a * (1.0 - ca.a)) / alpha, alpha);\n}\n\nvoid main() {\n    float anti = 0.003;\n    vec2 p = (2.0 * gl_FragCoord.xy - v_resolution) / v_resolution.y;\n    vec4 radius = u_radius * 2.0 / v_resolution.y;\n    float borderWidth = u_border_width * 2.0 / v_resolution.y;\n\n    vec2 lt = pixel2coord(u_rect.xw);\n    vec2 rb = pixel2coord(u_rect.zy);\n    vec2 center = (rb + lt) / 2.;\n    vec2 size = abs(rb - lt) / 2.;\n    vec4 corners = vec4(radius.y, radius.z, radius.x, radius.w);\n    float border = sdfRoundedRect(p, center, size, corners);\n    float content = sdfRoundedRect(p, center, size - borderWidth, corners - borderWidth);\n\n    vec2 texLt = pixel2coord(v_tex_rect.xw);\n    vec2 texRb = pixel2coord(v_tex_rect.zy);\n    vec2 texCenter = (texRb + texLt) / 2.;\n    vec2 texSize = abs(texRb - texLt) / 2.;\n    float texContent = sdfRoundedRect(p, texCenter, texSize, vec4(0.));\n\n    vec4 borderColor = u_border_color;\n    borderColor.a *= smoothstep(-anti, anti, -max(border, -content));\n    vec4 contentColor = u_color;\n    contentColor.a *= smoothstep(-anti, anti, -content);\n    vec4 textureColor = mix(texture2D(u_texture, v_texcoord), vec4(0.0), step(abs(u_bitset.x), 0.0));\n    textureColor.rgb /= mix(textureColor.a, 1.0, step(textureColor.a, 0.0));\n    textureColor.a *= sign(-texContent) * smoothstep(-anti, anti, -content);\n    gl_FragColor = blend(blend(contentColor, textureColor), borderColor);\n}\n");

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createImageLoader", function() { return createImageLoader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTextTexture", function() { return createTextTexture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VIDEOS", function() { return VIDEOS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRender", function() { return createRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderDetection", function() { return renderDetection; });
/* harmony import */ var _const_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


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

      img.onerror = function () {}; // img.setSrc(src);


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
    style.font = "".concat(style.fontWeight || '', " ").concat(style.fontSize * dpr, "px ").concat(style.fontFamily);
    var key = "".concat(x, "_").concat(y, "_").concat(width, "_").concat(height, "_").concat(valueShow, "_").concat(style.font, "_").concat(style.lineHeight, "_").concat(style.textAlign, "_").concat(style.textShadow, "_").concat(style.whiteSpace, "_").concat(style.textOverflow, "_").concat(style.color);

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

    ctx.restore();
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
function createRender(_ref7) {
  var dpr = _ref7.dpr,
      createImage = _ref7.createImage,
      createCanvas = _ref7.createCanvas;
  var loadImage = createImageLoader(createImage);
  var getTextTexture = createTextTexture(createCanvas);
  return {
    loadImage: loadImage,
    repaint: function drawRects(gl, glRects) {
      // console.log('createRender repaint call');
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
      glRects.forEach(function (d, idx) {
        var glRectData = scaleData(d, dpr); // console.log(JSON.stringify(glRectData));

        var glRect = gl.createRoundRect(idx);
        var dimension = [glRectData.x, glRectData.y, glRectData.width, glRectData.height];
        glRect.updateContours(dimension);
        glRectData.radius && glRect.setRadius(glRectData.radius);
        glRectData.backgroundColor && glRect.setBackgroundColor(glRectData.backgroundColor);
        glRectData.borderWidth && glRect.setBorder(glRectData.borderWidth, glRectData.borderColor);

        if (glRectData.image) {
          var src = glRectData.image.src;
          loadImage(src, function (image, lazy) {
            glRect.setTexture({
              image: image
            });

            if (lazy) {
              drawRects(gl, glRects);
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
              drawRects(gl, glRects);
            }
          });
        }

        if (glRectData.text) {
          glRect.setTexture({
            image: getTextTexture(dimension, glRectData.text.value, glRectData.text.style, dpr)
          });
        }

        if (glRectData.type === 'Video') {
          var video = VIDEOS["".concat(gl.canvas.id, "-").concat(glRectData.id)];

          if (video) {
            video.repaint = function () {
              return drawRects(gl, glRects);
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

        glRect.updateViewPort();
        glRect.draw();
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
    var key = "".concat(pixels[p], "_").concat(pixels[p + 1], "_").concat(pixels[p + 2]); // result.push(mapData);

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
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SCALE_KEY", function() { return SCALE_KEY; });
var SCALE_KEY = ['width', 'height', 'x', 'y', 'radius', 'borderWidth'];


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RenderContext; });
/* harmony import */ var color_rgba__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @module  color-rgba */



var parse = __webpack_require__(25)
var hsl = __webpack_require__(27)

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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module color-parse
 */



var names = __webpack_require__(26)

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
/* 26 */
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module color-space/hsl
 */


var rgb = __webpack_require__(28);

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
/* 28 */
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
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "View", function() { return _view_js__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _image_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Image", function() { return _image_js__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(33);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return _text_js__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _scrollview_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(34);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScrollView", function() { return _scrollview_js__WEBPACK_IMPORTED_MODULE_3__["default"]; });



 // import Video from './video.js';




/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return View; });
/* harmony import */ var _block_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
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
    _this.renderBoxes = [];
    Object(_common_util_js__WEBPACK_IMPORTED_MODULE_1__["nextTick"])(function () {
      var style = _this.root.isDarkMode() ? _this.styleInit : _this.styleDarkInit;

      if (style.backgroundImage && _this.root && _this.root.canvasContext) {
        _this.root.canvasContext.postMessage({
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

      if (computedStyle.backgroundImage) {
        // 设置背景图片
        this.glRect.setBackgroundImage(computedStyle.backgroundImage, computedStyle.backgroundSize, computedStyle.backgroundPosition);
      }
    }
  }]);

  return View;
}(_block_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 31 */
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
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Image; });
/* harmony import */ var _block_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
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
        _this.root.canvasContext.postMessage({
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
      } // 设置圆角数据


      var radius = this.getRadius(computedStyle);
      this.glRect.setRadius(radius); // 设置图片

      this.glRect.setImage(this.src);
    }
  }]);

  return Image;
}(_block_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 33 */
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
        console.log('set text value 1 ', newValue, this.valueInit);

        if (newValue !== this.valueInit) {
          console.log('set text value 2 ', newValue, this.valueInit);
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
    }
  }]);

  return Text;
}(_elements_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ScrollView; });
/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30);
/* harmony import */ var _common_pool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _common_touch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(35);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
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





var id = 0;

var ScrollView = /*#__PURE__*/function (_View) {
  _inherits(ScrollView, _View);

  var _super = _createSuper(ScrollView);

  function ScrollView(_ref) {
    var _this;

    var _ref$style = _ref.style,
        style = _ref$style === void 0 ? {} : _ref$style,
        _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props,
        _ref$name = _ref.name,
        name = _ref$name === void 0 ? '' : _ref$name;

    _classCallCheck(this, ScrollView);

    _this = _super.call(this, {
      props: props,
      name: name,
      style: style
    });
    _this.type = 'ScrollView'; // 当前列表滚动的值

    _this.top = 0; // 滚动处理器

    _this.touch = new _common_touch_js__WEBPACK_IMPORTED_MODULE_2__["default"](); // canvas高度不能过高，在小游戏里面，对canvas尺寸是有限制的

    _this.pageHeight = 2000; // 根据列表总高度和单页高度计算的分页数量

    _this.pageCount = 1;
    _this.canvasMap = {}; // 图片加载完成之后会触发scrollView的重绘函数，当图片过多的时候用节流提升性能

    _this.throttleRepaint = Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["throttle"])(_this.clipRepaint, 16, _assertThisInitialized(_this));
    _this.renderTimers = [];
    return _this;
  }
  /**
   * 获取滚动列表内所有元素的高度和
   * 这里不能简单将所有子元素的高度累加，因为每个元素之间可能是有空隙的
   */


  _createClass(ScrollView, [{
    key: "initRepaint",
    // 重写基类的initRepaint方法，因为scrollView比较特殊，他有自己的绘制函数，因此repaint不需要上升到parent
    value: function initRepaint() {
      var _this2 = this;

      this.on('repaint', function () {
        _this2.clear();

        _this2.repaint();

        _this2.clipRepaint(-_this2.top);
      });
    }
    /**
     * 列表子元素重绘之前先将所有的canvas擦除
     */

  }, {
    key: "clear",
    value: function clear() {
      var _this3 = this;

      Object.keys(this.canvasMap).forEach(function (key) {
        var item = _this3.canvasMap[key];
        item.context && item.context.clearRect(0, 0, item.canvas.width, item.canvas.height);
      });
    }
    /**
     * 递归将整颗树的节点repaint一次
     * 由于renderChildren阶段已经计算过每个元素会在哪一个canvas绘制，并且子元素会保留这些绘制信息
     * 因为仅仅需要repaint而不需要重新renderChildren，以提升性能
     */

  }, {
    key: "repaint",
    value: function repaint(tree) {
      var _this4 = this;

      if (!tree) {
        tree = this;
      }

      var children = tree.children;
      Object.keys(children).forEach(function (id) {
        var child = children[id];
        child.repaint();

        _this4.repaint(child);
      });
    } // 与主canvas的尺寸保持一致

  }, {
    key: "updateRenderPort",
    value: function updateRenderPort(renderport) {
      this.renderport = renderport;
    }
    /**
     * 计算分页数据
     * 小游戏的canvas对尺寸有要求，如果如果高度过高，可能出现渲染不出来的情况
     * 因此需要手动分页，列表过长的时候将数据绘制到几个canvas上面，这里预创建几个canvas
     */

  }, {
    key: "calPageData",
    value: function calPageData() {
      this.pageCount = Math.ceil((this.scrollHeight + this.layoutBox.absoluteY) / this.pageHeight);

      for (var i = 0; i < this.pageCount; i++) {
        var cache = this.root.canvasPool.get(i);

        if (cache) {
          cache.context && cache.context.clearRect(0, 0, cache.canvas.width, cache.canvas.height);
          cache.elements = [];
          this.canvasMap[i] = cache;
        } else {
          this.canvasMap[i] = {
            elements: []
          };
          this.root.canvasPool.set(i, this.canvasMap[i]);
        }
      }
    }
  }, {
    key: "destroySelf",
    value: function destroySelf() {
      this.touch = null;
      this.isDestroyed = true;
      this.throttleRepaint = null;
      this.renderTimers.forEach(function (timer) {
        clearTimeout(timer);
      });
      this.renderTimers = [];
      this.canvasMap = {};
      this.ctx = null;
      this.children = null;
    }
    /**
     * 滚动列表重绘逻辑
     * 将分页canvas按照滚动裁剪绘制到主canvas上面
     */

  }, {
    key: "clipRepaint",
    value: function clipRepaint(top) {
      if (this.isDestroyed) {
        return;
      }

      top = -top;
      this.top = top;
      var box = this.layoutBox;
      var abY = box.absoluteY;

      if (this.isDestroyed || this.root.state === _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].CLEAR) {
        return;
      } // 在主canvas上面将滚动列表区域擦除


      this.ctx.clearRect(box.absoluteX, abY, box.width, box.height); // 背景填充

      this.ctx.fillStyle = this.parent.style.backgroundColor || '#ffffff';
      this.ctx.fillRect(box.absoluteX, abY, box.width, box.height);

      for (var i = 0; i < this.pageCount; i++) {
        var canvas = this.canvasMap[i].canvas; // 根据滚动值获取裁剪区域

        var startY = abY + top;
        var endY = abY + top + box.height; // 计算在裁剪区域内的canvas

        if (startY < this.pageHeight * (i + 1) && endY > this.pageHeight * i) {
          /**
           * 这里不能按照box.width * box.height的区域去裁剪
           * 在浏览器里面正常，但是在小游戏里面会出现诡异的渲染出错，所以裁剪canvas真实有效的区域
           */
          var clipY = abY + top - this.pageHeight * i;
          var clipH = box.height;
          var renderY = abY;

          if (clipY > 0 && this.pageHeight - clipY < box.height) {
            clipH = this.pageHeight - clipY;
          } else if (clipY < 0) {
            clipH = clipY + box.height;
            renderY = renderY - clipY;
            clipY = 0;
          }

          this.ctx.drawImage(canvas, box.absoluteX, clipY, box.width, clipH, box.absoluteX, renderY, box.width, clipH);
        }
      }
    }
  }, {
    key: "renderChildren",
    value: function renderChildren(tree) {
      var _this5 = this;

      var children = tree.children;
      var height = this.pageHeight;
      Object.keys(children).forEach(function (id) {
        var child = children[id];
        var originY = child.layoutBox.originalAbsoluteY;
        var pageIndex = Math.floor(originY / height);
        var nextPage = pageIndex + 1;
        child.layoutBox.absoluteY -= _this5.pageHeight * pageIndex;

        if (child.checkNeedRender()) {
          _this5.canvasMap[pageIndex].elements.push({
            element: child,
            box: child.layoutBox
          });
        } // 对于跨界的元素，两边都绘制下


        if (originY + child.layoutBox.height > height * nextPage) {
          var tmpBox = Object.assign({}, child.layoutBox);
          tmpBox.absoluteY = originY - _this5.pageHeight * nextPage;

          if (child.checkNeedRender()) {
            _this5.canvasMap[nextPage].elements.push({
              element: child,
              box: tmpBox
            });
          }
        }

        _this5.renderChildren(child);
      });
    }
  }, {
    key: "insertElements",
    value: function insertElements(pageIndex) {
      var _this6 = this;

      var can = Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["createCanvas"])();
      var ctx = can.getContext('2d', {
        alpha: true
      });
      can.width = this.renderport.width;
      can.height = this.pageHeight;
      ctx.id = ++id;
      this.canvasMap[pageIndex].canvas = can;
      this.canvasMap[pageIndex].context = ctx;
      this.canvasMap[pageIndex].elements.forEach(function (ele) {
        ele.element.insert(ctx, ele.box);
      });

      if (pageIndex < this.pageCount - 1) {
        var timer = setTimeout(function () {
          _this6.insertElements(++pageIndex);
        }, 250);
        this.renderTimers.push(timer);
      }
    }
  }, {
    key: "insertScrollView",
    value: function insertScrollView(context) {
      var _this7 = this;

      // 绘制容器
      this.insert(context); // 计算列表应该分割成几页

      this.calPageData(); // 计算分页数据：每个元素应该坐落在哪个canvas

      this.renderChildren(this);
      this.insertElements(0);
      this.clipRepaint(-this.top); // 图片加载可能是异步的，监听图片加载完成事件完成列表重绘逻辑

      this.EE.on('image__render__done', function () {
        _this7.throttleRepaint(-_this7.top || 0);
      });

      if (this.scrollHeight > this.layoutBox.height) {
        this.touch.setTouchRange(-(this.scrollHeight - this.layoutBox.height), 0,
        /*this.throttleRepaint,*/
        this.clipRepaint.bind(this)); // 监听触摸相关事件，将滚动处理逻辑交给相应的处理器处理

        this.on('touchstart', this.touch.startFunc);
        this.on('touchmove', this.touch.moveFunc);
        this.on('touchend', this.touch.endFunc);
      }
    }
  }, {
    key: "scrollHeight",
    get: function get() {
      var ids = Object.keys(this.children);
      var last = this.children[ids[ids.length - 1]];
      return last.layoutBox.top + last.layoutBox.height;
    }
  }]);

  return ScrollView;
}(_view_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Touch; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import { getDpr } from './util.js';
var Touch = /*#__PURE__*/function () {
  function Touch() {
    _classCallCheck(this, Touch);

    this.needProcess = false;
    this.startFunc = this.touchStartHandler.bind(this);
    this.endFunc = this.touchEndHandler.bind(this);
    this.moveFunc = this.touchMoveHandler.bind(this);
  }

  _createClass(Touch, [{
    key: "reset",
    value: function reset() {
      this.touchTime = new Date();
      this.touchStartX = 0;
      this.touchStartY = 0; // 滚动区间

      this.start = 0;
      this.end = 0; // 当前位置

      this.move = 0; // 目标位置

      this.target = 0; // 滚动回调函数

      this.scroll = null; // for istanbul

      /* istanbul ignore if*/

      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.animate);
      }
    }
  }, {
    key: "enable",
    value: function enable() {
      this.reset();
      this.needProcess = true;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.needProcess = false;
    } // 设置滚动区间，比如一个排行榜的滚动区间可能是[-300, 0]

  }, {
    key: "setTouchRange",
    value: function setTouchRange(start, end, scroll) {
      // 考虑到切换游戏的场景，每次设置的时候重置所有变量
      this.enable();
      this.start = start;
      this.end = end;

      if (start === 0 && end === 0) {
        return;
      }

      this.scroll = scroll; // this.animate = requestAnimationFrame(this.loop.bind(this));
    } // 保证滚动目标位置在滚动区间内

  }, {
    key: "limitTarget",
    value: function limitTarget(target) {
      var result = target;

      if (target > this.end) {
        result = this.end;
      } else if (target < this.start) {
        result = this.start;
      }

      return result;
    }
  }, {
    key: "touchStartHandler",
    value: function touchStartHandler(e) {
      var touch = e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;

      if (!touch || !touch.pageX || !touch.pageY) {
        return;
      } // this.touchStartX = touch.clientX * getDpr();
      // this.touchStartY = touch.clientY * getDpr();


      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.touchTime = new Date();
      this.isMoving = true;
      this.needProcess = true;
      this.animate = requestAnimationFrame(this.loop.bind(this));
    }
  }, {
    key: "touchMoveHandler",
    value: function touchMoveHandler(e) {
      if (!this.isMoving) {
        return;
      }

      var touch = e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;

      if (!touch || !touch.pageX || !touch.pageY) {
        return;
      }

      var currY = touch.clientY;

      if (this.touchStartY - currY > 2 || this.touchStartY - currY < -2) {
        this.target -= this.touchStartY - currY;
      }

      this.target = this.limitTarget(this.target);
      this.touchStartY = currY;
    }
  }, {
    key: "touchEndHandler",
    value: function touchEndHandler() {
      this.isMoving = false;
      var timeInS = (Date.now() - this.touchTime) / 1000;
      /* console.log(Date.now(), this.touchTime.getTime(), Date.now() - this.touchTime);*/

      if (timeInS < 0.9) {
        /* console.log(1, timeInS, this.target, this.move);*/
        this.target += (this.target - this.move) * 0.6 / (timeInS * 5);
        /* console.log(2, this.target)*/

        this.target = this.limitTarget(this.target);
        /* console.log(3, this.target)*/
      }
    }
  }, {
    key: "loop",
    value: function loop() {
      if (this.needProcess) {
        if (this.isMoving) {
          if (this.move !== this.target) {
            // 手指移动可能过快，切片以使得滑动流畅
            if (Math.abs(this.target - this.move) > 1) {
              this.move += (this.target - this.move) * 0.4;
            } else {
              this.move = this.target;
            }

            this.scroll && this.scroll(this.move);
          }
        } else {
          if (this.move !== this.target) {
            /**
                       * 如果滑动很快，为了滚动流畅，需要将滑动过程切片
                       */
            if (Math.abs(this.target - this.move) > 1) {
              this.move += (this.target - this.move) * 0.3;
            } else {
              this.move = this.target;
            }

            this.scroll && this.scroll(this.move);
          } else {
            // 滑动结束，停止动画
            this.needProcess = false;
          }
        }

        this.animate = requestAnimationFrame(this.loop.bind(this));
      } else if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.animate);
      }
    }
  }]);

  return Touch;
}();



/***/ })
/******/ ]);