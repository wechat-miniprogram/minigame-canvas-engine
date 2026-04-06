var TWEEN = require('./lib/tween');

/**
 * 复刻 tween.js 00_hello_world
 * 方块从左上移动到右下，再弹回来，展示基本的 tween 创建和 chain 用法
 */
module.exports = function tween_hello_world(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  var PADDING = 30;
  var boxSize = 120;

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view id="container">\
        <text class="title" value="Hello World - 基础链式动画"></text>\
        <view class="box"></view>\
      </view>\
    </view>\
  ';

  var contentH = H - statusBarH;
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
      padding: PADDING,
    },
    title: {
      color: '#333333',
      fontSize: 48,
      width: W - PADDING * 2,
      textAlign: 'center',
      height: 100,
      lineHeight: 100,
    },
    box: {
      backgroundColor: '#a0dde9',
      width: boxSize,
      height: boxSize,
      borderRadius: 16,
      left: 0,
      top: 0,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  var box = Layout.getElementsByClassName('box')[0];

  Layout.ticker.add(function () {
    TWEEN.update();
  });

  var tweenGo = new TWEEN.Tween(box.style)
    .to({ left: W - boxSize - PADDING * 2, top: contentH - boxSize - 200 }, 2000)
    .delay(500)
    .easing(TWEEN.Easing.Elastic.InOut);

  var tweenBack = new TWEEN.Tween(box.style)
    .to({ left: 0, top: 0 }, 2000)
    .easing(TWEEN.Easing.Elastic.InOut);

  tweenGo.chain(tweenBack);
  tweenBack.chain(tweenGo);

  tweenGo.start();
};
