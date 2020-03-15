# 快速入门

## 安装

克隆本项目到合适的文件夹或者通过Bower安装。
``` shell
// git安装方式
git clone https://github.com/wechat-miniprogram/minigame-canvas-engine
// npm安装方式
bower install minigame-canvas-engine
```

## 极简示例

1. 引用渲染引擎：
``` js
import Layout from 'minigame-canvas-engine'
```

2. 编写模板字符串：这里采用XML去描述界面，而且支持有限的标签。需要特别注意的是，模板字符串只能有一个根节点，第二个节点会被忽略。如果想让模板更加强大，可以借助第三方模板引擎如[dot.js](https://olado.github.io/doT/index.html)。

``` js
let template = `
    <view id="container">
    <text id="testText" class="redText" value="hello canvas">
    </view>
`
```

3. 编写样式：样式为一个style对象，与Web开发不同的是，不受属性前后顺序的影响，class的属性会覆盖id的同名属性。
::: tip
由于采用了第三方的布局引擎css-layout，在编写样式的时候为所有元素都设置好width和height属性会更容易得到想要的效果，其中**根节点**必须设置width和height属性。
:::

``` js
let style = {
    container: {
        width: 200,
        height: 100,
        backgroundColor: '#ffffff',
        justContent: 'center',
        alignItems: 'center',
    },
    testText: {
        color: '#ffffff',
        width: 200,
        height: 50,
        lineHeight: 50,
        fontSize: 20,
        textAlign: 'center',
    },
    // 文字的最终颜色为#ff0000
    redText: {
        color: '#ff0000',
    }
}
```
4. 初始化渲染引擎：将第二第三步编写的模板和样式传给渲染引擎，渲染引擎会生成布局树和渲染树等，准备渲染到canvas上面。

``` js
Layout.init(template, style);
```

5. 执行渲染：指定被渲染的context，绘制UI
``` js
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

// 设置canvas的尺寸和样式的container比例一致
canvas.style.width = 200 + 'px';
canvas.style.height = 100 + 'px';
canvas.width = 400;
canvas.height = 200;

Layout.layout(context);
```

6. 渲染结果

<img :src="$withBase('/imgs/hello.jpg')" width=300>
