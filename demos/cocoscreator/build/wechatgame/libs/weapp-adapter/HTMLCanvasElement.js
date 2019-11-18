'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Canvas = require('./Canvas');

var _Canvas2 = _interopRequireDefault(_Canvas);

var _HTMLElement = require('./HTMLElement');

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import HTMLElement from './HTMLElement';

// export default class HTMLCanvasElement extends HTMLElement
// {
//     constructor(){
//         super('canvas')
//     }
// };

GameGlobal.screencanvas = GameGlobal.screencanvas || new _Canvas2.default();
var canvas = GameGlobal.screencanvas;

var canvasConstructor = canvas.constructor;

// canvasConstructor.__proto__.__proto__ = new HTMLElement();

exports.default = canvasConstructor;
module.exports = exports['default'];