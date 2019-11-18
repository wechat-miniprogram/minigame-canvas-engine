"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
    screenWidth = _wx$getSystemInfoSync.screenWidth,
    screenHeight = _wx$getSystemInfoSync.screenHeight,
    devicePixelRatio = _wx$getSystemInfoSync.devicePixelRatio;

var innerWidth = exports.innerWidth = screenWidth;
var innerHeight = exports.innerHeight = screenHeight;
exports.devicePixelRatio = devicePixelRatio;
var screen = exports.screen = {
  width: screenWidth,
  height: screenHeight,
  availWidth: innerWidth,
  availHeight: innerHeight,
  availLeft: 0,
  availTop: 0
};

var performance = exports.performance = {
  now: Date.now
};

var ontouchstart = exports.ontouchstart = null;
var ontouchmove = exports.ontouchmove = null;
var ontouchend = exports.ontouchend = null;