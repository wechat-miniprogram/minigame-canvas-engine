# 快速入门

## 安装

```shell
# npm安装方式
npm install minigame-canvas-engine --save
```

## 极简示例

1. 引用渲染引擎：

```js
import Layout from "minigame-canvas-engine";
```

2. 编写模板字符串：这里采用 XML 去描述界面，而且支持有限的标签。需要特别注意的是，模板字符串只能有一个根节点，第二个节点会被忽略。如果想让模板更加强大，可以借助第三方模板引擎如[dot.js](https://olado.github.io/doT/index.html)。

```js
let template = `
    <view id="container">
        <text id="testText" class="redText" value="hello canvas"></text>
    </view>
`;
```

3. 编写样式：样式为一个 style 对象，与 Web 开发不同的是，不受属性前后顺序的影响，class 的属性会覆盖 id 的同名属性。
   ::: tip
   由于采用了第三方的布局引擎 css-layout，在编写样式的时候为所有元素都设置好 width 和 height 属性会更容易得到想要的效果，其中**根节点**必须设置 width 和 height 属性。
   :::

```js
let style = {
  container: {
    width: 400,
    height: 200,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  testText: {
    color: "#ffffff",
    width: "100%",
    height: "100%",
    lineHeight: 200,
    fontSize: 40,
    textAlign: "center",
  },
  // 文字的最终颜色为#ff0000
  redText: {
    color: "#ff0000",
  },
};
```

4. 初始化渲染引擎：将第二第三步编写的模板和样式传给渲染引擎，渲染引擎会生成布局树和渲染树等，准备渲染到 canvas 上面。

```js
Layout.init(template, style);
```

5. 执行渲染：指定被渲染的 context，绘制 UI

```js
// 首先在HTML里面创建canvas
// <canvas id="canvas"></canvas>

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// 设置canvas的尺寸和样式的container比例一致
canvas.style.width = 400 + "px";
canvas.style.height = 200 + "px";
canvas.width = 400;
canvas.height = 200;

Layout.updateViewPort({
  x: 0,
  y: 0,
  width: 400,
  height: 200,
});

Layout.layout(context);
```

6. 渲染结果

<img :src="$withBase('/imgs/hello.jpg')" width=300>

7. 事件绑定

```js
let text = Layout.getElementsById("testText")[0];

text.on("click", (e) => {
  alert("hello canvas");
});
```
在线查看效果如下：
<iframe height="615.2017211914062" style="width: 100%;" scrolling="no" title="Layout Hello Canvas" src="https://codepen.io/yuanzm/embed/VwEeLKw?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/VwEeLKw">
  Layout Hello Canvas</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
