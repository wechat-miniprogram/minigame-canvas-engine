module.exports = function loading(Layout, canvas, ctx) {
  const tpl = `
    <view id="container">
      <image src="https://mmgame.qpic.cn/image/3d1e23022b2ffe0a5dc046c10428d5826c383042d8e993706fa1d630aa3917fd/0" id="loading"></image>
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
