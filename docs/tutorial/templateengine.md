# 模板引擎使用

Layout 使用 XML 来组织页面布局，比如快速入门里面提到的:
```js
let template = `
  <view id="container">
    <text id="testText" class="redText" value="hello canvas"></text>
  </view>
`;
```
在页面结构不够复杂的时候并不会有什么问题，但当页面存在列表这种复杂布局的时候，模板也会相应变得复杂，