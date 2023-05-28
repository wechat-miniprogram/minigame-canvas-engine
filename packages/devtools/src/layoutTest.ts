let template = `
  <view id="container">
    <text id="testText" class="redText" value="hello canvas"></text>
  </view>
`

// console.log(JSON.stringify(parser.html2json(template)))

let style = {
  container: {
    width: 400,
    height: 200,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testText: {
    color: '#ffffff',
    width: '100%',
    height: '100%',
    lineHeight: 200,
    fontSize: 40,
    textAlign: 'center',
  },
  // 文字的最终颜色为#ff0000
  redText: {
    color: '#ff0000',
  }
}

  // @ts-ignore
const Layout = window.Layout;
Layout.init(template, style);

let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
document.body.append(canvas)

// 设置canvas的尺寸和样式的container比例一致
canvas.style.width = 400 + 'px';
canvas.style.height = 200 + 'px';
canvas.width = 400;
canvas.height = 200;

Layout.updateViewPort({
  x: 0,
  y: 0,
  width: 400,
  height: 200,
});

Layout.layout(context);
