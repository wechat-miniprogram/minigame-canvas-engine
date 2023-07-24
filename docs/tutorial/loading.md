# 加载中效果实现

## 简介
在小游戏开放数据域场景下，需要异步加载好友数据然后渲染，由于开放数据域加载成功事件并不能抛给游戏主域，所以并不能实现游戏主域播放加载动画然后在开放数据域加载完成后隐藏加载动画，因此，只能在开放数据域实现简单的加载动画。

实际上，借助 Layout 的 transform 样式属性，实现简单的加载中效果并不难，本文介绍如何实现简单的加载中效果。

## 完整流程

### 布局和样式编写
布局非常简单，只需要新建个容器，容器内有个静态图片，图片居中展示。
``` html
<view id="container">
  <image src="https://mmgame.qpic.cn/image/3d1e23022b2ffe0a5dc046c10428d5826c383042d8e993706fa1d630aa3917fd/0" id="loading"></image>
</view>
```

``` js
let style = {
  container: {
    width: 400,
    height: 400,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
};
```

### 实现图片的每帧旋转
这里我们借助 ticker 能力和 transform 的旋转能力实现每帧都旋转，这样就能够得到一个旋转中的加载图了，下面的示例每一帧旋转2度，要加快速度按需调整即可。
``` js
const image = Layout.getElementById('loading');
let degrees = 0;
Layout.ticker.add(() => {
  degrees = (degrees + 2) % 360;
  image.style.transform = `rotate(${degrees}deg)`;        
});
```

### 在线示例
<iframe height="508.888916015625" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/yuanzm/embed/jOQvWLz?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/jOQvWLz">
  Untitled</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### 函数封装
在小游戏场景下，可以将上述行为封装为一个函数
``` js
// 通过插件的方式引用 Layout
const Layout = requirePlugin('Layout').default;
let sharedCanvas = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext("2d");

const style = {
  container: {
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
};

const tpl = `
<view id="container">
  <image src="sub/images/loading.png" id="loading"></image>
</view>
`;

export function showLoading() {
  Layout.clear();
  Layout.init(tpl, style);
  Layout.layout(sharedContext);

  const image = Layout.getElementById('loading');
  let degrees = 0;
  Layout.ticker.add(() => {
    degrees = (degrees + 2) % 360;
    image.style.transform = `rotate(${degrees}deg)`;        
  });
}
```
经过封装，只需要在加载数据之前额外调用 `showLoading` 函数就能够实现加载中的效果，对原先的流程无需改造。