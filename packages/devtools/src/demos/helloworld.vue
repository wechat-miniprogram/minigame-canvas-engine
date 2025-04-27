<script lang="ts">
import { defineComponent } from "vue";

let tpl = `
  <view id="container">
    <text id="testText" class="redText" value="Hello World"></text>
  </view>
`;

// console.log(JSON.stringify(parser.html2json(template)))
let style = {
  container: {
    width: 400,
    height: 200,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  testText: {
    color: "black",
    width: "100%",
    height: "100%",
    lineHeight: 200,
    fontSize: 40,
    textAlign: "center",
  },
  // 文字的最终颜色为#ff0000
  redText: {
    color: "#ff0000",
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
      let canvas = document.getElementById("helloworld") as HTMLCanvasElement;
      let context = canvas.getContext("2d");
      document.body.append(canvas);

      // 设置canvas的尺寸和样式的container比例一致
      canvas.style.width = 400 + "px";
      canvas.style.height = 200 + "px";
      canvas.width = 400;
      canvas.height = 200;
      Layout.updateViewPort(canvas.getBoundingClientRect());

      Layout.layout(context);

      let testText = Layout.getElementById('testText');

      testText.style.backgroundColor = '#f3f3f3'

      testText.on('click', () => {
        if (testText.classList.contains('redText')) {
          testText.classList.remove('redText')
        } else {
          testText.classList.add('redText')
        }
      })
    },
  },
});
</script>
<template>
  <canvas id="helloworld"></canvas>
</template>
