'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HTMLElement = require('./HTMLElement');

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imageConstructor = wx.createImage().constructor;

// imageConstructor.__proto__.__proto__ = new HTMLElement();

// import HTMLElement from './HTMLElement';

// export default class HTMLImageElement extends HTMLElement
// {
//     constructor(){
//         super('img')
//     }
// };

exports.default = imageConstructor;
module.exports = exports['default'];