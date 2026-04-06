var Matter = require('../lib/matter.min');

/**
 * 复刻 matter.js circleStack
 * 100 个圆球堆叠在容器中，自然坍塌
 */
module.exports = function matter_circleStack(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;
  var contentH = H - statusBarH;

  var Engine = Matter.Engine;
  var Bodies = Matter.Bodies;
  var Composite = Matter.Composite;
  var Composites = Matter.Composites;

  var COLS = 10;
  var ROWS = 10;
  var BALL_R = 30;
  var BALL_COUNT = COLS * ROWS;
  var WALL = 20;
  var TITLE_H = 100;
  var ARENA_H = contentH - TITLE_H;

  // 构建模板
  var balls = '';
  for (var i = 0; i < BALL_COUNT; i++) {
    balls += '<view class="ball" id="cs_' + i + '"></view>';
  }

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view id="container">\
        <text class="title" value="Circle Stack - 圆球堆叠"></text>\
        <view class="arena" id="arena">\
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
      width: BALL_R * 2,
      height: BALL_R * 2,
      borderRadius: BALL_R,
      backgroundColor: '#3498db',
      left: 0,
      top: 0,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  // ─── Matter.js ───
  var engine = Engine.create();
  var world = engine.world;

  // 加大重力，视觉冲击更强
  engine.gravity.y = 2;

  // 三面墙（不加顶部墙，让球从上方自由落入）
  Composite.add(world, [
    Bodies.rectangle(W / 2, ARENA_H + WALL / 2, W, WALL, { isStatic: true }),   // 底
    Bodies.rectangle(-WALL / 2, ARENA_H / 2, WALL, ARENA_H * 2, { isStatic: true }),  // 左
    Bodies.rectangle(W + WALL / 2, ARENA_H / 2, WALL, ARENA_H * 2, { isStatic: true }), // 右
  ]);

  // 10x10 圆球，从 arena 上方掉落
  var startX = (W - (COLS * BALL_R * 2 + (COLS - 1) * 10)) / 2 + BALL_R;
  var startY = -(BALL_R * 2 * ROWS);

  var colors = ['#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c', '#e74c3c', '#f1c40f', '#00bcd4'];
  var ballBodies = [];
  var ballElements = [];

  var idx = 0;
  for (var row = 0; row < ROWS; row++) {
    for (var col = 0; col < COLS; col++) {
      var x = startX + col * (BALL_R * 2 + 10);
      var y = startY + row * (BALL_R * 2);

      var body = Bodies.circle(x, y, BALL_R, {
        restitution: 0.3,
        friction: 0.05,
      });
      Composite.add(world, body);
      ballBodies.push(body);

      var el = Layout.getElementById('cs_' + idx);
      el.style.backgroundColor = colors[idx % colors.length];
      ballElements.push(el);
      idx++;
    }
  }

  // 每帧同步
  Layout.ticker.add(function () {
    Engine.update(engine, 1000 / 60);

    for (var k = 0; k < BALL_COUNT; k++) {
      var b = ballBodies[k];
      var e = ballElements[k];
      e.style.left = Math.round(b.position.x - BALL_R);
      e.style.top = Math.round(b.position.y - BALL_R);
    }
  });
};
