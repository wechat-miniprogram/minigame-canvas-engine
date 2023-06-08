### 概览
随着应用场景变多，不可避免需要新增一些组件来满足需求，而 Layout 设计里面很重要的一个点是轻量，所以提供了插件机制来满足这些场景。

#### 插件开发
插件借鉴了 Vue 的设计，对插件能做什么，没什么限制，插件只需要暴露一个 install 方法和 name 即可，Layout.use 方法实现插件的安装。一个最简单的插件示意如下
``` js
const HelloPlugin =  {
  install(Layout) {
    Layout.sayHello = () => {
      console.log('Hello Layout Plugin');
    }
  },
  name: 'Hello'
}

Layout.use(HelloPlugin);


Layout.sayHello(); // 控制台打印 Hello Layout Plugin

```
<iframe height="449.01165771484375" style="width: 100%;" scrolling="no" title="Layout Plugin" src="https://codepen.io/yuanzm/embed/wvQvrNo?default-tab=js%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/wvQvrNo">
  Layout Plugin</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>