<script lang="ts">
import { defineComponent } from "vue";
import { template } from "dot";

let tpl = `<view id="container">
    <canvas id="rank" width="960" height="1410"></canvas>
    <text id="rankText" value="打开排行榜"></text>
  </view>
`;

let style = {
  container: {
    width: 800,
    height: 1500,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    color: "#ffffff",
    backgroundColor: "#34a123",
    borderRadius: 10,
    width: 400,
    height: 100,
    lineHeight: 100,
    fontSize: 40,
    textAlign: "center",
    marginTop: 20,
  },

  rank: {
    width: 600,
    height: 800,
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
      Layout.init(template(tpl)({}), style);

      let canvas = document.getElementById("canvas") as HTMLCanvasElement;
      let context = canvas.getContext("2d");

      const container = Layout.getElementsById("container")[0];
      // 设置canvas的尺寸和样式的container比例一致
      canvas.style.width = container.style.width / 3 + "px";
      canvas.style.height = container.style.height / 3 + "px";
      canvas.width = container.style.width;
      canvas.height = container.style.height;

      Layout.updateViewPort(canvas.getBoundingClientRect());

      Layout.layout(context);

      const testText = Layout.getElementsById("rankText")[0];

      // 手动创建canvas并绑定到 rank 组件
      const rank = Layout.getElementsById("rank")[0];
      const rankCanvas = document.createElement("canvas");
      const rankContext = rankCanvas.getContext("2d");
      rankCanvas.width = rank.style.width;
      rankCanvas.height = rank.style.height;
      rank.canvas = rankCanvas;

      // 这里实现canvas的loop逻辑
      const updateRank = () => {
        rankContext.clearRect(0, 0, rank.style.width, rank.style.height);
        rankContext.fillStyle = "blue";
        rankContext.fillRect(0, 0, rank.style.width, rank.style.height);

        rank.update();
      };

      const closeRank = () => {
        rankContext.clearRect(0, 0, rank.style.width, rank.style.height);
      };

      testText.on("click", () => {
        if (testText.value === "打开排行榜") {
          testText.value = "关闭排行榜";

          // 要求Layout每帧刷新开放数据域 canvas 的绘制
          Layout.ticker.add(updateRank);
        } else {
          testText.value = "打开排行榜";
          closeRank();
          Layout.ticker.remove(updateRank);
        }
      });
    },
  },
});
</script>
<template>
  <canvas id="canvas"></canvas>
</template>
