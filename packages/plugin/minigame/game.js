const Layout = requirePlugin('Layout').default;
const demos = require('./demos/index');

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

// 把排行榜也加入菜单
const allDemoNames = Object.keys(demos).concat(['排行榜(开放数据域)']);
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
 * 渲染 demo 选择菜单
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

  const BTN_H = 130;
  const GAP = 24;
  const COLS = 2;
  const COL_W = Math.floor(GAME_WIDTH / COLS);

  let buttons = '';
  allDemoNames.forEach((name) => {
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
    buttons += `<text id="demo_${safeName}" class="menuBtn" value="${name}"></text>`;
  });

  const tpl = `
    <view id="menuContainer">
      <view class="statusBar"></view>
      <text class="menuTitle" value="Layout 示例"></text>
      <view class="menuGrid">
        ${buttons}
      </view>
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
      height: 160,
      lineHeight: 160,
      fontSize: 72,
      textAlign: 'center',
      color: '#333333',
      fontWeight: 'bold',
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
    },
    menuGrid: {
      width: GAME_WIDTH,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: GAP,
    },
    menuBtn: {
      width: COL_W - GAP * 2,
      height: BTN_H,
      lineHeight: BTN_H,
      fontSize: 42,
      textAlign: 'center',
      color: '#ffffff',
      backgroundColor: '#34a123',
      borderRadius: 12,
      margin: GAP / 2,
      ':active': {
        transform: 'scale(1.05, 1.05)',
      },
    },
    menuTip: {
      width: GAME_WIDTH,
      height: 80,
      lineHeight: 80,
      fontSize: 32,
      textAlign: 'center',
      color: 'rgba(0,0,0,0.4)',
      marginTop: 20,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  // 延迟绑定事件，确保旧事件链路完全清理
  setTimeout(() => {
    switching = false;
    allDemoNames.forEach((name) => {
      const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
      const btn = Layout.getElementsById('demo_' + safeName)[0];
      if (btn) {
        btn.on('click', () => {
          if (switching) return;
          if (name === '排行榜(开放数据域)') {
            runOpenDataRank();
          } else {
            runDemo(name);
          }
        });
      }
    });
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
