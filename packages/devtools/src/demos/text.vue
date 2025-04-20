<script lang="ts">
import { defineComponent } from "vue";
import { template } from "dot";

let tpl2 = `
<scrollview id="container" scrollY = "true">
  <text class="text lineHeightText" value="文本可以指定行高实现垂直居中"></text>
  
  <text class="text fontSizeText" value="文本可以指定字体大小"></text>

  <text class="text fontFamilyText" value="文本可以指定字体，比如这是仿宋体(需要当前系统支持)"></text>

  <text class="text textAlignText" value="文本可以指定横向对齐方式，比如右对齐"></text>

  <view class="textBox">
    <text class="text verticalAlignText" value="文本可以指定纵向对齐方式，比如底部对齐"></text>
    <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
  </view>
  <text class="text colorText" value="文本可以设置颜色"></text>

  <text class="text normalWrap" value="设置了文本宽度，文本会根据宽度自动换行，这在页面宽度有限的场景下非常有用，比如在展示用户昵称的时候，用户昵称可能是很长的"></text>

  <text class="text normalWrap" value="😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊"></text>

  <text class="text textOverflowText" value="很长很长很长的文本可以设置截断方式，比如这段文字超出屏幕，但是会省略号展示"></text>

  <text class="text textMiddle" value="设置了文本宽度，文本会根据宽度自动换行，有时候换行的文本也想要垂直居中，可以通过设置高度和verticalAlign来实现"></text>

  <text class="text" value="如果是一个很长的英文单词，默认是不会截断的，比如 supercalifragilisticexpialidocious 可以发现第一行放不下他就会换行"></text>

  <text class="text textBreakAll" value="如果你想忽略英文的排版规则，比如 supercalifragilisticexpialidocious 第一行放不下他也会强行换行"></text>

  <text class="text textStroke" value="文字可以描边，一定程度上就不需要BitMapText"></text>

  <text class="text textShadow" value="文字可以设置阴影效果，一定程度上也不需要BitMapText"></text>
</scrollview>
  `;

  
let tpl = `
<scrollview id="container" scrollY = "true">
  <text id="test" class="text normalWrap" value="设置了文本宽度，文本会根据宽度自动换行，这在页面宽度有限的场景下非常有用，比如在展示用户昵称的时候，用户昵称可能是很长的"></text> 
</scrollview>
  `;

let style = {
  container: {
    width: 800,
    height: 1500,
  },
  text: {
    width: '100%',
    fontSize: 28,
    marginTop: 35,
  },
  textBox: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  wegoing: {
    width: 80,
    height: 80,
  },
  lineHeightText: {
    lineHeight: 100,
    verticalAlign: 'middle',
  },
  fontSizeText: {
    fontSize: 36,
  },
  fontFamilyText: {
    fontFamily: 'FangSong'
  },
  textAlignText: {
    textAlign: 'right',
  },
  verticalAlignText: {
    width: 600,
    height: 24,
    marginTop: 0,
    verticalAlign: 'bottom',
  },
  colorText: {
    color: 'red',
  },
  textOverflowText: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  textStroke: {
    textStrokeWidth: 1,
    textStrokeColor: 'red',
  },
  textShadow: {
    textShadow: '1px 1px 2px blue',
  },
  textMiddle: {
    height: 150,
    verticalAlign: 'middle',
  },
  textBreakAll: {
    wordBreak: 'break-all',
  },
  normalWrap: {
    whiteSpace: 'pre-wrap',
    width: 100
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
      canvas.style.width = 800 / 2 + "px";
      canvas.style.height = 1500 / 2 + "px";
      canvas.width = 800;
      canvas.height = 1500;

      Layout.updateViewPort(canvas.getBoundingClientRect());

      Layout.layout(context);

      const texts = Layout.getElementsByClassName('text');

      texts.forEach((text, index) => {
        if (index % 2 === 1) {
          text.style.backgroundColor = '#f8f8f8' 
        } else {
          text.style.backgroundColor = '#f3f3f3' 
        }
      })

      const test = Layout.getElementById('test');
      test.value = `这是很长的      文字很长很长   
      3
      
      4
      
      5
      6`
    },
  },
});
</script>
<template>
  <canvas id="text"></canvas>
</template>
