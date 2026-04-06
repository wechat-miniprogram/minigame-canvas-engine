module.exports = function text(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  // 刘海屏安全区域
  const info = wx.getSystemInfoSync();
  const safeArea = info.safeArea || { top: 0 };
  const statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  const tpl = `
    <view id="wrapper">
      <view class="statusBar"></view>
      <scrollview id="container" scrollY="true">
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
        <text class="text textOverflowText" value="很长很长很长的文本可以设置截断方式，比如这段文字超出屏幕，但是会省略号展示"></text>
        <text class="text textMiddle" value="设置了文本宽度，文本会根据宽度自动换行，有时候换行的文本也想要垂直居中，可以通过设置高度和verticalAlign来实现"></text>
        <text class="text" value="如果是一个很长的英文单词，默认是不会截断的，比如 supercalifragilisticexpialidocious 可以发现第一行放不下他就会换行"></text>
        <text class="text textBreakAll" value="如果你想忽略英文的排版规则，比如 supercalifragilisticexpialidocious 第一行放不下他也会强行换行"></text>
        <text class="text textStroke" value="文字可以描边，一定程度上就不需要BitMapText"></text>
        <text class="text textShadow" value="文字可以设置阴影效果，一定程度上也不需要BitMapText"></text>
      </scrollview>
    </view>
  `;

  const style = {
    wrapper: {
      width: W,
      height: H,
      backgroundColor: '#ffffff',
    },
    statusBar: {
      width: W,
      height: statusBarH,
    },
    container: {
      width: W,
      height: H - statusBarH,
      backgroundColor: '#ffffff',
    },
    text: {
      width: '100%',
      fontSize: 40,
      marginTop: 40,
      paddingLeft: 20,
      paddingRight: 20,
    },
    textBox: {
      width: '100%',
      height: 100,
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    wegoing: {
      width: 100,
      height: 100,
    },
    lineHeightText: {
      lineHeight: 120,
      verticalAlign: 'middle',
    },
    fontSizeText: {
      fontSize: 50,
    },
    fontFamilyText: {
      fontFamily: 'FangSong',
    },
    textAlignText: {
      textAlign: 'right',
    },
    verticalAlignText: {
      width: W - 120,
      height: 30,
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
      height: 200,
      verticalAlign: 'middle',
    },
    textBreakAll: {
      wordBreak: 'break-all',
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  const texts = Layout.getElementsByClassName('text');
  texts.forEach((t, i) => {
    t.style.backgroundColor = i % 2 === 1 ? '#f8f8f8' : '#f3f3f3';
  });
};
