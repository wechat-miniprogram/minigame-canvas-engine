var TWEEN = require('./lib/tween');

/**
 * 复刻 tween.js 01_bars
 * 1000 个条形，随机位置和颜色，水平移动，循环
 */
module.exports = function tween_delay(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  var contentH = H - statusBarH;
  var BAR_COUNT = 1000;
  var BAR_H = 3;
  var BAR_W = 100;

  // 生成随机颜色
  function randColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // 构建模板
  var bars = '';
  for (var i = 0; i < BAR_COUNT; i++) {
    bars += '<view class="bar" id="bar_' + i + '"></view>';
  }

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view id="container">\
        ' + bars + '\
      </view>\
    </view>\
  ';

  var style = {
    wrapper: {
      width: W,
      height: H,
      backgroundColor: '#f3f3f3',
    },
    statusBar: {
      width: W,
      height: statusBarH,
    },
    container: {
      width: W,
      height: contentH,
      backgroundColor: '#f3f3f3',
      position: 'relative',
    },
    bar: {
      width: BAR_W,
      height: BAR_H,
      position: 'absolute',
      left: 0,
      top: 0,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  Layout.ticker.add(function () {
    TWEEN.update();
  });

  for (var j = 0; j < BAR_COUNT; j++) {
    var bar = Layout.getElementById('bar_' + j);
    if (!bar) continue;

    // 随机初始位置和颜色，y 在 container 内（已避开刘海区域）
    var startX = Math.floor(500 + (Math.random() - Math.random()) * 250);
    var endX = Math.floor(500 + (Math.random() - Math.random()) * 250);
    var y = Math.floor(Math.random() * contentH);

    bar.style.backgroundColor = randColor();
    bar.style.left = startX;
    bar.style.top = y;

    var data = { x: startX, el: bar };

    var updateFn = function (obj) {
      obj.el.style.left = Math.round(obj.x);
    };

    var tweenGo = new TWEEN.Tween(data)
      .to({ x: endX }, 4000)
      .delay(Math.random() * 1000)
      .onUpdate(updateFn)
      .easing(TWEEN.Easing.Back.Out);

    var tweenBack = new TWEEN.Tween(data)
      .to({ x: startX }, 4000)
      .delay(Math.random() * 1000)
      .onUpdate(updateFn)
      .easing(TWEEN.Easing.Elastic.InOut);

    tweenGo.chain(tweenBack);
    tweenBack.chain(tweenGo);
    tweenGo.start();
  }
};
