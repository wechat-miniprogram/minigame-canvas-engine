module.exports = function canvasDemo(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  const tpl = `
    <view id="container">
      <canvas id="rank" width="${W}" height="${Math.floor(H * 0.85)}"></canvas>
      <text id="rankText" value="打开排行榜"></text>
    </view>
  `;

  const style = {
    container: {
      width: W,
      height: H,
      backgroundColor: '#f3f3f3',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rankText: {
      color: '#ffffff',
      backgroundColor: '#34a123',
      borderRadius: 10,
      width: 400,
      height: 100,
      lineHeight: 100,
      fontSize: 40,
      textAlign: 'center',
      marginTop: 20,
    },
    rank: {
      width: W * 0.75,
      height: Math.floor(H * 0.7),
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  const testText = Layout.getElementsById('rankText')[0];
  const rank = Layout.getElementsById('rank')[0];

  // 手动创建一个 canvas 模拟排行榜内容
  const rankCanvas = wx.createCanvas();
  const rankContext = rankCanvas.getContext('2d');
  rankCanvas.width = rank.style.width;
  rankCanvas.height = rank.style.height;
  rank.canvas = rankCanvas;

  const updateRank = () => {
    rankContext.clearRect(0, 0, rankCanvas.width, rankCanvas.height);
    rankContext.fillStyle = 'blue';
    rankContext.fillRect(0, 0, rankCanvas.width, rankCanvas.height);
    rankContext.fillStyle = '#ffffff';
    rankContext.font = '48px sans-serif';
    rankContext.fillText('这是一个独立的 Canvas', 20, 50);
    rank.update();
  };

  testText.on('click', () => {
    if (testText.value === '打开排行榜') {
      testText.value = '关闭排行榜';
      Layout.ticker.add(updateRank);
    } else {
      testText.value = '打开排行榜';
      rankContext.clearRect(0, 0, rankCanvas.width, rankCanvas.height);
      Layout.ticker.remove(updateRank);
    }
  });
};
