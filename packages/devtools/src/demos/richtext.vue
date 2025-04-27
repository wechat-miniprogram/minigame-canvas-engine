<script lang="ts">
import { defineComponent } from "vue";

import { template } from "dot";
import RichText from "minigame-canvas-engine-richtext";

let tpl = `
    <view class="container" id="main">
     <scrollview id="richcontainer" scrollY="true" >
       <richtext id="rich"></richtext>
    </scrollview>
  </view>
  `;

let style = {
  container: {
    width: 600,
    height: 700,
    padding: 50,
    borderRadius: 12,
    backgroundColor: "#f3f3f3",
  },

  richcontainer: {
    width: 500,
    height: 700,
  },

  rich: {
    width: 500,
    height: 500,
    fontSize: 30,
    lineHeight: 36,
  },
};

export default defineComponent({
  components: {},
  data() {
    return {};
  },
  mounted() {
  },

  methods: {
    init() {
      // for devtools debug
      if (process.env.NODE_ENV !== 'production') {
        (window as any).layoutTpl = tpl;
      }
      const Layout = (window as any).Layout;

      Layout.use(RichText);
      Layout.init(template(tpl)({}), style);

      let canvas = document.getElementById('richtext') as HTMLCanvasElement;
      let context = canvas.getContext('2d');

       // 设置canvas的尺寸和样式的container比例一致
      canvas.style.width = 600 / 2 + 'px';
      canvas.style.height = 700 / 2 + 'px';
      canvas.width = 600;
      canvas.height = 700;

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
      <p style="font-weight: 300">样式可以<span style="color: blue">继承</span>，也可以<span style="font-weight: bold">自定义</span>，这段很长的文字会自动换行，富文本组件都会自动处理好</p>
      <p style="text-align: center">这是一段居中的文本，居中的文本暂不支持内嵌标签</p>
      <p>这是一段副文本测试</p>
  `
    },
  },
});
</script>
<template>
  <canvas id="richtext"></canvas>
</template>
