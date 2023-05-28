import { template } from 'dot';
import install from 'minigame-canvas-engine-richtext'

function main() {
  let tpl = `
    <view class="container" id="main">
     <scrollview class="richcontainer" scrollY="true" >
       <richtext id="rich"></richtext>
    </scrollview>
  </view>
  `

  let style = {
    container: {
      width: 600,
      height: 600,
      padding: 50,
      borderRadius: 12,
      backgroundColor: '#f3f3f3',
    },

    richcontainer: {
      width: 500,
      height: 500,
    },

    rich: {
      width: 500,
      height: 500,
      fontSize: 30,
      lineHeight: 36,
    }
  }

  // @ts-ignore
  const Layout = (window as any).Layout;

  const RichText = install(Layout.Element);
  Layout.registerComponent('richtext', RichText);

  Layout.init(template(tpl)({}), style);

  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  document.body.append(canvas)

  // 设置canvas的尺寸和样式的container比例一致
  canvas.style.width = 1410 / 2 + 'px';
  canvas.style.height = 960 / 2 + 'px';
  canvas.width = 1410;
  canvas.height = 960;

  Layout.updateViewPort(canvas.getBoundingClientRect());

  Layout.layout(context);

  const rich = Layout.getElementsById('rich')[0]

  rich.text = `
  <p>这是一段副文本测试</p>
  <br>
  <strong>这是一段加粗的标题</strong>
  <p>这里展示了<strong>嵌套</strong>的标签</p>
  <br>
  <p>前面是一个换行</p>
  <p>文字可以自定义<span style="color: red">颜色</span>
  <p>也可以自定义<span style="font-size: 25px">字体大小</span>
  <p>文字可以支持<span style="font-style: italic;color: red;">斜体</span></p>
  <br>
  <p style="font-weight: 300">样式可以<span style="color: blue">继承</span>，也可以<span style="font-weight: bold">自定义</span>，这段很长的文字会自动换行，富文本组件都会自动处理好</p>`
}

main();
