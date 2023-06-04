<script lang="ts">
import { defineComponent } from "vue";
import { template } from "dot";

let tpl = `
<view id="container">
    <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
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
  wegoing: {
    width: 200,
    height: 200,
    borderRadius: 100,
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
    },
  },
});
</script>
<template>
  <canvas id="image"></canvas>
</template>
