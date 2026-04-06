var Matter = require('../lib/matter.min');

/**
 * 复刻 matter.js avalanche
 * 100 个圆球从三层倾斜平面上滚落（雪崩效果）
 * 斜面是静态矩形，提前用 transform rotate 渲染好角度
 */
module.exports = function matter_avalanche(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;
  var contentH = H - statusBarH;

  var Engine = Matter.Engine;
  var Bodies = Matter.Bodies;
  var Composite = Matter.Composite;
  var Common = Matter.Common;

  var BALL_COUNT = 100;
  var TITLE_H = 100;
  var ARENA_H = contentH - TITLE_H;

  // 三层斜面数据
  var ramps = [
    { x: W * 0.35, y: ARENA_H * 0.22, w: W * 0.8, h: 24, angle: Math.PI * 0.06 },
    { x: W * 0.6,  y: ARENA_H * 0.48, w: W * 0.8, h: 24, angle: -Math.PI * 0.06 },
    { x: W * 0.45, y: ARENA_H * 0.78, w: W * 0.8, h: 24, angle: Math.PI * 0.04 },
  ];

  // 构建模板
  var balls = '';
  for (var i = 0; i < BALL_COUNT; i++) {
    balls += '<view class="ball" id="av_' + i + '"></view>';
  }
  var rampViews = '';
  for (var ri = 0; ri < ramps.length; ri++) {
    rampViews += '<view class="ramp" id="ramp_' + ri + '"></view>';
  }

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view id="container">\
        <text class="title" value="Avalanche - 雪崩"></text>\
        <view class="arena" id="arena">\
          ' + rampViews + '\
          ' + balls + '\
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
    },
    title: {
      color: '#333333',
      fontSize: 48,
      width: W,
      textAlign: 'center',
      height: TITLE_H,
      lineHeight: TITLE_H,
    },
    arena: {
      width: W,
      height: ARENA_H,
      backgroundColor: '#1a1a2e',
      position: 'relative',
    },
    ball: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#3498db',
      left: 0,
      top: 0,
    },
    ramp: {
      position: 'absolute',
      backgroundColor: '#e74c3c',
      borderRadius: 6,
      left: 0,
      top: 0,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  // ─── Matter.js ───
  var engine = Engine.create();
  var world = engine.world;

  // 底部地面
  Composite.add(world, [
    Bodies.rectangle(W / 2, ARENA_H + 10, W * 2, 20, { isStatic: true }),
  ]);

  // 三层斜面
  for (var rj = 0; rj < ramps.length; rj++) {
    var rd = ramps[rj];
    Composite.add(world, Bodies.rectangle(rd.x, rd.y, rd.w, rd.h, {
      isStatic: true,
      angle: rd.angle,
    }));

    var rampEl = Layout.getElementById('ramp_' + rj);
    rampEl.style.width = Math.round(rd.w);
    rampEl.style.height = Math.round(rd.h);
    rampEl.style.left = Math.round(rd.x - rd.w / 2);
    rampEl.style.top = Math.round(rd.y - rd.h / 2);
    rampEl.style.transform = 'rotate(' + (rd.angle * 180 / Math.PI).toFixed(1) + 'deg)';
  }

  // 球体
  var colors = ['#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c', '#f1c40f', '#00bcd4', '#e91e63'];
  var ballBodies = [];
  var ballElements = [];

  for (var bi = 0; bi < BALL_COUNT; bi++) {
    var radius = 10 + Math.floor(Common.random(5, 20));
    var bx = 30 + Common.random(0, W - 60);
    var by = Common.random(10, ARENA_H * 0.15);

    var body = Bodies.circle(bx, by, radius, {
      friction: 0.00001,
      restitution: 0.5,
      density: 0.001,
    });
    Composite.add(world, body);
    ballBodies.push(body);

    var el = Layout.getElementById('av_' + bi);
    var d = radius * 2;
    el.style.width = d;
    el.style.height = d;
    el.style.borderRadius = radius;
    el.style.backgroundColor = colors[bi % colors.length];
    ballElements.push(el);
  }

  // 每帧同步
  Layout.ticker.add(function () {
    Engine.update(engine, 1000 / 60);

    for (var k = 0; k < BALL_COUNT; k++) {
      var b = ballBodies[k];
      var e = ballElements[k];
      var r = b.circleRadius;
      e.style.left = Math.round(b.position.x - r);
      e.style.top = Math.round(b.position.y - r);
    }
  });
};
