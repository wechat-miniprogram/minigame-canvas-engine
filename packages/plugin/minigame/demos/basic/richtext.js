var RichText = require('../lib/richtext');

module.exports = function richtext(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  Layout.use(RichText.default || RichText);

  const info = wx.getSystemInfoSync();
  const safeArea = info.safeArea || { top: 0 };
  const statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  const PADDING = 60;
  const contentW = W - PADDING * 2;
  const contentH = H - statusBarH - PADDING * 2;

  const tpl = `
    <view class="wrapper">
      <view class="statusBar"></view>
      <view class="container" id="main">
        <scrollview id="richcontainer" scrollY="true">
          <richtext id="rich"></richtext>
        </scrollview>
      </view>
    </view>
  `;

  const style = {
    wrapper: {
      width: W,
      height: H,
      backgroundColor: '#f3f3f3',
    },
    statusBar: {
      width: W,
      height: statusBarH,
    },
    container: {
      width: W,
      height: H - statusBarH,
      padding: PADDING,
    },
    richcontainer: {
      width: contentW,
      height: contentH,
    },
    rich: {
      width: contentW,
      height: contentH,
      fontSize: 40,
      lineHeight: 50,
      color: '#000000',
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  const rich = Layout.getElementsById('rich')[0];

  rich.text = `
    <p>这是一段富文本测试</p>
    <br>
    <strong>这是一段加粗的标题</strong>
    <p>这里展示了<strong>嵌套</strong>的标签</p>
    <br>
    <p>前面是一个换行</p>
    <p>文字可以自定义<span style="color: red">颜色</span>
    <p>也可以自定义<span style="font-size: 35px">字体大小</span>
    <p>文字可以支持<span style="font-style: italic;color: red;">斜体</span></p>
    <br>
    <p style="font-weight: 300">样式可以<span style="color: blue">继承</span>，也可以<span style="font-weight: bold">自定义</span>，这段很长的文字会自动换行，富文本组件都会自动处理好</p>
    <p style="text-align: center">这是一段居中的文本</p>
    <p>这是一段富文本测试</p>
  `;
};
