# Text

继承自 [Element](/components/element.html)。

## 特殊属性
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| value | string |    是 |文字内容|

## 重要版本变更提示
::: tip 温馨提示
从 v1.0.15 版本开始，大幅度重构和优化了文字的渲染。
:::

1. 如果文本不设置宽度，Layout 会默认为文字计算文字宽度，这可能使得文字自动计算出来的长度远超预期进而影响预期的页面布局，因此仍然建议手动为文字设置宽度。

2. 不再建议通过设置 `height` 和 `lineHeight` 为同一个值来实现文字居中：
   - 如果没有设置高度，文本组件现在会根据内容和换行情况自动计算合适的高度，自动计算的高度会考虑 `fontSize`、`lineHeight` 等因素；
   - 原先的文本垂直居中的特性，可以使用 `verticalAlign` 来控制文本在容器中的垂直对齐方式；

3. text-overflow 属性行为变更
   - 之前版本：设置了 `width` 和 `text-overflow: ellipsis` 会自动根据宽度截断并显示省略号；
   - 现在版本：必须同时设置 `white-space: nowrap`，省略号才会生效，因为文本会默认换行；
   - 这个改动使文本截断行为更符合 Web 标准；

## 文字换行规则

Text 组件提供了丰富的文字换行控制能力，主要通过以下样式属性来控制：

#### whiteSpace 样式属性
控制文本如何处理空白符（空格、制表符）和换行符，whiteSpace 默认为 normal，即文本会默认换行：

| 值 | 空白符处理 | 换行符处理 | 自动换行 | 说明 | 常见用途 |
|---|------------|------------|----------|------|----------|
| normal | 合并 | 忽略 | 允许 | 将连续的空白符合并为一个空格，忽略换行符，文本根据容器宽度自动换行 | 最常用的多行文本展示方式 |
| nowrap | 合并 | 忽略 | 禁止 | 将连续的空白符合并为一个空格，忽略换行符，文本强制在一行显示 | 配合 text-overflow: ellipsis 实现单行省略 |
| pre | 保留 | 保留 | 禁止 | 保留所有空白符和换行符，但不允许自动换行 | 保留格式，但不会自动换行，只有换行符才会换行 |
| pre-wrap | 保留 | 保留 | 允许 | 保留所有空白符和换行符，同时允许文本自动换行 | 既要保留格式，又要自适应容器宽度进行换行的场景 |
| pre-line | 合并 | 保留 | 允许 | 合并空白符，保留换行符，允许文本自动换行 | 用户输入的多行文本展示 |

#### wordBreak 样式属性
控制单词和文本的断行规则：

| 值 | CJK文本 | 非CJK文本 | 说明 | 常见用途 |
|---|----------|-----------|------|----------|
| normal | 允许在字符间断行 | 仅在空格或连字符处断行 | 遵循语言默认的断行规则，中文可以在任意字符间断行，英文在单词边界断行 | 最常用的断行方式，适合大多数场景 |
| break-all | 允许在字符间断行 | 允许在任意字符间断行 | 允许在任意字符间断行，包括单词中间，可能会破坏单词的可读性 | 处理超长的连续英文字符，如 hash 值 |

#### overflowWrap (wordWrap) 样式属性
控制是否允许在单词内部换行：

| 值 | 行为 | 对比 wordBreak | 说明 | 常见用途 |
|---|------|----------------|------|----------|
| normal | 仅在允许的断点换行 | 与 wordBreak: normal 配合使用 | 遵循语言规则，不会在单词中间断行 | 一般的文本排版 |
| break-word | 必要时在单词内换行 | 比 wordBreak: break-all 更温和 | 优先在单词边界断行，实在放不下时才会在单词中间断行 | 处理长 URL、长邮箱等内容 |

## 示例

## 注意事项

1. 版本 v1.0.15 重要变更：
   - 不建议主动设置文本高度，让组件自动计算
   - `text-overflow: ellipsis` 需要配合 `white-space: nowrap` 使用

2. 文本换行的关键点：
   - 设置 `width` 是触发自动换行的前提
   - CJK 文本（中日韩）可以在任意字符间换行
   - 英文单词默认在空格、连字符等位置换行
   - `word-break: break-all` 用于强制断词
   - `overflow-wrap: break-word` 用于长 URL 等特殊场景

3. 性能建议：
   - 使用类选择器而不是内联样式
   - 避免频繁改变文本内容导致重复计算高度
   - 注意 emoji 表情可能的截断问题

## 在线示例
<iframe height="580.0000915527344" style="width: 100%;" scrolling="no" title="Layout Text" src="https://codepen.io/yuanzm/embed/bGZdjEg?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/bGZdjEg">
  Layout Text</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>