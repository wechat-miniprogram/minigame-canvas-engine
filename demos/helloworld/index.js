// 引用渲染引擎
import Layout from 'minigame-canvas-engine';

// 编写模板字符串
let template = `
    <view id="container">
        <text id="testText" class="redText" value="hello canvas"></text>
    </view>
`

// 编写样式
let style = {
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
    }
}

// 初始化渲染引擎
Layout.init(template, style);

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

// 设置canvas的尺寸和样式的container比例一致
canvas.style.width = 400 + 'px';
canvas.style.height = 200 + 'px';
canvas.width = 400;
canvas.height = 200;

// 执行渲染
Layout.updateViewPort({
    x     : 0,
    y     : 0,
    width : 400,
    height: 200,
});

Layout.layout(context);

// 事件绑定
let text = Layout.getElementsById('testText')[0];

text.on('click', (e) => {
  alert('hello canvas');
});

