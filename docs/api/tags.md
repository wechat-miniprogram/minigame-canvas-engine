# 标签

## 标签列表

|      标签     |            说明          |
|----------------|----------------             |
| view           | 容器标签，与HTML中的div相似 |
| scrollview     | 滚动列表容器，如果容器内的子元素高度大于scrollview高度，支持纵向滚动，不支持嵌套scrollview |
| image          | 图片标签 |
| text           | 文本标签 |
| bitmaptext| bitmapfont文本标签|
| canvas | 对齐 Web，允许获取 context执行渲染 |


## 公共属性
每个标签都会通过属性来支持一些特有的功能，下面列举所有标签都会有的属性。

|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| id  | string |    否 | 非唯一标识，两个标签可以共用id，可以通过 **Layout.getElementsById** 获取到元素实例 |
| class | string |    否    | 与浏览器相同 |
| dataset | string |    否    | 与浏览器相同，详见[文档](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) |


## view

view标签用来页面布局，布局严格遵循[CSS Flex布局](https://developer.mozilla.org/en-US/docs/Web/CSS/flex)，节点在Flex属性相互作用的结果可以通过Yoga的[Playground](https://yogalayout.com/playground)试验。

## image
### 特殊属性
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| src| string |    是 |图片链接|

::: tip
1.小游戏开放数据域场景图片路径不需要加./作为前缀，以小游戏根目录作为根目录；

2.图片可以通过API[loadImgs](/api/api.html#loadimgs)实现预加载
:::

## text

### 特殊属性
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| value | string |    是 |文字内容|

### 特殊样式
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| textOverflow | string |   否  | 文字溢出处理方式，默认不处理，ellipsis则支持自动截断|
| textAlign| string |   否  | 文字水平居中方式，默认left，支持right、center |

## scrollview
滚动内容的容器，滚动的前提是正确调用[updateViewPort](/api/api.html#updateviewport)
### 特殊样式
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| scrollX | string |   否  |  是否需要横向滚动，支持 "true"和"false"，默认值为 "false" |
| scrollY | string |   否  | 是否需要纵向滚动，支持 "true"和"false", 默认值为"false" |


## bitmapfont
在游戏开发里面，为了更好的视觉效果，经常要将一些常用文字经过设计成图片，然后打包成特殊的字体，称为BitmapFont，基本上所有的游戏引擎都支持了这种技术。

本渲染引擎调研了常见的H5游戏引擎Laya、Cocos、Egret，他们普遍支持[AngelCode.com](https://www.angelcode.com/products/bmfont/)打包后的配置文件规范，因此biamapfont
同样只支持通过该工具打包后的文件。

需要特别注意的是，对于一般的游戏引擎而言，都会在自己的IDE里面将.fnt打包进代码里面，这里为了引擎轻量化，需要通过API[registBitMapFont](/api/api.html#registbitmapfont)手动注册字体。
然后在标签里面通过font属性声明需要使用的字体。

``` html
<bitmaptext font="fnt_number-export" class="title" value="等级"></bitmaptext>
```
``` js
title: {
  width: 144,
  fontSize: 48,
  height: 120,
  lineHeight: 50,
  textAlign: 'center',
  verticalAlign: 'top',
  fontWeight: 'bold',
  borderBottomWidth: 6,
  borderColor: '#000000',
}

```

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
<img :src="$withBase('/imgs/bitmapfont.png')" width=400>

## canvas
### 特殊属性
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| width | Number |    否  | canvas 画布的尺寸，与样式的尺寸不是一个概念 |
| height | Number |    否  | canvas 画布的尺寸，与样式的尺寸不是一个概念 |
| autoCreateCanvas | String | 否 | 是否自动创建 canvas，默认为 "false"，有些场景如微信小游戏场景，sharedCavans非业务创建，则需要手动设置canvas 实例|

``` html
<view id="container">
  <canvas id="rank" width="300" height="300"></canvas>
</view>
```
```js
let style = {
  container: {
    width: 500,
    height: 500,
    backgroundColor: '#f3f3f3',
  },
  rank: {
    width: 300,
    height: 300,
  }
}
```
```js
const rank = Layout.getElementsById('rank')[0];

const updateRank = () => {
  rank.update();
}

// 手动指定 canvas 实例
rank.canvas = sharedCanvas; // sharedCanvas 为业务自己管理的 canvas 实例

// 要求Layout每帧刷新开放数据域 canvas 的绘制
Layout.ticker.add(updateRank);

```