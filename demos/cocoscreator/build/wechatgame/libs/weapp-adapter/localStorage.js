"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var localStorage = {
  get length() {
    var _wx$getStorageInfoSyn = wx.getStorageInfoSync(),
        keys = _wx$getStorageInfoSyn.keys;

    return keys.length;
  },

  key: function key(n) {
    var _wx$getStorageInfoSyn2 = wx.getStorageInfoSync(),
        keys = _wx$getStorageInfoSyn2.keys;

    return keys[n];
  },
  getItem: function getItem(key) {
    return wx.getStorageSync(key);
  },
  setItem: function setItem(key, value) {
    return wx.setStorageSync(key, value);
  },
  removeItem: function removeItem(key) {
    wx.removeStorageSync(key);
  },
  clear: function clear() {
    wx.clearStorageSync();
  }
};

exports.default = localStorage;
module.exports = exports["default"];