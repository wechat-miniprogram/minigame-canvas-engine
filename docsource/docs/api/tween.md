# 缓动系统

## 简介
缓动动画是很常见的需求，游戏引擎一般会内置缓动系统，如果没有内置的缓动系统，通过引入缓动引擎也能够很容易实现缓动动画能力。

出于代码体积考虑，Layout 没有默认挂载了缓动模块，但引用并使用 [tween.js](https://github.com/tweenjs/tween.js/) 来实现动画能力与浏览器的 DOM 动画差异不大。

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
/**
 * 安装引用缓动库，tween.js 只是推荐使用，可以使用任意缓动引擎
 * npm i @tweenjs/tween.js@^18
 */
const TWEEN = require('@tweenjs/tween.js');

// 将缓动系统的 update 逻辑加入 Layout 的帧循环
Layout.ticker.add(() => {
  TWEEN.update();
});

const ball = Layout.getElementsByClassName('ball')[0];

new TWEEN.Tween(ball.style)
  .to({ top: 250 }, 1000)
  .easing(TWEEN.Easing.Bounce.Out)
  .start();
```

## 接口限制

借助缓动引擎主要是能够实现两类动画：
1. 改变位置相关动画: 如示例所示，改变 **style.left**、**style.top**、**style.right**、**style.bottom** 即可，特别注意的是，left/top/right/bottom默认是没有值的，需要指定个默认值缓动才能够生效。
2. 改变布局的动画：更改 **style.width**、**style.height**等会改变布局的属性，布局属性列表可见[布局属性](/api/style.html#布局);

## 原理简介
Layout 要实现缓动动画的原理与浏览器是类似的，浏览器里面一般要给 DOM 节点实现动画能力需要先给节点设置 position 为 relative 或者 absolute，然后定时改变节点的 top 和 left 的值就实现了动画的效果。

详见文档：[https://developer.mozilla.org/en-US/docs/Web/CSS/position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
> The element is positioned according to the normal flow of the document, and then offset relative to itself based on the values of top, right, bottom, and left. The offset does not affect the position of any other elements;

可以简单理解为，当布局已经确定之后，改变元素的 top 和 left 属性，只会影响自己不会影响其他元素。

Layout 里面实现动画也是类似的，当改变元素的 style 属性，Layout 内部在监听到这种修改之后，会触发布局的重计算并重新渲染(这个过程被称为 reflow)，只要合理利用 `TWEEN`，也能实现丰富的动画效果。

## 进阶指南
原理部分提到了，动画其实是在改变 style 的属性，这会触发 reflow 操作，reflow 的核心耗时在于布局引擎需要根据改变的属性局部重新计算布局，而布局引擎是 js 实现的，因此性能问题会更加明显。

因此在做缓动的时候，尤其需要注意性能问题，假设有一个长的滚动列表，列表的每一行都有一个按钮，每个按钮都会执行个放大缩小的按钮（呼吸态按钮），那么对布局引擎而言，基本上整个布局都需要重新计算，这个耗时会非常夸张（600个节点，耗时约15ms)。

解决方案在于，减少不必要的缓动动画，上面的场景只针对 ScrollView 内可见列表执行缓动，示意代码如下：
``` js
/**
 * tween不直接作用于节点，否则一个列表大量的节点都执行tween操作性能必然会差
 * 因此维护一个与节点无关的 globalTween，每帧检查是 globalTween 应该作用于哪些节点
 * 每次 Layout.clear 记得清理或者重置 globalTween
 */
let globalStyle = { width: 90, height: 90 };
new TWEEN.Tween(globalStyle).to({
  width: 70,
  height: 70
}).repeat(Infinity).yoyo(true).easing(TWEEN.Easing.Bounce.Out).start();

const scrollList = Layout.getElementsByClassName('list')[0];
const listItems = Layout.getElementsByClassName('listHeadImg');

// 如果 ScrollView 的布局也会改变，比如改变 height，那么 scrollRect 也需要反复获取，此处示例默认滚动列表的窗口不会改变
const scrollRect = scrollList.getBoundingClientRect();

function manualTween() {
  listItems.forEach((item) => {
    if (scrollRect.intersects(item.getBoundingClientRect())) {
      item.style.height = globalStyle.height;
    }
  });
}

// 记得在必要的时候执行 Layout.ticker.remove(manualTween)，比如每次 Layout.init 之前
Layout.ticker.add(manualTween);
```

## 一些参考资料
1. [JavaScript HTML DOM 动画](https://www.w3school.com.cn/js/js_htmldom_animate.asp)
2. [CSS positon](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
