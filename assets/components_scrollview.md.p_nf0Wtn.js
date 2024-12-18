import{_ as t,c as l,a2 as e,j as s,a as i,o as n}from"./chunks/framework.DMeVfvck.js";const y=JSON.parse('{"title":"ScrollView","description":"","frontmatter":{},"headers":[],"relativePath":"components/scrollview.md","filePath":"components/scrollview.md","lastUpdated":1734492135000}'),h={name:"components/scrollview.md"};function p(r,a,k,d,o,c){return n(),l("div",null,a[0]||(a[0]=[e(`<h1 id="scrollview" tabindex="-1">ScrollView <a class="header-anchor" href="#scrollview" aria-label="Permalink to &quot;ScrollView&quot;">​</a></h1><p>继承自 <a href="./../components/view.html">View</a>。</p><p>滚动内容的容器，滚动的前提是正确调用<a href="./../api/api.html#updateviewport">updateViewPort</a></p><h2 id="标签属性" tabindex="-1">标签属性 <a class="header-anchor" href="#标签属性" aria-label="Permalink to &quot;标签属性&quot;">​</a></h2><table tabindex="0"><thead><tr><th>属性</th><th>类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody><tr><td>scrollX</td><td>string</td><td>否</td><td>是否需要横向滚动，支持 &quot;true&quot;和&quot;false&quot;，默认值为 &quot;false&quot;</td></tr><tr><td>scrollY</td><td>string</td><td>否</td><td>是否需要纵向滚动，支持 &quot;true&quot;和&quot;false&quot;, 默认值为&quot;false&quot;</td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">温馨提示</p><p>为了兼容历史版本，默认做了一个逻辑，如果当前纵向内容大于 ScrollView 本身高度会自动开启纵向滚动特性，如果需要关闭，可以强行在标签指定 scrollY = &quot;false&quot;</p></div><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">scrollview</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> scrollY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;true&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">scrollview</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to &quot;属性&quot;">​</a></h2><table tabindex="0"><thead><tr><th>属性</th><th>类型</th><th>说明</th></tr></thead><tbody><tr><td>scrollX</td><td>boolean</td><td>动态修改 ScrollView 是否可以横向滚动</td></tr><tr><td>scrollY</td><td>boolean</td><td>动态修改 ScrollView 是否可以纵向滚动</td></tr><tr><td>vertivalScrollbar</td><td><a href="./scrollbar.html">ScrollBar</a></td><td>纵向滚动条实例</td></tr><tr><td>horizontalScrollbar</td><td><a href="./scrollbar.html">ScrollBar</a></td><td>横向滚动条实例</td></tr></tbody></table><p>当滚动开启时候，会自动插入滚动条组件，反之关闭的时候会删除滚动条组件。</p><div class="tip custom-block"><p class="custom-block-title">兼容性</p><p>滚动条特性 v1.0.4版本开始支持</p></div><p>示例</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> list</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Layout.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;list&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 将滚动列表动态设置为禁止纵向滚动</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">list.scrollY </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 在 init 之后内部有些异步逻辑取不到 vertivalScrollbar，需要延迟一帧执行</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Layout.ticker.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">next</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 隐藏滚动条</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  list.vertivalScrollbar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">hide</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 改变滚动条的宽度</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  list.vertivalScrollbar.width </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 20</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 改变滚动条的背景颜色</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  list.vertivalScrollbar.style.backgroundColor </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;red&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><h2 id="方法" tabindex="-1">方法 <a class="header-anchor" href="#方法" aria-label="Permalink to &quot;方法&quot;">​</a></h2><h3 id="scrollto" tabindex="-1">scrollTo <a class="header-anchor" href="#scrollto" aria-label="Permalink to &quot;scrollTo&quot;">​</a></h3><p>scrollTo(left: number = 0, top: number = 0, animate: number = true)</p><p>滚动到指定位置，如果当前需要纵向滚动到指定位置且不支持横向滚动，left 传0即可，横向滚动同理。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> list</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Layout.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;list&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 列表往上滚动 100</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">list.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">scrollTo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div><h3 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to &quot;示例&quot;">​</a></h3>`,19),s("iframe",{height:"609.4705810546875",style:{width:"100%"},scrolling:"no",title:"Layout RankList",src:"https://codepen.io/yuanzm/embed/QWZybox?default-tab=html%2Cresult&editable=true",frameborder:"no",loading:"lazy",allowtransparency:"true",allowfullscreen:"true"},[i(" See the Pen "),s("a",{href:"https://codepen.io/yuanzm/pen/QWZybox"}," Layout RankList"),i(" by yuanzm ("),s("a",{href:"https://codepen.io/yuanzm"},"@yuanzm"),i(") on "),s("a",{href:"https://codepen.io"},"CodePen"),i(". ")],-1)]))}const g=t(h,[["render",p]]);export{y as __pageData,g as default};