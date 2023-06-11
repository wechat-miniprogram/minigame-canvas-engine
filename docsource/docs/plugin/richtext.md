### 富文本插件
富文本组件是用来显示一段带自定义样式的文字，自定义样式包括加粗、颜色、换行、居中等，富文本组件只能支持纯文本，不支持图片。

#### 安装使用
``` js
// 安装
tnpm install --save minigame-canvas-engine-richtext

// 引用
import RichText from 'minigame-canvas-engine-richtext'

// 安装插件
Layout.use(RichText);

// xml
<richtext id="rich"></richtext>

// 获取富文本的节点
const rich = Layout.getElementsById('rich')[0];

// 设置富文本的值
rich.text = `
<p>这是一段富文本测试</p>
<br>
<strong>这是一段加粗的标题</strong>
<p>这里展示了<strong>嵌套</strong>的标签</p>
<br>
<p>前面是一个换行</p>
<p>文字可以自定义<span style="color: red">颜色</span></p>
<br>
<p style="font-weight: 300">样式可以<span style="color: blue">继承</span>，也可以<span style="font-weight: bold">自定义</span>，这段很长的文字会自动换行，富文本组件都会自动处理好</p>
`;
```

#### 标签列表
富文本组件能够解析绝大多数 `html` 标签，标签支持嵌套，标签能够解析一些常规的样式，建议使用下面的标签来组织富文本结构。

| 标签 | 说明 | 示例 |
---- |---- |---- |---- |
| `<p>` | 表示文本的一个段落，该元素通常表现为一整块与相邻文本分离的文本 | `<p>这是一段富文本测试</p>` |
| `<strong>` | 表示文本十分重要，一般用粗体显示 | `<strong>这是一段加粗的标题</strong>` | 
| `<br>` | 换行标签 | `<br>` |
| `<span>` | 行内文本，两个 span 之间不会换行 | `<p>文字可以自定义<span style="color: red">颜色</span></p>` |

#### 标签样式
样式通过给标签添加 style 属性来设置，支持多个样式，两个样式之间用 `;` 分割，如果是相同的样式属性，后面的样式会覆盖前面的样式。

| 样式 | 说明  | 示例 |
---- |---- |---- |---- |
| color | 设置文本的颜色 | `<span style="color: red">颜色</span>` |
| font-weight | 设置文本粗细，可能的值 normal、bold、bolder、lighter、100、200、300、400、500、600、700、800、900 | `<span style="font-weight: bold">自定义</span>` |
| text-align | 设置文本的对齐方式，支持 left、right、center，默认是left，**居中的文本不支持内嵌标签** | `<p style="text-align: center">这是一段居中的文本，居中的文本暂不支持内嵌标签</p>` |
| font-style | 该属性设置使用斜体、倾斜或正常字体，支持 normal、italic、oblique、initial、inherit | `<span style="font-style: italic;color: red;">斜体</span>` |

<iframe height="559.0476684570312" style="width: 100%;" scrolling="no" title="Layout RichText Demo" src="https://codepen.io/yuanzm/embed/ExdOVKz?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/ExdOVKz">
  Layout RichText Demo</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>