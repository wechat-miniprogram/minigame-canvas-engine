var Matter = require('../lib/matter.min');

/**
 * 弹球游戏 - 物理弹珠台
 * 点击顶部"点击发射"按钮发球，球碰障碍物扣血消除，落底回收
 */
module.exports = function matter_pinball(Layout, canvas, ctx) {
  var W = canvas.width;
  var H = canvas.height;

  var info = wx.getSystemInfoSync();
  var safeArea = info.safeArea || { top: 0 };
  var statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;
  var contentH = H - statusBarH;

  var Engine = Matter.Engine;
  var Bodies = Matter.Bodies;
  var Body = Matter.Body;
  var Composite = Matter.Composite;
  var Events = Matter.Events;

  var BALL_R = 18;
  var MAX_BALLS = 10;
  var WALL = 20;
  var BTN_H = 110;
  var ARENA_H = contentH - BTN_H;

  // ─── 障碍物配置 ───
  var obstacles = [];
  var OBS_COLS = 4;
  var OBS_ROWS = 5;
  var cellW = (W - 120) / OBS_COLS;
  var cellH = (ARENA_H * 0.5) / OBS_ROWS;
  var obsStartY = ARENA_H * 0.25;

  for (var row = 0; row < OBS_ROWS; row++) {
    for (var col = 0; col < OBS_COLS; col++) {
      var offsetX = (row % 2 === 0) ? 0 : cellW * 0.5;
      var ox = 80 + col * cellW + offsetX;
      var oy = obsStartY + row * cellH;
      if (Math.random() < 0.25) continue;

      var hp = Math.floor(Math.random() * 5) + 1;
      if (Math.random() < 0.5) {
        obstacles.push({ shape: 'rect', x: ox, y: oy, w: 80, h: 80, hp: hp });
      } else {
        obstacles.push({ shape: 'circle', x: ox, y: oy, r: 40, hp: hp });
      }
    }
  }

  // ─── 构建模板 ───
  var ballViews = '';
  for (var bi = 0; bi < MAX_BALLS; bi++) {
    ballViews += '<view class="ball" id="pb_' + bi + '"></view>';
  }

  var obsViews = '';
  for (var oi = 0; oi < obstacles.length; oi++) {
    var ob = obstacles[oi];
    obsViews += '<view class="obs" id="obs_' + oi + '"><text class="obsText" id="obsT_' + oi + '" value="' + ob.hp + '"></text></view>';
  }

  var tpl = '\
    <view id="wrapper">\
      <view class="statusBar"></view>\
      <view class="topBar">\
        <text class="launchBtn" id="launchBtn" value="▶ 点击发射"></text>\
        <text class="scoreLabel" id="scoreLabel" value="得分: 0"></text>\
      </view>\
      <view class="arena" id="arena">\
        <view class="funnelL" id="funnelL"></view>\
        <view class="funnelR" id="funnelR"></view>\
        ' + obsViews + '\
        ' + ballViews + '\
      </view>\
    </view>\
  ';

  var obsColors = ['#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#2ecc71'];

  var style = {
    wrapper: { width: W, height: H, backgroundColor: '#000000' },
    statusBar: { width: W, height: statusBarH },
    topBar: {
      width: W, height: BTN_H,
      backgroundColor: '#111111',
      flexDirection: 'row',
      alignItems: 'center',
    },
    launchBtn: {
      color: '#000000', fontSize: 40, fontWeight: 'bold',
      backgroundColor: '#f1c40f', borderRadius: 16,
      width: 320, height: 80, lineHeight: 80,
      textAlign: 'center', marginLeft: 30,
      ':active': { transform: 'scale(1.05, 1.05)' },
    },
    scoreLabel: {
      color: '#f1c40f', fontSize: 42,
      width: W - 380, textAlign: 'center',
      height: BTN_H, lineHeight: BTN_H,
    },
    arena: { width: W, height: ARENA_H, backgroundColor: '#0a0a0a', position: 'relative' },
    ball: {
      position: 'absolute', width: BALL_R * 2, height: BALL_R * 2,
      borderRadius: BALL_R, backgroundColor: '#ffffff',
      left: -100, top: -100,
    },
    funnelL: { position: 'absolute', width: 280, height: 8, backgroundColor: '#444444', borderRadius: 4, left: 0, top: 0 },
    funnelR: { position: 'absolute', width: 280, height: 8, backgroundColor: '#444444', borderRadius: 4, left: 0, top: 0 },
    obs: { position: 'absolute', alignItems: 'center', left: 0, top: 0 },
    obsText: { color: '#000000', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  // ─── Matter.js 物理世界 ───
  var engine = Engine.create();
  var world = engine.world;
  engine.gravity.y = 1.5;

  // 墙壁：底部收集区（不挡，用 sensor 检测）、左、右
  var floor = Bodies.rectangle(W / 2, ARENA_H + WALL, W + 100, WALL * 2, { isStatic: true, label: 'floor' });
  Composite.add(world, [
    floor,
    Bodies.rectangle(-WALL / 2, ARENA_H / 2, WALL, ARENA_H * 2, { isStatic: true }),
    Bodies.rectangle(W + WALL / 2, ARENA_H / 2, WALL, ARENA_H * 2, { isStatic: true }),
  ]);

  // V 型顶部漏斗
  var funnelAngle = 0.12;
  Composite.add(world, [
    Bodies.rectangle(W * 0.22, 80, 280, 8, { isStatic: true, angle: Math.PI * funnelAngle }),
    Bodies.rectangle(W * 0.78, 80, 280, 8, { isStatic: true, angle: -Math.PI * funnelAngle }),
  ]);
  var fLEl = Layout.getElementById('funnelL');
  var fREl = Layout.getElementById('funnelR');
  fLEl.style.left = Math.round(W * 0.22 - 140); fLEl.style.top = 76;
  fLEl.style.transform = 'rotate(' + (funnelAngle * 180 / Math.PI).toFixed(1) + 'deg)';
  fREl.style.left = Math.round(W * 0.78 - 140); fREl.style.top = 76;
  fREl.style.transform = 'rotate(' + (-funnelAngle * 180 / Math.PI).toFixed(1) + 'deg)';

  // ─── 障碍物物理体 ───
  var obsBodies = [];
  var obsElements = [];
  var obsTextEls = [];
  var obsHP = [];

  for (var oj = 0; oj < obstacles.length; oj++) {
    var od = obstacles[oj];
    var obsBody;
    var el = Layout.getElementById('obs_' + oj);
    var tEl = Layout.getElementById('obsT_' + oj);
    var color = obsColors[od.hp % obsColors.length];

    if (od.shape === 'rect') {
      obsBody = Bodies.rectangle(od.x, od.y, od.w, od.h, { isStatic: true, label: 'obs_' + oj });
      el.style.width = od.w; el.style.height = od.h; el.style.borderRadius = 12;
      el.style.left = Math.round(od.x - od.w / 2); el.style.top = Math.round(od.y - od.h / 2);
      tEl.style.width = od.w; tEl.style.height = od.h; tEl.style.lineHeight = od.h;
    } else {
      var dd = od.r * 2;
      obsBody = Bodies.circle(od.x, od.y, od.r, { isStatic: true, label: 'obs_' + oj });
      el.style.width = dd; el.style.height = dd; el.style.borderRadius = od.r;
      el.style.left = Math.round(od.x - od.r); el.style.top = Math.round(od.y - od.r);
      tEl.style.width = dd; tEl.style.height = dd; tEl.style.lineHeight = dd;
    }
    el.style.backgroundColor = color;

    Composite.add(world, obsBody);
    obsBodies.push(obsBody);
    obsElements.push(el);
    obsTextEls.push(tEl);
    obsHP.push(od.hp);
  }

  // ─── 球 ───
  var ballBodies = []; // 物理体（发射时动态创建）
  var ballElements = [];
  var ballAlive = [];
  for (var bj = 0; bj < MAX_BALLS; bj++) {
    ballElements.push(Layout.getElementById('pb_' + bj));
    ballBodies.push(null);
    ballAlive.push(false);
  }

  // ─── 游戏状态 ───
  var score = 0;
  var scoreEl = Layout.getElementById('scoreLabel');
  var launchBtn = Layout.getElementById('launchBtn');

  function addScore(n) {
    score += n;
    scoreEl.value = '得分: ' + score;
  }

  // ─── 碰撞 ───
  Events.on(engine, 'collisionStart', function (event) {
    var pairs = event.pairs;
    for (var pi = 0; pi < pairs.length; pi++) {
      var a = pairs[pi].bodyA;
      var b = pairs[pi].bodyB;

      var obsLabel = null;
      if (a.label && a.label.indexOf('pb_') === 0 && b.label && b.label.indexOf('obs_') === 0) {
        obsLabel = b.label;
      } else if (b.label && b.label.indexOf('pb_') === 0 && a.label && a.label.indexOf('obs_') === 0) {
        obsLabel = a.label;
      }

      if (obsLabel) {
        var idx = parseInt(obsLabel.split('_')[1]);
        if (obsHP[idx] > 0) {
          obsHP[idx]--;
          addScore(1);
          if (obsHP[idx] <= 0) {
            obsElements[idx].style.display = 'none';
            Composite.remove(world, obsBodies[idx]);
          } else {
            obsTextEls[idx].value = '' + obsHP[idx];
            obsElements[idx].style.backgroundColor = obsColors[obsHP[idx] % obsColors.length];
          }
        }
      }
    }
  });

  // ─── 发射 ───
  var launching = false;

  function clearAllBalls() {
    for (var ci = 0; ci < MAX_BALLS; ci++) {
      if (ballBodies[ci]) {
        Composite.remove(world, ballBodies[ci]);
        ballBodies[ci] = null;
      }
      ballAlive[ci] = false;
      ballElements[ci].style.left = -100;
      ballElements[ci].style.top = -100;
    }
  }

  function doLaunch() {
    if (launching) return;
    launching = true;
    launchBtn.value = '发射中...';

    // 先回收所有旧球
    clearAllBalls();

    var fired = 0;
    var iv = setInterval(function () {
      if (fired >= MAX_BALLS) {
        clearInterval(iv);
        launching = false;
        launchBtn.value = '▶ 再来一轮';
        return;
      }

      // 动态创建物理体，随机发射位置
      var startX = W * 0.2 + Math.random() * W * 0.6;
      var body = Bodies.circle(startX, -20, BALL_R, {
        restitution: 0.5,
        friction: 0.01,
        frictionAir: 0,
        label: 'pb_' + fired,
      });
      // 随机角度发射，速度更快
      var angle = (Math.random() - 0.5) * 1.2; // -0.6 ~ 0.6 弧度
      var speed = 18 + Math.random() * 8;       // 18~26
      Body.setVelocity(body, {
        x: Math.sin(angle) * speed,
        y: Math.cos(angle) * speed,
      });
      Composite.add(world, body);
      ballBodies[fired] = body;
      ballAlive[fired] = true;
      fired++;
    }, 150);
  }

  launchBtn.on('click', function () {
    doLaunch();
  });

  // ─── 每帧同步 ───
  Layout.ticker.add(function () {
    Engine.update(engine, 1000 / 60);

    for (var k = 0; k < MAX_BALLS; k++) {
      if (!ballAlive[k] || !ballBodies[k]) continue;
      var b = ballBodies[k];
      var e = ballElements[k];
      e.style.left = Math.round(b.position.x - BALL_R);
      e.style.top = Math.round(b.position.y - BALL_R);

      // 落出底部
      if (b.position.y > ARENA_H + 60) {
        ballAlive[k] = false;
        e.style.left = -100;
        e.style.top = -100;
        Composite.remove(world, b);
        ballBodies[k] = null;
      }
    }
  });
};
