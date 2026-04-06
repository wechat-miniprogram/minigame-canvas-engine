var TWEEN = require('../lib/tween');

/**
 * 复刻 tween.js 08_repeat
 * 三个小球展示不同的 repeat 模式：不重复、重复两次、无限重复
 */
module.exports = function tween_repeat(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  var PADDING = 30;
  var BALL_SIZE = 90;
  var TRACK_W = W - PADDING * 2;
  var contentH = H - statusBarH;

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view id="container">\
        <text class="title" value="Repeat 重复动画"></text>\
        <view class="group">\
          <text class="label" value="不重复"></text>\
          <view class="track"><view class="ball" id="ball0"></view></view>\
        </view>\
        <view class="group">\
          <text class="label" value="重复2次"></text>\
          <view class="track"><view class="ball ballGreen" id="ball1"></view></view>\
        </view>\
        <view class="group">\
          <text class="label" value="无限重复"></text>\
          <view class="track"><view class="ball ballOrange" id="ball2"></view></view>\
        </view>\
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
      padding: PADDING,
    },
    title: {
      color: '#333333',
      fontSize: 48,
      width: W - PADDING * 2,
      textAlign: 'center',
      height: 120,
      lineHeight: 120,
    },
    group: {
      width: W - PADDING * 2,
      marginTop: 60,
    },
    label: {
      color: '#666666',
      fontSize: 36,
      height: 60,
      lineHeight: 60,
      width: W - PADDING * 2,
    },
    track: {
      width: TRACK_W,
      height: BALL_SIZE,
      backgroundColor: '#e0e0e0',
      borderRadius: BALL_SIZE / 2,
      marginTop: 16,
    },
    ball: {
      width: BALL_SIZE,
      height: BALL_SIZE,
      borderRadius: BALL_SIZE / 2,
      backgroundColor: '#3498db',
      left: 0,
    },
    ballGreen: {
      backgroundColor: '#2ecc71',
    },
    ballOrange: {
      backgroundColor: '#e67e22',
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  Layout.ticker.add(function () {
    TWEEN.update();
  });

  var maxLeft = TRACK_W - BALL_SIZE;

  var ball0 = Layout.getElementById('ball0');
  new TWEEN.Tween(ball0.style)
    .to({ left: maxLeft }, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  var ball1 = Layout.getElementById('ball1');
  new TWEEN.Tween(ball1.style)
    .to({ left: maxLeft }, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .repeat(2)
    .start();

  var ball2 = Layout.getElementById('ball2');
  new TWEEN.Tween(ball2.style)
    .to({ left: maxLeft }, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .repeat(Infinity)
    .start();
};
