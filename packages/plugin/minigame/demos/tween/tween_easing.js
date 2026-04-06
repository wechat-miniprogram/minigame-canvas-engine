var TWEEN = require('../lib/tween');

/**
 * 复刻 tween.js 03_graphs
 * 展示所有缓动函数效果：每行一个小球，使用不同缓动函数从左到右移动
 * 内容超一屏，使用 ScrollView 滚动
 */
module.exports = function tween_easing(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  // 收集所有缓动函数
  var easings = [];
  var easingNames = Object.keys(TWEEN.Easing);
  for (var i = 0; i < easingNames.length; i++) {
    var groupName = easingNames[i];
    var group = TWEEN.Easing[groupName];
    var variants = Object.keys(group);
    for (var j = 0; j < variants.length; j++) {
      easings.push({
        name: groupName + '.' + variants[j],
        fn: group[variants[j]],
      });
    }
  }

  var PADDING = 30;
  var LABEL_W = 260;
  var ROW_H = 80;
  var BALL_SIZE = 50;
  var TRACK_W = W - PADDING * 2 - LABEL_W;
  var contentH = H - statusBarH;
  var TITLE_H = 100;
  var SCROLL_H = contentH - TITLE_H - PADDING * 2;

  // 构建模板
  var rows = '';
  for (var k = 0; k < easings.length; k++) {
    rows += '\
      <view class="row">\
        <text class="label" value="' + easings[k].name + '"></text>\
        <view class="track">\
          <view class="ball" id="ball_' + k + '"></view>\
        </view>\
      </view>';
  }

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view id="container">\
        <text class="title" value="Easing 缓动函数展示"></text>\
        <scrollview class="scrollArea" scrollY="true">\
          ' + rows + '\
        </scrollview>\
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
      height: TITLE_H,
      lineHeight: TITLE_H,
    },
    scrollArea: {
      width: W - PADDING * 2,
      height: SCROLL_H,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      height: ROW_H,
      width: W - PADDING * 2,
    },
    label: {
      color: '#666666',
      fontSize: 30,
      width: LABEL_W,
      height: ROW_H,
      lineHeight: ROW_H,
    },
    track: {
      width: TRACK_W,
      height: BALL_SIZE,
      backgroundColor: '#e0e0e0',
      borderRadius: BALL_SIZE / 2,
    },
    ball: {
      width: BALL_SIZE,
      height: BALL_SIZE,
      borderRadius: BALL_SIZE / 2,
      backgroundColor: '#3498db',
      left: 0,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  Layout.ticker.add(function () {
    TWEEN.update();
  });

  var maxLeft = TRACK_W - BALL_SIZE;
  for (var m = 0; m < easings.length; m++) {
    var ball = Layout.getElementById('ball_' + m);

    var tweenGo = new TWEEN.Tween(ball.style)
      .to({ left: maxLeft }, 2000)
      .easing(easings[m].fn);

    var tweenBack = new TWEEN.Tween(ball.style)
      .to({ left: 0 }, 2000)
      .easing(easings[m].fn)
      .delay(300);

    tweenGo.chain(tweenBack);
    tweenBack.chain(tweenGo);
    tweenGo.start();
  }
};
