# 字体设置

Layout 支持 fontFamily 属性来设置文字使用的字体，如果不设置该字段，文字将默认使用当前渲染系统的默认字体，不同渲染环境的默认字体是不同的，比如同样是小游戏环境，可能不同 iOS 版本苹果内置的默认字体也有变化。

## fontFamily 示例
fontFamily 规则对齐 CSS 的font-family，详情可见[font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)，参考值如 'Georgia, serif'。

特别重要的一点是，假设当前系统不存在该字体则设置无效，比如设置字体为苹果字体，在安卓机上大概率无效。

<iframe height="449.31109619140625" style="width: 100%;" scrolling="no" title="Layout Font" src="https://codepen.io/yuanzm/embed/LYwejRZ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/LYwejRZ">
  Layout Font</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 小游戏开放数据域使用字体
在小游戏开放数据域要使用系统字体同样是使用 fontFamily 来设置，但大多时候，游戏都会有自己的自定义字体，通过 [wx.loadFont](https://developers.weixin.qq.com/minigame/dev/api/render/font/wx.loadFont.html) 接口加载后使用，如果要在开放数据使用自定义字体，只需要把 wx.loadFont 得到的字体名传给开放数据域，开放数据域的 fontFamily 使用该字体名即可，核心代码如下：
``` js
// game.js
const fontFamily = wx.loadFont('xxxxx'); // 替换成真实的字体地址
let openDataContext = wx.getOpenDataContext();
openDataContext.postMessage({
  type: 'setFontFamily',
  fontFamily,
})

// open-data/index.js
wx.onMessage(data => {
  console.log(data)
  /* {
    type: 'setFontFamily',
    fontFaimly: 'customFamliy1' // 假设字体名称为 customFamliy1
  } */
  
  // Layout 可以使用 customFamliy1 作为 fontFamily 属性
});

```