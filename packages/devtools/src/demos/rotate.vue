<script lang="ts">
import { defineComponent } from "vue";

let template = `
  <view id="container">
    <view id="parent">
      <view id="child">
        
      </view>    
    </view>    
  </view>
`;

// console.log(JSON.stringify(parser.html2json(template)))

let style = {
  container: {
    width: 400,
    height: 400,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
  },
  parent: {
    width: 200,
    height: 200,
    transform: 'rotate(45deg)',
    backgroundColor: "gray",
    // justifyContent: "center",
    // alignItems: "center",
  },
  child: {
    width: 100,
    height: 100,
    backgroundColor: "red",
    transform: 'rotate(45deg)',
    marginTop: 10,
    marginLeft: 10,
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
      // for devtools debug
      if (process.env.NODE_ENV !== 'production') {
        (window as any).layoutTpl = tpl;
      }
      const Layout = (window as any).Layout;
      
      Layout.init(template, style);
      let canvas = document.getElementById("rotate") as HTMLCanvasElement;
      let context = canvas.getContext("2d");
      document.body.append(canvas);

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
  <canvas id="rotate"></canvas>
</template>
