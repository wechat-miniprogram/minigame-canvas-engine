module.exports = function helloworld(Layout, canvas, ctx) {
  const tpl = `
    <view id="container">
      <text id="testText" class="redText" value="Hello World"></text>
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
    testText: {
      color: 'black',
      width: '100%',
      height: '100%',
      lineHeight: canvas.height,
      fontSize: 60,
      textAlign: 'center',
    },
    redText: {
      color: '#ff0000',
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  const testText = Layout.getElementById('testText');
  testText.style.backgroundColor = '#f3f3f3';

  testText.on('click', () => {
    if (testText.classList.contains('redText')) {
      testText.classList.remove('redText');
    } else {
      testText.classList.add('redText');
    }
  });
};
