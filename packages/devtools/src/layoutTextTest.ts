import { template } from 'dot';

function main() {
  let tpl = `
    <view class="container" id="main">
      <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
      <text id="text" value="测试文本"></text>
    </view>
  `

  let style = {
    container: {
      width: 600,
      height: 600,
      borderRadius: 12,
      backgroundColor: '#f3f3f3',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    wegoing: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    text: {
      fontSize: 36,
      height: 36,
    }
  }

  const Layout = window.Layout;

  Layout.init(template(tpl)({}), style);

  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  document.body.append(canvas)

  // 设置canvas的尺寸和样式的container比例一致
  canvas.style.width = 1410 / 2 + 'px';
  canvas.style.height = 960 / 2 + 'px';
  canvas.width = 1410;
  canvas.height = 960;

  Layout.updateViewPort(canvas.getBoundingClientRect());

  Layout.layout(context);

  const text = Layout.getElementById('text');
  console.log(text);

  setTimeout(() => {
    console.log('修改文本')
    text.value = '测试文本加长';    
  }, 1000);
}

main();
