import{_ as c,c as d,b as e,e as a,f as t,a as p,d as s,r as o,o as r}from"./app-BDAF0ZOp.js";const u={},m={class:"table-of-contents"},g={id:"getboundingclientrect-rect",tabindex:"-1"},k={class:"header-anchor",href:"#getboundingclientrect-rect"},v={id:"getviewportrect-rect",tabindex:"-1"},h={class:"header-anchor",href:"#getviewportrect-rect"};function b(y,n){const l=o("router-link"),i=o("RouteLink");return r(),d("div",null,[e("nav",m,[e("ul",null,[e("li",null,[a(l,{to:"#xml属性"},{default:t(()=>n[0]||(n[0]=[s("xml属性")])),_:1})]),e("li",null,[a(l,{to:"#方法"},{default:t(()=>n[1]||(n[1]=[s("方法")])),_:1}),e("ul",null,[e("li",null,[a(l,{to:"#getelementsbyid-elementid-string-element"},{default:t(()=>n[2]||(n[2]=[s("getElementsById(elementId: string): Element[]")])),_:1})]),e("li",null,[a(l,{to:"#getelementbyid"},{default:t(()=>n[3]||(n[3]=[s("getElementById")])),_:1})]),e("li",null,[a(l,{to:"#getelementsbyclassname-classname-string-element"},{default:t(()=>n[4]||(n[4]=[s("getElementsByClassName(className: string): Element[]")])),_:1})]),e("li",null,[a(l,{to:"#getboundingclientrect-rect"},{default:t(()=>n[5]||(n[5]=[s("getBoundingClientRect(): Rect")])),_:1})]),e("li",null,[a(l,{to:"#getviewportrect-rect"},{default:t(()=>n[6]||(n[6]=[s("getViewportRect(): Rect")])),_:1})]),e("li",null,[a(l,{to:"#appendchild-ele-element"},{default:t(()=>n[7]||(n[7]=[s("appendChild(ele: Element)")])),_:1})]),e("li",null,[a(l,{to:"#removechild-ele-element"},{default:t(()=>n[8]||(n[8]=[s("removeChild(ele: Element)")])),_:1})])])])])]),n[13]||(n[13]=p(`<h1 id="element" tabindex="-1"><a class="header-anchor" href="#element"><span>Element</span></a></h1><p>Element 是所有组件的基类，Element 描述了所有组件所普遍具有的方法和属性。一些组件继承自 Element 并且增加了一些额外功能的接口描述了具体的行为。</p><h2 id="xml属性" tabindex="-1"><a class="header-anchor" href="#xml属性"><span>xml属性</span></a></h2><table><thead><tr><th>属性</th><th>类型</th><th>说明</th></tr></thead><tbody><tr><td>dataset</td><td>Object</td><td>标签上通过 <strong>data-*</strong> 设置的属性会存到 dataset 字段，方便记录一些节点信息</td></tr></tbody></table><h2 id="方法" tabindex="-1"><a class="header-anchor" href="#方法"><span>方法</span></a></h2><h3 id="getelementsbyid-elementid-string-element" tabindex="-1"><a class="header-anchor" href="#getelementsbyid-elementid-string-element"><span>getElementsById(elementId: string): Element[]</span></a></h3><p>获取元素id为<strong>elementId</strong>的一组元素，之所以是一组元素是因为这里 id 的实现没有对齐 Web，id并不是唯一的，只是一个标识。</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line"><span class="token comment">// &lt;view id=&quot;container&quot;&gt;&lt;/view&gt;</span></span>
<span class="line"><span class="token keyword">const</span> container <span class="token operator">=</span> Layout<span class="token punctuation">.</span><span class="token function">getElementsById</span><span class="token punctuation">(</span><span class="token string">&#39;container&#39;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getelementbyid" tabindex="-1"><a class="header-anchor" href="#getelementbyid"><span>getElementById</span></a></h3><div class="hint-container tip"><p class="hint-container-title">兼容性</p><p>v1.0.1版本开始支持</p></div><p>Layout.getElementById(String elementId)</p><p>获取元素id为<strong>elementId</strong>的第一个节点，id唯一性由业务侧自行保证。</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line"><span class="token comment">// &lt;view id=&quot;container&quot;&gt;&lt;/view&gt;</span></span>
<span class="line"><span class="token keyword">const</span> container <span class="token operator">=</span> Layout<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;container&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getelementsbyclassname-classname-string-element" tabindex="-1"><a class="header-anchor" href="#getelementsbyclassname-classname-string-element"><span>getElementsByClassName(className: string): Element[]</span></a></h3><p>获取包含class为<strong>className</strong>的一组元素。</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * &lt;view id=&quot;container&quot;&gt;</span>
<span class="line">    &lt;view class=&quot;item&quot;&gt;&lt;/view&gt;</span>
<span class="line">    &lt;view class=&quot;item&quot;&gt;&lt;/view&gt;</span>
<span class="line">    &lt;view class=&quot;item&quot;&gt;&lt;/view&gt;</span>
<span class="line">   &lt;/view&gt;</span>
<span class="line"> */</span></span>
<span class="line"><span class="token keyword">const</span> list <span class="token operator">=</span> Layout<span class="token punctuation">.</span><span class="token function">getElementsByClassName</span><span class="token punctuation">(</span><span class="token string">&#39;item&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>list<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 3</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16)),e("h3",g,[e("a",k,[e("span",null,[n[10]||(n[10]=s("getBoundingClientRect(): ")),a(i,{to:"/components/rect.html"},{default:t(()=>n[9]||(n[9]=[s("Rect")])),_:1})])])]),n[14]||(n[14]=e("p",null,[s("返回一个组件在"),e("strong",null,"canvas"),s("画布中的位置和尺寸信息。")],-1)),e("h3",v,[e("a",h,[e("span",null,[n[12]||(n[12]=s("getViewportRect(): ")),a(i,{to:"/components/rect.html"},{default:t(()=>n[11]||(n[11]=[s("Rect")])),_:1})])])]),n[15]||(n[15]=p(`<p>返回一个组件在<strong>屏幕</strong>中的位置和尺寸信息，前提是正确调用<a href="/api/api.html#updateviewport" target="_blank" rel="noopener noreferrer">updateViewPort</a>。</p><h3 id="appendchild-ele-element" tabindex="-1"><a class="header-anchor" href="#appendchild-ele-element"><span>appendChild(ele: Element)</span></a></h3><p>给一个组件添加子节点，这通常用于拷贝A组件之后添加到A组件的父容器，避免重新执行 Layout.init 流程，提升性能。</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line"><span class="token comment">// 获取 ScrollView</span></span>
<span class="line"><span class="token keyword">const</span> list <span class="token operator">=</span> Layout<span class="token punctuation">.</span><span class="token function">getElementsByClassName</span><span class="token punctuation">(</span><span class="token string">&#39;list&#39;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">// 获取列表的每一项</span></span>
<span class="line"><span class="token keyword">const</span> listItem <span class="token operator">=</span> list<span class="token punctuation">.</span><span class="token function">getElementsByClassName</span><span class="token punctuation">(</span><span class="token string">&#39;listItem&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">listItem<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">  list<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>Layout<span class="token punctuation">.</span><span class="token function">cloneNode</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="removechild-ele-element" tabindex="-1"><a class="header-anchor" href="#removechild-ele-element"><span>removeChild(ele: Element)</span></a></h3><p>移除给定的子节点</p><h1 id="事件" tabindex="-1"><a class="header-anchor" href="#事件"><span>事件</span></a></h1><p>通过 getElementsById 或者 getElementsByClassName 获取元素之后，可以的绑定事件，支持的事件有<code>touchstart</code>、<code>touchmove</code>、<code>touchend</code>、<code>touchcancel</code>、<code>click</code>、<code>scroll(只有scrollview支持）</code>示例如下：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line"><span class="token keyword">const</span> list <span class="token operator">=</span> Layout<span class="token punctuation">.</span><span class="token function">getElementsByClassName</span><span class="token punctuation">(</span><span class="token string">&#39;listItem&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">list<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">  item<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;touchstart&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>e<span class="token punctuation">,</span> item<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9))])}const E=c(u,[["render",b],["__file","element.html.vue"]]),w=JSON.parse('{"path":"/components/element.html","title":"Element","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"xml属性","slug":"xml属性","link":"#xml属性","children":[]},{"level":2,"title":"方法","slug":"方法","link":"#方法","children":[{"level":3,"title":"getElementsById(elementId: string): Element[]","slug":"getelementsbyid-elementid-string-element","link":"#getelementsbyid-elementid-string-element","children":[]},{"level":3,"title":"getElementById","slug":"getelementbyid","link":"#getelementbyid","children":[]},{"level":3,"title":"getElementsByClassName(className: string): Element[]","slug":"getelementsbyclassname-classname-string-element","link":"#getelementsbyclassname-classname-string-element","children":[]},{"level":3,"title":"getBoundingClientRect(): Rect","slug":"getboundingclientrect-rect","link":"#getboundingclientrect-rect","children":[]},{"level":3,"title":"getViewportRect(): Rect","slug":"getviewportrect-rect","link":"#getviewportrect-rect","children":[]},{"level":3,"title":"appendChild(ele: Element)","slug":"appendchild-ele-element","link":"#appendchild-ele-element","children":[]},{"level":3,"title":"removeChild(ele: Element)","slug":"removechild-ele-element","link":"#removechild-ele-element","children":[]}]}],"git":{"updatedTime":1729780904000},"filePathRelative":"components/element.md"}');export{E as comp,w as data};
