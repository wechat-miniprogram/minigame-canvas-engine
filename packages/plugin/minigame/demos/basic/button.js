module.exports = function button(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  const info = wx.getSystemInfoSync();
  const safeArea = info.safeArea || { top: 0 };
  const statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  const PADDING = 30;
  const CONTENT_W = W - PADDING * 2;

  const tpl = `
    <view id="wrapper">
      <view class="statusBar"></view>
      <scrollview id="container" scrollY="true">
        <text class="title" value="Button 按钮示例"></text>

        <text class="text" value="默认按钮，自带绿色背景和点击缩放效果"></text>
        <view class="demoBox">
          <button id="defaultBtn" value="默认按钮"></button>
        </view>

        <text class="text" value="自定义样式按钮"></text>
        <view class="demoBox rowBox">
          <button class="primaryBtn" value="主要按钮"></button>
          <button class="dangerBtn" value="危险按钮"></button>
          <button class="disabledBtn" value="禁用按钮"></button>
        </view>

        <text class="text" value="不同尺寸"></text>
        <view class="demoBox">
          <button class="largeBtn" value="大按钮"></button>
          <button class="normalBtn" value="中按钮"></button>
          <button class="smallBtn" value="小按钮"></button>
        </view>

        <text class="text" value="圆角按钮"></text>
        <view class="demoBox rowBox">
          <button class="roundBtn" value="圆角"></button>
          <button class="pillBtn" value="胶囊按钮"></button>
        </view>

        <text class="text" value="带边框的按钮"></text>
        <view class="demoBox rowBox">
          <button class="outlineBtn1" value="蓝色描边"></button>
          <button class="outlineBtn2" value="橙色描边"></button>
        </view>

        <text class="text" value="点击按钮看看效果"></text>
        <view class="demoBox">
          <button id="counterBtn" class="primaryBtn" value="点击次数: 0"></button>
        </view>
        <text id="counterHint" class="hint" value="试试点击上面的按钮"></text>
      </scrollview>
    </view>
  `;

  const style = {
    wrapper: {
      width: W,
      height: H,
      backgroundColor: '#f7f7f7',
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
    title: {
      width: '100%',
      height: 100,
      fontSize: 48,
      lineHeight: 100,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    text: {
      width: '100%',
      fontSize: 36,
      marginTop: 30,
      color: '#333333',
    },
    hint: {
      width: '100%',
      fontSize: 30,
      color: '#999999',
      marginTop: 8,
    },
    demoBox: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 20,
      marginTop: 12,
      alignItems: 'center',
    },
    rowBox: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },

    // 自定义样式按钮
    primaryBtn: {
      width: 260,
      height: 80,
      lineHeight: 80,
      fontSize: 34,
      borderRadius: 12,
      backgroundColor: '#4FC3F7',
      color: '#ffffff',
      textAlign: 'center',
    },
    dangerBtn: {
      width: 260,
      height: 80,
      lineHeight: 80,
      fontSize: 34,
      borderRadius: 12,
      backgroundColor: '#E57373',
      color: '#ffffff',
      textAlign: 'center',
    },
    disabledBtn: {
      width: 260,
      height: 80,
      lineHeight: 80,
      fontSize: 34,
      borderRadius: 12,
      backgroundColor: '#cccccc',
      color: '#ffffff',
      textAlign: 'center',
    },

    // 不同尺寸
    largeBtn: {
      width: CONTENT_W - 40,
      height: 100,
      lineHeight: 100,
      fontSize: 40,
      borderRadius: 14,
      backgroundColor: '#4FC3F7',
      color: '#ffffff',
      textAlign: 'center',
    },
    normalBtn: {
      width: 300,
      height: 80,
      lineHeight: 80,
      fontSize: 34,
      borderRadius: 12,
      backgroundColor: '#4FC3F7',
      color: '#ffffff',
      textAlign: 'center',
      marginTop: 16,
    },
    smallBtn: {
      width: 180,
      height: 60,
      lineHeight: 60,
      fontSize: 28,
      borderRadius: 10,
      backgroundColor: '#4FC3F7',
      color: '#ffffff',
      textAlign: 'center',
      marginTop: 16,
    },

    // 圆角
    roundBtn: {
      width: 200,
      height: 80,
      lineHeight: 80,
      fontSize: 34,
      borderRadius: 40,
      backgroundColor: '#81C784',
      color: '#ffffff',
      textAlign: 'center',
    },
    pillBtn: {
      width: 300,
      height: 80,
      lineHeight: 80,
      fontSize: 34,
      borderRadius: 40,
      backgroundColor: '#BA68C8',
      color: '#ffffff',
      textAlign: 'center',
    },

    // 描边按钮
    outlineBtn1: {
      width: 260,
      height: 80,
      lineHeight: 80,
      fontSize: 34,
      borderRadius: 12,
      borderWidth: 3,
      borderColor: '#4FC3F7',
      color: '#4FC3F7',
      textAlign: 'center',
      backgroundColor: '#ffffff',
    },
    outlineBtn2: {
      width: 260,
      height: 80,
      lineHeight: 80,
      fontSize: 34,
      borderRadius: 12,
      borderWidth: 3,
      borderColor: '#FF8A65',
      color: '#FF8A65',
      textAlign: 'center',
      backgroundColor: '#ffffff',
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  // 计数按钮交互
  const counterBtn = Layout.getElementById('counterBtn');
  const counterHint = Layout.getElementById('counterHint');
  let count = 0;
  counterBtn.on('click', () => {
    count++;
    counterBtn.value = '点击次数: ' + count;
    counterHint.value = '已点击 ' + count + ' 次！';
  });
};
