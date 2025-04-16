<script lang="ts">
import { defineComponent } from "vue";
import { template } from "dot";
let tpl = `
<scrollview id="container" scrollY = "true">
    <text class="text lineHeightText" value="文本可以指定行高实现垂直居中"></text>
  
    <text class="text fontSizeText" value="文本可以指定字体大小"></text>
  
    <text class="text fontFamilyText" value="文本可以指定字体，比如这是仿宋体"></text>
  
    <text class="text textAlignText" value="文本可以指定横向对齐方式，比如右对齐"></text>
  
    <view class="textBox">
      <text class="text verticalAlignText" value="文本可以指定纵向对齐方式，比如底部对齐"></text>
      <image src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg" class="wegoing"></image>
    </view>
    <text class="text colorText" value="文本可以设置颜色"></text>
  
    <text class="text textOverflowText" value="很长很长很长的文本可以设置截断方式，比如这段文字超出屏幕，但是会省略号展示"></text>

    <text class="text textStroke" value="文字可以描边，一定程度上就不需要BitMapText"></text>

    <text class="text textShadow" value="文字可以设置阴影效果，一定程度上也不需要BitMapText"></text>

    <text class="text normalWrap" value="这是一段很长的文本，在设置了文字宽度的时候会自动换行，这是为了测试文本的自动换行效果，可以看到文本会在容器宽度位置自动换行显示"></text>

    <text class="text normalWrap" value="- 这是一段很长的文本，在设置示设 -"></text>

    <text class="text normalWrap" value="如果使用了emoji表情，建议谨慎使用，因为emoji表情的处理非常复杂，请留意会不会有emoji表情被截断的情况😊😊😊😊😊😊😊😊😊😊"></text>

    <text class="text preWrap" value="这是一段保留空格和换行的文本，     前面有很多空格
    还可以换行，  空格也会保留"></text>

    <text class="text breakAll" value="ThisIsAVeryLongWordThatShouldBreakIntoMultipleLines"></text>

    <text class="text breakWord" value="https://this-is-a-very-long-url-that-should-break-into-multiple-lines.com"></text>

     <text class="text breakWordLines" value="This is Very long word that should break into multiple lines"></text>
  </scrollview>
  `;

let style = {
  container: {
    width: 800,
    height: 1500,
    backgroundColor: '#f3f3f3',
  },
  text: {
    width: '100%',
    height: 50,
    fontSize: 24,
    marginTop: 20,
  },
  textBox: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  wegoing: {
    width: 50,
    height: 50,
  },
  lineHeightText: {
    height: 100,
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
    width: 460,
    height: 24,
    marginTop: 0,
    verticalAlign: 'bottom',
  },
  colorText: {
    color: 'red',
  },
  textOverflowText: {
    textOverflow: 'ellipsis',
  },
  textStroke: {
    textStrokeWidth: 1,
    textStrokeColor: 'red',
  },
  textShadow: {
    textShadow: '1px 1px 2px blue',
  },
  normalWrap: {
    width: 400,
    whiteSpace: 'normal',
    height: 200,
  },
  preWrap: {
    width: 400,
    whiteSpace: 'pre-wrap',
    backgroundColor:'#ffffff',
    height: 100,
    textAlign: 'center'
  },
  breakAll: {
    width: 400,
    wordBreak: 'break-all',
    height: 80,
  },
  breakWord: {
    width: 400,
    overflowWrap: 'break-word',
    height: 80,
  },

  breakWordLines: {
    width: 400,
    height: 80,
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

      console.log('texts', texts)
      texts.forEach((text, index) => {
        if (index % 2 === 1) {
          text.style.backgroundColor = '#ffffff' 
        }
      })
    },
  },
});
</script>
<template>
  <canvas id="text"></canvas>
</template>
