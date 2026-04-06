var Matter = require('../lib/matter.min');

/**
 * 复刻 matter.js ballPool
 * 物理引擎计算 + Layout 渲染，80 个随机大小的球在容器内弹跳
 */
module.exports = function matter_ballPool(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;
  var contentH = H - statusBarH;

  var Engine = Matter.Engine;
  var Bodies = Matter.Bodies;
  var Composite = Matter.Composite;
  var Runner = Matter.Runner;

  var BALL_COUNT = 80;
  var WALL = 20;

  // 构建模板：球 + 几个静态障碍物（用 view 表示）
  var balls = '';
  for (var i = 0; i < BALL_COUNT; i++) {
    balls += '<view class="ball" id="ball_' + i + '"></view>';
  }

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view id="container">\
        <text class="title" value="Ball Pool - 物理球池"></text>\
        <view class="arena" id="arena">\
          ' + balls + '\
          <view class="obstacle" id="obs0"></view>\
          <view class="obstacle" id="obs1"></view>\
          <view class="obstacle" id="obs2"></view>\
        </view>\
      </view>\
    </view>\
  ';

  var TITLE_H = 100;
  var ARENA_H = contentH - TITLE_H - 30;

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
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#3498db',
      left: 0,
      top: 0,
    },
    obstacle: {
      position: 'absolute',
      backgroundColor: '#e74c3c',
      borderRadius: 8,
      left: 0,
      top: 0,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  // ─── Matter.js 物理世界 ───
  var engine = Engine.create();
  var world = engine.world;

  // 墙壁（静态）
  Composite.add(world, [
    Bodies.rectangle(W / 2, ARENA_H + WALL / 2, W, WALL, { isStatic: true }),   // 底
    Bodies.rectangle(W / 2, -WALL / 2, W, WALL, { isStatic: true }),             // 顶
    Bodies.rectangle(-WALL / 2, ARENA_H / 2, WALL, ARENA_H, { isStatic: true }),  // 左
    Bodies.rectangle(W + WALL / 2, ARENA_H / 2, WALL, ARENA_H, { isStatic: true }), // 右
  ]);

  // 障碍物（静态多边形，用矩形模拟）
  var obsData = [
    { x: W * 0.25, y: ARENA_H * 0.45, w: 200, h: 30, angle: 0.3 },
    { x: W * 0.65, y: ARENA_H * 0.35, w: 200, h: 30, angle: -0.25 },
    { x: W * 0.45, y: ARENA_H * 0.7, w: 250, h: 30, angle: 0.15 },
  ];

  var obsElements = [];
  for (var oi = 0; oi < obsData.length; oi++) {
    var od = obsData[oi];
    var obsBody = Bodies.rectangle(od.x, od.y, od.w, od.h, {
      isStatic: true,
      angle: od.angle,
    });
    Composite.add(world, obsBody);

    var obsEl = Layout.getElementById('obs' + oi);
    obsEl.style.width = od.w;
    obsEl.style.height = od.h;
    obsEl.style.left = Math.round(od.x - od.w / 2);
    obsEl.style.top = Math.round(od.y - od.h / 2);
    obsEl.style.transform = 'rotate(' + Math.round(od.angle * 180 / Math.PI) + 'deg)';
    obsElements.push(obsEl);
  }

  // 球体
  var ballBodies = [];
  var ballElements = [];
  var colors = ['#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c', '#e74c3c', '#f1c40f', '#00bcd4'];

  for (var bi = 0; bi < BALL_COUNT; bi++) {
    var radius = 15 + Math.floor(Math.random() * 25); // 15~40
    var bx = 50 + Math.random() * (W - 100);
    var by = 20 + Math.random() * (ARENA_H * 0.3);

    var body = Bodies.circle(bx, by, radius, {
      restitution: 0.6,
      friction: 0.1,
    });
    Composite.add(world, body);
    ballBodies.push(body);

    var el = Layout.getElementById('ball_' + bi);
    var d = radius * 2;
    el.style.width = d;
    el.style.height = d;
    el.style.borderRadius = radius;
    el.style.backgroundColor = colors[bi % colors.length];
    ballElements.push(el);
  }

  // 每帧同步物理位置到 Layout 节点
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
