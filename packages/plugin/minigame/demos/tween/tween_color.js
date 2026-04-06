var TWEEN = require('../lib/tween');

/**
 * 复刻 tween.js 02_black_and_red
 * 64x64 = 4096 个色块，波浪式渐变动画
 */
module.exports = function tween_color(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  var PADDING = 30;
  var contentH = H - statusBarH;
  var GRID = 64;
  var GAP = 1;
  var CELL = Math.floor((W - PADDING * 2 - GAP * (GRID - 1)) / GRID);
  var GRID_W = CELL * GRID + GAP * (GRID - 1);

  // 构建 64x64 网格模板
  var rows = '';
  for (var r = 0; r < GRID; r++) {
    var cells = '';
    for (var c = 0; c < GRID; c++) {
      var id = 'c_' + r + '_' + c;
      cells += '<view class="cell" id="' + id + '"></view>';
    }
    rows += '<view class="row">' + cells + '</view>';
  }

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view id="container">\
        <text class="title" value="Black & Red - 4096色块渐变"></text>\
        <view class="grid">\
          ' + rows + '\
        </view>\
      </view>\
    </view>\
  ';

  var style = {
    wrapper: {
      width: W,
      height: H,
      backgroundColor: '#000000',
    },
    statusBar: {
      width: W,
      height: statusBarH,
    },
    container: {
      width: W,
      height: contentH,
      backgroundColor: '#000000',
      padding: PADDING,
      alignItems: 'center',
    },
    title: {
      color: '#ff4444',
      fontSize: 48,
      width: W - PADDING * 2,
      textAlign: 'center',
      height: 100,
      lineHeight: 100,
    },
    grid: {
      width: GRID_W,
      marginTop: 20,
    },
    row: {
      flexDirection: 'row',
      width: GRID_W,
      height: CELL + GAP,
    },
    cell: {
      width: CELL,
      height: CELL,
      backgroundColor: '#000000',
      marginRight: GAP,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  Layout.ticker.add(function () {
    TWEEN.update();
  });

  var index = 0;
  for (var ri = 0; ri < GRID; ri++) {
    for (var ci = 0; ci < GRID; ci++) {
      var cell = Layout.getElementById('c_' + ri + '_' + ci);
      if (!cell) continue;

      var data = { value: 0, el: cell };

      var updateFn = function (obj) {
        var v = Math.floor(obj.value * 255);
        obj.el.style.backgroundColor = 'rgb(' + v + ', 0, 0)';
      };

      var tweenGo = new TWEEN.Tween(data)
        .to({ value: 1 }, 8000)
        .delay((0.001 * index + Math.random()) * 500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(updateFn);

      var tweenBack = new TWEEN.Tween(data)
        .to({ value: 0 }, 4000)
        .delay((0.001 * index + Math.random()) * 500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(updateFn);

      tweenGo.chain(tweenBack);
      tweenBack.chain(tweenGo);
      tweenGo.start();

      index++;
    }
  }
};
