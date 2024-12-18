import{_ as t,c as e,a2 as n,j as s,a,o as l}from"./chunks/framework.DMeVfvck.js";const c=JSON.parse('{"title":"字体设置","description":"","frontmatter":{},"headers":[],"relativePath":"tutorial/font.md","filePath":"tutorial/font.md","lastUpdated":1734492135000}'),p={name:"tutorial/font.md"};function h(k,i,o,r,d,E){return l(),e("div",null,i[0]||(i[0]=[n('<h1 id="字体设置" tabindex="-1">字体设置 <a class="header-anchor" href="#字体设置" aria-label="Permalink to &quot;字体设置&quot;">​</a></h1><p>Layout 支持 fontFamily 属性来设置文字使用的字体，如果不设置该字段，文字将默认使用当前渲染系统的默认字体，不同渲染环境的默认字体是不同的，比如同样是小游戏环境，可能不同 iOS 版本苹果内置的默认字体也有变化。</p><h2 id="fontfamily-示例" tabindex="-1">fontFamily 示例 <a class="header-anchor" href="#fontfamily-示例" aria-label="Permalink to &quot;fontFamily 示例&quot;">​</a></h2><p>fontFamily 规则对齐 CSS 的font-family，详情可见<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/font-family" target="_blank" rel="noreferrer">font-family</a>，参考值如 &#39;Georgia, serif&#39;。</p><p>特别重要的一点是，假设当前系统不存在该字体则设置无效，比如设置字体为苹果字体，在安卓机上大概率无效。</p>',5),s("iframe",{height:"449.31109619140625",style:{width:"100%"},scrolling:"no",title:"Layout Font",src:"https://codepen.io/yuanzm/embed/LYwejRZ?default-tab=html%2Cresult",frameborder:"no",loading:"lazy",allowtransparency:"true",allowfullscreen:"true"},[a(" See the Pen "),s("a",{href:"https://codepen.io/yuanzm/pen/LYwejRZ"}," Layout Font"),a(" by yuanzm ("),s("a",{href:"https://codepen.io/yuanzm"},"@yuanzm"),a(") on "),s("a",{href:"https://codepen.io"},"CodePen"),a(". ")],-1),n(`<h2 id="小游戏开放数据域使用字体" tabindex="-1">小游戏开放数据域使用字体 <a class="header-anchor" href="#小游戏开放数据域使用字体" aria-label="Permalink to &quot;小游戏开放数据域使用字体&quot;">​</a></h2><p>在小游戏开放数据域要使用系统字体同样是使用 fontFamily 来设置，但大多时候，游戏都会有自己的自定义字体，通过 <a href="https://developers.weixin.qq.com/minigame/dev/api/render/font/wx.loadFont.html" target="_blank" rel="noreferrer">wx.loadFont</a> 接口加载后使用，如果要在开放数据使用自定义字体，只需要把 wx.loadFont 得到的字体名传给开放数据域，开放数据域的 fontFamily 使用该字体名即可，核心代码如下：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// game.js</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> fontFamily</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> wx.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">loadFont</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;xxxxx&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 替换成真实的字体地址</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> openDataContext </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> wx.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getOpenDataContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">openDataContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">postMessage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  type: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;setFontFamily&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  fontFamily,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// open-data/index.js</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">wx.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onMessage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">data</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(data)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /* {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    type: &#39;setFontFamily&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    fontFaimly: &#39;customFamliy1&#39; // 假设字体名称为 customFamliy1</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  } */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // Layout 可以使用 customFamliy1 作为 fontFamily 属性</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div>`,3)]))}const g=t(p,[["render",h]]);export{c as __pageData,g as default};