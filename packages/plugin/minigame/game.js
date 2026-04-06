const Layout = requirePlugin('Layout').default;
const demos = require('./demos/index');
const categories = demos.categories || [];

GameGlobal.Layout = Layout;

// 设置游戏画布尺寸
const info = wx.getSystemInfoSync();
const GAME_WIDTH = info.windowWidth * info.pixelRatio;
const GAME_HEIGHT = info.windowHeight * info.pixelRatio;

// 初始化游戏画布
const canvas = wx.createCanvas();
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
const ctx = canvas.getContext('2d');

// ─── 开放数据域（保留原有逻辑） ─────────────────────────────────────────────────

const RANK_WIDTH = 960;
const RANK_HEIGHT = 1410;
let openDataContext = wx.getOpenDataContext();
let sharedCanvas = openDataContext.canvas;
sharedCanvas.width = RANK_WIDTH;
sharedCanvas.height = RANK_HEIGHT;

function updateRankViewPort(rankCanvas) {
  const rect = Layout.getElementViewportRect(rankCanvas);
  openDataContext.postMessage({
    event: 'updateViewPort',
    box: {
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
    },
  });
}

function showRank() {
  openDataContext.postMessage({ event: 'showFriendRank' });
}

function closeRank() {
  openDataContext.postMessage({ event: 'close' });
}

// ─── 双击检测 ──────────────────────────────────────────────────────────────────

let lastTapTime = 0;
let doubleTapCallback = null;

function setupDoubleTap(callback) {
  doubleTapCallback = callback;
}

function clearDoubleTap() {
  doubleTapCallback = null;
}

wx.onTouchEnd((e) => {
  if (!doubleTapCallback) return;
  const now = e.timeStamp || Date.now();
  if (now - lastTapTime < 300) {
    doubleTapCallback();
    lastTapTime = 0;
  } else {
    lastTapTime = now;
  }
});

// ─── Demo 菜单系统 ────────────────────────────────────────────────────────────

// 收集所有 demo 名称（扁平列表，用于事件绑定）
const allDemoNames = Object.keys(demos).filter(k => k !== 'categories');
let currentDemo = null;
let switching = false; // 防止切换期间事件穿透

function resetCanvas() {
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  Layout.updateViewPort({
    x: 0,
    y: 0,
    width: info.windowWidth,
    height: info.windowHeight,
  });
}

/**
 * 渲染 demo 选择菜单（按分类分组）
 */
function showMenu() {
  switching = true;
  Layout.clearAll();
  clearDoubleTap();
  resetCanvas();
  currentDemo = null;

  // 刘海屏安全区域适配
  const safeArea = info.safeArea || { top: 0 };
  const statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  const BTN_H = 110;
  const GAP = 16;
  const COLS = 3;
  const SIDE_PAD = 24;
  const COL_W = Math.floor((GAME_WIDTH - SIDE_PAD * 2) / COLS);

  // 按分类生成模板
  let sections = '';
  const catColors = ['#34a123', '#2980b9', '#d35400'];

  categories.forEach((cat, ci) => {
    const color = catColors[ci % catColors.length];
    let btns = '';
    Object.keys(cat.demos).forEach((name) => {
      const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
      btns += `<text id="demo_${safeName}" class="menuBtn menuBtnC${ci}" value="${name}"></text>`;
    });
    sections += `
      <text class="catTitle catTitleC${ci}" value="${cat.title}"></text>
      <view class="menuGrid">${btns}</view>
    `;
  });

  // 追加开放数据域排行榜
  sections += `
    <text class="catTitle catTitleC${categories.length}" value="开放数据域"></text>
    <view class="menuGrid">
      <text id="demo____" class="menuBtn menuBtnC${categories.length}" value="排行榜(开放数据域)"></text>
    </view>
  `;

  const tpl = `
    <view id="menuContainer">
      <view class="statusBar"></view>
      <text class="menuTitle" value="Layout 示例"></text>
      ${sections}
      <text class="menuTip" value="进入 Demo 后双击屏幕可返回此菜单"></text>
    </view>
  `;

  const style = {
    menuContainer: {
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: '#f3f3f3',
    },
    statusBar: {
      width: GAME_WIDTH,
      height: statusBarH,
    },
    menuTitle: {
      width: GAME_WIDTH,
      height: 130,
      lineHeight: 130,
      fontSize: 60,
      textAlign: 'center',
      color: '#333333',
      fontWeight: 'bold',
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
    },
    catTitle: {
      width: GAME_WIDTH - SIDE_PAD * 2,
      height: 76,
      lineHeight: 76,
      fontSize: 40,
      color: '#999999',
      fontWeight: 'bold',
      marginLeft: SIDE_PAD,
      marginTop: 20,
      borderBottomWidth: 1,
      borderColor: 'rgba(0,0,0,0.06)',
    },
    menuGrid: {
      width: GAME_WIDTH,
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: SIDE_PAD,
      paddingTop: GAP,
      paddingBottom: 0,
    },
    menuBtn: {
      width: COL_W - GAP,
      height: BTN_H,
      lineHeight: BTN_H,
      fontSize: 38,
      textAlign: 'center',
      color: '#ffffff',
      borderRadius: 10,
      margin: GAP / 2,
      ':active': {
        transform: 'scale(1.05, 1.05)',
      },
    },
    menuTip: {
      width: GAME_WIDTH,
      height: 70,
      lineHeight: 70,
      fontSize: 32,
      textAlign: 'center',
      color: 'rgba(0,0,0,0.35)',
      marginTop: 16,
    },
  };

  // 每个分类的按钮颜色 + 标题颜色
  catColors.concat(['#8e44ad']).forEach((color, i) => {
    style['menuBtnC' + i] = { backgroundColor: color };
    style['catTitleC' + i] = { color: color };
  });

  Layout.init(tpl, style);
  Layout.layout(ctx);

  // 延迟绑定事件，确保旧事件链路完全清理
  setTimeout(() => {
    switching = false;

    // 绑定所有 demo 按钮
    allDemoNames.forEach((name) => {
      const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
      const btn = Layout.getElementsById('demo_' + safeName)[0];
      if (btn) {
        btn.on('click', () => {
          if (switching) return;
          runDemo(name);
        });
      }
    });

    // 绑定开放数据域排行榜按钮
    const rankBtn = Layout.getElementsById('demo____')[0];
    if (rankBtn) {
      rankBtn.on('click', () => {
        if (switching) return;
        runOpenDataRank();
      });
    }
  }, 100);
}

/**
 * 运行指定 demo
 */
function runDemo(name) {
  if (switching) return;
  switching = true;
  Layout.clearAll();
  currentDemo = name;
  resetCanvas();

  // 先将画布清为浅色底
  ctx.fillStyle = '#f3f3f3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 延迟一帧再跑 demo，确保旧事件完全清理
  setTimeout(() => {
    switching = false;

    // 注册双击返回
    setupDoubleTap(() => {
      if (switching) return;
      console.log('[Demo] 双击返回菜单');
      showMenu();
    });

    try {
      demos[name](Layout, canvas, ctx);
      console.log(`[Demo] 运行 ${name}，双击屏幕返回菜单`);
    } catch (e) {
      console.error(`[Demo] ${name} 运行出错:`, e);
      setTimeout(() => showMenu(), 1000);
    }
  }, 50);
}

/**
 * 运行原有的排行榜功能（开放数据域）
 */
function runOpenDataRank() {
  if (switching) return;
  switching = true;
  Layout.clearAll();
  currentDemo = 'rank';
  resetCanvas();

  ctx.fillStyle = '#f3f3f3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  setTimeout(() => {
    switching = false;

    setupDoubleTap(() => {
      if (switching) return;
      closeRank();
      if (typeof updateRankFn === 'function') Layout.ticker.remove(updateRankFn);
      console.log('[Demo] 双击返回菜单');
      showMenu();
    });

    const tpl = `
      <view id="container">
        <canvas id="rank" width="960" height="1410"></canvas>
        <text id="rankText" value="打开排行榜"></text>
      </view>
    `;

    const style = {
      container: {
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: '#f3f3f3',
        justifyContent: 'center',
        alignItems: 'center',
      },
      rankText: {
        color: '#ffffff',
        backgroundColor: '#34a123',
        borderRadius: 10,
        width: 400,
        height: 120,
        lineHeight: 120,
        fontSize: 50,
        textAlign: 'center',
        marginTop: 20,
        ':active': {
          transform: 'scale(1.05, 1.05)',
        },
      },
      rank: {
        width: RANK_WIDTH,
        height: RANK_HEIGHT,
      },
    };

    Layout.init(tpl, style);
    Layout.layout(ctx);

    const testText = Layout.getElementsById('rankText')[0];
    const rank = Layout.getElementsById('rank')[0];

    var updateRankFn = () => {
      rank.update();
    };

    testText.on('click', () => {
      if (testText.value === '打开排行榜') {
        testText.value = '关闭排行榜';
        updateRankViewPort(rank);
        rank.canvas = sharedCanvas;
        showRank();
        Layout.ticker.add(updateRankFn);
      } else {
        testText.value = '打开排行榜';
        closeRank();
        Layout.ticker.remove(updateRankFn);
      }
    });

    console.log('[Demo] 运行排行榜(开放数据域)，双击屏幕返回菜单');
  }, 50);
}

// 启动菜单
showMenu();
