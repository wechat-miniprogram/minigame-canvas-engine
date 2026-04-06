module.exports = function scrollviewDemo(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  const info = wx.getSystemInfoSync();
  const safeArea = info.safeArea || { top: 0 };
  const statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  const IMG_URL = 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg';
  const COLORS = ['#4FC3F7', '#FF8A65', '#81C784', '#BA68C8', '#FFD54F', '#E57373', '#4DB6AC', '#7986CB'];
  const PADDING = 30;
  const CONTENT_W = W - PADDING * 2;
  const HEADER_H = 100;
  const BODY_H = H - statusBarH - HEADER_H;

  // 三个区域的高度分配
  const SUBTITLE_H = 60;
  const GAP = 10;
  // 纵向列表、横向卡片、混合滚动各占的高度
  var remaining = BODY_H - SUBTITLE_H * 3 - GAP * 3 - PADDING * 2 - 20;
  var VERTICAL_H = Math.floor(remaining * 0.38);
  var HORIZONTAL_H = Math.floor(remaining * 0.28);
  var BOTH_H = Math.floor(remaining * 0.34);

  var CARD_W = 220;

  // 生成纵向列表项
  let listItems = '';
  for (let i = 0; i < 20; i++) {
    listItems += `
      <view class="listItem listItemBg${i % 2}">
        <text class="listIndex" value="${i + 1}"></text>
        <image src="${IMG_URL}" class="listAvatar"></image>
        <text class="listName" value="玩家${i + 1}"></text>
        <text class="listScore" value="${Math.floor(Math.random() * 1000)}分"></text>
      </view>`;
  }

  // 生成横向卡片
  let cards = '';
  for (let i = 0; i < 6; i++) {
    cards += `
      <view class="card card${i}">
        <image src="${IMG_URL}" class="cardImg"></image>
        <text class="cardLabel" value="卡片${i + 1}"></text>
      </view>`;
  }

  // 生成横竖混合网格内容（宽高都超出容器）
  let gridRows = '';
  for (let row = 0; row < 8; row++) {
    let cells = '';
    for (let col = 0; col < 10; col++) {
      var idx = row * 10 + col;
      cells += `
        <view class="gridCell gridColor${idx % 8}">
          <text class="gridCellText" value="${idx + 1}"></text>
        </view>`;
    }
    gridRows += `<view class="gridRow">${cells}</view>`;
  }

  const tpl = `
    <view id="wrapper">
      <view class="statusBar"></view>
      <view class="header">
        <text class="title" value="ScrollView 滚动容器示例"></text>
      </view>
      <view class="body">
        <text class="subtitle" value="纵向滚动 scrollY"></text>
        <scrollview class="verticalList" scrollY="true">
          ${listItems}
        </scrollview>

        <text class="subtitle subtitleGap" value="横向滚动 scrollX"></text>
        <scrollview class="horizontalList" scrollX="true">
          ${cards}
        </scrollview>

        <text class="subtitle subtitleGap" value="横竖混合滚动 scrollX + scrollY"></text>
        <scrollview class="bothList" scrollX="true" scrollY="true">
          ${gridRows}
        </scrollview>
      </view>
    </view>
  `;

  var GRID_CELL = 120;

  const style = {
    wrapper: {
      width: W,
      height: H,
      backgroundColor: '#f7f7f7',
    },
    statusBar: {
      width: W,
      height: statusBarH,
    },
    header: {
      width: W,
      height: HEADER_H,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: '#e0e0e0',
    },
    title: {
      width: W,
      height: HEADER_H,
      lineHeight: HEADER_H,
      fontSize: 48,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    body: {
      width: W,
      height: BODY_H,
      padding: PADDING,
    },
    subtitle: {
      width: CONTENT_W,
      height: SUBTITLE_H,
      lineHeight: SUBTITLE_H,
      fontSize: 36,
      color: '#666666',
    },
    subtitleGap: {
      marginTop: 20,
    },

    // 纵向滚动
    verticalList: {
      width: CONTENT_W,
      height: VERTICAL_H,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      marginTop: GAP,
    },
    listItem: {
      width: CONTENT_W,
      height: 120,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 16,
      paddingRight: 16,
    },
    listItemBg0: { backgroundColor: '#f7f7f7' },
    listItemBg1: { backgroundColor: '#ffffff' },
    listIndex: {
      width: 70,
      height: 120,
      lineHeight: 120,
      fontSize: 36,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#999999',
    },
    listAvatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
    },
    listName: {
      fontSize: 36,
      color: '#333333',
      marginLeft: 20,
      width: 280,
      height: 120,
      lineHeight: 120,
    },
    listScore: {
      fontSize: 34,
      color: '#FF8A65',
      fontWeight: 'bold',
      textAlign: 'right',
      width: 180,
      height: 120,
      lineHeight: 120,
    },

    // 横向滚动
    horizontalList: {
      width: CONTENT_W,
      height: HORIZONTAL_H,
      flexDirection: 'row',
      marginTop: GAP,
    },
    card: {
      width: CARD_W,
      height: HORIZONTAL_H - 20,
      borderRadius: 16,
      marginRight: 20,
      alignItems: 'center',
    },
    cardImg: {
      width: CARD_W - 40,
      height: CARD_W - 40,
      borderRadius: 12,
      marginTop: 15,
    },
    cardLabel: {
      width: CARD_W,
      height: 40,
      lineHeight: 40,
      fontSize: 30,
      color: '#ffffff',
      textAlign: 'center',
      marginTop: 8,
    },

    // 横竖混合滚动
    bothList: {
      width: CONTENT_W,
      height: BOTH_H,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      marginTop: GAP,
    },
    gridRow: {
      flexDirection: 'row',
    },
    gridCell: {
      width: GRID_CELL,
      height: GRID_CELL,
      margin: 6,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gridCellText: {
      width: GRID_CELL,
      height: GRID_CELL,
      lineHeight: GRID_CELL,
      fontSize: 34,
      color: '#ffffff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  // 卡片和网格颜色
  COLORS.forEach((c, i) => {
    style['card' + i] = { backgroundColor: c };
    style['gridColor' + i] = { backgroundColor: c };
  });

  Layout.init(tpl, style);
  Layout.layout(ctx);
};
