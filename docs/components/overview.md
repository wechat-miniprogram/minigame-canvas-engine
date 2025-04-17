# 布局和样式

## 标签

Layout 通过 xml 组织布局，Layout 支持的标签列表如下。

| 标签       | 说明                                |
| ---------- | ----------------------------------- |
| view       | 容器标签，与 HTML 中的 div 相似     |
| scrollview | 滚动列表容器                        |
| image      | 图片标签                            |
| text       | 文本标签                            |
| bitmaptext | bitmapfont 文本标签                 |
| canvas     | 对齐 Web，允许获取 context 执行渲染 |

## 属性

属性是给标签提供的附加信息，每个标签都会通过属性来支持一些特有的功能，下面列举所有标签都会有的属性。

| 属性    | 类型   | 是否必填 | 说明                                                                                           |
| ------- | ------ | -------- | ---------------------------------------------------------------------------------------------- |
| id      | string | 否       | 非唯一标识，两个标签可以共用 id，可以通过 **Layout.getElementsById** 获取到元素实例            |
| class   | string | 否       | 与浏览器相同                                                                                   |
| dataset | string | 否       | 与浏览器相同，详见[文档](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) |

## 样式

下面列举 Layout 支持的样式属性。

### 布局

支持的标签：`view`、`scrollview`、`image`、`text`、`bitmaptext`、`canvas`

| 属性名                                                                            | 支持的值或类型                                            | 默认值     |
| --------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------- |
| width, height                                                                     | number/string(百分比场景，如 100%)                        | 0          |
| minWidth, minHeight                                                               | number/string(百分比场景，如 100%)                        | 0          |
| left, right, top, bottom                                                          | number                                                    | 0          |
| margin, marginLeft, marginRight, marginTop, marginBottom                          | number                                                    | 0          |
| padding, paddingLeft, paddingRight, paddingTop, paddingBottom                     | number                                                    | 0          |
| borderWidth, borderLeftWidth, borderRightWidth, borderTopWidth, borderBottomWidth | number                                                    | 0          |
| flexDirection                                                                     | column, row                                               | column     |
| flexShrink                                                                        | number                                                    | 1          |
| flexGrow                                                                          | number                                                    |            |
| flexWrap                                                                          | wrap, nowrap                                              | nowrap     |
| flex                                                                              | number                                                    |            |
| justifyContent                                                                    | flex-start, center, flex-end, space-between, space-around | flex-start |
| alignItems, alignSelf                                                             | flex-start, center, flex-end, stretch                     | flex-start |
| position                                                                          | relative, absolute                                        | relative   |

### 伪类
用来添加一些选择器的特殊效果，目前仅支持最场景的 `:active` 场景，后续会试场景补充。

| 属性名 | 支持的值或类型 | 说明 |
| --------------- | ------------------- | ----------- |
| ':active' | Object | **(v1.0.9开始支持)**，当节点触发 'touchstart' 事件的时候触发 |

如下所示，当元素被点击的时候，元素会放大，当点击结束，元素又会重置会原样，这对实现按钮特性的时候尤为有用，不需要单独给按钮绑定点击事件手动对元素进行缩放和重置。
``` json
{
  color: '#ffffff',
  backgroundColor: '#34a123',
  borderRadius: 10,
  width: 400,
  height: 120,
  lineHeight: 120,
  fontSize: 50,
  textAlign: 'center',
  marginTop: 20,
  ':active': {
    transform: 'scale(1.05, 1.05)',
  },
}
```

<iframe height="439.15838623046875" style="width: 100%;" scrolling="no" title="Layout Text Button" src="https://codepen.io/yuanzm/embed/MWRoexw?default-tab=js%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/MWRoexw">
  Layout Text Button</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### 文本

支持的标签：`text`
| 属性名 | 支持的值或类型 | 默认值 |
| --------------- | ------------------- | ----------- |
| fontSize | number | 12 |
| fontFamily      | string              | 无默认值，规则对齐 CSS 的font-family，详情可见[font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)，参考值如 'Georgia, serif'        |
| lineHeight |  number/string(百分比场景，如 100%) | '120%' |
| textAlign | left, center, right | left |
| verticalAlign | top, middle, bottom | top |
| color | string | #000000 |
| backgroundColor | string | | 背景的颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色 |
| textOverflow | ellipsis, clip | 默认为空，出于性能考虑，只有显式指定 textOverflow 属性的时候才会对文字进行截断处理 |
| letterSpacing | number | 默认值为 0，只对 bitmaptext 标签生效 |
| textStrokeWidth  **(v1.0.8开始支持)**| number | 文字描边的宽度，默认不描边 |
| textStrokeColor  **(v1.0.8开始支持)**|  string | 描边的颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色， 如果指定了描边颜色但是没有指定描边宽度，描边宽度默认设置为1 |
| textShadow  **(v1.0.8开始支持)** | string |  文字阴影效果，textShadow的格式并不是严格的CSS格式，仅支持两种格式 如`textShadow: 1px 1px 2px pink`和`textShadow: 1px 1px 2px red, 0 0 1px blue, 0 0 1px blue, 1px 1px 2px red`，也就是支持任意数量的阴影效果，每个阴影效果由四个值指定，分别是 shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor |
| whiteSpace | normal, nowrap, pre, pre-wrap, pre-line | normal 详细规则可见[Text](./text.md)  |
| wordBreak | normal, break-all, keep-all | normal 详细规则可见[Text](./text.md)   |


::: tip textShadow 特殊说明
微信小游戏开放数据域暂不支持文字阴影效果。
:::


### 容器

支持的标签：`view`、`scrollview`、`image`、`text`、`bitmaptext`、`canvas`
| 属性 | 类型 | 默认值 | 说明 |
|---------------|--------|--------|--------------------------|
| backgroundColor | string | | 背景的颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色 |
| backgroundImage | string | | 背景图，格式为 'url(https:/www.foo.com/xxx.png)'  |
| opacity | number | 1 | 透明度，范围[0, 1]，0表示透明，1表示不透明 |
| transform | string | | transform 属性允许你旋转和缩放给定元素，目前支持的格式 `rotate(360deg)` |


#### transform 特殊说明
v1.0.5版本开始支持 transform，目前为止，transform 不会递归影响子节点，也就是父节点旋转缩放了之后子节点不会连带旋转缩放，要实现连带旋转缩放的能力，一方面是目前为止需求不够强，另一方面，对代码体积影响较大，会违背 Layout 轻量的初衷，暂时不做改造。

transform 可以同时指定多个变换，比如需要同时进行旋转和缩放，可以写为`rotate(30deg) scale(1.5, 1.5)`代表先旋转30度然后进行1.5倍放大。

**transform 不会影响布局仅仅影响渲染，在重新设置transform的时候，不需要重新计算布局，这意味着做一些动画它的性能更好。**

| 属性  | 兼容性 | 示例 | 说明 |
|---------------|--------|--------|--------|
| rotate | >=v1.0.5 | transform: 'rotate(30deg)' | 元素旋转一定的角度，0 ~ 360 deg代表旋转一周，rotate 特性一般用来做loading效果，详情可见[教程](../tutorial/loading)。 |
| scale | >=1.0.9 | transform: 'scale(1.5, 1.5)' | 分别指定X轴和Y轴的缩放。 |

### 边框

支持的标签：`view`、`scrollview`、`image`、`text`、`bitmaptext`、`canvas`
| 属性 | 类型 | 默认值 | 说明 |
|---------------|--------|--------|--------------------------|
| borderRadius | number | | 边框圆角 |
| borderColor | string | | 边框颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色 |

### 默认样式

如果一个标签没有任何自定义样式，那么它遵循下面的默认样式：

```js
{
  position: 'relative';
  display: 'flex';
  flexDirection: 'column';
  alignItems: 'stretch';
  flexShrink: 0;
  alignContent: 'flex-start';
  borderWidth: 0,
  borderColor: 'black',
  margin: 0;
  padding: 0;
}
```
