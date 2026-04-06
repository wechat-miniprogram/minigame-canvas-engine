var TWEEN = require('./lib/tween');

/**
 * 复刻 tween.js 14_pause_tween
 * 进度条动画，点击 Pause 暂停，点击 Resume 恢复
 */
module.exports = function tween_pause(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  var PADDING = 30;
  var contentH = H - statusBarH;
  var BAR_W = W - PADDING * 2;
  var BAR_H = 120;

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view id="container">\
        <text class="title" value="Pause 暂停/恢复动画"></text>\
        <view class="btnRow">\
          <view class="btn btnPause" id="btnPause">\
            <text class="btnText" value="Pause"></text>\
          </view>\
          <view class="btn btnResume" id="btnResume">\
            <text class="btnText" value="Resume"></text>\
          </view>\
        </view>\
        <view class="barWrapper">\
          <view class="barFill" id="barFill">\
            <text class="barLabel" id="barLabel" value="0%"></text>\
          </view>\
        </view>\
        <text class="stateText" id="stateText" value="状态：播放中"></text>\
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
      alignItems: 'center',
    },
    title: {
      color: '#333333',
      fontSize: 48,
      width: W - PADDING * 2,
      textAlign: 'center',
      height: 120,
      lineHeight: 120,
    },
    btnRow: {
      flexDirection: 'row',
      width: W - PADDING * 2,
      justifyContent: 'center',
      marginTop: 40,
    },
    btn: {
      width: 240,
      height: 90,
      borderRadius: 45,
      alignItems: 'center',
      marginLeft: 20,
      marginRight: 20,
      ':active': {
        transform: 'scale(1.05, 1.05)',
      },
    },
    btnPause: {
      backgroundColor: '#e74c3c',
    },
    btnResume: {
      backgroundColor: '#2ecc71',
    },
    btnText: {
      color: '#ffffff',
      fontSize: 36,
      height: 90,
      lineHeight: 90,
      textAlign: 'center',
    },
    barWrapper: {
      width: BAR_W,
      height: BAR_H,
      backgroundColor: '#e0e0e0',
      borderRadius: 16,
      marginTop: 80,
    },
    barFill: {
      width: 0,
      height: BAR_H,
      backgroundColor: '#a0dde9',
      borderRadius: 16,
    },
    barLabel: {
      color: '#333333',
      fontSize: 40,
      fontWeight: 'bold',
      width: BAR_W,
      height: BAR_H,
      lineHeight: BAR_H,
      textAlign: 'center',
    },
    stateText: {
      color: '#999999',
      fontSize: 36,
      height: 80,
      lineHeight: 80,
      width: W - PADDING * 2,
      textAlign: 'center',
      marginTop: 40,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  var barFill = Layout.getElementById('barFill');
  var barLabel = Layout.getElementById('barLabel');
  var stateText = Layout.getElementById('stateText');
  var btnPause = Layout.getElementById('btnPause');
  var btnResume = Layout.getElementById('btnResume');

  // 用一个中间对象做 tween，在 onUpdate 里同步给 barFill
  var progress = { width: 0 };

  Layout.ticker.add(function () {
    TWEEN.update();
  });

  var tween = new TWEEN.Tween(progress)
    .to({ width: BAR_W }, 2000)
    .delay(500)
    .yoyo(true)
    .repeat(Infinity)
    .onUpdate(function () {
      barFill.style.width = Math.round(progress.width);
      barLabel.value = Math.round(progress.width / BAR_W * 100) + '%';
    })
    .start();

  btnPause.on('click', function () {
    tween.pause();
    stateText.value = '状态：已暂停';
  });

  btnResume.on('click', function () {
    tween.resume();
    stateText.value = '状态：播放中';
  });
};
