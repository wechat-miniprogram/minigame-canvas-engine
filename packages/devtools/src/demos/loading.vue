<script lang="ts">
import { defineComponent } from "vue";
import { template } from "dot";

let tpl = `
<view id="container">
  <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" id="loading"></image>
</view>
`;

let style = {
  container: {
    width: 400,
    height: 400,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
};

export default defineComponent({
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {
    init() {
      // for devtools debug
      if (process.env.NODE_ENV !== 'production') {
        (window as any).layoutTpl = tpl;
      }
      const Layout = (window as any).Layout;
      Layout.init(tpl, style);

      let canvas = document.getElementById("image") as HTMLCanvasElement;
      let context = canvas.getContext("2d");

      // 设置canvas的尺寸和样式的container比例一致
      canvas.style.width = 400 + "px";
      canvas.style.height = 400 + "px";
      canvas.width = 400;
      canvas.height = 400;

      Layout.updateViewPort(canvas.getBoundingClientRect());

      Layout.layout(context);

      const image = Layout.getElementById('loading');
      let degrees = 0;
      Layout.ticker.add(() => {
        degrees = (degrees + 2) % 360;
        image.style.transform = `rotate(${degrees}deg)`;     
      });
    },
  },
});
</script>
<template>
  <canvas id="image"></canvas>
</template>
