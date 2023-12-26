<script lang="ts">
import { defineComponent } from "vue";
import { template } from "dot";
let tpl = `
    <scrollview class="container" id="main" scrollY="true">
      <view class="item">
        <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
        <text id="text" class="testtext" value="abcdefgABCDEFG"></text>
      </view>
      <view class="item">
        <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
        <text id="text" class="testtext" value="测试文本"></text>
      </view>
      <view class="item">
        <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
        <text id="text" class="testtext" value="测试文本"></text>
      </view>
      <view class="item">
        <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
        <text id="text" class="testtext" value="测试文本"></text>
      </view>
      <view class="item">
        <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
        <text id="text" class="testtext" value="测试文本"></text>
      </view>
      <view class="item">
        <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
        <text id="text" class="testtext" value="测试文本"></text>
      </view>
      <view class="item">
        <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
        <text id="text" class="testtext" value="测试文本"></text>
      </view>
      <view class="item">
        <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
        <text id="text" class="testtext" value="测试文本"></text>
      </view>
      <view class="item">
        <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
        <text id="text" class="testtext" value="测试文本"></text>
      </view>
      <view class="item">
        <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
        <text id="text" class="testtext" value="测试文本"></text>
      </view>
      
    </scrollview>
  `;

let style = {
  container: {
    width: 600,
    height: 600,
    borderRadius: 12,
    backgroundColor: "#f3f3f3",
  },
  item: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },

  wegoing: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  text: {
    fontSize: 36,
    // height: 36,
  },
  testtext: {
    fontFamily: '"Lucida Console", "Courier New", monospace',
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

      let canvas = document.getElementById("text") as HTMLCanvasElement;
      let context = canvas.getContext("2d");

      // 设置canvas的尺寸和样式的container比例一致
      canvas.style.width = 600 / 2 + "px";
      canvas.style.height = 600 / 2 + "px";
      canvas.width = 600;
      canvas.height = 600;

      Layout.updateViewPort(canvas.getBoundingClientRect());

      Layout.layout(context);

      const text = Layout.getElementsByClassName("testtext");

      text[3].on("click", () => {
        text[3].value = "测试文本加长" + Math.random();
      });
    },
  },
});
</script>
<template>
  <canvas id="text"></canvas>
</template>
