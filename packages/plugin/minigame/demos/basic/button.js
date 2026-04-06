module.exports = function button(Layout, canvas, ctx) {
  const tpl = `
    <view id="container">
      <button id="testButton" value="邀请"></button>
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
    testButton: {},
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  const testButton = Layout.getElementById('testButton');
  testButton.on('click', () => {
    console.log('[Button] clicked');
  });
};
