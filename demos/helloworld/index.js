// 引用渲染引擎
import Layout from '../../src/index';

// 编写模板字符串
const template = `
  <view id="container">
    <text id="testText" class="redText" value="hello canvas"></text>
  </view>
`;

// 编写样式
const style = {
  container: {
    width: 400,
    height: 200,
    backgroundColor: '#ffffff',
    justContent: 'center',
    alignItems: 'center',
  },
  testText: {
    color: '#ffffff',
    width: 400,
    height: 200,
    lineHeight: 200,
    fontSize: 40,
    textAlign: 'center',
  },
  // 文字的最终颜色为#ff0000
  redText: {
    color: '#ff0000',
  },
};

// 初始化渲染引擎
Layout.init(template, style);

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// 设置canvas的尺寸和样式的container比例一致
canvas.style.width = '400px';
canvas.style.height = '200px';
canvas.width = 400;
canvas.height = 200;

// 执行渲染
Layout.updateViewPort({
  x: 0,
  y: 0,
  width: 400,
  height: 200,
});

Layout.layout(context);

// 事件绑定
const text = Layout.getElementsById('testText')[0];

text.on('click', () => {
  alert('hello canvas');
});

