import{_ as o,r as p,o as r,c as l,a,b as s,d as e,e as n}from"./app-af1e9e55.js";const c="/minigame-canvas-engine/assets/dotjs-2d128d69.png",i="/minigame-canvas-engine/assets/tpl-00180df8.png",u="/minigame-canvas-engine/assets/tpl2-19d88997.png",d="/minigame-canvas-engine/assets/tpl3-964afb6e.png",k={},m=n(`<h1 id="模板引擎使用" tabindex="-1"><a class="header-anchor" href="#模板引擎使用" aria-hidden="true">#</a> 模板引擎使用</h1><h2 id="模板引擎简介" tabindex="-1"><a class="header-anchor" href="#模板引擎简介" aria-hidden="true">#</a> 模板引擎简介</h2><p>Layout 使用 XML 来组织页面布局，比如快速入门里面提到的:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> template <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
  &lt;view id=&quot;container&quot;&gt;
    &lt;text id=&quot;testText&quot; class=&quot;redText&quot; value=&quot;hello canvas&quot;&gt;&lt;/text&gt;
  &lt;/view&gt;
</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除了 xml 标签，要渲染出页面内容，最关键的还是有数据，因此一般将页面内容定义成<strong>模板 + 数据</strong>。如果页面内容不复杂，按照上面的方式拼模板并不会有太大的问题，但像游戏排行榜这样的场景，一般需要包含排名、昵称、分数等各种信息，手动拼模板字符串就会大大降低代码可维护性。</p><p>在 Web 开发领域，一般会用模板引擎来解决这个问题，不同模板引擎功能上可能略有差别，但一般会支持条件渲染、循环等操作。经过模板引擎编译后会得到一个模板函数，模板函数接受数据，就得到了页面内容。</p>`,6),v={href:"http://olado.github.io/doT/index.html",target:"_blank",rel:"noopener noreferrer"},g=n(`<h2 id="dot-js-基本使用" tabindex="-1"><a class="header-anchor" href="#dot-js-基本使用" aria-hidden="true">#</a> doT.js 基本使用</h2><p>用 doT.js 编写的模板默认接收 it 对象作为数据，常见的操作如下：</p><h3 id="插值" tabindex="-1"><a class="header-anchor" href="#插值" aria-hidden="true">#</a> 插值</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 语法</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>

<span class="token comment">// 示例</span>
<span class="token operator">&lt;</span>text id<span class="token operator">=</span><span class="token string">&quot;testText&quot;</span> <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;redText&quot;</span> value<span class="token operator">=</span><span class="token string">&quot;{{= it.title}}&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>text<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="循环" tabindex="-1"><a class="header-anchor" href="#循环" aria-hidden="true">#</a> 循环</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 语法</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>

<span class="token comment">// 示例</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span>it<span class="token punctuation">.</span>data <span class="token operator">:</span>item<span class="token operator">:</span>index<span class="token punctuation">}</span><span class="token punctuation">}</span>
  <span class="token operator">&lt;</span>view <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listItem&quot;</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>text font<span class="token operator">=</span><span class="token string">&quot;fnt_number-export&quot;</span> <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listItemNum&quot;</span> value<span class="token operator">=</span><span class="token string">&quot;{{= index + 1}}&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>text<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>image <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listHeadImg&quot;</span> src<span class="token operator">=</span><span class="token string">&quot;{{= item.avatarUrl }}&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>image<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>text <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listItemName&quot;</span> value<span class="token operator">=</span><span class="token string">&quot;{{= item.nickname}}&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>text<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>text <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listItemScore&quot;</span> value<span class="token operator">=</span><span class="token string">&quot;{{= item.rankScore}}&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>text<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>text <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listScoreUnit&quot;</span> value<span class="token operator">=</span><span class="token string">&quot;分&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>text<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>view<span class="token operator">&gt;</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例里面it.data是一个 Array，代表排行榜列表，此处可以循环生成一组标签，每组标签代表列表里面的一项数据(item)，每项数据(item)又会包含排行数据需要的头像、昵称、分数等信息。</p><h3 id="条件判断" tabindex="-1"><a class="header-anchor" href="#条件判断" aria-hidden="true">#</a> 条件判断</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 语法</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">?</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>

<span class="token comment">// 示例</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span>it<span class="token punctuation">.</span>data <span class="token operator">:</span>item<span class="token operator">:</span>index<span class="token punctuation">}</span><span class="token punctuation">}</span>
  <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">?</span> index <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">===</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
    <span class="token operator">&lt;</span>view <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listItem listItemOld&quot;</span><span class="token operator">&gt;</span>
  <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">?</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
  <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">?</span> index <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">===</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
    <span class="token operator">&lt;</span>view <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listItem&quot;</span><span class="token operator">&gt;</span>
  <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">?</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
    <span class="token operator">&lt;</span>text font<span class="token operator">=</span><span class="token string">&quot;fnt_number-export&quot;</span> <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listItemNum&quot;</span> value<span class="token operator">=</span><span class="token string">&quot;{{= index + 1}}&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>text<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>image <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listHeadImg&quot;</span> src<span class="token operator">=</span><span class="token string">&quot;{{= item.avatarUrl }}&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>image<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>text <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listItemName&quot;</span> value<span class="token operator">=</span><span class="token string">&quot;{{= item.nickname}}&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>text<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>text <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listItemScore&quot;</span> value<span class="token operator">=</span><span class="token string">&quot;{{= item.rankScore}}&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>text<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>text <span class="token keyword">class</span><span class="token operator">=</span><span class="token string">&quot;listScoreUnit&quot;</span> value<span class="token operator">=</span><span class="token string">&quot;分&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>text<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>view<span class="token operator">&gt;</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例里面，条件判断了当前 index 是奇数还是偶数给与 view 标签设置不一样的 class，针对不同的 class 可以设置不同的样式，这就很方便实现列表里面奇数和偶数项实现不同的底色。如果是想高亮排行榜里面的前三名，同样可以用类似的条件判断。</p>`,10),h={href:"http://olado.github.io/doT/index.html",target:"_blank",rel:"noopener noreferrer"},b=n('<img src="'+c+'"><h2 id="layout-devtools集成" tabindex="-1"><a class="header-anchor" href="#layout-devtools集成" aria-hidden="true">#</a> Layout devtools集成</h2><p>除了使用 doT.js 提供的在线模板编译，Layout 更推荐通过 codepen 来创建和维护模板，具体使用步骤如下</p><h3 id="通过模板创建-codepen" tabindex="-1"><a class="header-anchor" href="#通过模板创建-codepen" aria-hidden="true">#</a> 通过模板创建 codepen</h3>',4),q={href:"https://codepen.io/pen?template=VwEeLKw",target:"_blank",rel:"noopener noreferrer"},x=n('<img src="'+i+'"><h3 id="导出模板函数" tabindex="-1"><a class="header-anchor" href="#导出模板函数" aria-hidden="true">#</a> 导出模板函数</h3><p>因为小游戏不能使用 new Function 和 eval 等操作，所以模板函数必须提前导出，点击顶部 Layout 调试工具箱的 dot，会调用 doT.js 编译出模板函数，将此模板函数复制到小游戏内可以直接使用。</p><img src="'+u+'"><h3 id="永久化保存" tabindex="-1"><a class="header-anchor" href="#永久化保存" aria-hidden="true">#</a> 永久化保存</h3><p>模板难免反复编辑和迭代，为了永久化保存，可以点击 Save 保存到自己的 codepen 账户。</p><img src="'+d+'">',7);function _(f,w){const t=p("ExternalLinkIcon");return r(),l("div",null,[m,a("p",null,[s("关于选择什么模板引擎，其实并没有太大的考量，Layout 仅仅是推荐 "),a("a",v,[s("doT.js"),e(t)]),s("。")]),g,a("p",null,[s("doT.js 还提供了在线的模板编译操作（ http 的链接"),a("a",h,[s("http://olado.github.io/doT/index.html"),e(t)]),s("才能出来这在线编译）：")]),b,a("ol",null,[a("li",null,[s("点击"),a("a",q,[s("https://codepen.io/pen?template=VwEeLKw"),e(t)]),s("，会创建一个包含Layout hello world示例的模板，该模板已经包含了 doT.js 的基本操作。")])]),x])}const j=o(k,[["render",_],["__file","templateengine.html.vue"]]);export{j as default};