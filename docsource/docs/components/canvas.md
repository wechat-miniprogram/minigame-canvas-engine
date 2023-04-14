# Canvas


<iframe height="621.406982421875" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/yuanzm/embed/ExdPJKW?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/ExdPJKW">
  Untitled</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


与浏览器的canvas标签类似，Layout 标签允许你插入一个画布自由更新画布内容，这在某些场景会非常有用，比如你想通过Layout完成构建小游戏示例，包括游戏和开放数据域，例如[noengine demo](https://github.com/wechat-miniprogram/minigame-canvas-engine/tree/master/demos/noengine)。

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