<script lang="ts">
import { defineComponent } from "vue";
import { template } from "dot";
import * as TWEEN from "@tweenjs/tween.js";

let tpl = `<view id="container">
  <view class="ball"></view>
</view>`;

let style = {
  container: {
    width: 300,
    height: 300,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
  },
  ball: {
    backgroundColor: "blue",
    width: 50,
    height: 50,
    borderRadius: 25,
    top: 0,
  },

  bigBall: {
    backgroundColor: 'red',
    width: 100,
    height: 100,
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
      Layout.init(template(tpl)({}), style);

      let canvas = document.getElementById("tween") as HTMLCanvasElement;
      let context = canvas.getContext("2d");

      // 设置canvas的尺寸和样式的container比例一致
      canvas.style.width = 300 + "px";
      canvas.style.height = 300 + "px";
      canvas.width = 300;
      canvas.height = 300;

      Layout.updateViewPort(canvas.getBoundingClientRect());
      Layout.layout(context);

      const ball = Layout.getElementsByClassName("ball")[0];

      ball.on('click', () => {
        if (ball.classList.contains('bigBall')) {
          ball.classList.remove('bigBall')
        } else {
          ball.classList.add('bigBall')
        }
      })

      // 将缓动系统的 update 逻辑加入 Layout 的帧循环
      Layout.ticker.add(() => {
        TWEEN.update();
      });

      new TWEEN.Tween(ball.style)
        .to({ top: 250 }, 5000)
        .easing(TWEEN.Easing.Bounce.Out)
        .yoyo(true)
        .repeat(Infinity)
        .start();
    },
  },
});
</script>
<template>
  <canvas id="tween"></canvas>
</template>
