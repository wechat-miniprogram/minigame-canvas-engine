window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  HelloWorld: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "280c3rsZJJKnZ9RqbALVwtK", "HelloWorld");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        label: {
          default: null,
          type: cc.Label
        },
        text: "Hello, World!"
      },
      onLoad: function onLoad() {
        this.label.string = this.text;
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {} ],
  minScale: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "96324LfZ5tHILI1MTwiBd33", "minScale");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        actionFlag: false
      },
      fixSize: function fixSize() {
        var sx = cc.winSize.width / 1242;
        var sy = cc.winSize.height / 2688;
        var minScale = Math.min(sx, sy);
        this.node.scale = minScale;
      },
      start: function start() {},
      onDestroy: function onDestroy() {},
      onEnable: function onEnable() {
        this.fixSize();
        if (!this.actionFlag) return;
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
          event: "updateViewPort",
          box: this.node.getBoundingBoxToWorld(),
          winSize: cc.winSize
        });
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "HelloWorld", "minScale" ]);