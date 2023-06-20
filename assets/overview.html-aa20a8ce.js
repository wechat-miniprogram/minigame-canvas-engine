import{_ as n,r,o as s,c as o,a as t,b as e,d as l,e as d}from"./app-948a10a6.js";const i={},p=d('<h1 id="布局概览" tabindex="-1"><a class="header-anchor" href="#布局概览" aria-hidden="true">#</a> 布局概览</h1><h2 id="标签" tabindex="-1"><a class="header-anchor" href="#标签" aria-hidden="true">#</a> 标签</h2><p>Layout 通过 xml 组织布局，Layout 支持的标签列表如下。</p><table><thead><tr><th>标签</th><th>说明</th></tr></thead><tbody><tr><td>view</td><td>容器标签，与 HTML 中的 div 相似</td></tr><tr><td>scrollview</td><td>滚动列表容器</td></tr><tr><td>image</td><td>图片标签</td></tr><tr><td>text</td><td>文本标签</td></tr><tr><td>bitmaptext</td><td>bitmapfont 文本标签</td></tr><tr><td>canvas</td><td>对齐 Web，允许获取 context 执行渲染</td></tr></tbody></table><h2 id="属性" tabindex="-1"><a class="header-anchor" href="#属性" aria-hidden="true">#</a> 属性</h2><p>属性是给标签提供的附加信息，每个标签都会通过属性来支持一些特有的功能，下面列举所有标签都会有的属性。</p>',6),c=t("thead",null,[t("tr",null,[t("th",null,"属性"),t("th",null,"类型"),t("th",null,"是否必填"),t("th",null,"说明")])],-1),h=t("tr",null,[t("td",null,"id"),t("td",null,"string"),t("td",null,"否"),t("td",null,[e("非唯一标识，两个标签可以共用 id，可以通过 "),t("strong",null,"Layout.getElementsById"),e(" 获取到元素实例")])],-1),u=t("tr",null,[t("td",null,"class"),t("td",null,"string"),t("td",null,"否"),t("td",null,"与浏览器相同")],-1),b=t("td",null,"dataset",-1),m=t("td",null,"string",-1),g=t("td",null,"否",-1),v={href:"https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset",target:"_blank",rel:"noopener noreferrer"},k=d(`<h2 id="样式" tabindex="-1"><a class="header-anchor" href="#样式" aria-hidden="true">#</a> 样式</h2><p>下面列举 Layout 支持的样式属性。</p><h3 id="布局" tabindex="-1"><a class="header-anchor" href="#布局" aria-hidden="true">#</a> 布局</h3><p>支持的标签：<code>view</code>、<code>scrollview</code>、<code>image</code>、<code>text</code>、<code>bitmaptext</code>、<code>canvas</code></p><table><thead><tr><th>属性名</th><th>支持的值或类型</th><th>默认值</th></tr></thead><tbody><tr><td>width, height</td><td>number/string(百分比场景，如 100%)</td><td>0</td></tr><tr><td>minWidth, minHeight</td><td>number/string(百分比场景，如 100%)</td><td>0</td></tr><tr><td>left, right, top, bottom</td><td>number</td><td>0</td></tr><tr><td>margin, marginLeft, marginRight, marginTop, marginBottom</td><td>number</td><td>0</td></tr><tr><td>padding, paddingLeft, paddingRight, paddingTop, paddingBottom</td><td>number</td><td>0</td></tr><tr><td>borderWidth, borderLeftWidth, borderRightWidth, borderTopWidth, borderBottomWidth</td><td>number</td><td>0</td></tr><tr><td>flexDirection</td><td>column, row</td><td>column</td></tr><tr><td>flexShrink</td><td>number</td><td>1</td></tr><tr><td>flexGrow</td><td>number</td><td></td></tr><tr><td>flexWrap</td><td>wrap, nowrap</td><td>nowrap</td></tr><tr><td>flex</td><td>number</td><td></td></tr><tr><td>justifyContent</td><td>flex-start, center, flex-end, space-between, space-around</td><td>flex-start</td></tr><tr><td>alignItems, alignSelf</td><td>flex-start, center, flex-end, stretch</td><td>flex-start</td></tr><tr><td>position</td><td>relative, absolute</td><td>relative</td></tr></tbody></table><h3 id="文本" tabindex="-1"><a class="header-anchor" href="#文本" aria-hidden="true">#</a> 文本</h3><p>支持的标签：<code>text</code></p><table><thead><tr><th>属性名</th><th>支持的值或类型</th><th>默认值</th></tr></thead><tbody><tr><td>fontSize</td><td>number</td><td>14</td></tr><tr><td>lineHeight</td><td>number / string</td><td>&#39;1.4em&#39;</td></tr><tr><td>textAlign</td><td>left, center, right</td><td>left</td></tr><tr><td>verticalAlign</td><td>top, middle, bottom</td><td>top</td></tr><tr><td>color</td><td>string</td><td>#000000</td></tr><tr><td>backgroundColor</td><td>string</td><td></td></tr><tr><td>textOverflow</td><td>ellipsis, clip</td><td>默认为空，出于性能考虑，只有显式指定 textOverflow 属性的时候才会对文字进行截断处理</td></tr><tr><td>letterSpacing</td><td>number</td><td>默认值为 0，只对 bitmaptext 标签生效</td></tr></tbody></table><h3 id="容器" tabindex="-1"><a class="header-anchor" href="#容器" aria-hidden="true">#</a> 容器</h3><p>支持的标签：<code>view</code>、<code>scrollview</code>、<code>image</code>、<code>text</code>、<code>bitmaptext</code>、<code>canvas</code></p><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>backgroundColor</td><td>string</td><td></td><td>背景的颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色</td></tr><tr><td>backgroundImage</td><td>string</td><td></td><td>背景图，格式为 url(https:/www.foo.com/xxx.png)</td></tr></tbody></table><h3 id="边框" tabindex="-1"><a class="header-anchor" href="#边框" aria-hidden="true">#</a> 边框</h3><p>支持的标签：<code>view</code>、<code>scrollview</code>、<code>image</code>、<code>text</code>、<code>bitmaptext</code>、<code>canvas</code></p><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>borderRadius</td><td>number</td><td></td><td>边框圆角</td></tr><tr><td>borderColor</td><td>string</td><td></td><td>边框颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色</td></tr></tbody></table><h3 id="默认样式" tabindex="-1"><a class="header-anchor" href="#默认样式" aria-hidden="true">#</a> 默认样式</h3><p>如果一个标签没有任何自定义样式，那么它遵循下面的默认样式：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token punctuation">{</span>
  <span class="token literal-property property">position</span><span class="token operator">:</span> <span class="token string">&#39;relative&#39;</span><span class="token punctuation">;</span>
  <span class="token literal-property property">display</span><span class="token operator">:</span> <span class="token string">&#39;flex&#39;</span><span class="token punctuation">;</span>
  <span class="token literal-property property">flexDirection</span><span class="token operator">:</span> <span class="token string">&#39;column&#39;</span><span class="token punctuation">;</span>
  <span class="token literal-property property">alignItems</span><span class="token operator">:</span> <span class="token string">&#39;stretch&#39;</span><span class="token punctuation">;</span>
  <span class="token literal-property property">flexShrink</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token literal-property property">alignContent</span><span class="token operator">:</span> <span class="token string">&#39;flex-start&#39;</span><span class="token punctuation">;</span>
  <span class="token literal-property property">borderWidth</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">borderColor</span><span class="token operator">:</span> <span class="token string">&#39;black&#39;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">margin</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token literal-property property">padding</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17);function x(f,y){const a=r("ExternalLinkIcon");return s(),o("div",null,[p,t("table",null,[c,t("tbody",null,[h,u,t("tr",null,[b,m,g,t("td",null,[e("与浏览器相同，详见"),t("a",v,[e("文档"),l(a)])])])])]),k])}const w=n(i,[["render",x],["__file","overview.html.vue"]]);export{w as default};
