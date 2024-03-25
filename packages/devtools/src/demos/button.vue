<script lang="ts">
import { defineComponent } from "vue";
// import { template } from "dot";

// <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" id="wegoing"></image>

let template = `
  <view id="container">
    <button id="testButton" value="邀请"></button>
  </view>
`;

// console.log(JSON.stringify(parser.html2json(template)))
let style = {
  container: {
    width: 800,
    height: 400,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },

  testButton: {
  }
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
      Layout.init(template, style);

      let canvas = document.getElementById("button") as HTMLCanvasElement;
      let context = canvas.getContext("2d");

      // 设置canvas的尺寸和样式的container比例一致
      canvas.style.width = 400 + "px";
      canvas.style.height = 200 + "px";
      canvas.width = 800;
      canvas.height = 400;

      Layout.updateViewPort(canvas.getBoundingClientRect());

      Layout.layout(context);

      const testButton = Layout.getElementById('testButton');

    },
  },
});
</script>
<template>
  <canvas id="button"></canvas>
</template>
