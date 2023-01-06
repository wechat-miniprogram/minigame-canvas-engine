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

<!-- ## Layout.repaint()
在某些场景下执行重渲染逻辑，比如通过getElementsById获取一个元素并且改变他的背景颜色，因为不涉及布局变更，执行Layout.repaint()即可。 -->

## clearAll
比起 Layout.clear 更彻底的清理，会清空图片对象池，减少内存占用。

## loadImgs
Layout.loadImgs(Array imgarr)

对于图片资源，如果不提前加载，渲染过程中可能出现挨个出现图片效果，影响体验。通过Layout.loadImgs可以预加载图片资源，在调用Layout.layout的时候渲染性能更好，体验更佳。
```js
// 注意图片路径不需要加./作为前缀，以小游戏根目录作为根目录
Layout.loadImgs([
    'sub/Buffet_icon_GiftPlate_0.png',
    'sub/Buffet_icon_GiftPlate.png',
    'sub/UI_Icon_Rating.png',
]);
```

## registBitMapFont
Layout.registBitMapFont(name, src, config)

注册 bitmaptext 可用的字体。

| keyName  | 类型     |  描述    |
|----------|----------| ---------|
| name| String| 字体的名称|
| src| String| bitMapFont字体的图片链接|
| config| String| BitMapFont的配置信息|

``` js
Layout.registBitMapFont(
'fnt_number-export',
'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20200314/fnt_number-export.png',
`info face="fnt_number-export" size=50 bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1
common lineHeight=60 base=26 scaleW=190 scaleH=181 pages=1 packed=0 alphaChnl=1 redChnl=0 greenChnl=0 blueChnl=0
page id=0 file="fnt_number-export.png"
chars count=15
char id=31561 x=0 y=61 width=60 height=61 xoffset=0 yoffset=2 xadvance=57 page=0 chnl=0 letter="等"
char id=32423 x=0 y=0 width=62 height=60 xoffset=0 yoffset=2 xadvance=59 page=0 chnl=0 letter="级"
char id=46 x=168 y=116 width=21 height=21 xoffset=0 yoffset=39 xadvance=18 page=0 chnl=0 letter="."
char id=49 x=145 y=0 width=27 height=57 xoffset=0 yoffset=3 xadvance=24 page=0 chnl=0 letter="1"
char id=50 x=44 y=123 width=41 height=57 xoffset=0 yoffset=3 xadvance=38 page=0 chnl=0 letter="2"
char id=51 x=102 y=58 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="3"
char id=52 x=143 y=58 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="4"
char id=53 x=0 y=123 width=43 height=57 xoffset=0 yoffset=3 xadvance=40 page=0 chnl=0 letter="5"
char id=54 x=127 y=116 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="6"
char id=55 x=86 y=119 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="7"
char id=56 x=63 y=0 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="8"
char id=57 x=104 y=0 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="9"
char id=48 x=61 y=61 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="0"
char id=32 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=0 page=0 chnl=0 letter=" "
char id=9 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=0 page=0 chnl=0 letter="	"

kernings count=0`
)

```
注册之后 bitmaptext 设置 font 属性即可使用。
```xml
<bitmaptext font="fnt_number-export" class="title" value="等级"></bitmaptext>
```


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

# 事件监听
通过 getElementsById 或者 getElementsByClassName 获取元素之后，可以的绑定事件，支持的事件有`touchstart`、`touchmove`、`touchend`、`touchcancel`、`click`、`scroll(只有scrollview支持）`示例如下：
``` js
const list = Layout.getElementsByClassName('listItem');

list.forEach(item => {
  item.on('touchstart', (e) => {
    console.log(e, item);
  });
});
```

## TWEEN
Layout 默认挂载了[tween.js](https://github.com/tweenjs/tween.js/)模块，TWEEN 的使用与 tween.js 的使用并无差异。
缓动系统的更多细节可见[缓动系统](/api/tween.html)。
```js
const ball = Layout.getElementsByClassName('ball')[0];

new Layout.TWEEN.Tween(ball.style)
  .to({ top: 250 }, 1000)
  .easing(Layout.TWEEN.Easing.Bounce.Out)
  .start();
```

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
开始 Layout 的循环，Layout.ticker 默认是 started 状态，不需要手动开启。

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



# 属性API
通过Layout.getElementsById和Layout.getElementsByClassName获取image和text之后，修改图片的链接或者文本的值会自动重渲染界面。
``` js
let img = Layout.getElementsById('testimgid')[0];
img.src = 'newimgsrc';

let text = Layout.getElementsById('tesettextid')[0];
text.value = 'newtextvalue';
```

