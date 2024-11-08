<script lang="ts">
import { defineComponent } from 'vue';

const renderRect = {
  width: 400,
  height: 600,
};
const template = `
    <view class="container">
      
      <scrollview class="scrollView" scrollY="true">
      <text class="loading" value="加载中..."></text>
      </scrollview>
    </view>`;

const style = {
  container: {
    left: 0,
    top: 0,
    width: renderRect.width,
    height: renderRect.height,
    backgroundColor: '#fff',
  },
  scrollView: {
    left: 0,
    top: 0,
    width: renderRect.width,
    height: renderRect.height,
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: renderRect.height / 3 - 20,
    fontSize: 28,
    width: renderRect.width,
    lineHeight: 40,
    color: 'rgba(0,0,0,0.9)',
    textAlign: 'center',
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
      let canvas = document.getElementById("insertElement") as HTMLCanvasElement;
      let context = canvas.getContext("2d");
      canvas.style.width = 400 / 2 + 'px';
      canvas.style.height = 600 / 2 + 'px';
      canvas.width = 400;
      canvas.height = 600;

      const Layout = (window as any).Layout;
      Layout.updateViewPort(canvas.getBoundingClientRect());
      Layout.init(template, style);

      Layout.layout(context);
      setTimeout(() => {
        this.addList();
      }, 1000);
    },
    addList() {
      const Layout = (window as any).Layout;
      let template = ``;
      const data = [
        {
          openId: '1',
          avatarUrl:
            'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg',
          nickName: 'zim',
        },
        {
          openId: '2',
          avatarUrl:
            'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg',
          nickName: '折面',
        },
        {
          openId: '3',
          avatarUrl:
            'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg',
          nickName: 'zim',
        },
        {
          openId: '4',
          avatarUrl:
            'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg',
          nickName: '折面',
        },
        {
          openId: '5',
          avatarUrl:
            'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg',
          nickName: 'zim',
        },
        {
          openId: '6',
          avatarUrl:
            'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg',
          nickName: '折面',
        },
      ]; // data 数据需要自行填写
      data.forEach((user) => {
        template += `
            <view class="item ${user.openId}">
              <image src="${user.avatarUrl}" class="avatar"></image>
              <text class="name" value="${user.nickName}"></text>
            </view>
          `;
      });
      const style = {
        item: {
          flexDirection: 'row',
          padding: 32,
          alignItems: 'center',
        },
        avatar: {
          width: 48,
          height: 48,
          borderRadius: 8,
        },
        name: {
          color: 'rgba(0,0,0,0.9)',
          fontSize: 32,
          marginLeft: 16,
          width: 240,
          textOverflow: 'ellipsis',
        },
      };
      const loading = Layout.getElementsByClassName('loading')[0];
      loading?.remove();
      const scrollView = Layout.getElementsByClassName('scrollView')[0];
      // Layout.insertElement(template, style, scrollView);
      console.warn('scrollView', scrollView);
    },
  },
});
</script>
<template>
  <canvas id="insertElement"></canvas>
</template>
