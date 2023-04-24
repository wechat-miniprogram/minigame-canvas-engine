# Layout
Layout 是一个单例，给定 template 和 style 最终渲染到画布一般要经过 `Layout.clear`、`Layout.init` 和 `Layout.layout` 三个步骤，除了这三个方法，还有一些方法挂载在 Layout，下面一一介绍。

## clear
清理画布，之前的计算出来的渲染树也会一并清理，此时可以再次执行`init`和`layout`方法渲染界面。

## init
Layout.init(template: string, style: object)

给定 template 和 style，计算布局、生成节点树等逻辑。

## layout
Layout.layout(context: CanvasRenderingContext2D)

将节点树绘制在 canvas 画布上，并会执行事件绑定等逻辑。

## updateViewPort
Layout.updateViewPort(Object box)

更新被绘制canvas的窗口信息，本渲染引擎并不关心是否会和其他游戏引擎共同使用，而本身又需要支持事件处理，因此，如果被渲染内容是绘制到离屏canvas，需要将最终绘制在屏幕上
的绝对尺寸和位置信息更新到本渲染引擎。

### box
|      key |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| width | Number |  是   | canvas的物理像素宽度|
| heigth | Number |  是   | canvas的物理像素高度|
| x | Number |  是   | canvas 距离屏幕左上角的物理像素x坐标|
| y | Number |  是   | canvas 距离屏幕左上角的物理像素y坐标|

::: tip
这一步非常重要，决定了点击、滑动等事件能否正确处理。
:::

在 Web 模式下，可以直接调用 Web 的API取得Canvas在屏幕中的位置：
```js
Layout.updateViewPort(canvas.getBoundingClientRect());
```

## clearAll
比起 Layout.clear 更彻底的清理，会清空图片对象池，减少内存占用。

## loadImgs
Layout.loadImgs(Array imgarr): Promise

对于图片资源，如果不提前加载，渲染过程中可能出现挨个出现图片效果，影响体验。通过Layout.loadImgs可以预加载图片资源，在调用Layout.layout的时候渲染性能更好，体验更佳。
```js
// 注意图片路径不需要加./作为前缀，以小游戏根目录作为根目录
Layout.loadImgs([
    'sub/Buffet_icon_GiftPlate_0.png',
    'sub/Buffet_icon_GiftPlate.png',
    'sub/UI_Icon_Rating.png',
]).then(() => {
  console.log('所有资源加载完成')；
})
```

## registBitMapFont
Layout.registBitMapFont(name, src, config)

注册 bitmaptext 可用的字体。

| keyName  | 类型     |  描述    |
|----------|----------| ---------|
| name| String| 字体的名称|
| src| String| bitMapFont字体的图片链接|
| config| String| BitMapFont的配置信息|

<iframe height="599.1077270507812" style="width: 100%;" scrolling="no" title="Layout BitMapText" src="https://codepen.io/yuanzm/embed/LYgGvQm?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/LYgGvQm">
  Layout BitMapText</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>



## getElementsById
Layout.getElementsById(String elementId)

获取元素id为**elementId**的一组元素，之所以是一组元素是因为这里 id 的实现没有对齐 Web，id并不是唯一的，只是一个标识。
```js
// <view id="container"></view>
const container = Layout.getElementsById('container')[0];
```

## getElementsByClassName
Layout.getElementsByClassName(String className)

获取包含class为**className**的一组元素。

```js
/**
 * <view id="container">
    <view class="item"></view>
    <view class="item"></view>
    <view class="item"></view>
   </view>
 */
const list = Layout.getElementsByClassName('item');

console.log(list.length); // 3
```

## cloneNode
Layout.cloneNode(element: Element, deep: boolean)
克隆节点，克隆后的节点可以添加到 Layout 的某个节点中，该方法可以在数据有变化的时候避免重新执行 Layout.init 流程。

``` js

// 获取 ScrollView
const list = Layout.getElementsByClassName('list')[0];

// 对列表第一项进行深度拷贝
const listItem = Layout.getElementsByClassName('listItem');
const listItem1 = listItem[0];
const newListItem1 = Layout.cloneNode(listItem1);

// 针对拷贝后的子节点做一些魔改
const listItemNum = newListItem1.getElementsByClassName('listItemNum')[0];
listItemNum.value = 2;
const listItemName = newListItem1.getElementsByClassName('listItemName')[0];
listItemName.value = 'zim test';
const listItemScore = newListItem1.getElementsByClassName('listItemScore')[0];
listItemScore.value = '100';

// 将拷贝后的节点也添加到滚动列表
list.appendChild(newListItem1);
```

<iframe height="634.6032409667969" style="width: 100%;" scrolling="no" title="Layout CloneNode" src="https://codepen.io/yuanzm/embed/oNaxvPv?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/oNaxvPv">
  Layout CloneNode</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

<!-- ## TWEEN
Layout 默认挂载了[tween.js](https://github.com/tweenjs/tween.js/)模块，TWEEN 的使用与 tween.js 的使用并无差异。
缓动系统的更多细节可见[缓动系统](/api/tween.html)。
```js
const ball = Layout.getElementsByClassName('ball')[0];

new Layout.TWEEN.Tween(ball.style)
  .to({ top: 250 }, 1000)
  .easing(Layout.TWEEN.Easing.Bounce.Out)
  .start();
``` -->

## ticker
类似游戏引擎，Layout 本身会依赖 requestAnimationFrame 维护个循环，每帧检测是否需要重渲染、重布局之类的操作。

### Layout.ticker.add(callback: Function)
在 Layout 的循环注册个事件回调，如果 Ticker 没有暂停，回调函数每帧都会执行
```js
const ball = Layout.getElementsByClassName('ball')[0];
const selfTickerFunc = () => {
  ball.style.top += 1;
}
Layout.ticker.add(selfTickerFunc);
```

### Layout.ticker.remove(callback: Function)
从 Layout 的循环移除事件回调。

### Layout.ticker.start()
开始 Layout 的循环，Layout.init 之后 Layout.ticker 默认是 started 状态，不需要手动开启。

### Layout.ticker.stop()
结束 Layout 的循环。

### Layout.ticker.next(callback: Function)
在 Layout 的下一次循环之后执行一次事件回调。
```js
const ball = Layout.getElementsByClassName('ball')[0];
Layout.ticker.next(() => {
  console.log(ball.getBoundingClientRect());
});
```