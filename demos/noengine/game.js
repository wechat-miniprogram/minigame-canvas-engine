import Layout from './engine';
import { activeTheme, palette } from './theme.config';
// const Layout = requirePlugin('Layout').default;

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

// 初始化开放数据域
const RANK_WIDTH = 960;
const RANK_HEIGHT = 1410;
let openDataContext = wx.getOpenDataContext();
let sharedCanvas = openDataContext.canvas;
sharedCanvas.width = RANK_WIDTH;
sharedCanvas.height = RANK_HEIGHT;

function updateRankViewPort(rankCanvas) {
  // const rect = rankCanvas.getViewportRect();
  const rect = Layout.getElementViewportRect(rankCanvas);

  openDataContext.postMessage({
    event: 'updateViewPort',
    box: {
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
    }
  });
}

function showRank() {
  openDataContext.postMessage({
    event: 'showFriendRank',
  });
}

function closeRank() {
  openDataContext.postMessage({
    event: 'close',
  });
}

const rankOpenText = activeTheme === 'lobster' ? '打开龙虾榜' : '打开排行榜';
const rankCloseText = activeTheme === 'lobster' ? '关闭龙虾榜' : '关闭排行榜';

let template = `
  <view id="container">
    <canvas id="rank" width="960" height="1410"></canvas>
    <text id="rankText" value="${rankOpenText}"></text>
  </view>
`;

let style = {
  container: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: palette.pageBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    backgroundColor: palette.primary,
    borderRadius: 10,
    color: palette.textOnPrimary,
    width: 400,
    height: 120,
    lineHeight: 120,
    fontSize: 50,
    textAlign: 'center',
    marginTop: 20,
    // textShadow: '2px 2px 2px red',
    ':active': {
      transform: 'scale(1.05, 1.05)',
    }
  },

  rank: {
    width: RANK_WIDTH,
    height: RANK_HEIGHT,
  }
}

Layout.init(template, style);

Layout.updateViewPort({
  x: 0,
  y: 0,
  width: info.windowWidth,
  height: info.windowHeight,
});

Layout.layout(ctx);

const testText = Layout.getElementsById('rankText')[0];
const rank = Layout.getElementsById('rank')[0];

const updateRank = () => {
  rank.update();
}

testText.on('click', () => {
  if (testText.value === rankOpenText) {
    testText.value = rankCloseText;
    // 更新开放数据域最终被绘制到屏幕的位置，方便开放数据域做事件处理
    updateRankViewPort(rank);

    // 手动指定排行榜的 canvas 实例
    rank.canvas = sharedCanvas;

    // 发送事件到开放数据域，要求加载好友数据并展示
    showRank();

    // 要求Layout每帧刷新开放数据域 canvas 的绘制
    Layout.ticker.add(updateRank);
  } else {
    testText.value = rankOpenText;
    closeRank();
    Layout.ticker.remove(updateRank);
  }
});
