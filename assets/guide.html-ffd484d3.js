import{_ as n,o as a,c as s,e,a as t}from"./app-35c03fee.js";const o={},p=e(`<h1 id="概览" tabindex="-1"><a class="header-anchor" href="#概览" aria-hidden="true">#</a> 概览</h1><p>随着应用场景变多，不可避免需要新增一些组件来满足需求，而 Layout 设计里面很重要的一个点是轻量，所以提供了插件机制来满足这些场景。</p><h4 id="插件开发" tabindex="-1"><a class="header-anchor" href="#插件开发" aria-hidden="true">#</a> 插件开发</h4><p>插件借鉴了 Vue 的设计，对插件能做什么，没什么限制，插件只需要暴露一个 install 方法和 name 即可，Layout.use 方法实现插件的安装。一个最简单的插件示意如下</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> HelloPlugin <span class="token operator">=</span>  <span class="token punctuation">{</span>
  <span class="token function">install</span><span class="token punctuation">(</span><span class="token parameter">Layout</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    Layout<span class="token punctuation">.</span><span class="token function-variable function">sayHello</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Hello Layout Plugin&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;Hello&#39;</span>
<span class="token punctuation">}</span>

Layout<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>HelloPlugin<span class="token punctuation">)</span><span class="token punctuation">;</span>


Layout<span class="token punctuation">.</span><span class="token function">sayHello</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 控制台打印 Hello Layout Plugin</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果有需要，可以提供插件的 uninstall方法，通过 Layout.unUse 可以卸载插件。</p>`,6),l=t("iframe",{height:"449.01165771484375",style:{width:"100%"},scrolling:"no",title:"Layout Plugin",src:"https://codepen.io/yuanzm/embed/wvQvrNo?default-tab=js%2Cresult&editable=true",frameborder:"no",loading:"lazy",allowtransparency:"true",allowfullscreen:"true"},`
  See the Pen <a href="https://codepen.io/yuanzm/pen/wvQvrNo">
  Layout Plugin</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
`,-1),c=[p,l];function i(u,r){return a(),s("div",null,c)}const k=n(o,[["render",i],["__file","guide.html.vue"]]);export{k as default};
