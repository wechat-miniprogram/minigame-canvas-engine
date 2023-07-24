# 布局概览

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

### 文本

支持的标签：`text`
| 属性名 | 支持的值或类型 | 默认值 |
| --------------- | ------------------- | ----------- |
| fontSize | number | 14 |
| lineHeight | number / string | '1.4em' |
| textAlign | left, center, right | left |
| verticalAlign | top, middle, bottom | top |
| color | string | #000000 |
| backgroundColor | string | | 背景的颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色 |
| textOverflow | ellipsis, clip | 默认为空，出于性能考虑，只有显式指定 textOverflow 属性的时候才会对文字进行截断处理 |
| letterSpacing | number | 默认值为 0，只对 bitmaptext 标签生效 |

### 容器

支持的标签：`view`、`scrollview`、`image`、`text`、`bitmaptext`、`canvas`
| 属性 | 类型 | 默认值 | 说明 |
|---------------|--------|--------|--------------------------|
| backgroundColor | string | | 背景的颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色 |
| backgroundImage | string | | 背景图，格式为 'url(https:/www.foo.com/xxx.png)'  |
| opacity | number | 1 | 透明度，范围[0, 1]，0表示透明，1表示不透明 |
| transform | string | | transform 属性允许你旋转给定元素，目前支持的格式 `rotate(360deg)` |

::: tip 兼容性
v1.0.5版本开始支持 transform
:::

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
