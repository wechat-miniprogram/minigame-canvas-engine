# BitMapText


在游戏开发里面，为了更好的视觉效果，经常要将一些常用文字经过设计成图片，然后打包成特殊的字体，称为BitmapFont，基本上所有的游戏引擎都支持了这种技术。

本渲染引擎调研了常见的H5游戏引擎Laya、Cocos、Egret，他们普遍支持[AngelCode.com](https://www.angelcode.com/products/bmfont/)打包后的配置文件规范，因此 BitMapText同样只支持通过该工具打包后的文件。

需要特别注意的是，对于一般的游戏引擎而言，都会在自己的IDE里面将.fnt打包进代码里面，这里为了引擎轻量化，需要通过API[registBitMapFont](/api/api.html#registbitmapfont)手动注册字体。
然后在标签里面通过font属性声明需要使用的字体。


### 特殊样式
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| width | Number|   是   | 文字的容器宽度，当width大于文字实际绘制占据的宽度，textAlign生效|
| height| Number|   是   | 文字的容器高度，当height大于lineHeight，verticalAlign属性生效|
| lineHeight | Number|   否   | 渲染文字的行高，默认为配置文件里面的lineHeight|
| textAlign| String |   否  | 文字水平居中方式，默认left，支持right、center |
| verticalAlign| String |   否  | 文字垂直居中的方式，默认为middle，支持top和bottom|
| letterSpacing | Number|   否   | 字符间距|

### 示例
<iframe height="599.1077270507812" style="width: 100%;" scrolling="no" title="Layout BitMapText" src="https://codepen.io/yuanzm/embed/LYgGvQm?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/LYgGvQm">
  Layout BitMapText</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>