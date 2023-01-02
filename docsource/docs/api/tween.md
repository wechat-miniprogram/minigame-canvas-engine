# 缓动系统(Beta)

## 简介
缓动动画是很常见的需求，游戏引擎会一般内置缓动系统，如果没有内置的缓动系统，通过引入缓动引擎也能够很容易实现缓动动画能力。

Layout 默认挂载了[https://github.com/tweenjs/tween.js/](https://github.com/tweenjs/tween.js/)模块，使用 tween.js 来实现动画能力与浏览器插件的 DOM 动画差异不大。

支持缓动系统的版本改动较大，请先引用[https://github.com/wechat-miniprogram/minigame-canvas-engine/blob/master/index.js](https://github.com/wechat-miniprogram/minigame-canvas-engine/blob/master/index.js)来使用，版本稳定会会发布至 npm 和小游戏插件。

## 原理
Layout 要实现缓动动画的原理与浏览器是类似的，浏览器里面一般要给 DOM 节点实现动画能力需要先给节点设置 position 为 relative 或者 absolute，然后定时改变节点的 top 和 left 的值就实现了动画的效果。

详见文档：https://developer.mozilla.org/en-US/docs/Web/CSS/position
> The element is positioned according to the normal flow of the document, and then offset relative to itself based on the values of top, right, bottom, and left. The offset does not affect the position of any other elements;

可以简单理解为，当布局已经确定之后，改变元素的 top 和 left 属性，只会影响自己不会影响其他元素。

Layout 里面实现动画也是类似的，当改变元素的 style 属性，Layout 内部在监听到这种修改之后，会触发布局的重计算并重新渲染(这个过程被称为 reflow)，只要合理利用 TWEEN，也能实现丰富的动画效果。


## 简单示例
下面分别是示例需要的 xml、style 和缓动函数调用示例，省略 Layout 初始化和 layout 等逻辑。
``` xml
<view id="container">
  <view class="ball"></view>
</view>
```
``` json
{
    container: {
        width: 300,
        height: 300,
        backgroundColor: '#ffffff',
        justContent: 'center',
        alignItems: 'center',
    },
    ball: {
        backgroundColor: 'blue',
        width: 50,
        height: 50,
      	borderRadius: 25,
    },
}
```
``` js
const ball = Layout.getElementsByClassName('ball')[0];

new Layout.TWEEN.Tween(ball.style)
  .to({ top: 250 }, 1000)
  .easing(Layout.TWEEN.Easing.Bounce.Out)
  .start();
```

## 接口限制
Layout 仅仅是引用了 TWEEN，缓动相关的能力见 tween.js 的[文档](https://github.com/tweenjs/tween.js/blob/main/docs/user_guide.md)。
借助 tween.js，只要是能够实现两类动画
1. 改变位置相关动画: 如示例所示，改变 **style.left**、**style.top**即可;
2. 改变布局的动画：更改 **style.width**、**style.height**等会改变布局的属性，布局属性列表可见[布局属性](/api/style.html#布局);

## 一些参考资料
1. [JavaScript HTML DOM 动画](https://www.w3school.com.cn/js/js_htmldom_animate.asp)
2. [CSS positon](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
