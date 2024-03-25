<script lang="ts">
import { defineComponent } from "vue";
import { template } from "dot";

let tpl = `
  <view id="container">
    <view class="header">
      <text class="title" value="推荐好友"></text>
      <text class="toggleButton" value="换一批"></text>  
    </view>
    <view class="list">
      <view class="listItem">
        <image class="listAvatar" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg"> </image>
          <text class="listNickName" value="zim1"></text>
          <text class="listInviteButton" value="邀请"></text> 
      </view>
      <view class="listItem">
        <image class="listAvatar" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg"></image>
          <text class="listNickName" value="zim2"></text>
          <text class="listInviteButton" value="邀请"></text> 
      </view>
      <view class="listItem">
        <image class="listAvatar" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg"></image>
          <text class="listNickName" value="zim3"></text>
          <text class="listInviteButton" value="邀请"></text> 
      </view>
      <view class="listItem">
        <image class="listAvatar" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg"></image>
          <text class="listNickName" value="zim4"></text>
          <text class="listInviteButton" value="邀请"></text> 
      </view>
    </view>
  </view>
`;

let style = {
  container: {
    width: 800,
    height: 330,
    backgroundColor: "#f3f3f3",
  },
  header: {
    width: "100%",
    height: 100,
  },
  title: {
    width: "100%",
    height: 100,
    lineHeight: 100,
    textAlign: "center",
    fontSize: 30,
  },
  toggleButton: {
    fontSize: 30,
    position: "absolute",
    right: 30,
    top: 0,
    height: 100,
    lineHeight: 100,
  },
  list: {
    flexDirection: "row",
    width: "100%",
  },
  listItem: {
    width: "25%",
    alignItems: "center",
  },
  listAvatar: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  listNickName: {
    fontSize: 30,
    height: 40,
    marginTop: 10,
  },
  listInviteButton: {
    fontSize: 30,
    width: "100%",
    textAlign: "center",
    height: 30,
    ':active': {
      transform: 'scale(1.05, 1.05)',
    }
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
      let canvas = document.getElementById("invite") as HTMLCanvasElement;
      let context = canvas.getContext("2d");

      Layout.init(tpl, style);

      const container = Layout.getElementsById("container")[0];

      // 设置canvas的尺寸和样式的container比例一致
      canvas.style.width = container.style.width / 2 + "px";
      canvas.style.height = container.style.height / 2 + "px";
      canvas.width = container.style.width;
      canvas.height = container.style.height;

      Layout.updateViewPort(canvas.getBoundingClientRect());
      Layout.layout(context);

      const buttons = Layout.getElementsByClassName("listInviteButton");
      buttons.forEach((button) => {
        button.on("click", () => {
          alert("button click");
        });
      });
    },
  },
});
</script>
<template>
  <canvas id="invite"></canvas>
</template>
