"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (file) {
    var worker = wx.createWorker(file);

    return worker;
};

;
module.exports = exports["default"];