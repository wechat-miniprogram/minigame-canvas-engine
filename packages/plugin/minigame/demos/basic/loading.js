module.exports = function loading(Layout, canvas, ctx) {
  const tpl = `
    <view id="container">
      <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" id="loading"></image>
    </view>
  `;

  const style = {
    container: {
      width: canvas.width,
      height: canvas.height,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loading: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  const image = Layout.getElementById('loading');
  let degrees = 0;
  Layout.ticker.add(() => {
    degrees = (degrees + 2) % 360;
    image.style.transform = `rotate(${degrees}deg)`;
  });
};
