# Image

继承自 [Element](/components/element.html)。

## 特殊属性
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| src| string |    是 |图片链接, 修改图片的src属性会自动请求新的图片并渲染|
| type| string | 否 | 图片的类型，simple默认，sliced九宫格，tiled平铺渲染|
|inset|string|否| 九宫格设置的区域，left\|top\|right\|bottom,如'10 20 30 10'|

::: tip
1.小游戏开放数据域场景图片路径不需要加./作为前缀，以小游戏根目录作为根目录；

2.图片可以通过API[loadImgs](/api/api.html#loadimgs)实现预加载
:::

## 示例
<iframe height="596.1451416015625" style="width: 100%;" scrolling="no" title="Layout Image" src="https://codepen.io/yuanzm/embed/NWOxmLG?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/NWOxmLG">
  Layout Image</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
