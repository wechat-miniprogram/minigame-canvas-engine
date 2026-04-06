var TWEEN = require('../lib/tween');

/**
 * 复刻 tween.js 11_stop_all_chained_tweens
 * 两个方块通过 chain 串联，第一个动画完成后自动触发第二个，循环往复
 * 点击可停止/重启动画
 */
module.exports = function tween_chain(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  var PADDING = 30;
  var BOX_SIZE = 120;
  var TRACK_W = W - PADDING * 2;
  var contentH = H - statusBarH;

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view id="container">\
        <text class="title" value="Chain 链式动画"></text>\
        <text class="desc" value="Box1完成后自动触发Box2，循环往复"></text>\
        <text class="desc" value="点击可停止/重启"></text>\
        <view class="area">\
          <text class="boxLabel" value="Box 1"></text>\
          <view class="track"><view class="box1" id="box1"></view></view>\
        </view>\
        <view class="area">\
          <text class="boxLabel" value="Box 2"></text>\
          <view class="track"><view class="box2" id="box2"></view></view>\
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
      height: 100,
      lineHeight: 100,
    },
    desc: {
      color: '#999999',
      fontSize: 32,
      width: W - PADDING * 2,
      textAlign: 'center',
      height: 50,
      lineHeight: 50,
    },
    area: {
      width: W - PADDING * 2,
      marginTop: 80,
    },
    boxLabel: {
      color: '#666666',
      fontSize: 36,
      height: 60,
      lineHeight: 60,
      width: W - PADDING * 2,
    },
    track: {
      width: TRACK_W,
      height: BOX_SIZE,
      backgroundColor: '#e0e0e0',
      borderRadius: 16,
      marginTop: 16,
    },
    box1: {
      width: BOX_SIZE,
      height: BOX_SIZE,
      borderRadius: 16,
      backgroundColor: '#e74c3c',
      left: 0,
    },
    box2: {
      width: BOX_SIZE,
      height: BOX_SIZE,
      borderRadius: 16,
      backgroundColor: '#2ecc71',
      left: 0,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  Layout.ticker.add(function () {
    TWEEN.update();
  });

  var maxLeft = TRACK_W - BOX_SIZE;
  var box1 = Layout.getElementById('box1');
  var box2 = Layout.getElementById('box2');

  var t0Go = new TWEEN.Tween(box1.style)
    .to({ left: maxLeft }, 2000)
    .easing(TWEEN.Easing.Elastic.InOut);

  var t0Back = new TWEEN.Tween(box1.style)
    .to({ left: 0 }, 2000)
    .easing(TWEEN.Easing.Elastic.InOut);

  var t1Go = new TWEEN.Tween(box2.style)
    .to({ left: maxLeft }, 2000)
    .easing(TWEEN.Easing.Back.InOut);

  var t1Back = new TWEEN.Tween(box2.style)
    .to({ left: 0 }, 2000)
    .easing(TWEEN.Easing.Back.InOut);

  t0Go.chain(t1Go);
  t1Go.chain(t0Back);
  t0Back.chain(t1Back);
  t1Back.chain(t0Go);

  t0Go.start();

  var running = true;
  var container = Layout.getElementById('container');
  container.on('click', function () {
    if (running) {
      t0Go.stop();
      t0Back.stop();
      t1Go.stop();
      t1Back.stop();
      running = false;
    } else {
      t0Go.start();
      running = true;
    }
  });
};
