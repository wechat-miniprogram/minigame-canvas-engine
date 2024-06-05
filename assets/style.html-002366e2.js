import{_ as n,r as l,o,c as a,a as t,b as d,d as i,e}from"./app-af1e9e55.js";const c={},h=e('<h1 id="样式" tabindex="-1"><a class="header-anchor" href="#样式" aria-hidden="true">#</a> 样式</h1><p>下面列举 Layout 支持的样式属性。</p><h2 id="布局" tabindex="-1"><a class="header-anchor" href="#布局" aria-hidden="true">#</a> 布局</h2><p>支持的标签：<code>view</code>、<code>scrollview</code>、<code>image</code>、<code>text</code>、<code>bitmaptext</code>、<code>canvas</code></p><table><thead><tr><th>属性名</th><th>支持的值或类型</th><th>默认值</th></tr></thead><tbody><tr><td>width</td><td>number/string(百分比场景，如 100%)</td><td>0</td></tr><tr><td>height</td><td>number/string(百分比场景，如 100%)</td><td>0</td></tr><tr><td>position</td><td>relative, absolute</td><td>relative</td></tr><tr><td>left</td><td>number</td><td>0</td></tr><tr><td>top</td><td>number</td><td>0</td></tr><tr><td>right</td><td>number</td><td>0</td></tr><tr><td>bottom</td><td>number</td><td>0</td></tr><tr><td>margin</td><td>number</td><td>0</td></tr><tr><td>marginLeft</td><td>number</td><td>0</td></tr><tr><td>marginRight</td><td>number</td><td>0</td></tr><tr><td>marginTop</td><td>number</td><td>0</td></tr><tr><td>marginBottom</td><td>number</td><td>0</td></tr><tr><td>padding</td><td>number</td><td>0</td></tr><tr><td>paddingLeft</td><td>number</td><td>0</td></tr><tr><td>paddingRight</td><td>number</td><td>0</td></tr><tr><td>paddingTop</td><td>number</td><td>0</td></tr><tr><td>paddingBottom</td><td>number</td><td>0</td></tr><tr><td>borderWidth</td><td>number</td><td>0</td></tr><tr><td>borderRadius</td><td>number</td><td>0</td></tr><tr><td>flexDirection</td><td>column, row</td><td>row</td></tr><tr><td>flexShrink</td><td>number</td><td>1</td></tr><tr><td>flexGrow</td><td>number</td><td></td></tr><tr><td>flexWrap</td><td>wrap, nowrap</td><td>nowrap</td></tr><tr><td>justifyContent</td><td>flex-start, center, flex-end, space-between, space-around</td><td>flex-start</td></tr><tr><td>alignItems, alignSelf</td><td>flex-start, center, flex-end, stretch</td><td>flex-start</td></tr></tbody></table><h2 id="文本" tabindex="-1"><a class="header-anchor" href="#文本" aria-hidden="true">#</a> 文本</h2><p>支持的标签：<code>text</code></p>',7),s=t("thead",null,[t("tr",null,[t("th",null,"属性名"),t("th",null,"支持的值或类型"),t("th",null,"默认值")])],-1),u=t("tr",null,[t("td",null,"fontSize"),t("td",null,"number"),t("td",null,"14")],-1),b=t("td",null,"fontFamily",-1),m=t("td",null,"string",-1),p={href:"https://developer.mozilla.org/en-US/docs/Web/CSS/font-family",target:"_blank",rel:"noopener noreferrer"},_=t("tr",null,[t("td",null,"lineHeight"),t("td",null,"number / string"),t("td",null,"'1.4em'")],-1),f=t("tr",null,[t("td",null,"textAlign"),t("td",null,"left, center, right"),t("td",null,"left")],-1),g=t("tr",null,[t("td",null,"verticalAlign"),t("td",null,"top, middle, bottom"),t("td",null,"top")],-1),x=t("tr",null,[t("td",null,"color"),t("td",null,"string"),t("td",null,"#000000")],-1),v=t("tr",null,[t("td",null,"backgroundColor"),t("td",null,"string"),t("td",null,"transparent")],-1),w=t("tr",null,[t("td",null,"textOverflow"),t("td",null,"ellipsis, clip"),t("td",null,"默认为空，出于性能考虑，只有显式指定textOverflow属性的时候才会对文字进行截断处理")],-1),y=t("tr",null,[t("td",null,"letterSpacing"),t("td",null,"number"),t("td",null,"默认值为0，只对 bitmaptext 标签生效")],-1),S=e('<h2 id="容器" tabindex="-1"><a class="header-anchor" href="#容器" aria-hidden="true">#</a> 容器</h2><p>支持的标签：<code>view</code>、<code>scrollview</code>、<code>image</code>、<code>text</code>、<code>bitmaptext</code>、<code>canvas</code></p><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>backgroundColor</td><td>string</td><td></td><td>背景的颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色</td></tr></tbody></table><h2 id="边框" tabindex="-1"><a class="header-anchor" href="#边框" aria-hidden="true">#</a> 边框</h2><p>支持的标签：<code>view</code>、<code>scrollview</code>、<code>image</code>、<code>text</code>、<code>bitmaptext</code>、<code>canvas</code></p><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>borderRadius</td><td>number</td><td></td><td>边框圆角</td></tr><tr><td>borderColor</td><td>string</td><td></td><td>边框颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色</td></tr></tbody></table>',6);function k(C,B){const r=l("ExternalLinkIcon");return o(),a("div",null,[h,t("table",null,[s,t("tbody",null,[u,t("tr",null,[b,m,t("td",null,[d("无默认值，规则对齐 CSS 的font-family，详情可见"),t("a",p,[d("font-family"),i(r)]),d("，参考值如 'Georgia, serif'")])]),_,f,g,x,v,w,y])]),S])}const N=n(c,[["render",k],["__file","style.html.vue"]]);export{N as default};