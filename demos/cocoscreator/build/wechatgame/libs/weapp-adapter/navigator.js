'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./util/index.js');

// TODO 需要 wx.getSystemInfo 获取更详细信息
var systemInfo = wx.getSystemInfoSync();
console.log(systemInfo);

var system = systemInfo.system;
var platform = systemInfo.platform;
var language = systemInfo.language;
var wechatVersioin = systemInfo.version;

var android = system.toLowerCase().indexOf('android') !== -1;

var uaDesc = android ? 'Android; CPU ' + system : 'iPhone; CPU iPhone OS ' + system + ' like Mac OS X';
var ua = 'Mozilla/5.0 (' + uaDesc + ') AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/' + wechatVersioin + ' MiniGame NetType/WIFI Language/' + language;

var navigator = {
  platform: platform,
  language: language,
  appVersion: '5.0 (' + uaDesc + ') AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  userAgent: ua,
  onLine: true, // TODO 用 wx.getNetworkStateChange 和 wx.onNetworkStateChange 来返回真实的状态

  // TODO 用 wx.getLocation 来封装 geolocation
  geolocation: {
    getCurrentPosition: _index.noop,
    watchPosition: _index.noop,
    clearWatch: _index.noop
  }
};

if (wx.onNetworkStatusChange) {
  wx.onNetworkStatusChange(function (event) {
    navigator.onLine = event.isConnected;
  });
}

exports.default = navigator;
module.exports = exports['default'];