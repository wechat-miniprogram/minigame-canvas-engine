# ScrollView

继承自 [View](../components/view.html)。

滚动内容的容器，滚动的前提是正确调用[updateViewPort](../api/api.html#updateviewport)
## 标签属性
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| scrollX | string |   否  |  是否需要横向滚动，支持 "true"和"false"，默认值为 "false" |
| scrollY | string |   否  | 是否需要纵向滚动，支持 "true"和"false", 默认值为"false" |

滚动列表默认不支持滚动，需要在标签的属性手动指定。

``` html
<scrollview scrollY="true"></scrollview>
```

## 属性
| 属性      | 类型   | 说明                                                                       |
| --------- | ------ | -------------------------------------------------------------------------- |
| scrollX   | boolean | 动态修改 ScrollView 是否可以横向滚动 |
| scrollY   | boolean | 动态修改 ScrollView 是否可以纵向滚动 |

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
