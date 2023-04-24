# ScrollView

继承自 [View](/components/view.html)。

滚动内容的容器，滚动的前提是正确调用[updateViewPort](/api/api.html#updateviewport)
### 特殊属性
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| scrollX | string |   否  |  是否需要横向滚动，支持 "true"和"false"，默认值为 "false" |
| scrollY | string |   否  | 是否需要纵向滚动，支持 "true"和"false", 默认值为"false" |

滚动列表默认不支持滚动，需要在标签的属性手动指定。

### 示例
<iframe height="609.4705810546875" style="width: 100%;" scrolling="no" title="Layout RankList" src="https://codepen.io/yuanzm/embed/QWZybox?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/QWZybox">
  Layout RankList</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
