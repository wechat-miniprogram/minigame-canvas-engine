import{_ as e,r as p,o,c,a as n,b as a,d as t,e as l}from"./app-d1e1da6d.js";const i={},r=n("h1",{id:"canvas",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#canvas","aria-hidden":"true"},"#"),a(" Canvas")],-1),u={href:"/components/element.html",target:"_blank",rel:"noopener noreferrer"},d={href:"https://github.com/wechat-miniprogram/minigame-canvas-engine/tree/master/demos/noengine",target:"_blank",rel:"noopener noreferrer"},k=l(`<h2 id="标签属性" tabindex="-1"><a class="header-anchor" href="#标签属性" aria-hidden="true">#</a> 标签属性</h2><table><thead><tr><th>属性</th><th>类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody><tr><td>width</td><td>Number</td><td>否</td><td>canvas 画布的尺寸，与样式的尺寸不是一个概念</td></tr><tr><td>height</td><td>Number</td><td>否</td><td>canvas 画布的尺寸，与样式的尺寸不是一个概念</td></tr><tr><td>autoCreateCanvas</td><td>String</td><td>否</td><td>是否自动创建 canvas，默认为 &quot;false&quot;，有些场景如微信小游戏场景，sharedCavans非业务创建，则需要手动设置canvas 实例</td></tr></tbody></table><h2 id="属性" tabindex="-1"><a class="header-anchor" href="#属性" aria-hidden="true">#</a> 属性</h2><table><thead><tr><th>属性</th><th>类型</th><th>说明</th></tr></thead><tbody><tr><td>canvas</td><td>HTMLCanvasElement</td><td>当标签属性 autoCreateCanvas 为 false 的时候，意味着 canvas 需要手动创建并设置给 Canvas 组件实例</td></tr></tbody></table><h2 id="方法" tabindex="-1"><a class="header-anchor" href="#方法" aria-hidden="true">#</a> 方法</h2><h3 id="update" tabindex="-1"><a class="header-anchor" href="#update" aria-hidden="true">#</a> update</h3><p>Canvas 组件本身只是个容器，并不关心具体的 canvas 画布是不是更新了，需要手动调用 update 方法才能将 canvas 同步到 Layout 画布。</p><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例" aria-hidden="true">#</a> 示例</h2><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>canvas</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>rank<span class="token punctuation">&quot;</span></span> <span class="token attr-name">width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>300<span class="token punctuation">&quot;</span></span> <span class="token attr-name">height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>300<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>canvas</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> style <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">container</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token number">500</span><span class="token punctuation">,</span>
    <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token number">500</span><span class="token punctuation">,</span>
    <span class="token literal-property property">backgroundColor</span><span class="token operator">:</span> <span class="token string">&#39;#f3f3f3&#39;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">rank</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token number">300</span><span class="token punctuation">,</span>
    <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token number">300</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> rank <span class="token operator">=</span> Layout<span class="token punctuation">.</span><span class="token function">getElementsById</span><span class="token punctuation">(</span><span class="token string">&#39;rank&#39;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">updateRank</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  rank<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 手动指定 canvas 实例</span>
rank<span class="token punctuation">.</span>canvas <span class="token operator">=</span> sharedCanvas<span class="token punctuation">;</span> <span class="token comment">// sharedCanvas 为业务自己管理的 canvas 实例</span>

<span class="token comment">// 要求Layout每帧刷新开放数据域 canvas 的绘制</span>
Layout<span class="token punctuation">.</span>ticker<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>updateRank<span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11),v=n("iframe",{height:"621.406982421875",style:{width:"100%"},scrolling:"no",title:"Untitled",src:"https://codepen.io/yuanzm/embed/ExdPJKW?default-tab=html%2Cresult&editable=true",frameborder:"no",loading:"lazy",allowtransparency:"true",allowfullscreen:"true"},`
  See the Pen <a href="https://codepen.io/yuanzm/pen/ExdPJKW">
  Untitled</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
`,-1);function h(m,b){const s=p("ExternalLinkIcon");return o(),c("div",null,[r,n("p",null,[a("继承自 "),n("a",u,[a("Element"),t(s)]),a("。")]),n("p",null,[a("与浏览器的canvas标签类似，Layout 标签允许你插入一个画布自由更新画布内容，这在某些场景会非常有用，比如你想通过Layout完成构建小游戏示例，包括游戏和开放数据域，例如"),n("a",d,[a("noengine demo"),t(s)]),a("。")]),k,v])}const y=e(i,[["render",h],["__file","canvas.html.vue"]]);export{y as default};