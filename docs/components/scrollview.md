# ScrollView

继承自 [View](../components/view.html)。

滚动内容的容器，滚动的前提是正确调用[updateViewPort](../api/api.html#updateviewport)

## 标签属性
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| scrollX | string |   否  |  是否需要横向滚动，支持 "true"和"false"，默认值为 "false" |
| scrollY | string |   否  | 是否需要纵向滚动，支持 "true"和"false", 默认值为"false" |
::: tip 温馨提示
为了兼容历史版本，默认做了一个逻辑，如果当前纵向内容大于 ScrollView 本身高度会自动开启纵向滚动特性，如果需要关闭，可以强行在标签指定 scrollY = "false"
:::


``` html
<scrollview scrollY="true"></scrollview>
```

## 属性
| 属性      | 类型   | 说明                                                                       |
| --------- | ------ | -------------------------------------------------------------------------- |
| scrollX   | boolean | 动态修改 ScrollView 是否可以横向滚动 |
| scrollY   | boolean | 动态修改 ScrollView 是否可以纵向滚动 |
| vertivalScrollbar | [ScrollBar](./scrollbar.md) | 纵向滚动条实例 |
| horizontalScrollbar | [ScrollBar](./scrollbar.md)  | 横向滚动条实例 |

当滚动开启时候，会自动插入滚动条组件，反之关闭的时候会删除滚动条组件。

::: tip 兼容性
滚动条特性 v1.0.4版本开始支持
:::

示例
``` js
const list = Layout.getElementById('list');
// 将滚动列表动态设置为禁止纵向滚动
list.scrollY = false;

// 在 init 之后内部有些异步逻辑取不到 vertivalScrollbar，需要延迟一帧执行
Layout.ticker.next(() => {
  // 隐藏滚动条
  list.vertivalScrollbar.hide();

  // 改变滚动条的宽度
  list.vertivalScrollbar.width = 20;

  // 改变滚动条的背景颜色
  list.vertivalScrollbar.style.backgroundColor = 'red';
});
```

## 方法
### scrollTo

scrollTo(left: number = 0, top: number = 0, animate: number = true)

滚动到指定位置，如果当前需要纵向滚动到指定位置且不支持横向滚动，left 传0即可，横向滚动同理。
```js
const list = Layout.getElementById("list");

// 列表往上滚动 100
list.scrollTo(0, 100, true);
```


### 示例
<iframe height="609.4705810546875" style="width: 100%;" scrolling="no" title="Layout RankList" src="https://codepen.io/yuanzm/embed/QWZybox?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/QWZybox">
  Layout RankList</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
